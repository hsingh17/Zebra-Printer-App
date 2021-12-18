import socket


# Read in the template
with open('shelf_label_template.prn', 'rb') as f:
    template = f.read()


# https://www.zebra.com/us/en/support-downloads/knowledge-articles/ait/Network-Printing-Python-Example.html
skt = socket.socket(socket.AF_INET,socket.SOCK_STREAM)         
host = "192.168.1.143" 
port = 9100 # Network printer port

try:           
	skt.connect((host, port)) # Connecting to host
	skt.send(template)	# Send bytes
	skt.close () # Close connection
except:
	print("Error with the connection")