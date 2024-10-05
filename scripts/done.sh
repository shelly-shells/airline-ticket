cat psswd.txt | sudo -S mysql -u root < sql-connector/clear.sql
rm -rf sql-connector/__pycache__