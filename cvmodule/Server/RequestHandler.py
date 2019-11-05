from pyftpdlib.handlers import FTPHandler
import threading
import subprocess
import shutil
import glob
from datetime import datetime
from Client import *

class RequestHandler(FTPHandler):

    def start_cv_module(self, file_path):
        now = datetime.now()
        path_to_image_dir = "{}/.analyzis-{}".format(os.getcwd(),now)
        path_to_save_dir = "{}/.result-{}".format(os.getcwd(), now)

        cmd_args = ['python', 
                    '../core/video_analysis.py', 
                    file_path, 
                    path_to_image_dir,
                    path_to_save_dir]
        print("Starting analysis with args: " + str(cmd_args))
        result = subprocess.run(cmd_args, stdout=subprocess.PIPE)
        print(result.stdout.decode("utf-8"))
        shutil.rmtree(path_to_image_dir)

        json_files_to_upload = glob.glob(path_to_save_dir + "/*.meta")
        image_files_to_upload = glob.glob(path_to_save_dir + "/*.jpg")

        for path in json_files_to_upload:
            upload_data(path)
        for path in image_files_to_upload:
            upload_image(path)

        self.add_channel()

    def on_connect(self):
        print("%s:%s connected" % (self.remote_ip, self.remote_port))

    def on_file_received(self, file):
        print("Received file %s" % file)
        self.del_channel() #put handler to sleep so it can't send/receive data
        #start cv module on a different thread
        threading.Thread(target=self.start_cv_module, args=(file,)).start()
