"""
generate booking details csv using bookings and users csv.
first row is the user who made the booking, followed by the adults and children in the booking. 
information set randomly from an AI generated list of names and random age and gender
"""

import random
import pandas as pd

df = pd.read_csv("csvs/bookings.csv")
df1 = pd.read_csv("csvs/users.csv")
names = [
    "Liam",
    "Noah",
    "Oliver",
    "Elijah",
    "William",
    "James",
    "Benjamin",
    "Lucas",
    "Henry",
    "Alexander",
    "Mason",
    "Michael",
    "Ethan",
    "Daniel",
    "Jacob",
    "Logan",
    "Jackson",
    "Levi",
    "Sebastian",
    "Mateo",
    "Jack",
    "Owen",
    "Theodore",
    "Aiden",
    "Samuel",
    "Joseph",
    "John",
    "David",
    "Wyatt",
    "Matthew",
    "Luke",
    "Asher",
    "Carter",
    "Julian",
    "Grayson",
    "Leo",
    "Jayden",
    "Gabriel",
    "Isaac",
    "Lincoln",
    "Anthony",
    "Hudson",
    "Dylan",
    "Ezra",
    "Thomas",
    "Charles",
    "Christopher",
    "Jaxon",
    "Maverick",
    "Josiah",
    "Isaiah",
    "Andrew",
    "Elias",
    "Joshua",
    "Nathan",
    "Caleb",
    "Ryan",
    "Adrian",
    "Miles",
    "Eli",
    "Nolan",
    "Christian",
    "Aaron",
    "Cameron",
    "Ezekiel",
    "Colton",
    "Luca",
    "Landon",
    "Hunter",
    "Jonathan",
    "Santiago",
    "Axel",
    "Easton",
    "Cooper",
    "Jeremiah",
    "Angel",
    "Roman",
    "Connor",
    "Jameson",
    "Robert",
    "Greyson",
    "Jordan",
    "Ian",
    "Carson",
    "Jaxson",
    "Leonardo",
    "Nicholas",
    "Dominic",
    "Austin",
    "Everett",
    "Brooks",
    "Xavier",
    "Kai",
    "Jose",
    "Parker",
    "Adam",
    "Jace",
    "Wesley",
    "Kayden",
    "Silas",
]

surnames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
    "Adams",
    "Nelson",
    "Baker",
    "Hall",
    "Rivera",
    "Campbell",
    "Mitchell",
    "Carter",
    "Roberts",
    "Gomez",
    "Phillips",
    "Evans",
    "Turner",
    "Diaz",
    "Parker",
    "Cruz",
    "Edwards",
    "Collins",
    "Reyes",
    "Stewart",
    "Morris",
    "Morales",
    "Murphy",
    "Cook",
    "Rogers",
    "Gutierrez",
    "Ortiz",
    "Morgan",
    "Cooper",
    "Peterson",
    "Bailey",
    "Reed",
    "Kelly",
    "Howard",
    "Ramos",
    "Kim",
    "Cox",
    "Ward",
    "Richardson",
    "Watson",
    "Brooks",
    "Chavez",
    "Wood",
    "James",
    "Bennett",
    "Gray",
    "Mendoza",
    "Ruiz",
    "Hughes",
    "Price",
    "Alvarez",
    "Castillo",
    "Sanders",
    "Patel",
    "Myers",
    "Long",
    "Ross",
    "Foster",
    "Jimenez",
]

deets = df[["bid", "username", "adults", "children"]].values.tolist()
d = {
    df1["username"][i]: [
        df1["first_name"][i],
        df1["last_name"][i],
        int(df1["age"][i]),
        df1["gender"][i],
    ]
    for i in range(len(df1))
}

g = []
for i in deets:
    g.append([i[0], i[1], *d[i[1]]])
    for j in range(i[2]):
        g.append(
            [
                i[0],
                i[1],
                random.choice(names),
                random.choice(surnames),
                random.randint(12, 80),
                random.choice(["M", "F"]),
            ]
        )
    for j in range(i[3]):
        g.append(
            [
                i[0],
                i[1],
                random.choice(names),
                random.choice(surnames),
                random.randint(1, 11),
                random.choice(["M", "F"]),
            ]
        )

g = pd.DataFrame(
    g, columns=["bid", "username", "first_name", "last_name", "age", "gender"]
)
g.to_csv("csvs/booking-details.csv", index=False)
