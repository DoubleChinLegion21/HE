import random

lines = ""
with open('readme2.txt') as f:
    lines = f.readlines()

appended = []
for i in lines:
    i = i.split(",")
    
    appended.append( (int(i[0]),int(i[1][:-1])) )


def myFunc(e):
    indexss = e[1]
    return indexss

appended.sort(key=myFunc)

val = int(input("Enter your value: "))

total = 0
current_pos = 0
#seed space generation and looking for
for i in appended:
    if i[0] != val:
        total += i[1]
        current_pos += 1
    else:
        break

next_total = total + int(appended[current_pos][1])
print("needs to be between",total,next_total)

seed = random.randint(total, next_total)

print("here's yo seed:",seed)