import random
from tabulate import tabulate

names = [
    "Karlo",
    "Elsa",
    "Salve",
    "Maurine",
    "Magda",
    "Matthew & Maricon",
    "Carmina",
    "Claren",
    "alyza",
    "aira",
    "Pierre",
    "Melnard & Mitch",
    "Eduard",
    "Emily",
    "chi",
    "Ken & Jeramay",
    "williza",
    "Migui",
    "Apple"
]

def create_groupings(names, group_size):
    random.shuffle(names)  # Shuffle the names list randomly
    groupings = []
    group = []
    for name in names:
        group.append(name)
        if len(group) == group_size:
            groupings.append(group)
            group = []
    if group:
        groupings.append(group)
    return groupings

groupings = create_groupings(names, 4)

# Format the groupings for table display
headers = ["Group 1", "Group 2", "Group 3", "Group 4"]
table = [groupings[i] for i in range(len(groupings))]

# Display the table in terminal
print(tabulate(table, headers=headers, tablefmt="grid"))
