/****************************************************************************/
/* Name		: example_1_NewGameController.js							 	*/
/* Function : Simple implementation	a object from GameController class		*/
/* Author 	: Alexandre Ribault                                             */
/* Creation : 04/06/2024                                                    */
/* Version	: 1.0.0                                                         */
/****************************************************************************/
/*                                                                          */
/*					DISPLAY OPTIMISED FOR NOTEPAD++		                    */
/*                                                                          */
/****************************************************************************/
		
/**************************************************/
/*	                                              */
/*                                                */
/*					DEPENDENCIES                  */
/*                                                */
/*                                                */
/**************************************************/
import fs 				from 'fs'
import {GameController} from './GameController.js'

/**************************************************/
/*					CONSTANTS	                  */
/**************************************************/
const controllerPath =  "/dev/input/js0"

/**************************************************/
/*					FUNCTIONS                 	  */
/**************************************************/
/**************************************************/
/* Function :CheckControllerAvailability          */
/**************************************************/
/**
* Checks the validity of the character device path of a game controller
* @param {string} controllerPath Path to a character device file for game controller
* @return {bool | error } return true if controllerPath is a path to character device, else return an error object
*/
const checkControllerAvailability = (controllerPath) =>{
	try {		
		const stats = fs.statSync(controllerPath)
		if (stats.isCharacterDevice())
			return true
		else {
			throw new Error (`${controllerPath} exists but is not a character device`)
		}	
	}			
	catch(error){
		return error
	}
}

/**************************************************/
/*                                                */
/*						MAIN	                  */
/*                                                */
/**************************************************/
if (checkControllerAvailability (controllerPath)){
	let xboxController = new GameController(controllerPath,0)

	xboxController.on('GameControllerEvent',function (gameControllerReference){		
		console.clear()
		console.log(gameControllerReference.getControllerState())
	})	
}
