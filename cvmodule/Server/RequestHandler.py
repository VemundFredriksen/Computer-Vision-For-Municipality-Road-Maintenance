from pyftpdlib.handlers import FTPHandler
import threading
import subprocess
import shutil
import glob
import os
from datetime import datetime
from Client import *

class RequestHandler(FTPHandler):

    def start_cv_module(self, file_path):
        now = datetime.now()
        path_to_image_dir = "{}/.analyzis-{}".format(os.getcwd(),now)
        os.mkdir(path_to_image_dir)
        path_to_save_dir = "{}/.result-{}".format(os.getcwd(), now)
        os.mkdir(path_to_save_dir)

        cmd_args = ['python3', 
                    '../core/video_analysis.py', 
                    file_path, 
                    path_to_image_dir,
                    path_to_save_dir]
        print("Starting analysis with args: " + str(cmd_args))
        result = subprocess.run(cmd_args, stdout=subprocess.PIPE)
        print(result.stdout.decode("utf-8"))
        
        json_files_to_upload = glob.glob(path_to_save_dir + "/*.meta")
        
        image_files_to_upload = glob.glob(path_to_save_dir + "/*.jpg")


        print("These are the JSON files i will be uploading %s" % (json_files_to_upload))

        print("These are the image files i will be uploading %s" % (image_files_to_upload))

        temp_filename = "temp_meta_file{}".format(now)
        print("Creating a temporary file to store the combined metadata %s" % temp_filename)
        temp_file = open(temp_filename "w+")
        metaString = "["
        for path in json_files_to_upload:
            with open(path, "r") as file:
                metaString +=  file.read()
        metaString = metaString[:-1] #remove trailing comma
        metaString += "]"
        temp_file.write(metaString)
        temp_file.close()    
        upload_data(temp_filename)
        for path in image_files_to_upload:
            upload_image(path)
 
        print("Deleting %s , %s and %s" % (path_to_image_dir, path_to_save_dir, temp_filename))
        shutil.rmtree(path_to_image_dir)
        shutil.rmtree(path_to_save_dir)
        os.remove(temp_filename)
        self.add_channel()

    def on_connect(self):
        print("%s:%s connected" % (self.remote_ip, self.remote_port))

    def on_file_received(self, file):
        print("Received file %s" % file)
        self.del_channel() #put handler to sleep so it can't send/receive data
        #start cv module on a different thread
        threading.Thread(target=self.start_cv_module, args=(file,)).start()

