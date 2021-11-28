
Introductory information

README for HEwebsite demo

Code authored by:
    Caleb Rivera

Languages: JavaScript, Node.js, HTML

This code is an example of a real life implementation for Honey Encryption.

This website is made up of multiple files.  The serverfile, "server1.js" is run by node in an Amazon EC2.  It has the possibility of being run locally, but was never attempted.
The website is hosted at the domain "heexample.com" (it's live, please visit it!)
The server1.js file serves various files within the "express" folder to visting users, primarily the "main.html" file to all users visiting the base domain of "heexample.com"
The "poll.js" file is directly linked in the HTML of main.html to execute various scripts, sending and receiving messages from the server.
An admin page exists titled "admin476.html" and a small script file at "admin.js" is linked to it, facilitating communication from the client and the server.
This admin page is accessible at "heexample.com/admin" with the username/password : admin/hehehe.
The function of the admin page is later to be discussed.

The function of the "main.html" page is broken into 4 phases.
Phase 1. Message space generation
Phase 2. Seed space generation
Phase 3. Seed selection and key XOR
Phase 4. Login demo page with reverse DTE lookup

These phases are selectable on the admin page, which upon selection, update and affect all users current and future viewing the "main.html" page.
It affects current users by using a realtime pub/sub framework library: ably.io.  Additional buttons on the admin page are
- "Wash" - removes all entries / resets the message space
- "Set Password" - sets the key
- "Set Message" - sets the message to be encrypted with the key
- "Generate" - deprecated

--How to run the demo--
1. Select "Phase 1" and "Wash" on the admin page
2. Populate the message space with inputs from various users (or you can populate it yourself) through the main page at "heexample.com"
3. Once satisfied with the results, select "Phase 2" on the admin page.  This will dispaly a page to the users at "heexample.com" of the message space sorted and with assigned seeds.
The database entries are not stored sorted server side, but are automatically sorted client side everytime a new entry is submitted on "Phase 1"
4. Enter a Key on the admin page and click the "Set Password" button.
5. Refresh/reload the admin page (not doing so will provide inaccurate selections on the dropdown in the following step)
6. From the dropdown on the admin page, choose an ice-cream flavor as the secret message and click "Set Message"
7. Click "Phase 3" on the admin page and on the main page at "heexample.com" a section at the bottom of the screen should be appear.
It will show an example of the key XORd with a random seed, producing a ciphertext.  This ciphertext is stored in the server.
8. Click "Phase 4" on the admin page and on the main page at "heexample.com", a view to enter a key to decode the ciphertext becomes available.
9. Upon entry of a key, it is sent to the server, and XORd with the ciphertext, producing a seed that then is mapped to a serverside sorted messagespace message.
The result is returned to the user and for sole purpose of demonstration, is highlighted green if correct, or red if incorrect, because a hash is stored serverside of the correcte plaintext message.
Users can enter as many test keys as desired.