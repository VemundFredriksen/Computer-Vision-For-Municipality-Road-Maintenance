from PIL import Image, ImageDraw


og_img_size = [3680, 2760]


base_img_width = 3680
base_img_height = og_img_size[1]/og_img_size[0] * base_img_width

base_img_size = [base_img_width, base_img_height]


# draw.line((0, 0) + im.size, fill=128)
# draw.line((0, im.size[1], im.size[0], 0), fill=128)
# del draw

# write to stdout
# im.save("sup", "PNG")

im = Image.open("Test data/G0011476.JPG")
#im = Image.open("kebab.JPG")


draw = ImageDraw.Draw(im)


def get_bbox(file_name):
    file = open(file_name, "r")
    for line in file:
        arr = line.split()

        ph_width = base_img_size[0]*(float(arr[3])/2)
        ph_height = base_img_size[1]*(float(arr[4])/2)

        ph_pos = [base_img_size[0]*float(arr[1]), base_img_size[1]*float(arr[2])]

        box_start = (ph_pos[0] - ph_width, ph_pos[1] - ph_height)
        box_end = (ph_pos[0] + ph_width, ph_pos[1] + ph_height)

        draw_bbox(box_start, box_end)

        draw.point((ph_pos[0], ph_pos[1]), fill="red")


        print(arr)


def get_bbox_pixel(file_name):
    file = open(file_name, "r")
    for line in file:
        arr = line.split()

        ph_width = int(arr[3])/2
        ph_height = int(arr[4])/2

        ph_pos = [int(arr[1]), int(arr[2])]

        box_start = (ph_pos[0] - ph_width, ph_pos[1] - ph_height)
        box_end = (ph_pos[0] + ph_width, ph_pos[1] + ph_height)

        draw_bbox(box_start, box_end)

        draw.point((ph_pos[0], ph_pos[1]), fill="red")


        print(arr)


def get_bbox_original(file_name):
    file = open(file_name, "r")
    for line in file:
        arr = line.split()

        ph_width = int(arr[3])
        ph_height = int(arr[4])

        ph_pos = [int(arr[1]), int(arr[2])]

        box_start = (ph_pos[0], ph_pos[1])  # (ph_pos[0] - ph_width, ph_pos[1] + ph_height)
        box_end = (ph_pos[0] + ph_width, ph_pos[1] + ph_height)

        draw_bbox(box_start, box_end)

        draw.point((ph_pos[0], ph_pos[1]), fill="red")

        print(arr)


def draw_bbox(box_start, box_end):

    draw.rectangle([box_start, box_end], outline="green", width=2)


get_bbox('output/G0011476.txt')

im.save("sup", "png")

