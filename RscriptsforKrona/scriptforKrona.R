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
Downstream.5pm <- data.frame(value=NA,Kingdom=NA,Phylum=NA,Class=NA,Order=NA,
                             Family=NA,Genus=NA,Species=NA)
for (i in nrow(qiimedata)){
  splittedTaxon <- unlist(strsplit(qiimedata$Taxon[i],"[;]"))
  
  
}










