## :heavy_exclamation_mark: Development on hold :heavy_exclamation_mark:
Development for this module has been put on hold. There are more important projects for me at the moment.
Feel free to fork and improve the code.  
  
## TODO  
* Find a better method to reload with new look than relogging  
  
# Surgeon  
A tera-proxy module that is able to change your character's appearance (race, gender, voice, etc.).  
  
## Usage  
Automatically saves your new look and loads it whenever you start the game.  
If you have more than one look saved for same character, the first look will be loaded.  
If you want a different look loaded on startup, move your desired preset to the top in app.json.  
  
While in game, open a proxy chat session by typing "/proxy" or "/8" in chat and hitting the space bar.  
This serves as the script's command interface.  
The following commands are supported:  
  
* surgeon load [x] - load your saved preset with the number x
* surgeon race - emulates a race change  
* surgeon gender - emulates a gender change  
* surgeon appearance - emulates an appearance change  
* surgeon reset - resets your changes  
* surgeon voice [0-5] - changes your voice pitch, e.g. "surgeon voice 1"  
* surgeon head - switch between big and normal head  
* surgeon height [x] - changes your height to x, default is 0, e.g. "surgeon height -3"  
* surgeon thighs [x] - changes your thighs to x, default is 0, e.g. "surgeon thighs -3"  
* surgeon chest [x] - changes your chest to x, default is 0, e.g. "surgeon chest -3"  
* surgeon marrow - gives you the Marrow Brooch visual effect  
* surgeon darkan - gives you Darkan\'s wings  
* surgeon darkan2 - gives you Darkan\'s wings and Murderous Intent visual effects  
* surgeon ice - gives you Kelsaik\'s ice visual effect  
* surgeon fire - gives you Kelsaik\'s fire visual effect  
* surgeon lachelith - gives you Lachelith\'s debuff visual effect  
* surgeon murderous - gives you the Murderous Intent visual effect  
* surgeon ragnarok - gives you the Ragnarok visual effect  
* surgeon reaping - gives you the Shadow Reaping visual effect  
* surgeon noctenium - gives you the Uncommon Noctenium visual effect  
  
Any other input, starting with "surgeon", will return a summary of above commands in the chat.  
  
## Safety
Whatever you send to the proxy chat in game is intercepted client-side. The chat is NOT sent to the server.  
All appearance changes are only visible to your client. Nothing gets changed on the server.  
  
## Credits  
Contains code from shape-changer by Spaacecats https://github.com/spaacecats  
Contains code from relog by wuaw https://github.com/wuaw  
  
## Changelog
### 0.2.0b
* [*] Fixed a bug that caused the ragnarok, reaping and noctenium effects to not apply
* [*] Some code cleanup
* [*] Full conversion to Pinkie Pie's command module which is now a requirement
### 0.1.5b
* [+] Added automated saving and loading of looks (thanks wuaw)
### 0.1.0b
* [*] Initial Release
