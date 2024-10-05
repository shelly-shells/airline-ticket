cat psswd.txt | sudo -S mysql -u root < sqlConnector/table_creation.sql
python3 sql-connector/insert_data.py
python3 interface/app.py