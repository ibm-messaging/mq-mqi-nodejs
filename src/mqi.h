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

#if !defined(IBMMQ_NAPI_H)
#define IBMMQ_NAPI_H
#include <stdarg.h>
#include <stdio.h>
#include <string.h>

#include <assert.h>
#include <map>
#include <napi.h>

#if defined(WIN32)
#include "windows/cmqc.h"
#else
#include "unix/cmqc.h"
#endif
#include <cmqxc.h>

using BUC = Napi::Buffer<unsigned char>;

/* The MQI wrapper functions */
Napi::Object CONNX(const Napi::CallbackInfo &info);
Napi::Object DISC(const Napi::CallbackInfo &info);
Napi::Object OPEN(const Napi::CallbackInfo &info);
Napi::Object CLOSE(const Napi::CallbackInfo &info);

Napi::Object BEGIN(const Napi::CallbackInfo &info);
Napi::Object CMIT(const Napi::CallbackInfo &info);
Napi::Object BACK(const Napi::CallbackInfo &info);

Napi::Object SUB(const Napi::CallbackInfo &info);
Napi::Object SUBRQ(const Napi::CallbackInfo &info);
Napi::Object STAT(const Napi::CallbackInfo &info);

Napi::Object INQ(const Napi::CallbackInfo &info);
Napi::Object SET(const Napi::CallbackInfo &info);

Napi::Object PUT(const Napi::CallbackInfo &info);
Napi::Object PUT1(const Napi::CallbackInfo &info);
Napi::Object GET(const Napi::CallbackInfo &info);
Napi::Object GETASYNC(const Napi::CallbackInfo &info);
Napi::Object GETDONE(const Napi::CallbackInfo &info);
Napi::Object CTL(const Napi::CallbackInfo &info);

Napi::Object CRTMH(const Napi::CallbackInfo &info);
Napi::Object DLTMH(const Napi::CallbackInfo &info);

Napi::Object SETMP(const Napi::CallbackInfo &info);
Napi::Object DLTMP(const Napi::CallbackInfo &info);
Napi::Object INQMP(const Napi::CallbackInfo &info);

void SetTuningParameters(const Napi::CallbackInfo &Info);

/* To permit test code */
void TESTSP(const Napi::CallbackInfo &info);

/* How to get from the dlsym pointers to the real functions */
/* The varargs elements are the types of the parameters to each call - MQLONG, PMQMD etc */
#define CALLMQI(fn, ...) reinterpret_cast<void (*)(__VA_ARGS__)>(mqiFnMap[fn])
extern std::map<std::string, void *> mqiFnMap;

#define _MQCONNX CALLMQI("MQCONNX", PMQCHAR, PMQCNO, PMQHCONN, PMQLONG, PMQLONG)
#define _MQDISC  CALLMQI("MQDISC", PMQHCONN, PMQLONG, PMQLONG)
#define _MQOPEN  CALLMQI("MQOPEN", MQHCONN, PMQOD, MQLONG, PMQHOBJ, PMQLONG, PMQLONG)
#define _MQCLOSE CALLMQI("MQCLOSE", MQHCONN, PMQHOBJ, MQLONG, PMQLONG, PMQLONG)
#define _MQSUB   CALLMQI("MQSUB",MQHCONN,PMQSD,PMQHOBJ,PMQHOBJ,PMQLONG,PMQLONG)
#define _MQSUBRQ CALLMQI("MQSUBRQ",MQHCONN,MQHOBJ,MQLONG,PMQSRO,PMQLONG,PMQLONG)

#define _MQSTAT  CALLMQI("MQSTAT",MQHCONN,MQLONG,PMQSTS,PMQLONG,PMQLONG)

#define _MQGET   CALLMQI("MQGET", MQHCONN, MQHOBJ, PMQMD, PMQGMO, MQLONG, PMQVOID, PMQLONG, PMQLONG, PMQLONG)
#define _MQPUT   CALLMQI("MQPUT", MQHCONN, MQHOBJ, PMQMD, PMQPMO, MQLONG, PMQVOID, PMQLONG, PMQLONG)
#define _MQPUT1  CALLMQI("MQPUT1", MQHCONN, PMQOD, PMQMD, PMQPMO, MQLONG, PMQVOID, PMQLONG, PMQLONG)

#define _MQBEGIN CALLMQI("MQBEGIN", MQHCONN, PMQLONG, PMQLONG)
#define _MQCMIT  CALLMQI("MQCMIT",MQHCONN,PMQLONG,PMQLONG)
#define _MQBACK  CALLMQI("MQBACK",MQHCONN,PMQLONG,PMQLONG)

#define _MQSET   CALLMQI("MQSET",MQHCONN,MQHOBJ,MQLONG,PMQLONG,MQLONG,PMQLONG,MQLONG,PMQCHAR,PMQLONG,PMQLONG)
#define _MQINQ   CALLMQI("MQINQ",MQHCONN,MQHOBJ,MQLONG,PMQLONG,MQLONG,PMQLONG,MQLONG,PMQCHAR,PMQLONG,PMQLONG)

#define _MQCRTMH CALLMQI("MQCRTMH",MQHCONN,PMQCMHO,PMQHMSG,PMQLONG,PMQLONG)
#define _MQDLTMH CALLMQI("MQDLTMH",MQHCONN,PMQHMSG,PMQDMHO,PMQLONG,PMQLONG)
#define _MQINQMP CALLMQI("MQINQMP",MQHCONN,MQHMSG,PMQIMPO,PMQCHARV,PMQPD,PMQLONG,MQLONG,PMQVOID,PMQLONG,PMQLONG,PMQLONG)
#define _MQSETMP CALLMQI("MQSETMP",MQHCONN,MQHMSG,PMQSMPO,PMQCHARV,PMQPD,MQLONG,MQLONG,PMQVOID,PMQLONG,PMQLONG)
#define _MQDLTMP CALLMQI("MQDLTMP",MQHCONN,PMQHMSG,PMQDMPO,PMQLONG,PMQLONG)


#define _MQCTL   CALLMQI("MQCTL", MQHCONN, MQLONG, PMQCTLO, PMQLONG, PMQLONG)
#define _MQCB    CALLMQI("MQCB", MQHCONN, MQLONG, PMQCBD, MQHOBJ, PMQMD, PMQGMO, PMQLONG, PMQLONG)

void Sus(MQHCONN);
void Res(MQHCONN);

/* Structure transformations into/out of JS format */
void copyODtoC(Napi::Env, Napi::Object, PMQOD);
void copyODfromC(Napi::Env, Napi::Object, PMQOD);

void copyMDtoC(Napi::Env, Napi::Object, PMQMD);
void copyMDfromC(Napi::Env, Napi::Object, PMQMD);

void copyGMOtoC(Napi::Env, Napi::Object, PMQGMO);
void copyGMOfromC(Napi::Env, Napi::Object, PMQGMO);

void copyPMOtoC(Napi::Env, Napi::Object, PMQPMO);
void copyPMOfromC(Napi::Env, Napi::Object, PMQPMO);

void copySDtoC(Napi::Env, Napi::Object, PMQSD);
void copySDfromC(Napi::Env, Napi::Object, PMQSD);

void copySROtoC(Napi::Env, Napi::Object, PMQSRO);
void copySROfromC(Napi::Env, Napi::Object, PMQSRO);

void copySTStoC(Napi::Env env, Napi::Object jssts, PMQSTS pmqsts);
void copySTSfromC(Napi::Env env, Napi::Object jssts, PMQSTS pmqsts);

void copyCSPtoC(Napi::Env, Napi::Object, PMQCSP);
void copyCSPfromC(Napi::Env, Napi::Object, PMQCSP);
void copyCDtoC(Napi::Env, Napi::Object, PMQCD);
void copyCDfromC(Napi::Env, Napi::Object, PMQCD);
void copySCOtoC(Napi::Env, Napi::Object, PMQSCO);
void copySCOfromC(Napi::Env, Napi::Object, PMQSCO);
void copyBNOtoC(Napi::Env, Napi::Object, PMQBNO);
void copyBNOfromC(Napi::Env, Napi::Object, PMQBNO);

void cleanupCSP(PMQCSP);
void cleanupCD(PMQCD);
void cleanupSCO(PMQSCO);
void cleanupBNO(PMQBNO);

bool cleanupObjectContext(MQHCONN, MQHOBJ, PMQLONG, PMQLONG,bool); // For async consumers
void cleanupConnectionContext(MQHCONN);
void resumeConnectionContext(MQHCONN);

/* Field manipulation functions */
void setMQIString(Napi::Env env, char *out, Napi::Object in, const char *field, size_t len);
void setMQIBytes(Napi::Env env, unsigned char *out, Napi::Object in, const char *field, size_t len);
Napi::String getMQIString(Napi::Env env, PMQCHAR in, size_t len);
void getMQIBytes(Napi::Env env, unsigned char *in, Napi::Object out, const char *field, size_t len);
void setMQICharV(Napi::Env env, PMQCHARV v, Napi::Object in, const char *field, bool output);
Napi::String getMQICharV(Napi::Env env, PMQCHARV v, bool free);
int32_t getMQLong(Napi::Object, const char *);

/* Memory allocation functions */
void mqnFree(void *);
void mqnFreeString(void *);
char *mqnStrdup(Napi::Env, const char *);
void *mqnAlloc(Napi::Env, size_t l);

/* Debug functions */
void debugf(int, const char *fmt, ...);
void debugDest(Napi::Env env, void *s);
void dumpObject(Napi::Env env, const char *, Napi::Object o);
void dumpHex(const char *title, void *buf, int length);

const char *napiType(napi_valuetype t);

void throwTE(Napi::Env env, std::string s1, std::string s2);
void throwRE(Napi::Env env, std::string s1, std::string s2);
void throwError(Napi::Env env, std::string s1);

#define LOG_NONE (0)
#define LOG_DEBUG (1)
#define LOG_TRACE (2)
#define LOG_OBJECT (3) /* Track some constructors/destructors */

extern int logLevel; /* This may be referred to even after Configuration removed */

extern int maxConsecutiveGetsDefault;
extern int getLoopDelayTimeMsDefault;
extern bool defaultAutoCtl;
extern bool defaultUseCtl;

class Configuration {
public:
  std::string platform;
  std::string arch;
  Napi::FunctionReference noopFnRef;

  // For tuning the async get routines
  int maxConsecutiveGets = maxConsecutiveGetsDefault;
  int getLoopDelayTimeMs = getLoopDelayTimeMsDefault;
  bool autoCtl = defaultAutoCtl;
  bool useCtl = defaultUseCtl;
};
extern Configuration config;
#endif
