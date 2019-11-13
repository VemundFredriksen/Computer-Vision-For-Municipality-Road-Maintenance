import requests
import json

def upload_image(path_to_image):
	files = {"image": open(path_to_image, "rb")}
	requests.post("http://api.dewp.eu.org:4000/upload-image",
		files = files)

def upload_data(path_to_data):
	f = open(path_to_data, "r+")
	print(f.read())
	f.close()
	JSON = json.loads(open(path_to_data, "r+").read())
	requests.post("http://api.dewp.eu.org:4000/insert-objectdata", 
		json=JSON)

