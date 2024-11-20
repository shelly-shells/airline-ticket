import mysql.connector
import password_encryption
import password_decryption


def login(username, password):
    cnx = mysql.connector.connect(user="sys", password="sys", host="127.0.0.1")
    cursor = cnx.cursor()
    cursor.execute("use flightBooking")
    cursor.execute(
        f"select username, password_encrypt, role from users where username = '{username}'"
    )
    user = cursor.fetchall()
    cursor.close()
    cnx.close()
    if user:
        p = password_decryption.decryption(user[0][1])
        if p == password:
            return 1, user[0][2]
        else:
            return 0, None
    else:
        return 0, None


def register(username, password, fname, lname, phone, email, age, gender):

    try:
        cnx = mysql.connector.connect(user="sys", password="sys", host="127.0.0.1")
        cursor = cnx.cursor()
        cursor.execute("use flightBooking")
        cursor.execute(f"select username from users where username = '{username}'")
        if cursor.fetchall():
            cursor.close()
            cnx.close()
            return 0, "Username already exists"

        cursor.execute(f"select email from users where email = '{email}'")
        if cursor.fetchall():
            cursor.close()
            cnx.close()
            return 0, "Email already exists"

        cursor.execute(f"select mobileNo from users where mobileNo = '{phone}'")
        if cursor.fetchall():
            cursor.close()
            cnx.close()
            return 0, "Mobile number already exists"

        encrypted_password = password_encryption.encrypter(password)
        insert_query = """
            INSERT INTO users (username, password_encrypt, firstName, lastName, mobileNo, email, age, gender)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
        cursor.execute(
            insert_query,
            (username, encrypted_password, fname, lname, phone, email, age, gender),
        )
        cnx.commit()
        for i in cursor.fetchall():
            print(i)
        cursor.close()
        cnx.close()
        return 1, None
    except Exception as e:
        print(e)
        return 0, "Error in registering user"


# register("test", "test", "test", "test", "test", "test", 20, "M")
# print(login("test", "test"))
