import mysql.connector
import password_encryption

def update_profile(username, password, fname, lname, phone, email, age, gender):
    try:
        cnx = mysql.connector.connect(user="sys", password="sys", host="127.0.0.1")
        cursor = cnx.cursor()
        cursor.execute("USE flightBooking")
        
        encrypted_password = ""
        
        if password:
            encrypted_password = password_encryption.encrypter(password)
        
        password_update_query = f"""password_encrypt = "{encrypted_password}", """ if password else ""
        fname_update_query = f"firstName = '{fname}', " if fname else ""
        lname_update_query = f"lastName = '{lname}', " if lname else ""
        phone_update_query = f"mobileNo = '{phone}', " if phone else ""
        email_update_query = f"email = '{email}', " if email else ""
        age_update_query = f"age = {age}, " if age else ""
        gender_update_query = f"gender = '{gender}', " if gender else ""
        
        set_clause = (
            password_update_query +
            fname_update_query +
            lname_update_query +
            phone_update_query +
            email_update_query +
            age_update_query +
            gender_update_query
        )
        
        if set_clause.endswith(', '):
            set_clause = set_clause[:-2]
        
        update_query = f"UPDATE users SET {set_clause} WHERE username = '{username}'"
        
        cursor.execute(update_query)
        cnx.commit()
        cursor.close()
        cnx.close()
        return 1  
    except Exception as e:
        print(e)
        return 0 