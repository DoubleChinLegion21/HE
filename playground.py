#playground
import hashlib

password = "speaj"
passwordhash = hashlib.md5(password.encode()).hexdigest()
print(len(passwordhash))
print(passwordhash)

plaintext = 1231111678
plaintext = str(plaintext).zfill(32)

ciphertext_list = [chr(ord(a) ^ ord(b)) for a, b in zip(plaintext, passwordhash)]
ciphertext = ""
for i in ciphertext_list:
    ciphertext = ciphertext + str(i)

print("heythere:", ciphertext)