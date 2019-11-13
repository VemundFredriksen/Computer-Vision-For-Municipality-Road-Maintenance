import os

from pyftpdlib.authorizers import DummyAuthorizer
from RequestHandler import RequestHandler
from pyftpdlib.servers import FTPServer


def read_config():
	dir_path = ""
	ip = ""
	if os.path.isfile("./config.txt"):
		f = open("./config.txt")
		libdarknet_path = f.readline().strip().split('=')[1]
		dir_path = f.readline().strip().split('=')[1]
	else:
		dir_path = os.path.abspath(__file__[:-10])
		print("No config.txt found, you need to make a config.txt file here %s, the file should contain the full path to libdarknet.so, the dir for the ftp server to use and the ip for ftp server, each on a seperate line" % (os.getcwd()))
	print("dir_path is %s" % dir_path)
	return (dir_path, '')

def main():
	(dir_path, ip) = read_config()
	print(dir_path)
	authorizer = DummyAuthorizer()
	authorizer.add_user("user", "12345", dir_path, perm="elradfmwMT")
	authorizer.add_anonymous(dir_path)

	handler = RequestHandler
	handler.authorizer = authorizer
#	handler.masquerade_address = '84.210.211.15'
	handler.passive_ports = range(60000, 60005)
   
	server = FTPServer(('', 21), handler)
	server.serve_forever()

if __name__ == "__main__":
	main()
