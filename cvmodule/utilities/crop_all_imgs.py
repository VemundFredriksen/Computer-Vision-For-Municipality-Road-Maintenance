import glob

from PIL import Image, ImageDraw
import argparse
import os

if __name__ == '__main__':

    input_folder = 'TestData'
    output_folder = "output_c1"
    class_name = "0"

    bo_draw_bbox = False

    left_factor = 3.6
    right_factor = 1.0
    top_factor = 2.4
    bottom_factor = 1.5

    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--input_folder", dest='input_folder', type=str, default=input_folder, help="input folder path")
    parser.add_argument("-o", "--output_folder", dest='output_folder', type=str, default=output_folder, help="output folder path")
    parser.add_argument("-c", "--class", dest='class_name', type=str, default=class_name, help="class name")

    parser.add_argument("-d", "--draw", dest='bo_draw_bbox', type=bool, default=bo_draw_bbox, help="Draw bbox")

    parser.add_argument("-l", "--left", dest='left_factor', type=str, default=left_factor, help="left_factor, default:" + str(left_factor))
    parser.add_argument("-r", "--right", dest='right_factor', type=str, default=right_factor, help="right_factor, default:" + str(right_factor))
    parser.add_argument("-t", "--top", dest='top_factor', type=str, default=top_factor, help="top_factor, default:" + str(top_factor))
    parser.add_argument("-b", "--bottom", dest='bottom_factor', type=str, default=bottom_factor, help="bottom_factor, default:" + str(bottom_factor))

    arg = parser.parse_args()

    input_folder = arg.input_folder
    output_folder = arg.output_folder
    class_name = arg.class_name

    bo_draw_bbox = arg.bo_draw_bbox

    left_factor = arg.left_factor
    right_factor = arg.right_factor
    top_factor = arg.top_factor
    bottom_factor = arg.bottom_factor

    print("\n{}\n".format(arg))

    # Create folder
    try:
        os.mkdir(output_folder)
    except OSError:
        pass
    else:
        pass


    def main():
        for filename in glob.glob(os.path.join(input_folder, '*.txt')):

            old_txt = open(filename, "r")
            old_img = Image.open(filename[:-3] + "jpg") # <- change this to "jpg" for your dataset

            new_img_path = output_folder + "/" + "c1_" + filename[(len(input_folder) + 1):-4] + ".jpg"

            new_txt = open(new_img_path, "w")

            crop_dat_img(old_img, old_txt, new_img_path)

            print(new_img_path)
            old_txt.close()
            old_img.close()
            new_txt.close()

    # img = Image.open('kebab.jpg')
    # file = open("kebab.txt", "r")
    # f = open("kebab_new.txt", "w")


    def crop_dat_img(img, txt, new_img_path):
        width, height = img.size

        new_txt = open(new_img_path[:-4] + ".txt", "w")

        # Crop img
        left = width / left_factor  # non cropping  -> 0
        top = height / top_factor # non cropping -> 0
        right = width / right_factor # non cropping -> width
        bottom = height / bottom_factor # non cropping -> height

        img = img.crop((left, top, right, bottom))

        def convert_to_relative(x, y, w, h, s):
            x = x/s[0]
            y = y/s[1]
            w = w/s[0]
            h = h/s[1]

            if x < 0 or y < 0:
                pass
            else:
                new_txt.write(class_name + " " + str(x) + " " + str(y) + " " + str(w) + " " + str(h) + "\n")

        # Draw point
        draw = ImageDraw.Draw(img)
        size = img.size

        for line in txt:
            arr = line.split()

            relative_x = arr[1]
            relative_y = arr[2]
            relative_width = arr[3]
            relative_height = arr[4]

            bbox_x = width * float(relative_x) - left
            bbox_y = height * float(relative_y) - top

            bbox_width = width * float(relative_width)
            bbox_height = height * float(relative_height)

            if bo_draw_bbox:
                draw_bbox(bbox_x, bbox_y, bbox_width, bbox_height, draw)

            convert_to_relative(bbox_x, bbox_y, bbox_width, bbox_height, size)

        new_txt.close()
        #img.show()
        img.save(new_img_path[:-4] + ".jpg", 'JPEG')


    def draw_bbox(bbox_x, bbox_y, bbox_width, bbox_height, draw):
        bbox_start = (bbox_x - (bbox_width / 2), bbox_y - (bbox_height / 2))
        bbox_end = (bbox_x + (bbox_width / 2), bbox_y + (bbox_height / 2))

        draw.rectangle([bbox_start, bbox_end], outline="green", width=3)
        draw.point([bbox_x, bbox_y], fill="red")


    main()



