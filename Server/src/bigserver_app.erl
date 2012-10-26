-module(bigserver_app).

-behaviour(application).

%% Application callbacks
-export([start/2, stop/1]).

%% ===================================================================
%% Application callbacks
%% ===================================================================

start(_StartType, _StartArgs) ->
    Dispatch = [ {'_', [ { [] , toppage_handler, [] } ]}],
    {ok, _} = cowboy:start_http(http,100,[{port,1234}],[{dispatch, Dispatch}]),
    bigserver_sup:start_link().

stop(_State) ->
    ok.
