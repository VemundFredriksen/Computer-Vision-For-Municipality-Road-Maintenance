import os


f = open("simpleTestFullSizeAllPotholesSortedFullAnnotation.txt", "r")

# The output folder name or path
path = "output"

# Class name
class_name = "1"

try:
    os.mkdir(path)
except OSError:
    pass
else:
    pass


for x in f:
    # Splitting up each line into an array
    x = x.strip().split()

    img_path = x[0] + " " + x[1]

    # Create a new file with the [img_name].txt
    img_name = x[1][5:13] + ".txt"
    file = open(path + "/" + img_name, "w")

    # Get the amount of classes in the img
    x = x[2:]
    amount_of_classes = int(x[0])

    # iterate over each class in the img and get and print the bounding boxes in the .txt file
    for i in range(0, amount_of_classes*4, 4):
        box_x = x[i + 1]
        box_y = x[i + 2]
        box_width = x[i + 3]
        box_height = x[i + 4]

        file.write(class_name + " " + box_x + " " + box_y + " " + box_width + " " + box_height + "\n")

    file.close()


f.close()

print("The output files are found in the /" + path + " folder")









