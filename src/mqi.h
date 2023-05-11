
#if !defined(IBMMQ_NAPI_H)
#define IBMMQ_NAPI_H
#include <stdio.h>
#include <string.h>
#include <stdarg.h>

#include <assert.h>
#include <napi.h>
#include <map>

#if defined(WIN32)
#include "windows/cmqc.h"
#else
#include "linux/cmqc.h"
#endif
#include <cmqxc.h>

using namespace Napi;
using namespace std;

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

Object CRTMH(const CallbackInfo &info);
Object DLTMH(const CallbackInfo &info);

Object SETMP(const CallbackInfo &info);
Object DLTMP(const CallbackInfo &info);
Object INQMP(const CallbackInfo &info);

/* How to get from the dlsym pointers to the real functions */
#define CALLMQI(fn,...)  reinterpret_cast< void(*)(__VA_ARGS__) >(mqiFnMap[ fn ])
extern std::map<std::string,void *>mqiFnMap;

/* Structure transformations into/out of JS format */
void copyODtoC(Env, Object, PMQOD);
void copyODfromC(Env, Object, PMQOD);

void copyMDtoC(Env, Object, PMQMD);
void copyMDfromC(Env, Object, PMQMD);

void copyGMOtoC(Env, Object, PMQGMO);
void copyGMOfromC(Env, Object , PMQGMO);

void copyPMOtoC(Env, Object, PMQPMO);
void copyPMOfromC(Env, Object , PMQPMO);

void copySDtoC(Env, Object, PMQSD);
void copySDfromC(Env, Object , PMQSD);

void copySROtoC(Env, Object, PMQSRO);
void copySROfromC(Env, Object , PMQSRO);

void copySTStoC(Env env, Object jssts, PMQSTS pmqsts);
void copySTSfromC(Env env, Object jssts, PMQSTS pmqsts);

void copyCSPtoC(Env, Object, PMQCSP);
void copyCSPfromC(Env, Object , PMQCSP);
void copyCDtoC(Env, Object, PMQCD);
void copyCDfromC(Env, Object , PMQCD);
void copySCOtoC(Env, Object, PMQSCO);
void copySCOfromC(Env, Object , PMQSCO);
void copyBNOtoC(Env, Object, PMQBNO);
void copyBNOfromC(Env, Object , PMQBNO);

void cleanupCSP(PMQCSP);
void cleanupCD(PMQCD);
void cleanupSCO(PMQSCO);
void cleanupBNO(PMQBNO);


/* Field manipulation functions */
void setMQIString(Env env, char *out,Object in, const char *field,size_t len);
void setMQIBytes(Env env, unsigned char *out,Object in, const char *field,size_t len);
String getMQIString(Env env,PMQCHAR in,size_t len);
void getMQIBytes(Env env, unsigned char *in,Object out, const char *field,size_t len);
void setMQICharV(Env env, PMQCHARV v, Object in, const char *field, bool output);
String getMQICharV(Env env, PMQCHARV v, bool free);
int32_t getMQLong(Object, const char *);


/* Debug functions */
void mqFree(void *);
void mqFreeString(void *);
void debugf(int,const char *fmt, ...);
void debugDest(Env env, void *s);
void dumpObject(Env env,const char *,Object o);
const char *napiType(napi_valuetype t);

void throwTE(Env env, std::string s1, std::string s2);
void throwRE(Env env, std::string s1, std::string s2);

#define LOG_NONE    (0)
#define LOG_DEBUG   (1)
#define LOG_TRACE   (2)
#define LOG_OBJECT  (3) /* Track constructors/destructors */
class Configuration {
  public:
    int logLevel;
    string platform;
    string arch;
    bool littleEndian;
    FunctionReference noopFnRef;
};
extern Configuration config;

#endif
