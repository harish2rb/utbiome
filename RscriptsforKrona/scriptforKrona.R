#AUTHOR -- HARISH SANGIREDDY
#DATE -- 11/4/2014
#CITY -- AUSTIN
#THE UNIVERSITY OF TEXAS AT AUSTIN
# Preparing files for krona to make cool charts
# read input data from QIIME and prepare output for krona pie charts

rm(list = ls())

# qiimeinput file name
qiimeinfile <- 'C:\\software\\utbiomeRcode\\otu_table_w_tax_rarefied7900_L6.txt'
kronaoutfilePath <- 'C:\\software\\utbiomeRcode\\kronaoutfile\\'

qiimedata <- read.delim(qiimeinfile, header = TRUE, sep = "\t",stringsAsFactors=FALSE,
                        fill=TRUE)

qiimecolnames <- colnames(qiimedata)
qiimecolnames

# splitting the Taxon column into K - P - C - O - F - G
# Assuming no species is identified in the QIIME input data
# variable to get You can change the below to get whatever column you want to get
#filenametoWrite <- "Downstream_5pm.txt"
#varValue <- qiimedata$Downstream.5pm

for (j in 2:ncol(qiimedata)){
  # The first column is the Taxon column and we don't make a file for it
  # We have to make a file for each column name
  filenametoWrite <- paste0(qiimecolnames[j],".txt")
  varValue <- qiimedata[j]
  
  krondataframe <- data.frame(value=NA,Kingdom=NA,Phylum=NA,Class=NA,Order=NA,
                              Family=NA,Genus=NA)
  for (i in 1:nrow(qiimedata)){
    splittedTaxon <- unlist(strsplit(qiimedata$Taxon[i],"[;]"))
    #print(splittedTaxon)
    #print (varValue[i,])
    krondataframe <- rbind(krondataframe,c(varValue[i,],
                                           splittedTaxon[1],splittedTaxon[2],
                                           splittedTaxon[3],splittedTaxon[4],
                                           splittedTaxon[5],splittedTaxon[6]))
    
  }
  krondataframe <- na.omit(krondataframe)
  # write the data.frame to a text file
  #write.table(krondataframe, file = "C:\\software\\utbiomeRcode\\krondataframe.txt",
  #            sep="\t",quote=FALSE, row.names = FALSE,col.names=FALSE)
  
  # Getting rid of zero value rows
  zerovaluerows <- krondataframe$value !=0
  krondataframeSanszero <- krondataframe[zerovaluerows,]
  
  # Also if any of the K,P,C,O,F,G is empty that is only e.g., k_ or other then put space there
  krondataframeSanszero$Phylum[agrep("Other",
                                     krondataframeSanszero$Phylum)] <- " "
  krondataframeSanszero$Class[agrep("Other",
                                    krondataframeSanszero$Class)] <- " "
  krondataframeSanszero$Order[agrep("Other",
                                    krondataframeSanszero$Order)] <- " "
  krondataframeSanszero$Family[agrep("Other",
                                     krondataframeSanszero$Family)] <- " "
  krondataframeSanszero$Genus[agrep("Other",
                                    krondataframeSanszero$Genus)] <- " "
  
  krondataframeSanszero$Phylum[agrep("^\\+p__$",
                                     krondataframeSanszero$Phylum,fixed=FALSE)] <- " "
  krondataframeSanszero$Class[agrep("^\\+c__$",
                                    krondataframeSanszero$Class,fixed=FALSE)] <- " "
  krondataframeSanszero$Order[agrep("^\\+o__$",
                                    krondataframeSanszero$Order,fixed=FALSE)] <- " "
  krondataframeSanszero$Family[agrep("^\\+f__$",
                                     krondataframeSanszero$Family,fixed=FALSE)] <- " "
  krondataframeSanszero$Genus[agrep("^\\+g__$",
                                    krondataframeSanszero$Genus,fixed=FALSE)] <- " "
  #write the data.frame to a text file (only non zero rows)
  print (paste0("Writing file",filenametoWrite))
  write.table(krondataframeSanszero, file = paste0(kronaoutfilePath,filenametoWrite),
              sep="\t",quote=FALSE, row.names = FALSE,col.names=FALSE)
  
}