'use strict';
/*
  Copyright (c) IBM Corporation 2017,2018

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

var arch;

// Need to pick up the right variant of the definitions for each
// platform - endianness, MQAT values in particular.
// Not all MQ platforms are in here at the moment; more could be added
// if needed.
switch (process.platform)
{
case 'win32':
  arch = 'windows';
  break;
case 'aix':
  arch = 'aix';
  break;
case 'linux':
   switch (process.arch)
   {
   case 's390':  arch = 'linuxS390'; break;
   case 's390x': arch = 'linuxS390'; break;
   case 'ppc':   arch = 'linuxPowerLE'; break;
   case 'ppc64': arch = 'linuxPowerLE'; break;
   default:      arch = 'linuxIntel'; break;
   }
   break;
default:
  arch = process.platform;
  break;
}

var cmqc = './mqidefs_' + arch + '.js';
try {
  module.exports=require(cmqc);
} catch (err) {
  console.error("Cannot find definitions in " + cmqc + ". Continuing with default file.");
  cmqc = './mqidefs_linuxIntel.js';
  module.exports=require(cmqc);
}
