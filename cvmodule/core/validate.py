import c_bindings as cb
from ctypes import *
import argparse
import predict

    #TODO only works for single class atm

def fetch_gtruths(file):
    f = open(file)
    content = f.readlines()
    f.close()
    gtruths = []
    
    for line in content:
        l = line.split()
        box = cb.BOX()
        box.x = float(l[1])
        box.y = float(l[2])
        box.w = float(l[3])
        box.h = float(l[4])
        gtruths.append(box)
   
    return gtruths

def intersect(b1, b2):
    x_overlap = max(0, min(b1.x + b1.w/2, b2.x + b2.w/2) - max(b1.x - b1.w/2, b2.x - b2.w/2))
    y_overlap = max(0, min(b1.y + b1.h/2, b2.y + b2.h/2) - max(b1.y - b1.h/2, b2.y - b2.h/2))
    
    return x_overlap * y_overlap

def union(b1, b2):
    return (b1.w * b1.h) + (b2.w * b2.h) - intersect(b1, b2)

def iou(b1, b2):
    return intersect(b1, b2)/union(b1, b2)

def match_boxes(bboxes, gtruths, iou_thresh):
    matches = []

    for i in range(len(gtruths)):
       maxVal = iou_thresh
       index = -1
       
       for j in range(len(bboxes)):
           iu = iou(bboxes[j], gtruths[i])
           if(iu >= maxVal):
               maxVal = iu
               index = j
       if(index != -1):
          matches.append((bboxes[j], gtruths[i]))

    return matches

def precision_recall(bboxes, gtruths, iou_thresh):
    matches = match_boxes(bboxes, gtruths, iou_thresh)
    
    recall = len(matches)/len(gtruths)
    precision = len(matches)/len(bboxes)
    return (precision, recall)

def validate(bboxes, gtruths, iou_thresh=.3):
    return precision_recall(bboxes, gtruths, iou_thresh)

def log(val_log, precision, recall, training_loss):
    val_file = open(val_log, "a+")
    val_file.write("{" + "\nPrecision : {0},\nRecall : {1}\nTraining_Loss : {2}".format(precision, recall, training_loss) + "}\n")
    val_file.close()
    print("Validated!")

def validate_and_log(cfg, net, images, training_loss, iou_thresh=0.3):
    
    precisions = []
    recalls = []
    
    for im in images:
        print(im)
        preds = predict.predict(cfg, net, im)
        gtruths = fetch_gtruths("./" + im[:-4] + ".txt")
        bbs = []
        for i in range(len(preds)):
           bbs.append(preds[i].bbox)    
        res = validate(bbs, gtruths)
        precisions.append(res[0])
        recalls.append(res[1])
    print(precisions)
    print(sum(precisions)/len(precisions))

    print(recalls)
    print(sum(precisions)/len(precisions))
    log("val_log.txt", sum(precisions)/len(precisions), sum(precisions)/len(precisions), training_loss)

def temp():    
	net = cb.load_net("yolo-potholes-tiny.cfg".encode("UTF-8"), "yolo-potholes-tiny_29000.weights".encode("UTF-8"), 0)

	f = open("./val.txt")
	l = f.readlines()
	f.close()
	ims = []
	for x in l:
	    ims.append(x.strip())

	validate_and_log("yolo-potholes-tiny.cfg".encode("UTF-8"), net, ims)
