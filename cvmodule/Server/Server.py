import os

from pyftpdlib.authorizers import DummyAuthorizer
from RequestHandler import RequestHandler
from pyftpdlib.servers import FTPServer


def read_config():
	dir_path = ""
	ip = ""
	if os.path.isfile("./config.txt"):
		f = open("./config.txt")
		dir_path = f.readline().strip()
		ip = f.readline().strip()
	else:
		dir_path = os.path.abspath(__file__)
		dir_path = "C:\\Users\\oeial030196\\Documents\\GitHub\\Computer-Vision-For-Municipality-Road-Maintenance\\cvmodule\\Server\\"
		ip = "127.0.0.1"
	
	print("ip is %s" % ip)
	print("dir_path is %s" % dir_path)
	return (dir_path, ip)

def main():
	(dir_path, ip) = read_config()

	authorizer = DummyAuthorizer()
	authorizer.add_user("user", "12345", dir_path, perm="elradfmwMT")
	authorizer.add_anonymous(dir_path)

	handler = RequestHandler
	handler.authorizer = authorizer


	server = FTPServer((ip, 21), handler)
	server.serve_forever()

if __name__ == "__main__":
	main()
