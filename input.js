/****************************************************************************/
/* Name			: input.js												    */
/* purpose		: Definition of const used to communicate with Linux		*/
/*				 	controller driver										*/
/* Author	 	: Alexandre Ribault                                         */
/* Creation		: 03/23/2024                                                */
/* Last update	: 03/23/2024												*/
/* Version		: 1.0.0                                                     */
/****************************************************************************/
/*                                                                          */
/*					DISPLAY OPTIMISED FOR NOTEPAD++							*/
/*                                                                          */
/****************************************************************************/

/*
	Porting of works of :
	-	Linus Groh , on python lib "xbox360controller"
		https://github.com/linusg/xbox360controller

		Thank to him!
*/


/*
	Historic :
		Version 1.0.0 :
			Creation of the file input.js
*/


/**************************************************/
/*	                                              */
/*                                                */
/*					DEPENDENCIES                  */
/*                                                */
/*                                                */
/**************************************************/
import * as ioctl_macros_and_constants from './ioctl_macros_and_constants.js'

/**************************************************/
/*	                                              */
/*                                                */
/*					Constants	                  */
/*                                                */
/*                                                */
/**************************************************/
//Event 'Force Feedback'
// https://www.kernel.org/doc/html/v4.13/input/ff.html
export const EV_FF			= 0x15

// https://github.com/torvalds/linux/blob/master/include/uapi/linux/input-event-codes.h#L342
export const BTN_MISC		= 0x100

// https://github.com/torvalds/linux/blob/master/include/uapi/linux/input-event-codes.h#L365
export const BTN_TRIGGER	= 0x120
export const BTN_THUMB		= 0x121
export const BTN_THUMB2		= 0x122
export const BTN_TOP		= 0x123
export const BTN_TOP2		= 0x124
export const BTN_PINKIE		= 0x125
export const BTN_BASE		= 0x126
export const BTN_BASE2		= 0x127
export const BTN_BASE3		= 0x128
export const BTN_BASE4		= 0x129
export const BTN_BASE5		= 0x12a
export const BTN_BASE6		= 0x12b
export const BTN_DEAD		= 0x12f
export const BTN_SOUTH		= 0x130
export const BTN_EAST		= 0x131
export const BTN_C			= 0x132
export const BTN_NORTH		= 0x133
export const BTN_WEST		= 0x134
export const BTN_Z			= 0x135
export const BTN_TL			= 0x136
export const BTN_TR			= 0x137
export const BTN_TL2		= 0x138
export const BTN_TR2		= 0x139
export const BTN_SELECT		= 0x13a
export const BTN_START		= 0x13b
export const BTN_MODE		= 0x13c
export const BTN_THUMBL		= 0x13d
export const BTN_THUMBR		= 0x13e
export const BTN_B			= BTN_EAST
export const BTN_X			= BTN_NORTH
export const BTN_Y			= BTN_WEST
export const BTN_A			= BTN_SOUTH

// https://github.com/torvalds/linux/blob/master/include/uapi/linux/input-event-codes.h#L717
export const ABS_X			= 0x00
export const ABS_Y			= 0x01
export const ABS_Z			= 0x02
export const ABS_RX			= 0x03
export const ABS_RY			= 0x04
export const ABS_RZ			= 0x05
export const ABS_THROTTLE	= 0x06
export const ABS_RUDDER		= 0x07
export const ABS_WHEEL		= 0x08
export const ABS_GAS		= 0x09
export const ABS_BRAKE		= 0x0a
export const ABS_HAT0X		= 0x10
export const ABS_HAT0Y		= 0x11
export const ABS_HAT1X		= 0x12
export const ABS_HAT1Y		= 0x13
export const ABS_HAT2X		= 0x14
export const ABS_HAT2Y		= 0x15
export const ABS_HAT3X		= 0x16
export const ABS_HAT3Y		= 0x17
export const ABS_PRESSURE	= 0x18
export const ABS_DISTANCE	= 0x19
export const ABS_TILT_X		= 0x1a
export const ABS_TILT_Y		= 0x1b
export const ABS_TOOL_WIDTH = 0x1c
export const ABS_VOLUME		= 0x20
export const ABS_MISC		= 0x28

/****************************************************/
/*	                                              	*/
/*                                                	*/
/*						FUNCTIONS                 	*/
/*                                                	*/
/*                                                	*/
/****************************************************/


/****************************************************/
/* Name		:EVIOCGBIT	                          	*/
/* Purpose	:determine the types of features/event	*/
/* supported by any particular device				*/
/* Input(s)                                       	*/
/*	- {Number} event 		 			          	*/
/*  - {Number} length                             	*/
/* Output(s)                                       	*/
/*  - {Number} 	
/****************************************************/
/** 
 * @param {Number} event 
 * @param {Number} length
 * @returns {Number}  -1 if error, 0 or positive number in case of success
 */ 
export function EVIOCGBIT(event, length){	 
	return ioctl_macros_and_constants._IOC(ioctl_macros_and_constants._IOC_READ , 'E', 0x20 + event, length) // 69 -> Ascii code for 'E'
}