from PIL import Image

basewidth = 2000
img = Image.open('Test data/G0011476.JPG')
wpercent = (basewidth/float(img.size[0]))
hsize = int((float(img.size[1])*float(wpercent)))

img = img.resize((basewidth, hsize), Image.ANTIALIAS)
img.save('kebab.jpg')