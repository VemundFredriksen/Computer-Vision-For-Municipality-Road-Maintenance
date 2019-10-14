import sys
import ntpath
from ftplib import FTP

def upload_video(file_path):
	ftp = FTP("127.0.0.1", "user", "12345")

	print("Sending file: %s to server." % file_path)
	with open(file_path, "rb") as file:
		ftp.storbinary("STOR %s" % ntpath.basename(file_path), file)
	print("Done sending.")
	ftp.quit()

upload_video(sys.argv[1])

