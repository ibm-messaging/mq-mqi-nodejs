/**
 * Basic version of POSIX dlopen/dlsym/dlclose on Windows. Does
 * just enough for this library.
 */

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif

#include <malloc.h>
#include <stdio.h>

#include "win_dlfcn.h"
#include <windows.h>

/* Error code from last failure. Held as a global */
static DWORD lastError = 0;

/**
 * Convert UTF-8 string to Windows UNICODE (UCS-2 LE).
 * Caller must free() the returned string.
 */

static WCHAR *UTF8toWCHAR(const char *in) {
  WCHAR *out;
  int outLen;

  outLen = MultiByteToWideChar(CP_UTF8, 0, in, -1, NULL, 0);
  if (outLen == 0)
    return NULL;

  out = (WCHAR *)malloc(outLen * sizeof(WCHAR));
  if (out == NULL) {
    SetLastError(ERROR_OUTOFMEMORY);
    return NULL;
  }

  if (MultiByteToWideChar(CP_UTF8, 0, in, -1, out, outLen) != outLen) {
    free(out);
    return NULL;
  }

  return out;
}

void *dlopen(const char *file, int mode) {
  WCHAR *uniFile;
  UINT errorMode;
  void *handle;

  UNREFERENCED_PARAMETER(mode);

  if (file == NULL)
    return (void *)GetModuleHandle(NULL);

  uniFile = UTF8toWCHAR(file);

  if (uniFile == NULL) {
    lastError = GetLastError();
    return NULL;
  }

  /* Have LoadLibrary return NULL on failure; prevent GUI error message. */
  errorMode = GetErrorMode();
  SetErrorMode(errorMode | SEM_FAILCRITICALERRORS);

  handle = (void *)LoadLibraryW(uniFile);
  if (handle == NULL)
    lastError = GetLastError();

  SetErrorMode(errorMode); 
  free(uniFile);

  return handle;
}

int dlclose(void *handle) {
  int rc = 0;

  if (handle != (void *)GetModuleHandle(NULL))
    rc = !FreeLibrary((HMODULE)handle);

  if (rc)
    lastError = GetLastError();

  return rc;
}

void *dlsym(void *handle, const char *name) {
  void *address = (void *)GetProcAddress((HMODULE)handle, name);

  if (address == NULL)
    lastError = GetLastError();

  return address;
}

/**
 * Return message describing last error.
 */

char *dlerror(void) {
  static char msg[128] = {0};

  if (lastError != 0) {
    snprintf(msg, sizeof(msg)-1, "Win32 error %lu", lastError);
    lastError = 0;
    return msg;
  } else {
    return NULL;
  }
}
