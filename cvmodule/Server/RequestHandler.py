from pyftpdlib.handlers import FTPHandler
import threading

class RequestHandler(FTPHandler):

    def start_cv_module(self, file_path):
        #from cvDummy import run_cv_dummy
        #run_cv_dummy(file_path)
        import time
        print("Starting CV...")
        time.sleep(5)
        print("CV done.")
        print("Uploading files.")
        from Client import upload_image, upload_data
        import random
        coorda = str(63.436214 + max(random.random()/100, 0.0005)) + "," + str(10.421526 - max(random.random()/100, 0.0005))
        coordb = str(63.436214 + max(random.random()/100, 0.00075)) + "," + str(10.421526 - max(random.random()/100, 0.00075))
        upload_image(r"C:\Users\oeial030196\Documents\GitHub\Computer-Vision-For-Municipality-Road-Maintenance\cvmodule\Server\image513.jpg")
        upload_image(r"C:\Users\oeial030196\Documents\GitHub\Computer-Vision-For-Municipality-Road-Maintenance\cvmodule\Server\image293.jpg")
        upload_data("""[{\"coordinates\":[""" + coorda + """], 
            \"objecttype\":\"pothole\",
            \"priority\":9,
            \"status\":\"Not fixed\",
            \"filename\":\"image513.jpg\"},
            {\"coordinates\":[""" + coordb + """], 
            \"objecttype\":\"pothole\",
            \"priority\":4,
            \"status\":\"Not fixed\",
            \"filename\":\"image293.jpg\"}
            ]""")
        print("Done uploading.")
        self.add_channel()

    def on_connect(self):
        print("%s:%s connected" % (self.remote_ip, self.remote_port))

    def on_file_received(self, file):
        print("Received file %s" % file)
        self.del_channel() #put handler to sleep so it can't send/receive data
        #start cv module on a different thread
        threading.Thread(target=self.start_cv_module, args=(file,)).start()
