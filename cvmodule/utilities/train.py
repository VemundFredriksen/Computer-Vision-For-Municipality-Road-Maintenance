# Imports

import argparse
from os import path

#Validate and store

#Train

#Load Net

# PreProcessing

def file_exists(file):
    return path.exists(file)

def validate_data_file(file, ignore_missing_validation=False):
    f = open(file, "r")
    lines = f.readlines()
    f.close()
    if(not str(lines[0].split('=')[1].replace("\n", "").strip()).isdigit()):
        print("Data file is corrupted, please specify classes at line 1 'classes = {int}'")
        return False
    if(not file_exists(lines[1].split('=')[1].replace("\n", "").strip())):
       print("Path to training data is invalid, check line 2 in data file")
       return False
    if(not file_exists(lines[3].split('=')[1].replace("\n", "").strip())):
        print("Path to names file is invalid, check line 4 in data file")
        return False

    names = open(lines[3].split('=')[1].replace("\n", "").strip())
    n_names = len(names.readlines())
    names.close()
    if(not n_names == int(lines[0].split('=')[1].replace("\n", "").strip())):
        print("Number of names in names file does not correspond to specified number of classes in .data file")
        return False
    if(not file_exists(lines[2].split('=')[1].replace("\n", "").strip())):
        if(not ignore_missing_validation):
            inp = input("Path to validation data is invalid, do you want to continue? [y/n]\n")
            while(not inp.lower() == 'y' and not inp.lower() == 'n'):
               inp = input("Path to validation data is invalid, do you want to continue? [y/n]\n")
            if(inp.lower() == 'n'):
               return False

    return True

def pre_process(cfg, weights, train_txt, ignore_validation_txt):

    '''Check Files existence '''
    if(not file_exists(cfg)):
        print("'{}' not found".format(cfg))
        return False
    elif(not file_exists(weights)):
        print("'{}' not found".format(weights))
        return False
    elif(not file_exists(train_txt)):
        print("'{}' not found".format(train_txt))
        return False

    validate_data_file(train_txt, ignore_validation_txt)

# Main

def main(cfg, weights, train_txt, ignore_validation_txt):
    if( not pre_process(cfg, weights, train_txt, ignore_validation_txt)):
        print("Training stopped premature")
        return
    

if(__name__ == "__main__"):
    parser = argparse.ArgumentParser(description='Train specified network on specified data')

    parser.add_argument('-c','--cfg', help='The network configuration file', required=True)
    parser.add_argument('-w','--weights', help='The network weights', required=True)
    parser.add_argument('-t','--train', help='obj.data file that configures the training', required=True)
    parser.add_argument('-v','--igValid', help='Flag to indicate if missing validation file is OK', action="store_true")
    args = vars(parser.parse_args())
    
    main(args["cfg"], args["weights"], args["train"], args["igValid"])
