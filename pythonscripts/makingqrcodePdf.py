# This makes the qrcode pdf from the QRCODEs images
import time
import os
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import letter
import reportlab.platypus as rptplt
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import Image

# Change this as per the location and filename you want
pdffileName = "C:\MyStuff\UTLiftProject\qrcodeLetter.pdf"

# based on the number of groups we would decide how many qrcodes we want
# usually an 8 number of qrcodes per each group is required and this 
# optimizes the printing options on the sticker paper
numberofQrcodesPergroup = 8

doc = SimpleDocTemplate(pdffileName,pagesize=letter,
                        rightMargin=72,leftMargin=72,
                        topMargin=72,bottomMargin=18)
                        
# create the empty document object
Story=[]

figcnt = 0
qrcodeimagepath = "C:\\MyStuff\UTLiftProject\\FORMSQRCODE19NOV\\testPdf"
for f in os.listdir(qrcodeimagepath):
    print f
    figcnt = figcnt+1
    new_im = Image.new('RGB', (1050,400))
    qr_file = qrcodeimagepath +'\\'+ f
    im = Image.open(qr_file)
    #Here I resize my opened image, so it is no bigger than 100,100
    #im.thumbnail((210,198))
    #Iterate through a 4 by 4 grid with spacing, to place my image
    for i in xrange(0,1050,210):
        for j in xrange(0,400,198):
            #paste the image at location i,j:
            new_im.paste(im, (i,j))
    new_im.show()
    new_im.save("C:\\MyStuff\\UTLiftProject\\FORMSQRCODE19NOV\\tempSaveFolder\\new_imout"+str(figcnt)+".png","png")

# Now lets collect the stitched QRCode Images and append to the story doc and make the pdf
stitchedQrcodesPath = "C:\\MyStuff\\UTLiftProject\\FORMSQRCODE19NOV\\tempSaveFolder"
for qr in os.listdir(stitchedQrcodesPath):
    print qr
    qrImage = stitchedQrcodesPath+'\\'+qr
    imAppend = rptplt.Image(qrImage,6*inch,3*inch)
    Story.append(imAppend)
    Story.append(Spacer(1, 2))
    
        
doc.build(Story)
