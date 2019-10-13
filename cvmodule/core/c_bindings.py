from ctypes import *
import os

class BOX(Structure):
    _fields_ = [("x", c_float),
                ("y", c_float),
                ("w", c_float),
                ("h", c_float)]

class DETECTION(Structure):
    _fields_ = [("bbox", BOX),
                ("classes", c_int),
                ("prob", POINTER(c_float)),
                ("mask", POINTER(c_float)),
                ("objectness", c_float),
                ("sort_class", c_int)]

current_path = os.path.dirname(os.path.abspath(__file__))
lib = CDLL(current_path + "/darknet/libdarknet.so", RTLD_GLOBAL)

# ======== Loads the neural net into GPU Memory ======== #
load_net = lib.load_network
load_net.argtypes = [c_char_p, c_char_p, c_int]
load_net.restype = c_void_p

# ======== Fetches the GPU index ======== #
fetch_gpus = lib.fetch_gpus
fetch_gpus.argtypes = []
fetch_gpus.restype = POINTER(c_int)

# ======== Envokes the training function in darknet core code ======== #
train = lib.custom_train
train.argtypes = [c_char_p, c_char_p, c_int, POINTER(c_int), c_int, c_int, c_int, c_int]
train.restype = c_float

# ======== Makes a detection of given image ======== #
predict = lib.predict
predict.argtypes = [c_char_p, c_char_p, c_int, c_char_p, c_float, c_float, c_char_p, c_int]
predict.restype = POINTER(DETECTION)

