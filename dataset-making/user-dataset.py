import pandas as pd
import random

l = [
    "Aarav Sharma", "Vihaan Gupta", "Vivaan Kumar", "Aditya Mishra", "Krishna Yadav",
    "Sai Patel", "Arjun Mehta", "Aryan Singh", "Ishaan Sinha", "Shaurya Verma",
    "Ayaan Reddy", "Kabir Iyer", "Dhruv Joshi", "Ritvik Deshmukh", "Advait Nair",
    "Nikhil Chaudhary", "Harsh Saxena", "Aniket Menon", "Omkar Rao", "Rohan Chatterjee",
    "Tanmay Banerjee", "Pranav Shukla", "Rishabh Goyal", "Siddharth Bhatt", "Anshuman Shetty",
    "Anurag Kapoor", "Aryan Tiwari", "Kunal Bhatia", "Madhav Reddy", "Rudra Malhotra",
    "Raghav Nair", "Rahul Das", "Akshay Kulkarni", "Manav Chauhan", "Neeraj Pandey",
    "Rajesh Reddy", "Ravi Shankar", "Sarvesh Kaur", "Saurabh Bose", "Shivam Sen",
    "Tarun Joshi", "Tushar Pillai", "Uday Gupta", "Vaibhav Saxena", "Yashwant Iyer",
    "Amitabh Patil", "Ajay Varma", "Abhay Sinha", "Anil Nair", "Bhavesh Rao",
    "Chetan Mehta", "Devendra Chauhan", "Dilip Yadav", "Ganesh Gupta", "Gaurav Bhatt",
    "Hemant Shetty", "Jatin Kapoor", "Kartik Shukla", "Lakshman Patel", "Mohan Reddy",
    "Narendra Sharma", "Naveen Kumar", "Nilesh Verma", "Pankaj Yadav", "Prakash Rao",
    "Rajiv Bhatia", "Rakesh Menon", "Sandeep Joshi", "Sanjay Varma", "Shankar Kapoor",
    "Shyam Das", "Sudhir Iyer", "Sunil Gupta", "Tejas Patil", "Vikas Pandey",
    "Vijay Malhotra", "Vivek Mishra", "Ankita Singh", "Deepika Rao", "Isha Patel",
    "Kajal Yadav", "Laxmi Verma", "Meera Sinha", "Neha Joshi", "Pooja Nair",
    "Priya Deshmukh", "Radhika Gupta", "Rekha Sharma", "Ritu Kapoor", "Sakshi Bhatia",
    "Seema Reddy", "Shreya Tiwari", "Sneha Menon", "Swati Shukla", "Tanvi Mehta",
    "Trisha Bhatt", "Uma Rao", "Vandana Patel", "Vaishali Sinha", "Yamini Deshmukh"
]

l = [i.split() for i in l]
m = ["gmail.com", "yahoo.com", "rediffmail.com"]
s = [i for i in range(9)]
nos = [random.randint(6500000000, 9999999999) for i in range(len(l))]
for i in range(len(l)):
    name = ''.join(l[i]).lower()
    suffix = ''.join([str(random.choice(s)) for j in range(random.randint(0, 5))])
    l[i].append(name+suffix+"@"+random.choice(m))
    l[i].append(nos[i])
    p



df = pd.DataFrame(l)
df.columns = ["first_name", "last_name", "email", "phone_no"]
df.to_csv("csvs/user.csv", index=False)

