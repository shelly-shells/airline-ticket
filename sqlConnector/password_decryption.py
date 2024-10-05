"""
password decrytion logic for future use
"""

from cryptography.fernet import Fernet

def decryption(pwd):
    encrypted_password = pwd

    with open("secret.key", "rb") as key_file:
        key = key_file.read()
    cipher = Fernet(key)
    decrypted_password = cipher.decrypt(encrypted_password).decode()
    return decrypted_password



