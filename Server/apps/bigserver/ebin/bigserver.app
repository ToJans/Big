{application,bigserver,
             [{description,[]},
              {vsn,"0.0.1"},
              {registered,[bigserver_sup]},
              {applications,[kernel,stdlib,crypto,public_key,ssl,cowboy]},
              {mod,{bigserver_app,[]}},
              {env,[]},
              {modules,[bigserver_app,bigserver_sup]}]}.