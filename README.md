## Beta  
The module is operational but might still contain some bugs/things I want to improve in the future.  
Still releasing because I don't have much time for scripting atm.  
  
## TODO  
* Find a better method to reload with new look than relogging  
  
# Surgeon  
A tera-proxy module that is able to change your character's appearance (race, gender, voice, etc.).  
  
## Usage  
While in game, open a whisper chat session with "!Surgeon" by typing "/w !surgeon" in chat and hitting the space bar.  
This serves as the script's command interface.  
The following commands are supported:  
  
* race - emulates a race change  
* gender - emulates a gender change  
* appearance - emulates an appearance change  
* reset - resets your changes  
* voice [0-5] - changes your voice pitch, e.g. voice 1  
* head - switch between big and normal head  
* height [x] - changes your height to x, default is 0, e.g. height -3  
* thighs [x] - changes your thighs to x, default is 0, e.g. thighs -3  
* chest [x] - changes your chest to x, default is 0, e.g. chest -3  
* marrow - gives you the Marrow Brooch visual effect  
* darkan - gives you Darkan\'s wings  
* darkan2 - gives you Darkan\'s wings and Murderous Intent visual effects  
* ice - gives you Kelsaik\'s ice visual effect  
* fire - gives you Kelsaik\'s fire visual effect  
* lachelith - gives you Lachelith\'s debuff visual effect  
* murderous - gives you the Murderous Intent visual effect  
* ragnarok - gives you the Ragnarok visual effect  
* reaping - gives you the Shadow Reaping visual effect  
* noctenium - gives you the Uncommon Noctenium visual effect  
  
Any other input returns a summary of above commands in the game.  
  
## Safety
Whatever you send to "!Surgeon" in game is intercepted client-side. The chat is NOT sent to the server.  
  
## Credits  
Contains code from shape-changer by Spaacecats https://github.com/spaacecats  
Contains code from relog by wuaw https://github.com/wuaw  