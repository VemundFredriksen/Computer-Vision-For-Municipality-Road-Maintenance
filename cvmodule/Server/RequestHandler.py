from pyftpdlib.handlers import FTPHandler
import threading

class RequestHandler(FTPHandler):

    def start_cv_module(self, file_path):
        from cvDummy import run_cv_dummy
        run_cv_dummy(file_path)
        self.add_channel()

    def on_connect(self):
        print("%s:%s connected" % (self.remote_ip, self.remote_port))

    def on_file_received(self, file):
        print("Received file %s" % file)
        self.del_channel() #put handler to sleep so it can't send/receive data
        #start cv module on a different thread
        threading.Thread(target=self.start_cv_module, args=(file,)).start()
