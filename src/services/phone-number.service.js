const EventEmitter = require("events");
const { parsePhoneNumberWithError } = require('libphonenumber-js');
const { getCountry } = require('countries-and-timezones');

class PhoneNumberService extends EventEmitter {
  static getCountryFromPhoneNumber(phoneNumber) {
    try {
      const parsedNumber = parsePhoneNumberWithError(phoneNumber);
      
      if (!parsedNumber.isValid()) { 
        return null;
      }

      const countryData = getCountry(parsedNumber.country);
      return countryData?.name || parsedNumber.country;
      
    } catch (error) {
      console.error('Error in PhoneNumberService:', error);
      return null;
    }
  }
}

module.exports = PhoneNumberService