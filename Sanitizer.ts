import validator from 'validator';
import moment from "moment";

class Sanitizer {
    static isValidEmail(email: string) {
        if (!email) {
            return false;
        }
        return validator.isEmail(email);
    }

    static isValidFCMToken(fcmToken: string) {
        if (!fcmToken) {
            return false;
        }
        const tokenRegex = /^[a-zA-Z0-9:_-]{140,200}$/;
        return tokenRegex.test(fcmToken);
    }

    static isValidPassword(password: string) {
        if (!password) {
            return false;
        }

        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return false;
        }
        if (!hasUpperCase) {
            return false;
        }
        if (!hasLowerCase) {
            return false;
        }
        if (!hasNumber) {
            return false;
        }
        return hasSpecialChar;


    }

    static isValidName(name: string) {
        if (!name) {
            return false;
        }
        if (name.length < 3) {
            return false;
        }
        return name.length <= 50;

    }

    static isValidMobileNo(mobileNo: string) {
        if (!mobileNo) {
            return false;
        }
        if (mobileNo.length !== 10) {
            return false;
        }

        return validator.isNumeric(mobileNo);

    }

    static isValidNumber(number: number) {
        if (Number.isNaN(number) || number===undefined || number===null) {
            return false;
        }

        return validator.isNumeric(number.toString());
    }

    static isValidRegNo(number: string) {
        if (number===undefined || number===null) {
            return false;
        }

        return number.length === 10

    }

    static sanitizeString(input: string) {
        // Trim the input string
        input = input.trim();

        // Remove HTML tags
        input = input.replace(/<\/?[^>]+(>|$)/g, "");

        // Remove any characters that are not letters, numbers, whitespace, punctuation, or symbols
        return input.replace(/[^\p{L}\p{N}\s\p{P}\p{S}]/gu, '');
    }
}

export default Sanitizer;