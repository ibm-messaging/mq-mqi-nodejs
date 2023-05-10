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

static void cleanupCNO(PMQCNO pCno) {
  if (pCno) {
    cleanupCSP(pCno->SecurityParmsPtr);
    cleanupBNO(pCno->BalanceParmsPtr);
    cleanupSCO(pCno->SSLConfigPtr);
    cleanupCD((PMQCD)pCno->ClientConnPtr);

    if (pCno->CCDTUrlPtr) {
      mqFreeString(pCno->CCDTUrlPtr);
    }
  }
}

class ConnxWorker : public Napi::AsyncWorker {
public:
  ConnxWorker(Function &callback, const CallbackInfo &info) : AsyncWorker(callback) {
    debugf(LOG_OBJECT, "In CONNX constructor. Number of parameters = %d \n", (int)info.Length());
  }

  ~ConnxWorker() { debugf(LOG_OBJECT, "In CONNX destructor\n"); }

  void Execute() {
    debugf(LOG_TRACE, "About to call MQCONNX\n");
    CALLMQI("MQCONNX")(qmName, pCno, &hConn, &CC, &RC);
  }

  void OnOK() {
    debugf(LOG_TRACE, "In CONNX OnOK method\n");

    Object result = Object::New(Env());
    result.Set("jsCc", Number::New(Env(), CC));
    result.Set("jsRc", Number::New(Env(), RC));
    result.Set("jsHConn", Number::New(Env(), hConn));

    // do any copyback of other parameters
    if (cno.SSLConfigPtr != NULL && !jssco.IsEmpty()) {
      copySCOfromC(Env(), jssco, cno.SSLConfigPtr);
    }
    if (cno.ClientConnPtr != NULL && !jscd.IsEmpty()) {
      copyCDfromC(Env(), jscd, (PMQCD)cno.ClientConnPtr);
    }
    // CSP and BNO do not need any copying

    // Do any free() calls to stop leakage
    cleanupCNO(pCno);

    Callback().Call({result});
  }

public:
  char qmName[MQ_Q_MGR_NAME_LENGTH + 1] = {0};
  MQHCONN hConn = -1;
  MQLONG CC = -1;
  MQLONG RC = -1;
  PMQCNO pCno = NULL;

  ObjectReference jscnoRef;

  Object jscd;
  Object jscno;
  Object jssco;
  Object jsbno;
  Object jscsp;

  MQCNO cno = {MQCNO_DEFAULT};
  MQCSP csp = {MQCSP_DEFAULT};
  MQBNO bno = {MQBNO_DEFAULT};
  MQSCO sco = {MQSCO_DEFAULT};
  MQCD cd = {MQCD_CLIENT_CONN_DEFAULT};
};

#define VERB "CONNX"

Object CONNX(const CallbackInfo &info) {

  enum { IDX_CONNX_QMNAME = 0, IDX_CONNX_CNO, IDX_CONNX_CALLBACK };

  bool async = false;
  Function cb;
  Env env = info.Env();
  Object result = Object::New(env);

  if (info.Length() < 1 || info.Length() > IDX_CONNX_CALLBACK + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  if (info.Length() > IDX_CONNX_CALLBACK) {
    cb = info[IDX_CONNX_CALLBACK].As<Function>();
    async = true;
  } else {
    cb = config.noopFnRef.Value().As<Function>();
  }
  ConnxWorker *w = new ConnxWorker(cb, info);

  Value qmName = info[IDX_CONNX_QMNAME];
  if (!qmName.IsNull() && !qmName.IsString()) {
    throwTE(env, VERB, "Wrong argument type for QMgrName");
  } else {
    if (qmName.IsNull() || strlen(qmName.As<String>().Utf8Value().c_str()) == 0) {
      strncpy(w->qmName, "", MQ_Q_MGR_NAME_LENGTH);
    } else {
      strncpy(w->qmName, qmName.As<String>().Utf8Value().c_str(), MQ_Q_MGR_NAME_LENGTH);
    }
  }

  Value v = info[IDX_CONNX_CNO];
  if (v.IsObject()) {
    //dumpObject(env, "MQCNO", v.As<Object>());
  } else {
    //debugf(LOG_OBJECT,"CNO is not an object");
  }  
  if (v.IsObject()) {
    w->jscno = v.As<Object>();
    if (!w->jscno.IsNull()) {
      w->pCno = &w->cno;
      w->cno.Options = getMQLong(w->jscno,"Options");

      v = w->jscno.Get("ClientConn");
      if (v.IsObject()) {
        //dumpObject(env, "MQCD", v.As<Object>());
      } else {
        //debugf(LOG_OBJECT,"CD is not an object - isempty? %s. Type:%d [%s]", v.IsEmpty()?"true":"false", v.Type(), napiType(v.Type()));
      }  
      if (v.IsObject()) {
        w->jscd = v.As<Object>();
        w->cno.ClientConnPtr = &w->cd;
        copyCDtoC(env, w->jscd, &w->cd);
        if (w->cno.Version < 2) {
          w->cno.Version = 2;
        }
      }

      v = w->jscno.Get("SSLConfig");
      if (v.IsObject()) {
        w->jssco = v.As<Object>();
        w->cno.SSLConfigPtr = &w->sco;
        copySCOtoC(env, w->jssco, &w->sco);
        if (w->cno.Version < 4) {
          w->cno.Version = 4;
        }
      }

      v = w->jscno.Get("SecurityParms"); 
      if (v.IsObject()) {
        w->jscsp = v.As<Object>();
        w->cno.SecurityParmsPtr = &w->csp;
        copyCSPtoC(env, w->jscsp, &w->csp);
        if (w->cno.Version < 5) {
          w->cno.Version = 5;
        }
      }

      v = w->jscno.Get("CCDTUrl");
      if (v.IsString()) {
        w->cno.CCDTUrlPtr = strdup(w->jscno.Get("CCDTUrl").As<String>().Utf8Value().c_str());
        w->cno.CCDTUrlOffset = 0;
        w->cno.CCDTUrlLength = strlen(w->cno.CCDTUrlPtr);
        if (w->cno.Version < 6) {
          w->cno.Version = 6;
        }
      }

      v = w->jscno.Get("ApplName");
      if (v.IsString()) {
        setMQIString(env, w->cno.ApplName, w->jscno, "ApplName", MQ_APPL_NAME_LENGTH);
        if (w->cno.Version < 7) {
          w->cno.Version = 7;
        }
      }


      v = w->jscno.Get("BalanceParms");
      if (v.IsObject()) {
        w->jsbno = v.As<Object>();
        w->cno.BalanceParmsPtr = &w->bno;
        copyBNOtoC(env, w->jsbno, &w->bno);
        if (w->cno.Version < 8) {
          w->cno.Version = 8;
        }
      }
    }
  }

  if (async) {
    w->jscnoRef = Persistent(w->jscno); // Other objects are hung off this one, so should not need additional references

    w->Queue();
  } else {
    CALLMQI("MQCONNX")(w->qmName, w->pCno, &w->hConn, &w->CC, &w->RC);

    result.Set("jsCc", Number::New(env, w->CC));
    result.Set("jsRc", Number::New(env, w->RC));
    result.Set("jsHConn", Number::New(env, w->hConn));

    if (w->pCno) {
      // do any copyback of other parameters
      if (w->cno.SSLConfigPtr != NULL && !w->jssco.IsEmpty()) {
        copySCOfromC(env, w->jssco, w->cno.SSLConfigPtr);
      }
      if (w->cno.ClientConnPtr != NULL && !w->jscd.IsEmpty()) {
        copyCDfromC(env, w->jscd, (PMQCD)w->cno.ClientConnPtr);
      }
      // CSP and BNO do not need any copying
    }

    cleanupCNO(w->pCno);
    delete (w);
  }

  return result;
}
#undef VERB

/****************************************************************************************/

class DiscWorker : public Napi::AsyncWorker {
public:
  DiscWorker(Function &callback, const CallbackInfo &info) : AsyncWorker(callback) {
    debugf(LOG_OBJECT, "In DISC constructor. Number of parameters = %d \n", (int)info.Length());
  }

  ~DiscWorker() { debugf(LOG_OBJECT, "In DISC destructor\n"); }

  void Execute() { CALLMQI("MQDISC")(&hConn, &CC, &RC); }

  void OnOK() {
    debugf(LOG_TRACE, "In DISC OnOK method\n");

    Object result = Object::New(Env());
    result.Set("jsCc", Number::New(Env(), CC));
    result.Set("jsRc", Number::New(Env(), RC));
    result.Set("jsHConn", Number::New(Env(), hConn));

    Callback().Call({result});
  }

public:
  MQHCONN hConn = -1;
  MQLONG CC = -1;
  MQLONG RC = -1;
};

#define VERB "DISC"
Object DISC(const CallbackInfo &info) {
  enum { IDX_DISC_HCONN = 0, IDX_DISC_CALLBACK };

  bool async = false;
  Function cb;
  Env env = info.Env();
  Object result = Object::New(env);

  if (info.Length() < 1 || info.Length() > IDX_DISC_CALLBACK + 1) {
    throwTE(env, VERB, "Wrong number of arguments");
  }

  if (info.Length() > IDX_DISC_CALLBACK) {
    cb = info[IDX_DISC_CALLBACK].As<Function>();
    async = true;
  } else {
    cb = config.noopFnRef.Value().As<Function>();
  }
  DiscWorker *w = new DiscWorker(cb, info);

  w->hConn = info[IDX_DISC_HCONN].As<Number>().Int32Value();
  if (async) {
    w->Queue();
  } else {
    CALLMQI("MQDISC")(&w->hConn, &w->CC, &w->RC);

    result.Set("jsCc", Number::New(env, w->CC));
    result.Set("jsRc", Number::New(env, w->RC));
    result.Set("jsHConn", Number::New(env, w->hConn));

    delete (w);
  }

  return result;
}
#undef VERB
