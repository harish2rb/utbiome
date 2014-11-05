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

# splitting the Taxon column into K - P - C - O - F - G
# Assuming no species is identified in the QIIME input data
# variable to get You can change the below to get whatever column you want to get
varValue <- qiimedata$Downstream.5pm

krondataframe <- data.frame(value=NA,Kingdom=NA,Phylum=NA,Class=NA,Order=NA,
                             Family=NA,Genus=NA)
for (i in 1:nrow(qiimedata)){
  splittedTaxon <- unlist(strsplit(qiimedata$Taxon[i],"[;]"))
  #print(splittedTaxon)
  krondataframe <- rbind(krondataframe,c(varValue[i],
                                           splittedTaxon[1],splittedTaxon[2],
                                           splittedTaxon[3],splittedTaxon[4],
                                           splittedTaxon[5],splittedTaxon[6]))
  
}
krondataframe <- na.omit(krondataframe)
# write the data.frame to a text file
write.table(krondataframe, file = "C:\\software\\utbiomeRcode\\krondataframe.txt",
            sep="\t",quote=FALSE, row.names = FALSE,col.names=FALSE)

# Getting rid of zero value rows
zerovaluerows <- krondataframe$value !=0
krondataframeSanszero <- krondataframe[zerovaluerows,]

# Also if any of the K,P,C,O,F,G is empty that is only e.g., k_ then put space there
selectedRowsKingdom <- krondataframeSanszero[grep("?k__[a-zA-Z0-9]", krondataframeSanszero$Kingdom), ]
selectedRowsphylum <- selectedRowsKingdom[grep("?p__[a-zA-Z0-9]+", selectedRowsKingdom$Phylum), ]
selectedRowsclass <- selectedRowsphylum[grep("?c__[a-zA-Z0-9]+", selectedRowsphylum$Class), ]
selectedRowsorder <- selectedRowsclass[grep("?o__[a-zA-Z0-9]+", selectedRowsclass$Order), ]
selectedRowsfamily <- selectedRowsorder[grep("?f__[a-zA-Z0-9]+", selectedRowsorder$Family), ]
selectedRowsgenus <- selectedRowsfamily[grep("?g__[a-zA-Z0-9]+", selectedRowsfamily$Genus), ]


#write the data.frame to a text file (only non zero rows)
write.table(krondataframeSanszero, file = "C:\\software\\utbiomeRcode\\krondataframeSanszero.txt",
            sep="\t",quote=FALSE, row.names = FALSE,col.names=FALSE)









