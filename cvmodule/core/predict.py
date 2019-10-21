import c_bindings as cb
from ctypes import *
import argparse
from PIL import Image, ImageDraw

def draw_prediction_box(image, preds):
	img = Image.open(image)
	draw = ImageDraw.Draw(img)
	width, height = img.size
	for pred in preds:
		rect = pred.bbox
		draw.rectangle((((rect.x - rect.w/2)*width, (rect.y - rect.h/2)*height), ((rect.x + rect.w/2)*width, (rect.y + rect.h/2)*height)), fill=None, outline=None, width=3)
	img.save(image + ".pred", "JPEG")

def predict(cfg, net, image):
    nboxes = c_int(5)
    pnboxes = pointer(nboxes)
    preds = cb.predict("./obj.data".encode("UTF-8"), "./yolo-potholes-tiny.cfg".encode("UTF-8"), net, image.encode("UTF-8"),0.2, 0.5, "./predict.jpg".encode("UTF-8"), 0, pnboxes)
    
    n = int(sizeof(preds)/4)
    detects = []
    for i in range(n):
        detects.append(preds[i])  
    
#TODO this is dangerous, because other places in the code these preds are used.
    cb.free_detection(preds, pnboxes[0])
    return detects

if(__name__ == "__main__"):
    parser = argparse.ArgumentParser(description='Train specified network on specified data')

    parser.add_argument('-c','--cfg', help='The network configuration file', required=True)
    parser.add_argument('-w','--weights', help='The network weights', required=True)
    args = vars(parser.parse_args())

    net = cb.load_net(args["cfg"].encode("UTF-8"), args["weights"].encode("UTF-8"), 0)
    preds = predict(args["cfg"], net, "./G0011769.jpg")
    print("Found {} objects in image".format(len(preds)))
    for i in range(len(preds)):
        print("{} at ({} , {}, {}, {}) with {}% certanity".format(preds[i].classes, preds[i].bbox.x, preds[i].bbox.y, preds[i].bbox.w, preds[i].bbox.h, round(preds[i].prob[0]*100, 2)))
