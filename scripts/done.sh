cat psswd.txt | sudo -S mysql -u root < sqlConnector/clear.sql
rm -rf sql-connector/__pycache__