'use strict';
/*
  Copyright (c) IBM Corporation 2017,2023

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
     Mark Taylor - Initial Contribution
*/

// Need to pick up the right variant of the definitions for each
// platform - endianness, MQAT values in particular. The variant is
// directly loaded by name as webpack does not like using variables.
try {
  switch (process.platform)
  {
  case 'win32':
    module.exports=require('./mqidefs_windows.js');
    break;
  case 'aix':
    module.exports=require('./mqidefs_aix.js');
    break;
  case 'linux':
    switch (process.arch)
    {
    case 's390':
    case 's390x':
      module.exports=require('./mqidefs_linuxS390.js');
      break;
    case 'ppc':
    case 'ppc64':
      module.exports=require('./mqidefs_linuxPowerLE.js');
      break;
    case 'arm':
    case 'arm64':
      module.exports=require('./mqidefs_linuxARM.js');
      break;
    default:
      module.exports=require('./mqidefs_linuxIntel.js');
      break;
    }
    break;
  case 'darwin':
    module.exports=require('./mqidefs_darwin.js');
    break;
  default:
    // Pick a default
    module.exports=require('./mqidefs_linuxIntel.js');
    break;
  }
} catch (err) {
  console.error("Cannot find definitions for current platform. Continuing with default file.");
  module.exports=require('./mqidefs_linuxIntel.js');
}
