'use strict';
/*
  Copyright (c) IBM Corporation 1993,2020

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/

 /****************************************************************/
 /*                                                              */
 /*  FUNCTION:       This file provides mappings between MQI     */
 /*                  constant values and string versions of      */
 /*                  their definitions.                          */
 /*                                                              */
 /*  PROCESSOR:      JavaScript                                  */
 /*                                                              */
 /****************************************************************/
 /****************************************************************/
 /* <BEGIN_BUILDINFO>                                            */
 /* Generated on:  11/12/20 5:27 PM                              */
 /* Build Level:   p921-L201112.1                                */
 /* Build Type:    Production                                    */
 /* <END_BUILDINFO>                                              */
 /****************************************************************/
 exports.MQACTIVE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQACTIVE_NO"; break;
   case          1: c = "MQACTIVE_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQACTP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQACTP_NEW"; break;
   case          1: c = "MQACTP_FORWARD"; break;
   case          2: c = "MQACTP_REPLY"; break;
   case          3: c = "MQACTP_REPORT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQACTV_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQACTV_DETAIL_LOW"; break;
   case          2: c = "MQACTV_DETAIL_MEDIUM"; break;
   case          3: c = "MQACTV_DETAIL_HIGH"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQACT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQACT_FORCE_REMOVE"; break;
   case          2: c = "MQACT_ADVANCE_LOG"; break;
   case          3: c = "MQACT_COLLECT_STATISTICS"; break;
   case          4: c = "MQACT_PUBSUB"; break;
   case          5: c = "MQACT_ADD"; break;
   case          6: c = "MQACT_REPLACE"; break;
   case          7: c = "MQACT_REMOVE"; break;
   case          8: c = "MQACT_REMOVEALL"; break;
   case          9: c = "MQACT_FAIL"; break;
   case         10: c = "MQACT_REDUCE_LOG"; break;
   case         11: c = "MQACT_ARCHIVE_LOG"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQADOPT_CHECK_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQADOPT_CHECK_NONE"; break;
   case          1: c = "MQADOPT_CHECK_ALL"; break;
   case          2: c = "MQADOPT_CHECK_Q_MGR_NAME"; break;
   case          4: c = "MQADOPT_CHECK_NET_ADDR"; break;
   case          8: c = "MQADOPT_CHECK_CHANNEL_NAME"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQADOPT_TYPE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQADOPT_TYPE_NO"; break;
   case          1: c = "MQADOPT_TYPE_ALL"; break;
   case          2: c = "MQADOPT_TYPE_SVR"; break;
   case          4: c = "MQADOPT_TYPE_SDR"; break;
   case          8: c = "MQADOPT_TYPE_RCVR"; break;
   case         16: c = "MQADOPT_TYPE_CLUSRCVR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQADPCTX_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQADPCTX_NO"; break;
   case          1: c = "MQADPCTX_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQAIT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQAIT_ALL"; break;
   case          1: c = "MQAIT_CRL_LDAP"; break;
   case          2: c = "MQAIT_OCSP"; break;
   case          3: c = "MQAIT_IDPW_OS"; break;
   case          4: c = "MQAIT_IDPW_LDAP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQAPPL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQAPPL_IMMOVABLE"; break;
   case          1: c = "MQAPPL_MOVABLE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQAS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQAS_NONE"; break;
   case          1: c = "MQAS_STARTED"; break;
   case          2: c = "MQAS_START_WAIT"; break;
   case          3: c = "MQAS_STOPPED"; break;
   case          4: c = "MQAS_SUSPENDED"; break;
   case          5: c = "MQAS_SUSPENDED_TEMPORARY"; break;
   case          6: c = "MQAS_ACTIVE"; break;
   case          7: c = "MQAS_INACTIVE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQAT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQAT_UNKNOWN"; break;
   case          0: c = "MQAT_NO_CONTEXT"; break;
   case          1: c = "MQAT_CICS"; break;
   case          2: c = "MQAT_ZOS"; break;
   case          3: c = "MQAT_IMS"; break;
   case          4: c = "MQAT_OS2"; break;
   case          5: c = "MQAT_DOS"; break;
   case          6: c = "MQAT_UNIX"; break;
   case          7: c = "MQAT_QMGR"; break;
   case          8: c = "MQAT_OS400"; break;
   case          9: c = "MQAT_WINDOWS"; break;
   case         10: c = "MQAT_CICS_VSE"; break;
   case         11: c = "MQAT_WINDOWS_NT"; break;
   case         12: c = "MQAT_VMS"; break;
   case         13: c = "MQAT_NSK"; break;
   case         14: c = "MQAT_VOS"; break;
   case         15: c = "MQAT_OPEN_TP1"; break;
   case         18: c = "MQAT_VM"; break;
   case         19: c = "MQAT_IMS_BRIDGE"; break;
   case         20: c = "MQAT_XCF"; break;
   case         21: c = "MQAT_CICS_BRIDGE"; break;
   case         22: c = "MQAT_NOTES_AGENT"; break;
   case         23: c = "MQAT_TPF"; break;
   case         25: c = "MQAT_USER"; break;
   case         26: c = "MQAT_QMGR_PUBLISH"; break;
   case         28: c = "MQAT_JAVA"; break;
   case         29: c = "MQAT_DQM"; break;
   case         30: c = "MQAT_CHANNEL_INITIATOR"; break;
   case         31: c = "MQAT_WLM"; break;
   case         32: c = "MQAT_BATCH"; break;
   case         33: c = "MQAT_RRS_BATCH"; break;
   case         34: c = "MQAT_SIB"; break;
   case         35: c = "MQAT_SYSTEM_EXTENSION"; break;
   case         36: c = "MQAT_MCAST_PUBLISH"; break;
   case         37: c = "MQAT_AMQP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQAUTHENTICATE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQAUTHENTICATE_OS"; break;
   case          1: c = "MQAUTHENTICATE_PAM"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQAUTHOPT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQAUTHOPT_ENTITY_EXPLICIT"; break;
   case          2: c = "MQAUTHOPT_ENTITY_SET"; break;
   case         16: c = "MQAUTHOPT_NAME_EXPLICIT"; break;
   case         32: c = "MQAUTHOPT_NAME_ALL_MATCHING"; break;
   case         64: c = "MQAUTHOPT_NAME_AS_WILDCARD"; break;
   case        256: c = "MQAUTHOPT_CUMULATIVE"; break;
   case        512: c = "MQAUTHOPT_EXCLUDE_TEMP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQAUTH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -3: c = "MQAUTH_ALL_MQI"; break;
   case         -2: c = "MQAUTH_ALL_ADMIN"; break;
   case         -1: c = "MQAUTH_ALL"; break;
   case          0: c = "MQAUTH_NONE"; break;
   case          1: c = "MQAUTH_ALT_USER_AUTHORITY"; break;
   case          2: c = "MQAUTH_BROWSE"; break;
   case          3: c = "MQAUTH_CHANGE"; break;
   case          4: c = "MQAUTH_CLEAR"; break;
   case          5: c = "MQAUTH_CONNECT"; break;
   case          6: c = "MQAUTH_CREATE"; break;
   case          7: c = "MQAUTH_DELETE"; break;
   case          8: c = "MQAUTH_DISPLAY"; break;
   case          9: c = "MQAUTH_INPUT"; break;
   case         10: c = "MQAUTH_INQUIRE"; break;
   case         11: c = "MQAUTH_OUTPUT"; break;
   case         12: c = "MQAUTH_PASS_ALL_CONTEXT"; break;
   case         13: c = "MQAUTH_PASS_IDENTITY_CONTEXT"; break;
   case         14: c = "MQAUTH_SET"; break;
   case         15: c = "MQAUTH_SET_ALL_CONTEXT"; break;
   case         16: c = "MQAUTH_SET_IDENTITY_CONTEXT"; break;
   case         17: c = "MQAUTH_CONTROL"; break;
   case         18: c = "MQAUTH_CONTROL_EXTENDED"; break;
   case         19: c = "MQAUTH_PUBLISH"; break;
   case         20: c = "MQAUTH_SUBSCRIBE"; break;
   case         21: c = "MQAUTH_RESUME"; break;
   case         22: c = "MQAUTH_SYSTEM"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQAUTO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQAUTO_START_NO"; break;
   case          1: c = "MQAUTO_START_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQBACF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case       7001: c = "MQBACF_EVENT_ACCOUNTING_TOKEN"; break;
   case       7002: c = "MQBACF_EVENT_SECURITY_ID"; break;
   case       7003: c = "MQBACF_RESPONSE_SET"; break;
   case       7004: c = "MQBACF_RESPONSE_ID"; break;
   case       7005: c = "MQBACF_EXTERNAL_UOW_ID"; break;
   case       7006: c = "MQBACF_CONNECTION_ID"; break;
   case       7007: c = "MQBACF_GENERIC_CONNECTION_ID"; break;
   case       7008: c = "MQBACF_ORIGIN_UOW_ID"; break;
   case       7009: c = "MQBACF_Q_MGR_UOW_ID"; break;
   case       7010: c = "MQBACF_ACCOUNTING_TOKEN"; break;
   case       7011: c = "MQBACF_CORREL_ID"; break;
   case       7012: c = "MQBACF_GROUP_ID"; break;
   case       7013: c = "MQBACF_MSG_ID"; break;
   case       7014: c = "MQBACF_CF_LEID"; break;
   case       7015: c = "MQBACF_DESTINATION_CORREL_ID"; break;
   case       7016: c = "MQBACF_SUB_ID"; break;
   case       7019: c = "MQBACF_ALTERNATE_SECURITYID"; break;
   case       7020: c = "MQBACF_MESSAGE_DATA"; break;
   case       7021: c = "MQBACF_MQBO_STRUCT"; break;
   case       7022: c = "MQBACF_MQCB_FUNCTION"; break;
   case       7023: c = "MQBACF_MQCBC_STRUCT"; break;
   case       7024: c = "MQBACF_MQCBD_STRUCT"; break;
   case       7025: c = "MQBACF_MQCD_STRUCT"; break;
   case       7026: c = "MQBACF_MQCNO_STRUCT"; break;
   case       7027: c = "MQBACF_MQGMO_STRUCT"; break;
   case       7028: c = "MQBACF_MQMD_STRUCT"; break;
   case       7029: c = "MQBACF_MQPMO_STRUCT"; break;
   case       7030: c = "MQBACF_MQSD_STRUCT"; break;
   case       7031: c = "MQBACF_MQSTS_STRUCT"; break;
   case       7032: c = "MQBACF_SUB_CORREL_ID"; break;
   case       7033: c = "MQBACF_XA_XID"; break;
   case       7034: c = "MQBACF_XQH_CORREL_ID"; break;
   case       7035: c = "MQBACF_XQH_MSG_ID"; break;
   case       7036: c = "MQBACF_REQUEST_ID"; break;
   case       7037: c = "MQBACF_PROPERTIES_DATA"; break;
   case       7038: c = "MQBACF_CONN_TAG"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQBALANCED_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQBALANCED_NO"; break;
   case          1: c = "MQBALANCED_YES"; break;
   case          2: c = "MQBALANCED_NOT_APPLICABLE"; break;
   case          3: c = "MQBALANCED_UNKNOWN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQBALSTATE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQBALSTATE_NOT_APPLICABLE"; break;
   case          1: c = "MQBALSTATE_LOW"; break;
   case          2: c = "MQBALSTATE_OK"; break;
   case          3: c = "MQBALSTATE_HIGH"; break;
   case          4: c = "MQBALSTATE_UNKNOWN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQBL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQBL_NULL_TERMINATED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQBMHO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQBMHO_NONE"; break;
   case          1: c = "MQBMHO_DELETE_PROPERTIES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQBND_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQBND_BIND_ON_OPEN"; break;
   case          1: c = "MQBND_BIND_NOT_FIXED"; break;
   case          2: c = "MQBND_BIND_ON_GROUP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQBO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQBO_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQBPLOCATION_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQBPLOCATION_BELOW"; break;
   case          1: c = "MQBPLOCATION_ABOVE"; break;
   case          2: c = "MQBPLOCATION_SWITCHING_ABOVE"; break;
   case          3: c = "MQBPLOCATION_SWITCHING_BELOW"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQBT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQBT_OTMA"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCACF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case       3001: c = "MQCACF_FROM_Q_NAME"; break;
   case       3002: c = "MQCACF_TO_Q_NAME"; break;
   case       3003: c = "MQCACF_FROM_PROCESS_NAME"; break;
   case       3004: c = "MQCACF_TO_PROCESS_NAME"; break;
   case       3005: c = "MQCACF_FROM_NAMELIST_NAME"; break;
   case       3006: c = "MQCACF_TO_NAMELIST_NAME"; break;
   case       3007: c = "MQCACF_FROM_CHANNEL_NAME"; break;
   case       3008: c = "MQCACF_TO_CHANNEL_NAME"; break;
   case       3009: c = "MQCACF_FROM_AUTH_INFO_NAME"; break;
   case       3010: c = "MQCACF_TO_AUTH_INFO_NAME"; break;
   case       3011: c = "MQCACF_Q_NAMES"; break;
   case       3012: c = "MQCACF_PROCESS_NAMES"; break;
   case       3013: c = "MQCACF_NAMELIST_NAMES"; break;
   case       3014: c = "MQCACF_ESCAPE_TEXT"; break;
   case       3015: c = "MQCACF_LOCAL_Q_NAMES"; break;
   case       3016: c = "MQCACF_MODEL_Q_NAMES"; break;
   case       3017: c = "MQCACF_ALIAS_Q_NAMES"; break;
   case       3018: c = "MQCACF_REMOTE_Q_NAMES"; break;
   case       3019: c = "MQCACF_SENDER_CHANNEL_NAMES"; break;
   case       3020: c = "MQCACF_SERVER_CHANNEL_NAMES"; break;
   case       3021: c = "MQCACF_REQUESTER_CHANNEL_NAMES"; break;
   case       3022: c = "MQCACF_RECEIVER_CHANNEL_NAMES"; break;
   case       3023: c = "MQCACF_OBJECT_Q_MGR_NAME"; break;
   case       3024: c = "MQCACF_APPL_NAME"; break;
   case       3025: c = "MQCACF_USER_IDENTIFIER"; break;
   case       3026: c = "MQCACF_AUX_ERROR_DATA_STR_1"; break;
   case       3027: c = "MQCACF_AUX_ERROR_DATA_STR_2"; break;
   case       3028: c = "MQCACF_AUX_ERROR_DATA_STR_3"; break;
   case       3029: c = "MQCACF_BRIDGE_NAME"; break;
   case       3030: c = "MQCACF_STREAM_NAME"; break;
   case       3031: c = "MQCACF_TOPIC"; break;
   case       3032: c = "MQCACF_PARENT_Q_MGR_NAME"; break;
   case       3033: c = "MQCACF_CORREL_ID"; break;
   case       3034: c = "MQCACF_PUBLISH_TIMESTAMP"; break;
   case       3035: c = "MQCACF_STRING_DATA"; break;
   case       3036: c = "MQCACF_SUPPORTED_STREAM_NAME"; break;
   case       3037: c = "MQCACF_REG_TOPIC"; break;
   case       3038: c = "MQCACF_REG_TIME"; break;
   case       3039: c = "MQCACF_REG_USER_ID"; break;
   case       3040: c = "MQCACF_CHILD_Q_MGR_NAME"; break;
   case       3041: c = "MQCACF_REG_STREAM_NAME"; break;
   case       3042: c = "MQCACF_REG_Q_MGR_NAME"; break;
   case       3043: c = "MQCACF_REG_Q_NAME"; break;
   case       3044: c = "MQCACF_REG_CORREL_ID"; break;
   case       3045: c = "MQCACF_EVENT_USER_ID"; break;
   case       3046: c = "MQCACF_OBJECT_NAME"; break;
   case       3047: c = "MQCACF_EVENT_Q_MGR"; break;
   case       3048: c = "MQCACF_AUTH_INFO_NAMES"; break;
   case       3049: c = "MQCACF_EVENT_APPL_IDENTITY"; break;
   case       3050: c = "MQCACF_EVENT_APPL_NAME"; break;
   case       3051: c = "MQCACF_EVENT_APPL_ORIGIN"; break;
   case       3052: c = "MQCACF_SUBSCRIPTION_NAME"; break;
   case       3053: c = "MQCACF_REG_SUB_NAME"; break;
   case       3054: c = "MQCACF_SUBSCRIPTION_IDENTITY"; break;
   case       3055: c = "MQCACF_REG_SUB_IDENTITY"; break;
   case       3056: c = "MQCACF_SUBSCRIPTION_USER_DATA"; break;
   case       3057: c = "MQCACF_REG_SUB_USER_DATA"; break;
   case       3058: c = "MQCACF_APPL_TAG"; break;
   case       3059: c = "MQCACF_DATA_SET_NAME"; break;
   case       3060: c = "MQCACF_UOW_START_DATE"; break;
   case       3061: c = "MQCACF_UOW_START_TIME"; break;
   case       3062: c = "MQCACF_UOW_LOG_START_DATE"; break;
   case       3063: c = "MQCACF_UOW_LOG_START_TIME"; break;
   case       3064: c = "MQCACF_UOW_LOG_EXTENT_NAME"; break;
   case       3065: c = "MQCACF_PRINCIPAL_ENTITY_NAMES"; break;
   case       3066: c = "MQCACF_GROUP_ENTITY_NAMES"; break;
   case       3067: c = "MQCACF_AUTH_PROFILE_NAME"; break;
   case       3068: c = "MQCACF_ENTITY_NAME"; break;
   case       3069: c = "MQCACF_SERVICE_COMPONENT"; break;
   case       3070: c = "MQCACF_RESPONSE_Q_MGR_NAME"; break;
   case       3071: c = "MQCACF_CURRENT_LOG_EXTENT_NAME"; break;
   case       3072: c = "MQCACF_RESTART_LOG_EXTENT_NAME"; break;
   case       3073: c = "MQCACF_MEDIA_LOG_EXTENT_NAME"; break;
   case       3074: c = "MQCACF_LOG_PATH"; break;
   case       3075: c = "MQCACF_COMMAND_MQSC"; break;
   case       3076: c = "MQCACF_Q_MGR_CPF"; break;
   case       3078: c = "MQCACF_USAGE_LOG_RBA"; break;
   case       3079: c = "MQCACF_USAGE_LOG_LRSN"; break;
   case       3080: c = "MQCACF_COMMAND_SCOPE"; break;
   case       3081: c = "MQCACF_ASID"; break;
   case       3082: c = "MQCACF_PSB_NAME"; break;
   case       3083: c = "MQCACF_PST_ID"; break;
   case       3084: c = "MQCACF_TASK_NUMBER"; break;
   case       3085: c = "MQCACF_TRANSACTION_ID"; break;
   case       3086: c = "MQCACF_Q_MGR_UOW_ID"; break;
   case       3088: c = "MQCACF_ORIGIN_NAME"; break;
   case       3089: c = "MQCACF_ENV_INFO"; break;
   case       3090: c = "MQCACF_SECURITY_PROFILE"; break;
   case       3091: c = "MQCACF_CONFIGURATION_DATE"; break;
   case       3092: c = "MQCACF_CONFIGURATION_TIME"; break;
   case       3093: c = "MQCACF_FROM_CF_STRUC_NAME"; break;
   case       3094: c = "MQCACF_TO_CF_STRUC_NAME"; break;
   case       3095: c = "MQCACF_CF_STRUC_NAMES"; break;
   case       3096: c = "MQCACF_FAIL_DATE"; break;
   case       3097: c = "MQCACF_FAIL_TIME"; break;
   case       3098: c = "MQCACF_BACKUP_DATE"; break;
   case       3099: c = "MQCACF_BACKUP_TIME"; break;
   case       3100: c = "MQCACF_SYSTEM_NAME"; break;
   case       3101: c = "MQCACF_CF_STRUC_BACKUP_START"; break;
   case       3102: c = "MQCACF_CF_STRUC_BACKUP_END"; break;
   case       3103: c = "MQCACF_CF_STRUC_LOG_Q_MGRS"; break;
   case       3104: c = "MQCACF_FROM_STORAGE_CLASS"; break;
   case       3105: c = "MQCACF_TO_STORAGE_CLASS"; break;
   case       3106: c = "MQCACF_STORAGE_CLASS_NAMES"; break;
   case       3108: c = "MQCACF_DSG_NAME"; break;
   case       3109: c = "MQCACF_DB2_NAME"; break;
   case       3110: c = "MQCACF_SYSP_CMD_USER_ID"; break;
   case       3111: c = "MQCACF_SYSP_OTMA_GROUP"; break;
   case       3112: c = "MQCACF_SYSP_OTMA_MEMBER"; break;
   case       3113: c = "MQCACF_SYSP_OTMA_DRU_EXIT"; break;
   case       3114: c = "MQCACF_SYSP_OTMA_TPIPE_PFX"; break;
   case       3115: c = "MQCACF_SYSP_ARCHIVE_PFX1"; break;
   case       3116: c = "MQCACF_SYSP_ARCHIVE_UNIT1"; break;
   case       3117: c = "MQCACF_SYSP_LOG_CORREL_ID"; break;
   case       3118: c = "MQCACF_SYSP_UNIT_VOLSER"; break;
   case       3119: c = "MQCACF_SYSP_Q_MGR_TIME"; break;
   case       3120: c = "MQCACF_SYSP_Q_MGR_DATE"; break;
   case       3121: c = "MQCACF_SYSP_Q_MGR_RBA"; break;
   case       3122: c = "MQCACF_SYSP_LOG_RBA"; break;
   case       3123: c = "MQCACF_SYSP_SERVICE"; break;
   case       3124: c = "MQCACF_FROM_LISTENER_NAME"; break;
   case       3125: c = "MQCACF_TO_LISTENER_NAME"; break;
   case       3126: c = "MQCACF_FROM_SERVICE_NAME"; break;
   case       3127: c = "MQCACF_TO_SERVICE_NAME"; break;
   case       3128: c = "MQCACF_LAST_PUT_DATE"; break;
   case       3129: c = "MQCACF_LAST_PUT_TIME"; break;
   case       3130: c = "MQCACF_LAST_GET_DATE"; break;
   case       3131: c = "MQCACF_LAST_GET_TIME"; break;
   case       3132: c = "MQCACF_OPERATION_DATE"; break;
   case       3133: c = "MQCACF_OPERATION_TIME"; break;
   case       3134: c = "MQCACF_ACTIVITY_DESC"; break;
   case       3135: c = "MQCACF_APPL_IDENTITY_DATA"; break;
   case       3136: c = "MQCACF_APPL_ORIGIN_DATA"; break;
   case       3137: c = "MQCACF_PUT_DATE"; break;
   case       3138: c = "MQCACF_PUT_TIME"; break;
   case       3139: c = "MQCACF_REPLY_TO_Q"; break;
   case       3140: c = "MQCACF_REPLY_TO_Q_MGR"; break;
   case       3141: c = "MQCACF_RESOLVED_Q_NAME"; break;
   case       3142: c = "MQCACF_STRUC_ID"; break;
   case       3143: c = "MQCACF_VALUE_NAME"; break;
   case       3144: c = "MQCACF_SERVICE_START_DATE"; break;
   case       3145: c = "MQCACF_SERVICE_START_TIME"; break;
   case       3146: c = "MQCACF_SYSP_OFFLINE_RBA"; break;
   case       3147: c = "MQCACF_SYSP_ARCHIVE_PFX2"; break;
   case       3148: c = "MQCACF_SYSP_ARCHIVE_UNIT2"; break;
   case       3149: c = "MQCACF_TO_TOPIC_NAME"; break;
   case       3150: c = "MQCACF_FROM_TOPIC_NAME"; break;
   case       3151: c = "MQCACF_TOPIC_NAMES"; break;
   case       3152: c = "MQCACF_SUB_NAME"; break;
   case       3153: c = "MQCACF_DESTINATION_Q_MGR"; break;
   case       3154: c = "MQCACF_DESTINATION"; break;
   case       3156: c = "MQCACF_SUB_USER_ID"; break;
   case       3159: c = "MQCACF_SUB_USER_DATA"; break;
   case       3160: c = "MQCACF_SUB_SELECTOR"; break;
   case       3161: c = "MQCACF_LAST_PUB_DATE"; break;
   case       3162: c = "MQCACF_LAST_PUB_TIME"; break;
   case       3163: c = "MQCACF_FROM_SUB_NAME"; break;
   case       3164: c = "MQCACF_TO_SUB_NAME"; break;
   case       3167: c = "MQCACF_LAST_MSG_TIME"; break;
   case       3168: c = "MQCACF_LAST_MSG_DATE"; break;
   case       3169: c = "MQCACF_SUBSCRIPTION_POINT"; break;
   case       3170: c = "MQCACF_FILTER"; break;
   case       3171: c = "MQCACF_NONE"; break;
   case       3172: c = "MQCACF_ADMIN_TOPIC_NAMES"; break;
   case       3173: c = "MQCACF_ROUTING_FINGER_PRINT"; break;
   case       3174: c = "MQCACF_APPL_DESC"; break;
   case       3175: c = "MQCACF_Q_MGR_START_DATE"; break;
   case       3176: c = "MQCACF_Q_MGR_START_TIME"; break;
   case       3177: c = "MQCACF_FROM_COMM_INFO_NAME"; break;
   case       3178: c = "MQCACF_TO_COMM_INFO_NAME"; break;
   case       3179: c = "MQCACF_CF_OFFLOAD_SIZE1"; break;
   case       3180: c = "MQCACF_CF_OFFLOAD_SIZE2"; break;
   case       3181: c = "MQCACF_CF_OFFLOAD_SIZE3"; break;
   case       3182: c = "MQCACF_CF_SMDS_GENERIC_NAME"; break;
   case       3183: c = "MQCACF_CF_SMDS"; break;
   case       3184: c = "MQCACF_RECOVERY_DATE"; break;
   case       3185: c = "MQCACF_RECOVERY_TIME"; break;
   case       3186: c = "MQCACF_CF_SMDSCONN"; break;
   case       3187: c = "MQCACF_CF_STRUC_NAME"; break;
   case       3188: c = "MQCACF_ALTERNATE_USERID"; break;
   case       3189: c = "MQCACF_CHAR_ATTRS"; break;
   case       3190: c = "MQCACF_DYNAMIC_Q_NAME"; break;
   case       3191: c = "MQCACF_HOST_NAME"; break;
   case       3192: c = "MQCACF_MQCB_NAME"; break;
   case       3193: c = "MQCACF_OBJECT_STRING"; break;
   case       3194: c = "MQCACF_RESOLVED_LOCAL_Q_MGR"; break;
   case       3195: c = "MQCACF_RESOLVED_LOCAL_Q_NAME"; break;
   case       3196: c = "MQCACF_RESOLVED_OBJECT_STRING"; break;
   case       3197: c = "MQCACF_RESOLVED_Q_MGR"; break;
   case       3198: c = "MQCACF_SELECTION_STRING"; break;
   case       3199: c = "MQCACF_XA_INFO"; break;
   case       3200: c = "MQCACF_APPL_FUNCTION"; break;
   case       3201: c = "MQCACF_XQH_REMOTE_Q_NAME"; break;
   case       3202: c = "MQCACF_XQH_REMOTE_Q_MGR"; break;
   case       3203: c = "MQCACF_XQH_PUT_TIME"; break;
   case       3204: c = "MQCACF_XQH_PUT_DATE"; break;
   case       3205: c = "MQCACF_EXCL_OPERATOR_MESSAGES"; break;
   case       3206: c = "MQCACF_CSP_USER_IDENTIFIER"; break;
   case       3207: c = "MQCACF_AMQP_CLIENT_ID"; break;
   case       3208: c = "MQCACF_ARCHIVE_LOG_EXTENT_NAME"; break;
   case       3209: c = "MQCACF_APPL_IMMOVABLE_DATE"; break;
   case       3210: c = "MQCACF_APPL_IMMOVABLE_TIME"; break;
   case       5507: c = "MQCACF_CLUS_CHAN_Q_MGR_NAME"; break;
   case       5508: c = "MQCACF_CLUS_SHORT_CONN_NAME"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCACH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case       3501: c = "MQCACH_CHANNEL_NAME"; break;
   case       3502: c = "MQCACH_DESC"; break;
   case       3503: c = "MQCACH_MODE_NAME"; break;
   case       3504: c = "MQCACH_TP_NAME"; break;
   case       3505: c = "MQCACH_XMIT_Q_NAME"; break;
   case       3506: c = "MQCACH_CONNECTION_NAME"; break;
   case       3507: c = "MQCACH_MCA_NAME"; break;
   case       3508: c = "MQCACH_SEC_EXIT_NAME"; break;
   case       3509: c = "MQCACH_MSG_EXIT_NAME"; break;
   case       3510: c = "MQCACH_SEND_EXIT_NAME"; break;
   case       3511: c = "MQCACH_RCV_EXIT_NAME"; break;
   case       3512: c = "MQCACH_CHANNEL_NAMES"; break;
   case       3513: c = "MQCACH_SEC_EXIT_USER_DATA"; break;
   case       3514: c = "MQCACH_MSG_EXIT_USER_DATA"; break;
   case       3515: c = "MQCACH_SEND_EXIT_USER_DATA"; break;
   case       3516: c = "MQCACH_RCV_EXIT_USER_DATA"; break;
   case       3517: c = "MQCACH_USER_ID"; break;
   case       3518: c = "MQCACH_PASSWORD"; break;
   case       3520: c = "MQCACH_LOCAL_ADDRESS"; break;
   case       3521: c = "MQCACH_LOCAL_NAME"; break;
   case       3524: c = "MQCACH_LAST_MSG_TIME"; break;
   case       3525: c = "MQCACH_LAST_MSG_DATE"; break;
   case       3527: c = "MQCACH_MCA_USER_ID"; break;
   case       3528: c = "MQCACH_CHANNEL_START_TIME"; break;
   case       3529: c = "MQCACH_CHANNEL_START_DATE"; break;
   case       3530: c = "MQCACH_MCA_JOB_NAME"; break;
   case       3531: c = "MQCACH_LAST_LUWID"; break;
   case       3532: c = "MQCACH_CURRENT_LUWID"; break;
   case       3533: c = "MQCACH_FORMAT_NAME"; break;
   case       3534: c = "MQCACH_MR_EXIT_NAME"; break;
   case       3535: c = "MQCACH_MR_EXIT_USER_DATA"; break;
   case       3544: c = "MQCACH_SSL_CIPHER_SPEC"; break;
   case       3545: c = "MQCACH_SSL_PEER_NAME"; break;
   case       3546: c = "MQCACH_SSL_HANDSHAKE_STAGE"; break;
   case       3547: c = "MQCACH_SSL_SHORT_PEER_NAME"; break;
   case       3548: c = "MQCACH_REMOTE_APPL_TAG"; break;
   case       3549: c = "MQCACH_SSL_CERT_USER_ID"; break;
   case       3550: c = "MQCACH_SSL_CERT_ISSUER_NAME"; break;
   case       3551: c = "MQCACH_LU_NAME"; break;
   case       3552: c = "MQCACH_IP_ADDRESS"; break;
   case       3553: c = "MQCACH_TCP_NAME"; break;
   case       3554: c = "MQCACH_LISTENER_NAME"; break;
   case       3555: c = "MQCACH_LISTENER_DESC"; break;
   case       3556: c = "MQCACH_LISTENER_START_DATE"; break;
   case       3557: c = "MQCACH_LISTENER_START_TIME"; break;
   case       3558: c = "MQCACH_SSL_KEY_RESET_DATE"; break;
   case       3559: c = "MQCACH_SSL_KEY_RESET_TIME"; break;
   case       3560: c = "MQCACH_REMOTE_VERSION"; break;
   case       3561: c = "MQCACH_REMOTE_PRODUCT"; break;
   case       3562: c = "MQCACH_GROUP_ADDRESS"; break;
   case       3563: c = "MQCACH_JAAS_CONFIG"; break;
   case       3564: c = "MQCACH_CLIENT_ID"; break;
   case       3565: c = "MQCACH_SSL_KEY_PASSPHRASE"; break;
   case       3566: c = "MQCACH_CONNECTION_NAME_LIST"; break;
   case       3567: c = "MQCACH_CLIENT_USER_ID"; break;
   case       3568: c = "MQCACH_MCA_USER_ID_LIST"; break;
   case       3569: c = "MQCACH_SSL_CIPHER_SUITE"; break;
   case       3570: c = "MQCACH_WEBCONTENT_PATH"; break;
   case       3571: c = "MQCACH_TOPIC_ROOT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCADSD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCADSD_NONE"; break;
   case          1: c = "MQCADSD_SEND"; break;
   case         16: c = "MQCADSD_RECV"; break;
   case        256: c = "MQCADSD_MSGFORMAT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCAFTY_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCAFTY_NONE"; break;
   case          1: c = "MQCAFTY_PREFERRED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCAMO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case       2701: c = "MQCAMO_CLOSE_DATE"; break;
   case       2702: c = "MQCAMO_CLOSE_TIME"; break;
   case       2703: c = "MQCAMO_CONN_DATE"; break;
   case       2704: c = "MQCAMO_CONN_TIME"; break;
   case       2705: c = "MQCAMO_DISC_DATE"; break;
   case       2706: c = "MQCAMO_DISC_TIME"; break;
   case       2707: c = "MQCAMO_END_DATE"; break;
   case       2708: c = "MQCAMO_END_TIME"; break;
   case       2709: c = "MQCAMO_OPEN_DATE"; break;
   case       2710: c = "MQCAMO_OPEN_TIME"; break;
   case       2711: c = "MQCAMO_START_DATE"; break;
   case       2712: c = "MQCAMO_START_TIME"; break;
   case       2713: c = "MQCAMO_MONITOR_CLASS"; break;
   case       2714: c = "MQCAMO_MONITOR_TYPE"; break;
   case       2715: c = "MQCAMO_MONITOR_DESC"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCAP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCAP_NOT_SUPPORTED"; break;
   case          1: c = "MQCAP_SUPPORTED"; break;
   case          2: c = "MQCAP_EXPIRED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCAUT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCAUT_ALL"; break;
   case          1: c = "MQCAUT_BLOCKUSER"; break;
   case          2: c = "MQCAUT_BLOCKADDR"; break;
   case          3: c = "MQCAUT_SSLPEERMAP"; break;
   case          4: c = "MQCAUT_ADDRESSMAP"; break;
   case          5: c = "MQCAUT_USERMAP"; break;
   case          6: c = "MQCAUT_QMGRMAP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCA_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case       2001: c = "MQCA_APPL_ID"; break;
   case       2002: c = "MQCA_BASE_OBJECT_NAME"; break;
   case       2003: c = "MQCA_COMMAND_INPUT_Q_NAME"; break;
   case       2004: c = "MQCA_CREATION_DATE"; break;
   case       2005: c = "MQCA_CREATION_TIME"; break;
   case       2006: c = "MQCA_DEAD_LETTER_Q_NAME"; break;
   case       2007: c = "MQCA_ENV_DATA"; break;
   case       2008: c = "MQCA_INITIATION_Q_NAME"; break;
   case       2009: c = "MQCA_NAMELIST_DESC"; break;
   case       2010: c = "MQCA_NAMELIST_NAME"; break;
   case       2011: c = "MQCA_PROCESS_DESC"; break;
   case       2012: c = "MQCA_PROCESS_NAME"; break;
   case       2013: c = "MQCA_Q_DESC"; break;
   case       2014: c = "MQCA_Q_MGR_DESC"; break;
   case       2015: c = "MQCA_Q_MGR_NAME"; break;
   case       2016: c = "MQCA_Q_NAME"; break;
   case       2017: c = "MQCA_REMOTE_Q_MGR_NAME"; break;
   case       2018: c = "MQCA_REMOTE_Q_NAME"; break;
   case       2019: c = "MQCA_BACKOUT_REQ_Q_NAME"; break;
   case       2020: c = "MQCA_NAMES"; break;
   case       2021: c = "MQCA_USER_DATA"; break;
   case       2022: c = "MQCA_STORAGE_CLASS"; break;
   case       2023: c = "MQCA_TRIGGER_DATA"; break;
   case       2024: c = "MQCA_XMIT_Q_NAME"; break;
   case       2025: c = "MQCA_DEF_XMIT_Q_NAME"; break;
   case       2026: c = "MQCA_CHANNEL_AUTO_DEF_EXIT"; break;
   case       2027: c = "MQCA_ALTERATION_DATE"; break;
   case       2028: c = "MQCA_ALTERATION_TIME"; break;
   case       2029: c = "MQCA_CLUSTER_NAME"; break;
   case       2030: c = "MQCA_CLUSTER_NAMELIST"; break;
   case       2031: c = "MQCA_CLUSTER_Q_MGR_NAME"; break;
   case       2032: c = "MQCA_Q_MGR_IDENTIFIER"; break;
   case       2033: c = "MQCA_CLUSTER_WORKLOAD_EXIT"; break;
   case       2034: c = "MQCA_CLUSTER_WORKLOAD_DATA"; break;
   case       2035: c = "MQCA_REPOSITORY_NAME"; break;
   case       2036: c = "MQCA_REPOSITORY_NAMELIST"; break;
   case       2037: c = "MQCA_CLUSTER_DATE"; break;
   case       2038: c = "MQCA_CLUSTER_TIME"; break;
   case       2039: c = "MQCA_CF_STRUC_NAME"; break;
   case       2040: c = "MQCA_QSG_NAME"; break;
   case       2041: c = "MQCA_IGQ_USER_ID"; break;
   case       2042: c = "MQCA_STORAGE_CLASS_DESC"; break;
   case       2043: c = "MQCA_XCF_GROUP_NAME"; break;
   case       2044: c = "MQCA_XCF_MEMBER_NAME"; break;
   case       2045: c = "MQCA_AUTH_INFO_NAME"; break;
   case       2046: c = "MQCA_AUTH_INFO_DESC"; break;
   case       2047: c = "MQCA_LDAP_USER_NAME"; break;
   case       2048: c = "MQCA_LDAP_PASSWORD"; break;
   case       2049: c = "MQCA_SSL_KEY_REPOSITORY"; break;
   case       2050: c = "MQCA_SSL_CRL_NAMELIST"; break;
   case       2051: c = "MQCA_SSL_CRYPTO_HARDWARE"; break;
   case       2052: c = "MQCA_CF_STRUC_DESC"; break;
   case       2053: c = "MQCA_AUTH_INFO_CONN_NAME"; break;
   case       2060: c = "MQCA_CICS_FILE_NAME"; break;
   case       2061: c = "MQCA_TRIGGER_TRANS_ID"; break;
   case       2062: c = "MQCA_TRIGGER_PROGRAM_NAME"; break;
   case       2063: c = "MQCA_TRIGGER_TERM_ID"; break;
   case       2064: c = "MQCA_TRIGGER_CHANNEL_NAME"; break;
   case       2065: c = "MQCA_SYSTEM_LOG_Q_NAME"; break;
   case       2066: c = "MQCA_MONITOR_Q_NAME"; break;
   case       2067: c = "MQCA_COMMAND_REPLY_Q_NAME"; break;
   case       2068: c = "MQCA_BATCH_INTERFACE_ID"; break;
   case       2069: c = "MQCA_SSL_KEY_LIBRARY"; break;
   case       2070: c = "MQCA_SSL_KEY_MEMBER"; break;
   case       2071: c = "MQCA_DNS_GROUP"; break;
   case       2072: c = "MQCA_LU_GROUP_NAME"; break;
   case       2073: c = "MQCA_LU_NAME"; break;
   case       2074: c = "MQCA_LU62_ARM_SUFFIX"; break;
   case       2075: c = "MQCA_TCP_NAME"; break;
   case       2076: c = "MQCA_CHINIT_SERVICE_PARM"; break;
   case       2077: c = "MQCA_SERVICE_NAME"; break;
   case       2078: c = "MQCA_SERVICE_DESC"; break;
   case       2079: c = "MQCA_SERVICE_START_COMMAND"; break;
   case       2080: c = "MQCA_SERVICE_START_ARGS"; break;
   case       2081: c = "MQCA_SERVICE_STOP_COMMAND"; break;
   case       2082: c = "MQCA_SERVICE_STOP_ARGS"; break;
   case       2083: c = "MQCA_STDOUT_DESTINATION"; break;
   case       2084: c = "MQCA_STDERR_DESTINATION"; break;
   case       2085: c = "MQCA_TPIPE_NAME"; break;
   case       2086: c = "MQCA_PASS_TICKET_APPL"; break;
   case       2090: c = "MQCA_AUTO_REORG_START_TIME"; break;
   case       2091: c = "MQCA_AUTO_REORG_CATALOG"; break;
   case       2092: c = "MQCA_TOPIC_NAME"; break;
   case       2093: c = "MQCA_TOPIC_DESC"; break;
   case       2094: c = "MQCA_TOPIC_STRING"; break;
   case       2096: c = "MQCA_MODEL_DURABLE_Q"; break;
   case       2097: c = "MQCA_MODEL_NON_DURABLE_Q"; break;
   case       2098: c = "MQCA_RESUME_DATE"; break;
   case       2099: c = "MQCA_RESUME_TIME"; break;
   case       2101: c = "MQCA_CHILD"; break;
   case       2102: c = "MQCA_PARENT"; break;
   case       2105: c = "MQCA_ADMIN_TOPIC_NAME"; break;
   case       2108: c = "MQCA_TOPIC_STRING_FILTER"; break;
   case       2109: c = "MQCA_AUTH_INFO_OCSP_URL"; break;
   case       2110: c = "MQCA_COMM_INFO_NAME"; break;
   case       2111: c = "MQCA_COMM_INFO_DESC"; break;
   case       2112: c = "MQCA_POLICY_NAME"; break;
   case       2113: c = "MQCA_SIGNER_DN"; break;
   case       2114: c = "MQCA_RECIPIENT_DN"; break;
   case       2115: c = "MQCA_INSTALLATION_DESC"; break;
   case       2116: c = "MQCA_INSTALLATION_NAME"; break;
   case       2117: c = "MQCA_INSTALLATION_PATH"; break;
   case       2118: c = "MQCA_CHLAUTH_DESC"; break;
   case       2119: c = "MQCA_CUSTOM"; break;
   case       2120: c = "MQCA_VERSION"; break;
   case       2121: c = "MQCA_CERT_LABEL"; break;
   case       2122: c = "MQCA_XR_VERSION"; break;
   case       2123: c = "MQCA_XR_SSL_CIPHER_SUITES"; break;
   case       2124: c = "MQCA_CLUS_CHL_NAME"; break;
   case       2125: c = "MQCA_CONN_AUTH"; break;
   case       2126: c = "MQCA_LDAP_BASE_DN_USERS"; break;
   case       2127: c = "MQCA_LDAP_SHORT_USER_FIELD"; break;
   case       2128: c = "MQCA_LDAP_USER_OBJECT_CLASS"; break;
   case       2129: c = "MQCA_LDAP_USER_ATTR_FIELD"; break;
   case       2130: c = "MQCA_SSL_CERT_ISSUER_NAME"; break;
   case       2131: c = "MQCA_QSG_CERT_LABEL"; break;
   case       2132: c = "MQCA_LDAP_BASE_DN_GROUPS"; break;
   case       2133: c = "MQCA_LDAP_GROUP_OBJECT_CLASS"; break;
   case       2134: c = "MQCA_LDAP_GROUP_ATTR_FIELD"; break;
   case       2135: c = "MQCA_LDAP_FIND_GROUP_FIELD"; break;
   case       2136: c = "MQCA_AMQP_VERSION"; break;
   case       2137: c = "MQCA_AMQP_SSL_CIPHER_SUITES"; break;
   case       4000: c = "MQCA_USER_LIST"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCBCF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCBCF_NONE"; break;
   case          1: c = "MQCBCF_READA_BUFFER_EMPTY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCBCT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQCBCT_START_CALL"; break;
   case          2: c = "MQCBCT_STOP_CALL"; break;
   case          3: c = "MQCBCT_REGISTER_CALL"; break;
   case          4: c = "MQCBCT_DEREGISTER_CALL"; break;
   case          5: c = "MQCBCT_EVENT_CALL"; break;
   case          6: c = "MQCBCT_MSG_REMOVED"; break;
   case          7: c = "MQCBCT_MSG_NOT_REMOVED"; break;
   case          8: c = "MQCBCT_MC_EVENT_CALL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCBDO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCBDO_NONE"; break;
   case          1: c = "MQCBDO_START_CALL"; break;
   case          4: c = "MQCBDO_STOP_CALL"; break;
   case        256: c = "MQCBDO_REGISTER_CALL"; break;
   case        512: c = "MQCBDO_DEREGISTER_CALL"; break;
   case       8192: c = "MQCBDO_FAIL_IF_QUIESCING"; break;
   case      16384: c = "MQCBDO_EVENT_CALL"; break;
   case      32768: c = "MQCBDO_MC_EVENT_CALL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCBD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQCBD_FULL_MSG_LENGTH"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCBO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCBO_NONE"; break;
   case          1: c = "MQCBO_ADMIN_BAG"; break;
   case          2: c = "MQCBO_LIST_FORM_ALLOWED"; break;
   case          4: c = "MQCBO_REORDER_AS_REQUIRED"; break;
   case          8: c = "MQCBO_CHECK_SELECTORS"; break;
   case         16: c = "MQCBO_COMMAND_BAG"; break;
   case         32: c = "MQCBO_SYSTEM_BAG"; break;
   case         64: c = "MQCBO_GROUP_BAG"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCBT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQCBT_MESSAGE_CONSUMER"; break;
   case          2: c = "MQCBT_EVENT_HANDLER"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCCSI_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -4: c = "MQCCSI_AS_PUBLISHED"; break;
   case         -3: c = "MQCCSI_APPL"; break;
   case         -2: c = "MQCCSI_INHERIT"; break;
   case         -1: c = "MQCCSI_EMBEDDED"; break;
   case          0: c = "MQCCSI_DEFAULT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCCT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCCT_NO"; break;
   case          1: c = "MQCCT_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQCC_UNKNOWN"; break;
   case          0: c = "MQCC_OK"; break;
   case          1: c = "MQCC_WARNING"; break;
   case          2: c = "MQCC_FAILED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCDC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCDC_NO_SENDER_CONVERSION"; break;
   case          1: c = "MQCDC_SENDER_CONVERSION"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCFACCESS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCFACCESS_ENABLED"; break;
   case          1: c = "MQCFACCESS_SUSPENDED"; break;
   case          2: c = "MQCFACCESS_DISABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCFCONLOS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCFCONLOS_TERMINATE"; break;
   case          1: c = "MQCFCONLOS_TOLERATE"; break;
   case          2: c = "MQCFCONLOS_ASQMGR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCFOFFLD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCFOFFLD_NONE"; break;
   case          1: c = "MQCFOFFLD_SMDS"; break;
   case          2: c = "MQCFOFFLD_DB2"; break;
   case          3: c = "MQCFOFFLD_BOTH"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCFOP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQCFOP_LESS"; break;
   case          2: c = "MQCFOP_EQUAL"; break;
   case          3: c = "MQCFOP_NOT_GREATER"; break;
   case          4: c = "MQCFOP_GREATER"; break;
   case          5: c = "MQCFOP_NOT_EQUAL"; break;
   case          6: c = "MQCFOP_NOT_LESS"; break;
   case         10: c = "MQCFOP_CONTAINS"; break;
   case         13: c = "MQCFOP_EXCLUDES"; break;
   case         18: c = "MQCFOP_LIKE"; break;
   case         21: c = "MQCFOP_NOT_LIKE"; break;
   case         26: c = "MQCFOP_CONTAINS_GEN"; break;
   case         29: c = "MQCFOP_EXCLUDES_GEN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCFO_REFRESH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCFO_REFRESH_REPOSITORY_NO"; break;
   case          1: c = "MQCFO_REFRESH_REPOSITORY_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCFO_REMOVE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCFO_REMOVE_QUEUES_NO"; break;
   case          1: c = "MQCFO_REMOVE_QUEUES_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCFR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCFR_NO"; break;
   case          1: c = "MQCFR_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCFSTATUS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCFSTATUS_NOT_FOUND"; break;
   case          1: c = "MQCFSTATUS_ACTIVE"; break;
   case          2: c = "MQCFSTATUS_IN_RECOVER"; break;
   case          3: c = "MQCFSTATUS_IN_BACKUP"; break;
   case          4: c = "MQCFSTATUS_FAILED"; break;
   case          5: c = "MQCFSTATUS_NONE"; break;
   case          6: c = "MQCFSTATUS_UNKNOWN"; break;
   case          7: c = "MQCFSTATUS_RECOVERED"; break;
   case          8: c = "MQCFSTATUS_EMPTY"; break;
   case          9: c = "MQCFSTATUS_NEW"; break;
   case         20: c = "MQCFSTATUS_ADMIN_INCOMPLETE"; break;
   case         21: c = "MQCFSTATUS_NEVER_USED"; break;
   case         22: c = "MQCFSTATUS_NO_BACKUP"; break;
   case         23: c = "MQCFSTATUS_NOT_FAILED"; break;
   case         24: c = "MQCFSTATUS_NOT_RECOVERABLE"; break;
   case         25: c = "MQCFSTATUS_XES_ERROR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCFTYPE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCFTYPE_APPL"; break;
   case          1: c = "MQCFTYPE_ADMIN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCFT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCFT_NONE"; break;
   case          1: c = "MQCFT_COMMAND"; break;
   case          2: c = "MQCFT_RESPONSE"; break;
   case          3: c = "MQCFT_INTEGER"; break;
   case          4: c = "MQCFT_STRING"; break;
   case          5: c = "MQCFT_INTEGER_LIST"; break;
   case          6: c = "MQCFT_STRING_LIST"; break;
   case          7: c = "MQCFT_EVENT"; break;
   case          8: c = "MQCFT_USER"; break;
   case          9: c = "MQCFT_BYTE_STRING"; break;
   case         10: c = "MQCFT_TRACE_ROUTE"; break;
   case         12: c = "MQCFT_REPORT"; break;
   case         13: c = "MQCFT_INTEGER_FILTER"; break;
   case         14: c = "MQCFT_STRING_FILTER"; break;
   case         15: c = "MQCFT_BYTE_STRING_FILTER"; break;
   case         16: c = "MQCFT_COMMAND_XR"; break;
   case         17: c = "MQCFT_XR_MSG"; break;
   case         18: c = "MQCFT_XR_ITEM"; break;
   case         19: c = "MQCFT_XR_SUMMARY"; break;
   case         20: c = "MQCFT_GROUP"; break;
   case         21: c = "MQCFT_STATISTICS"; break;
   case         22: c = "MQCFT_ACCOUNTING"; break;
   case         23: c = "MQCFT_INTEGER64"; break;
   case         25: c = "MQCFT_INTEGER64_LIST"; break;
   case         26: c = "MQCFT_APP_ACTIVITY"; break;
   case         27: c = "MQCFT_STATUS"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCF_NONE"; break;
   case          1: c = "MQCF_DIST_LISTS"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCGWI_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -2: c = "MQCGWI_DEFAULT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHAD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCHAD_DISABLED"; break;
   case          1: c = "MQCHAD_ENABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHIDS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCHIDS_NOT_INDOUBT"; break;
   case          1: c = "MQCHIDS_INDOUBT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHK_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCHK_OPTIONAL"; break;
   case          1: c = "MQCHK_NONE"; break;
   case          2: c = "MQCHK_REQUIRED_ADMIN"; break;
   case          3: c = "MQCHK_REQUIRED"; break;
   case          4: c = "MQCHK_AS_Q_MGR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHLA_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCHLA_DISABLED"; break;
   case          1: c = "MQCHLA_ENABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHLD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQCHLD_ALL"; break;
   case          1: c = "MQCHLD_DEFAULT"; break;
   case          2: c = "MQCHLD_SHARED"; break;
   case          4: c = "MQCHLD_PRIVATE"; break;
   case          5: c = "MQCHLD_FIXSHARED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHRR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCHRR_RESET_NOT_REQUESTED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHSH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCHSH_RESTART_NO"; break;
   case          1: c = "MQCHSH_RESTART_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHSR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCHSR_STOP_NOT_REQUESTED"; break;
   case          1: c = "MQCHSR_STOP_REQUESTED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHSSTATE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCHSSTATE_OTHER"; break;
   case        100: c = "MQCHSSTATE_END_OF_BATCH"; break;
   case        200: c = "MQCHSSTATE_SENDING"; break;
   case        300: c = "MQCHSSTATE_RECEIVING"; break;
   case        400: c = "MQCHSSTATE_SERIALIZING"; break;
   case        500: c = "MQCHSSTATE_RESYNCHING"; break;
   case        600: c = "MQCHSSTATE_HEARTBEATING"; break;
   case        700: c = "MQCHSSTATE_IN_SCYEXIT"; break;
   case        800: c = "MQCHSSTATE_IN_RCVEXIT"; break;
   case        900: c = "MQCHSSTATE_IN_SENDEXIT"; break;
   case       1000: c = "MQCHSSTATE_IN_MSGEXIT"; break;
   case       1100: c = "MQCHSSTATE_IN_MREXIT"; break;
   case       1200: c = "MQCHSSTATE_IN_CHADEXIT"; break;
   case       1250: c = "MQCHSSTATE_NET_CONNECTING"; break;
   case       1300: c = "MQCHSSTATE_SSL_HANDSHAKING"; break;
   case       1400: c = "MQCHSSTATE_NAME_SERVER"; break;
   case       1500: c = "MQCHSSTATE_IN_MQPUT"; break;
   case       1600: c = "MQCHSSTATE_IN_MQGET"; break;
   case       1700: c = "MQCHSSTATE_IN_MQI_CALL"; break;
   case       1800: c = "MQCHSSTATE_COMPRESSING"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCHS_INACTIVE"; break;
   case          1: c = "MQCHS_BINDING"; break;
   case          2: c = "MQCHS_STARTING"; break;
   case          3: c = "MQCHS_RUNNING"; break;
   case          4: c = "MQCHS_STOPPING"; break;
   case          5: c = "MQCHS_RETRYING"; break;
   case          6: c = "MQCHS_STOPPED"; break;
   case          7: c = "MQCHS_REQUESTING"; break;
   case          8: c = "MQCHS_PAUSED"; break;
   case          9: c = "MQCHS_DISCONNECTED"; break;
   case         13: c = "MQCHS_INITIALIZING"; break;
   case         14: c = "MQCHS_SWITCHING"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHTAB_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQCHTAB_Q_MGR"; break;
   case          2: c = "MQCHTAB_CLNTCONN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCHT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQCHT_SENDER"; break;
   case          2: c = "MQCHT_SERVER"; break;
   case          3: c = "MQCHT_RECEIVER"; break;
   case          4: c = "MQCHT_REQUESTER"; break;
   case          5: c = "MQCHT_ALL"; break;
   case          6: c = "MQCHT_CLNTCONN"; break;
   case          7: c = "MQCHT_SVRCONN"; break;
   case          8: c = "MQCHT_CLUSRCVR"; break;
   case          9: c = "MQCHT_CLUSSDR"; break;
   case         10: c = "MQCHT_MQTT"; break;
   case         11: c = "MQCHT_AMQP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCIH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCIH_NONE"; break;
   case          1: c = "MQCIH_PASS_EXPIRATION"; break;
   case          2: c = "MQCIH_REPLY_WITHOUT_NULLS"; break;
   case          4: c = "MQCIH_SYNC_ON_RETURN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCIT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQCIT_MULTICAST"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCLCT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCLCT_STATIC"; break;
   case          1: c = "MQCLCT_DYNAMIC"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCLROUTE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCLROUTE_DIRECT"; break;
   case          1: c = "MQCLROUTE_TOPIC_HOST"; break;
   case          2: c = "MQCLROUTE_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCLRS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQCLRS_LOCAL"; break;
   case          2: c = "MQCLRS_GLOBAL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCLRT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQCLRT_RETAINED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCLST_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCLST_ACTIVE"; break;
   case          1: c = "MQCLST_PENDING"; break;
   case          2: c = "MQCLST_INVALID"; break;
   case          3: c = "MQCLST_ERROR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCLT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQCLT_PROGRAM"; break;
   case          2: c = "MQCLT_TRANSACTION"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCLWL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -3: c = "MQCLWL_USEQ_AS_Q_MGR"; break;
   case          0: c = "MQCLWL_USEQ_LOCAL"; break;
   case          1: c = "MQCLWL_USEQ_ANY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCLXQ_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCLXQ_SCTQ"; break;
   case          1: c = "MQCLXQ_CHANNEL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCMDI_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQCMDI_CMDSCOPE_ACCEPTED"; break;
   case          2: c = "MQCMDI_CMDSCOPE_GENERATED"; break;
   case          3: c = "MQCMDI_CMDSCOPE_COMPLETED"; break;
   case          4: c = "MQCMDI_QSG_DISP_COMPLETED"; break;
   case          5: c = "MQCMDI_COMMAND_ACCEPTED"; break;
   case          6: c = "MQCMDI_CLUSTER_REQUEST_QUEUED"; break;
   case          7: c = "MQCMDI_CHANNEL_INIT_STARTED"; break;
   case         11: c = "MQCMDI_RECOVER_STARTED"; break;
   case         12: c = "MQCMDI_BACKUP_STARTED"; break;
   case         13: c = "MQCMDI_RECOVER_COMPLETED"; break;
   case         14: c = "MQCMDI_SEC_TIMER_ZERO"; break;
   case         16: c = "MQCMDI_REFRESH_CONFIGURATION"; break;
   case         17: c = "MQCMDI_SEC_SIGNOFF_ERROR"; break;
   case         18: c = "MQCMDI_IMS_BRIDGE_SUSPENDED"; break;
   case         19: c = "MQCMDI_DB2_SUSPENDED"; break;
   case         20: c = "MQCMDI_DB2_OBSOLETE_MSGS"; break;
   case         21: c = "MQCMDI_SEC_UPPERCASE"; break;
   case         22: c = "MQCMDI_SEC_MIXEDCASE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCMDL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case        100: c = "MQCMDL_LEVEL_1"; break;
   case        101: c = "MQCMDL_LEVEL_101"; break;
   case        110: c = "MQCMDL_LEVEL_110"; break;
   case        114: c = "MQCMDL_LEVEL_114"; break;
   case        120: c = "MQCMDL_LEVEL_120"; break;
   case        200: c = "MQCMDL_LEVEL_200"; break;
   case        201: c = "MQCMDL_LEVEL_201"; break;
   case        210: c = "MQCMDL_LEVEL_210"; break;
   case        211: c = "MQCMDL_LEVEL_211"; break;
   case        220: c = "MQCMDL_LEVEL_220"; break;
   case        221: c = "MQCMDL_LEVEL_221"; break;
   case        230: c = "MQCMDL_LEVEL_230"; break;
   case        320: c = "MQCMDL_LEVEL_320"; break;
   case        420: c = "MQCMDL_LEVEL_420"; break;
   case        500: c = "MQCMDL_LEVEL_500"; break;
   case        510: c = "MQCMDL_LEVEL_510"; break;
   case        520: c = "MQCMDL_LEVEL_520"; break;
   case        530: c = "MQCMDL_LEVEL_530"; break;
   case        531: c = "MQCMDL_LEVEL_531"; break;
   case        600: c = "MQCMDL_LEVEL_600"; break;
   case        700: c = "MQCMDL_LEVEL_700"; break;
   case        701: c = "MQCMDL_LEVEL_701"; break;
   case        710: c = "MQCMDL_LEVEL_710"; break;
   case        711: c = "MQCMDL_LEVEL_711"; break;
   case        750: c = "MQCMDL_LEVEL_750"; break;
   case        800: c = "MQCMDL_LEVEL_800"; break;
   case        801: c = "MQCMDL_LEVEL_801"; break;
   case        802: c = "MQCMDL_LEVEL_802"; break;
   case        900: c = "MQCMDL_LEVEL_900"; break;
   case        901: c = "MQCMDL_LEVEL_901"; break;
   case        902: c = "MQCMDL_LEVEL_902"; break;
   case        903: c = "MQCMDL_LEVEL_903"; break;
   case        904: c = "MQCMDL_LEVEL_904"; break;
   case        905: c = "MQCMDL_LEVEL_905"; break;
   case        910: c = "MQCMDL_LEVEL_910"; break;
   case        911: c = "MQCMDL_LEVEL_911"; break;
   case        912: c = "MQCMDL_LEVEL_912"; break;
   case        913: c = "MQCMDL_LEVEL_913"; break;
   case        914: c = "MQCMDL_LEVEL_914"; break;
   case        915: c = "MQCMDL_LEVEL_915"; break;
   case        920: c = "MQCMDL_LEVEL_920"; break;
   case        921: c = "MQCMDL_LEVEL_921"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCMD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCMD_NONE"; break;
   case          1: c = "MQCMD_CHANGE_Q_MGR"; break;
   case          2: c = "MQCMD_INQUIRE_Q_MGR"; break;
   case          3: c = "MQCMD_CHANGE_PROCESS"; break;
   case          4: c = "MQCMD_COPY_PROCESS"; break;
   case          5: c = "MQCMD_CREATE_PROCESS"; break;
   case          6: c = "MQCMD_DELETE_PROCESS"; break;
   case          7: c = "MQCMD_INQUIRE_PROCESS"; break;
   case          8: c = "MQCMD_CHANGE_Q"; break;
   case          9: c = "MQCMD_CLEAR_Q"; break;
   case         10: c = "MQCMD_COPY_Q"; break;
   case         11: c = "MQCMD_CREATE_Q"; break;
   case         12: c = "MQCMD_DELETE_Q"; break;
   case         13: c = "MQCMD_INQUIRE_Q"; break;
   case         16: c = "MQCMD_REFRESH_Q_MGR"; break;
   case         17: c = "MQCMD_RESET_Q_STATS"; break;
   case         18: c = "MQCMD_INQUIRE_Q_NAMES"; break;
   case         19: c = "MQCMD_INQUIRE_PROCESS_NAMES"; break;
   case         20: c = "MQCMD_INQUIRE_CHANNEL_NAMES"; break;
   case         21: c = "MQCMD_CHANGE_CHANNEL"; break;
   case         22: c = "MQCMD_COPY_CHANNEL"; break;
   case         23: c = "MQCMD_CREATE_CHANNEL"; break;
   case         24: c = "MQCMD_DELETE_CHANNEL"; break;
   case         25: c = "MQCMD_INQUIRE_CHANNEL"; break;
   case         26: c = "MQCMD_PING_CHANNEL"; break;
   case         27: c = "MQCMD_RESET_CHANNEL"; break;
   case         28: c = "MQCMD_START_CHANNEL"; break;
   case         29: c = "MQCMD_STOP_CHANNEL"; break;
   case         30: c = "MQCMD_START_CHANNEL_INIT"; break;
   case         31: c = "MQCMD_START_CHANNEL_LISTENER"; break;
   case         32: c = "MQCMD_CHANGE_NAMELIST"; break;
   case         33: c = "MQCMD_COPY_NAMELIST"; break;
   case         34: c = "MQCMD_CREATE_NAMELIST"; break;
   case         35: c = "MQCMD_DELETE_NAMELIST"; break;
   case         36: c = "MQCMD_INQUIRE_NAMELIST"; break;
   case         37: c = "MQCMD_INQUIRE_NAMELIST_NAMES"; break;
   case         38: c = "MQCMD_ESCAPE"; break;
   case         39: c = "MQCMD_RESOLVE_CHANNEL"; break;
   case         40: c = "MQCMD_PING_Q_MGR"; break;
   case         41: c = "MQCMD_INQUIRE_Q_STATUS"; break;
   case         42: c = "MQCMD_INQUIRE_CHANNEL_STATUS"; break;
   case         43: c = "MQCMD_CONFIG_EVENT"; break;
   case         44: c = "MQCMD_Q_MGR_EVENT"; break;
   case         45: c = "MQCMD_PERFM_EVENT"; break;
   case         46: c = "MQCMD_CHANNEL_EVENT"; break;
   case         60: c = "MQCMD_DELETE_PUBLICATION"; break;
   case         61: c = "MQCMD_DEREGISTER_PUBLISHER"; break;
   case         62: c = "MQCMD_DEREGISTER_SUBSCRIBER"; break;
   case         63: c = "MQCMD_PUBLISH"; break;
   case         64: c = "MQCMD_REGISTER_PUBLISHER"; break;
   case         65: c = "MQCMD_REGISTER_SUBSCRIBER"; break;
   case         66: c = "MQCMD_REQUEST_UPDATE"; break;
   case         67: c = "MQCMD_BROKER_INTERNAL"; break;
   case         69: c = "MQCMD_ACTIVITY_MSG"; break;
   case         70: c = "MQCMD_INQUIRE_CLUSTER_Q_MGR"; break;
   case         71: c = "MQCMD_RESUME_Q_MGR_CLUSTER"; break;
   case         72: c = "MQCMD_SUSPEND_Q_MGR_CLUSTER"; break;
   case         73: c = "MQCMD_REFRESH_CLUSTER"; break;
   case         74: c = "MQCMD_RESET_CLUSTER"; break;
   case         75: c = "MQCMD_TRACE_ROUTE"; break;
   case         78: c = "MQCMD_REFRESH_SECURITY"; break;
   case         79: c = "MQCMD_CHANGE_AUTH_INFO"; break;
   case         80: c = "MQCMD_COPY_AUTH_INFO"; break;
   case         81: c = "MQCMD_CREATE_AUTH_INFO"; break;
   case         82: c = "MQCMD_DELETE_AUTH_INFO"; break;
   case         83: c = "MQCMD_INQUIRE_AUTH_INFO"; break;
   case         84: c = "MQCMD_INQUIRE_AUTH_INFO_NAMES"; break;
   case         85: c = "MQCMD_INQUIRE_CONNECTION"; break;
   case         86: c = "MQCMD_STOP_CONNECTION"; break;
   case         87: c = "MQCMD_INQUIRE_AUTH_RECS"; break;
   case         88: c = "MQCMD_INQUIRE_ENTITY_AUTH"; break;
   case         89: c = "MQCMD_DELETE_AUTH_REC"; break;
   case         90: c = "MQCMD_SET_AUTH_REC"; break;
   case         91: c = "MQCMD_LOGGER_EVENT"; break;
   case         92: c = "MQCMD_RESET_Q_MGR"; break;
   case         93: c = "MQCMD_CHANGE_LISTENER"; break;
   case         94: c = "MQCMD_COPY_LISTENER"; break;
   case         95: c = "MQCMD_CREATE_LISTENER"; break;
   case         96: c = "MQCMD_DELETE_LISTENER"; break;
   case         97: c = "MQCMD_INQUIRE_LISTENER"; break;
   case         98: c = "MQCMD_INQUIRE_LISTENER_STATUS"; break;
   case         99: c = "MQCMD_COMMAND_EVENT"; break;
   case        100: c = "MQCMD_CHANGE_SECURITY"; break;
   case        101: c = "MQCMD_CHANGE_CF_STRUC"; break;
   case        102: c = "MQCMD_CHANGE_STG_CLASS"; break;
   case        103: c = "MQCMD_CHANGE_TRACE"; break;
   case        104: c = "MQCMD_ARCHIVE_LOG"; break;
   case        105: c = "MQCMD_BACKUP_CF_STRUC"; break;
   case        106: c = "MQCMD_CREATE_BUFFER_POOL"; break;
   case        107: c = "MQCMD_CREATE_PAGE_SET"; break;
   case        108: c = "MQCMD_CREATE_CF_STRUC"; break;
   case        109: c = "MQCMD_CREATE_STG_CLASS"; break;
   case        110: c = "MQCMD_COPY_CF_STRUC"; break;
   case        111: c = "MQCMD_COPY_STG_CLASS"; break;
   case        112: c = "MQCMD_DELETE_CF_STRUC"; break;
   case        113: c = "MQCMD_DELETE_STG_CLASS"; break;
   case        114: c = "MQCMD_INQUIRE_ARCHIVE"; break;
   case        115: c = "MQCMD_INQUIRE_CF_STRUC"; break;
   case        116: c = "MQCMD_INQUIRE_CF_STRUC_STATUS"; break;
   case        117: c = "MQCMD_INQUIRE_CMD_SERVER"; break;
   case        118: c = "MQCMD_INQUIRE_CHANNEL_INIT"; break;
   case        119: c = "MQCMD_INQUIRE_QSG"; break;
   case        120: c = "MQCMD_INQUIRE_LOG"; break;
   case        121: c = "MQCMD_INQUIRE_SECURITY"; break;
   case        122: c = "MQCMD_INQUIRE_STG_CLASS"; break;
   case        123: c = "MQCMD_INQUIRE_SYSTEM"; break;
   case        124: c = "MQCMD_INQUIRE_THREAD"; break;
   case        125: c = "MQCMD_INQUIRE_TRACE"; break;
   case        126: c = "MQCMD_INQUIRE_USAGE"; break;
   case        127: c = "MQCMD_MOVE_Q"; break;
   case        128: c = "MQCMD_RECOVER_BSDS"; break;
   case        129: c = "MQCMD_RECOVER_CF_STRUC"; break;
   case        130: c = "MQCMD_RESET_TPIPE"; break;
   case        131: c = "MQCMD_RESOLVE_INDOUBT"; break;
   case        132: c = "MQCMD_RESUME_Q_MGR"; break;
   case        133: c = "MQCMD_REVERIFY_SECURITY"; break;
   case        134: c = "MQCMD_SET_ARCHIVE"; break;
   case        136: c = "MQCMD_SET_LOG"; break;
   case        137: c = "MQCMD_SET_SYSTEM"; break;
   case        138: c = "MQCMD_START_CMD_SERVER"; break;
   case        139: c = "MQCMD_START_Q_MGR"; break;
   case        140: c = "MQCMD_START_TRACE"; break;
   case        141: c = "MQCMD_STOP_CHANNEL_INIT"; break;
   case        142: c = "MQCMD_STOP_CHANNEL_LISTENER"; break;
   case        143: c = "MQCMD_STOP_CMD_SERVER"; break;
   case        144: c = "MQCMD_STOP_Q_MGR"; break;
   case        145: c = "MQCMD_STOP_TRACE"; break;
   case        146: c = "MQCMD_SUSPEND_Q_MGR"; break;
   case        147: c = "MQCMD_INQUIRE_CF_STRUC_NAMES"; break;
   case        148: c = "MQCMD_INQUIRE_STG_CLASS_NAMES"; break;
   case        149: c = "MQCMD_CHANGE_SERVICE"; break;
   case        150: c = "MQCMD_COPY_SERVICE"; break;
   case        151: c = "MQCMD_CREATE_SERVICE"; break;
   case        152: c = "MQCMD_DELETE_SERVICE"; break;
   case        153: c = "MQCMD_INQUIRE_SERVICE"; break;
   case        154: c = "MQCMD_INQUIRE_SERVICE_STATUS"; break;
   case        155: c = "MQCMD_START_SERVICE"; break;
   case        156: c = "MQCMD_STOP_SERVICE"; break;
   case        157: c = "MQCMD_DELETE_BUFFER_POOL"; break;
   case        158: c = "MQCMD_DELETE_PAGE_SET"; break;
   case        159: c = "MQCMD_CHANGE_BUFFER_POOL"; break;
   case        160: c = "MQCMD_CHANGE_PAGE_SET"; break;
   case        161: c = "MQCMD_INQUIRE_Q_MGR_STATUS"; break;
   case        162: c = "MQCMD_CREATE_LOG"; break;
   case        164: c = "MQCMD_STATISTICS_MQI"; break;
   case        165: c = "MQCMD_STATISTICS_Q"; break;
   case        166: c = "MQCMD_STATISTICS_CHANNEL"; break;
   case        167: c = "MQCMD_ACCOUNTING_MQI"; break;
   case        168: c = "MQCMD_ACCOUNTING_Q"; break;
   case        169: c = "MQCMD_INQUIRE_AUTH_SERVICE"; break;
   case        170: c = "MQCMD_CHANGE_TOPIC"; break;
   case        171: c = "MQCMD_COPY_TOPIC"; break;
   case        172: c = "MQCMD_CREATE_TOPIC"; break;
   case        173: c = "MQCMD_DELETE_TOPIC"; break;
   case        174: c = "MQCMD_INQUIRE_TOPIC"; break;
   case        175: c = "MQCMD_INQUIRE_TOPIC_NAMES"; break;
   case        176: c = "MQCMD_INQUIRE_SUBSCRIPTION"; break;
   case        177: c = "MQCMD_CREATE_SUBSCRIPTION"; break;
   case        178: c = "MQCMD_CHANGE_SUBSCRIPTION"; break;
   case        179: c = "MQCMD_DELETE_SUBSCRIPTION"; break;
   case        181: c = "MQCMD_COPY_SUBSCRIPTION"; break;
   case        182: c = "MQCMD_INQUIRE_SUB_STATUS"; break;
   case        183: c = "MQCMD_INQUIRE_TOPIC_STATUS"; break;
   case        184: c = "MQCMD_CLEAR_TOPIC_STRING"; break;
   case        185: c = "MQCMD_INQUIRE_PUBSUB_STATUS"; break;
   case        186: c = "MQCMD_INQUIRE_SMDS"; break;
   case        187: c = "MQCMD_CHANGE_SMDS"; break;
   case        188: c = "MQCMD_RESET_SMDS"; break;
   case        190: c = "MQCMD_CREATE_COMM_INFO"; break;
   case        191: c = "MQCMD_INQUIRE_COMM_INFO"; break;
   case        192: c = "MQCMD_CHANGE_COMM_INFO"; break;
   case        193: c = "MQCMD_COPY_COMM_INFO"; break;
   case        194: c = "MQCMD_DELETE_COMM_INFO"; break;
   case        195: c = "MQCMD_PURGE_CHANNEL"; break;
   case        196: c = "MQCMD_MQXR_DIAGNOSTICS"; break;
   case        197: c = "MQCMD_START_SMDSCONN"; break;
   case        198: c = "MQCMD_STOP_SMDSCONN"; break;
   case        199: c = "MQCMD_INQUIRE_SMDSCONN"; break;
   case        200: c = "MQCMD_INQUIRE_MQXR_STATUS"; break;
   case        201: c = "MQCMD_START_CLIENT_TRACE"; break;
   case        202: c = "MQCMD_STOP_CLIENT_TRACE"; break;
   case        203: c = "MQCMD_SET_CHLAUTH_REC"; break;
   case        204: c = "MQCMD_INQUIRE_CHLAUTH_RECS"; break;
   case        205: c = "MQCMD_INQUIRE_PROT_POLICY"; break;
   case        206: c = "MQCMD_CREATE_PROT_POLICY"; break;
   case        207: c = "MQCMD_DELETE_PROT_POLICY"; break;
   case        208: c = "MQCMD_CHANGE_PROT_POLICY"; break;
   case        209: c = "MQCMD_ACTIVITY_TRACE"; break;
   case        213: c = "MQCMD_RESET_CF_STRUC"; break;
   case        214: c = "MQCMD_INQUIRE_XR_CAPABILITY"; break;
   case        216: c = "MQCMD_INQUIRE_AMQP_CAPABILITY"; break;
   case        217: c = "MQCMD_AMQP_DIAGNOSTICS"; break;
   case        218: c = "MQCMD_INTER_Q_MGR_STATUS"; break;
   case        219: c = "MQCMD_INTER_Q_MGR_BALANCE"; break;
   case        220: c = "MQCMD_INQUIRE_APPL_STATUS"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCMHO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCMHO_NONE"; break;
   case          1: c = "MQCMHO_NO_VALIDATION"; break;
   case          2: c = "MQCMHO_VALIDATE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCNO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCNO_NONE"; break;
   case          1: c = "MQCNO_FASTPATH_BINDING"; break;
   case          2: c = "MQCNO_SERIALIZE_CONN_TAG_Q_MGR"; break;
   case          4: c = "MQCNO_SERIALIZE_CONN_TAG_QSG"; break;
   case          8: c = "MQCNO_RESTRICT_CONN_TAG_Q_MGR"; break;
   case         16: c = "MQCNO_RESTRICT_CONN_TAG_QSG"; break;
   case         32: c = "MQCNO_HANDLE_SHARE_NONE"; break;
   case         64: c = "MQCNO_HANDLE_SHARE_BLOCK"; break;
   case        128: c = "MQCNO_HANDLE_SHARE_NO_BLOCK"; break;
   case        256: c = "MQCNO_SHARED_BINDING"; break;
   case        512: c = "MQCNO_ISOLATED_BINDING"; break;
   case       1024: c = "MQCNO_LOCAL_BINDING"; break;
   case       2048: c = "MQCNO_CLIENT_BINDING"; break;
   case       4096: c = "MQCNO_ACCOUNTING_MQI_ENABLED"; break;
   case       8192: c = "MQCNO_ACCOUNTING_MQI_DISABLED"; break;
   case      16384: c = "MQCNO_ACCOUNTING_Q_ENABLED"; break;
   case      32768: c = "MQCNO_ACCOUNTING_Q_DISABLED"; break;
   case      65536: c = "MQCNO_NO_CONV_SHARING"; break;
   case     262144: c = "MQCNO_ALL_CONVS_SHARE"; break;
   case     524288: c = "MQCNO_CD_FOR_OUTPUT_ONLY"; break;
   case    1048576: c = "MQCNO_USE_CD_SELECTION"; break;
   case    2097152: c = "MQCNO_GENERATE_CONN_TAG"; break;
   case   16777216: c = "MQCNO_RECONNECT"; break;
   case   33554432: c = "MQCNO_RECONNECT_DISABLED"; break;
   case   67108864: c = "MQCNO_RECONNECT_Q_MGR"; break;
   case  134217728: c = "MQCNO_ACTIVITY_TRACE_ENABLED"; break;
   case  268435456: c = "MQCNO_ACTIVITY_TRACE_DISABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCODL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQCODL_AS_INPUT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCOMPRESS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQCOMPRESS_NOT_AVAILABLE"; break;
   case          0: c = "MQCOMPRESS_NONE"; break;
   case          1: c = "MQCOMPRESS_RLE"; break;
   case          2: c = "MQCOMPRESS_ZLIBFAST"; break;
   case          4: c = "MQCOMPRESS_ZLIBHIGH"; break;
   case          8: c = "MQCOMPRESS_SYSTEM"; break;
   case  268435455: c = "MQCOMPRESS_ANY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCOPY_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCOPY_NONE"; break;
   case          1: c = "MQCOPY_ALL"; break;
   case          2: c = "MQCOPY_FORWARD"; break;
   case          4: c = "MQCOPY_PUBLISH"; break;
   case          8: c = "MQCOPY_REPLY"; break;
   case         16: c = "MQCOPY_REPORT"; break;
   case         22: c = "MQCOPY_DEFAULT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCO_NONE"; break;
   case          1: c = "MQCO_DELETE"; break;
   case          2: c = "MQCO_DELETE_PURGE"; break;
   case          4: c = "MQCO_KEEP_SUB"; break;
   case          8: c = "MQCO_REMOVE_SUB"; break;
   case         32: c = "MQCO_QUIESCE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCQT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQCQT_LOCAL_Q"; break;
   case          2: c = "MQCQT_ALIAS_Q"; break;
   case          3: c = "MQCQT_REMOTE_Q"; break;
   case          4: c = "MQCQT_Q_MGR_ALIAS"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCRC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCRC_OK"; break;
   case          1: c = "MQCRC_CICS_EXEC_ERROR"; break;
   case          2: c = "MQCRC_MQ_API_ERROR"; break;
   case          3: c = "MQCRC_BRIDGE_ERROR"; break;
   case          4: c = "MQCRC_BRIDGE_ABEND"; break;
   case          5: c = "MQCRC_APPLICATION_ABEND"; break;
   case          6: c = "MQCRC_SECURITY_ERROR"; break;
   case          7: c = "MQCRC_PROGRAM_NOT_AVAILABLE"; break;
   case          8: c = "MQCRC_BRIDGE_TIMEOUT"; break;
   case          9: c = "MQCRC_TRANSID_NOT_AVAILABLE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCSP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCSP_AUTH_NONE"; break;
   case          1: c = "MQCSP_AUTH_USER_ID_AND_PWD"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCSRV_CONVERT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCSRV_CONVERT_NO"; break;
   case          1: c = "MQCSRV_CONVERT_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCSRV_DLQ_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCSRV_DLQ_NO"; break;
   case          1: c = "MQCSRV_DLQ_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCS_NONE"; break;
   case          1: c = "MQCS_SUSPENDED_TEMPORARY"; break;
   case          2: c = "MQCS_SUSPENDED_USER_ACTION"; break;
   case          3: c = "MQCS_SUSPENDED"; break;
   case          4: c = "MQCS_STOPPED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCTES_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCTES_NOSYNC"; break;
   case        256: c = "MQCTES_COMMIT"; break;
   case       4352: c = "MQCTES_BACKOUT"; break;
   case      65536: c = "MQCTES_ENDTASK"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCTLO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQCTLO_NONE"; break;
   case          1: c = "MQCTLO_THREAD_AFFINITY"; break;
   case       8192: c = "MQCTLO_FAIL_IF_QUIESCING"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQCUOWC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         16: c = "MQCUOWC_MIDDLE"; break;
   case        256: c = "MQCUOWC_COMMIT"; break;
   case        273: c = "MQCUOWC_ONLY"; break;
   case       4352: c = "MQCUOWC_BACKOUT"; break;
   case      65536: c = "MQCUOWC_CONTINUE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDCC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDCC_NONE"; break;
   case          1: c = "MQDCC_DEFAULT_CONVERSION"; break;
   case          2: c = "MQDCC_FILL_TARGET_BUFFER"; break;
   case          4: c = "MQDCC_INT_DEFAULT_CONVERSION"; break;
   case         16: c = "MQDCC_SOURCE_ENC_NORMAL"; break;
   case         32: c = "MQDCC_SOURCE_ENC_REVERSED"; break;
   case        240: c = "MQDCC_SOURCE_ENC_MASK"; break;
   case        256: c = "MQDCC_TARGET_ENC_NORMAL"; break;
   case        512: c = "MQDCC_TARGET_ENC_REVERSED"; break;
   case       3840: c = "MQDCC_TARGET_ENC_MASK"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQDC_MANAGED"; break;
   case          2: c = "MQDC_PROVIDED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDELO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDELO_NONE"; break;
   case          4: c = "MQDELO_LOCAL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDHF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDHF_NONE"; break;
   case          1: c = "MQDHF_NEW_MSG_IDS"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDISCONNECT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDISCONNECT_NORMAL"; break;
   case          1: c = "MQDISCONNECT_IMPLICIT"; break;
   case          2: c = "MQDISCONNECT_Q_MGR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDLV_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDLV_AS_PARENT"; break;
   case          1: c = "MQDLV_ALL"; break;
   case          2: c = "MQDLV_ALL_DUR"; break;
   case          3: c = "MQDLV_ALL_AVAIL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDL_NOT_SUPPORTED"; break;
   case          1: c = "MQDL_SUPPORTED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDMHO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDMHO_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDMPO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDMPO_NONE"; break;
   case          1: c = "MQDMPO_DEL_PROP_UNDER_CURSOR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDNSWLM_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDNSWLM_NO"; break;
   case          1: c = "MQDNSWLM_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDOPT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDOPT_RESOLVED"; break;
   case          1: c = "MQDOPT_DEFINED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDSB_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDSB_DEFAULT"; break;
   case          1: c = "MQDSB_8K"; break;
   case          2: c = "MQDSB_16K"; break;
   case          3: c = "MQDSB_32K"; break;
   case          4: c = "MQDSB_64K"; break;
   case          5: c = "MQDSB_128K"; break;
   case          6: c = "MQDSB_256K"; break;
   case          7: c = "MQDSB_512K"; break;
   case          8: c = "MQDSB_1M"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQDSE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQDSE_DEFAULT"; break;
   case          1: c = "MQDSE_YES"; break;
   case          2: c = "MQDSE_NO"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQEC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          2: c = "MQEC_MSG_ARRIVED"; break;
   case          3: c = "MQEC_WAIT_INTERVAL_EXPIRED"; break;
   case          4: c = "MQEC_WAIT_CANCELED"; break;
   case          5: c = "MQEC_Q_MGR_QUIESCING"; break;
   case          6: c = "MQEC_CONNECTION_QUIESCING"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQEI_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQEI_UNLIMITED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQENC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case      -4096: c = "MQENC_RESERVED_MASK"; break;
   case         -1: c = "MQENC_AS_PUBLISHED"; break;
   case          1: c = "MQENC_INTEGER_NORMAL"; break;
   case          2: c = "MQENC_INTEGER_REVERSED"; break;
   case         15: c = "MQENC_INTEGER_MASK"; break;
   case         16: c = "MQENC_DECIMAL_NORMAL"; break;
   case         32: c = "MQENC_DECIMAL_REVERSED"; break;
   case        240: c = "MQENC_DECIMAL_MASK"; break;
   case        256: c = "MQENC_FLOAT_IEEE_NORMAL"; break;
   case        273: c = "MQENC_NORMAL"; break;
   case        512: c = "MQENC_FLOAT_IEEE_REVERSED"; break;
   case        546: c = "MQENC_REVERSED"; break;
   case        768: c = "MQENC_FLOAT_S390"; break;
   case        785: c = "MQENC_S390"; break;
   case       1024: c = "MQENC_FLOAT_TNS"; break;
   case       1041: c = "MQENC_TNS"; break;
   case       3840: c = "MQENC_FLOAT_MASK"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQEPH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQEPH_NONE"; break;
   case          1: c = "MQEPH_CCSID_EMBEDDED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQET_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQET_MQSC"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQEVO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQEVO_OTHER"; break;
   case          1: c = "MQEVO_CONSOLE"; break;
   case          2: c = "MQEVO_INIT"; break;
   case          3: c = "MQEVO_MSG"; break;
   case          4: c = "MQEVO_MQSET"; break;
   case          5: c = "MQEVO_INTERNAL"; break;
   case          6: c = "MQEVO_MQSUB"; break;
   case          7: c = "MQEVO_CTLMSG"; break;
   case          8: c = "MQEVO_REST"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQEVR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQEVR_DISABLED"; break;
   case          1: c = "MQEVR_ENABLED"; break;
   case          2: c = "MQEVR_EXCEPTION"; break;
   case          3: c = "MQEVR_NO_DISPLAY"; break;
   case          4: c = "MQEVR_API_ONLY"; break;
   case          5: c = "MQEVR_ADMIN_ONLY"; break;
   case          6: c = "MQEVR_USER_ONLY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQEXPI_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQEXPI_OFF"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQEXTATTRS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQEXTATTRS_ALL"; break;
   case          1: c = "MQEXTATTRS_NONDEF"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQEXT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQEXT_ALL"; break;
   case          1: c = "MQEXT_OBJECT"; break;
   case          2: c = "MQEXT_AUTHORITY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQFB_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQFB_NONE"; break;
   case        256: c = "MQFB_QUIT"; break;
   case        258: c = "MQFB_EXPIRATION"; break;
   case        259: c = "MQFB_COA"; break;
   case        260: c = "MQFB_COD"; break;
   case        262: c = "MQFB_CHANNEL_COMPLETED"; break;
   case        263: c = "MQFB_CHANNEL_FAIL_RETRY"; break;
   case        264: c = "MQFB_CHANNEL_FAIL"; break;
   case        265: c = "MQFB_APPL_CANNOT_BE_STARTED"; break;
   case        266: c = "MQFB_TM_ERROR"; break;
   case        267: c = "MQFB_APPL_TYPE_ERROR"; break;
   case        268: c = "MQFB_STOPPED_BY_MSG_EXIT"; break;
   case        269: c = "MQFB_ACTIVITY"; break;
   case        271: c = "MQFB_XMIT_Q_MSG_ERROR"; break;
   case        275: c = "MQFB_PAN"; break;
   case        276: c = "MQFB_NAN"; break;
   case        277: c = "MQFB_STOPPED_BY_CHAD_EXIT"; break;
   case        279: c = "MQFB_STOPPED_BY_PUBSUB_EXIT"; break;
   case        280: c = "MQFB_NOT_A_REPOSITORY_MSG"; break;
   case        281: c = "MQFB_BIND_OPEN_CLUSRCVR_DEL"; break;
   case        282: c = "MQFB_MAX_ACTIVITIES"; break;
   case        283: c = "MQFB_NOT_FORWARDED"; break;
   case        284: c = "MQFB_NOT_DELIVERED"; break;
   case        285: c = "MQFB_UNSUPPORTED_FORWARDING"; break;
   case        286: c = "MQFB_UNSUPPORTED_DELIVERY"; break;
   case        291: c = "MQFB_DATA_LENGTH_ZERO"; break;
   case        292: c = "MQFB_DATA_LENGTH_NEGATIVE"; break;
   case        293: c = "MQFB_DATA_LENGTH_TOO_BIG"; break;
   case        294: c = "MQFB_BUFFER_OVERFLOW"; break;
   case        295: c = "MQFB_LENGTH_OFF_BY_ONE"; break;
   case        296: c = "MQFB_IIH_ERROR"; break;
   case        298: c = "MQFB_NOT_AUTHORIZED_FOR_IMS"; break;
   case        300: c = "MQFB_IMS_ERROR"; break;
   case        401: c = "MQFB_CICS_INTERNAL_ERROR"; break;
   case        402: c = "MQFB_CICS_NOT_AUTHORIZED"; break;
   case        403: c = "MQFB_CICS_BRIDGE_FAILURE"; break;
   case        404: c = "MQFB_CICS_CORREL_ID_ERROR"; break;
   case        405: c = "MQFB_CICS_CCSID_ERROR"; break;
   case        406: c = "MQFB_CICS_ENCODING_ERROR"; break;
   case        407: c = "MQFB_CICS_CIH_ERROR"; break;
   case        408: c = "MQFB_CICS_UOW_ERROR"; break;
   case        409: c = "MQFB_CICS_COMMAREA_ERROR"; break;
   case        410: c = "MQFB_CICS_APPL_NOT_STARTED"; break;
   case        411: c = "MQFB_CICS_APPL_ABENDED"; break;
   case        412: c = "MQFB_CICS_DLQ_ERROR"; break;
   case        413: c = "MQFB_CICS_UOW_BACKED_OUT"; break;
   case        501: c = "MQFB_PUBLICATIONS_ON_REQUEST"; break;
   case        502: c = "MQFB_SUBSCRIBER_IS_PUBLISHER"; break;
   case        503: c = "MQFB_MSG_SCOPE_MISMATCH"; break;
   case        504: c = "MQFB_SELECTOR_MISMATCH"; break;
   case        505: c = "MQFB_NOT_A_GROUPUR_MSG"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQFC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQFC_NO"; break;
   case          1: c = "MQFC_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQFIELD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case       8000: c = "MQFIELD_WQR_StrucId"; break;
   case       8001: c = "MQFIELD_WQR_Version"; break;
   case       8002: c = "MQFIELD_WQR_StrucLength"; break;
   case       8003: c = "MQFIELD_WQR_QFlags"; break;
   case       8004: c = "MQFIELD_WQR_QName"; break;
   case       8005: c = "MQFIELD_WQR_QMgrIdentifier"; break;
   case       8006: c = "MQFIELD_WQR_ClusterRecOffset"; break;
   case       8007: c = "MQFIELD_WQR_QType"; break;
   case       8008: c = "MQFIELD_WQR_QDesc"; break;
   case       8009: c = "MQFIELD_WQR_DefBind"; break;
   case       8010: c = "MQFIELD_WQR_DefPersistence"; break;
   case       8011: c = "MQFIELD_WQR_DefPriority"; break;
   case       8012: c = "MQFIELD_WQR_InhibitPut"; break;
   case       8013: c = "MQFIELD_WQR_CLWLQueuePriority"; break;
   case       8014: c = "MQFIELD_WQR_CLWLQueueRank"; break;
   case       8015: c = "MQFIELD_WQR_DefPutResponse"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQFUN_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQFUN_TYPE_UNKNOWN"; break;
   case          1: c = "MQFUN_TYPE_JVM"; break;
   case          2: c = "MQFUN_TYPE_PROGRAM"; break;
   case          3: c = "MQFUN_TYPE_PROCEDURE"; break;
   case          4: c = "MQFUN_TYPE_USERDEF"; break;
   case          5: c = "MQFUN_TYPE_COMMAND"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQGACF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case       8001: c = "MQGACF_COMMAND_CONTEXT"; break;
   case       8002: c = "MQGACF_COMMAND_DATA"; break;
   case       8003: c = "MQGACF_TRACE_ROUTE"; break;
   case       8004: c = "MQGACF_OPERATION"; break;
   case       8005: c = "MQGACF_ACTIVITY"; break;
   case       8006: c = "MQGACF_EMBEDDED_MQMD"; break;
   case       8007: c = "MQGACF_MESSAGE"; break;
   case       8008: c = "MQGACF_MQMD"; break;
   case       8009: c = "MQGACF_VALUE_NAMING"; break;
   case       8010: c = "MQGACF_Q_ACCOUNTING_DATA"; break;
   case       8011: c = "MQGACF_Q_STATISTICS_DATA"; break;
   case       8012: c = "MQGACF_CHL_STATISTICS_DATA"; break;
   case       8013: c = "MQGACF_ACTIVITY_TRACE"; break;
   case       8014: c = "MQGACF_APP_DIST_LIST"; break;
   case       8015: c = "MQGACF_MONITOR_CLASS"; break;
   case       8016: c = "MQGACF_MONITOR_TYPE"; break;
   case       8017: c = "MQGACF_MONITOR_ELEMENT"; break;
   case       8018: c = "MQGACF_APPL_STATUS"; break;
   case       8019: c = "MQGACF_CHANGED_APPLS"; break;
   case       8020: c = "MQGACF_ALL_APPLS"; break;
   case       8021: c = "MQGACF_APPL_BALANCE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQGMO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQGMO_NONE"; break;
   case          1: c = "MQGMO_WAIT"; break;
   case          2: c = "MQGMO_SYNCPOINT"; break;
   case          4: c = "MQGMO_NO_SYNCPOINT"; break;
   case          8: c = "MQGMO_SET_SIGNAL"; break;
   case         32: c = "MQGMO_BROWSE_NEXT"; break;
   case         64: c = "MQGMO_ACCEPT_TRUNCATED_MSG"; break;
   case        128: c = "MQGMO_MARK_SKIP_BACKOUT"; break;
   case        256: c = "MQGMO_MSG_UNDER_CURSOR"; break;
   case        512: c = "MQGMO_LOCK"; break;
   case       1024: c = "MQGMO_UNLOCK"; break;
   case       2048: c = "MQGMO_BROWSE_MSG_UNDER_CURSOR"; break;
   case       4096: c = "MQGMO_SYNCPOINT_IF_PERSISTENT"; break;
   case       8192: c = "MQGMO_FAIL_IF_QUIESCING"; break;
   case      16384: c = "MQGMO_CONVERT"; break;
   case      32768: c = "MQGMO_LOGICAL_ORDER"; break;
   case      65536: c = "MQGMO_COMPLETE_MSG"; break;
   case     131072: c = "MQGMO_ALL_MSGS_AVAILABLE"; break;
   case     262144: c = "MQGMO_ALL_SEGMENTS_AVAILABLE"; break;
   case    1048576: c = "MQGMO_MARK_BROWSE_HANDLE"; break;
   case    2097152: c = "MQGMO_MARK_BROWSE_CO_OP"; break;
   case    4194304: c = "MQGMO_UNMARK_BROWSE_CO_OP"; break;
   case    8388608: c = "MQGMO_UNMARK_BROWSE_HANDLE"; break;
   case   16777216: c = "MQGMO_UNMARKED_BROWSE_MSG"; break;
   case   17825808: c = "MQGMO_BROWSE_HANDLE"; break;
   case   18874384: c = "MQGMO_BROWSE_CO_OP"; break;
   case   33554432: c = "MQGMO_PROPERTIES_FORCE_MQRFH2"; break;
   case   67108864: c = "MQGMO_NO_PROPERTIES"; break;
   case  134217728: c = "MQGMO_PROPERTIES_IN_HANDLE"; break;
   case  268435456: c = "MQGMO_PROPERTIES_COMPATIBILITY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQGUR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQGUR_DISABLED"; break;
   case          1: c = "MQGUR_ENABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQHA_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case       4001: c = "MQHA_BAG_HANDLE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQHB_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -2: c = "MQHB_NONE"; break;
   case         -1: c = "MQHB_UNUSABLE_HBAG"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQHC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -3: c = "MQHC_UNASSOCIATED_HCONN"; break;
   case         -1: c = "MQHC_UNUSABLE_HCONN"; break;
   case          0: c = "MQHC_DEF_HCONN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQHM_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQHM_UNUSABLE_HMSG"; break;
   case          0: c = "MQHM_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQHO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQHO_UNUSABLE_HOBJ"; break;
   case          0: c = "MQHO_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQHSTATE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQHSTATE_INACTIVE"; break;
   case          1: c = "MQHSTATE_ACTIVE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIACF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case       1001: c = "MQIACF_Q_MGR_ATTRS"; break;
   case       1002: c = "MQIACF_Q_ATTRS"; break;
   case       1003: c = "MQIACF_PROCESS_ATTRS"; break;
   case       1004: c = "MQIACF_NAMELIST_ATTRS"; break;
   case       1005: c = "MQIACF_FORCE"; break;
   case       1006: c = "MQIACF_REPLACE"; break;
   case       1007: c = "MQIACF_PURGE"; break;
   case       1008: c = "MQIACF_QUIESCE"; break;
   case       1009: c = "MQIACF_ALL"; break;
   case       1010: c = "MQIACF_EVENT_APPL_TYPE"; break;
   case       1011: c = "MQIACF_EVENT_ORIGIN"; break;
   case       1012: c = "MQIACF_PARAMETER_ID"; break;
   case       1013: c = "MQIACF_ERROR_ID"; break;
   case       1014: c = "MQIACF_SELECTOR"; break;
   case       1015: c = "MQIACF_CHANNEL_ATTRS"; break;
   case       1016: c = "MQIACF_OBJECT_TYPE"; break;
   case       1017: c = "MQIACF_ESCAPE_TYPE"; break;
   case       1018: c = "MQIACF_ERROR_OFFSET"; break;
   case       1019: c = "MQIACF_AUTH_INFO_ATTRS"; break;
   case       1020: c = "MQIACF_REASON_QUALIFIER"; break;
   case       1021: c = "MQIACF_COMMAND"; break;
   case       1022: c = "MQIACF_OPEN_OPTIONS"; break;
   case       1023: c = "MQIACF_OPEN_TYPE"; break;
   case       1024: c = "MQIACF_PROCESS_ID"; break;
   case       1025: c = "MQIACF_THREAD_ID"; break;
   case       1026: c = "MQIACF_Q_STATUS_ATTRS"; break;
   case       1027: c = "MQIACF_UNCOMMITTED_MSGS"; break;
   case       1028: c = "MQIACF_HANDLE_STATE"; break;
   case       1070: c = "MQIACF_AUX_ERROR_DATA_INT_1"; break;
   case       1071: c = "MQIACF_AUX_ERROR_DATA_INT_2"; break;
   case       1072: c = "MQIACF_CONV_REASON_CODE"; break;
   case       1073: c = "MQIACF_BRIDGE_TYPE"; break;
   case       1074: c = "MQIACF_INQUIRY"; break;
   case       1075: c = "MQIACF_WAIT_INTERVAL"; break;
   case       1076: c = "MQIACF_OPTIONS"; break;
   case       1077: c = "MQIACF_BROKER_OPTIONS"; break;
   case       1078: c = "MQIACF_REFRESH_TYPE"; break;
   case       1079: c = "MQIACF_SEQUENCE_NUMBER"; break;
   case       1080: c = "MQIACF_INTEGER_DATA"; break;
   case       1081: c = "MQIACF_REGISTRATION_OPTIONS"; break;
   case       1082: c = "MQIACF_PUBLICATION_OPTIONS"; break;
   case       1083: c = "MQIACF_CLUSTER_INFO"; break;
   case       1084: c = "MQIACF_Q_MGR_DEFINITION_TYPE"; break;
   case       1085: c = "MQIACF_Q_MGR_TYPE"; break;
   case       1086: c = "MQIACF_ACTION"; break;
   case       1087: c = "MQIACF_SUSPEND"; break;
   case       1088: c = "MQIACF_BROKER_COUNT"; break;
   case       1089: c = "MQIACF_APPL_COUNT"; break;
   case       1090: c = "MQIACF_ANONYMOUS_COUNT"; break;
   case       1091: c = "MQIACF_REG_REG_OPTIONS"; break;
   case       1092: c = "MQIACF_DELETE_OPTIONS"; break;
   case       1093: c = "MQIACF_CLUSTER_Q_MGR_ATTRS"; break;
   case       1094: c = "MQIACF_REFRESH_INTERVAL"; break;
   case       1095: c = "MQIACF_REFRESH_REPOSITORY"; break;
   case       1096: c = "MQIACF_REMOVE_QUEUES"; break;
   case       1098: c = "MQIACF_OPEN_INPUT_TYPE"; break;
   case       1099: c = "MQIACF_OPEN_OUTPUT"; break;
   case       1100: c = "MQIACF_OPEN_SET"; break;
   case       1101: c = "MQIACF_OPEN_INQUIRE"; break;
   case       1102: c = "MQIACF_OPEN_BROWSE"; break;
   case       1103: c = "MQIACF_Q_STATUS_TYPE"; break;
   case       1104: c = "MQIACF_Q_HANDLE"; break;
   case       1105: c = "MQIACF_Q_STATUS"; break;
   case       1106: c = "MQIACF_SECURITY_TYPE"; break;
   case       1107: c = "MQIACF_CONNECTION_ATTRS"; break;
   case       1108: c = "MQIACF_CONNECT_OPTIONS"; break;
   case       1110: c = "MQIACF_CONN_INFO_TYPE"; break;
   case       1111: c = "MQIACF_CONN_INFO_CONN"; break;
   case       1112: c = "MQIACF_CONN_INFO_HANDLE"; break;
   case       1113: c = "MQIACF_CONN_INFO_ALL"; break;
   case       1114: c = "MQIACF_AUTH_PROFILE_ATTRS"; break;
   case       1115: c = "MQIACF_AUTHORIZATION_LIST"; break;
   case       1116: c = "MQIACF_AUTH_ADD_AUTHS"; break;
   case       1117: c = "MQIACF_AUTH_REMOVE_AUTHS"; break;
   case       1118: c = "MQIACF_ENTITY_TYPE"; break;
   case       1120: c = "MQIACF_COMMAND_INFO"; break;
   case       1121: c = "MQIACF_CMDSCOPE_Q_MGR_COUNT"; break;
   case       1122: c = "MQIACF_Q_MGR_SYSTEM"; break;
   case       1123: c = "MQIACF_Q_MGR_EVENT"; break;
   case       1124: c = "MQIACF_Q_MGR_DQM"; break;
   case       1125: c = "MQIACF_Q_MGR_CLUSTER"; break;
   case       1126: c = "MQIACF_QSG_DISPS"; break;
   case       1128: c = "MQIACF_UOW_STATE"; break;
   case       1129: c = "MQIACF_SECURITY_ITEM"; break;
   case       1130: c = "MQIACF_CF_STRUC_STATUS"; break;
   case       1132: c = "MQIACF_UOW_TYPE"; break;
   case       1133: c = "MQIACF_CF_STRUC_ATTRS"; break;
   case       1134: c = "MQIACF_EXCLUDE_INTERVAL"; break;
   case       1135: c = "MQIACF_CF_STATUS_TYPE"; break;
   case       1136: c = "MQIACF_CF_STATUS_SUMMARY"; break;
   case       1137: c = "MQIACF_CF_STATUS_CONNECT"; break;
   case       1138: c = "MQIACF_CF_STATUS_BACKUP"; break;
   case       1139: c = "MQIACF_CF_STRUC_TYPE"; break;
   case       1140: c = "MQIACF_CF_STRUC_SIZE_MAX"; break;
   case       1141: c = "MQIACF_CF_STRUC_SIZE_USED"; break;
   case       1142: c = "MQIACF_CF_STRUC_ENTRIES_MAX"; break;
   case       1143: c = "MQIACF_CF_STRUC_ENTRIES_USED"; break;
   case       1144: c = "MQIACF_CF_STRUC_BACKUP_SIZE"; break;
   case       1145: c = "MQIACF_MOVE_TYPE"; break;
   case       1146: c = "MQIACF_MOVE_TYPE_MOVE"; break;
   case       1147: c = "MQIACF_MOVE_TYPE_ADD"; break;
   case       1148: c = "MQIACF_Q_MGR_NUMBER"; break;
   case       1149: c = "MQIACF_Q_MGR_STATUS"; break;
   case       1150: c = "MQIACF_DB2_CONN_STATUS"; break;
   case       1151: c = "MQIACF_SECURITY_ATTRS"; break;
   case       1152: c = "MQIACF_SECURITY_TIMEOUT"; break;
   case       1153: c = "MQIACF_SECURITY_INTERVAL"; break;
   case       1154: c = "MQIACF_SECURITY_SWITCH"; break;
   case       1155: c = "MQIACF_SECURITY_SETTING"; break;
   case       1156: c = "MQIACF_STORAGE_CLASS_ATTRS"; break;
   case       1157: c = "MQIACF_USAGE_TYPE"; break;
   case       1158: c = "MQIACF_BUFFER_POOL_ID"; break;
   case       1159: c = "MQIACF_USAGE_TOTAL_PAGES"; break;
   case       1160: c = "MQIACF_USAGE_UNUSED_PAGES"; break;
   case       1161: c = "MQIACF_USAGE_PERSIST_PAGES"; break;
   case       1162: c = "MQIACF_USAGE_NONPERSIST_PAGES"; break;
   case       1163: c = "MQIACF_USAGE_RESTART_EXTENTS"; break;
   case       1164: c = "MQIACF_USAGE_EXPAND_COUNT"; break;
   case       1165: c = "MQIACF_PAGESET_STATUS"; break;
   case       1166: c = "MQIACF_USAGE_TOTAL_BUFFERS"; break;
   case       1167: c = "MQIACF_USAGE_DATA_SET_TYPE"; break;
   case       1168: c = "MQIACF_USAGE_PAGESET"; break;
   case       1169: c = "MQIACF_USAGE_DATA_SET"; break;
   case       1170: c = "MQIACF_USAGE_BUFFER_POOL"; break;
   case       1171: c = "MQIACF_MOVE_COUNT"; break;
   case       1172: c = "MQIACF_EXPIRY_Q_COUNT"; break;
   case       1173: c = "MQIACF_CONFIGURATION_OBJECTS"; break;
   case       1174: c = "MQIACF_CONFIGURATION_EVENTS"; break;
   case       1175: c = "MQIACF_SYSP_TYPE"; break;
   case       1176: c = "MQIACF_SYSP_DEALLOC_INTERVAL"; break;
   case       1177: c = "MQIACF_SYSP_MAX_ARCHIVE"; break;
   case       1178: c = "MQIACF_SYSP_MAX_READ_TAPES"; break;
   case       1179: c = "MQIACF_SYSP_IN_BUFFER_SIZE"; break;
   case       1180: c = "MQIACF_SYSP_OUT_BUFFER_SIZE"; break;
   case       1181: c = "MQIACF_SYSP_OUT_BUFFER_COUNT"; break;
   case       1182: c = "MQIACF_SYSP_ARCHIVE"; break;
   case       1183: c = "MQIACF_SYSP_DUAL_ACTIVE"; break;
   case       1184: c = "MQIACF_SYSP_DUAL_ARCHIVE"; break;
   case       1185: c = "MQIACF_SYSP_DUAL_BSDS"; break;
   case       1186: c = "MQIACF_SYSP_MAX_CONNS"; break;
   case       1187: c = "MQIACF_SYSP_MAX_CONNS_FORE"; break;
   case       1188: c = "MQIACF_SYSP_MAX_CONNS_BACK"; break;
   case       1189: c = "MQIACF_SYSP_EXIT_INTERVAL"; break;
   case       1190: c = "MQIACF_SYSP_EXIT_TASKS"; break;
   case       1191: c = "MQIACF_SYSP_CHKPOINT_COUNT"; break;
   case       1192: c = "MQIACF_SYSP_OTMA_INTERVAL"; break;
   case       1193: c = "MQIACF_SYSP_Q_INDEX_DEFER"; break;
   case       1194: c = "MQIACF_SYSP_DB2_TASKS"; break;
   case       1195: c = "MQIACF_SYSP_RESLEVEL_AUDIT"; break;
   case       1196: c = "MQIACF_SYSP_ROUTING_CODE"; break;
   case       1197: c = "MQIACF_SYSP_SMF_ACCOUNTING"; break;
   case       1198: c = "MQIACF_SYSP_SMF_STATS"; break;
   case       1199: c = "MQIACF_SYSP_SMF_INTERVAL"; break;
   case       1200: c = "MQIACF_SYSP_TRACE_CLASS"; break;
   case       1201: c = "MQIACF_SYSP_TRACE_SIZE"; break;
   case       1202: c = "MQIACF_SYSP_WLM_INTERVAL"; break;
   case       1203: c = "MQIACF_SYSP_ALLOC_UNIT"; break;
   case       1204: c = "MQIACF_SYSP_ARCHIVE_RETAIN"; break;
   case       1205: c = "MQIACF_SYSP_ARCHIVE_WTOR"; break;
   case       1206: c = "MQIACF_SYSP_BLOCK_SIZE"; break;
   case       1207: c = "MQIACF_SYSP_CATALOG"; break;
   case       1208: c = "MQIACF_SYSP_COMPACT"; break;
   case       1209: c = "MQIACF_SYSP_ALLOC_PRIMARY"; break;
   case       1210: c = "MQIACF_SYSP_ALLOC_SECONDARY"; break;
   case       1211: c = "MQIACF_SYSP_PROTECT"; break;
   case       1212: c = "MQIACF_SYSP_QUIESCE_INTERVAL"; break;
   case       1213: c = "MQIACF_SYSP_TIMESTAMP"; break;
   case       1214: c = "MQIACF_SYSP_UNIT_ADDRESS"; break;
   case       1215: c = "MQIACF_SYSP_UNIT_STATUS"; break;
   case       1216: c = "MQIACF_SYSP_LOG_COPY"; break;
   case       1217: c = "MQIACF_SYSP_LOG_USED"; break;
   case       1218: c = "MQIACF_SYSP_LOG_SUSPEND"; break;
   case       1219: c = "MQIACF_SYSP_OFFLOAD_STATUS"; break;
   case       1220: c = "MQIACF_SYSP_TOTAL_LOGS"; break;
   case       1221: c = "MQIACF_SYSP_FULL_LOGS"; break;
   case       1222: c = "MQIACF_LISTENER_ATTRS"; break;
   case       1223: c = "MQIACF_LISTENER_STATUS_ATTRS"; break;
   case       1224: c = "MQIACF_SERVICE_ATTRS"; break;
   case       1225: c = "MQIACF_SERVICE_STATUS_ATTRS"; break;
   case       1226: c = "MQIACF_Q_TIME_INDICATOR"; break;
   case       1227: c = "MQIACF_OLDEST_MSG_AGE"; break;
   case       1228: c = "MQIACF_AUTH_OPTIONS"; break;
   case       1229: c = "MQIACF_Q_MGR_STATUS_ATTRS"; break;
   case       1230: c = "MQIACF_CONNECTION_COUNT"; break;
   case       1231: c = "MQIACF_Q_MGR_FACILITY"; break;
   case       1232: c = "MQIACF_CHINIT_STATUS"; break;
   case       1233: c = "MQIACF_CMD_SERVER_STATUS"; break;
   case       1234: c = "MQIACF_ROUTE_DETAIL"; break;
   case       1235: c = "MQIACF_RECORDED_ACTIVITIES"; break;
   case       1236: c = "MQIACF_MAX_ACTIVITIES"; break;
   case       1237: c = "MQIACF_DISCONTINUITY_COUNT"; break;
   case       1238: c = "MQIACF_ROUTE_ACCUMULATION"; break;
   case       1239: c = "MQIACF_ROUTE_DELIVERY"; break;
   case       1240: c = "MQIACF_OPERATION_TYPE"; break;
   case       1241: c = "MQIACF_BACKOUT_COUNT"; break;
   case       1242: c = "MQIACF_COMP_CODE"; break;
   case       1243: c = "MQIACF_ENCODING"; break;
   case       1244: c = "MQIACF_EXPIRY"; break;
   case       1245: c = "MQIACF_FEEDBACK"; break;
   case       1247: c = "MQIACF_MSG_FLAGS"; break;
   case       1248: c = "MQIACF_MSG_LENGTH"; break;
   case       1249: c = "MQIACF_MSG_TYPE"; break;
   case       1250: c = "MQIACF_OFFSET"; break;
   case       1251: c = "MQIACF_ORIGINAL_LENGTH"; break;
   case       1252: c = "MQIACF_PERSISTENCE"; break;
   case       1253: c = "MQIACF_PRIORITY"; break;
   case       1254: c = "MQIACF_REASON_CODE"; break;
   case       1255: c = "MQIACF_REPORT"; break;
   case       1256: c = "MQIACF_VERSION"; break;
   case       1257: c = "MQIACF_UNRECORDED_ACTIVITIES"; break;
   case       1258: c = "MQIACF_MONITORING"; break;
   case       1259: c = "MQIACF_ROUTE_FORWARDING"; break;
   case       1260: c = "MQIACF_SERVICE_STATUS"; break;
   case       1261: c = "MQIACF_Q_TYPES"; break;
   case       1262: c = "MQIACF_USER_ID_SUPPORT"; break;
   case       1263: c = "MQIACF_INTERFACE_VERSION"; break;
   case       1264: c = "MQIACF_AUTH_SERVICE_ATTRS"; break;
   case       1265: c = "MQIACF_USAGE_EXPAND_TYPE"; break;
   case       1266: c = "MQIACF_SYSP_CLUSTER_CACHE"; break;
   case       1267: c = "MQIACF_SYSP_DB2_BLOB_TASKS"; break;
   case       1268: c = "MQIACF_SYSP_WLM_INT_UNITS"; break;
   case       1269: c = "MQIACF_TOPIC_ATTRS"; break;
   case       1271: c = "MQIACF_PUBSUB_PROPERTIES"; break;
   case       1273: c = "MQIACF_DESTINATION_CLASS"; break;
   case       1274: c = "MQIACF_DURABLE_SUBSCRIPTION"; break;
   case       1275: c = "MQIACF_SUBSCRIPTION_SCOPE"; break;
   case       1277: c = "MQIACF_VARIABLE_USER_ID"; break;
   case       1280: c = "MQIACF_REQUEST_ONLY"; break;
   case       1283: c = "MQIACF_PUB_PRIORITY"; break;
   case       1287: c = "MQIACF_SUB_ATTRS"; break;
   case       1288: c = "MQIACF_WILDCARD_SCHEMA"; break;
   case       1289: c = "MQIACF_SUB_TYPE"; break;
   case       1290: c = "MQIACF_MESSAGE_COUNT"; break;
   case       1291: c = "MQIACF_Q_MGR_PUBSUB"; break;
   case       1292: c = "MQIACF_Q_MGR_VERSION"; break;
   case       1294: c = "MQIACF_SUB_STATUS_ATTRS"; break;
   case       1295: c = "MQIACF_TOPIC_STATUS"; break;
   case       1296: c = "MQIACF_TOPIC_SUB"; break;
   case       1297: c = "MQIACF_TOPIC_PUB"; break;
   case       1300: c = "MQIACF_RETAINED_PUBLICATION"; break;
   case       1301: c = "MQIACF_TOPIC_STATUS_ATTRS"; break;
   case       1302: c = "MQIACF_TOPIC_STATUS_TYPE"; break;
   case       1303: c = "MQIACF_SUB_OPTIONS"; break;
   case       1304: c = "MQIACF_PUBLISH_COUNT"; break;
   case       1305: c = "MQIACF_CLEAR_TYPE"; break;
   case       1306: c = "MQIACF_CLEAR_SCOPE"; break;
   case       1307: c = "MQIACF_SUB_LEVEL"; break;
   case       1308: c = "MQIACF_ASYNC_STATE"; break;
   case       1309: c = "MQIACF_SUB_SUMMARY"; break;
   case       1310: c = "MQIACF_OBSOLETE_MSGS"; break;
   case       1311: c = "MQIACF_PUBSUB_STATUS"; break;
   case       1314: c = "MQIACF_PS_STATUS_TYPE"; break;
   case       1318: c = "MQIACF_PUBSUB_STATUS_ATTRS"; break;
   case       1321: c = "MQIACF_SELECTOR_TYPE"; break;
   case       1322: c = "MQIACF_LOG_COMPRESSION"; break;
   case       1323: c = "MQIACF_GROUPUR_CHECK_ID"; break;
   case       1324: c = "MQIACF_MULC_CAPTURE"; break;
   case       1325: c = "MQIACF_PERMIT_STANDBY"; break;
   case       1326: c = "MQIACF_OPERATION_MODE"; break;
   case       1327: c = "MQIACF_COMM_INFO_ATTRS"; break;
   case       1328: c = "MQIACF_CF_SMDS_BLOCK_SIZE"; break;
   case       1329: c = "MQIACF_CF_SMDS_EXPAND"; break;
   case       1330: c = "MQIACF_USAGE_FREE_BUFF"; break;
   case       1331: c = "MQIACF_USAGE_FREE_BUFF_PERC"; break;
   case       1332: c = "MQIACF_CF_STRUC_ACCESS"; break;
   case       1333: c = "MQIACF_CF_STATUS_SMDS"; break;
   case       1334: c = "MQIACF_SMDS_ATTRS"; break;
   case       1335: c = "MQIACF_USAGE_SMDS"; break;
   case       1336: c = "MQIACF_USAGE_BLOCK_SIZE"; break;
   case       1337: c = "MQIACF_USAGE_DATA_BLOCKS"; break;
   case       1338: c = "MQIACF_USAGE_EMPTY_BUFFERS"; break;
   case       1339: c = "MQIACF_USAGE_INUSE_BUFFERS"; break;
   case       1340: c = "MQIACF_USAGE_LOWEST_FREE"; break;
   case       1341: c = "MQIACF_USAGE_OFFLOAD_MSGS"; break;
   case       1342: c = "MQIACF_USAGE_READS_SAVED"; break;
   case       1343: c = "MQIACF_USAGE_SAVED_BUFFERS"; break;
   case       1344: c = "MQIACF_USAGE_TOTAL_BLOCKS"; break;
   case       1345: c = "MQIACF_USAGE_USED_BLOCKS"; break;
   case       1346: c = "MQIACF_USAGE_USED_RATE"; break;
   case       1347: c = "MQIACF_USAGE_WAIT_RATE"; break;
   case       1348: c = "MQIACF_SMDS_OPENMODE"; break;
   case       1349: c = "MQIACF_SMDS_STATUS"; break;
   case       1350: c = "MQIACF_SMDS_AVAIL"; break;
   case       1351: c = "MQIACF_MCAST_REL_INDICATOR"; break;
   case       1352: c = "MQIACF_CHLAUTH_TYPE"; break;
   case       1354: c = "MQIACF_MQXR_DIAGNOSTICS_TYPE"; break;
   case       1355: c = "MQIACF_CHLAUTH_ATTRS"; break;
   case       1356: c = "MQIACF_OPERATION_ID"; break;
   case       1357: c = "MQIACF_API_CALLER_TYPE"; break;
   case       1358: c = "MQIACF_API_ENVIRONMENT"; break;
   case       1359: c = "MQIACF_TRACE_DETAIL"; break;
   case       1360: c = "MQIACF_HOBJ"; break;
   case       1361: c = "MQIACF_CALL_TYPE"; break;
   case       1362: c = "MQIACF_MQCB_OPERATION"; break;
   case       1363: c = "MQIACF_MQCB_TYPE"; break;
   case       1364: c = "MQIACF_MQCB_OPTIONS"; break;
   case       1365: c = "MQIACF_CLOSE_OPTIONS"; break;
   case       1366: c = "MQIACF_CTL_OPERATION"; break;
   case       1367: c = "MQIACF_GET_OPTIONS"; break;
   case       1368: c = "MQIACF_RECS_PRESENT"; break;
   case       1369: c = "MQIACF_KNOWN_DEST_COUNT"; break;
   case       1370: c = "MQIACF_UNKNOWN_DEST_COUNT"; break;
   case       1371: c = "MQIACF_INVALID_DEST_COUNT"; break;
   case       1372: c = "MQIACF_RESOLVED_TYPE"; break;
   case       1373: c = "MQIACF_PUT_OPTIONS"; break;
   case       1374: c = "MQIACF_BUFFER_LENGTH"; break;
   case       1375: c = "MQIACF_TRACE_DATA_LENGTH"; break;
   case       1376: c = "MQIACF_SMDS_EXPANDST"; break;
   case       1378: c = "MQIACF_ITEM_COUNT"; break;
   case       1379: c = "MQIACF_EXPIRY_TIME"; break;
   case       1380: c = "MQIACF_CONNECT_TIME"; break;
   case       1381: c = "MQIACF_DISCONNECT_TIME"; break;
   case       1382: c = "MQIACF_HSUB"; break;
   case       1383: c = "MQIACF_SUBRQ_OPTIONS"; break;
   case       1384: c = "MQIACF_XA_RMID"; break;
   case       1385: c = "MQIACF_XA_FLAGS"; break;
   case       1386: c = "MQIACF_XA_RETCODE"; break;
   case       1387: c = "MQIACF_XA_HANDLE"; break;
   case       1388: c = "MQIACF_XA_RETVAL"; break;
   case       1389: c = "MQIACF_STATUS_TYPE"; break;
   case       1390: c = "MQIACF_XA_COUNT"; break;
   case       1391: c = "MQIACF_SELECTOR_COUNT"; break;
   case       1392: c = "MQIACF_SELECTORS"; break;
   case       1393: c = "MQIACF_INTATTR_COUNT"; break;
   case       1394: c = "MQIACF_INT_ATTRS"; break;
   case       1395: c = "MQIACF_SUBRQ_ACTION"; break;
   case       1396: c = "MQIACF_NUM_PUBS"; break;
   case       1397: c = "MQIACF_POINTER_SIZE"; break;
   case       1398: c = "MQIACF_REMOVE_AUTHREC"; break;
   case       1399: c = "MQIACF_XR_ATTRS"; break;
   case       1400: c = "MQIACF_APPL_FUNCTION_TYPE"; break;
   case       1401: c = "MQIACF_AMQP_ATTRS"; break;
   case       1402: c = "MQIACF_EXPORT_TYPE"; break;
   case       1403: c = "MQIACF_EXPORT_ATTRS"; break;
   case       1404: c = "MQIACF_SYSTEM_OBJECTS"; break;
   case       1405: c = "MQIACF_CONNECTION_SWAP"; break;
   case       1406: c = "MQIACF_AMQP_DIAGNOSTICS_TYPE"; break;
   case       1408: c = "MQIACF_BUFFER_POOL_LOCATION"; break;
   case       1409: c = "MQIACF_LDAP_CONNECTION_STATUS"; break;
   case       1410: c = "MQIACF_SYSP_MAX_ACE_POOL"; break;
   case       1411: c = "MQIACF_PAGECLAS"; break;
   case       1412: c = "MQIACF_AUTH_REC_TYPE"; break;
   case       1413: c = "MQIACF_SYSP_MAX_CONC_OFFLOADS"; break;
   case       1414: c = "MQIACF_SYSP_ZHYPERWRITE"; break;
   case       1415: c = "MQIACF_Q_MGR_STATUS_LOG"; break;
   case       1416: c = "MQIACF_ARCHIVE_LOG_SIZE"; break;
   case       1417: c = "MQIACF_MEDIA_LOG_SIZE"; break;
   case       1418: c = "MQIACF_RESTART_LOG_SIZE"; break;
   case       1419: c = "MQIACF_REUSABLE_LOG_SIZE"; break;
   case       1420: c = "MQIACF_LOG_IN_USE"; break;
   case       1421: c = "MQIACF_LOG_UTILIZATION"; break;
   case       1422: c = "MQIACF_LOG_REDUCTION"; break;
   case       1423: c = "MQIACF_IGNORE_STATE"; break;
   case       1424: c = "MQIACF_MOVABLE_APPL_COUNT"; break;
   case       1425: c = "MQIACF_APPL_INFO_ATTRS"; break;
   case       1426: c = "MQIACF_APPL_MOVABLE"; break;
   case       1427: c = "MQIACF_REMOTE_QMGR_ACTIVE"; break;
   case       1428: c = "MQIACF_APPL_INFO_TYPE"; break;
   case       1429: c = "MQIACF_APPL_INFO_APPL"; break;
   case       1430: c = "MQIACF_APPL_INFO_QMGR"; break;
   case       1431: c = "MQIACF_APPL_INFO_LOCAL"; break;
   case       1432: c = "MQIACF_APPL_IMMOVABLE_COUNT"; break;
   case       1433: c = "MQIACF_BALANCED"; break;
   case       1434: c = "MQIACF_BALSTATE"; break;
   case       1435: c = "MQIACF_APPL_IMMOVABLE_REASON"; break;
   case       1436: c = "MQIACF_DS_ENCRYPTED"; break;
   case       1437: c = "MQIACF_CUR_Q_FILE_SIZE"; break;
   case       1438: c = "MQIACF_CUR_MAX_FILE_SIZE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIACH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case       1501: c = "MQIACH_XMIT_PROTOCOL_TYPE"; break;
   case       1502: c = "MQIACH_BATCH_SIZE"; break;
   case       1503: c = "MQIACH_DISC_INTERVAL"; break;
   case       1504: c = "MQIACH_SHORT_TIMER"; break;
   case       1505: c = "MQIACH_SHORT_RETRY"; break;
   case       1506: c = "MQIACH_LONG_TIMER"; break;
   case       1507: c = "MQIACH_LONG_RETRY"; break;
   case       1508: c = "MQIACH_PUT_AUTHORITY"; break;
   case       1509: c = "MQIACH_SEQUENCE_NUMBER_WRAP"; break;
   case       1510: c = "MQIACH_MAX_MSG_LENGTH"; break;
   case       1511: c = "MQIACH_CHANNEL_TYPE"; break;
   case       1512: c = "MQIACH_DATA_COUNT"; break;
   case       1513: c = "MQIACH_NAME_COUNT"; break;
   case       1514: c = "MQIACH_MSG_SEQUENCE_NUMBER"; break;
   case       1515: c = "MQIACH_DATA_CONVERSION"; break;
   case       1516: c = "MQIACH_IN_DOUBT"; break;
   case       1517: c = "MQIACH_MCA_TYPE"; break;
   case       1518: c = "MQIACH_SESSION_COUNT"; break;
   case       1519: c = "MQIACH_ADAPTER"; break;
   case       1520: c = "MQIACH_COMMAND_COUNT"; break;
   case       1521: c = "MQIACH_SOCKET"; break;
   case       1522: c = "MQIACH_PORT"; break;
   case       1523: c = "MQIACH_CHANNEL_INSTANCE_TYPE"; break;
   case       1524: c = "MQIACH_CHANNEL_INSTANCE_ATTRS"; break;
   case       1525: c = "MQIACH_CHANNEL_ERROR_DATA"; break;
   case       1526: c = "MQIACH_CHANNEL_TABLE"; break;
   case       1527: c = "MQIACH_CHANNEL_STATUS"; break;
   case       1528: c = "MQIACH_INDOUBT_STATUS"; break;
   case       1529: c = "MQIACH_LAST_SEQ_NUMBER"; break;
   case       1531: c = "MQIACH_CURRENT_MSGS"; break;
   case       1532: c = "MQIACH_CURRENT_SEQ_NUMBER"; break;
   case       1533: c = "MQIACH_SSL_RETURN_CODE"; break;
   case       1534: c = "MQIACH_MSGS"; break;
   case       1535: c = "MQIACH_BYTES_SENT"; break;
   case       1536: c = "MQIACH_BYTES_RCVD"; break;
   case       1537: c = "MQIACH_BATCHES"; break;
   case       1538: c = "MQIACH_BUFFERS_SENT"; break;
   case       1539: c = "MQIACH_BUFFERS_RCVD"; break;
   case       1540: c = "MQIACH_LONG_RETRIES_LEFT"; break;
   case       1541: c = "MQIACH_SHORT_RETRIES_LEFT"; break;
   case       1542: c = "MQIACH_MCA_STATUS"; break;
   case       1543: c = "MQIACH_STOP_REQUESTED"; break;
   case       1544: c = "MQIACH_MR_COUNT"; break;
   case       1545: c = "MQIACH_MR_INTERVAL"; break;
   case       1562: c = "MQIACH_NPM_SPEED"; break;
   case       1563: c = "MQIACH_HB_INTERVAL"; break;
   case       1564: c = "MQIACH_BATCH_INTERVAL"; break;
   case       1565: c = "MQIACH_NETWORK_PRIORITY"; break;
   case       1566: c = "MQIACH_KEEP_ALIVE_INTERVAL"; break;
   case       1567: c = "MQIACH_BATCH_HB"; break;
   case       1568: c = "MQIACH_SSL_CLIENT_AUTH"; break;
   case       1570: c = "MQIACH_ALLOC_RETRY"; break;
   case       1571: c = "MQIACH_ALLOC_FAST_TIMER"; break;
   case       1572: c = "MQIACH_ALLOC_SLOW_TIMER"; break;
   case       1573: c = "MQIACH_DISC_RETRY"; break;
   case       1574: c = "MQIACH_PORT_NUMBER"; break;
   case       1575: c = "MQIACH_HDR_COMPRESSION"; break;
   case       1576: c = "MQIACH_MSG_COMPRESSION"; break;
   case       1577: c = "MQIACH_CLWL_CHANNEL_RANK"; break;
   case       1578: c = "MQIACH_CLWL_CHANNEL_PRIORITY"; break;
   case       1579: c = "MQIACH_CLWL_CHANNEL_WEIGHT"; break;
   case       1580: c = "MQIACH_CHANNEL_DISP"; break;
   case       1581: c = "MQIACH_INBOUND_DISP"; break;
   case       1582: c = "MQIACH_CHANNEL_TYPES"; break;
   case       1583: c = "MQIACH_ADAPS_STARTED"; break;
   case       1584: c = "MQIACH_ADAPS_MAX"; break;
   case       1585: c = "MQIACH_DISPS_STARTED"; break;
   case       1586: c = "MQIACH_DISPS_MAX"; break;
   case       1587: c = "MQIACH_SSLTASKS_STARTED"; break;
   case       1588: c = "MQIACH_SSLTASKS_MAX"; break;
   case       1589: c = "MQIACH_CURRENT_CHL"; break;
   case       1590: c = "MQIACH_CURRENT_CHL_MAX"; break;
   case       1591: c = "MQIACH_CURRENT_CHL_TCP"; break;
   case       1592: c = "MQIACH_CURRENT_CHL_LU62"; break;
   case       1593: c = "MQIACH_ACTIVE_CHL"; break;
   case       1594: c = "MQIACH_ACTIVE_CHL_MAX"; break;
   case       1595: c = "MQIACH_ACTIVE_CHL_PAUSED"; break;
   case       1596: c = "MQIACH_ACTIVE_CHL_STARTED"; break;
   case       1597: c = "MQIACH_ACTIVE_CHL_STOPPED"; break;
   case       1598: c = "MQIACH_ACTIVE_CHL_RETRY"; break;
   case       1599: c = "MQIACH_LISTENER_STATUS"; break;
   case       1600: c = "MQIACH_SHARED_CHL_RESTART"; break;
   case       1601: c = "MQIACH_LISTENER_CONTROL"; break;
   case       1602: c = "MQIACH_BACKLOG"; break;
   case       1604: c = "MQIACH_XMITQ_TIME_INDICATOR"; break;
   case       1605: c = "MQIACH_NETWORK_TIME_INDICATOR"; break;
   case       1606: c = "MQIACH_EXIT_TIME_INDICATOR"; break;
   case       1607: c = "MQIACH_BATCH_SIZE_INDICATOR"; break;
   case       1608: c = "MQIACH_XMITQ_MSGS_AVAILABLE"; break;
   case       1609: c = "MQIACH_CHANNEL_SUBSTATE"; break;
   case       1610: c = "MQIACH_SSL_KEY_RESETS"; break;
   case       1611: c = "MQIACH_COMPRESSION_RATE"; break;
   case       1612: c = "MQIACH_COMPRESSION_TIME"; break;
   case       1613: c = "MQIACH_MAX_XMIT_SIZE"; break;
   case       1614: c = "MQIACH_DEF_CHANNEL_DISP"; break;
   case       1615: c = "MQIACH_SHARING_CONVERSATIONS"; break;
   case       1616: c = "MQIACH_MAX_SHARING_CONVS"; break;
   case       1617: c = "MQIACH_CURRENT_SHARING_CONVS"; break;
   case       1618: c = "MQIACH_MAX_INSTANCES"; break;
   case       1619: c = "MQIACH_MAX_INSTS_PER_CLIENT"; break;
   case       1620: c = "MQIACH_CLIENT_CHANNEL_WEIGHT"; break;
   case       1621: c = "MQIACH_CONNECTION_AFFINITY"; break;
   case       1623: c = "MQIACH_RESET_REQUESTED"; break;
   case       1624: c = "MQIACH_BATCH_DATA_LIMIT"; break;
   case       1625: c = "MQIACH_MSG_HISTORY"; break;
   case       1626: c = "MQIACH_MULTICAST_PROPERTIES"; break;
   case       1627: c = "MQIACH_NEW_SUBSCRIBER_HISTORY"; break;
   case       1628: c = "MQIACH_MC_HB_INTERVAL"; break;
   case       1629: c = "MQIACH_USE_CLIENT_ID"; break;
   case       1630: c = "MQIACH_MQTT_KEEP_ALIVE"; break;
   case       1631: c = "MQIACH_IN_DOUBT_IN"; break;
   case       1632: c = "MQIACH_IN_DOUBT_OUT"; break;
   case       1633: c = "MQIACH_MSGS_SENT"; break;
   case       1634: c = "MQIACH_MSGS_RCVD"; break;
   case       1635: c = "MQIACH_PENDING_OUT"; break;
   case       1636: c = "MQIACH_AVAILABLE_CIPHERSPECS"; break;
   case       1637: c = "MQIACH_MATCH"; break;
   case       1638: c = "MQIACH_USER_SOURCE"; break;
   case       1639: c = "MQIACH_WARNING"; break;
   case       1640: c = "MQIACH_DEF_RECONNECT"; break;
   case       1642: c = "MQIACH_CHANNEL_SUMMARY_ATTRS"; break;
   case       1643: c = "MQIACH_PROTOCOL"; break;
   case       1644: c = "MQIACH_AMQP_KEEP_ALIVE"; break;
   case       1645: c = "MQIACH_SECURITY_PROTOCOL"; break;
   case       1646: c = "MQIACH_SPL_PROTECTION"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIAMO64_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case        703: c = "MQIAMO64_AVG_Q_TIME"; break;
   case        741: c = "MQIAMO64_Q_TIME_AVG"; break;
   case        742: c = "MQIAMO64_Q_TIME_MAX"; break;
   case        743: c = "MQIAMO64_Q_TIME_MIN"; break;
   case        745: c = "MQIAMO64_BROWSE_BYTES"; break;
   case        746: c = "MQIAMO64_BYTES"; break;
   case        747: c = "MQIAMO64_GET_BYTES"; break;
   case        748: c = "MQIAMO64_PUT_BYTES"; break;
   case        783: c = "MQIAMO64_TOPIC_PUT_BYTES"; break;
   case        785: c = "MQIAMO64_PUBLISH_MSG_BYTES"; break;
   case        838: c = "MQIAMO64_HIGHRES_TIME"; break;
   case        844: c = "MQIAMO64_QMGR_OP_DURATION"; break;
   case        845: c = "MQIAMO64_MONITOR_INTERVAL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIAMO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQIAMO_MONITOR_FLAGS_NONE"; break;
   case          1: c = "MQIAMO_MONITOR_FLAGS_OBJNAME"; break;
   case          2: c = "MQIAMO_MONITOR_DELTA"; break;
   case        100: c = "MQIAMO_MONITOR_HUNDREDTHS"; break;
   case        702: c = "MQIAMO_AVG_BATCH_SIZE"; break;
   case        703: c = "MQIAMO_AVG_Q_TIME"; break;
   case        704: c = "MQIAMO_BACKOUTS"; break;
   case        705: c = "MQIAMO_BROWSES"; break;
   case        706: c = "MQIAMO_BROWSE_MAX_BYTES"; break;
   case        707: c = "MQIAMO_BROWSE_MIN_BYTES"; break;
   case        708: c = "MQIAMO_BROWSES_FAILED"; break;
   case        709: c = "MQIAMO_CLOSES"; break;
   case        710: c = "MQIAMO_COMMITS"; break;
   case        711: c = "MQIAMO_COMMITS_FAILED"; break;
   case        712: c = "MQIAMO_CONNS"; break;
   case        713: c = "MQIAMO_CONNS_MAX"; break;
   case        714: c = "MQIAMO_DISCS"; break;
   case        715: c = "MQIAMO_DISCS_IMPLICIT"; break;
   case        716: c = "MQIAMO_DISC_TYPE"; break;
   case        717: c = "MQIAMO_EXIT_TIME_AVG"; break;
   case        718: c = "MQIAMO_EXIT_TIME_MAX"; break;
   case        719: c = "MQIAMO_EXIT_TIME_MIN"; break;
   case        720: c = "MQIAMO_FULL_BATCHES"; break;
   case        721: c = "MQIAMO_GENERATED_MSGS"; break;
   case        722: c = "MQIAMO_GETS"; break;
   case        723: c = "MQIAMO_GET_MAX_BYTES"; break;
   case        724: c = "MQIAMO_GET_MIN_BYTES"; break;
   case        725: c = "MQIAMO_GETS_FAILED"; break;
   case        726: c = "MQIAMO_INCOMPLETE_BATCHES"; break;
   case        727: c = "MQIAMO_INQS"; break;
   case        728: c = "MQIAMO_MSGS"; break;
   case        729: c = "MQIAMO_NET_TIME_AVG"; break;
   case        730: c = "MQIAMO_NET_TIME_MAX"; break;
   case        731: c = "MQIAMO_NET_TIME_MIN"; break;
   case        732: c = "MQIAMO_OBJECT_COUNT"; break;
   case        733: c = "MQIAMO_OPENS"; break;
   case        734: c = "MQIAMO_PUT1S"; break;
   case        735: c = "MQIAMO_PUTS"; break;
   case        736: c = "MQIAMO_PUT_MAX_BYTES"; break;
   case        737: c = "MQIAMO_PUT_MIN_BYTES"; break;
   case        738: c = "MQIAMO_PUT_RETRIES"; break;
   case        739: c = "MQIAMO_Q_MAX_DEPTH"; break;
   case        740: c = "MQIAMO_Q_MIN_DEPTH"; break;
   case        741: c = "MQIAMO_Q_TIME_AVG"; break;
   case        742: c = "MQIAMO_Q_TIME_MAX"; break;
   case        743: c = "MQIAMO_Q_TIME_MIN"; break;
   case        744: c = "MQIAMO_SETS"; break;
   case        749: c = "MQIAMO_CONNS_FAILED"; break;
   case        751: c = "MQIAMO_OPENS_FAILED"; break;
   case        752: c = "MQIAMO_INQS_FAILED"; break;
   case        753: c = "MQIAMO_SETS_FAILED"; break;
   case        754: c = "MQIAMO_PUTS_FAILED"; break;
   case        755: c = "MQIAMO_PUT1S_FAILED"; break;
   case        757: c = "MQIAMO_CLOSES_FAILED"; break;
   case        758: c = "MQIAMO_MSGS_EXPIRED"; break;
   case        759: c = "MQIAMO_MSGS_NOT_QUEUED"; break;
   case        760: c = "MQIAMO_MSGS_PURGED"; break;
   case        764: c = "MQIAMO_SUBS_DUR"; break;
   case        765: c = "MQIAMO_SUBS_NDUR"; break;
   case        766: c = "MQIAMO_SUBS_FAILED"; break;
   case        767: c = "MQIAMO_SUBRQS"; break;
   case        768: c = "MQIAMO_SUBRQS_FAILED"; break;
   case        769: c = "MQIAMO_CBS"; break;
   case        770: c = "MQIAMO_CBS_FAILED"; break;
   case        771: c = "MQIAMO_CTLS"; break;
   case        772: c = "MQIAMO_CTLS_FAILED"; break;
   case        773: c = "MQIAMO_STATS"; break;
   case        774: c = "MQIAMO_STATS_FAILED"; break;
   case        775: c = "MQIAMO_SUB_DUR_HIGHWATER"; break;
   case        776: c = "MQIAMO_SUB_DUR_LOWWATER"; break;
   case        777: c = "MQIAMO_SUB_NDUR_HIGHWATER"; break;
   case        778: c = "MQIAMO_SUB_NDUR_LOWWATER"; break;
   case        779: c = "MQIAMO_TOPIC_PUTS"; break;
   case        780: c = "MQIAMO_TOPIC_PUTS_FAILED"; break;
   case        781: c = "MQIAMO_TOPIC_PUT1S"; break;
   case        782: c = "MQIAMO_TOPIC_PUT1S_FAILED"; break;
   case        784: c = "MQIAMO_PUBLISH_MSG_COUNT"; break;
   case        786: c = "MQIAMO_UNSUBS_DUR"; break;
   case        787: c = "MQIAMO_UNSUBS_NDUR"; break;
   case        788: c = "MQIAMO_UNSUBS_FAILED"; break;
   case        789: c = "MQIAMO_INTERVAL"; break;
   case        790: c = "MQIAMO_MSGS_SENT"; break;
   case        791: c = "MQIAMO_BYTES_SENT"; break;
   case        792: c = "MQIAMO_REPAIR_BYTES"; break;
   case        793: c = "MQIAMO_FEEDBACK_MODE"; break;
   case        794: c = "MQIAMO_RELIABILITY_TYPE"; break;
   case        795: c = "MQIAMO_LATE_JOIN_MARK"; break;
   case        796: c = "MQIAMO_NACKS_RCVD"; break;
   case        797: c = "MQIAMO_REPAIR_PKTS"; break;
   case        798: c = "MQIAMO_HISTORY_PKTS"; break;
   case        799: c = "MQIAMO_PENDING_PKTS"; break;
   case        800: c = "MQIAMO_PKT_RATE"; break;
   case        801: c = "MQIAMO_MCAST_XMIT_RATE"; break;
   case        802: c = "MQIAMO_MCAST_BATCH_TIME"; break;
   case        803: c = "MQIAMO_MCAST_HEARTBEAT"; break;
   case        804: c = "MQIAMO_DEST_DATA_PORT"; break;
   case        805: c = "MQIAMO_DEST_REPAIR_PORT"; break;
   case        806: c = "MQIAMO_ACKS_RCVD"; break;
   case        807: c = "MQIAMO_ACTIVE_ACKERS"; break;
   case        808: c = "MQIAMO_PKTS_SENT"; break;
   case        809: c = "MQIAMO_TOTAL_REPAIR_PKTS"; break;
   case        810: c = "MQIAMO_TOTAL_PKTS_SENT"; break;
   case        811: c = "MQIAMO_TOTAL_MSGS_SENT"; break;
   case        812: c = "MQIAMO_TOTAL_BYTES_SENT"; break;
   case        813: c = "MQIAMO_NUM_STREAMS"; break;
   case        814: c = "MQIAMO_ACK_FEEDBACK"; break;
   case        815: c = "MQIAMO_NACK_FEEDBACK"; break;
   case        816: c = "MQIAMO_PKTS_LOST"; break;
   case        817: c = "MQIAMO_MSGS_RCVD"; break;
   case        818: c = "MQIAMO_MSG_BYTES_RCVD"; break;
   case        819: c = "MQIAMO_MSGS_DELIVERED"; break;
   case        820: c = "MQIAMO_PKTS_PROCESSED"; break;
   case        821: c = "MQIAMO_PKTS_DELIVERED"; break;
   case        822: c = "MQIAMO_PKTS_DROPPED"; break;
   case        823: c = "MQIAMO_PKTS_DUPLICATED"; break;
   case        824: c = "MQIAMO_NACKS_CREATED"; break;
   case        825: c = "MQIAMO_NACK_PKTS_SENT"; break;
   case        826: c = "MQIAMO_REPAIR_PKTS_RQSTD"; break;
   case        827: c = "MQIAMO_REPAIR_PKTS_RCVD"; break;
   case        828: c = "MQIAMO_PKTS_REPAIRED"; break;
   case        829: c = "MQIAMO_TOTAL_MSGS_RCVD"; break;
   case        830: c = "MQIAMO_TOTAL_MSG_BYTES_RCVD"; break;
   case        831: c = "MQIAMO_TOTAL_REPAIR_PKTS_RCVD"; break;
   case        832: c = "MQIAMO_TOTAL_REPAIR_PKTS_RQSTD"; break;
   case        833: c = "MQIAMO_TOTAL_MSGS_PROCESSED"; break;
   case        834: c = "MQIAMO_TOTAL_MSGS_SELECTED"; break;
   case        835: c = "MQIAMO_TOTAL_MSGS_EXPIRED"; break;
   case        836: c = "MQIAMO_TOTAL_MSGS_DELIVERED"; break;
   case        837: c = "MQIAMO_TOTAL_MSGS_RETURNED"; break;
   case        839: c = "MQIAMO_MONITOR_CLASS"; break;
   case        840: c = "MQIAMO_MONITOR_TYPE"; break;
   case        841: c = "MQIAMO_MONITOR_ELEMENT"; break;
   case        842: c = "MQIAMO_MONITOR_DATATYPE"; break;
   case        843: c = "MQIAMO_MONITOR_FLAGS"; break;
   case       1024: c = "MQIAMO_MONITOR_KB"; break;
   case      10000: c = "MQIAMO_MONITOR_PERCENT"; break;
   case    1000000: c = "MQIAMO_MONITOR_MICROSEC"; break;
   case    1048576: c = "MQIAMO_MONITOR_MB"; break;
   case  100000000: c = "MQIAMO_MONITOR_GB"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIASY_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -9: c = "MQIASY_VERSION"; break;
   case         -8: c = "MQIASY_BAG_OPTIONS"; break;
   case         -7: c = "MQIASY_REASON"; break;
   case         -6: c = "MQIASY_COMP_CODE"; break;
   case         -5: c = "MQIASY_CONTROL"; break;
   case         -4: c = "MQIASY_MSG_SEQ_NUMBER"; break;
   case         -3: c = "MQIASY_COMMAND"; break;
   case         -2: c = "MQIASY_TYPE"; break;
   case         -1: c = "MQIASY_CODED_CHAR_SET_ID"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIAV_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -2: c = "MQIAV_UNDEFINED"; break;
   case         -1: c = "MQIAV_NOT_APPLICABLE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIA_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQIA_APPL_TYPE"; break;
   case          2: c = "MQIA_CODED_CHAR_SET_ID"; break;
   case          3: c = "MQIA_CURRENT_Q_DEPTH"; break;
   case          4: c = "MQIA_DEF_INPUT_OPEN_OPTION"; break;
   case          5: c = "MQIA_DEF_PERSISTENCE"; break;
   case          6: c = "MQIA_DEF_PRIORITY"; break;
   case          7: c = "MQIA_DEFINITION_TYPE"; break;
   case          8: c = "MQIA_HARDEN_GET_BACKOUT"; break;
   case          9: c = "MQIA_INHIBIT_GET"; break;
   case         10: c = "MQIA_INHIBIT_PUT"; break;
   case         11: c = "MQIA_MAX_HANDLES"; break;
   case         12: c = "MQIA_USAGE"; break;
   case         13: c = "MQIA_MAX_MSG_LENGTH"; break;
   case         14: c = "MQIA_MAX_PRIORITY"; break;
   case         15: c = "MQIA_MAX_Q_DEPTH"; break;
   case         16: c = "MQIA_MSG_DELIVERY_SEQUENCE"; break;
   case         17: c = "MQIA_OPEN_INPUT_COUNT"; break;
   case         18: c = "MQIA_OPEN_OUTPUT_COUNT"; break;
   case         19: c = "MQIA_NAME_COUNT"; break;
   case         20: c = "MQIA_Q_TYPE"; break;
   case         21: c = "MQIA_RETENTION_INTERVAL"; break;
   case         22: c = "MQIA_BACKOUT_THRESHOLD"; break;
   case         23: c = "MQIA_SHAREABILITY"; break;
   case         24: c = "MQIA_TRIGGER_CONTROL"; break;
   case         25: c = "MQIA_TRIGGER_INTERVAL"; break;
   case         26: c = "MQIA_TRIGGER_MSG_PRIORITY"; break;
   case         27: c = "MQIA_CPI_LEVEL"; break;
   case         28: c = "MQIA_TRIGGER_TYPE"; break;
   case         29: c = "MQIA_TRIGGER_DEPTH"; break;
   case         30: c = "MQIA_SYNCPOINT"; break;
   case         31: c = "MQIA_COMMAND_LEVEL"; break;
   case         32: c = "MQIA_PLATFORM"; break;
   case         33: c = "MQIA_MAX_UNCOMMITTED_MSGS"; break;
   case         34: c = "MQIA_DIST_LISTS"; break;
   case         35: c = "MQIA_TIME_SINCE_RESET"; break;
   case         36: c = "MQIA_HIGH_Q_DEPTH"; break;
   case         37: c = "MQIA_MSG_ENQ_COUNT"; break;
   case         38: c = "MQIA_MSG_DEQ_COUNT"; break;
   case         39: c = "MQIA_EXPIRY_INTERVAL"; break;
   case         40: c = "MQIA_Q_DEPTH_HIGH_LIMIT"; break;
   case         41: c = "MQIA_Q_DEPTH_LOW_LIMIT"; break;
   case         42: c = "MQIA_Q_DEPTH_MAX_EVENT"; break;
   case         43: c = "MQIA_Q_DEPTH_HIGH_EVENT"; break;
   case         44: c = "MQIA_Q_DEPTH_LOW_EVENT"; break;
   case         45: c = "MQIA_SCOPE"; break;
   case         46: c = "MQIA_Q_SERVICE_INTERVAL_EVENT"; break;
   case         47: c = "MQIA_AUTHORITY_EVENT"; break;
   case         48: c = "MQIA_INHIBIT_EVENT"; break;
   case         49: c = "MQIA_LOCAL_EVENT"; break;
   case         50: c = "MQIA_REMOTE_EVENT"; break;
   case         51: c = "MQIA_CONFIGURATION_EVENT"; break;
   case         52: c = "MQIA_START_STOP_EVENT"; break;
   case         53: c = "MQIA_PERFORMANCE_EVENT"; break;
   case         54: c = "MQIA_Q_SERVICE_INTERVAL"; break;
   case         55: c = "MQIA_CHANNEL_AUTO_DEF"; break;
   case         56: c = "MQIA_CHANNEL_AUTO_DEF_EVENT"; break;
   case         57: c = "MQIA_INDEX_TYPE"; break;
   case         58: c = "MQIA_CLUSTER_WORKLOAD_LENGTH"; break;
   case         59: c = "MQIA_CLUSTER_Q_TYPE"; break;
   case         60: c = "MQIA_ARCHIVE"; break;
   case         61: c = "MQIA_DEF_BIND"; break;
   case         62: c = "MQIA_PAGESET_ID"; break;
   case         63: c = "MQIA_QSG_DISP"; break;
   case         64: c = "MQIA_INTRA_GROUP_QUEUING"; break;
   case         65: c = "MQIA_IGQ_PUT_AUTHORITY"; break;
   case         66: c = "MQIA_AUTH_INFO_TYPE"; break;
   case         68: c = "MQIA_MSG_MARK_BROWSE_INTERVAL"; break;
   case         69: c = "MQIA_SSL_TASKS"; break;
   case         70: c = "MQIA_CF_LEVEL"; break;
   case         71: c = "MQIA_CF_RECOVER"; break;
   case         72: c = "MQIA_NAMELIST_TYPE"; break;
   case         73: c = "MQIA_CHANNEL_EVENT"; break;
   case         74: c = "MQIA_BRIDGE_EVENT"; break;
   case         75: c = "MQIA_SSL_EVENT"; break;
   case         76: c = "MQIA_SSL_RESET_COUNT"; break;
   case         77: c = "MQIA_SHARED_Q_Q_MGR_NAME"; break;
   case         78: c = "MQIA_NPM_CLASS"; break;
   case         80: c = "MQIA_MAX_OPEN_Q"; break;
   case         81: c = "MQIA_MONITOR_INTERVAL"; break;
   case         82: c = "MQIA_Q_USERS"; break;
   case         83: c = "MQIA_MAX_GLOBAL_LOCKS"; break;
   case         84: c = "MQIA_MAX_LOCAL_LOCKS"; break;
   case         85: c = "MQIA_LISTENER_PORT_NUMBER"; break;
   case         86: c = "MQIA_BATCH_INTERFACE_AUTO"; break;
   case         87: c = "MQIA_CMD_SERVER_AUTO"; break;
   case         88: c = "MQIA_CMD_SERVER_CONVERT_MSG"; break;
   case         89: c = "MQIA_CMD_SERVER_DLQ_MSG"; break;
   case         90: c = "MQIA_MAX_Q_TRIGGERS"; break;
   case         91: c = "MQIA_TRIGGER_RESTART"; break;
   case         92: c = "MQIA_SSL_FIPS_REQUIRED"; break;
   case         93: c = "MQIA_IP_ADDRESS_VERSION"; break;
   case         94: c = "MQIA_LOGGER_EVENT"; break;
   case         95: c = "MQIA_CLWL_Q_RANK"; break;
   case         96: c = "MQIA_CLWL_Q_PRIORITY"; break;
   case         97: c = "MQIA_CLWL_MRU_CHANNELS"; break;
   case         98: c = "MQIA_CLWL_USEQ"; break;
   case         99: c = "MQIA_COMMAND_EVENT"; break;
   case        100: c = "MQIA_ACTIVE_CHANNELS"; break;
   case        101: c = "MQIA_CHINIT_ADAPTERS"; break;
   case        102: c = "MQIA_ADOPTNEWMCA_CHECK"; break;
   case        103: c = "MQIA_ADOPTNEWMCA_TYPE"; break;
   case        104: c = "MQIA_ADOPTNEWMCA_INTERVAL"; break;
   case        105: c = "MQIA_CHINIT_DISPATCHERS"; break;
   case        106: c = "MQIA_DNS_WLM"; break;
   case        107: c = "MQIA_LISTENER_TIMER"; break;
   case        108: c = "MQIA_LU62_CHANNELS"; break;
   case        109: c = "MQIA_MAX_CHANNELS"; break;
   case        110: c = "MQIA_OUTBOUND_PORT_MIN"; break;
   case        111: c = "MQIA_RECEIVE_TIMEOUT"; break;
   case        112: c = "MQIA_RECEIVE_TIMEOUT_TYPE"; break;
   case        113: c = "MQIA_RECEIVE_TIMEOUT_MIN"; break;
   case        114: c = "MQIA_TCP_CHANNELS"; break;
   case        115: c = "MQIA_TCP_KEEP_ALIVE"; break;
   case        116: c = "MQIA_TCP_STACK_TYPE"; break;
   case        117: c = "MQIA_CHINIT_TRACE_AUTO_START"; break;
   case        118: c = "MQIA_CHINIT_TRACE_TABLE_SIZE"; break;
   case        119: c = "MQIA_CHINIT_CONTROL"; break;
   case        120: c = "MQIA_CMD_SERVER_CONTROL"; break;
   case        121: c = "MQIA_SERVICE_TYPE"; break;
   case        122: c = "MQIA_MONITORING_CHANNEL"; break;
   case        123: c = "MQIA_MONITORING_Q"; break;
   case        124: c = "MQIA_MONITORING_AUTO_CLUSSDR"; break;
   case        127: c = "MQIA_STATISTICS_MQI"; break;
   case        128: c = "MQIA_STATISTICS_Q"; break;
   case        129: c = "MQIA_STATISTICS_CHANNEL"; break;
   case        130: c = "MQIA_STATISTICS_AUTO_CLUSSDR"; break;
   case        131: c = "MQIA_STATISTICS_INTERVAL"; break;
   case        133: c = "MQIA_ACCOUNTING_MQI"; break;
   case        134: c = "MQIA_ACCOUNTING_Q"; break;
   case        135: c = "MQIA_ACCOUNTING_INTERVAL"; break;
   case        136: c = "MQIA_ACCOUNTING_CONN_OVERRIDE"; break;
   case        137: c = "MQIA_TRACE_ROUTE_RECORDING"; break;
   case        138: c = "MQIA_ACTIVITY_RECORDING"; break;
   case        139: c = "MQIA_SERVICE_CONTROL"; break;
   case        140: c = "MQIA_OUTBOUND_PORT_MAX"; break;
   case        141: c = "MQIA_SECURITY_CASE"; break;
   case        150: c = "MQIA_QMOPT_CSMT_ON_ERROR"; break;
   case        151: c = "MQIA_QMOPT_CONS_INFO_MSGS"; break;
   case        152: c = "MQIA_QMOPT_CONS_WARNING_MSGS"; break;
   case        153: c = "MQIA_QMOPT_CONS_ERROR_MSGS"; break;
   case        154: c = "MQIA_QMOPT_CONS_CRITICAL_MSGS"; break;
   case        155: c = "MQIA_QMOPT_CONS_COMMS_MSGS"; break;
   case        156: c = "MQIA_QMOPT_CONS_REORG_MSGS"; break;
   case        157: c = "MQIA_QMOPT_CONS_SYSTEM_MSGS"; break;
   case        158: c = "MQIA_QMOPT_LOG_INFO_MSGS"; break;
   case        159: c = "MQIA_QMOPT_LOG_WARNING_MSGS"; break;
   case        160: c = "MQIA_QMOPT_LOG_ERROR_MSGS"; break;
   case        161: c = "MQIA_QMOPT_LOG_CRITICAL_MSGS"; break;
   case        162: c = "MQIA_QMOPT_LOG_COMMS_MSGS"; break;
   case        163: c = "MQIA_QMOPT_LOG_REORG_MSGS"; break;
   case        164: c = "MQIA_QMOPT_LOG_SYSTEM_MSGS"; break;
   case        165: c = "MQIA_QMOPT_TRACE_MQI_CALLS"; break;
   case        166: c = "MQIA_QMOPT_TRACE_COMMS"; break;
   case        167: c = "MQIA_QMOPT_TRACE_REORG"; break;
   case        168: c = "MQIA_QMOPT_TRACE_CONVERSION"; break;
   case        169: c = "MQIA_QMOPT_TRACE_SYSTEM"; break;
   case        170: c = "MQIA_QMOPT_INTERNAL_DUMP"; break;
   case        171: c = "MQIA_MAX_RECOVERY_TASKS"; break;
   case        172: c = "MQIA_MAX_CLIENTS"; break;
   case        173: c = "MQIA_AUTO_REORGANIZATION"; break;
   case        174: c = "MQIA_AUTO_REORG_INTERVAL"; break;
   case        175: c = "MQIA_DURABLE_SUB"; break;
   case        176: c = "MQIA_MULTICAST"; break;
   case        181: c = "MQIA_INHIBIT_PUB"; break;
   case        182: c = "MQIA_INHIBIT_SUB"; break;
   case        183: c = "MQIA_TREE_LIFE_TIME"; break;
   case        184: c = "MQIA_DEF_PUT_RESPONSE_TYPE"; break;
   case        185: c = "MQIA_TOPIC_DEF_PERSISTENCE"; break;
   case        186: c = "MQIA_MASTER_ADMIN"; break;
   case        187: c = "MQIA_PUBSUB_MODE"; break;
   case        188: c = "MQIA_DEF_READ_AHEAD"; break;
   case        189: c = "MQIA_READ_AHEAD"; break;
   case        190: c = "MQIA_PROPERTY_CONTROL"; break;
   case        192: c = "MQIA_MAX_PROPERTIES_LENGTH"; break;
   case        193: c = "MQIA_BASE_TYPE"; break;
   case        195: c = "MQIA_PM_DELIVERY"; break;
   case        196: c = "MQIA_NPM_DELIVERY"; break;
   case        199: c = "MQIA_PROXY_SUB"; break;
   case        203: c = "MQIA_PUBSUB_NP_MSG"; break;
   case        204: c = "MQIA_SUB_COUNT"; break;
   case        205: c = "MQIA_PUBSUB_NP_RESP"; break;
   case        206: c = "MQIA_PUBSUB_MAXMSG_RETRY_COUNT"; break;
   case        207: c = "MQIA_PUBSUB_SYNC_PT"; break;
   case        208: c = "MQIA_TOPIC_TYPE"; break;
   case        215: c = "MQIA_PUB_COUNT"; break;
   case        216: c = "MQIA_WILDCARD_OPERATION"; break;
   case        218: c = "MQIA_SUB_SCOPE"; break;
   case        219: c = "MQIA_PUB_SCOPE"; break;
   case        221: c = "MQIA_GROUP_UR"; break;
   case        222: c = "MQIA_UR_DISP"; break;
   case        223: c = "MQIA_COMM_INFO_TYPE"; break;
   case        224: c = "MQIA_CF_OFFLOAD"; break;
   case        225: c = "MQIA_CF_OFFLOAD_THRESHOLD1"; break;
   case        226: c = "MQIA_CF_OFFLOAD_THRESHOLD2"; break;
   case        227: c = "MQIA_CF_OFFLOAD_THRESHOLD3"; break;
   case        228: c = "MQIA_CF_SMDS_BUFFERS"; break;
   case        229: c = "MQIA_CF_OFFLDUSE"; break;
   case        230: c = "MQIA_MAX_RESPONSES"; break;
   case        231: c = "MQIA_RESPONSE_RESTART_POINT"; break;
   case        232: c = "MQIA_COMM_EVENT"; break;
   case        233: c = "MQIA_MCAST_BRIDGE"; break;
   case        234: c = "MQIA_USE_DEAD_LETTER_Q"; break;
   case        235: c = "MQIA_TOLERATE_UNPROTECTED"; break;
   case        236: c = "MQIA_SIGNATURE_ALGORITHM"; break;
   case        237: c = "MQIA_ENCRYPTION_ALGORITHM"; break;
   case        238: c = "MQIA_POLICY_VERSION"; break;
   case        239: c = "MQIA_ACTIVITY_CONN_OVERRIDE"; break;
   case        240: c = "MQIA_ACTIVITY_TRACE"; break;
   case        242: c = "MQIA_SUB_CONFIGURATION_EVENT"; break;
   case        243: c = "MQIA_XR_CAPABILITY"; break;
   case        244: c = "MQIA_CF_RECAUTO"; break;
   case        245: c = "MQIA_QMGR_CFCONLOS"; break;
   case        246: c = "MQIA_CF_CFCONLOS"; break;
   case        247: c = "MQIA_SUITE_B_STRENGTH"; break;
   case        248: c = "MQIA_CHLAUTH_RECORDS"; break;
   case        249: c = "MQIA_PUBSUB_CLUSTER"; break;
   case        250: c = "MQIA_DEF_CLUSTER_XMIT_Q_TYPE"; break;
   case        251: c = "MQIA_PROT_POLICY_CAPABILITY"; break;
   case        252: c = "MQIA_CERT_VAL_POLICY"; break;
   case        253: c = "MQIA_TOPIC_NODE_COUNT"; break;
   case        254: c = "MQIA_REVERSE_DNS_LOOKUP"; break;
   case        255: c = "MQIA_CLUSTER_PUB_ROUTE"; break;
   case        256: c = "MQIA_CLUSTER_OBJECT_STATE"; break;
   case        257: c = "MQIA_CHECK_LOCAL_BINDING"; break;
   case        258: c = "MQIA_CHECK_CLIENT_BINDING"; break;
   case        259: c = "MQIA_AUTHENTICATION_FAIL_DELAY"; break;
   case        260: c = "MQIA_ADOPT_CONTEXT"; break;
   case        261: c = "MQIA_LDAP_SECURE_COMM"; break;
   case        262: c = "MQIA_DISPLAY_TYPE"; break;
   case        263: c = "MQIA_LDAP_AUTHORMD"; break;
   case        264: c = "MQIA_LDAP_NESTGRP"; break;
   case        265: c = "MQIA_AMQP_CAPABILITY"; break;
   case        266: c = "MQIA_AUTHENTICATION_METHOD"; break;
   case        267: c = "MQIA_KEY_REUSE_COUNT"; break;
   case        268: c = "MQIA_MEDIA_IMAGE_SCHEDULING"; break;
   case        269: c = "MQIA_MEDIA_IMAGE_INTERVAL"; break;
   case        270: c = "MQIA_MEDIA_IMAGE_LOG_LENGTH"; break;
   case        271: c = "MQIA_MEDIA_IMAGE_RECOVER_OBJ"; break;
   case        272: c = "MQIA_MEDIA_IMAGE_RECOVER_Q"; break;
   case        273: c = "MQIA_ADVANCED_CAPABILITY"; break;
   case        274: c = "MQIA_MAX_Q_FILE_SIZE"; break;
   case       2000: c = "MQIA_USER_LIST"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIDO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQIDO_COMMIT"; break;
   case          2: c = "MQIDO_BACKOUT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIEPF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQIEPF_NONE"; break;
   case          1: c = "MQIEPF_THREADED_LIBRARY"; break;
   case          2: c = "MQIEPF_LOCAL_LIBRARY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIGQPA_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQIGQPA_DEFAULT"; break;
   case          2: c = "MQIGQPA_CONTEXT"; break;
   case          3: c = "MQIGQPA_ONLY_IGQ"; break;
   case          4: c = "MQIGQPA_ALTERNATE_OR_IGQ"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIGQ_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQIGQ_DISABLED"; break;
   case          1: c = "MQIGQ_ENABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIIH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQIIH_NONE"; break;
   case          1: c = "MQIIH_PASS_EXPIRATION"; break;
   case          8: c = "MQIIH_REPLY_FORMAT_NONE"; break;
   case         16: c = "MQIIH_IGNORE_PURG"; break;
   case         32: c = "MQIIH_CM0_REQUEST_RESPONSE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIMGRCOV_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQIMGRCOV_NO"; break;
   case          1: c = "MQIMGRCOV_YES"; break;
   case          2: c = "MQIMGRCOV_AS_Q_MGR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIMMREASON_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQIMMREASON_NONE"; break;
   case          1: c = "MQIMMREASON_NOT_CLIENT"; break;
   case          2: c = "MQIMMREASON_NOT_RECONNECTABLE"; break;
   case          3: c = "MQIMMREASON_MOVING"; break;
   case          4: c = "MQIMMREASON_APPLNAME_CHANGED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIMPO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQIMPO_NONE"; break;
   case          2: c = "MQIMPO_CONVERT_TYPE"; break;
   case          4: c = "MQIMPO_QUERY_LENGTH"; break;
   case          8: c = "MQIMPO_INQ_NEXT"; break;
   case         16: c = "MQIMPO_INQ_PROP_UNDER_CURSOR"; break;
   case         32: c = "MQIMPO_CONVERT_VALUE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQINBD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQINBD_Q_MGR"; break;
   case          3: c = "MQINBD_GROUP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIND_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -2: c = "MQIND_ALL"; break;
   case         -1: c = "MQIND_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIPADDR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQIPADDR_IPV4"; break;
   case          1: c = "MQIPADDR_IPV6"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQIS_NO"; break;
   case          1: c = "MQIS_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQIT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQIT_NONE"; break;
   case          1: c = "MQIT_MSG_ID"; break;
   case          2: c = "MQIT_CORREL_ID"; break;
   case          4: c = "MQIT_MSG_TOKEN"; break;
   case          5: c = "MQIT_GROUP_ID"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQKAI_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQKAI_AUTO"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQKEY_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQKEY_REUSE_UNLIMITED"; break;
   case          0: c = "MQKEY_REUSE_DISABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQLDAPC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQLDAPC_INACTIVE"; break;
   case          1: c = "MQLDAPC_CONNECTED"; break;
   case          2: c = "MQLDAPC_ERROR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQLDAP_AUTHORMD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQLDAP_AUTHORMD_OS"; break;
   case          1: c = "MQLDAP_AUTHORMD_SEARCHGRP"; break;
   case          2: c = "MQLDAP_AUTHORMD_SEARCHUSR"; break;
   case          3: c = "MQLDAP_AUTHORMD_SRCHGRPSN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQLDAP_NESTGRP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQLDAP_NESTGRP_NO"; break;
   case          1: c = "MQLDAP_NESTGRP_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQLR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -2: c = "MQLR_MAX"; break;
   case         -1: c = "MQLR_AUTO"; break;
   case          1: c = "MQLR_ONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMASTER_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMASTER_NO"; break;
   case          1: c = "MQMASTER_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMATCH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMATCH_GENERIC"; break;
   case          1: c = "MQMATCH_RUNCHECK"; break;
   case          2: c = "MQMATCH_EXACT"; break;
   case          3: c = "MQMATCH_ALL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMCAS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMCAS_STOPPED"; break;
   case          3: c = "MQMCAS_RUNNING"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMCAT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQMCAT_PROCESS"; break;
   case          2: c = "MQMCAT_THREAD"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMCB_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMCB_DISABLED"; break;
   case          1: c = "MQMCB_ENABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMCEV_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQMCEV_PACKET_LOSS"; break;
   case          2: c = "MQMCEV_HEARTBEAT_TIMEOUT"; break;
   case          3: c = "MQMCEV_VERSION_CONFLICT"; break;
   case          4: c = "MQMCEV_RELIABILITY"; break;
   case          5: c = "MQMCEV_CLOSED_TRANS"; break;
   case          6: c = "MQMCEV_STREAM_ERROR"; break;
   case         10: c = "MQMCEV_NEW_SOURCE"; break;
   case         11: c = "MQMCEV_RECEIVE_QUEUE_TRIMMED"; break;
   case         12: c = "MQMCEV_PACKET_LOSS_NACK_EXPIRE"; break;
   case         13: c = "MQMCEV_ACK_RETRIES_EXCEEDED"; break;
   case         14: c = "MQMCEV_STREAM_SUSPEND_NACK"; break;
   case         15: c = "MQMCEV_STREAM_RESUME_NACK"; break;
   case         16: c = "MQMCEV_STREAM_EXPELLED"; break;
   case         20: c = "MQMCEV_FIRST_MESSAGE"; break;
   case         21: c = "MQMCEV_LATE_JOIN_FAILURE"; break;
   case         22: c = "MQMCEV_MESSAGE_LOSS"; break;
   case         23: c = "MQMCEV_SEND_PACKET_FAILURE"; break;
   case         24: c = "MQMCEV_REPAIR_DELAY"; break;
   case         25: c = "MQMCEV_MEMORY_ALERT_ON"; break;
   case         26: c = "MQMCEV_MEMORY_ALERT_OFF"; break;
   case         27: c = "MQMCEV_NACK_ALERT_ON"; break;
   case         28: c = "MQMCEV_NACK_ALERT_OFF"; break;
   case         29: c = "MQMCEV_REPAIR_ALERT_ON"; break;
   case         30: c = "MQMCEV_REPAIR_ALERT_OFF"; break;
   case         31: c = "MQMCEV_RELIABILITY_CHANGED"; break;
   case         80: c = "MQMCEV_SHM_DEST_UNUSABLE"; break;
   case         81: c = "MQMCEV_SHM_PORT_UNUSABLE"; break;
   case        110: c = "MQMCEV_CCT_GETTIME_FAILED"; break;
   case        120: c = "MQMCEV_DEST_INTERFACE_FAILURE"; break;
   case        121: c = "MQMCEV_DEST_INTERFACE_FAILOVER"; break;
   case        122: c = "MQMCEV_PORT_INTERFACE_FAILURE"; break;
   case        123: c = "MQMCEV_PORT_INTERFACE_FAILOVER"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMCP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -2: c = "MQMCP_COMPAT"; break;
   case         -1: c = "MQMCP_ALL"; break;
   case          0: c = "MQMCP_NONE"; break;
   case          1: c = "MQMCP_USER"; break;
   case          2: c = "MQMCP_REPLY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMC_AS_PARENT"; break;
   case          1: c = "MQMC_ENABLED"; break;
   case          2: c = "MQMC_DISABLED"; break;
   case          3: c = "MQMC_ONLY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMDEF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMDEF_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMDS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMDS_PRIORITY"; break;
   case          1: c = "MQMDS_FIFO"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMEDIMGINTVL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMEDIMGINTVL_OFF"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMEDIMGLOGLN_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMEDIMGLOGLN_OFF"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMEDIMGSCHED_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMEDIMGSCHED_MANUAL"; break;
   case          1: c = "MQMEDIMGSCHED_AUTO"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case   -1048576: c = "MQMF_ACCEPT_UNSUP_MASK"; break;
   case          0: c = "MQMF_NONE"; break;
   case          1: c = "MQMF_SEGMENTATION_ALLOWED"; break;
   case          2: c = "MQMF_SEGMENT"; break;
   case          4: c = "MQMF_LAST_SEGMENT"; break;
   case          8: c = "MQMF_MSG_IN_GROUP"; break;
   case         16: c = "MQMF_LAST_MSG_IN_GROUP"; break;
   case       4095: c = "MQMF_REJECT_UNSUP_MASK"; break;
   case    1044480: c = "MQMF_ACCEPT_UNSUP_IF_XMIT_MASK"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMHBO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMHBO_NONE"; break;
   case          1: c = "MQMHBO_PROPERTIES_IN_MQRFH2"; break;
   case          2: c = "MQMHBO_DELETE_PROPERTIES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMLP_ENCRYPTION_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMLP_ENCRYPTION_ALG_NONE"; break;
   case          1: c = "MQMLP_ENCRYPTION_ALG_RC2"; break;
   case          2: c = "MQMLP_ENCRYPTION_ALG_DES"; break;
   case          3: c = "MQMLP_ENCRYPTION_ALG_3DES"; break;
   case          4: c = "MQMLP_ENCRYPTION_ALG_AES128"; break;
   case          5: c = "MQMLP_ENCRYPTION_ALG_AES256"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMLP_SIGN_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMLP_SIGN_ALG_NONE"; break;
   case          1: c = "MQMLP_SIGN_ALG_MD5"; break;
   case          2: c = "MQMLP_SIGN_ALG_SHA1"; break;
   case          3: c = "MQMLP_SIGN_ALG_SHA224"; break;
   case          4: c = "MQMLP_SIGN_ALG_SHA256"; break;
   case          5: c = "MQMLP_SIGN_ALG_SHA384"; break;
   case          6: c = "MQMLP_SIGN_ALG_SHA512"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMLP_TOLERATE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMLP_TOLERATE_UNPROTECTED_NO"; break;
   case          1: c = "MQMLP_TOLERATE_UNPROTECTED_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMMBI_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQMMBI_UNLIMITED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMODE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMODE_FORCE"; break;
   case          1: c = "MQMODE_QUIESCE"; break;
   case          2: c = "MQMODE_TERMINATE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMON_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -3: c = "MQMON_Q_MGR"; break;
   case         -1: c = "MQMON_NONE"; break;
   case          0: c = "MQMON_OFF"; break;
   case          1: c = "MQMON_ON"; break;
   case         17: c = "MQMON_LOW"; break;
   case         33: c = "MQMON_MEDIUM"; break;
   case         65: c = "MQMON_HIGH"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMO_NONE"; break;
   case          1: c = "MQMO_MATCH_MSG_ID"; break;
   case          2: c = "MQMO_MATCH_CORREL_ID"; break;
   case          4: c = "MQMO_MATCH_GROUP_ID"; break;
   case          8: c = "MQMO_MATCH_MSG_SEQ_NUMBER"; break;
   case         16: c = "MQMO_MATCH_OFFSET"; break;
   case         32: c = "MQMO_MATCH_MSG_TOKEN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQMT_REQUEST"; break;
   case          2: c = "MQMT_REPLY"; break;
   case          4: c = "MQMT_REPORT"; break;
   case          8: c = "MQMT_DATAGRAM"; break;
   case        112: c = "MQMT_MQE_FIELDS_FROM_MQE"; break;
   case        113: c = "MQMT_MQE_FIELDS"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQMULC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQMULC_STANDARD"; break;
   case          1: c = "MQMULC_REFINED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQNC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case        256: c = "MQNC_MAX_NAMELIST_NAME_COUNT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQNPMS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQNPMS_NORMAL"; break;
   case          2: c = "MQNPMS_FAST"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQNPM_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQNPM_CLASS_NORMAL"; break;
   case         10: c = "MQNPM_CLASS_HIGH"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQNSH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQNSH_ALL"; break;
   case          0: c = "MQNSH_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQNT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQNT_NONE"; break;
   case          1: c = "MQNT_Q"; break;
   case          2: c = "MQNT_CLUSTER"; break;
   case          4: c = "MQNT_AUTH_INFO"; break;
   case       1001: c = "MQNT_ALL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQOL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQOL_UNDEFINED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQOM_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQOM_NO"; break;
   case          1: c = "MQOM_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQOO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQOO_READ_AHEAD_AS_Q_DEF"; break;
   case          1: c = "MQOO_INPUT_AS_Q_DEF"; break;
   case          2: c = "MQOO_INPUT_SHARED"; break;
   case          4: c = "MQOO_INPUT_EXCLUSIVE"; break;
   case          8: c = "MQOO_BROWSE"; break;
   case         16: c = "MQOO_OUTPUT"; break;
   case         32: c = "MQOO_INQUIRE"; break;
   case         64: c = "MQOO_SET"; break;
   case        128: c = "MQOO_SAVE_ALL_CONTEXT"; break;
   case        256: c = "MQOO_PASS_IDENTITY_CONTEXT"; break;
   case        512: c = "MQOO_PASS_ALL_CONTEXT"; break;
   case       1024: c = "MQOO_SET_IDENTITY_CONTEXT"; break;
   case       2048: c = "MQOO_SET_ALL_CONTEXT"; break;
   case       4096: c = "MQOO_ALTERNATE_USER_AUTHORITY"; break;
   case       8192: c = "MQOO_FAIL_IF_QUIESCING"; break;
   case      16384: c = "MQOO_BIND_ON_OPEN"; break;
   case      32768: c = "MQOO_BIND_NOT_FIXED"; break;
   case      65536: c = "MQOO_RESOLVE_NAMES"; break;
   case     131072: c = "MQOO_CO_OP"; break;
   case     262144: c = "MQOO_RESOLVE_LOCAL_Q"; break;
   case     524288: c = "MQOO_NO_READ_AHEAD"; break;
   case    1048576: c = "MQOO_READ_AHEAD"; break;
   case    2097152: c = "MQOO_NO_MULTICAST"; break;
   case    4194304: c = "MQOO_BIND_ON_GROUP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQOPER_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQOPER_UNKNOWN"; break;
   case          1: c = "MQOPER_BROWSE"; break;
   case          2: c = "MQOPER_DISCARD"; break;
   case          3: c = "MQOPER_GET"; break;
   case          4: c = "MQOPER_PUT"; break;
   case          5: c = "MQOPER_PUT_REPLY"; break;
   case          6: c = "MQOPER_PUT_REPORT"; break;
   case          7: c = "MQOPER_RECEIVE"; break;
   case          8: c = "MQOPER_SEND"; break;
   case          9: c = "MQOPER_TRANSFORM"; break;
   case         10: c = "MQOPER_PUBLISH"; break;
   case         11: c = "MQOPER_EXCLUDED_PUBLISH"; break;
   case         12: c = "MQOPER_DISCARDED_PUBLISH"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQOPMODE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQOPMODE_COMPAT"; break;
   case          1: c = "MQOPMODE_NEW_FUNCTION"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQOP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQOP_START"; break;
   case          2: c = "MQOP_START_WAIT"; break;
   case          4: c = "MQOP_STOP"; break;
   case        256: c = "MQOP_REGISTER"; break;
   case        512: c = "MQOP_DEREGISTER"; break;
   case      65536: c = "MQOP_SUSPEND"; break;
   case     131072: c = "MQOP_RESUME"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQOT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQOT_NONE"; break;
   case          1: c = "MQOT_Q"; break;
   case          2: c = "MQOT_NAMELIST"; break;
   case          3: c = "MQOT_PROCESS"; break;
   case          4: c = "MQOT_STORAGE_CLASS"; break;
   case          5: c = "MQOT_Q_MGR"; break;
   case          6: c = "MQOT_CHANNEL"; break;
   case          7: c = "MQOT_AUTH_INFO"; break;
   case          8: c = "MQOT_TOPIC"; break;
   case          9: c = "MQOT_COMM_INFO"; break;
   case         10: c = "MQOT_CF_STRUC"; break;
   case         11: c = "MQOT_LISTENER"; break;
   case         12: c = "MQOT_SERVICE"; break;
   case        999: c = "MQOT_RESERVED_1"; break;
   case       1001: c = "MQOT_ALL"; break;
   case       1002: c = "MQOT_ALIAS_Q"; break;
   case       1003: c = "MQOT_MODEL_Q"; break;
   case       1004: c = "MQOT_LOCAL_Q"; break;
   case       1005: c = "MQOT_REMOTE_Q"; break;
   case       1007: c = "MQOT_SENDER_CHANNEL"; break;
   case       1008: c = "MQOT_SERVER_CHANNEL"; break;
   case       1009: c = "MQOT_REQUESTER_CHANNEL"; break;
   case       1010: c = "MQOT_RECEIVER_CHANNEL"; break;
   case       1011: c = "MQOT_CURRENT_CHANNEL"; break;
   case       1012: c = "MQOT_SAVED_CHANNEL"; break;
   case       1013: c = "MQOT_SVRCONN_CHANNEL"; break;
   case       1014: c = "MQOT_CLNTCONN_CHANNEL"; break;
   case       1015: c = "MQOT_SHORT_CHANNEL"; break;
   case       1016: c = "MQOT_CHLAUTH"; break;
   case       1017: c = "MQOT_REMOTE_Q_MGR_NAME"; break;
   case       1019: c = "MQOT_PROT_POLICY"; break;
   case       1020: c = "MQOT_TT_CHANNEL"; break;
   case       1021: c = "MQOT_AMQP_CHANNEL"; break;
   case       1022: c = "MQOT_AUTH_REC"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPAGECLAS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQPAGECLAS_4KB"; break;
   case          1: c = "MQPAGECLAS_FIXED4KB"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPA_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQPA_DEFAULT"; break;
   case          2: c = "MQPA_CONTEXT"; break;
   case          3: c = "MQPA_ONLY_MCA"; break;
   case          4: c = "MQPA_ALTERNATE_OR_MCA"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case   -1048576: c = "MQPD_REJECT_UNSUP_MASK"; break;
   case          0: c = "MQPD_NONE"; break;
   case          1: c = "MQPD_SUPPORT_OPTIONAL"; break;
   case       1023: c = "MQPD_ACCEPT_UNSUP_MASK"; break;
   case       1024: c = "MQPD_SUPPORT_REQUIRED_IF_LOCAL"; break;
   case    1047552: c = "MQPD_ACCEPT_UNSUP_IF_XMIT_MASK"; break;
   case    1048576: c = "MQPD_SUPPORT_REQUIRED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPER_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQPER_PERSISTENCE_AS_PARENT"; break;
   case          0: c = "MQPER_NOT_PERSISTENT"; break;
   case          1: c = "MQPER_PERSISTENT"; break;
   case          2: c = "MQPER_PERSISTENCE_AS_Q_DEF"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQPL_ZOS"; break;
   case          2: c = "MQPL_OS2"; break;
   case          3: c = "MQPL_UNIX"; break;
   case          4: c = "MQPL_OS400"; break;
   case          5: c = "MQPL_WINDOWS"; break;
   case         11: c = "MQPL_WINDOWS_NT"; break;
   case         12: c = "MQPL_VMS"; break;
   case         13: c = "MQPL_NSK"; break;
   case         15: c = "MQPL_OPEN_TP1"; break;
   case         18: c = "MQPL_VM"; break;
   case         23: c = "MQPL_TPF"; break;
   case         27: c = "MQPL_VSE"; break;
   case         28: c = "MQPL_APPLIANCE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPMO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQPMO_NONE"; break;
   case          2: c = "MQPMO_SYNCPOINT"; break;
   case          4: c = "MQPMO_NO_SYNCPOINT"; break;
   case         32: c = "MQPMO_DEFAULT_CONTEXT"; break;
   case         64: c = "MQPMO_NEW_MSG_ID"; break;
   case        128: c = "MQPMO_NEW_CORREL_ID"; break;
   case        256: c = "MQPMO_PASS_IDENTITY_CONTEXT"; break;
   case        512: c = "MQPMO_PASS_ALL_CONTEXT"; break;
   case       1024: c = "MQPMO_SET_IDENTITY_CONTEXT"; break;
   case       2048: c = "MQPMO_SET_ALL_CONTEXT"; break;
   case       4096: c = "MQPMO_ALTERNATE_USER_AUTHORITY"; break;
   case       8192: c = "MQPMO_FAIL_IF_QUIESCING"; break;
   case      16384: c = "MQPMO_NO_CONTEXT"; break;
   case      32768: c = "MQPMO_LOGICAL_ORDER"; break;
   case      65536: c = "MQPMO_ASYNC_RESPONSE"; break;
   case     131072: c = "MQPMO_SYNC_RESPONSE"; break;
   case     262144: c = "MQPMO_RESOLVE_LOCAL_Q"; break;
   case     524288: c = "MQPMO_WARN_IF_NO_SUBS_MATCHED"; break;
   case    2097152: c = "MQPMO_RETAIN"; break;
   case    8388608: c = "MQPMO_MD_FOR_OUTPUT_ONLY"; break;
   case   67108864: c = "MQPMO_SCOPE_QMGR"; break;
   case  134217728: c = "MQPMO_SUPPRESS_REPLYTO"; break;
   case  268435456: c = "MQPMO_NOT_OWN_SUBS"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPMRF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQPMRF_NONE"; break;
   case          1: c = "MQPMRF_MSG_ID"; break;
   case          2: c = "MQPMRF_CORREL_ID"; break;
   case          4: c = "MQPMRF_GROUP_ID"; break;
   case          8: c = "MQPMRF_FEEDBACK"; break;
   case         16: c = "MQPMRF_ACCOUNTING_TOKEN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQPO_NO"; break;
   case          1: c = "MQPO_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPRI_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -3: c = "MQPRI_PRIORITY_AS_PUBLISHED"; break;
   case         -2: c = "MQPRI_PRIORITY_AS_PARENT"; break;
   case         -1: c = "MQPRI_PRIORITY_AS_Q_DEF"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPROP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQPROP_UNRESTRICTED_LENGTH"; break;
   case          0: c = "MQPROP_COMPATIBILITY"; break;
   case          1: c = "MQPROP_NONE"; break;
   case          2: c = "MQPROP_ALL"; break;
   case          3: c = "MQPROP_FORCE_MQRFH2"; break;
   case          4: c = "MQPROP_V6COMPAT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPROTO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQPROTO_MQTTV3"; break;
   case          2: c = "MQPROTO_HTTP"; break;
   case          3: c = "MQPROTO_AMQP"; break;
   case          4: c = "MQPROTO_MQTTV311"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPRT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQPRT_RESPONSE_AS_PARENT"; break;
   case          1: c = "MQPRT_SYNC_RESPONSE"; break;
   case          2: c = "MQPRT_ASYNC_RESPONSE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPSCLUS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQPSCLUS_DISABLED"; break;
   case          1: c = "MQPSCLUS_ENABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPSCT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQPSCT_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPSM_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQPSM_DISABLED"; break;
   case          1: c = "MQPSM_COMPAT"; break;
   case          2: c = "MQPSM_ENABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPSPROP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQPSPROP_NONE"; break;
   case          1: c = "MQPSPROP_COMPAT"; break;
   case          2: c = "MQPSPROP_RFH2"; break;
   case          3: c = "MQPSPROP_MSGPROP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPSST_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQPSST_ALL"; break;
   case          1: c = "MQPSST_LOCAL"; break;
   case          2: c = "MQPSST_PARENT"; break;
   case          3: c = "MQPSST_CHILD"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQPS_STATUS_INACTIVE"; break;
   case          1: c = "MQPS_STATUS_STARTING"; break;
   case          2: c = "MQPS_STATUS_STOPPING"; break;
   case          3: c = "MQPS_STATUS_ACTIVE"; break;
   case          4: c = "MQPS_STATUS_COMPAT"; break;
   case          5: c = "MQPS_STATUS_ERROR"; break;
   case          6: c = "MQPS_STATUS_REFUSED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQPUBO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQPUBO_NONE"; break;
   case          1: c = "MQPUBO_CORREL_ID_AS_IDENTITY"; break;
   case          2: c = "MQPUBO_RETAIN_PUBLICATION"; break;
   case          4: c = "MQPUBO_OTHER_SUBSCRIBERS_ONLY"; break;
   case          8: c = "MQPUBO_NO_REGISTRATION"; break;
   case         16: c = "MQPUBO_IS_RETAINED_PUBLICATION"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQA_BACKOUT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQQA_BACKOUT_NOT_HARDENED"; break;
   case          1: c = "MQQA_BACKOUT_HARDENED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQA_GET_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQQA_GET_ALLOWED"; break;
   case          1: c = "MQQA_GET_INHIBITED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQA_PUT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQQA_PUT_ALLOWED"; break;
   case          1: c = "MQQA_PUT_INHIBITED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQDT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQQDT_PREDEFINED"; break;
   case          2: c = "MQQDT_PERMANENT_DYNAMIC"; break;
   case          3: c = "MQQDT_TEMPORARY_DYNAMIC"; break;
   case          4: c = "MQQDT_SHARED_DYNAMIC"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQFS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQQFS_DEFAULT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQQF_LOCAL_Q"; break;
   case         64: c = "MQQF_CLWL_USEQ_ANY"; break;
   case        128: c = "MQQF_CLWL_USEQ_LOCAL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQMDT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQQMDT_EXPLICIT_CLUSTER_SENDER"; break;
   case          2: c = "MQQMDT_AUTO_CLUSTER_SENDER"; break;
   case          3: c = "MQQMDT_CLUSTER_RECEIVER"; break;
   case          4: c = "MQQMDT_AUTO_EXP_CLUSTER_SENDER"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQMFAC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQQMFAC_IMS_BRIDGE"; break;
   case          2: c = "MQQMFAC_DB2"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQMF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          2: c = "MQQMF_REPOSITORY_Q_MGR"; break;
   case          8: c = "MQQMF_CLUSSDR_USER_DEFINED"; break;
   case         16: c = "MQQMF_CLUSSDR_AUTO_DEFINED"; break;
   case         32: c = "MQQMF_AVAILABLE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQMOPT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQQMOPT_DISABLED"; break;
   case          1: c = "MQQMOPT_ENABLED"; break;
   case          2: c = "MQQMOPT_REPLY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQMSTA_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQQMSTA_STARTING"; break;
   case          2: c = "MQQMSTA_RUNNING"; break;
   case          3: c = "MQQMSTA_QUIESCING"; break;
   case          4: c = "MQQMSTA_STANDBY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQMT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQQMT_NORMAL"; break;
   case          1: c = "MQQMT_REPOSITORY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQQO_NO"; break;
   case          1: c = "MQQO_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQSGD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQQSGD_ALL"; break;
   case          0: c = "MQQSGD_Q_MGR"; break;
   case          1: c = "MQQSGD_COPY"; break;
   case          2: c = "MQQSGD_SHARED"; break;
   case          3: c = "MQQSGD_GROUP"; break;
   case          4: c = "MQQSGD_PRIVATE"; break;
   case          6: c = "MQQSGD_LIVE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQSGS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQQSGS_UNKNOWN"; break;
   case          1: c = "MQQSGS_CREATED"; break;
   case          2: c = "MQQSGS_ACTIVE"; break;
   case          3: c = "MQQSGS_INACTIVE"; break;
   case          4: c = "MQQSGS_FAILED"; break;
   case          5: c = "MQQSGS_PENDING"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQSIE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQQSIE_NONE"; break;
   case          1: c = "MQQSIE_HIGH"; break;
   case          2: c = "MQQSIE_OK"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQSOT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQQSOT_ALL"; break;
   case          2: c = "MQQSOT_INPUT"; break;
   case          3: c = "MQQSOT_OUTPUT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQSO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQQSO_NO"; break;
   case          1: c = "MQQSO_YES"; break;
   case          2: c = "MQQSO_EXCLUSIVE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQSUM_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQQSUM_NO"; break;
   case          1: c = "MQQSUM_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQQT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQQT_LOCAL"; break;
   case          2: c = "MQQT_MODEL"; break;
   case          3: c = "MQQT_ALIAS"; break;
   case          6: c = "MQQT_REMOTE"; break;
   case          7: c = "MQQT_CLUSTER"; break;
   case       1001: c = "MQQT_ALL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRAR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQRAR_NO"; break;
   case          1: c = "MQRAR_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRCCF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case       3001: c = "MQRCCF_CFH_TYPE_ERROR"; break;
   case       3002: c = "MQRCCF_CFH_LENGTH_ERROR"; break;
   case       3003: c = "MQRCCF_CFH_VERSION_ERROR"; break;
   case       3004: c = "MQRCCF_CFH_MSG_SEQ_NUMBER_ERR"; break;
   case       3005: c = "MQRCCF_CFH_CONTROL_ERROR"; break;
   case       3006: c = "MQRCCF_CFH_PARM_COUNT_ERROR"; break;
   case       3007: c = "MQRCCF_CFH_COMMAND_ERROR"; break;
   case       3008: c = "MQRCCF_COMMAND_FAILED"; break;
   case       3009: c = "MQRCCF_CFIN_LENGTH_ERROR"; break;
   case       3010: c = "MQRCCF_CFST_LENGTH_ERROR"; break;
   case       3011: c = "MQRCCF_CFST_STRING_LENGTH_ERR"; break;
   case       3012: c = "MQRCCF_FORCE_VALUE_ERROR"; break;
   case       3013: c = "MQRCCF_STRUCTURE_TYPE_ERROR"; break;
   case       3014: c = "MQRCCF_CFIN_PARM_ID_ERROR"; break;
   case       3015: c = "MQRCCF_CFST_PARM_ID_ERROR"; break;
   case       3016: c = "MQRCCF_MSG_LENGTH_ERROR"; break;
   case       3017: c = "MQRCCF_CFIN_DUPLICATE_PARM"; break;
   case       3018: c = "MQRCCF_CFST_DUPLICATE_PARM"; break;
   case       3019: c = "MQRCCF_PARM_COUNT_TOO_SMALL"; break;
   case       3020: c = "MQRCCF_PARM_COUNT_TOO_BIG"; break;
   case       3021: c = "MQRCCF_Q_ALREADY_IN_CELL"; break;
   case       3022: c = "MQRCCF_Q_TYPE_ERROR"; break;
   case       3023: c = "MQRCCF_MD_FORMAT_ERROR"; break;
   case       3024: c = "MQRCCF_CFSL_LENGTH_ERROR"; break;
   case       3025: c = "MQRCCF_REPLACE_VALUE_ERROR"; break;
   case       3026: c = "MQRCCF_CFIL_DUPLICATE_VALUE"; break;
   case       3027: c = "MQRCCF_CFIL_COUNT_ERROR"; break;
   case       3028: c = "MQRCCF_CFIL_LENGTH_ERROR"; break;
   case       3029: c = "MQRCCF_QUIESCE_VALUE_ERROR"; break;
   case       3030: c = "MQRCCF_MSG_SEQ_NUMBER_ERROR"; break;
   case       3031: c = "MQRCCF_PING_DATA_COUNT_ERROR"; break;
   case       3032: c = "MQRCCF_PING_DATA_COMPARE_ERROR"; break;
   case       3033: c = "MQRCCF_CFSL_PARM_ID_ERROR"; break;
   case       3034: c = "MQRCCF_CHANNEL_TYPE_ERROR"; break;
   case       3035: c = "MQRCCF_PARM_SEQUENCE_ERROR"; break;
   case       3036: c = "MQRCCF_XMIT_PROTOCOL_TYPE_ERR"; break;
   case       3037: c = "MQRCCF_BATCH_SIZE_ERROR"; break;
   case       3038: c = "MQRCCF_DISC_INT_ERROR"; break;
   case       3039: c = "MQRCCF_SHORT_RETRY_ERROR"; break;
   case       3040: c = "MQRCCF_SHORT_TIMER_ERROR"; break;
   case       3041: c = "MQRCCF_LONG_RETRY_ERROR"; break;
   case       3042: c = "MQRCCF_LONG_TIMER_ERROR"; break;
   case       3043: c = "MQRCCF_SEQ_NUMBER_WRAP_ERROR"; break;
   case       3044: c = "MQRCCF_MAX_MSG_LENGTH_ERROR"; break;
   case       3045: c = "MQRCCF_PUT_AUTH_ERROR"; break;
   case       3046: c = "MQRCCF_PURGE_VALUE_ERROR"; break;
   case       3047: c = "MQRCCF_CFIL_PARM_ID_ERROR"; break;
   case       3048: c = "MQRCCF_MSG_TRUNCATED"; break;
   case       3049: c = "MQRCCF_CCSID_ERROR"; break;
   case       3050: c = "MQRCCF_ENCODING_ERROR"; break;
   case       3051: c = "MQRCCF_QUEUES_VALUE_ERROR"; break;
   case       3052: c = "MQRCCF_DATA_CONV_VALUE_ERROR"; break;
   case       3053: c = "MQRCCF_INDOUBT_VALUE_ERROR"; break;
   case       3054: c = "MQRCCF_ESCAPE_TYPE_ERROR"; break;
   case       3055: c = "MQRCCF_REPOS_VALUE_ERROR"; break;
   case       3062: c = "MQRCCF_CHANNEL_TABLE_ERROR"; break;
   case       3063: c = "MQRCCF_MCA_TYPE_ERROR"; break;
   case       3064: c = "MQRCCF_CHL_INST_TYPE_ERROR"; break;
   case       3065: c = "MQRCCF_CHL_STATUS_NOT_FOUND"; break;
   case       3066: c = "MQRCCF_CFSL_DUPLICATE_PARM"; break;
   case       3067: c = "MQRCCF_CFSL_TOTAL_LENGTH_ERROR"; break;
   case       3068: c = "MQRCCF_CFSL_COUNT_ERROR"; break;
   case       3069: c = "MQRCCF_CFSL_STRING_LENGTH_ERR"; break;
   case       3070: c = "MQRCCF_BROKER_DELETED"; break;
   case       3071: c = "MQRCCF_STREAM_ERROR"; break;
   case       3072: c = "MQRCCF_TOPIC_ERROR"; break;
   case       3073: c = "MQRCCF_NOT_REGISTERED"; break;
   case       3074: c = "MQRCCF_Q_MGR_NAME_ERROR"; break;
   case       3075: c = "MQRCCF_INCORRECT_STREAM"; break;
   case       3076: c = "MQRCCF_Q_NAME_ERROR"; break;
   case       3077: c = "MQRCCF_NO_RETAINED_MSG"; break;
   case       3078: c = "MQRCCF_DUPLICATE_IDENTITY"; break;
   case       3079: c = "MQRCCF_INCORRECT_Q"; break;
   case       3080: c = "MQRCCF_CORREL_ID_ERROR"; break;
   case       3081: c = "MQRCCF_NOT_AUTHORIZED"; break;
   case       3082: c = "MQRCCF_UNKNOWN_STREAM"; break;
   case       3083: c = "MQRCCF_REG_OPTIONS_ERROR"; break;
   case       3084: c = "MQRCCF_PUB_OPTIONS_ERROR"; break;
   case       3085: c = "MQRCCF_UNKNOWN_BROKER"; break;
   case       3086: c = "MQRCCF_Q_MGR_CCSID_ERROR"; break;
   case       3087: c = "MQRCCF_DEL_OPTIONS_ERROR"; break;
   case       3088: c = "MQRCCF_CLUSTER_NAME_CONFLICT"; break;
   case       3089: c = "MQRCCF_REPOS_NAME_CONFLICT"; break;
   case       3090: c = "MQRCCF_CLUSTER_Q_USAGE_ERROR"; break;
   case       3091: c = "MQRCCF_ACTION_VALUE_ERROR"; break;
   case       3092: c = "MQRCCF_COMMS_LIBRARY_ERROR"; break;
   case       3093: c = "MQRCCF_NETBIOS_NAME_ERROR"; break;
   case       3094: c = "MQRCCF_BROKER_COMMAND_FAILED"; break;
   case       3095: c = "MQRCCF_CFST_CONFLICTING_PARM"; break;
   case       3096: c = "MQRCCF_PATH_NOT_VALID"; break;
   case       3097: c = "MQRCCF_PARM_SYNTAX_ERROR"; break;
   case       3098: c = "MQRCCF_PWD_LENGTH_ERROR"; break;
   case       3150: c = "MQRCCF_FILTER_ERROR"; break;
   case       3151: c = "MQRCCF_WRONG_USER"; break;
   case       3152: c = "MQRCCF_DUPLICATE_SUBSCRIPTION"; break;
   case       3153: c = "MQRCCF_SUB_NAME_ERROR"; break;
   case       3154: c = "MQRCCF_SUB_IDENTITY_ERROR"; break;
   case       3155: c = "MQRCCF_SUBSCRIPTION_IN_USE"; break;
   case       3156: c = "MQRCCF_SUBSCRIPTION_LOCKED"; break;
   case       3157: c = "MQRCCF_ALREADY_JOINED"; break;
   case       3160: c = "MQRCCF_OBJECT_IN_USE"; break;
   case       3161: c = "MQRCCF_UNKNOWN_FILE_NAME"; break;
   case       3162: c = "MQRCCF_FILE_NOT_AVAILABLE"; break;
   case       3163: c = "MQRCCF_DISC_RETRY_ERROR"; break;
   case       3164: c = "MQRCCF_ALLOC_RETRY_ERROR"; break;
   case       3165: c = "MQRCCF_ALLOC_SLOW_TIMER_ERROR"; break;
   case       3166: c = "MQRCCF_ALLOC_FAST_TIMER_ERROR"; break;
   case       3167: c = "MQRCCF_PORT_NUMBER_ERROR"; break;
   case       3168: c = "MQRCCF_CHL_SYSTEM_NOT_ACTIVE"; break;
   case       3169: c = "MQRCCF_ENTITY_NAME_MISSING"; break;
   case       3170: c = "MQRCCF_PROFILE_NAME_ERROR"; break;
   case       3171: c = "MQRCCF_AUTH_VALUE_ERROR"; break;
   case       3172: c = "MQRCCF_AUTH_VALUE_MISSING"; break;
   case       3173: c = "MQRCCF_OBJECT_TYPE_MISSING"; break;
   case       3174: c = "MQRCCF_CONNECTION_ID_ERROR"; break;
   case       3175: c = "MQRCCF_LOG_TYPE_ERROR"; break;
   case       3176: c = "MQRCCF_PROGRAM_NOT_AVAILABLE"; break;
   case       3177: c = "MQRCCF_PROGRAM_AUTH_FAILED"; break;
   case       3200: c = "MQRCCF_NONE_FOUND"; break;
   case       3201: c = "MQRCCF_SECURITY_SWITCH_OFF"; break;
   case       3202: c = "MQRCCF_SECURITY_REFRESH_FAILED"; break;
   case       3203: c = "MQRCCF_PARM_CONFLICT"; break;
   case       3204: c = "MQRCCF_COMMAND_INHIBITED"; break;
   case       3205: c = "MQRCCF_OBJECT_BEING_DELETED"; break;
   case       3207: c = "MQRCCF_STORAGE_CLASS_IN_USE"; break;
   case       3208: c = "MQRCCF_OBJECT_NAME_RESTRICTED"; break;
   case       3209: c = "MQRCCF_OBJECT_LIMIT_EXCEEDED"; break;
   case       3210: c = "MQRCCF_OBJECT_OPEN_FORCE"; break;
   case       3211: c = "MQRCCF_DISPOSITION_CONFLICT"; break;
   case       3212: c = "MQRCCF_Q_MGR_NOT_IN_QSG"; break;
   case       3213: c = "MQRCCF_ATTR_VALUE_FIXED"; break;
   case       3215: c = "MQRCCF_NAMELIST_ERROR"; break;
   case       3217: c = "MQRCCF_NO_CHANNEL_INITIATOR"; break;
   case       3218: c = "MQRCCF_CHANNEL_INITIATOR_ERROR"; break;
   case       3222: c = "MQRCCF_COMMAND_LEVEL_CONFLICT"; break;
   case       3223: c = "MQRCCF_Q_ATTR_CONFLICT"; break;
   case       3224: c = "MQRCCF_EVENTS_DISABLED"; break;
   case       3225: c = "MQRCCF_COMMAND_SCOPE_ERROR"; break;
   case       3226: c = "MQRCCF_COMMAND_REPLY_ERROR"; break;
   case       3227: c = "MQRCCF_FUNCTION_RESTRICTED"; break;
   case       3228: c = "MQRCCF_PARM_MISSING"; break;
   case       3229: c = "MQRCCF_PARM_VALUE_ERROR"; break;
   case       3230: c = "MQRCCF_COMMAND_LENGTH_ERROR"; break;
   case       3231: c = "MQRCCF_COMMAND_ORIGIN_ERROR"; break;
   case       3232: c = "MQRCCF_LISTENER_CONFLICT"; break;
   case       3233: c = "MQRCCF_LISTENER_STARTED"; break;
   case       3234: c = "MQRCCF_LISTENER_STOPPED"; break;
   case       3235: c = "MQRCCF_CHANNEL_ERROR"; break;
   case       3236: c = "MQRCCF_CF_STRUC_ERROR"; break;
   case       3237: c = "MQRCCF_UNKNOWN_USER_ID"; break;
   case       3238: c = "MQRCCF_UNEXPECTED_ERROR"; break;
   case       3239: c = "MQRCCF_NO_XCF_PARTNER"; break;
   case       3240: c = "MQRCCF_CFGR_PARM_ID_ERROR"; break;
   case       3241: c = "MQRCCF_CFIF_LENGTH_ERROR"; break;
   case       3242: c = "MQRCCF_CFIF_OPERATOR_ERROR"; break;
   case       3243: c = "MQRCCF_CFIF_PARM_ID_ERROR"; break;
   case       3244: c = "MQRCCF_CFSF_FILTER_VAL_LEN_ERR"; break;
   case       3245: c = "MQRCCF_CFSF_LENGTH_ERROR"; break;
   case       3246: c = "MQRCCF_CFSF_OPERATOR_ERROR"; break;
   case       3247: c = "MQRCCF_CFSF_PARM_ID_ERROR"; break;
   case       3248: c = "MQRCCF_TOO_MANY_FILTERS"; break;
   case       3249: c = "MQRCCF_LISTENER_RUNNING"; break;
   case       3250: c = "MQRCCF_LSTR_STATUS_NOT_FOUND"; break;
   case       3251: c = "MQRCCF_SERVICE_RUNNING"; break;
   case       3252: c = "MQRCCF_SERV_STATUS_NOT_FOUND"; break;
   case       3253: c = "MQRCCF_SERVICE_STOPPED"; break;
   case       3254: c = "MQRCCF_CFBS_DUPLICATE_PARM"; break;
   case       3255: c = "MQRCCF_CFBS_LENGTH_ERROR"; break;
   case       3256: c = "MQRCCF_CFBS_PARM_ID_ERROR"; break;
   case       3257: c = "MQRCCF_CFBS_STRING_LENGTH_ERR"; break;
   case       3258: c = "MQRCCF_CFGR_LENGTH_ERROR"; break;
   case       3259: c = "MQRCCF_CFGR_PARM_COUNT_ERROR"; break;
   case       3260: c = "MQRCCF_CONN_NOT_STOPPED"; break;
   case       3261: c = "MQRCCF_SERVICE_REQUEST_PENDING"; break;
   case       3262: c = "MQRCCF_NO_START_CMD"; break;
   case       3263: c = "MQRCCF_NO_STOP_CMD"; break;
   case       3264: c = "MQRCCF_CFBF_LENGTH_ERROR"; break;
   case       3265: c = "MQRCCF_CFBF_PARM_ID_ERROR"; break;
   case       3266: c = "MQRCCF_CFBF_OPERATOR_ERROR"; break;
   case       3267: c = "MQRCCF_CFBF_FILTER_VAL_LEN_ERR"; break;
   case       3268: c = "MQRCCF_LISTENER_STILL_ACTIVE"; break;
   case       3269: c = "MQRCCF_DEF_XMIT_Q_CLUS_ERROR"; break;
   case       3300: c = "MQRCCF_TOPICSTR_ALREADY_EXISTS"; break;
   case       3301: c = "MQRCCF_SHARING_CONVS_ERROR"; break;
   case       3302: c = "MQRCCF_SHARING_CONVS_TYPE"; break;
   case       3303: c = "MQRCCF_SECURITY_CASE_CONFLICT"; break;
   case       3305: c = "MQRCCF_TOPIC_TYPE_ERROR"; break;
   case       3306: c = "MQRCCF_MAX_INSTANCES_ERROR"; break;
   case       3307: c = "MQRCCF_MAX_INSTS_PER_CLNT_ERR"; break;
   case       3308: c = "MQRCCF_TOPIC_STRING_NOT_FOUND"; break;
   case       3309: c = "MQRCCF_SUBSCRIPTION_POINT_ERR"; break;
   case       3311: c = "MQRCCF_SUB_ALREADY_EXISTS"; break;
   case       3312: c = "MQRCCF_UNKNOWN_OBJECT_NAME"; break;
   case       3313: c = "MQRCCF_REMOTE_Q_NAME_ERROR"; break;
   case       3314: c = "MQRCCF_DURABILITY_NOT_ALLOWED"; break;
   case       3315: c = "MQRCCF_HOBJ_ERROR"; break;
   case       3316: c = "MQRCCF_DEST_NAME_ERROR"; break;
   case       3317: c = "MQRCCF_INVALID_DESTINATION"; break;
   case       3318: c = "MQRCCF_PUBSUB_INHIBITED"; break;
   case       3319: c = "MQRCCF_GROUPUR_CHECKS_FAILED"; break;
   case       3320: c = "MQRCCF_COMM_INFO_TYPE_ERROR"; break;
   case       3321: c = "MQRCCF_USE_CLIENT_ID_ERROR"; break;
   case       3322: c = "MQRCCF_CLIENT_ID_NOT_FOUND"; break;
   case       3323: c = "MQRCCF_CLIENT_ID_ERROR"; break;
   case       3324: c = "MQRCCF_PORT_IN_USE"; break;
   case       3325: c = "MQRCCF_SSL_ALT_PROVIDER_REQD"; break;
   case       3326: c = "MQRCCF_CHLAUTH_TYPE_ERROR"; break;
   case       3327: c = "MQRCCF_CHLAUTH_ACTION_ERROR"; break;
   case       3328: c = "MQRCCF_POLICY_NOT_FOUND"; break;
   case       3329: c = "MQRCCF_ENCRYPTION_ALG_ERROR"; break;
   case       3330: c = "MQRCCF_SIGNATURE_ALG_ERROR"; break;
   case       3331: c = "MQRCCF_TOLERATION_POL_ERROR"; break;
   case       3332: c = "MQRCCF_POLICY_VERSION_ERROR"; break;
   case       3333: c = "MQRCCF_RECIPIENT_DN_MISSING"; break;
   case       3334: c = "MQRCCF_POLICY_NAME_MISSING"; break;
   case       3335: c = "MQRCCF_CHLAUTH_USERSRC_ERROR"; break;
   case       3336: c = "MQRCCF_WRONG_CHLAUTH_TYPE"; break;
   case       3337: c = "MQRCCF_CHLAUTH_ALREADY_EXISTS"; break;
   case       3338: c = "MQRCCF_CHLAUTH_NOT_FOUND"; break;
   case       3339: c = "MQRCCF_WRONG_CHLAUTH_ACTION"; break;
   case       3340: c = "MQRCCF_WRONG_CHLAUTH_USERSRC"; break;
   case       3341: c = "MQRCCF_CHLAUTH_WARN_ERROR"; break;
   case       3342: c = "MQRCCF_WRONG_CHLAUTH_MATCH"; break;
   case       3343: c = "MQRCCF_IPADDR_RANGE_CONFLICT"; break;
   case       3344: c = "MQRCCF_CHLAUTH_MAX_EXCEEDED"; break;
   case       3345: c = "MQRCCF_ADDRESS_ERROR"; break;
   case       3346: c = "MQRCCF_IPADDR_RANGE_ERROR"; break;
   case       3347: c = "MQRCCF_PROFILE_NAME_MISSING"; break;
   case       3348: c = "MQRCCF_CHLAUTH_CLNTUSER_ERROR"; break;
   case       3349: c = "MQRCCF_CHLAUTH_NAME_ERROR"; break;
   case       3350: c = "MQRCCF_CHLAUTH_RUNCHECK_ERROR"; break;
   case       3351: c = "MQRCCF_CF_STRUC_ALREADY_FAILED"; break;
   case       3352: c = "MQRCCF_CFCONLOS_CHECKS_FAILED"; break;
   case       3353: c = "MQRCCF_SUITE_B_ERROR"; break;
   case       3354: c = "MQRCCF_CHANNEL_NOT_STARTED"; break;
   case       3355: c = "MQRCCF_CUSTOM_ERROR"; break;
   case       3356: c = "MQRCCF_BACKLOG_OUT_OF_RANGE"; break;
   case       3357: c = "MQRCCF_CHLAUTH_DISABLED"; break;
   case       3358: c = "MQRCCF_SMDS_REQUIRES_DSGROUP"; break;
   case       3359: c = "MQRCCF_PSCLUS_DISABLED_TOPDEF"; break;
   case       3360: c = "MQRCCF_PSCLUS_TOPIC_EXISTS"; break;
   case       3361: c = "MQRCCF_SSL_CIPHER_SUITE_ERROR"; break;
   case       3362: c = "MQRCCF_SOCKET_ERROR"; break;
   case       3363: c = "MQRCCF_CLUS_XMIT_Q_USAGE_ERROR"; break;
   case       3364: c = "MQRCCF_CERT_VAL_POLICY_ERROR"; break;
   case       3365: c = "MQRCCF_INVALID_PROTOCOL"; break;
   case       3366: c = "MQRCCF_REVDNS_DISABLED"; break;
   case       3367: c = "MQRCCF_CLROUTE_NOT_ALTERABLE"; break;
   case       3368: c = "MQRCCF_CLUSTER_TOPIC_CONFLICT"; break;
   case       3369: c = "MQRCCF_DEFCLXQ_MODEL_Q_ERROR"; break;
   case       3370: c = "MQRCCF_CHLAUTH_CHKCLI_ERROR"; break;
   case       3371: c = "MQRCCF_CERT_LABEL_NOT_ALLOWED"; break;
   case       3372: c = "MQRCCF_Q_MGR_ATTR_CONFLICT"; break;
   case       3373: c = "MQRCCF_ENTITY_TYPE_MISSING"; break;
   case       3374: c = "MQRCCF_CLWL_EXIT_NAME_ERROR"; break;
   case       3375: c = "MQRCCF_SERVICE_NAME_ERROR"; break;
   case       3376: c = "MQRCCF_REMOTE_CHL_TYPE_ERROR"; break;
   case       3377: c = "MQRCCF_TOPIC_RESTRICTED"; break;
   case       3378: c = "MQRCCF_CURRENT_LOG_EXTENT"; break;
   case       3379: c = "MQRCCF_LOG_EXTENT_NOT_FOUND"; break;
   case       3380: c = "MQRCCF_LOG_NOT_REDUCED"; break;
   case       3381: c = "MQRCCF_LOG_EXTENT_ERROR"; break;
   case       3382: c = "MQRCCF_ACCESS_BLOCKED"; break;
   case       3383: c = "MQRCCF_PS_REQUIRED_MQUC"; break;
   case       4001: c = "MQRCCF_OBJECT_ALREADY_EXISTS"; break;
   case       4002: c = "MQRCCF_OBJECT_WRONG_TYPE"; break;
   case       4003: c = "MQRCCF_LIKE_OBJECT_WRONG_TYPE"; break;
   case       4004: c = "MQRCCF_OBJECT_OPEN"; break;
   case       4005: c = "MQRCCF_ATTR_VALUE_ERROR"; break;
   case       4006: c = "MQRCCF_UNKNOWN_Q_MGR"; break;
   case       4007: c = "MQRCCF_Q_WRONG_TYPE"; break;
   case       4008: c = "MQRCCF_OBJECT_NAME_ERROR"; break;
   case       4009: c = "MQRCCF_ALLOCATE_FAILED"; break;
   case       4010: c = "MQRCCF_HOST_NOT_AVAILABLE"; break;
   case       4011: c = "MQRCCF_CONFIGURATION_ERROR"; break;
   case       4012: c = "MQRCCF_CONNECTION_REFUSED"; break;
   case       4013: c = "MQRCCF_ENTRY_ERROR"; break;
   case       4014: c = "MQRCCF_SEND_FAILED"; break;
   case       4015: c = "MQRCCF_RECEIVED_DATA_ERROR"; break;
   case       4016: c = "MQRCCF_RECEIVE_FAILED"; break;
   case       4017: c = "MQRCCF_CONNECTION_CLOSED"; break;
   case       4018: c = "MQRCCF_NO_STORAGE"; break;
   case       4019: c = "MQRCCF_NO_COMMS_MANAGER"; break;
   case       4020: c = "MQRCCF_LISTENER_NOT_STARTED"; break;
   case       4024: c = "MQRCCF_BIND_FAILED"; break;
   case       4025: c = "MQRCCF_CHANNEL_INDOUBT"; break;
   case       4026: c = "MQRCCF_MQCONN_FAILED"; break;
   case       4027: c = "MQRCCF_MQOPEN_FAILED"; break;
   case       4028: c = "MQRCCF_MQGET_FAILED"; break;
   case       4029: c = "MQRCCF_MQPUT_FAILED"; break;
   case       4030: c = "MQRCCF_PING_ERROR"; break;
   case       4031: c = "MQRCCF_CHANNEL_IN_USE"; break;
   case       4032: c = "MQRCCF_CHANNEL_NOT_FOUND"; break;
   case       4033: c = "MQRCCF_UNKNOWN_REMOTE_CHANNEL"; break;
   case       4034: c = "MQRCCF_REMOTE_QM_UNAVAILABLE"; break;
   case       4035: c = "MQRCCF_REMOTE_QM_TERMINATING"; break;
   case       4036: c = "MQRCCF_MQINQ_FAILED"; break;
   case       4037: c = "MQRCCF_NOT_XMIT_Q"; break;
   case       4038: c = "MQRCCF_CHANNEL_DISABLED"; break;
   case       4039: c = "MQRCCF_USER_EXIT_NOT_AVAILABLE"; break;
   case       4040: c = "MQRCCF_COMMIT_FAILED"; break;
   case       4041: c = "MQRCCF_WRONG_CHANNEL_TYPE"; break;
   case       4042: c = "MQRCCF_CHANNEL_ALREADY_EXISTS"; break;
   case       4043: c = "MQRCCF_DATA_TOO_LARGE"; break;
   case       4044: c = "MQRCCF_CHANNEL_NAME_ERROR"; break;
   case       4045: c = "MQRCCF_XMIT_Q_NAME_ERROR"; break;
   case       4047: c = "MQRCCF_MCA_NAME_ERROR"; break;
   case       4048: c = "MQRCCF_SEND_EXIT_NAME_ERROR"; break;
   case       4049: c = "MQRCCF_SEC_EXIT_NAME_ERROR"; break;
   case       4050: c = "MQRCCF_MSG_EXIT_NAME_ERROR"; break;
   case       4051: c = "MQRCCF_RCV_EXIT_NAME_ERROR"; break;
   case       4052: c = "MQRCCF_XMIT_Q_NAME_WRONG_TYPE"; break;
   case       4053: c = "MQRCCF_MCA_NAME_WRONG_TYPE"; break;
   case       4054: c = "MQRCCF_DISC_INT_WRONG_TYPE"; break;
   case       4055: c = "MQRCCF_SHORT_RETRY_WRONG_TYPE"; break;
   case       4056: c = "MQRCCF_SHORT_TIMER_WRONG_TYPE"; break;
   case       4057: c = "MQRCCF_LONG_RETRY_WRONG_TYPE"; break;
   case       4058: c = "MQRCCF_LONG_TIMER_WRONG_TYPE"; break;
   case       4059: c = "MQRCCF_PUT_AUTH_WRONG_TYPE"; break;
   case       4060: c = "MQRCCF_KEEP_ALIVE_INT_ERROR"; break;
   case       4061: c = "MQRCCF_MISSING_CONN_NAME"; break;
   case       4062: c = "MQRCCF_CONN_NAME_ERROR"; break;
   case       4063: c = "MQRCCF_MQSET_FAILED"; break;
   case       4064: c = "MQRCCF_CHANNEL_NOT_ACTIVE"; break;
   case       4065: c = "MQRCCF_TERMINATED_BY_SEC_EXIT"; break;
   case       4067: c = "MQRCCF_DYNAMIC_Q_SCOPE_ERROR"; break;
   case       4068: c = "MQRCCF_CELL_DIR_NOT_AVAILABLE"; break;
   case       4069: c = "MQRCCF_MR_COUNT_ERROR"; break;
   case       4070: c = "MQRCCF_MR_COUNT_WRONG_TYPE"; break;
   case       4071: c = "MQRCCF_MR_EXIT_NAME_ERROR"; break;
   case       4072: c = "MQRCCF_MR_EXIT_NAME_WRONG_TYPE"; break;
   case       4073: c = "MQRCCF_MR_INTERVAL_ERROR"; break;
   case       4074: c = "MQRCCF_MR_INTERVAL_WRONG_TYPE"; break;
   case       4075: c = "MQRCCF_NPM_SPEED_ERROR"; break;
   case       4076: c = "MQRCCF_NPM_SPEED_WRONG_TYPE"; break;
   case       4077: c = "MQRCCF_HB_INTERVAL_ERROR"; break;
   case       4078: c = "MQRCCF_HB_INTERVAL_WRONG_TYPE"; break;
   case       4079: c = "MQRCCF_CHAD_ERROR"; break;
   case       4080: c = "MQRCCF_CHAD_WRONG_TYPE"; break;
   case       4081: c = "MQRCCF_CHAD_EVENT_ERROR"; break;
   case       4082: c = "MQRCCF_CHAD_EVENT_WRONG_TYPE"; break;
   case       4083: c = "MQRCCF_CHAD_EXIT_ERROR"; break;
   case       4084: c = "MQRCCF_CHAD_EXIT_WRONG_TYPE"; break;
   case       4085: c = "MQRCCF_SUPPRESSED_BY_EXIT"; break;
   case       4086: c = "MQRCCF_BATCH_INT_ERROR"; break;
   case       4087: c = "MQRCCF_BATCH_INT_WRONG_TYPE"; break;
   case       4088: c = "MQRCCF_NET_PRIORITY_ERROR"; break;
   case       4089: c = "MQRCCF_NET_PRIORITY_WRONG_TYPE"; break;
   case       4090: c = "MQRCCF_CHANNEL_CLOSED"; break;
   case       4091: c = "MQRCCF_Q_STATUS_NOT_FOUND"; break;
   case       4092: c = "MQRCCF_SSL_CIPHER_SPEC_ERROR"; break;
   case       4093: c = "MQRCCF_SSL_PEER_NAME_ERROR"; break;
   case       4094: c = "MQRCCF_SSL_CLIENT_AUTH_ERROR"; break;
   case       4095: c = "MQRCCF_RETAINED_NOT_SUPPORTED"; break;
   case       4096: c = "MQRCCF_KWD_VALUE_WRONG_TYPE"; break;
   case       4097: c = "MQRCCF_APPL_STATUS_NOT_FOUND"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRCN_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQRCN_NO"; break;
   case          1: c = "MQRCN_YES"; break;
   case          2: c = "MQRCN_Q_MGR"; break;
   case          3: c = "MQRCN_DISABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRCVTIME_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQRCVTIME_MULTIPLY"; break;
   case          1: c = "MQRCVTIME_ADD"; break;
   case          2: c = "MQRCVTIME_EQUAL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQRC_NONE"; break;
   case       2001: c = "MQRC_ALIAS_BASE_Q_TYPE_ERROR"; break;
   case       2002: c = "MQRC_ALREADY_CONNECTED"; break;
   case       2003: c = "MQRC_BACKED_OUT"; break;
   case       2004: c = "MQRC_BUFFER_ERROR"; break;
   case       2005: c = "MQRC_BUFFER_LENGTH_ERROR"; break;
   case       2006: c = "MQRC_CHAR_ATTR_LENGTH_ERROR"; break;
   case       2007: c = "MQRC_CHAR_ATTRS_ERROR"; break;
   case       2008: c = "MQRC_CHAR_ATTRS_TOO_SHORT"; break;
   case       2009: c = "MQRC_CONNECTION_BROKEN"; break;
   case       2010: c = "MQRC_DATA_LENGTH_ERROR"; break;
   case       2011: c = "MQRC_DYNAMIC_Q_NAME_ERROR"; break;
   case       2012: c = "MQRC_ENVIRONMENT_ERROR"; break;
   case       2013: c = "MQRC_EXPIRY_ERROR"; break;
   case       2014: c = "MQRC_FEEDBACK_ERROR"; break;
   case       2016: c = "MQRC_GET_INHIBITED"; break;
   case       2017: c = "MQRC_HANDLE_NOT_AVAILABLE"; break;
   case       2018: c = "MQRC_HCONN_ERROR"; break;
   case       2019: c = "MQRC_HOBJ_ERROR"; break;
   case       2020: c = "MQRC_INHIBIT_VALUE_ERROR"; break;
   case       2021: c = "MQRC_INT_ATTR_COUNT_ERROR"; break;
   case       2022: c = "MQRC_INT_ATTR_COUNT_TOO_SMALL"; break;
   case       2023: c = "MQRC_INT_ATTRS_ARRAY_ERROR"; break;
   case       2024: c = "MQRC_SYNCPOINT_LIMIT_REACHED"; break;
   case       2025: c = "MQRC_MAX_CONNS_LIMIT_REACHED"; break;
   case       2026: c = "MQRC_MD_ERROR"; break;
   case       2027: c = "MQRC_MISSING_REPLY_TO_Q"; break;
   case       2029: c = "MQRC_MSG_TYPE_ERROR"; break;
   case       2030: c = "MQRC_MSG_TOO_BIG_FOR_Q"; break;
   case       2031: c = "MQRC_MSG_TOO_BIG_FOR_Q_MGR"; break;
   case       2033: c = "MQRC_NO_MSG_AVAILABLE"; break;
   case       2034: c = "MQRC_NO_MSG_UNDER_CURSOR"; break;
   case       2035: c = "MQRC_NOT_AUTHORIZED"; break;
   case       2036: c = "MQRC_NOT_OPEN_FOR_BROWSE"; break;
   case       2037: c = "MQRC_NOT_OPEN_FOR_INPUT"; break;
   case       2038: c = "MQRC_NOT_OPEN_FOR_INQUIRE"; break;
   case       2039: c = "MQRC_NOT_OPEN_FOR_OUTPUT"; break;
   case       2040: c = "MQRC_NOT_OPEN_FOR_SET"; break;
   case       2041: c = "MQRC_OBJECT_CHANGED"; break;
   case       2042: c = "MQRC_OBJECT_IN_USE"; break;
   case       2043: c = "MQRC_OBJECT_TYPE_ERROR"; break;
   case       2044: c = "MQRC_OD_ERROR"; break;
   case       2045: c = "MQRC_OPTION_NOT_VALID_FOR_TYPE"; break;
   case       2046: c = "MQRC_OPTIONS_ERROR"; break;
   case       2047: c = "MQRC_PERSISTENCE_ERROR"; break;
   case       2048: c = "MQRC_PERSISTENT_NOT_ALLOWED"; break;
   case       2049: c = "MQRC_PRIORITY_EXCEEDS_MAXIMUM"; break;
   case       2050: c = "MQRC_PRIORITY_ERROR"; break;
   case       2051: c = "MQRC_PUT_INHIBITED"; break;
   case       2052: c = "MQRC_Q_DELETED"; break;
   case       2053: c = "MQRC_Q_FULL"; break;
   case       2055: c = "MQRC_Q_NOT_EMPTY"; break;
   case       2056: c = "MQRC_Q_SPACE_NOT_AVAILABLE"; break;
   case       2057: c = "MQRC_Q_TYPE_ERROR"; break;
   case       2058: c = "MQRC_Q_MGR_NAME_ERROR"; break;
   case       2059: c = "MQRC_Q_MGR_NOT_AVAILABLE"; break;
   case       2061: c = "MQRC_REPORT_OPTIONS_ERROR"; break;
   case       2062: c = "MQRC_SECOND_MARK_NOT_ALLOWED"; break;
   case       2063: c = "MQRC_SECURITY_ERROR"; break;
   case       2065: c = "MQRC_SELECTOR_COUNT_ERROR"; break;
   case       2066: c = "MQRC_SELECTOR_LIMIT_EXCEEDED"; break;
   case       2067: c = "MQRC_SELECTOR_ERROR"; break;
   case       2068: c = "MQRC_SELECTOR_NOT_FOR_TYPE"; break;
   case       2069: c = "MQRC_SIGNAL_OUTSTANDING"; break;
   case       2070: c = "MQRC_SIGNAL_REQUEST_ACCEPTED"; break;
   case       2071: c = "MQRC_STORAGE_NOT_AVAILABLE"; break;
   case       2072: c = "MQRC_SYNCPOINT_NOT_AVAILABLE"; break;
   case       2075: c = "MQRC_TRIGGER_CONTROL_ERROR"; break;
   case       2076: c = "MQRC_TRIGGER_DEPTH_ERROR"; break;
   case       2077: c = "MQRC_TRIGGER_MSG_PRIORITY_ERR"; break;
   case       2078: c = "MQRC_TRIGGER_TYPE_ERROR"; break;
   case       2079: c = "MQRC_TRUNCATED_MSG_ACCEPTED"; break;
   case       2080: c = "MQRC_TRUNCATED_MSG_FAILED"; break;
   case       2082: c = "MQRC_UNKNOWN_ALIAS_BASE_Q"; break;
   case       2085: c = "MQRC_UNKNOWN_OBJECT_NAME"; break;
   case       2086: c = "MQRC_UNKNOWN_OBJECT_Q_MGR"; break;
   case       2087: c = "MQRC_UNKNOWN_REMOTE_Q_MGR"; break;
   case       2090: c = "MQRC_WAIT_INTERVAL_ERROR"; break;
   case       2091: c = "MQRC_XMIT_Q_TYPE_ERROR"; break;
   case       2092: c = "MQRC_XMIT_Q_USAGE_ERROR"; break;
   case       2093: c = "MQRC_NOT_OPEN_FOR_PASS_ALL"; break;
   case       2094: c = "MQRC_NOT_OPEN_FOR_PASS_IDENT"; break;
   case       2095: c = "MQRC_NOT_OPEN_FOR_SET_ALL"; break;
   case       2096: c = "MQRC_NOT_OPEN_FOR_SET_IDENT"; break;
   case       2097: c = "MQRC_CONTEXT_HANDLE_ERROR"; break;
   case       2098: c = "MQRC_CONTEXT_NOT_AVAILABLE"; break;
   case       2099: c = "MQRC_SIGNAL1_ERROR"; break;
   case       2100: c = "MQRC_OBJECT_ALREADY_EXISTS"; break;
   case       2101: c = "MQRC_OBJECT_DAMAGED"; break;
   case       2102: c = "MQRC_RESOURCE_PROBLEM"; break;
   case       2103: c = "MQRC_ANOTHER_Q_MGR_CONNECTED"; break;
   case       2104: c = "MQRC_UNKNOWN_REPORT_OPTION"; break;
   case       2105: c = "MQRC_STORAGE_CLASS_ERROR"; break;
   case       2106: c = "MQRC_COD_NOT_VALID_FOR_XCF_Q"; break;
   case       2107: c = "MQRC_XWAIT_CANCELED"; break;
   case       2108: c = "MQRC_XWAIT_ERROR"; break;
   case       2109: c = "MQRC_SUPPRESSED_BY_EXIT"; break;
   case       2110: c = "MQRC_FORMAT_ERROR"; break;
   case       2111: c = "MQRC_SOURCE_CCSID_ERROR"; break;
   case       2112: c = "MQRC_SOURCE_INTEGER_ENC_ERROR"; break;
   case       2113: c = "MQRC_SOURCE_DECIMAL_ENC_ERROR"; break;
   case       2114: c = "MQRC_SOURCE_FLOAT_ENC_ERROR"; break;
   case       2115: c = "MQRC_TARGET_CCSID_ERROR"; break;
   case       2116: c = "MQRC_TARGET_INTEGER_ENC_ERROR"; break;
   case       2117: c = "MQRC_TARGET_DECIMAL_ENC_ERROR"; break;
   case       2118: c = "MQRC_TARGET_FLOAT_ENC_ERROR"; break;
   case       2119: c = "MQRC_NOT_CONVERTED"; break;
   case       2121: c = "MQRC_NO_EXTERNAL_PARTICIPANTS"; break;
   case       2122: c = "MQRC_PARTICIPANT_NOT_AVAILABLE"; break;
   case       2123: c = "MQRC_OUTCOME_MIXED"; break;
   case       2124: c = "MQRC_OUTCOME_PENDING"; break;
   case       2125: c = "MQRC_BRIDGE_STARTED"; break;
   case       2126: c = "MQRC_BRIDGE_STOPPED"; break;
   case       2127: c = "MQRC_ADAPTER_STORAGE_SHORTAGE"; break;
   case       2128: c = "MQRC_UOW_IN_PROGRESS"; break;
   case       2129: c = "MQRC_ADAPTER_CONN_LOAD_ERROR"; break;
   case       2130: c = "MQRC_ADAPTER_SERV_LOAD_ERROR"; break;
   case       2131: c = "MQRC_ADAPTER_DEFS_ERROR"; break;
   case       2132: c = "MQRC_ADAPTER_DEFS_LOAD_ERROR"; break;
   case       2133: c = "MQRC_ADAPTER_CONV_LOAD_ERROR"; break;
   case       2134: c = "MQRC_BO_ERROR"; break;
   case       2135: c = "MQRC_DH_ERROR"; break;
   case       2136: c = "MQRC_MULTIPLE_REASONS"; break;
   case       2137: c = "MQRC_OPEN_FAILED"; break;
   case       2138: c = "MQRC_ADAPTER_DISC_LOAD_ERROR"; break;
   case       2139: c = "MQRC_CNO_ERROR"; break;
   case       2140: c = "MQRC_CICS_WAIT_FAILED"; break;
   case       2141: c = "MQRC_DLH_ERROR"; break;
   case       2142: c = "MQRC_HEADER_ERROR"; break;
   case       2143: c = "MQRC_SOURCE_LENGTH_ERROR"; break;
   case       2144: c = "MQRC_TARGET_LENGTH_ERROR"; break;
   case       2145: c = "MQRC_SOURCE_BUFFER_ERROR"; break;
   case       2146: c = "MQRC_TARGET_BUFFER_ERROR"; break;
   case       2147: c = "MQRC_INCOMPLETE_TRANSACTION"; break;
   case       2148: c = "MQRC_IIH_ERROR"; break;
   case       2149: c = "MQRC_PCF_ERROR"; break;
   case       2150: c = "MQRC_DBCS_ERROR"; break;
   case       2152: c = "MQRC_OBJECT_NAME_ERROR"; break;
   case       2153: c = "MQRC_OBJECT_Q_MGR_NAME_ERROR"; break;
   case       2154: c = "MQRC_RECS_PRESENT_ERROR"; break;
   case       2155: c = "MQRC_OBJECT_RECORDS_ERROR"; break;
   case       2156: c = "MQRC_RESPONSE_RECORDS_ERROR"; break;
   case       2157: c = "MQRC_ASID_MISMATCH"; break;
   case       2158: c = "MQRC_PMO_RECORD_FLAGS_ERROR"; break;
   case       2159: c = "MQRC_PUT_MSG_RECORDS_ERROR"; break;
   case       2160: c = "MQRC_CONN_ID_IN_USE"; break;
   case       2161: c = "MQRC_Q_MGR_QUIESCING"; break;
   case       2162: c = "MQRC_Q_MGR_STOPPING"; break;
   case       2163: c = "MQRC_DUPLICATE_RECOV_COORD"; break;
   case       2173: c = "MQRC_PMO_ERROR"; break;
   case       2182: c = "MQRC_API_EXIT_NOT_FOUND"; break;
   case       2183: c = "MQRC_API_EXIT_LOAD_ERROR"; break;
   case       2184: c = "MQRC_REMOTE_Q_NAME_ERROR"; break;
   case       2185: c = "MQRC_INCONSISTENT_PERSISTENCE"; break;
   case       2186: c = "MQRC_GMO_ERROR"; break;
   case       2187: c = "MQRC_CICS_BRIDGE_RESTRICTION"; break;
   case       2188: c = "MQRC_STOPPED_BY_CLUSTER_EXIT"; break;
   case       2189: c = "MQRC_CLUSTER_RESOLUTION_ERROR"; break;
   case       2190: c = "MQRC_CONVERTED_STRING_TOO_BIG"; break;
   case       2191: c = "MQRC_TMC_ERROR"; break;
   case       2192: c = "MQRC_STORAGE_MEDIUM_FULL"; break;
   case       2193: c = "MQRC_PAGESET_ERROR"; break;
   case       2194: c = "MQRC_NAME_NOT_VALID_FOR_TYPE"; break;
   case       2195: c = "MQRC_UNEXPECTED_ERROR"; break;
   case       2196: c = "MQRC_UNKNOWN_XMIT_Q"; break;
   case       2197: c = "MQRC_UNKNOWN_DEF_XMIT_Q"; break;
   case       2198: c = "MQRC_DEF_XMIT_Q_TYPE_ERROR"; break;
   case       2199: c = "MQRC_DEF_XMIT_Q_USAGE_ERROR"; break;
   case       2200: c = "MQRC_MSG_MARKED_BROWSE_CO_OP"; break;
   case       2201: c = "MQRC_NAME_IN_USE"; break;
   case       2202: c = "MQRC_CONNECTION_QUIESCING"; break;
   case       2203: c = "MQRC_CONNECTION_STOPPING"; break;
   case       2204: c = "MQRC_ADAPTER_NOT_AVAILABLE"; break;
   case       2206: c = "MQRC_MSG_ID_ERROR"; break;
   case       2207: c = "MQRC_CORREL_ID_ERROR"; break;
   case       2208: c = "MQRC_FILE_SYSTEM_ERROR"; break;
   case       2209: c = "MQRC_NO_MSG_LOCKED"; break;
   case       2210: c = "MQRC_SOAP_DOTNET_ERROR"; break;
   case       2211: c = "MQRC_SOAP_AXIS_ERROR"; break;
   case       2212: c = "MQRC_SOAP_URL_ERROR"; break;
   case       2216: c = "MQRC_FILE_NOT_AUDITED"; break;
   case       2217: c = "MQRC_CONNECTION_NOT_AUTHORIZED"; break;
   case       2218: c = "MQRC_MSG_TOO_BIG_FOR_CHANNEL"; break;
   case       2219: c = "MQRC_CALL_IN_PROGRESS"; break;
   case       2220: c = "MQRC_RMH_ERROR"; break;
   case       2222: c = "MQRC_Q_MGR_ACTIVE"; break;
   case       2223: c = "MQRC_Q_MGR_NOT_ACTIVE"; break;
   case       2224: c = "MQRC_Q_DEPTH_HIGH"; break;
   case       2225: c = "MQRC_Q_DEPTH_LOW"; break;
   case       2226: c = "MQRC_Q_SERVICE_INTERVAL_HIGH"; break;
   case       2227: c = "MQRC_Q_SERVICE_INTERVAL_OK"; break;
   case       2228: c = "MQRC_RFH_HEADER_FIELD_ERROR"; break;
   case       2229: c = "MQRC_RAS_PROPERTY_ERROR"; break;
   case       2232: c = "MQRC_UNIT_OF_WORK_NOT_STARTED"; break;
   case       2233: c = "MQRC_CHANNEL_AUTO_DEF_OK"; break;
   case       2234: c = "MQRC_CHANNEL_AUTO_DEF_ERROR"; break;
   case       2235: c = "MQRC_CFH_ERROR"; break;
   case       2236: c = "MQRC_CFIL_ERROR"; break;
   case       2237: c = "MQRC_CFIN_ERROR"; break;
   case       2238: c = "MQRC_CFSL_ERROR"; break;
   case       2239: c = "MQRC_CFST_ERROR"; break;
   case       2241: c = "MQRC_INCOMPLETE_GROUP"; break;
   case       2242: c = "MQRC_INCOMPLETE_MSG"; break;
   case       2243: c = "MQRC_INCONSISTENT_CCSIDS"; break;
   case       2244: c = "MQRC_INCONSISTENT_ENCODINGS"; break;
   case       2245: c = "MQRC_INCONSISTENT_UOW"; break;
   case       2246: c = "MQRC_INVALID_MSG_UNDER_CURSOR"; break;
   case       2247: c = "MQRC_MATCH_OPTIONS_ERROR"; break;
   case       2248: c = "MQRC_MDE_ERROR"; break;
   case       2249: c = "MQRC_MSG_FLAGS_ERROR"; break;
   case       2250: c = "MQRC_MSG_SEQ_NUMBER_ERROR"; break;
   case       2251: c = "MQRC_OFFSET_ERROR"; break;
   case       2252: c = "MQRC_ORIGINAL_LENGTH_ERROR"; break;
   case       2253: c = "MQRC_SEGMENT_LENGTH_ZERO"; break;
   case       2255: c = "MQRC_UOW_NOT_AVAILABLE"; break;
   case       2256: c = "MQRC_WRONG_GMO_VERSION"; break;
   case       2257: c = "MQRC_WRONG_MD_VERSION"; break;
   case       2258: c = "MQRC_GROUP_ID_ERROR"; break;
   case       2259: c = "MQRC_INCONSISTENT_BROWSE"; break;
   case       2260: c = "MQRC_XQH_ERROR"; break;
   case       2261: c = "MQRC_SRC_ENV_ERROR"; break;
   case       2262: c = "MQRC_SRC_NAME_ERROR"; break;
   case       2263: c = "MQRC_DEST_ENV_ERROR"; break;
   case       2264: c = "MQRC_DEST_NAME_ERROR"; break;
   case       2265: c = "MQRC_TM_ERROR"; break;
   case       2266: c = "MQRC_CLUSTER_EXIT_ERROR"; break;
   case       2267: c = "MQRC_CLUSTER_EXIT_LOAD_ERROR"; break;
   case       2268: c = "MQRC_CLUSTER_PUT_INHIBITED"; break;
   case       2269: c = "MQRC_CLUSTER_RESOURCE_ERROR"; break;
   case       2270: c = "MQRC_NO_DESTINATIONS_AVAILABLE"; break;
   case       2271: c = "MQRC_CONN_TAG_IN_USE"; break;
   case       2272: c = "MQRC_PARTIALLY_CONVERTED"; break;
   case       2273: c = "MQRC_CONNECTION_ERROR"; break;
   case       2274: c = "MQRC_OPTION_ENVIRONMENT_ERROR"; break;
   case       2277: c = "MQRC_CD_ERROR"; break;
   case       2278: c = "MQRC_CLIENT_CONN_ERROR"; break;
   case       2279: c = "MQRC_CHANNEL_STOPPED_BY_USER"; break;
   case       2280: c = "MQRC_HCONFIG_ERROR"; break;
   case       2281: c = "MQRC_FUNCTION_ERROR"; break;
   case       2282: c = "MQRC_CHANNEL_STARTED"; break;
   case       2283: c = "MQRC_CHANNEL_STOPPED"; break;
   case       2284: c = "MQRC_CHANNEL_CONV_ERROR"; break;
   case       2285: c = "MQRC_SERVICE_NOT_AVAILABLE"; break;
   case       2286: c = "MQRC_INITIALIZATION_FAILED"; break;
   case       2287: c = "MQRC_TERMINATION_FAILED"; break;
   case       2288: c = "MQRC_UNKNOWN_Q_NAME"; break;
   case       2289: c = "MQRC_SERVICE_ERROR"; break;
   case       2290: c = "MQRC_Q_ALREADY_EXISTS"; break;
   case       2291: c = "MQRC_USER_ID_NOT_AVAILABLE"; break;
   case       2292: c = "MQRC_UNKNOWN_ENTITY"; break;
   case       2293: c = "MQRC_UNKNOWN_AUTH_ENTITY"; break;
   case       2294: c = "MQRC_UNKNOWN_REF_OBJECT"; break;
   case       2295: c = "MQRC_CHANNEL_ACTIVATED"; break;
   case       2296: c = "MQRC_CHANNEL_NOT_ACTIVATED"; break;
   case       2297: c = "MQRC_UOW_CANCELED"; break;
   case       2298: c = "MQRC_FUNCTION_NOT_SUPPORTED"; break;
   case       2299: c = "MQRC_SELECTOR_TYPE_ERROR"; break;
   case       2300: c = "MQRC_COMMAND_TYPE_ERROR"; break;
   case       2301: c = "MQRC_MULTIPLE_INSTANCE_ERROR"; break;
   case       2302: c = "MQRC_SYSTEM_ITEM_NOT_ALTERABLE"; break;
   case       2303: c = "MQRC_BAG_CONVERSION_ERROR"; break;
   case       2304: c = "MQRC_SELECTOR_OUT_OF_RANGE"; break;
   case       2305: c = "MQRC_SELECTOR_NOT_UNIQUE"; break;
   case       2306: c = "MQRC_INDEX_NOT_PRESENT"; break;
   case       2307: c = "MQRC_STRING_ERROR"; break;
   case       2308: c = "MQRC_ENCODING_NOT_SUPPORTED"; break;
   case       2309: c = "MQRC_SELECTOR_NOT_PRESENT"; break;
   case       2310: c = "MQRC_OUT_SELECTOR_ERROR"; break;
   case       2311: c = "MQRC_STRING_TRUNCATED"; break;
   case       2312: c = "MQRC_SELECTOR_WRONG_TYPE"; break;
   case       2313: c = "MQRC_INCONSISTENT_ITEM_TYPE"; break;
   case       2314: c = "MQRC_INDEX_ERROR"; break;
   case       2315: c = "MQRC_SYSTEM_BAG_NOT_ALTERABLE"; break;
   case       2316: c = "MQRC_ITEM_COUNT_ERROR"; break;
   case       2317: c = "MQRC_FORMAT_NOT_SUPPORTED"; break;
   case       2318: c = "MQRC_SELECTOR_NOT_SUPPORTED"; break;
   case       2319: c = "MQRC_ITEM_VALUE_ERROR"; break;
   case       2320: c = "MQRC_HBAG_ERROR"; break;
   case       2321: c = "MQRC_PARAMETER_MISSING"; break;
   case       2322: c = "MQRC_CMD_SERVER_NOT_AVAILABLE"; break;
   case       2323: c = "MQRC_STRING_LENGTH_ERROR"; break;
   case       2324: c = "MQRC_INQUIRY_COMMAND_ERROR"; break;
   case       2325: c = "MQRC_NESTED_BAG_NOT_SUPPORTED"; break;
   case       2326: c = "MQRC_BAG_WRONG_TYPE"; break;
   case       2327: c = "MQRC_ITEM_TYPE_ERROR"; break;
   case       2328: c = "MQRC_SYSTEM_BAG_NOT_DELETABLE"; break;
   case       2329: c = "MQRC_SYSTEM_ITEM_NOT_DELETABLE"; break;
   case       2330: c = "MQRC_CODED_CHAR_SET_ID_ERROR"; break;
   case       2331: c = "MQRC_MSG_TOKEN_ERROR"; break;
   case       2332: c = "MQRC_MISSING_WIH"; break;
   case       2333: c = "MQRC_WIH_ERROR"; break;
   case       2334: c = "MQRC_RFH_ERROR"; break;
   case       2335: c = "MQRC_RFH_STRING_ERROR"; break;
   case       2336: c = "MQRC_RFH_COMMAND_ERROR"; break;
   case       2337: c = "MQRC_RFH_PARM_ERROR"; break;
   case       2338: c = "MQRC_RFH_DUPLICATE_PARM"; break;
   case       2339: c = "MQRC_RFH_PARM_MISSING"; break;
   case       2340: c = "MQRC_CHAR_CONVERSION_ERROR"; break;
   case       2341: c = "MQRC_UCS2_CONVERSION_ERROR"; break;
   case       2342: c = "MQRC_DB2_NOT_AVAILABLE"; break;
   case       2343: c = "MQRC_OBJECT_NOT_UNIQUE"; break;
   case       2344: c = "MQRC_CONN_TAG_NOT_RELEASED"; break;
   case       2345: c = "MQRC_CF_NOT_AVAILABLE"; break;
   case       2346: c = "MQRC_CF_STRUC_IN_USE"; break;
   case       2347: c = "MQRC_CF_STRUC_LIST_HDR_IN_USE"; break;
   case       2348: c = "MQRC_CF_STRUC_AUTH_FAILED"; break;
   case       2349: c = "MQRC_CF_STRUC_ERROR"; break;
   case       2350: c = "MQRC_CONN_TAG_NOT_USABLE"; break;
   case       2351: c = "MQRC_GLOBAL_UOW_CONFLICT"; break;
   case       2352: c = "MQRC_LOCAL_UOW_CONFLICT"; break;
   case       2353: c = "MQRC_HANDLE_IN_USE_FOR_UOW"; break;
   case       2354: c = "MQRC_UOW_ENLISTMENT_ERROR"; break;
   case       2355: c = "MQRC_UOW_MIX_NOT_SUPPORTED"; break;
   case       2356: c = "MQRC_WXP_ERROR"; break;
   case       2357: c = "MQRC_CURRENT_RECORD_ERROR"; break;
   case       2358: c = "MQRC_NEXT_OFFSET_ERROR"; break;
   case       2359: c = "MQRC_NO_RECORD_AVAILABLE"; break;
   case       2360: c = "MQRC_OBJECT_LEVEL_INCOMPATIBLE"; break;
   case       2361: c = "MQRC_NEXT_RECORD_ERROR"; break;
   case       2362: c = "MQRC_BACKOUT_THRESHOLD_REACHED"; break;
   case       2363: c = "MQRC_MSG_NOT_MATCHED"; break;
   case       2364: c = "MQRC_JMS_FORMAT_ERROR"; break;
   case       2365: c = "MQRC_SEGMENTS_NOT_SUPPORTED"; break;
   case       2366: c = "MQRC_WRONG_CF_LEVEL"; break;
   case       2367: c = "MQRC_CONFIG_CREATE_OBJECT"; break;
   case       2368: c = "MQRC_CONFIG_CHANGE_OBJECT"; break;
   case       2369: c = "MQRC_CONFIG_DELETE_OBJECT"; break;
   case       2370: c = "MQRC_CONFIG_REFRESH_OBJECT"; break;
   case       2371: c = "MQRC_CHANNEL_SSL_ERROR"; break;
   case       2372: c = "MQRC_PARTICIPANT_NOT_DEFINED"; break;
   case       2373: c = "MQRC_CF_STRUC_FAILED"; break;
   case       2374: c = "MQRC_API_EXIT_ERROR"; break;
   case       2375: c = "MQRC_API_EXIT_INIT_ERROR"; break;
   case       2376: c = "MQRC_API_EXIT_TERM_ERROR"; break;
   case       2377: c = "MQRC_EXIT_REASON_ERROR"; break;
   case       2378: c = "MQRC_RESERVED_VALUE_ERROR"; break;
   case       2379: c = "MQRC_NO_DATA_AVAILABLE"; break;
   case       2380: c = "MQRC_SCO_ERROR"; break;
   case       2381: c = "MQRC_KEY_REPOSITORY_ERROR"; break;
   case       2382: c = "MQRC_CRYPTO_HARDWARE_ERROR"; break;
   case       2383: c = "MQRC_AUTH_INFO_REC_COUNT_ERROR"; break;
   case       2384: c = "MQRC_AUTH_INFO_REC_ERROR"; break;
   case       2385: c = "MQRC_AIR_ERROR"; break;
   case       2386: c = "MQRC_AUTH_INFO_TYPE_ERROR"; break;
   case       2387: c = "MQRC_AUTH_INFO_CONN_NAME_ERROR"; break;
   case       2388: c = "MQRC_LDAP_USER_NAME_ERROR"; break;
   case       2389: c = "MQRC_LDAP_USER_NAME_LENGTH_ERR"; break;
   case       2390: c = "MQRC_LDAP_PASSWORD_ERROR"; break;
   case       2391: c = "MQRC_SSL_ALREADY_INITIALIZED"; break;
   case       2392: c = "MQRC_SSL_CONFIG_ERROR"; break;
   case       2393: c = "MQRC_SSL_INITIALIZATION_ERROR"; break;
   case       2394: c = "MQRC_Q_INDEX_TYPE_ERROR"; break;
   case       2395: c = "MQRC_CFBS_ERROR"; break;
   case       2396: c = "MQRC_SSL_NOT_ALLOWED"; break;
   case       2397: c = "MQRC_JSSE_ERROR"; break;
   case       2398: c = "MQRC_SSL_PEER_NAME_MISMATCH"; break;
   case       2399: c = "MQRC_SSL_PEER_NAME_ERROR"; break;
   case       2400: c = "MQRC_UNSUPPORTED_CIPHER_SUITE"; break;
   case       2401: c = "MQRC_SSL_CERTIFICATE_REVOKED"; break;
   case       2402: c = "MQRC_SSL_CERT_STORE_ERROR"; break;
   case       2406: c = "MQRC_CLIENT_EXIT_LOAD_ERROR"; break;
   case       2407: c = "MQRC_CLIENT_EXIT_ERROR"; break;
   case       2408: c = "MQRC_UOW_COMMITTED"; break;
   case       2409: c = "MQRC_SSL_KEY_RESET_ERROR"; break;
   case       2410: c = "MQRC_UNKNOWN_COMPONENT_NAME"; break;
   case       2411: c = "MQRC_LOGGER_STATUS"; break;
   case       2412: c = "MQRC_COMMAND_MQSC"; break;
   case       2413: c = "MQRC_COMMAND_PCF"; break;
   case       2414: c = "MQRC_CFIF_ERROR"; break;
   case       2415: c = "MQRC_CFSF_ERROR"; break;
   case       2416: c = "MQRC_CFGR_ERROR"; break;
   case       2417: c = "MQRC_MSG_NOT_ALLOWED_IN_GROUP"; break;
   case       2418: c = "MQRC_FILTER_OPERATOR_ERROR"; break;
   case       2419: c = "MQRC_NESTED_SELECTOR_ERROR"; break;
   case       2420: c = "MQRC_EPH_ERROR"; break;
   case       2421: c = "MQRC_RFH_FORMAT_ERROR"; break;
   case       2422: c = "MQRC_CFBF_ERROR"; break;
   case       2423: c = "MQRC_CLIENT_CHANNEL_CONFLICT"; break;
   case       2424: c = "MQRC_SD_ERROR"; break;
   case       2425: c = "MQRC_TOPIC_STRING_ERROR"; break;
   case       2426: c = "MQRC_STS_ERROR"; break;
   case       2428: c = "MQRC_NO_SUBSCRIPTION"; break;
   case       2429: c = "MQRC_SUBSCRIPTION_IN_USE"; break;
   case       2430: c = "MQRC_STAT_TYPE_ERROR"; break;
   case       2431: c = "MQRC_SUB_USER_DATA_ERROR"; break;
   case       2432: c = "MQRC_SUB_ALREADY_EXISTS"; break;
   case       2434: c = "MQRC_IDENTITY_MISMATCH"; break;
   case       2435: c = "MQRC_ALTER_SUB_ERROR"; break;
   case       2436: c = "MQRC_DURABILITY_NOT_ALLOWED"; break;
   case       2437: c = "MQRC_NO_RETAINED_MSG"; break;
   case       2438: c = "MQRC_SRO_ERROR"; break;
   case       2440: c = "MQRC_SUB_NAME_ERROR"; break;
   case       2441: c = "MQRC_OBJECT_STRING_ERROR"; break;
   case       2442: c = "MQRC_PROPERTY_NAME_ERROR"; break;
   case       2443: c = "MQRC_SEGMENTATION_NOT_ALLOWED"; break;
   case       2444: c = "MQRC_CBD_ERROR"; break;
   case       2445: c = "MQRC_CTLO_ERROR"; break;
   case       2446: c = "MQRC_NO_CALLBACKS_ACTIVE"; break;
   case       2448: c = "MQRC_CALLBACK_NOT_REGISTERED"; break;
   case       2457: c = "MQRC_OPTIONS_CHANGED"; break;
   case       2458: c = "MQRC_READ_AHEAD_MSGS"; break;
   case       2459: c = "MQRC_SELECTOR_SYNTAX_ERROR"; break;
   case       2460: c = "MQRC_HMSG_ERROR"; break;
   case       2461: c = "MQRC_CMHO_ERROR"; break;
   case       2462: c = "MQRC_DMHO_ERROR"; break;
   case       2463: c = "MQRC_SMPO_ERROR"; break;
   case       2464: c = "MQRC_IMPO_ERROR"; break;
   case       2465: c = "MQRC_PROPERTY_NAME_TOO_BIG"; break;
   case       2466: c = "MQRC_PROP_VALUE_NOT_CONVERTED"; break;
   case       2467: c = "MQRC_PROP_TYPE_NOT_SUPPORTED"; break;
   case       2469: c = "MQRC_PROPERTY_VALUE_TOO_BIG"; break;
   case       2470: c = "MQRC_PROP_CONV_NOT_SUPPORTED"; break;
   case       2471: c = "MQRC_PROPERTY_NOT_AVAILABLE"; break;
   case       2472: c = "MQRC_PROP_NUMBER_FORMAT_ERROR"; break;
   case       2473: c = "MQRC_PROPERTY_TYPE_ERROR"; break;
   case       2478: c = "MQRC_PROPERTIES_TOO_BIG"; break;
   case       2479: c = "MQRC_PUT_NOT_RETAINED"; break;
   case       2480: c = "MQRC_ALIAS_TARGTYPE_CHANGED"; break;
   case       2481: c = "MQRC_DMPO_ERROR"; break;
   case       2482: c = "MQRC_PD_ERROR"; break;
   case       2483: c = "MQRC_CALLBACK_TYPE_ERROR"; break;
   case       2484: c = "MQRC_CBD_OPTIONS_ERROR"; break;
   case       2485: c = "MQRC_MAX_MSG_LENGTH_ERROR"; break;
   case       2486: c = "MQRC_CALLBACK_ROUTINE_ERROR"; break;
   case       2487: c = "MQRC_CALLBACK_LINK_ERROR"; break;
   case       2488: c = "MQRC_OPERATION_ERROR"; break;
   case       2489: c = "MQRC_BMHO_ERROR"; break;
   case       2490: c = "MQRC_UNSUPPORTED_PROPERTY"; break;
   case       2492: c = "MQRC_PROP_NAME_NOT_CONVERTED"; break;
   case       2494: c = "MQRC_GET_ENABLED"; break;
   case       2495: c = "MQRC_MODULE_NOT_FOUND"; break;
   case       2496: c = "MQRC_MODULE_INVALID"; break;
   case       2497: c = "MQRC_MODULE_ENTRY_NOT_FOUND"; break;
   case       2498: c = "MQRC_MIXED_CONTENT_NOT_ALLOWED"; break;
   case       2499: c = "MQRC_MSG_HANDLE_IN_USE"; break;
   case       2500: c = "MQRC_HCONN_ASYNC_ACTIVE"; break;
   case       2501: c = "MQRC_MHBO_ERROR"; break;
   case       2502: c = "MQRC_PUBLICATION_FAILURE"; break;
   case       2503: c = "MQRC_SUB_INHIBITED"; break;
   case       2504: c = "MQRC_SELECTOR_ALWAYS_FALSE"; break;
   case       2507: c = "MQRC_XEPO_ERROR"; break;
   case       2509: c = "MQRC_DURABILITY_NOT_ALTERABLE"; break;
   case       2510: c = "MQRC_TOPIC_NOT_ALTERABLE"; break;
   case       2512: c = "MQRC_SUBLEVEL_NOT_ALTERABLE"; break;
   case       2513: c = "MQRC_PROPERTY_NAME_LENGTH_ERR"; break;
   case       2514: c = "MQRC_DUPLICATE_GROUP_SUB"; break;
   case       2515: c = "MQRC_GROUPING_NOT_ALTERABLE"; break;
   case       2516: c = "MQRC_SELECTOR_INVALID_FOR_TYPE"; break;
   case       2517: c = "MQRC_HOBJ_QUIESCED"; break;
   case       2518: c = "MQRC_HOBJ_QUIESCED_NO_MSGS"; break;
   case       2519: c = "MQRC_SELECTION_STRING_ERROR"; break;
   case       2520: c = "MQRC_RES_OBJECT_STRING_ERROR"; break;
   case       2521: c = "MQRC_CONNECTION_SUSPENDED"; break;
   case       2522: c = "MQRC_INVALID_DESTINATION"; break;
   case       2523: c = "MQRC_INVALID_SUBSCRIPTION"; break;
   case       2524: c = "MQRC_SELECTOR_NOT_ALTERABLE"; break;
   case       2525: c = "MQRC_RETAINED_MSG_Q_ERROR"; break;
   case       2526: c = "MQRC_RETAINED_NOT_DELIVERED"; break;
   case       2527: c = "MQRC_RFH_RESTRICTED_FORMAT_ERR"; break;
   case       2528: c = "MQRC_CONNECTION_STOPPED"; break;
   case       2529: c = "MQRC_ASYNC_UOW_CONFLICT"; break;
   case       2530: c = "MQRC_ASYNC_XA_CONFLICT"; break;
   case       2531: c = "MQRC_PUBSUB_INHIBITED"; break;
   case       2532: c = "MQRC_MSG_HANDLE_COPY_FAILURE"; break;
   case       2533: c = "MQRC_DEST_CLASS_NOT_ALTERABLE"; break;
   case       2534: c = "MQRC_OPERATION_NOT_ALLOWED"; break;
   case       2535: c = "MQRC_ACTION_ERROR"; break;
   case       2537: c = "MQRC_CHANNEL_NOT_AVAILABLE"; break;
   case       2538: c = "MQRC_HOST_NOT_AVAILABLE"; break;
   case       2539: c = "MQRC_CHANNEL_CONFIG_ERROR"; break;
   case       2540: c = "MQRC_UNKNOWN_CHANNEL_NAME"; break;
   case       2541: c = "MQRC_LOOPING_PUBLICATION"; break;
   case       2542: c = "MQRC_ALREADY_JOINED"; break;
   case       2543: c = "MQRC_STANDBY_Q_MGR"; break;
   case       2544: c = "MQRC_RECONNECTING"; break;
   case       2545: c = "MQRC_RECONNECTED"; break;
   case       2546: c = "MQRC_RECONNECT_QMID_MISMATCH"; break;
   case       2547: c = "MQRC_RECONNECT_INCOMPATIBLE"; break;
   case       2548: c = "MQRC_RECONNECT_FAILED"; break;
   case       2549: c = "MQRC_CALL_INTERRUPTED"; break;
   case       2550: c = "MQRC_NO_SUBS_MATCHED"; break;
   case       2551: c = "MQRC_SELECTION_NOT_AVAILABLE"; break;
   case       2552: c = "MQRC_CHANNEL_SSL_WARNING"; break;
   case       2553: c = "MQRC_OCSP_URL_ERROR"; break;
   case       2554: c = "MQRC_CONTENT_ERROR"; break;
   case       2555: c = "MQRC_RECONNECT_Q_MGR_REQD"; break;
   case       2556: c = "MQRC_RECONNECT_TIMED_OUT"; break;
   case       2557: c = "MQRC_PUBLISH_EXIT_ERROR"; break;
   case       2558: c = "MQRC_COMMINFO_ERROR"; break;
   case       2559: c = "MQRC_DEF_SYNCPOINT_INHIBITED"; break;
   case       2560: c = "MQRC_MULTICAST_ONLY"; break;
   case       2561: c = "MQRC_DATA_SET_NOT_AVAILABLE"; break;
   case       2562: c = "MQRC_GROUPING_NOT_ALLOWED"; break;
   case       2563: c = "MQRC_GROUP_ADDRESS_ERROR"; break;
   case       2564: c = "MQRC_MULTICAST_CONFIG_ERROR"; break;
   case       2565: c = "MQRC_MULTICAST_INTERFACE_ERROR"; break;
   case       2566: c = "MQRC_MULTICAST_SEND_ERROR"; break;
   case       2567: c = "MQRC_MULTICAST_INTERNAL_ERROR"; break;
   case       2568: c = "MQRC_CONNECTION_NOT_AVAILABLE"; break;
   case       2569: c = "MQRC_SYNCPOINT_NOT_ALLOWED"; break;
   case       2570: c = "MQRC_SSL_ALT_PROVIDER_REQUIRED"; break;
   case       2571: c = "MQRC_MCAST_PUB_STATUS"; break;
   case       2572: c = "MQRC_MCAST_SUB_STATUS"; break;
   case       2573: c = "MQRC_PRECONN_EXIT_LOAD_ERROR"; break;
   case       2574: c = "MQRC_PRECONN_EXIT_NOT_FOUND"; break;
   case       2575: c = "MQRC_PRECONN_EXIT_ERROR"; break;
   case       2576: c = "MQRC_CD_ARRAY_ERROR"; break;
   case       2577: c = "MQRC_CHANNEL_BLOCKED"; break;
   case       2578: c = "MQRC_CHANNEL_BLOCKED_WARNING"; break;
   case       2579: c = "MQRC_SUBSCRIPTION_CREATE"; break;
   case       2580: c = "MQRC_SUBSCRIPTION_DELETE"; break;
   case       2581: c = "MQRC_SUBSCRIPTION_CHANGE"; break;
   case       2582: c = "MQRC_SUBSCRIPTION_REFRESH"; break;
   case       2583: c = "MQRC_INSTALLATION_MISMATCH"; break;
   case       2584: c = "MQRC_NOT_PRIVILEGED"; break;
   case       2586: c = "MQRC_PROPERTIES_DISABLED"; break;
   case       2587: c = "MQRC_HMSG_NOT_AVAILABLE"; break;
   case       2588: c = "MQRC_EXIT_PROPS_NOT_SUPPORTED"; break;
   case       2589: c = "MQRC_INSTALLATION_MISSING"; break;
   case       2590: c = "MQRC_FASTPATH_NOT_AVAILABLE"; break;
   case       2591: c = "MQRC_CIPHER_SPEC_NOT_SUITE_B"; break;
   case       2592: c = "MQRC_SUITE_B_ERROR"; break;
   case       2593: c = "MQRC_CERT_VAL_POLICY_ERROR"; break;
   case       2594: c = "MQRC_PASSWORD_PROTECTION_ERROR"; break;
   case       2595: c = "MQRC_CSP_ERROR"; break;
   case       2596: c = "MQRC_CERT_LABEL_NOT_ALLOWED"; break;
   case       2598: c = "MQRC_ADMIN_TOPIC_STRING_ERROR"; break;
   case       2599: c = "MQRC_AMQP_NOT_AVAILABLE"; break;
   case       2600: c = "MQRC_CCDT_URL_ERROR"; break;
   case       2601: c = "MQRC_Q_MGR_RECONNECT_REQUESTED"; break;
   case       6100: c = "MQRC_REOPEN_EXCL_INPUT_ERROR"; break;
   case       6101: c = "MQRC_REOPEN_INQUIRE_ERROR"; break;
   case       6102: c = "MQRC_REOPEN_SAVED_CONTEXT_ERR"; break;
   case       6103: c = "MQRC_REOPEN_TEMPORARY_Q_ERROR"; break;
   case       6104: c = "MQRC_ATTRIBUTE_LOCKED"; break;
   case       6105: c = "MQRC_CURSOR_NOT_VALID"; break;
   case       6106: c = "MQRC_ENCODING_ERROR"; break;
   case       6107: c = "MQRC_STRUC_ID_ERROR"; break;
   case       6108: c = "MQRC_NULL_POINTER"; break;
   case       6109: c = "MQRC_NO_CONNECTION_REFERENCE"; break;
   case       6110: c = "MQRC_NO_BUFFER"; break;
   case       6111: c = "MQRC_BINARY_DATA_LENGTH_ERROR"; break;
   case       6112: c = "MQRC_BUFFER_NOT_AUTOMATIC"; break;
   case       6113: c = "MQRC_INSUFFICIENT_BUFFER"; break;
   case       6114: c = "MQRC_INSUFFICIENT_DATA"; break;
   case       6115: c = "MQRC_DATA_TRUNCATED"; break;
   case       6116: c = "MQRC_ZERO_LENGTH"; break;
   case       6117: c = "MQRC_NEGATIVE_LENGTH"; break;
   case       6118: c = "MQRC_NEGATIVE_OFFSET"; break;
   case       6119: c = "MQRC_INCONSISTENT_FORMAT"; break;
   case       6120: c = "MQRC_INCONSISTENT_OBJECT_STATE"; break;
   case       6121: c = "MQRC_CONTEXT_OBJECT_NOT_VALID"; break;
   case       6122: c = "MQRC_CONTEXT_OPEN_ERROR"; break;
   case       6124: c = "MQRC_NOT_CONNECTED"; break;
   case       6125: c = "MQRC_NOT_OPEN"; break;
   case       6126: c = "MQRC_DISTRIBUTION_LIST_EMPTY"; break;
   case       6127: c = "MQRC_INCONSISTENT_OPEN_OPTIONS"; break;
   case       6128: c = "MQRC_WRONG_VERSION"; break;
   case       6129: c = "MQRC_REFERENCE_ERROR"; break;
   case       6130: c = "MQRC_XR_NOT_AVAILABLE"; break;
   case      29440: c = "MQRC_SUB_JOIN_NOT_ALTERABLE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRDNS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQRDNS_ENABLED"; break;
   case          1: c = "MQRDNS_DISABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRD_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQRD_NO_RECONNECT"; break;
   case          0: c = "MQRD_NO_DELAY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQREADA_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQREADA_NO"; break;
   case          1: c = "MQREADA_YES"; break;
   case          2: c = "MQREADA_DISABLED"; break;
   case          3: c = "MQREADA_INHIBITED"; break;
   case          4: c = "MQREADA_BACKLOG"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRECAUTO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQRECAUTO_NO"; break;
   case          1: c = "MQRECAUTO_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRECORDING_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQRECORDING_DISABLED"; break;
   case          1: c = "MQRECORDING_Q"; break;
   case          2: c = "MQRECORDING_MSG"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQREGO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQREGO_NONE"; break;
   case          1: c = "MQREGO_CORREL_ID_AS_IDENTITY"; break;
   case          2: c = "MQREGO_ANONYMOUS"; break;
   case          4: c = "MQREGO_LOCAL"; break;
   case          8: c = "MQREGO_DIRECT_REQUESTS"; break;
   case         16: c = "MQREGO_NEW_PUBLICATIONS_ONLY"; break;
   case         32: c = "MQREGO_PUBLISH_ON_REQUEST_ONLY"; break;
   case         64: c = "MQREGO_DEREGISTER_ALL"; break;
   case        128: c = "MQREGO_INCLUDE_STREAM_NAME"; break;
   case        256: c = "MQREGO_INFORM_IF_RETAINED"; break;
   case        512: c = "MQREGO_DUPLICATES_OK"; break;
   case       1024: c = "MQREGO_NON_PERSISTENT"; break;
   case       2048: c = "MQREGO_PERSISTENT"; break;
   case       4096: c = "MQREGO_PERSISTENT_AS_PUBLISH"; break;
   case       8192: c = "MQREGO_PERSISTENT_AS_Q"; break;
   case      16384: c = "MQREGO_ADD_NAME"; break;
   case      32768: c = "MQREGO_NO_ALTERATION"; break;
   case      65536: c = "MQREGO_FULL_RESPONSE"; break;
   case     131072: c = "MQREGO_JOIN_SHARED"; break;
   case     262144: c = "MQREGO_JOIN_EXCLUSIVE"; break;
   case     524288: c = "MQREGO_LEAVE_ONLY"; break;
   case    1048576: c = "MQREGO_VARIABLE_USER_ID"; break;
   case    2097152: c = "MQREGO_LOCKED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQREORG_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQREORG_DISABLED"; break;
   case          1: c = "MQREORG_ENABLED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRFH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case     -65536: c = "MQRFH_FLAGS_RESTRICTED_MASK"; break;
   case          0: c = "MQRFH_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQRL_UNDEFINED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQROUTE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case     -65536: c = "MQROUTE_DELIVER_REJ_UNSUP_MASK"; break;
   case          0: c = "MQROUTE_UNLIMITED_ACTIVITIES"; break;
   case          2: c = "MQROUTE_DETAIL_LOW"; break;
   case          8: c = "MQROUTE_DETAIL_MEDIUM"; break;
   case         32: c = "MQROUTE_DETAIL_HIGH"; break;
   case        256: c = "MQROUTE_FORWARD_ALL"; break;
   case        512: c = "MQROUTE_FORWARD_IF_SUPPORTED"; break;
   case       4096: c = "MQROUTE_DELIVER_YES"; break;
   case       8192: c = "MQROUTE_DELIVER_NO"; break;
   case      65539: c = "MQROUTE_ACCUMULATE_NONE"; break;
   case      65540: c = "MQROUTE_ACCUMULATE_IN_MSG"; break;
   case      65541: c = "MQROUTE_ACCUMULATE_AND_REPLY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case -270532353: c = "MQRO_ACCEPT_UNSUP_MASK"; break;
   case          0: c = "MQRO_NONE"; break;
   case          1: c = "MQRO_PAN"; break;
   case          2: c = "MQRO_NAN"; break;
   case          4: c = "MQRO_ACTIVITY"; break;
   case         64: c = "MQRO_PASS_CORREL_ID"; break;
   case        128: c = "MQRO_PASS_MSG_ID"; break;
   case        256: c = "MQRO_COA"; break;
   case        768: c = "MQRO_COA_WITH_DATA"; break;
   case       1792: c = "MQRO_COA_WITH_FULL_DATA"; break;
   case       2048: c = "MQRO_COD"; break;
   case       6144: c = "MQRO_COD_WITH_DATA"; break;
   case      14336: c = "MQRO_COD_WITH_FULL_DATA"; break;
   case      16384: c = "MQRO_PASS_DISCARD_AND_EXPIRY"; break;
   case     261888: c = "MQRO_ACCEPT_UNSUP_IF_XMIT_MASK"; break;
   case    2097152: c = "MQRO_EXPIRATION"; break;
   case    6291456: c = "MQRO_EXPIRATION_WITH_DATA"; break;
   case   14680064: c = "MQRO_EXPIRATION_WITH_FULL_DATA"; break;
   case   16777216: c = "MQRO_EXCEPTION"; break;
   case   50331648: c = "MQRO_EXCEPTION_WITH_DATA"; break;
   case  117440512: c = "MQRO_EXCEPTION_WITH_FULL_DATA"; break;
   case  134217728: c = "MQRO_DISCARD_MSG"; break;
   case  270270464: c = "MQRO_REJECT_UNSUP_MASK"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQRP_NO"; break;
   case          1: c = "MQRP_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRQ_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQRQ_CONN_NOT_AUTHORIZED"; break;
   case          2: c = "MQRQ_OPEN_NOT_AUTHORIZED"; break;
   case          3: c = "MQRQ_CLOSE_NOT_AUTHORIZED"; break;
   case          4: c = "MQRQ_CMD_NOT_AUTHORIZED"; break;
   case          5: c = "MQRQ_Q_MGR_STOPPING"; break;
   case          6: c = "MQRQ_Q_MGR_QUIESCING"; break;
   case          7: c = "MQRQ_CHANNEL_STOPPED_OK"; break;
   case          8: c = "MQRQ_CHANNEL_STOPPED_ERROR"; break;
   case          9: c = "MQRQ_CHANNEL_STOPPED_RETRY"; break;
   case         10: c = "MQRQ_CHANNEL_STOPPED_DISABLED"; break;
   case         11: c = "MQRQ_BRIDGE_STOPPED_OK"; break;
   case         12: c = "MQRQ_BRIDGE_STOPPED_ERROR"; break;
   case         13: c = "MQRQ_SSL_HANDSHAKE_ERROR"; break;
   case         14: c = "MQRQ_SSL_CIPHER_SPEC_ERROR"; break;
   case         15: c = "MQRQ_SSL_CLIENT_AUTH_ERROR"; break;
   case         16: c = "MQRQ_SSL_PEER_NAME_ERROR"; break;
   case         17: c = "MQRQ_SUB_NOT_AUTHORIZED"; break;
   case         18: c = "MQRQ_SUB_DEST_NOT_AUTHORIZED"; break;
   case         19: c = "MQRQ_SSL_UNKNOWN_REVOCATION"; break;
   case         20: c = "MQRQ_SYS_CONN_NOT_AUTHORIZED"; break;
   case         21: c = "MQRQ_CHANNEL_BLOCKED_ADDRESS"; break;
   case         22: c = "MQRQ_CHANNEL_BLOCKED_USERID"; break;
   case         23: c = "MQRQ_CHANNEL_BLOCKED_NOACCESS"; break;
   case         24: c = "MQRQ_MAX_ACTIVE_CHANNELS"; break;
   case         25: c = "MQRQ_MAX_CHANNELS"; break;
   case         26: c = "MQRQ_SVRCONN_INST_LIMIT"; break;
   case         27: c = "MQRQ_CLIENT_INST_LIMIT"; break;
   case         28: c = "MQRQ_CAF_NOT_INSTALLED"; break;
   case         29: c = "MQRQ_CSP_NOT_AUTHORIZED"; break;
   case         30: c = "MQRQ_FAILOVER_PERMITTED"; break;
   case         31: c = "MQRQ_FAILOVER_NOT_PERMITTED"; break;
   case         32: c = "MQRQ_STANDBY_ACTIVATED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQRT_CONFIGURATION"; break;
   case          2: c = "MQRT_EXPIRY"; break;
   case          3: c = "MQRT_NSPROC"; break;
   case          4: c = "MQRT_PROXYSUB"; break;
   case          5: c = "MQRT_SUB_CONFIGURATION"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQRU_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQRU_PUBLISH_ON_REQUEST"; break;
   case          2: c = "MQRU_PUBLISH_ALL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSCA_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSCA_REQUIRED"; break;
   case          1: c = "MQSCA_OPTIONAL"; break;
   case          2: c = "MQSCA_NEVER_REQUIRED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSCOPE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSCOPE_ALL"; break;
   case          1: c = "MQSCOPE_AS_PARENT"; break;
   case          4: c = "MQSCOPE_QMGR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSCO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQSCO_Q_MGR"; break;
   case          2: c = "MQSCO_CELL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSCYC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSCYC_UPPER"; break;
   case          1: c = "MQSCYC_MIXED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSECCOMM_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSECCOMM_NO"; break;
   case          1: c = "MQSECCOMM_YES"; break;
   case          2: c = "MQSECCOMM_ANON"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSECITEM_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSECITEM_ALL"; break;
   case          1: c = "MQSECITEM_MQADMIN"; break;
   case          2: c = "MQSECITEM_MQNLIST"; break;
   case          3: c = "MQSECITEM_MQPROC"; break;
   case          4: c = "MQSECITEM_MQQUEUE"; break;
   case          5: c = "MQSECITEM_MQCONN"; break;
   case          6: c = "MQSECITEM_MQCMDS"; break;
   case          7: c = "MQSECITEM_MXADMIN"; break;
   case          8: c = "MQSECITEM_MXNLIST"; break;
   case          9: c = "MQSECITEM_MXPROC"; break;
   case         10: c = "MQSECITEM_MXQUEUE"; break;
   case         11: c = "MQSECITEM_MXTOPIC"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSECPROT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSECPROT_NONE"; break;
   case          1: c = "MQSECPROT_SSLV30"; break;
   case          2: c = "MQSECPROT_TLSV10"; break;
   case          4: c = "MQSECPROT_TLSV12"; break;
   case          8: c = "MQSECPROT_TLSV13"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSECSW_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQSECSW_PROCESS"; break;
   case          2: c = "MQSECSW_NAMELIST"; break;
   case          3: c = "MQSECSW_Q"; break;
   case          4: c = "MQSECSW_TOPIC"; break;
   case          6: c = "MQSECSW_CONTEXT"; break;
   case          7: c = "MQSECSW_ALTERNATE_USER"; break;
   case          8: c = "MQSECSW_COMMAND"; break;
   case          9: c = "MQSECSW_CONNECTION"; break;
   case         10: c = "MQSECSW_SUBSYSTEM"; break;
   case         11: c = "MQSECSW_COMMAND_RESOURCES"; break;
   case         15: c = "MQSECSW_Q_MGR"; break;
   case         16: c = "MQSECSW_QSG"; break;
   case         21: c = "MQSECSW_OFF_FOUND"; break;
   case         22: c = "MQSECSW_ON_FOUND"; break;
   case         23: c = "MQSECSW_OFF_NOT_FOUND"; break;
   case         24: c = "MQSECSW_ON_NOT_FOUND"; break;
   case         25: c = "MQSECSW_OFF_ERROR"; break;
   case         26: c = "MQSECSW_ON_OVERRIDDEN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSECTYPE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQSECTYPE_AUTHSERV"; break;
   case          2: c = "MQSECTYPE_SSL"; break;
   case          3: c = "MQSECTYPE_CLASSES"; break;
   case          4: c = "MQSECTYPE_CONNAUTH"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSELTYPE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSELTYPE_NONE"; break;
   case          1: c = "MQSELTYPE_STANDARD"; break;
   case          2: c = "MQSELTYPE_EXTENDED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSEL_ALL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case     -30003: c = "MQSEL_ALL_SYSTEM_SELECTORS"; break;
   case     -30002: c = "MQSEL_ALL_USER_SELECTORS"; break;
   case     -30001: c = "MQSEL_ALL_SELECTORS"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSEL_ANY_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case     -30003: c = "MQSEL_ANY_SYSTEM_SELECTOR"; break;
   case     -30002: c = "MQSEL_ANY_USER_SELECTOR"; break;
   case     -30001: c = "MQSEL_ANY_SELECTOR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSMPO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSMPO_NONE"; break;
   case          1: c = "MQSMPO_SET_PROP_UNDER_CURSOR"; break;
   case          2: c = "MQSMPO_SET_PROP_AFTER_CURSOR"; break;
   case          4: c = "MQSMPO_APPEND_PROPERTY"; break;
   case          8: c = "MQSMPO_SET_PROP_BEFORE_CURSOR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSO_NONE"; break;
   case          1: c = "MQSO_ALTER"; break;
   case          2: c = "MQSO_CREATE"; break;
   case          4: c = "MQSO_RESUME"; break;
   case          8: c = "MQSO_DURABLE"; break;
   case         16: c = "MQSO_GROUP_SUB"; break;
   case         32: c = "MQSO_MANAGED"; break;
   case         64: c = "MQSO_SET_IDENTITY_CONTEXT"; break;
   case        128: c = "MQSO_NO_MULTICAST"; break;
   case        256: c = "MQSO_FIXED_USERID"; break;
   case        512: c = "MQSO_ANY_USERID"; break;
   case       2048: c = "MQSO_PUBLICATIONS_ON_REQUEST"; break;
   case       4096: c = "MQSO_NEW_PUBLICATIONS_ONLY"; break;
   case       8192: c = "MQSO_FAIL_IF_QUIESCING"; break;
   case     262144: c = "MQSO_ALTERNATE_USER_AUTHORITY"; break;
   case    1048576: c = "MQSO_WILDCARD_CHAR"; break;
   case    2097152: c = "MQSO_WILDCARD_TOPIC"; break;
   case    4194304: c = "MQSO_SET_CORREL_ID"; break;
   case   67108864: c = "MQSO_SCOPE_QMGR"; break;
   case  134217728: c = "MQSO_NO_READ_AHEAD"; break;
   case  268435456: c = "MQSO_READ_AHEAD"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSPL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSPL_PASSTHRU"; break;
   case          1: c = "MQSPL_REMOVE"; break;
   case          2: c = "MQSPL_AS_POLICY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSP_NOT_AVAILABLE"; break;
   case          1: c = "MQSP_AVAILABLE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSQQM_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSQQM_USE"; break;
   case          1: c = "MQSQQM_IGNORE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSRO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSRO_NONE"; break;
   case       8192: c = "MQSRO_FAIL_IF_QUIESCING"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQSR_ACTION_PUBLICATION"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSSL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSSL_FIPS_NO"; break;
   case          1: c = "MQSSL_FIPS_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSTAT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSTAT_TYPE_ASYNC_ERROR"; break;
   case          1: c = "MQSTAT_TYPE_RECONNECTION"; break;
   case          2: c = "MQSTAT_TYPE_RECONNECTION_ERROR"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSTDBY_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSTDBY_NOT_PERMITTED"; break;
   case          1: c = "MQSTDBY_PERMITTED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSUBTYPE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -2: c = "MQSUBTYPE_USER"; break;
   case         -1: c = "MQSUBTYPE_ALL"; break;
   case          1: c = "MQSUBTYPE_API"; break;
   case          2: c = "MQSUBTYPE_ADMIN"; break;
   case          3: c = "MQSUBTYPE_PROXY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSUB_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQSUB_DURABLE_ALL"; break;
   case          0: c = "MQSUB_DURABLE_AS_PARENT"; break;
   case          1: c = "MQSUB_DURABLE_ALLOWED"; break;
   case          2: c = "MQSUB_DURABLE_INHIBITED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSUS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSUS_NO"; break;
   case          1: c = "MQSUS_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSVC_CONTROL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSVC_CONTROL_Q_MGR"; break;
   case          1: c = "MQSVC_CONTROL_Q_MGR_START"; break;
   case          2: c = "MQSVC_CONTROL_MANUAL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSVC_STATUS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSVC_STATUS_STOPPED"; break;
   case          1: c = "MQSVC_STATUS_STARTING"; break;
   case          2: c = "MQSVC_STATUS_RUNNING"; break;
   case          3: c = "MQSVC_STATUS_STOPPING"; break;
   case          4: c = "MQSVC_STATUS_RETRYING"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSVC_TYPE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSVC_TYPE_COMMAND"; break;
   case          1: c = "MQSVC_TYPE_SERVER"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSYNCPOINT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSYNCPOINT_YES"; break;
   case          1: c = "MQSYNCPOINT_IFPER"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSYSOBJ_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSYSOBJ_YES"; break;
   case          1: c = "MQSYSOBJ_NO"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQSYSP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQSYSP_NO"; break;
   case          1: c = "MQSYSP_YES"; break;
   case          2: c = "MQSYSP_EXTENDED"; break;
   case         10: c = "MQSYSP_TYPE_INITIAL"; break;
   case         11: c = "MQSYSP_TYPE_SET"; break;
   case         12: c = "MQSYSP_TYPE_LOG_COPY"; break;
   case         13: c = "MQSYSP_TYPE_LOG_STATUS"; break;
   case         14: c = "MQSYSP_TYPE_ARCHIVE_TAPE"; break;
   case         20: c = "MQSYSP_ALLOC_BLK"; break;
   case         21: c = "MQSYSP_ALLOC_TRK"; break;
   case         22: c = "MQSYSP_ALLOC_CYL"; break;
   case         30: c = "MQSYSP_STATUS_BUSY"; break;
   case         31: c = "MQSYSP_STATUS_PREMOUNT"; break;
   case         32: c = "MQSYSP_STATUS_AVAILABLE"; break;
   case         33: c = "MQSYSP_STATUS_UNKNOWN"; break;
   case         34: c = "MQSYSP_STATUS_ALLOC_ARCHIVE"; break;
   case         35: c = "MQSYSP_STATUS_COPYING_BSDS"; break;
   case         36: c = "MQSYSP_STATUS_COPYING_LOG"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQS_AVAIL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQS_AVAIL_NORMAL"; break;
   case          1: c = "MQS_AVAIL_ERROR"; break;
   case          2: c = "MQS_AVAIL_STOPPED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQS_EXPANDST_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQS_EXPANDST_NORMAL"; break;
   case          1: c = "MQS_EXPANDST_FAILED"; break;
   case          2: c = "MQS_EXPANDST_MAXIMUM"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQS_OPENMODE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQS_OPENMODE_NONE"; break;
   case          1: c = "MQS_OPENMODE_READONLY"; break;
   case          2: c = "MQS_OPENMODE_UPDATE"; break;
   case          3: c = "MQS_OPENMODE_RECOVERY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQS_STATUS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQS_STATUS_CLOSED"; break;
   case          1: c = "MQS_STATUS_CLOSING"; break;
   case          2: c = "MQS_STATUS_OPENING"; break;
   case          3: c = "MQS_STATUS_OPEN"; break;
   case          4: c = "MQS_STATUS_NOTENABLED"; break;
   case          5: c = "MQS_STATUS_ALLOCFAIL"; break;
   case          6: c = "MQS_STATUS_OPENFAIL"; break;
   case          7: c = "MQS_STATUS_STGFAIL"; break;
   case          8: c = "MQS_STATUS_DATAFAIL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTA_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQTA_BLOCK"; break;
   case          2: c = "MQTA_PASSTHRU"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTA_PROXY_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQTA_PROXY_SUB_FORCE"; break;
   case          2: c = "MQTA_PROXY_SUB_FIRSTUSE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTA_PUB_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQTA_PUB_AS_PARENT"; break;
   case          1: c = "MQTA_PUB_INHIBITED"; break;
   case          2: c = "MQTA_PUB_ALLOWED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTA_SUB_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQTA_SUB_AS_PARENT"; break;
   case          1: c = "MQTA_SUB_INHIBITED"; break;
   case          2: c = "MQTA_SUB_ALLOWED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTCPKEEP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQTCPKEEP_NO"; break;
   case          1: c = "MQTCPKEEP_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTCPSTACK_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQTCPSTACK_SINGLE"; break;
   case          1: c = "MQTCPSTACK_MULTIPLE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQTC_OFF"; break;
   case          1: c = "MQTC_ON"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTIME_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQTIME_UNIT_MINS"; break;
   case          1: c = "MQTIME_UNIT_SECS"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTOPT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQTOPT_LOCAL"; break;
   case          1: c = "MQTOPT_CLUSTER"; break;
   case          2: c = "MQTOPT_ALL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTRAXSTR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQTRAXSTR_NO"; break;
   case          1: c = "MQTRAXSTR_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTRIGGER_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQTRIGGER_RESTART_NO"; break;
   case          1: c = "MQTRIGGER_RESTART_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTSCOPE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQTSCOPE_QMGR"; break;
   case          2: c = "MQTSCOPE_ALL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQTT_NONE"; break;
   case          1: c = "MQTT_FIRST"; break;
   case          2: c = "MQTT_EVERY"; break;
   case          3: c = "MQTT_DEPTH"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQTYPE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQTYPE_AS_SET"; break;
   case          2: c = "MQTYPE_NULL"; break;
   case          4: c = "MQTYPE_BOOLEAN"; break;
   case          8: c = "MQTYPE_BYTE_STRING"; break;
   case         16: c = "MQTYPE_INT8"; break;
   case         32: c = "MQTYPE_INT16"; break;
   case         64: c = "MQTYPE_INT32"; break;
   case        128: c = "MQTYPE_INT64"; break;
   case        256: c = "MQTYPE_FLOAT32"; break;
   case        512: c = "MQTYPE_FLOAT64"; break;
   case       1024: c = "MQTYPE_STRING"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUCI_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQUCI_NO"; break;
   case          1: c = "MQUCI_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUIDSUPP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQUIDSUPP_NO"; break;
   case          1: c = "MQUIDSUPP_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUNDELIVERED_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQUNDELIVERED_NORMAL"; break;
   case          1: c = "MQUNDELIVERED_SAFE"; break;
   case          2: c = "MQUNDELIVERED_DISCARD"; break;
   case          3: c = "MQUNDELIVERED_KEEP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUOWST_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQUOWST_NONE"; break;
   case          1: c = "MQUOWST_ACTIVE"; break;
   case          2: c = "MQUOWST_PREPARED"; break;
   case          3: c = "MQUOWST_UNRESOLVED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUOWT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQUOWT_Q_MGR"; break;
   case          1: c = "MQUOWT_CICS"; break;
   case          2: c = "MQUOWT_RRS"; break;
   case          3: c = "MQUOWT_IMS"; break;
   case          4: c = "MQUOWT_XA"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUSAGE_DS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         10: c = "MQUSAGE_DS_OLDEST_ACTIVE_UOW"; break;
   case         11: c = "MQUSAGE_DS_OLDEST_PS_RECOVERY"; break;
   case         12: c = "MQUSAGE_DS_OLDEST_CF_RECOVERY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUSAGE_EXPAND_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQUSAGE_EXPAND_USER"; break;
   case          2: c = "MQUSAGE_EXPAND_SYSTEM"; break;
   case          3: c = "MQUSAGE_EXPAND_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUSAGE_PS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQUSAGE_PS_AVAILABLE"; break;
   case          1: c = "MQUSAGE_PS_DEFINED"; break;
   case          2: c = "MQUSAGE_PS_OFFLINE"; break;
   case          3: c = "MQUSAGE_PS_NOT_DEFINED"; break;
   case          4: c = "MQUSAGE_PS_SUSPENDED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUSAGE_SMDS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQUSAGE_SMDS_AVAILABLE"; break;
   case          1: c = "MQUSAGE_SMDS_NO_DATA"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUSEDLQ_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQUSEDLQ_AS_PARENT"; break;
   case          1: c = "MQUSEDLQ_NO"; break;
   case          2: c = "MQUSEDLQ_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUSRC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQUSRC_MAP"; break;
   case          1: c = "MQUSRC_NOACCESS"; break;
   case          2: c = "MQUSRC_CHANNEL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQUS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQUS_NORMAL"; break;
   case          1: c = "MQUS_TRANSMISSION"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQVL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQVL_NULL_TERMINATED"; break;
   case          0: c = "MQVL_EMPTY_STRING"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQVS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQVS_NULL_TERMINATED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQVU_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQVU_FIXED_USER"; break;
   case          2: c = "MQVU_ANY_USER"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQWARN_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQWARN_NO"; break;
   case          1: c = "MQWARN_YES"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQWIH_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQWIH_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQWI_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQWI_UNLIMITED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQWS_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQWS_DEFAULT"; break;
   case          1: c = "MQWS_CHAR"; break;
   case          2: c = "MQWS_TOPIC"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQWXP_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          2: c = "MQWXP_PUT_BY_CLUSTER_CHL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQXACT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQXACT_EXTERNAL"; break;
   case          2: c = "MQXACT_INTERNAL"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQXCC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -8: c = "MQXCC_FAILED"; break;
   case         -7: c = "MQXCC_REQUEST_ACK"; break;
   case         -6: c = "MQXCC_CLOSE_CHANNEL"; break;
   case         -5: c = "MQXCC_SUPPRESS_EXIT"; break;
   case         -4: c = "MQXCC_SEND_SEC_MSG"; break;
   case         -3: c = "MQXCC_SEND_AND_REQUEST_SEC_MSG"; break;
   case         -2: c = "MQXCC_SKIP_FUNCTION"; break;
   case         -1: c = "MQXCC_SUPPRESS_FUNCTION"; break;
   case          0: c = "MQXCC_OK"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQXC_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQXC_MQOPEN"; break;
   case          2: c = "MQXC_MQCLOSE"; break;
   case          3: c = "MQXC_MQGET"; break;
   case          4: c = "MQXC_MQPUT"; break;
   case          5: c = "MQXC_MQPUT1"; break;
   case          6: c = "MQXC_MQINQ"; break;
   case          8: c = "MQXC_MQSET"; break;
   case          9: c = "MQXC_MQBACK"; break;
   case         10: c = "MQXC_MQCMIT"; break;
   case         42: c = "MQXC_MQSUB"; break;
   case         43: c = "MQXC_MQSUBRQ"; break;
   case         44: c = "MQXC_MQCB"; break;
   case         45: c = "MQXC_MQCTL"; break;
   case         46: c = "MQXC_MQSTAT"; break;
   case         48: c = "MQXC_CALLBACK"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQXDR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQXDR_OK"; break;
   case          1: c = "MQXDR_CONVERSION_FAILED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQXEPO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQXEPO_NONE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQXE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQXE_OTHER"; break;
   case          1: c = "MQXE_MCA"; break;
   case          2: c = "MQXE_MCA_SVRCONN"; break;
   case          3: c = "MQXE_COMMAND_SERVER"; break;
   case          4: c = "MQXE_MQSC"; break;
   case          5: c = "MQXE_MCA_CLNTCONN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQXF_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQXF_INIT"; break;
   case          2: c = "MQXF_TERM"; break;
   case          3: c = "MQXF_CONN"; break;
   case          4: c = "MQXF_CONNX"; break;
   case          5: c = "MQXF_DISC"; break;
   case          6: c = "MQXF_OPEN"; break;
   case          7: c = "MQXF_CLOSE"; break;
   case          8: c = "MQXF_PUT1"; break;
   case          9: c = "MQXF_PUT"; break;
   case         10: c = "MQXF_GET"; break;
   case         11: c = "MQXF_DATA_CONV_ON_GET"; break;
   case         12: c = "MQXF_INQ"; break;
   case         13: c = "MQXF_SET"; break;
   case         14: c = "MQXF_BEGIN"; break;
   case         15: c = "MQXF_CMIT"; break;
   case         16: c = "MQXF_BACK"; break;
   case         18: c = "MQXF_STAT"; break;
   case         19: c = "MQXF_CB"; break;
   case         20: c = "MQXF_CTL"; break;
   case         21: c = "MQXF_CALLBACK"; break;
   case         22: c = "MQXF_SUB"; break;
   case         23: c = "MQXF_SUBRQ"; break;
   case         24: c = "MQXF_XACLOSE"; break;
   case         25: c = "MQXF_XACOMMIT"; break;
   case         26: c = "MQXF_XACOMPLETE"; break;
   case         27: c = "MQXF_XAEND"; break;
   case         28: c = "MQXF_XAFORGET"; break;
   case         29: c = "MQXF_XAOPEN"; break;
   case         30: c = "MQXF_XAPREPARE"; break;
   case         31: c = "MQXF_XARECOVER"; break;
   case         32: c = "MQXF_XAROLLBACK"; break;
   case         33: c = "MQXF_XASTART"; break;
   case         34: c = "MQXF_AXREG"; break;
   case         35: c = "MQXF_AXUNREG"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQXPT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case         -1: c = "MQXPT_ALL"; break;
   case          0: c = "MQXPT_LOCAL"; break;
   case          1: c = "MQXPT_LU62"; break;
   case          2: c = "MQXPT_TCP"; break;
   case          3: c = "MQXPT_NETBIOS"; break;
   case          4: c = "MQXPT_SPX"; break;
   case          5: c = "MQXPT_DECNET"; break;
   case          6: c = "MQXPT_UDP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQXR2_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQXR2_DEFAULT_CONTINUATION"; break;
   case          1: c = "MQXR2_PUT_WITH_DEF_USERID"; break;
   case          2: c = "MQXR2_PUT_WITH_MSG_USERID"; break;
   case          4: c = "MQXR2_USE_EXIT_BUFFER"; break;
   case          8: c = "MQXR2_CONTINUE_CHAIN"; break;
   case         16: c = "MQXR2_SUPPRESS_CHAIN"; break;
   case         32: c = "MQXR2_DYNAMIC_CACHE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQXR_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQXR_BEFORE"; break;
   case          2: c = "MQXR_AFTER"; break;
   case          3: c = "MQXR_CONNECTION"; break;
   case          4: c = "MQXR_BEFORE_CONVERT"; break;
   case         11: c = "MQXR_INIT"; break;
   case         12: c = "MQXR_TERM"; break;
   case         13: c = "MQXR_MSG"; break;
   case         14: c = "MQXR_XMIT"; break;
   case         15: c = "MQXR_SEC_MSG"; break;
   case         16: c = "MQXR_INIT_SEC"; break;
   case         17: c = "MQXR_RETRY"; break;
   case         18: c = "MQXR_AUTO_CLUSSDR"; break;
   case         19: c = "MQXR_AUTO_RECEIVER"; break;
   case         20: c = "MQXR_CLWL_OPEN"; break;
   case         21: c = "MQXR_CLWL_PUT"; break;
   case         22: c = "MQXR_CLWL_MOVE"; break;
   case         23: c = "MQXR_CLWL_REPOS"; break;
   case         24: c = "MQXR_CLWL_REPOS_MOVE"; break;
   case         25: c = "MQXR_END_BATCH"; break;
   case         26: c = "MQXR_ACK_RECEIVED"; break;
   case         27: c = "MQXR_AUTO_SVRCONN"; break;
   case         28: c = "MQXR_AUTO_CLUSRCVR"; break;
   case         29: c = "MQXR_SEC_PARMS"; break;
   case         30: c = "MQXR_PUBLICATION"; break;
   case         31: c = "MQXR_PRECONNECT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQXT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          1: c = "MQXT_API_CROSSING_EXIT"; break;
   case          2: c = "MQXT_API_EXIT"; break;
   case         11: c = "MQXT_CHANNEL_SEC_EXIT"; break;
   case         12: c = "MQXT_CHANNEL_MSG_EXIT"; break;
   case         13: c = "MQXT_CHANNEL_SEND_EXIT"; break;
   case         14: c = "MQXT_CHANNEL_RCV_EXIT"; break;
   case         15: c = "MQXT_CHANNEL_MSG_RETRY_EXIT"; break;
   case         16: c = "MQXT_CHANNEL_AUTO_DEF_EXIT"; break;
   case         20: c = "MQXT_CLUSTER_WORKLOAD_EXIT"; break;
   case         21: c = "MQXT_PUBSUB_ROUTING_EXIT"; break;
   case         22: c = "MQXT_PUBLISH_EXIT"; break;
   case         23: c = "MQXT_PRECONNECT_EXIT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQZAET_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQZAET_NONE"; break;
   case          1: c = "MQZAET_PRINCIPAL"; break;
   case          2: c = "MQZAET_GROUP"; break;
   case          3: c = "MQZAET_UNKNOWN"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQZAO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQZAO_NONE"; break;
   case          1: c = "MQZAO_CONNECT"; break;
   case          2: c = "MQZAO_BROWSE"; break;
   case          4: c = "MQZAO_INPUT"; break;
   case          8: c = "MQZAO_OUTPUT"; break;
   case         16: c = "MQZAO_INQUIRE"; break;
   case         32: c = "MQZAO_SET"; break;
   case         64: c = "MQZAO_PASS_IDENTITY_CONTEXT"; break;
   case        128: c = "MQZAO_PASS_ALL_CONTEXT"; break;
   case        256: c = "MQZAO_SET_IDENTITY_CONTEXT"; break;
   case        512: c = "MQZAO_SET_ALL_CONTEXT"; break;
   case       1024: c = "MQZAO_ALTERNATE_USER_AUTHORITY"; break;
   case       2048: c = "MQZAO_PUBLISH"; break;
   case       4096: c = "MQZAO_SUBSCRIBE"; break;
   case       8192: c = "MQZAO_RESUME"; break;
   case      16383: c = "MQZAO_ALL_MQI"; break;
   case      65536: c = "MQZAO_CREATE"; break;
   case     131072: c = "MQZAO_DELETE"; break;
   case     262144: c = "MQZAO_DISPLAY"; break;
   case     524288: c = "MQZAO_CHANGE"; break;
   case    1048576: c = "MQZAO_CLEAR"; break;
   case    2097152: c = "MQZAO_CONTROL"; break;
   case    4194304: c = "MQZAO_CONTROL_EXTENDED"; break;
   case    8388608: c = "MQZAO_AUTHORIZE"; break;
   case   16646144: c = "MQZAO_ALL_ADMIN"; break;
   case   16777216: c = "MQZAO_REMOVE"; break;
   case   33554432: c = "MQZAO_SYSTEM"; break;
   case   50216959: c = "MQZAO_ALL"; break;
   case   67108864: c = "MQZAO_CREATE_ONLY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQZAT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQZAT_INITIAL_CONTEXT"; break;
   case          1: c = "MQZAT_CHANGE_CONTEXT"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQZCI_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQZCI_CONTINUE"; break;
   case          1: c = "MQZCI_STOP"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQZIO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQZIO_PRIMARY"; break;
   case          1: c = "MQZIO_SECONDARY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQZSE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQZSE_CONTINUE"; break;
   case          1: c = "MQZSE_START"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQZSL_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQZSL_NOT_RETURNED"; break;
   case          1: c = "MQZSL_RETURNED"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQZTO_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQZTO_PRIMARY"; break;
   case          1: c = "MQZTO_SECONDARY"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQ_CERT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQ_CERT_VAL_POLICY_ANY"; break;
   case          1: c = "MQ_CERT_VAL_POLICY_RFC5280"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQ_MQTT_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case      65536: c = "MQ_MQTT_MAX_KEEP_ALIVE"; break;
   default: c = ""; break;
   }
   return c;
 };

 exports.MQ_SUITE_STR = function (v)
 {
   var c="";
   switch (v)
   {
   case          0: c = "MQ_SUITE_B_NOT_AVAILABLE"; break;
   case          1: c = "MQ_SUITE_B_NONE"; break;
   case          2: c = "MQ_SUITE_B_128_BIT"; break;
   case          4: c = "MQ_SUITE_B_192_BIT"; break;
   default: c = ""; break;
   }
   return c;
 };




 /****************************************************************/
 /*  End of CMQSTRC                                              */
 /****************************************************************/
