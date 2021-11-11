import random

# Reading the file with the seed space information
with open('readme2.txt') as f:
    lines = f.readlines()

# Creating the seed space (list)
appended = []
for i in lines:
    i = i.split(",")
    appended.append((int(i[0]), int(i[1][:-1])))


# Function to make the sorting key
def sorting_function(e):
    indexss = e[1]
    return indexss

# Sorting the seed space
appended.sort(key=sorting_function)

# Input of the password (8 characters -> max seed: 17051801)  and the pin
password = ""
while len(password) < 8:
    password = input("Enter your password (min 8 characters): ")

val = int(input("Enter your 4 digit pin: "))

# Searching for the exact space of that digit in the seed space
total = 0
current_pos = 0
for i in appended:
    if i[0] != val:
        total += i[1]
        current_pos += 1
    else:
        break

next_total = total + int(appended[current_pos][1])
print("needs to be between", total, next_total)

seed = random.randint(total, next_total)
print("here's yo seed:", seed)

# function to turn de seed into a 8 char string
def seed_to_str(seed):
    zeros = ""
    for i in range(8 - len(seed)):
        zeros = zeros + "0"
    return zeros + seed

# encryption (XOR) of the seed with the key = password
ciphertext_list = [chr(ord(a) ^ ord(b)) for a, b in zip(seed_to_str(str(seed)), password)]
ciphertext = ""
for i in ciphertext_list:
    ciphertext = ciphertext + str(i)
print("ciphertext:", ciphertext)

# Input of the new password (the correct one or other)
password_2 = ""
while len(password_2) < 8:
    password_2 = input("Attacker - Enter your password (min 8 characters): ")


# Decryption (XOR) of the ciphertext with the new password
seed_list = [chr(ord(a) ^ ord(b)) for a, b in zip(password_2, ciphertext)]
seed_2 = ""
for i in seed_list:
    seed_2 = seed_2 + str(i)
print("seed_2:", seed_2)

# Find the value on the seed space
try:
    seed_2 = int(seed_2)
    total = 0
    for i in appended:
        if seed_2 < total:
            total += i[1]
            current_pos += 1
        else:
            break
    val_2 = appended[current_pos][0]
    print("4 digit pin:", val_2)
except Exception:
    print("Contraseña incorrecta")