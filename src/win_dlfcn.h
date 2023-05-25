
#if !defined(_WIN_DLFCN_H)
#define _WIN_DLFCN_H

extern "C" {

#define RTLD_NOW 0
#define RTLD_GLOBAL 0

/* A very simple emulation of the Linux dynamic load functions. Has just enough to allow
   this package to work.
 */
void *dlopen(const char *, int);
int dlclose(void *);
void *dlsym(void *, const char *);
char *dlerror(void);
}

#endif
