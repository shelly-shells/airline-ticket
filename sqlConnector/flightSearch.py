import mysql.connector


def populate():
    cnx = mysql.connector.connect(user="admin", password="admin", host="127.0.0.1")
    cursor = cnx.cursor()
    cursor.execute("use flightBooking")
    cursor.execute("SET FOREIGN_KEY_CHECKS=0")
    with open("csvs/routes.csv") as f:
        l = f.readlines()
        for line in l[1:]:
            line = line.strip()
            line = line.split(",")
            cursor.execute(
                f"insert into routes values ('{line[0]}', '{line[5]}', {line[1]}, {line[2]}, {line[3]}, {line[4]}, {line[13]}, {line[6]}, {line[7]}, {line[8]}, {line[9]}, {line[10]}, {line[11]}, {line[12]}, {line[14]}, {line[15]})"
            )
        f.close()
    cursor.execute("SET FOREIGN_KEY_CHECKS=1")
    cnx.commit()

populate()
