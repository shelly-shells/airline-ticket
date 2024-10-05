import mysql.connector
import password_enryption
import password_decryption


def login(username, password):
    cnx = mysql.connector.connect(user="sys", password="sys", host="127.0.0.1")
    cursor = cnx.cursor()
    cursor.execute("use flightBooking")
    cursor.execute(f"select username, pwd from users where username = '{username}'")
    user = cursor.fetchall()
    cursor.close()
    cnx.close()
    if user:
        p = password_decryption.decryption(user[0][1])
        if p == password:
            print("Login successful")
        else:
            print(p)
            print("Incorrect password")
    else:
        print("User not found")


def register(username, password, fname, lname, phone, email, age, gender):
    cnx = mysql.connector.connect(user="sys", password="sys", host="127.0.0.1")
    cursor = cnx.cursor()
    cursor.execute("use flightBooking")
    encrypted_password = password_enryption.encrypter(password)
    print(encrypted_password)
    insert_query = """
        INSERT INTO users (username, pwd, firstName, lastName, mobileNo, emailID, age, gender, updatedBy)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
    cursor.execute("set foreign_key_checks=0")
    cursor.execute(
        insert_query,
        (username, encrypted_password, fname, lname, phone, email, age, gender, "a"),
    )
    cnx.commit()
    cursor.execute("set foreign_key_checks=1")
    cursor.execute("select * from users")
    for i in cursor.fetchall():
        print(i)
    cursor.close()
    cnx.close()


# register("test", "test", "test", "test", "test", "test", 20, "M")
# login("test", "test")
