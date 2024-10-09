import mysql.connector
import password_enryption
import password_decryption


def login(username, password):
    cnx = mysql.connector.connect(user="sys", password="sys", host="127.0.0.1")
    cursor = cnx.cursor()
    cursor.execute("use flightBooking")
    cursor.execute(f"select username, password_encrypt from users where username = '{username}'")
    user = cursor.fetchall()
    cursor.close()
    cnx.close()
    if user:
        p = password_decryption.decryption(user[0][1])
        if p == password:
            return 1
        else:
            return 0
    else:
        return 0


def register(username, password, fname, lname, phone, email, age, gender):
    
    try:
        cnx = mysql.connector.connect(user="sys", password="sys", host="127.0.0.1")
        cursor = cnx.cursor()
        cursor.execute("use flightBooking")
        encrypted_password = password_enryption.encrypter(password)
        insert_query = """
            INSERT INTO users (username, password_encrypt, firstName, lastName, mobileNo, email, age, gender)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
        cursor.execute("set foreign_key_checks=0")
        cursor.execute(
            insert_query,
            (username, encrypted_password, fname, lname, phone, email, age, gender),
        )
        cnx.commit()
        cursor.execute("set foreign_key_checks=1")
        for i in cursor.fetchall():
            print(i)
        cursor.close()
        cnx.close()
        return 1
    except Exception as e:
        print(e)
        return 0


# register("test", "test", "test", "test", "test", "test", 20, "M")
# login("test", "test")
