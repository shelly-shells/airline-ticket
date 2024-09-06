from cryptography.fernet import Fernet

def gen_key():
    key = Fernet.generate_key()
    cipher = Fernet(key)

    with open("secret.key", "wb") as key_file:
        key_file.write(key)
    return cipher


def encrypter(cipher, password):
    encrypted_password = cipher.encrypt(password.encode())
    return encrypted_password

def read_key():
    with open("secret.key", "rb") as key_file:
        key = key_file.read()
    return key

def decrypter(cipher, encrypted_password):    
    decrypted_password = cipher.decrypt(encrypted_password).decode()
    return decrypted_password