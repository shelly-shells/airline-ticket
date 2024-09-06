from cryptography.fernet import Fernet
import pandas as pd

# Read the CSV file
df = pd.read_csv("csvs/users.csv")

# Correct the column name typo and decode the double-encoded string
encrypted_password = df["password_encrpyt"][0]
encrypted_password = eval(encrypted_password)

# Print the encrypted password
print(f"Encrypted Password: {encrypted_password}")

# Read the key from the file
with open("secret.key", "rb") as key_file:
    key = key_file.read()

# Initialize the cipher
cipher = Fernet(key)

# Decrypt the password
decrypted_password = cipher.decrypt(encrypted_password).decode()

# Print the decrypted password
print(f"Decrypted Password: {decrypted_password}")
