import os
import argparse

og_img_size = [3680, 2760]
# name of the textfile to open
txt_file = "simpleTestFullSizeAllPotholesSortedFullAnnotation.txt"

# The output folder name or path
path = "output"

# Class name
class_name = "1"

file_image_path_name = "img_paths"


def convert_to_relative(f, x, y, w, h):
    x = x/og_img_size[0]
    y = y/og_img_size[1]
    w = w/og_img_size[0]
    h = h/og_img_size[1]

    f.write(class_name + " " + str(x) + " " + str(y) + " " + str(w) + " " + str(h) + "\n")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--input", dest='txt_file', type=str, default=txt_file, help="input filename or input path to txt file")
    parser.add_argument("-o", "--output", dest='path', type=str, default=path, help="output path")
    parser.add_argument("-n", "--file_image_path_name", dest='file_image_path_name', type=str, default=file_image_path_name, help="name of the file that contains the image_path")
    parser.add_argument("-c", "--class", dest='class_name', type=str, default=class_name, help="class name")

    arg = parser.parse_args()
    txt_file = arg.txt_file
    path = arg.path
    file_image_path_name = arg.file_image_path_name
    class_name = arg.class_name

    # Open textfile
    f = open(txt_file, "r")

    # Create folder
    try:
        os.mkdir(path)
    except OSError:
        pass
    else:
        pass

    file_img_paths = open(path + "/" + file_image_path_name + ".txt", "w")


    # Iterate through each line
    for x in f:
        # Splitting up each line into an array
        x = x.strip().split()

        # Write the image path
        img_ = x[0] + " " + x[1][:14] + "JPG"
        file_img_paths.write(img_ + "\n")

        # Create a new file with the [img_name].txt
        img_name = x[1][5:13] + ".txt"
        file = open(path + "/" + img_name, "w")

        # Get the amount of classes in the img
        x = x[2:]
        amount_of_classes = int(x[0])

        # iterate over each class in the img and get and print the bounding boxes in the .txt file
        for i in range(0, amount_of_classes*4, 4):
            box_width = int(x[i + 3])
            box_height = int(x[i + 4])

            box_x = int(x[i + 1]) + int(int(box_width)/2)
            box_y = int(x[i + 2]) + int(int(box_height)/2)

            convert_to_relative(file, box_x, box_y, box_width, box_height)

        file.close()

    f.close()
    file_img_paths.close()

    print("SUCCESS - The output files are found in the /" + path + " folder")
