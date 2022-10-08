# Algophant-wallet
An Algorand cryptocurrency wallet  which allows users to access their crypto on the web through the browser extension

This is a code challenge for the Algorand greenhouse [hackathon](https://gitcoin.co/issue/29370) ,  for the challenge i decide to build an algorand wallet which can accessible to all users easily by simple installing it as a chrome extension.

I used the python algorand sdk for the challenge with the help of Djang as my backend and ReactJs as the frontend. The project aims to eliminate having to remember the url of the algorand wallet you are using. but instead be the goto wallet for all your algorand interactions.

the django api documentation for the wallet can be found [here](https://documenter.getpostman.com/view/20357451/2s83zgvRGK).

to install the chrome extension file :

1. clone this repository to you local machine
2. go to the extensions tab on chrome 
3. enable developer mode
4. from the chrome extensions tab, click #*Load unpacked* button
5. navigate to the directory you cloned the repository to
6. from the repository navigate to "*algophant-extension/build/*" the click select
7. once that's done you can now use the wallet by locating it in your extensions



In the future I hope to implement more features as I grow with Algorand

# NOTE : 
If you want to test the code locally you have to enter your SDK key (gotten from [purestake](https://developer.purestake.io/)) in the settings.py file of the algophant-backend file. It is named *ALGO_TOKEN* in the file
