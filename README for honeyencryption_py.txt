
Introductory information

README for honeyencryption.py

Code authored by:
    Beatriz Buquerin 
    Caleb Rivera

Language: Python 

This code is an example of a real life implementation for Honey Encryption. 
In this example, all the passowords tried by the user will give you an actual output that can be the real one or not.
The user will be asked for a password (min 8 characters) and a 4 digit pin code that is going to keep secure.

First it reads the file with the pincodes information and it creates a list with the seed space information (appended).
Then the user is asked for the password and the 4 digit pin code. 
The password has to be at least 8 characters because the max seed is an 8 digit number. That way we avoid losing information 
on the Encryption part.

With the the 4 digit pin code introduce by the user (val), it goes through the list (appended) and gets the seed space of that certain value.
Then you get the final seed by selecting a random one form the seed space of the value inserted by the user.
It XOR the password with the seed, to get the ciphertext.
To prove that in this example honeywords would be created without doing anything, we xor a seed that represents number 1234 with the password
to get the honeyword. 
Then the user is asked for a password again. 
The new password (password_2) is XOR with the ciphertext. The seed would have to appear there, but not all the password creates a useful 
seed, a number. If that is not the case, a random seed is created so all the fake passowords get an output as if they were hpneywords.
So if the user inserts the real password, the seed found will be in the correct seed space.
If the user inserts a real honeyword, like the one that is given as an example, the seed found will be on the seed space without the
code doing anything.
If the password inserte by the user is any of them, a random seed will be created.
Once there is a seed, it goes through the list again to find the value associated with that seed.