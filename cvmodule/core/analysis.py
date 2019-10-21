import predict
import c_bindings as cb
import sys
import os

CFG = "yolov3-pothole.cfg"
WEIGHTS = "yolov3-pothole_23000.weights"


gps = ["63.413043, 10.386267", "63.410864, 10.383432", "63.412039, 10.377519"]

def analyze(image):
    net = cb.load_net(CFG.encode("UTF-8"), WEIGHTS.encode("UTF-8"), 0)
    prediction = predict.predict(CFG.encode("UTF-8"), net, image)
    predict.draw_prediction_box(image, prediction)
    f = open("prediction.meta", "w+")
    log = "[\n"
    for p in prediction:
        log += "{\n\"objecttype\": \"pothole\","
        log += "\n\"priority\" : 5,"
        log += "\n\"coordinates\": [ {} ],".format(gps[0])
        log += "\n\"status\": \"not fixed\","
        log += "\n\"filename\": \"{}\"".format(image + ".pred")
        log += "},\n"
    log = log[:-2] + "\n]"
    f.write(log)
    f.close()

    return os.getcwd()
    
if(__name__ == "__main__"):
    analyze(sys.argv[1])
