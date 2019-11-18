from pyftpdlib.handlers import FTPHandler
import threading
import subprocess
import shutil
import glob
import os
import math
from datetime import datetime
from Client import *


def start_progress(title):
    print(title + "[" + '-'*40 + "]" + chr(8)*41, flush=True, end='')


def update_progress(progress, prev_num_squares):
    new_num_squares = math.floor((progress/100)*40)
    squares_to_add = new_num_squares - prev_num_squares
    print('#'*squares_to_add, flush=True, end='')
    return new_num_squares

def finish_progress(prev_num_squares):
    squares_to_add = math.floor(40 - prev_num_squares)
    print('#'*squares_to_add + "]", flush=True)


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
        #print("Starting analysis with args: " + str(cmd_args))
        result = subprocess.run(cmd_args)
        
        json_files_to_upload = glob.glob(path_to_save_dir + "/*.meta")
        
        image_files_to_upload = glob.glob(path_to_save_dir + "/*.jpg")


        #print("These are the JSON files i will be uploading %s" % (json_files_to_upload))

        #print("These are the image files i will be uploading %s" % (image_files_to_upload))

        temp_filename = "temp_meta_file{}".format(now)
        #print("Creating a temporary file to store the combined metadata %s" % temp_filename)
        temp_file = open(temp_filename, "w+")
        metaString = "["
        for path in json_files_to_upload:
            with open(path, "r") as file:
                metaString +=  file.read()
        metaString = metaString[:-1] #remove trailing comma
        metaString += "]"
        temp_file.write(metaString)
        temp_file.close()  
        print("Uploading metadata...")
        print("Done.")  
        upload_data(temp_filename)
        print("Uploading images...")
        start_progress("")
        counter = 0
        pns = 0
        for path in image_files_to_upload:
            upload_image(path)
            counter += 1
            pns = update_progress(counter/len(image_files_to_upload)*100, pns)
        finish_progress(pns)

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

