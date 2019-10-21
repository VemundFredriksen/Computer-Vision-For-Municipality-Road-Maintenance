from 

CFG = "tiny-yolo.cfg"
WEIGHTS = "tiny-yolo_29000.weights"


def analyze(image):
    #net = cb.load_net(CFG, WEIGHTS, 0)
    #prediction = predict.predict(CFG, net, image)
    prediction = [2, 3]
    f = open("prediction.meta", "w+")
    log = "[\n"
    for p in prediction:
        log += "{\n\"objecttype\": \"pothole\"\n"
        log += "\"priority\" : 5\n"
        log += "},\n"
    log = log[:-2] + "\n]"
    f.write(log)
    f.close()
    
analyze("arne")

