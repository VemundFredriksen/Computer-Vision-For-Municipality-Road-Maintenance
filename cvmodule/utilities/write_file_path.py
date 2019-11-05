import glob
import os

"""
Outputs a txt file that contains the path of each training image

folder_containing_images/image_name.jpg

"""

# what path should be written infront
file_path = "output/"

# The folder containing the images
input_folder = "output"

# output file name/path
file_name = "my_file"


new_txt = open(file_name + ".txt", "a")
count = 0
for filename in glob.glob(os.path.join(input_folder, '*.jpg')):
    count += 1
    old_txt = open(filename, "r")
    s = filename + "\n"
    print(s)
    new_txt.write(s)

print("\nlines: " + str(count))
new_txt.close()

