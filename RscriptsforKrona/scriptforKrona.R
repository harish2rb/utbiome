#AUTHOR -- HARISH SANGIREDDY
#DATE -- 11/4/2014
#CITY -- AUSTIN
#THE UNIVERSITY OF TEXAS AT AUSTIN
# Preparing files for krona to make cool charts
# read input data from QIIME and prepare output for krona pie charts

rm(list = ls())

# qiimeinput file name
qiimeinfile <- 'C:\\software\\utbiomeRcode\\otu_table_w_tax_rarefied7900_L6.txt'

qiimedata <- read.delim(qiimeinfile, header = TRUE, sep = "\t",stringsAsFactors=FALSE,
                        fill=TRUE)

qiimecolnames <- colnames(qiimedata)
qiimecolnames

# splitting the Taxon column into K - P - C - O - F - G - S 
# Downstream.5pm
# variable to get
varValue <- qiimedata$Downstream.5pm

krondataframe <- data.frame(value=NA,Kingdom=NA,Phylum=NA,Class=NA,Order=NA,
                             Family=NA,Genus=NA,Species=NA)
for (i in 1:nrow(qiimedata)){
  splittedTaxon <- unlist(strsplit(qiimedata$Taxon[i],"[;]"))
  #print(splittedTaxon)
  krondataframe <- rbind(krondataframe,c(varValue[i],
                                           splittedTaxon[1],splittedTaxon[2],
                                           splittedTaxon[3],splittedTaxon[4],
                                           splittedTaxon[5],splittedTaxon[6],
                                           splittedTaxon[7]))
  
}

# write the data.frame to a text file











