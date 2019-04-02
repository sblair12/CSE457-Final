import csv
from pyproj import Proj, transform

inProj = Proj(init='epsg:2204')
outProj = Proj(init='epsg:4326')

types = ["Homicide", "Rape", "Robbery", "Assault", "Burglary", "Larceny", "Auto Theft", "Other Assault", "Arson",
         "Forgery", "Fraud", "Embezzlement", "Stolen Property", "Vandalism", "Weapons", "Prostitution", "Sex Offenses",
         "Drug Abuse", "Gambling", "Neglect", "DUI", "Liquor Related", "Drunkenness", "Disorderly Conduct", "Vagrancy",
         "Other Offenses", "Suspicion", "Curfew", "Runaways"]

with open('raw/all_parsed.csv', mode='w', newline='') as parsed:
    writer = csv.writer(parsed, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    with open('raw/all.csv', newline='') as csvfile:
        rowreader = csv.reader(csvfile)
        for index, row in enumerate(rowreader):
            if row[18] != "0" and row[19] != "0":
                if index == 0:
                    writer.writerow([row[0], row[2], "Type", row[10], row[11], row[12], row[18], row[19]])
                else:
                    x2, y2 = transform(inProj, outProj, float(row[18]), float(row[19]))
                    writer.writerow([row[0], row[2], types[int(int(row[8])/10000) - 1], row[10], row[11], row[12],
                                     y2, x2])
