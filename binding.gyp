{
   'variables' :  {
         'redist_dir': 'redist',
         'redist_windir': 'redist/tools/c/include'
   } ,
  'targets': [
    {
      'target_name': 'ibmmq_native',
      'sources': [ 'src/mqi.cc' , 
                   'src/mqconndisc.cc',
                   'src/mqcsp.cc',
                   'src/mqcd.cc',
                   'src/mqbno.cc',
                   'src/mqsco.cc',
                   'src/mqopenclose.cc',
                   'src/mqsub.cc',
                   'src/mqget.cc',
                   'src/mqsetinq.cc',
                   'src/mqput.cc',
                   'src/mqput1.cc',
                   'src/mqstat.cc',
                   'src/mqtran.cc',
                   'src/mqmho.cc',
                   'src/mqmpo.cc',
                   'src/mqod.cc',
                   'src/mqmd.cc',
                   'src/mqgmo.cc',
                   'src/mqpmo.cc',
                   'src/mqsd.cc',
                   'src/mqsro.cc',
                   'src/mqsts.cc',
                 ],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")" , '.', './src' ],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
    
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions','-Wno-unused-but-set-variable' ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'CLANG_CXX_LIBRARY': 'libc++',
        'MACOSX_DEPLOYMENT_TARGET': '10.7'
      },
      'msvs_settings': {
        'VCCLCompilerTool': { 'ExceptionHandling': 1 },
      },
      'conditions': [
         ['OS=="linux"',  {
              'include_dirs' : [ '/opt/mqm/inc', '<@(redist_dir)/include' ] ,
              'link_settings': { 
                 'XXlibraries'   : ['-lmqm_r'],
                 'ldflags'     : ['-Wl,-rpath,/opt/mqm/lib64 -Wl,-rpath,/usr/lib64 -Wl,-rpath,<@(redist_dir)/lib64 -L/opt/mqm/lib64 -L<@(redist_dir)/lib64' ] 
               },
         },     
         ],
         ['OS=="aix"',  {
              'cc': [ '/opt/freeware/bin/gcc' ],
              'CC': [ '/opt/freeware/bin/gcc' ],
              'cxx': [ '/opt/freeware/bin/gcc' ],
              'include_dirs' : [ '/usr/mqm/inc', '<@(redist_dir)/include' ] ,
         },     
         ],
         ['OS=="win"', {
              'sources': [ 'src/win_dlfcn.cc' ],
            }
         ]

      ],
    }
  ]
}
