cat psswd.txt | sudo -S mysql -u root < sqlConnector/table_creation.sql
python3 sql-connector/insertData.py
python3 interface/app.py