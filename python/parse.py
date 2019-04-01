import csv

types = ["Homicide", "Rape", "Robbery", "Assault", "Burglary", "Larceny", "Auto Theft", "Other Assault", "Arson", "Forgery",
         "Fraud", "Embezzlement", "Stolen Property", "Vandalism", "Weapons", "Prostitution", "Sex Offenses", ""]
with open('raw/all_parsed.csv', mode='w', newline='') as parsed:
    writer = csv.writer(parsed, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    with open('raw/all.csv', newline='') as csvfile:
        rowreader = csv.reader(csvfile)
        for index, row in enumerate(rowreader):
            if row[18] != "0" and row[19] != "0":
                writer.writerow([row[0], row[2], row[8], row[10], row[11], row[12], row[18], row[19]])
