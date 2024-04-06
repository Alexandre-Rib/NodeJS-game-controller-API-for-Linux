# NodeJS-game-controller-API-for-Linux
Porting of C and Python Librarys to NodeJs, to read recent game controllers' inputs

Based on works of :
- Ragnar Hojland Espinosa (Joystick API Documentation in C, no license identified)	

	No Github account found

- Vojtech Pavlik (JSTEst.c, GPL license)

	https://github.com/vojtech-pavlik?tab=repositories
 
- Jason White (Joystick.c, no license identified)  

	https://github.com/jasonwhite

- Linus Groh (xbox360controller python Lib, MIT license)

	https://github.com/linusg/xbox360controller

Thank to them!

**HOW TO USE**

1) Dependencie(s)

	- ioctl-napi, version 0.3.0

	This library communicates with game controller Linux' driver.
	In C language, to communicate with driver, we use "ioctl" function.

2) Get Character device path of game controller

 	- If plugged, unplug your game controller
  	- Then have a look, with **ls** command, on the folder /dev/input/.
	- Check the list of files which begin by JS
 	- Plug your game controller and look again on the folder /dev/input/.
  	- A new JSx file should have appared -> Memorize the path, it's necessary to create a GameController object
	

3) Needed files

	In the same folder, have the following files :
	- GameController.js
	- input.js, porting of C constants, found in Python code
	- ioctl_macros_and_constants.js , porting of C macros for ioctl function. Currently not implemented in ioctl-napi NodeJs library :-(

	**Optionnal**, choose your path
   	- json file of buttons and axes mapping (see the example in folder "json").



3) Try it !

	In your nodeJs script, create a GameController object with the character device path of your controller. Then catch events 'GameControllerEvent'.

	To help you, have a look in folder "examples"

