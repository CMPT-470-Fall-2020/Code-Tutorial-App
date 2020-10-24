#!/usr/bin/python3
import socket
import json
import sys

# create a socket object
SOCKET = socket.socket(
    socket.AF_INET, socket.SOCK_STREAM)

# get local machine name
HOSTNAME = '127.0.0.1'
PORTNUM = 8003
# bind to the port
SOCKET.bind((HOSTNAME, PORTNUM))

# queue up to 5 requests
SOCKET.listen(5)


orig_out = sys.stdout
orig_err = sys.stderr
while True:
    f1 = open("stdout", "w")
    f2 = open("stderr", "w")
    sys.stdout = f1
    sys.stderr = f2
    # establish a connection
    clientsocket, addr = SOCKET.accept()
    command = clientsocket.recv(8096).decode('utf-8')
    command = json.loads(command)

    if command['type'] == "RUN":
        exec(command['code'])
        sys.stdout = orig_out
        sys.stderr = orig_err
        f1.close()
        f2.close()
        print(json.dumps({"stdout": open("stdout", 'r').read(), "stderr": open('stderr', 'r').read()}))
        clientsocket.send(b'RESPONSE!')

    elif command['type'] == "KILL":
        sys.exit()

    #clientsocket.close()


