const Joi = require("@hapi/joi");
const JoiPhoneNumber = Joi.extend(require("joi-phone-number"));

function validatePhoneNumber(
	phoneNumber,
	format = "international",
	countryCode = "GH"
) {
	return JoiPhoneNumber.string()
		.trim()
		.regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
		.required()
		.phoneNumber({
			defaultCountry: countryCode.toUpperCase(),
			format: format
		})
		.validate(phoneNumber);
}

function getNewDpFileName(fileName) {
	const date = new Date();
	const extension = fileName.substring(fileName.lastIndexOf('.'))

	return `DP-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}` + 
	`${date.getDate().toString().padStart(2, '0')}` + 
	`${date.getDay().toString().padStart(2, '0')}${date.getUTCHours()}` +
	`${date.getMinutes().toString().padStart(2, '0')}` + 
	`${date.getSeconds().toString().padStart(2, '0')}${extension}`
}

async function moveUploadedFileToPublicFolder(file, publicFolderPath) {
	return file.mv(publicFolderPath, (error) => {
		if (error) {
		return Promise.reject(`Unabled to move file: Error \n${error}`)
		}
		return Promise.resolve(file)
	})
}

module.exports = {
	validatePhoneNumber,
	getNewDpFileName,
	moveUploadedFileToPublicFolder
}