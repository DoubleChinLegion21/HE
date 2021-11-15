#playground
#this file has no relevance to the project other than to test ideas - CWR
import hashlib

password = "XQF@@]WJ@"
#passwordhash = hashlib.md5(password.encode()).hexdigest()
#print(len(passwordhash))
#print(passwordhash)

#plaintext = "crd}seo|z"
plaintext = 3738888
plaintext = str(plaintext).zfill(len(password))

ciphertext_list = [chr(ord(a) ^ ord(b)) for a, b in zip(plaintext, password)]
ciphertext = ""
for i in ciphertext_list:
    ciphertext = ciphertext + str(i)

print("heythere:", ciphertext)