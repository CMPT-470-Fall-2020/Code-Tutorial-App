#!/usr/bin/python3
# a global namespace for the exec function. It is a copy
# of the default namespace of every interpreter.
# It is created here first so the globals are not tainted
# by the imports which follow this.
import builtins
execGlobals = {'__annotations__': {},
 '__builtins__': builtins,
 '__cached__': None,
 '__doc__': None,
 '__file__': 'subinstance.py',
 '__loader__': globals()['__loader__'],
 '__name__': '__main__',
 '__package__': None,
 '__spec__': None}

import socket
import json
import sys
import io
import contextlib

# create a socket object
SOCKET = socket.socket(
    socket.AF_INET, socket.SOCK_STREAM)

# get local machine name
HOSTNAME = '127.0.0.1'
PORTNUM = int(sys.argv[1])
# bind to the port
SOCKET.bind((HOSTNAME, PORTNUM))

# queue up to 5 requests
SOCKET.listen(5)


orig_out = sys.stdout
orig_err = sys.stderr
clientsocket, addr = SOCKET.accept()

while True:
    # establish a connection
    command = clientsocket.recv(8096).decode('utf-8')
    command = json.loads(command)

    if command['type'] == "RUN":
        output = None
        # Redirect STDOUT and STDERR into buffers
        with io.StringIO() as out, io.StringIO() as err, contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
            try:
                exec(command['code'], execGlobals)
            except:
                import traceback
                err.write(traceback.format_exc())

            output = json.dumps({"type": "SUCCESS", "stdout": out.getvalue(), "stderr": err.getvalue()})
        
        clientsocket.send(bytes(output, 'utf-8'))
    elif command['type'] == "KILL":
        clientsocket.close()
        sys.exit()
