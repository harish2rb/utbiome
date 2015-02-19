# Author: Harish Sangireddy
# The University of Texas at Austin
# Code written for the UTBIOME project.
# This makes the qrcode from the google spreadsheet
import gspread
import numpy as np
import qrcode
import os
import shutil
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from pylab import *

# Change this as per your folder structure
utbiomelocation = "C:\\MyStuff\\UTLiftProject\\"
print "This is a protected google spreadsheet:"
print "Please enter UT BIOME user name and password"
username = raw_input('user name: ')
pwd = raw_input('password please: ')
# -------------------- NO NEED TO CHANGE ANYTHING BELOW---------------------
# Making and removing old files
defaultLocation = utbiomelocation+"mainfolder"
if os.path.exists(defaultLocation):
    shutil.rmtree(defaultLocation)
    os.mkdir(defaultLocation)
else:
    os.mkdir(defaultLocation)
        
qrcodeimagepath = defaultLocation
savepathepsFiles = utbiomelocation+"EPSFIGURES"
if os.path.exists(savepathepsFiles):
    shutil.rmtree(savepathepsFiles)
    os.mkdir(savepathepsFiles)
else:
    os.mkdir(savepathepsFiles)
savepathpngFiles = utbiomelocation+"PNGFIGURES"
if os.path.exists(savepathpngFiles):
    shutil.rmtree(savepathpngFiles)
    os.mkdir(savepathpngFiles)
else:
    os.mkdir(savepathpngFiles)
googlespreadsheetUrl = "https://docs.google.com/spreadsheet/ccc?key=0AqRKxa4BLGyDdERkcTEzbDc4WG8xNF96ZG92MmZBNGc&usp=drive_web#gid=0"

# Login with your Google account
gc = gspread.login(username, pwd)
# This is where the code will write the QRCODES initially
#defaultLocation = "C:\MyStuff\UTLiftProject\FORMSQRCODE19NOV\TUESDAY19NOV"

# Open a worksheet from spreadsheet with one shot
# This is the google spreadsheet which has the urls and the UniqueIDs
sh = gc.open_by_url(googlespreadsheetUrl)

# Select worksheet by index. Worksheet indexes start from zero
worksheet = sh.get_worksheet(0)

# Get all values from the first column
values_list = worksheet.get_all_values()

#print values_list
#print np.shape(values_list)
shapeOfValues_List = np.shape(values_list)


for i in range(1,shapeOfValues_List[0]):
    qr = qrcode.QRCode(version=1,error_correction=qrcode.constants.ERROR_CORRECT_L,box_size=10)
    qr.add_data(values_list[i][0])
    qr.make(fit=True)
    img = qr.make_image()
    
    # Saving the image file to the default location
    filename = values_list[i][1]#"CE341WC"+ str(i)
    qr_file = os.path.join(defaultLocation,filename + ".jpg")
    img_file = open(qr_file, 'wb')
    img.save(img_file, 'JPEG')
    img_file.close()
    
# Read all the files in the dir where they were written initially and make eps 
# files so that appropriate pdfs can be made and printed
j = 1
for f in os.listdir(qrcodeimagepath):
    print f
    qr_file = qrcodeimagepath +'\\'+ f
    imageqr=mpimg.imread(qr_file)
    fig,ax = plt.subplots()
    #fig.set_size_inches(2.0,2.0) # comment this when making eps files for printing    
    #plt.imshow(imageqr,cmap=plt.cm.gray)
    ftemp = f.split('.')
    #text(40.0, 480.0, ftemp[0],size = 10)
    text(100.0, 460.0, ftemp[0],size = 30)
    plt.axis('off')
    fig.savefig(savepathepsFiles+'\\'+ftemp[0]+"out.eps",bbox_inches='tight')#bbox_inches='tight'
    j = j+1


# Read all the files in the dir where they were written initially and make PNG 
# files so that the QRCODE has the UNIQUE ID added below it and this can be
# used to upload on to the google forms.
# Usually all the png files are uploaded into the biomeut folder and the qrcode
# png is linked within the google forms
#qrcodeimagepath = "C:\MyStuff\UTLiftProject\FORMSQRCODE19NOV\TUESDAY19NOV"
j = 1
for f in os.listdir(qrcodeimagepath):
    print f
    qr_file = qrcodeimagepath +'\\'+ f
    imageqr=mpimg.imread(qr_file)
    fig,ax = plt.subplots()
    fig.set_size_inches(2.0,2.0) # comment this when making eps files for printing    
    plt.imshow(imageqr,cmap=plt.cm.gray)
    ftemp = f.split('.')
    text(40.0, 480.0, ftemp[0],size = 10)
    #text(100.0, 460.0, ftemp[0],size = 30)
    plt.axis('off')
    fig.savefig(savepathpngFiles+'\\'+ftemp[0]+"out.png",bbox_inches='tight')#bbox_inches='tight'
    j = j+1
