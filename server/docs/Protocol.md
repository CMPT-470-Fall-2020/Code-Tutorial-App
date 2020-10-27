Design Overview
===============

-   To execute code sent by the user, we need an environment to run it
    in and this environment must not be able to take down the main
    server in the case of any errors or crashes.
-   To accomplish this, we will use a client-server model where:
    -   The client runs on our main server(within the same process). It
        is used to control communication to the server. Its job is to
        send out code, monitor the health of the server and then take
        care of accepting replies from the server containing the output
        of the code that was just ran. The client will communicate to
        the server via TCP sockets.
    -   The server is a separate process which listens to a TCP socket
        and receieves \"packets\" made up of JSON. Each packet contains
        an instruction. The server then processes the instruction and
        returns a result. There are two types of servers(so far):
        1.  Native: The server is written in the language being
            executed(Example: Python or Ruby). This type of server uses
            the meta-programming features of a language(`exec` for
            Python and `TOPLEVEL_BINDING.eval` for Ruby) to evaluate
            strings of code within a specified environment.
        2.  STDIO Based: This type of server is written in JavaScript.
            An instance(or process if you prefer) of the language is
            started from the JavaScript server. All code to be executed
            is passed via STDIN. STDIO and STDERR are used to collect
            any result of a command.
-   To establish clear communication between the client and server, we
    need a small network protocol. Each member of the protocol is made
    up of JSON with 1 or 2 attributes. Protocol specs can be found
    below.

Network Protocol
================

RUN
---

-   Runs the specified code and returns the result of both stdout and
    stderr whenever execution is completed. This call will be used to
    run code cells since it does not terminate the instance running the
    code(unless there is a fatal error which results in a crash).
-   Has attributes;
    1.  type: \"RUN\"
    2.  code: The code to run

RUNANDKILL
----------

-   Run the specified code and kill the client on completion. Returns
    both stdout and stderr on completion. This call will most likely be
    used in the code playground.
-   Has attributes:
    1.  type: \"RUNANDKILL\"
    2.  code: The code to run

KILL
----

-   Kills the interpreter immediately. If this command is issued while
    the client is waiting for a response from the server, both
    client/server are immediately killed without collecting the original
    response.
-   Has attributes:
    1.  type: \"KILL\"

PING
----

-   Sent periodically by the client to check if the server is
    functioning if there are no messages currently awaiting a response.
    -   Has attributes:
        1.  type: \"PING\"

CONNECTION-OK
-------------

-   A response sent by all language server after a PING request has
    arrived. This indicates that the server is working correctly.
-   Has attributes:
    1.  type: \"CONNECTION-OK\"

CONNECTION-ERROR
----------------

-   A response sent only by the STDIO servers after a PING request has
    arrived or when there is an error. This indicates that the program
    spawned by the server(like bash, zsh, cling...) has unexpectedly
    shut down.
-   Has attributes:
    1.  type: \"CONNECTION-ERROR\"
