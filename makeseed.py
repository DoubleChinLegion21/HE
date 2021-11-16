#Project code authored by Beatriz Buquerin Garcia Del Valle and Caleb Rivera

import random
import hashlib

# Reading the file with the seed space information
with open('readme2.txt') as f:
    lines = f.readlines()

# Creating a list with the seed space info
appended = []
for i in lines:
    i = i.split(",")
    appended.append((int(i[0]), int(i[1][:-1])))

# Function to make the sorting key
def sorting_function(e):
    indexss = e[1]
    return indexss

# Sorting the list
appended.sort(key=sorting_function)

# Input of the password and the pin
password = ""
while len(password) < 8:
    password = input("Enter your password (min 8 characters): ")

val = int(input("Enter your 4 digit pin: "))
pinhash = hashlib.sha256(str(val).zfill(4).encode()).hexdigest()

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
print("The seed needs to be between", total, next_total)

seed = random.randint(total, next_total)
print("Seed:", seed)

# function to turn de seed into a 8 char string
def seed_to_str(seed):
    expanded = str(seed).zfill(len(password))
    return expanded

# encryption (XOR) of the seed with the key = password
ciphertext_list = [chr(ord(a) ^ ord(b)) for a, b in zip(seed_to_str(seed), password)]
ciphertext = ""
for i in ciphertext_list:
    ciphertext = ciphertext + str(i)
print("ciphertext:", ciphertext)

fake_list = [chr(ord(a) ^ ord(b)) for a, b in zip("16865132", ciphertext)]
fake = ""
for i in fake_list:
    fake = fake + str(i)
# Input of the new password (the correct one or other)
password_2 = ""
while len(password_2) < 8:
    password_2 = input("Attacker - Enter your password (min 8 characters) (\""+fake+"\" will yield 1234): ")

if len(password_2) > len(password):
    print("that's not the right length")
else:
    # Decryption (XOR) of the ciphertext with the new password
    seed_list = [chr(ord(a) ^ ord(b)) for a, b in zip(password_2, ciphertext)]
    seed_2 = ""
    for i in seed_list:
        seed_2 = seed_2 + str(i)
    print("seed_2:", seed_2)

    # Function to get a random seed
    def random_seed():
        total = 0
        for i in appended:
            total += i[1]
        return random.randint(0, total)

    # Find the value on the seed space
    try:
        seed_2 = int(seed_2)
    except Exception:
        print("Your password is wrong -> does not match any seeds")
        seed_2 = random_seed()
        print("seed_2 after random:", seed_2)

    total = 0
    current_pos = 0
    for i in appended:
        if seed_2 > total:
            total += i[1]
            current_pos += 1
        else:
            break
    val_2 = appended[current_pos-1][0]
    val_2 = str(val_2).zfill(4)
    print("4 digit pin:", val_2)

    # Check if final hash of pin matches original pin
    pinhash_2 = hashlib.sha256(val_2.encode()).hexdigest()
    if pinhash_2 == pinhash:
        print("Match, you are the real you")
    else:
        print("No match, you must be an intruder")