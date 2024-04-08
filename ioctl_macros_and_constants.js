/****************************************************************************/
/* Name		: ioctl_macros_and_constants.js									*/
/* Function : porting of defined constantes and macros in file				*/
/*			  usr/include/asm-generic/ioctl.h for  Javascript nodeJS		*/
/* Author 	: Alexandre Ribault                                             */
/* Creation : 14/03/2024                                                    */
/* Version	: 1.0.0                                                         */
/****************************************************************************/
/*                                                                          */
/*					DISPLAY OPTIMISED FOR NOTEPAD++		                    */
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
			Creation of the file ioctl_macros_and_constants.js
*/

export const _IOC_NRBITS	= 8
export const _IOC_TYPEBITS	= 8
export const _IOC_SIZEBITS	= 14
export const _IOC_DIRBITS	= 3

export const _IOC_NRSHIFT	= 0

export const _IOC_NONE		= 0
export const _IOC_WRITE		= 1
export const _IOC_READ		= 2	
	
export const _IOC_NRMASK	= ((1 << _IOC_NRBITS	) -1)
export const _IOC_TYPEMASK	= ((1 << _IOC_TYPEBITS	) -1)
export const _IOC_SIZEMASK	= ((1 << _IOC_SIZEBITS	) -1)
export const _IOC_DIRMASK	= ((1 << _IOC_DIRBITS	) -1)
	
export const _IOC_TYPESHIFT = (_IOC_NRSHIFT+_IOC_NRBITS)
export const _IOC_SIZESHIFT = (_IOC_TYPESHIFT+_IOC_TYPEBITS)
export const IOCSIZE_SHIFT	= _IOC_SIZESHIFT
export const _IOC_DIRSHIFT	= (_IOC_SIZESHIFT+_IOC_SIZEBITS)

export const IOC_IN			= (_IOC_WRITE << _IOC_DIRSHIFT)
export const IOC_OUT		= (_IOC_READ << _IOC_DIRSHIFT)
export const IOC_INOUT		= ((_IOC_WRITE|_IOC_READ) << _IOC_DIRSHIFT)
export const IOCSIZE_MASK	= (_IOC_SIZEMASK << _IOC_SIZESHIFT)


/**
 * Main function for bit-by-bit operations, which permits to generate the value to send itctl(function)
 * @property {number} dir	No definition available in original IOCTL.H file
 * @property {number|string} type	No definition available in original IOCTL.H file
 * @property {number} nr	No definition available in original IOCTL.H file
 * @property {number} size	No definition available in original IOCTL.H file
 * @returns {number} Numerical value of the instrution to send to driver
 */
export function _IOC(dir,type,nr,size){	

	if (typeof  type == "string"){			
			type= type.charCodeAt(0)			
	}	
	return	(			
				( dir  << _IOC_DIRSHIFT)	|
				(type << _IOC_TYPESHIFT )	|
				( nr   << _IOC_NRSHIFT  )	|
				( size << _IOC_SIZESHIFT)
			)	
}


/**
 * No definition available original IOCTL.H file
 * @property {number|string} type No definition available in original IOCTL.H file. If type is a string, only the first character will be converted in ASCII value
 * @property {number} nr	No definition available in original IOCTL.H file
 * @returns {number} Numerical value of the instrution to send to driver
 */
export function _IO(type, nr){
	if (typeof  type == "string")
		type= type.charCodeAt(0)
	return _IOC(_IOC_NONE,type,nr,0)	
}


/**
 * Permits to calculate a reading instruction for driver
 * Becarefull, it doesn't behave the comportment as orginal Macro, because we can't send pointer in JS.
 * The original macro get the size, in bytes, of the variable type pointed by third parameter.
 * This ported function need the number of bytes that would have been calculated by the orignial function.
 * As exemple, in C, we uses *int. With current hardwares, the variable pointed by a *int needs 8 bytes.
 
 * @property {number|string} type	No definition available in original IOCTL.H file.  If type is a string, only the first character will be converted in ASCII value
 * @property {number} nr	No definition available in original IOCTL.H file
 * @property {number} variableSizeInBytes	Size of the variable in bytes
 * @returns {number} Numerical value of the instrution to send to driver
 */
export function _IOR(type, nr, variableSizeInBytes){	
	if (typeof  type == "string"){
		type= type.charCodeAt(0)
	}
	return _IOC(_IOC_READ,type,nr,variableSizeInBytes)
}

/**
 * Permits to calculate a writing instruction for driver
 * Becarefull, it doesn't behave the comportment as orginal Macro, because we can't send pointer in JS.
 * The original macro get the size, in bytes, of the variable type pointed by third parameter.
 * This ported function need the number of bytes that would have been calculated by the orignial function.
 * As exemple, in C, we uses *int. With current hardwares, the variable pointed by a *int needs 8 bytes.
 
 * @property {number|string} type	No definition available in original IOCTL.H file.  If type is a string, only the first character will be converted in ASCII value
 * @property {number} nr	No definition available in original IOCTL.H file
 * @property {number} variableSizeInBytes	Size of the variable in bytes
 * @returns {number} Numerical value of the instrution to send to driver
 */
export function _IOW(type, nr, variableSizeInBytes){
	if (typeof  type == "string")
		type= type.charCodeAt(0)
	return _IOC(_IOC_WRITE,type,nr,variableSizeInBytes)
}

/**
 * Permits to calculate a reading or writing instruction for driver
 * Becarefull, it doesn't behave the comportment as orginal Macro, because we can't send pointer in JS.
 * The original macro get the size, in bytes, of the variable type pointed by third parameter.
 * This ported function need the number of bytes that would have been calculated by the orignial function.
 * As exemple, in C, we uses *int. With current hardwares, the variable pointed by a *int needs 8 bytes.
 
 * @property {number|string} type			No definition available in original IOCTL.H file . If type is a string, only the first character will be converted in ASCII value
 * @property {number} nr					No definition available in original IOCTL.H file
 * @property {number} variableSizeInBytes	Size of the variable in bytes
 * @returns {number} Numerical value of the instrution to send to driver
 */
export function _IOWR(type, nr, variableSizeInBytes){
	if (typeof  type == "string")
		type= type.charCodeAt(0)
	return _IOC(_IOC_WRITE|_IOC_READ,type,nr,variableSizeInBytes)
}



/**
 *	Generic function used by the 4 next ported functions
 * @property {number} nr No definition available in original IOCTL.H file
 * @property {number} _IOC_GENSHIFT	No definition available in original IOCTL.H file
 * @property {number} _IOC_GENMASK	Size of the variable in bytes
 * @returns {number} No definition available in original IOCTL.H file
*/
function _IOC_GEN(nr, _IOC_GENSHIFT, _IOC_GENMASK){
	return (((nr) >> _IOC_GENSHIFT) & _IOC_GENMASK)
}

/**
 * No definition available in original IOCTL.H file
 * @property {number} nr	No definition available in original IOCTL.H file
 * @returns {number} No definition available in original IOCTL.H file
 */
export function _IOC_DIR(nr){	
	return _IOC_GEN(nr, _IOC_DIRSHIFT, _IOC_DIRMASK)
}

/**
 * No definition available in original IOCTL.H file
 * @property {number} nr	No definition available in original IOCTL.H file
 * @returns {number} No definition available in original IOCTL.H file
 */
export function _IOC_TYPE(nr){
	return _IOC_GEN(nr, _IOC_TYPESHIFT, _IOC_TYPEMASK)
}

/**
 * No definition available in original IOCTL.H file
 * @property {number} nr	No definition available in original IOCTL.H file
 * @returns {number} No definition available in original IOCTL.H file
 */
export function _IOC_NR(nr){
	return _IOC_GEN(nr, _IOC_NRSHIFT, _IOC_NRMASK)
}

/**
 * No definition available in original IOCTL.H file
 * @property {number} nr	No definition available in original IOCTL.H file
 * @returns {number} No definition available in original IOCTL.H file
 */
export function _IOC_SIZE(nr){
	return _IOC_GEN(nr, _IOC_SIZESHIFT, _IOC_SIZEMASK)
}

