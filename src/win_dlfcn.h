
#if !defined(_WIN_DLFCN_H)
#define _WIN_DLFCN_H

#ifdef __cplusplus
extern "C" {
#endif

#define RTLD_NOW 0
#define RTLD_GLOBAL 0

void *dlopen(const char *, int );
int dlclose(void *);
void *dlsym(void *, const char *);
char *dlerror(void);

#ifdef __cplusplus
}
#endif

#endif
