import requests
import json

def upload_image(path_to_image):
	files = {"image": open(path_to_image, "rb")}
	requests.post("http://api.dewp.eu.org:4000/upload-image",
		files = files)

def upload_data(path_to_data):
	#JSON = json.loads(open(path_to_data, "r+").read())
	JSON = json.loads(path_to_data)
	requests.post("http://api.dewp.eu.org:4000/insert-data", 
		json=JSON)

