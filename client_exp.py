import socket
import time
import serial

i = 0
ser = serial.Serial("/dev/ttyUSB0", 115200)
s = socket.socket()
host = "34.251.131.77"
port = 12344
s.connect((host, port))

while True:
    i = i +1
    f='%s number %i' %(ser.readline(), i)
    f = f.encode('utf-8')
    s.send(f) 
s.close()                # Close the connection
