/****************************************************************************/
/* Name			: GameController.js											*/
/* Function 	: Definition of a game controller							*/
/* Author 		: Alexandre Ribault, AlexandreRibault87@Gmail.com           */
/*					https://github.com/Alexandre-Rib						*/
/* Creation		: 10/03/2024                                                */
/* Last update	: 03/23/2024												*/
/* Version		: 1.0.0                                                  	*/
/****************************************************************************/
/*                                                                          */
/*					DISPLAYING OPTIMISED FOR NOTEPAD++                      */
/*                                                                          */
/****************************************************************************/
/*

	Copyright (c) 2024 Alexandre Ribault
	
	This file is part of the nodeJS API for game controller for Linux.

	The nodeJS API for game controller for Linux is free library: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

	It is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

	You should have received a copy of the GNU General Public License along with the nodeJS API for game controller for Linux. If not, see <https://www.gnu.org/licenses/>

*/



/*
	Based on works of :
	- 	Ragnar Hojland Espinosa (Joystick API Documentation in C, no license identified)
		https://www.kernel.org/doc/Documentation/input/joystick-api.txt
		No Github account found
	-	Vojtech Pavlik (JSTEst.c, License GPL)
		https://github.com/vojtech-pavlik?tab=repositories
	-	Jason White (Joystick.c, no license identified)
		https://github.com/jasonwhite
	-	Linus Groh (xbox360controller python Lib, MIT License)
		https://github.com/linusg/xbox360controller

		Thank to them!
*/

/*
	Known issue(s).
		No issue know currently
*/

/*
	Historic :
		Version 1.0.0 : Creation of this file
*/
		
/**************************************************/
/*	                                              */
/*                                                */
/*					DEPENDENCIES                  */
/*                                                */
/*                                                */
/**************************************************/
import ioctl 							from 'ioctl-napi'
import fs 								from 'fs'
import EventEmitter 					from 'events'
import * as input						from './input.js'
import * as ioctl_macros_and_constants	from './ioctl_macros_and_constants.js'
import child_process					from 'child_process';


/**************************************************/
/*	                                              */
/*					Constants	                  */
/*                                                */
/**************************************************/
/** @const {Number} Index of the first value in version number's Buffer of driver version*/
const PRIMARY_driverVersion_NUMBER	= 2

/** @const {Number} Index of the second value in version number's Buffer of driver version*/
const SECONDARY_driverVersion_NUMBER= 1

/** @const {Number} Index of the third value in version number's Buffer of driver version*/
const TERTIARY_driverVersion_NUMBER	= 0

/** @const {Number} Number of bytes necessary to char*/
const NUMBER_OF_BYTES_IN_CHAR		= 1

/** @const {Number} Size of the Buffer used to save controller Name */
const NAME_LENGTH					= 128


/** @const {Number} Maximum value of unsigned integer of 16 bits */
const MAX_VALUE_UINT16				= 65535

/** @const {Number} Maximum value of signed integer of 16 bits */
const MAX_VALUE_INT16				= 32767

/** @const {Number} Maximum value of unsigned integer of 32 bits */
const MAX_VALUE_UINT32				= 4294967295

/** @const {Number} Number a bit in a byte.*/
const NUMBER_OF_BIT_IN_BYTE 		= 8

/** @const {Number} Number of bytes necessary to code an 64 bits unsigned integer. The syntax of the name is  based on other Define syntax in original .c/.h file */
const uint64_t						= 8

/** @const {Number} Number of bytes necessary to code an 32 bits unsigned integer. Name based on original .c/.h file */
const uint32_t						= 4

/** @const {Number} Number of bytes necessary to code an 8 bits unsigned integer. Name based on original .c/.h file */
const __u8							= 1 // 1 byte is necessary to code an 8 bits unsigned integer

/** @const {Number}  Number of bytes necessary to code an 16 bits unsigned integer. Name based on original .c/.h file */
const __u16							= 2

/** @const {Number} Bumber of bits necessary to code a char in C language */
const CHAR_BIT_SIZE					= 8

//https://github.com/torvalds/linux/blob/master/include/uapi/linux/input.h#L453
/** @const {Number} Position of bit where the information "Has Rumble" is. Necessary to realize bit to bit operation on EVIOCGBIT operation's result */
const FF_RUMBLE						= 0x50

// Constant from #Define in 'include/linux/joystick.h' file (after convertion MACROS integer) 
/** @const {Number} Result of an IOCTL Macro necessary to get driver version */
const JSIOCGVERSION					= ioctl_macros_and_constants._IOR('j', 0x01, uint32_t)

/** @const {Number} Result of an IOCTL Macro necessary to get the number of axes of a game controller */
const JSIOCGAXES					= ioctl_macros_and_constants._IOR('j', 0x11, __u8)

/** @const {Number} Result of an IOCTL Macro necessary to get the number of buttons of a game controller */
const JSIOCGBUTTONS					= ioctl_macros_and_constants._IOR('j', 0x12, __u8)

/** @const {Number} Result of an IOCTL Macro necessary to get the name of the game controller*/
const JSIOCGNAME					= ioctl_macros_and_constants._IOC(ioctl_macros_and_constants._IOC_READ,'j', 0x13, NAME_LENGTH)

/** @const {Number} No documentation available in original .c/.h file */
const ABS_MAX						= 0x3f

/** @const {Number} No documentation available in original .c/.h file */
const ABS_CNT						= (ABS_MAX+1)
	
/** @const {Number} Result of an IOCTL Macro necessary to set axis mapping */
const JSIOCSAXMAP					= ioctl_macros_and_constants._IOW('j', 0x31, __u8 * ABS_CNT)

/** @const {Number} Result of an IOCTL Macro necessary to get axis mapping */
const JSIOCGAXMAP					= ioctl_macros_and_constants._IOR('j', 0x32, __u8 * ABS_CNT)

// Constants from '/include/uapi/linux/input-event-codes.h' file
const BTN_MISC						= 0x100

/** @const {Number} No documentation available in original .c/.h file */
const KEY_MAX						= 0x2ff
/** @const {Number} Result of an IOCTL Macro necessary to set Button mapping */
const JSIOCSBTNMAP					= ioctl_macros_and_constants._IOW('j', 0x33, __u16 *(KEY_MAX - BTN_MISC + 1))

/** @const {Number} Result of an IOCTL Macro necessary to get Button mapping */
const JSIOCGBTNMAP					= ioctl_macros_and_constants._IOR('j', 0x34, __u16 *(KEY_MAX - BTN_MISC + 1))

/* The following values come from include/joystick.h in the kernel source. */
/** @const {Number} No documentation available in original .c/.h file */
const KEY_MAX_SMALL					= 0x1FF
/** @const {Number} Result of an IOCTL Macro necessary to set Button mapping */
const JSIOCSBTNMAP_SMALL			= ioctl_macros_and_constants._IOW('j', 0x33, __u16 *(KEY_MAX_SMALL - BTN_MISC + 1))
/** @const {Number} Result of an IOCTL Macro necessary to get Button mapping */
const JSIOCGBTNMAP_SMALL			= ioctl_macros_and_constants._IOR('j', 0x34, __u16 *(KEY_MAX_SMALL - BTN_MISC + 1))																		  

/** @const {Number} Constant which permits to identify if a button is the event source*/
const JS_EVENT_BUTTON				= 0x01

/** @const {Number} Constant which permits to identify if an axis is the event source*/
const JS_EVENT_AXIS					= 0x02

/** @const {Number} Constant which permits to identify the game controller is the event source*/
const JS_EVENT_INIT					= 0x80

/**************************************************/
/*                                                */
/*					FUNCTIONS	                  */
/*                                                */
/**************************************************/

/**************************************************/
/* Function :bufferToInt64				          */
/**************************************************/
/**
* bufferToInt64 permit convert a Buffer to a int in 64 bit. Method not available in Buffer's class :-(
* @param {Buffer} Buffer ideally of maximum 8 bytes length. If buffer contains more than 8 bytes, they will be ignored
* @return {Number} value of a int on 64 bit
*/
function bufferToInt64(buffer){	
	const length = 	buffer.length > 8  ? 8 :  buffer.length 
	
	var sum = 0
	for (var i = 0 ; i< (buffer.length) ;i++){	
		sum += buffer[i] * 256 ** i		
	}
	return sum
}

/**************************************************/
/* Function :getEventFilePathByCharacterDevicePath*/
/**************************************************/
/**
* Permits to get the Event File path associated to the character device path ( They have not necessarily the same ID)
* @param {String} characterDevicePath ideally of maximum 8 bytes length. If buffer contains more than 8 bytes, they will be ignored
* @return {String} Path Event File of the associated 
*/
function getEventFilePathByCharacterDevicePath(characterDevicePath){	
	const regexJSIdentifier =  /.*\/(js\d+)/;
	const regexFieldControllerName =  / \d+:\d+\s*(.*)-joystick/;	
	const regexEventIdentifier =  /.*\/(event\d+)/;
	
	/* Parsing linux commands to get "eventY" corresponding to "jsX"*/
	/* Y can be equal to X*/
	var match = characterDevicePath.match(regexJSIdentifier);	
	var linuxCommandResultBuffer = child_process.execSync(`ls -l /dev/input/by-id | grep ${match[1]}`)	
	match = linuxCommandResultBuffer.toString().match(regexFieldControllerName);	
	linuxCommandResultBuffer = child_process.execSync(`ls -l /dev/input/by-id | grep ${match[1]}-event-joystick`)	
	match = linuxCommandResultBuffer.toString().match(regexEventIdentifier);
	
	return `/dev/input/${match[1]}`
}


/**************************************************/
/*	                                              */
/*                                                */
/*						CLASSES	                  */
/*                                                */
/*                                                */
/**************************************************/
export class GameController extends EventEmitter{
	
	//the class constructor
    /**
     * constructor description
     * @param  {String} characterDevicePath  Linux Path of the character device file as "/dev/input/js{{number}]"     
     * @param  {Number } axisThresholdPercentage  Number between 0 to 1 which the sensibility to the gameController object to rise event with Axis movement
     * @param  {String} JsonMappingFilePath path to a normalized JSON file which permits to help to determine . For for information  see ??? ( Documentation currently not written)
     */
	constructor(characterDevicePath,axisThresholdPercentage = 0.2, JsonMappingFilePath = null) {
		super();		
		
		
		this.eventNB = 0 // TO DELETE !!!
		
		
		
		
		this.characterDevicePath	= characterDevicePath

		try {
			this.fileDescriptor = fs.openSync(this.characterDevicePath, fs.constants.O_RDWR)
		} catch (error) {
			throw new Error(`Error opening ${this.characterDevicePath}. Check path and if controller is plugged.`)
			return;
		}
		
		try {
			this.mappingPath = JsonMappingFilePath
			this.gameControllerMapping= JSON.parse(fs.readFileSync(this.mappingPath, { encoding: 'utf8', flag: 'r' }))			
		} catch (error) {
			this.mappingPath = `(Not Valid Path ) ${JsonMappingFilePath}`
			this.gameControllerMapping = null			
		}
		
		this.eventFilePath			= getEventFilePathByCharacterDevicePath(this.characterDevicePath)		
		this.eventFile				= fs.openSync(this.eventFilePath, fs.constants.O_RDWR)
		
		/*get driverVersion numbers*/
		const bufferdriverVersionNumbers = new Buffer.alloc(uint64_t)		
		ioctl(this.fileDescriptor, JSIOCGVERSION, bufferdriverVersionNumbers)
		this.driverVersion = `${bufferdriverVersionNumbers[PRIMARY_driverVersion_NUMBER]}.${bufferdriverVersionNumbers[SECONDARY_driverVersion_NUMBER]}.${bufferdriverVersionNumbers[TERTIARY_driverVersion_NUMBER]}`		
		
		/*get number of buttons on game controller */
		var bufferButtonsNumber = new Buffer.alloc(uint64_t)
		ioctl(this.fileDescriptor, JSIOCGBUTTONS ,bufferButtonsNumber);		
		this.buttonsNumber = bufferToInt64(bufferButtonsNumber)
		
		/*get number of axes on game controller */
		var bufferAxesNumber = new Buffer.alloc(uint64_t)
		ioctl(this.fileDescriptor, JSIOCGAXES ,bufferAxesNumber);		
		this.axesNumber = bufferToInt64(bufferAxesNumber)		
		
		/*get name of the game controller */
		var bufferControllerName = new Buffer.alloc(NAME_LENGTH)
		ioctl(this.fileDescriptor, JSIOCGNAME ,bufferControllerName);
	
		var lastCharPosition = 0		
		for (var i = 0 ; i< (bufferControllerName.length) ;i++){	
			if (bufferControllerName[i] == 0x00){
				break
			}			
			lastCharPosition++
		}				
		this.controllerName = Buffer.copyBytesFrom(bufferControllerName, 0, lastCharPosition).toString()		
		
		fs.closeSync(this.fileDescriptor)		
		
		this.ButtonsList = Array(this.buttonsNumber)
		for(let i =0; i<  this.ButtonsList.length; i++){			
			//this.ButtonsList[i]= new Button(i,`button_${i}`)
			this.ButtonsList[i]	= new Button(i,this.gameControllerMapping.buttons[`_${i}`]	!= null ? this.gameControllerMapping.buttons[`_${i}`] : `button_${i}`)
		}		
		
		this.AxesList = Array(this.axesNumber)
		for(let i =0; i<  this.AxesList.length; i++){
			//this.AxesList[i]= new Axis(`Axis_${i}`)
			this.AxesList[i]	= new Axis(i,this.gameControllerMapping.axes[`_${i}`]		!= null ? this.gameControllerMapping.axes[`_${i}`] : `axis_${i}`)			
		}		
		
		this.lastEvent ={
			time		:0,
			value		:0,
			type		:0,
			elementID	:0
		};
		
		this.hasRumble = this.checkRumbleAvailability()		
		this._ff_id = -1
		
		this.setAxisThresholdPercentage(axisThresholdPercentage)
		
		/*async Method which reads continuously the character device file and parse event from driver written in the file*/
		this.readControllerEventDynamically()
	}
	
	/** 
	* Method which permits to send IOCTL commands to controller's driver, in order if the controller is able to rumble
	*
	* @returns {boolean}  return True if controller is able to rumble
	*/	
	checkRumbleAvailability(){
		const Number_Of_UInt64_For_Buffer = 4 	
		var bufferHasFF = new Buffer.alloc(Number_Of_UInt64_For_Buffer*uint64_t) //->  
		
		// Questions the driver to know if controllers has  'Force Feedback' feature
		let has_ff = input.EVIOCGBIT(input.EV_FF, CHAR_BIT_SIZE * Number_Of_UInt64_For_Buffer )		
		
		/* Send request to driver, return -1 if error */
		/* Driver answers is saved in  'bufferHasFF" */
		if (ioctl(this.eventFile, has_ff, bufferHasFF) == -1){
            return false
		}		
		
		/* Extract the second Int in Buffer*/
		const orderedBufferHasFF = Buffer.copyBytesFrom(bufferHasFF, 8, uint64_t);		// 8 for 8th Bytes in Buffer				
		
		//operation to send the bit which permits to know if the controller can vibrate,to the LSB position. Then erases all others bits			
		if (bufferToInt64(orderedBufferHasFF) >> FF_RUMBLE %(uint64_t * NUMBER_OF_BIT_IN_BYTE) & 0x1 === 1)
			return true
		else
			return false
	}
	
	/**
	* Permits to dinamically change axis event rising sensibility
	* @param {Number} threshold Percentage threshold.  Number between 0 and 1
	**/	
	setAxisThresholdPercentage(threshold){
		if (typeof threshold == 'number'){
			if (threshold> 1) {
			threshold = 1
		}		
		if (threshold< 0) {
			threshold = 0
		}
			this.axisThresholdPercentage= threshold 	
		}else{
			throw new Error ("The parameter 'axisThresholdPercentage' is not a number")
		}
	}
	
	/** 
	* Method which permits to send IOCTL commands to controller's driver, in order if the controller is able to rumble
	* @param {Number} leftMotorPercentage Intensity of rumble of Right motor in %
	* @param {Number} rightMotorPercentage Intensity of rumble of Right motor in %
	* @param {Number} duration Duration of Rumble in milliseconds
	* No return Value	
	*/	
	vibrate(leftMotorPercentage, rightMotorPercentage, duration){
        if (this.hasRumble){
			
			if (leftMotorPercentage > 1){
					leftMotorPercentage =1
			}
			
			if (leftMotorPercentage < 0){
					leftMotorPercentage =0
			}
			
			if (rightMotorPercentage > 1){
					rightMotorPercentage =1
			}
			
			if (rightMotorPercentage < 0){
					rightMotorPercentage =0
			}       

			duration= Math.abs(duration)			
			
			var left_abs = leftMotorPercentage*MAX_VALUE_UINT16
			var right_abs = rightMotorPercentage*MAX_VALUE_UINT16
			
			var stop =  new Buffer.from([input.EV_FF,this._ff_id, 0])
			
			//if (this.eventFile.write(stop) == -1){
			console.log(this.eventFilePath);			
			fs.writeFileSync("./essai.txt", "abcd")
				// file written successfully
			
				
			/*
			if (fs.writeFileSync(this.eventFile, "abcd") == -1){
				return false
			}
			*/			
			/*
						
			if self._eventFilePath.write(stop) == -1:
				return False
			
			self._eventFilePath.flush()
			
			
			self._ff_id = int.from_bytes(buf[1:3], 'big')		
			
			*/
			/*
			left_abs = int(left*)
			right_abs = int(right*65535)

			stop = input_event(EV_FF, self._ff_id, 0)
			if self._eventFilePath.write(stop) == -1:
				return False
			self._eventFilePath.flush()

			effect = ff_effect(FF_RUMBLE, -1, duration, 0, left_abs, right_abs)
			try:
				buf = ioctl(self._eventFilePath, EVIOCSFF, effect)
			except OSError:
				# Heavy usage yields a
				# [Errno 28] No space left on device
				# Simply reset and continue rumbling :)
				self._ff_id = -1
				self._eventFilePath.close()
				self._eventFilePath = open(self._get_eventFilePath(), 'wb')
				return self.set_rumble(left, right, duration)

			self._ff_id = int.from_bytes(buf[1:3], 'big')

			play = input_event(EV_FF, self._ff_id, 1)
			if self._eventFilePath.write(play) == -1:
				return False
			self._eventFilePath.flush()

			return True
			*/
		}
	}
	
	
	/** 	
	*  parsed driver event
	*/	
	eventReading(newEvent){
		const eventsInByteArray= Array.from(Buffer.from(newEvent))
		this.lastEvent.time	 =	eventsInByteArray[3]*256^3 + eventsInByteArray[2]*256^2 + eventsInByteArray[1]*256^1 +eventsInByteArray[0]*256^0//u32
		this.lastEvent.value	 =	eventsInByteArray[5]* +256 + eventsInByteArray[4] //s16
		// NodeJs use 32 bit signed integer.
		// We have to realize a kind of conversion to have a Uint16 number representation : 		
		if (this.lastEvent.value> MAX_VALUE_INT16){
			this.lastEvent.value =  (this.lastEvent.value | 0xFFFF0000)
			this.lastEvent.value =  (this.lastEvent.value & 0xFFFF7FFF) + MAX_VALUE_INT16 + 1				
		}
		
		this.lastEvent.elementID = 	eventsInByteArray[7]//u8
		this.lastEvent.type   = 	eventsInByteArray[6]//u8		
			
	}

	/** 	
	*  Rise JS event after having memorized button state
	*/
	buttonManagement(){		
		this.ButtonsList[this.lastEvent.elementID].setState(this.lastEvent.value >= 1 ? true : false)
		this.vibrate(0.5, 0.5, 2)
		this.emit('GameControllerEvent', this);
	}

	/** 	
	*  Rise JS event after having memorized axis state
	*/
	axeManagement(){		
		const axis = this.lastEvent.elementID
		this.AxesList[axis].value = this.lastEvent.value/ MAX_VALUE_INT16 // convert to % percentage		
		this.emit('GameControllerEvent', this);
	}
	
	
	/** 
	* Test Method to display controller state
	*/	
	async readControllerEventDynamically(){		
		const readStream = fs.createReadStream(this.characterDevicePath);
		for await(const newEvent of readStream) {
			
			this.eventReading(newEvent)
			
			switch (this.lastEvent.type) {
				case JS_EVENT_BUTTON:
					this.buttonManagement()
				break				
				case JS_EVENT_AXIS:			
					this.axeManagement()
				break				
			}		
		}
	}
	
	/** 
	* @return {Object} State of all controller's buttons and axis . The JSON objects depends on JsonMappingFilePath JSON's structure
	*/
	getControllerState(){		
		const controllerState ={
			"buttons" :{},			
			"axes" :{}			
		}
		
		if (this.gameControllerMapping != null){
			for(let i =0; i<  this.ButtonsList.length; i++){
				controllerState.buttons[`${this.ButtonsList[i].name}`] = this.ButtonsList[i].state
			}
			
			for(let i =0; i<  this.AxesList.length; i++){
				controllerState.axes[`${this.AxesList[i].name}`] = this.AxesList[i].value
			}		
		}	
		
		return controllerState
	}	
	
	/** 	
	* @override
	* @return {String} return a string with mains data from controller
	*/		
	toString(){
		var canRumble
		if  (this.hasRumble){
			canRumble = "Controller is able to rumble"
		}else{
			canRumble = "Controller can not rumble"
		}		
		return `The controller ${this.controllerName}. Its driver is in version ${this.driverVersion}. It has ${this.buttonsNumber} buttons and ${this.axesNumber} axes.${canRumble}`
	}
	
	/** 		
	* @override
	* @return {Object} return a JSON Object with mains data from controller
	*/	
	toJSON(){
		return {
			controllerName		: this.controllerName,
			characterDevicePath	: this.characterDevicePath,
			eventFilePath		: this.eventFilePath,			
			driverVersion		: this.driverVersion,
			JSONmappingPath		: this.mappingPath,
			buttonsNumber		: this.buttonsNumber,
			axesNumber			: this.axesNumber,
			hasRumble			: this.hasRumble,
			lastEvent			: this.lastEvent			
		}		
	}
}


class Button {	
	constructor(ID, name="") {
		if (ID == null) {						
			throw new Error('ID not defined');
		}		
		
		if (typeof ID != 'number'){
			throw new Error('ID is not number');
		}
		
		if (name != null){
			this.name = name
		}
		
		this.ID		= ID
		this.state	= false
	}
	
	setState(state){
		if (typeof state == 'boolean'){
			this.state = state
		}
	}
	
	getState(){
		return this.state
	}
	
	rename(newName){
		this.setName(newName)
	}
	
	setName(name){
		if (typeof name == 'string'){
			this.name = newName
		}		
	}
	
	/**
	* @override
	* @return {Object} return a string with mains data from button
	*/
	toString(){
		
	}
	
	/**
	* @override
	* @return {Object} return a JSON Object with mains data from button
	*/
	toJSON(){
		return {
			
		}
	}
}

class Axis {	
	constructor(ID, name="") {
		if (ID == null) {						
			throw new Error('ID not defined');
		}		
		
		if (typeof ID != 'number'){
			throw new Error('ID is not number');
		}
		
		if (name != null){
			this.name = name
		}
		
		this.ID		= ID
		this.value	= 0
	}
	
	setValue(value){
		if (typeof value == 'number'){
			this.value = value
		}
	}
	
	getValue(){
		return this.value
	}
	
	rename(newName){
		this.setName(newName)
	}
	
	setName(name){
		if (typeof name == 'string'){
			this.name = newName
		}		
	}
	
	/**
	* @override
	* @return {Object} return a string with mains data from button
	*/
	toString(){
		
	}
	
	/**
	* @override
	* @return {Object} return a JSON Object with mains data from button
	*/
	toJSON(){
		return {
			
		}
	}
}
