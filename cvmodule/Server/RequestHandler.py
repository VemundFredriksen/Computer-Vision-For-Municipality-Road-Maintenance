from pyftpdlib.handlers import FTPHandler

class RequestHandler(FTPHandler):

	def set_on_file_received_callback(callback):
		self.on_file_received_callback = callback

    def on_connect(self):
        print("%s:%s connected" % (self.remote_ip, self.remote_port))

    def on_file_received(self, file):
        print("Received file %s" % file)
        if self.on_file_received_callback:
        	self.on_file_received_callback(file)
