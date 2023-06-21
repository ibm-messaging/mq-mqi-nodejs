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
#include "linux/cmqc.h"
#endif
#include <cmqxc.h>

using namespace Napi;
using namespace std;

using BUC = Buffer<unsigned char>;

/* The MQI wrapper functions */
Object CONNX(const CallbackInfo &info);
Object DISC(const CallbackInfo &info);
Object OPEN(const CallbackInfo &info);
Object CLOSE(const CallbackInfo &info);

Object BEGIN(const CallbackInfo &info);
Object CMIT(const CallbackInfo &info);
Object BACK(const CallbackInfo &info);

Object SUB(const CallbackInfo &info);
Object SUBRQ(const CallbackInfo &info);
Object STAT(const CallbackInfo &info);

Object INQ(const CallbackInfo &info);
Object SET(const CallbackInfo &info);

Object PUT(const CallbackInfo &info);
Object PUT1(const CallbackInfo &info);
Object GET(const CallbackInfo &info);
Object GETASYNC(const CallbackInfo &info);
Object GETDONE(const CallbackInfo &info);
Object CTL(const CallbackInfo &info);

Object CRTMH(const CallbackInfo &info);
Object DLTMH(const CallbackInfo &info);

Object SETMP(const CallbackInfo &info);
Object DLTMP(const CallbackInfo &info);
Object INQMP(const CallbackInfo &info);

void SetTuningParameters(const CallbackInfo &Info);

/* To permit test code */
void TESTSP(const CallbackInfo &info);

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

/* Structure transformations into/out of JS format */
void copyODtoC(Env, Object, PMQOD);
void copyODfromC(Env, Object, PMQOD);

void copyMDtoC(Env, Object, PMQMD);
void copyMDfromC(Env, Object, PMQMD);

void copyGMOtoC(Env, Object, PMQGMO);
void copyGMOfromC(Env, Object, PMQGMO);

void copyPMOtoC(Env, Object, PMQPMO);
void copyPMOfromC(Env, Object, PMQPMO);

void copySDtoC(Env, Object, PMQSD);
void copySDfromC(Env, Object, PMQSD);

void copySROtoC(Env, Object, PMQSRO);
void copySROfromC(Env, Object, PMQSRO);

void copySTStoC(Env env, Object jssts, PMQSTS pmqsts);
void copySTSfromC(Env env, Object jssts, PMQSTS pmqsts);

void copyCSPtoC(Env, Object, PMQCSP);
void copyCSPfromC(Env, Object, PMQCSP);
void copyCDtoC(Env, Object, PMQCD);
void copyCDfromC(Env, Object, PMQCD);
void copySCOtoC(Env, Object, PMQSCO);
void copySCOfromC(Env, Object, PMQSCO);
void copyBNOtoC(Env, Object, PMQBNO);
void copyBNOfromC(Env, Object, PMQBNO);

void cleanupCSP(PMQCSP);
void cleanupCD(PMQCD);
void cleanupSCO(PMQSCO);
void cleanupBNO(PMQBNO);

void cleanupObjectContext(MQHCONN, MQHOBJ, PMQLONG, PMQLONG,bool); // For async consumers
void cleanupConnectionContext(MQHCONN);
void resumeConnectionContext(MQHCONN);

/* Field manipulation functions */
void setMQIString(Env env, char *out, Object in, const char *field, size_t len);
void setMQIBytes(Env env, unsigned char *out, Object in, const char *field, size_t len);
String getMQIString(Env env, PMQCHAR in, size_t len);
void getMQIBytes(Env env, unsigned char *in, Object out, const char *field, size_t len);
void setMQICharV(Env env, PMQCHARV v, Object in, const char *field, bool output);
String getMQICharV(Env env, PMQCHARV v, bool free);
int32_t getMQLong(Object, const char *);

/* Memory allocation functions */
void mqnFree(void *);
void mqnFreeString(void *);
char *mqnStrdup(Env, const char *);
void *mqnAlloc(Env, size_t l);

/* Debug functions */
void debugf(int, const char *fmt, ...);
void debugDest(Env env, void *s);
void dumpObject(Env env, const char *, Object o);
void dumpHex(const char *title, void *buf, int length);

const char *napiType(napi_valuetype t);

void throwTE(Env env, std::string s1, std::string s2);
void throwRE(Env env, std::string s1, std::string s2);
void throwError(Env env, std::string s1);

#define LOG_NONE (0)
#define LOG_DEBUG (1)
#define LOG_TRACE (2)
#define LOG_OBJECT (3) /* Track some constructors/destructors */

extern int logLevel; /* This may be referred to even after Configuration removed */

extern int maxConsecutiveGetsDefault;
extern int getLoopDelayTimeMsDefault;

class Configuration {
public:
  string platform;
  string arch;
  FunctionReference noopFnRef;

  // For tuning the async get routines
  int maxConsecutiveGets = maxConsecutiveGetsDefault;
  int getLoopDelayTimeMs = getLoopDelayTimeMsDefault;
};
extern Configuration config;
#endif
