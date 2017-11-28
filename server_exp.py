import socket
from socket import error as SocketError
import errno


s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)         # Create a socket object
host = '0.0.0.0' # Get local machine name
port = 12344              # Reserve a port for your service.
s.bind(('', port))        # Bind to the port

s.listen(5)                 # Now wait for client connection.
print('listening on port 12344')
while True:
   c, addr = s.accept()     # Establish connection with client.
   #print('Got connection from'), addr
   #c.send(b'Thank you for connecting')
      # receive image file
   while True:
      l = c.recv(4096)
      print(l)
f.close()

