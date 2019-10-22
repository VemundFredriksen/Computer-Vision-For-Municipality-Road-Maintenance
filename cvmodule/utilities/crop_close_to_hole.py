import glob

from PIL import Image, ImageDraw
import argparse
import os

if __name__ == '__main__':

    input_folder = 'Test Data'
    output_folder = "output"
    class_name = "0"

    bo_draw_bbox = True
    margin = 100

    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--input_folder", dest='input_folder', type=str, default=input_folder, help="input folder path")
    parser.add_argument("-o", "--output_folder", dest='output_folder', type=str, default=output_folder, help="output folder path")
    parser.add_argument("-c", "--class", dest='class_name', type=str, default=class_name, help="class name")

    parser.add_argument("-d", "--draw", dest='bo_draw_bbox', type=bool, default=bo_draw_bbox, help="Draw bbox")
    parser.add_argument("-m", "--margin", dest='margin', type=bool, default=margin, help="The margin around the box in px")

    arg = parser.parse_args()

    input_folder = arg.input_folder
    output_folder = arg.output_folder
    class_name = arg.class_name

    bo_draw_bbox = arg.bo_draw_bbox
    margin = arg.margin


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
            old_img = Image.open(filename[:19] + "JPG") # <- change this to "jpg" for your dataset

            new_img_path = output_folder + filename[9:-3] + "png"

            crop_dat_img(old_img, old_txt, filename, new_img_path)

            print(new_img_path)
            old_txt.close()
            old_img.close()


    def crop_dat_img(img, txt, filename, new_img_path):
        width, height = img.size

        def convert_to_relative(x, y, w, h, i_, c):
            x = x/i_.size[0]
            y = y/i_.size[1]
            w = w/i_.size[0]
            h = h/i_.size[1]

            if x < 0 or y < 0:
                pass
            else:
                new_txt = open(output_folder + filename[9:-4] + "_" + str(c) + ".txt", "w")

                new_txt.write(class_name + " " + str(x) + " " + str(y) + " " + str(w) + " " + str(h) + "\n")
                new_txt.close()

        count = 0
        for line in txt:
            arr = line.split()
            count += 1

            # Calculating real px coordinates from relative coordinates
            relative_x = arr[1]
            relative_y = arr[2]
            relative_width = arr[3]
            relative_height = arr[4]

            bbox_x = width * float(relative_x)
            bbox_y = height * float(relative_y)

            bbox_width = width * float(relative_width)
            bbox_height = height * float(relative_height)

            bbox_start = (bbox_x - (bbox_width / 2), bbox_y - (bbox_height / 2))
            bbox_end = (bbox_x + (bbox_width / 2), bbox_y + (bbox_height / 2))


            # Crop img based on the bbox and the marg
            left = bbox_start[0] - margin
            top = bbox_start[1] - margin
            right = bbox_end[0] + margin
            bottom = bbox_end[1] + margin

            img_i = img.crop((left, top, right, bottom))

            # Calculate the new position, with and height for the bboxes on the new cropped img
            w_1 = img_i.size[0] - margin * 2
            h_1 = img_i.size[1] - margin * 2

            x_1 = margin + w_1/2
            y_1 = margin + h_1/2

            # Convert those new px values to realtive position and width/height
            convert_to_relative(x_1, y_1, w_1, h_1, img_i, count)

            # If we want we can draw the bbox on the img (Only recomended for debugging)
            if bo_draw_bbox:
                bbox_start = (x_1 - (w_1 / 2), y_1 - (h_1 / 2))
                bbox_end = (x_1 + (w_1 / 2), y_1 + (h_1 / 2))

                draw = ImageDraw.Draw(img_i)
                draw.point([bbox_x, bbox_y], fill="red")
                draw.rectangle([bbox_start, bbox_end], outline="green", width=2)

            #img.show()
            img_i.save(new_img_path[:-4] + "_" + str(count) + ".png", 'PNG')


    main()


