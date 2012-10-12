-module(bigserver_app).

-behaviour(application).
-behaviour(cowboy_http_handler).

%% Application callbacks
-export([start/0,start/2, stop/1]).

%% ===================================================================
%% Application callbacks
%% ===================================================================

start() ->
    application:start(crypto),
    application:start(public_key),
    application:start(ssl),
    application:start(sockjs),
    application:start(cowboy),
    application:start(bigserver).

start(_StartType, _StartArgs) ->
    NumberOfAcceptors = 100,
    Port = 8080,

    SockjsState = sockjs_handler:init_state(<<"/echo">>, fun service_echo/3, state, []),

    VhostRoutes = [
        {
            [<<"echo">>, '...'], 
            sockjs_cowboy_handler, 
            SockjsState
        },
        {'_', ?MODULE, []} % The rest is handled within this module.
    ],
    Routes = [{'_',  VhostRoutes}], % any vhost

    io:format(" [*] Running at http://localhost:~p~n", [Port]),

    Status = cowboy:start_listener(gamerverl_erv_listener, 
        NumberOfAcceptors,
        cowboy_tcp_transport, [{port, Port}],
        cowboy_http_protocol, [{dispatch, Routes}]
    ),

%%    gamerverl_erv_sup:start_link().

    bigserver_sup:start_link().

stop(_State) ->
    ok.

%% ===================================================================
%% Cowboy callbacks
%% ===================================================================

init({_Any, http}, Req, []) ->
    {ok, Req, []}.

handle(Req, State) ->
    {ok, Data} = file:read_file("./echo.html"),
    {ok, Req1} = cowboy_http_req:reply(200, [{<<"Content-Type">>, "text/html"}],
                                       Data, Req),
    {ok, Req1, State}.

terminate(_Req, _State) ->
    ok.

%% ===================================================================
%% SockJS Handlers
%% ===================================================================

service_echo(_Conn, init, state)        -> {ok, state};
service_echo(Conn, {recv, Data}, state) -> Conn:send(Data);
service_echo(_Conn, closed, state)      -> {ok, state}.

