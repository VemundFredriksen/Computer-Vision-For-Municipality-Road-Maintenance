import sys
import ntpath
import os
from ftplib import FTP

def upload_video(file_path):

	if os.path.isfile("./config.txt"):
		f = open("./config.txt")
		ip = f.readline().strip()
	else:
		print("No config.txt found, you need to make a config.txt file here %s, the file should contain the ip of your cvmodule/Server ftp server" % (os.getcwd()))
		ip = "127.0.0.1"

	ftp = FTP(ip, "user", "12345")

	print("Sending file: %s to server." % file_path)
	with open(file_path, "rb") as file:
		ftp.storbinary("STOR %s" % ntpath.basename(file_path), file)
	print("Done sending.")
	ftp.quit()

upload_video(sys.argv[1])

