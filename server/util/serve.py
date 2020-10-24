#!/usr/bin/python3
import socket
import json
import sys

# create a socket object
SOCKET = socket.socket(
    socket.AF_INET, socket.SOCK_STREAM)

# get local machine name
HOSTNAME = '127.0.0.1'
PORTNUM = 8007
# bind to the port
SOCKET.bind((HOSTNAME, PORTNUM))

# queue up to 5 requests
SOCKET.listen(5)


orig_out = sys.stdout
orig_err = sys.stderr
clientsocket, addr = SOCKET.accept()

while True:
    f1 = open("stdout", "w")
    f2 = open("stderr", "w")
    sys.stdout = f1
    sys.stderr = f2
    # establish a connection
    command = clientsocket.recv(8096).decode('utf-8')
    command = json.loads(command)

    if command['type'] == "RUN":
        exec(command['code'])
        sys.stdout = orig_out
        sys.stderr = orig_err
        f1.close()
        f2.close()

        out = open("stdout", 'r')
        err = open('stderr', 'r')
        print(json.dumps({"stdout": out.read(), "stderr": err.read() }))
        out.close()
        err.close()

        clientsocket.send(b'RESPONSE!')

    elif command['type'] == "KILL":
        clientsocket.close()
        sys.exit()



