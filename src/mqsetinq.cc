/*
  Copyright (c) IBM Corporation 2023

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  Contributors:
    Mark Taylor   - Initial Contribution
*/

#include "mqi.h"

using namespace Napi;

#define VERB "INQ"
Object INQ(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_INQ_HCONN = 0, IDX_INQ_HOBJ, IDX_INQ_ATTRS };

  MQHCONN hConn;
  MQHOBJ hObj;
  MQLONG CC;
  MQLONG RC;

  MQLONG *mqSelectors = NULL;
  int selector;
  MQLONG charAttrLen = 0;
  MQLONG intAttrCount = 0;
  MQLONG *intAttrValues = NULL;
  char *charAttrs = NULL;
  MQLONG charLen;

  bool badSelector = false;

  Array jsSelectors;

  if (info.Length() < 1 || info.Length() > IDX_INQ_ATTRS + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_INQ_HCONN].As<Number>().Int32Value();
  hObj = info[IDX_INQ_HOBJ].As<Number>().Int32Value();
  jsSelectors = info[IDX_INQ_ATTRS].As<Array>();

  // Allocate an array of the same length as the selectors in case all
  // are requesting MQIA values. Not all of
  // this array may need to be used, but that's OK.
  mqSelectors = (MQLONG *)malloc(jsSelectors.Length() * sizeof(MQLONG));
  intAttrValues = (MQLONG *)malloc(jsSelectors.Length() * sizeof(MQLONG));

  for (unsigned int i = 0; i < jsSelectors.Length(); i++) {
    Value jsSelectorV = jsSelectors[i];
    Object jsSelector = jsSelectorV.As<Object>();
    selector = getMQLong(jsSelector,"selector");
    mqSelectors[i] = selector;
    if (selector >= MQIA_FIRST && selector <= MQIA_LAST) {
      intAttrCount++;
    } else if (selector >= MQCA_FIRST && selector <= MQCA_LAST) {
      charLen = jsSelector.Get("_length").As<Number>().Int32Value();

      if (charLen > 0) {
        charAttrLen += charLen;
      } else {
        badSelector = true;
      }
    } else {
      badSelector = true;
    }
  }

  debugf(LOG_DEBUG, "BadSelector=%d CharAttrLen=%d", badSelector ? 1 : 0, charAttrLen);
  if (!badSelector) {
    if (charAttrLen > 0)
      charAttrs = (char *)malloc(charAttrLen);

    CALLMQI("MQINQ")(hConn, hObj, jsSelectors.Length(), mqSelectors, intAttrCount, intAttrValues, charAttrLen, charAttrs, &CC, &RC);
  } else {
    CC = MQCC_FAILED;
    RC = MQRC_SELECTOR_ERROR;
  }

  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  if (CC != MQCC_FAILED) {
    int intIndex = 0;
    int charIndex = 0;
    int nameCount = 1;
    for (unsigned int i = 0; i < jsSelectors.Length(); i++) {
      Value jsSelectorV = jsSelectors[i];
      Object jsSelector = jsSelectorV.As<Object>();
      selector = mqSelectors[i];
      if (selector >= MQIA_FIRST && selector <= MQIA_LAST) {
        MQLONG v = intAttrValues[intIndex++];
        jsSelector.Set("value", Number::New(env, v));
        if (selector == MQIA_NAME_COUNT) {
          nameCount = v;
        } else {
          nameCount = 1;
        }
      } else if (selector >= MQCA_FIRST && selector <= MQCA_LAST) {
        charLen = getMQLong(jsSelector,"_length");
        if (charLen > 0) {
          jsSelector.Set("value", getMQIString(env, &charAttrs[charIndex], charLen * nameCount));
          charIndex += charLen;
          if (selector == MQCA_INITIAL_KEY) {
            // This is returned as a binary unprintable string. Set it to the same thing as
            // you would get in a PCF INQUIRE command
            jsSelector.Set("value", String::New(env, "********"));
          }
        }
      }
    }
  }
  return result;
}
#undef VERB

#define VERB "SET"
Object SET(const CallbackInfo &info) {

  Env env = info.Env();
  enum { IDX_SET_HCONN = 0, IDX_SET_HOBJ, IDX_SET_ATTRS, IDX_SET_CHARATTR_LEN };

  MQHCONN hConn;
  MQHOBJ hObj;
  MQLONG CC;
  MQLONG RC;

  MQLONG *mqSelectors = NULL;
  int selector;
  MQLONG charAttrLen = 0;
  MQLONG intAttrCount = 0;
  MQLONG *intAttrValues = NULL;
  char *charAttrs = NULL;
  MQLONG charLen;
  int offset = 0;
  bool badSelector = false;

  Array jsSelectors;

  if (info.Length() < 1 || info.Length() > IDX_SET_CHARATTR_LEN + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  hConn = info[IDX_SET_HCONN].As<Number>().Int32Value();
  hObj = info[IDX_SET_HOBJ].As<Number>().Int32Value();
  jsSelectors = info[IDX_SET_ATTRS].As<Array>();
  charAttrLen = info[IDX_SET_CHARATTR_LEN].As<Number>().Int32Value();

  // Allocate an array of the same length as the selectors in case all
  // are requesting MQIA values. Not all of
  // this array may need to be used, but that's OK.
  mqSelectors = (MQLONG *)malloc(jsSelectors.Length() * sizeof(MQLONG));
  intAttrValues = (MQLONG *)malloc(jsSelectors.Length() * sizeof(MQLONG));
  charAttrs = (char *)malloc(charAttrLen);
  memset(charAttrs, ' ', charAttrLen);

  for (unsigned int i = 0; i < jsSelectors.Length(); i++) {
    Value jsSelectorV = jsSelectors[i];
    Object jsSelector = jsSelectorV.As<Object>();
    selector = getMQLong(jsSelector,"selector");
    debugf(LOG_DEBUG, "Selector %d - %d", i, selector);
    dumpObject(env, "MQAttr", jsSelector);
    mqSelectors[i] = selector;
    if (selector >= MQIA_FIRST && selector <= MQIA_LAST) {
      intAttrValues[intAttrCount++] = getMQLong(jsSelector,"value");
    } else if (selector >= MQCA_FIRST && selector <= MQCA_LAST) {
      charLen = getMQLong(jsSelector,"_length");
      debugf(LOG_DEBUG, "    Len: %d", charLen);
      memcpy(&charAttrs[offset], jsSelector.Get("value").As<String>().Utf8Value().c_str(), charLen);
      offset += charLen;
    } else {
      badSelector = true;
    }
  }

  if (!badSelector) {
    debugf(LOG_DEBUG, "BadSelector=%d CharAttrLen=%d", badSelector ? 1 : 0, charAttrLen);
    CALLMQI("MQSET")(hConn, hObj, jsSelectors.Length(), mqSelectors, intAttrCount, intAttrValues, charAttrLen, charAttrs, &CC, &RC);
  } else {
    CC = MQCC_FAILED;
    RC = MQRC_SELECTOR_ERROR;
  }

  Object result = Object::New(env);
  result.Set("jsCc", Number::New(env, CC));
  result.Set("jsRc", Number::New(env, RC));

  return result;
}
#undef VERB