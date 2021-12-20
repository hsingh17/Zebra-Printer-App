import socket
import requests

def make_template(upc, name, price): 
	template = f""" 
	^XA
	~TA000
	~JSN
	^LT0
	^MNW
	^MTT
	^PON
	^PMN
	^LH0,0
	^JMA
	^PR8,8
	~SD15
	^JUS
	^LRN
	^CI27
	^PA0,1,1,0
	^XZ
	^XA
	^MMT
	^PW406
	^LL203
	^LS0
	^BY3,2,51^FT64,60^BUN,,Y,N,Y
	^FH\^FD{upc}^FS
	^FT9,133^A0N,37,38^FH\^CI28^FD{name}^FS^CI27
	^FPH,1^FT238,187^A0N,45,46^FB150,1,12,C^FH\^CI28^FD${price}^FS^CI27
	^PQ1,0,1,Y
	^XZ
	"""
	return template

# Make a GET request to server to get pending labels
res = requests.get('http://localhost:3000/label')
json_labels = res.json()

# https://www.zebra.com/us/en/support-downloads/knowledge-articles/ait/Network-Printing-Python-Example.html
skt = socket.socket(socket.AF_INET,socket.SOCK_STREAM)         
host = "192.168.1.143" 
port = 9100 # Network printer port

try:
	skt.connect((host, port)) # Connecting to host
	for label in json_labels:
		template = make_template(label['product-upc'], label['product-name'], label['product-price'])
		skt.send(bytes(template, 'utf-8'))	# Send bytes
	skt.close() # Close connection
except:
	print("Error with the connection")