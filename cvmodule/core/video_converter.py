import cv2

def video_to_images(video_path, save_folder_path, interval=0.5):

	vidcap = cv2.VideoCapture(video_path,cv2.CAP_FFMPEG)
	def getFrame(sec):
		vidcap.set(cv2.CAP_PROP_POS_MSEC,sec*1000)
		hasFrames,image = vidcap.read()
		if hasFrames:
			cv2.imwrite(save_folder_path + "/image"+str(count)+".jpg", image)
		return hasFrames
	sec = 0
	frameRate = interval
	count=1
	success = getFrame(sec)
	while success and count < 600:
		count = count + 1
		sec = sec + frameRate
		sec = round(sec, 2)
		success = getFrame(sec)
