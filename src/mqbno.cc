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

void copyBNOtoC(Env env, Object jsbno, PMQBNO pmqbno) {
  pmqbno->ApplType = jsbno.Get("ApplType").As<Number>();
  pmqbno->Timeout = jsbno.Get("Timeout").As<Number>();
  pmqbno->Options = jsbno.Get("Options").As<Number>();
}

void copyBNOfromC(Env env, Object jsbno, PMQBNO pmqbno) {
  // Nothing to do
  return;
}

void cleanupBNO(PMQBNO pmqno) {
  // Nothing to do
  return;
}
