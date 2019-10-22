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

        count = 0

        max_left = width
        max_right = 0

        max_top = height
        max_bottom = 0

        # First iteration over all the lines in a txt file finds the crop boundaries
        for l in txt:
            arr = l.split()
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

            if bbox_start[0] < max_left:
                max_left = bbox_start[0]

            if bbox_end[0] > max_right:
                max_right = bbox_end[0]

            if bbox_start[1] < max_top:
                max_top = bbox_start[1]

            if bbox_end[1] > max_bottom:
                max_bottom = bbox_end[1]

        # Crop img based on the bbox and the margin
        if max_left - margin > 0:
            left = max_left - margin
        else:
            left = 0

        if max_top - margin > 0:
            top = max_top - margin
        else:
            top = 0

        if max_right + margin < width:
            right = max_right + margin
        else:
            right = width

        if max_bottom + margin < height:
            bottom = max_bottom + margin
        else:
            bottom = height

        # print(left, top, right, bottom)

        img_i = img.crop((left, top, right, bottom))
        # img_i = img.crop((100, 100, 2000, 2000))

        # Go back to top of the file
        txt.seek(0)
        new_txt = open(output_folder + filename[9:-4] + ".txt", "w")

        # Second iteration over all the lines calculate new bbox coordinates
        for l in txt:
            arr = l.split()
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

            # Calculate the new position, with and height for the bboxes on the new cropped img
            x = bbox_x - left
            y = bbox_y - top

            bbox_start = (x - (bbox_width / 2), y - (bbox_height / 2))
            bbox_end = (x + (bbox_width / 2), y + (bbox_height / 2))

            # Draw boxes (Debugging only)
            if bo_draw_bbox:
                draw = ImageDraw.Draw(img_i)
                draw.point([x, y], fill="red")
                draw.rectangle([bbox_start, bbox_end], outline="green", width=2)

            # Convert to relative coordinates
            x = x / width
            y = y / height
            w = bbox_width / width
            h = bbox_height / height

            # Write to file
            new_txt.write(class_name + " " + str(x) + " " + str(y) + " " + str(w) + " " + str(h) + "\n")

        new_txt.close()
        # img.show()
        img_i.save(new_img_path[:-4] + ".png", 'PNG')


    main()


