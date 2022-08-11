import validator from 'validator';
import moment from 'moment';

/*
 * This class contains methods for validating fields using 'validator.js' library methods
 * The methods return error message if validation failed and false otherwise
 * You can use all supported validators and sanitizers of 'validator.js' libaray
 * See their docs here https://github.com/validatorjs/validator.js
 */

class ValidateFields {
    /*
     * A method that takes in the email
     * Validates it
     * Returns the response either error or false if there is no error
     */
    validateEmail(email) {
        if (validator.isEmpty(email)) {
            return 'Email is required';
        } else if (!validator.isEmail(email)) {
            return 'Invalid Email';
        }
        return false;
    }

    validatePassword(password) {
        if (validator.isEmpty(password)) {
            return 'Password is required';
        } else if (!validator.isLength(password, { min: 8 })) {
            return 'Password should be minimum 8 characters';
        }
        return false;
    }

    validateString(string, isNull) {
        if (string) {
            if (validator.isEmpty(string) && !isNull) {
                return 'حقل نص مطلوب'
            }
            return false;
        }
        if (!isNull) {
            return 'حقل نص مطلوب'
        }
        return false;
    }

    validateInt(int, isNull) {
        if (int) {
            if (validator.isEmpty(int) && !isNull) {
                return 'حقل رقم مطلوب'
            } else if (!validator.isNumeric(int)) {
                return 'صيغة رقم غير صحيحة'
            }
            return false;
        }
        if (!isNull) {
            return 'حقل رقم مطلوب'
        }
        return false;
    }
    validatenumber(number, isNull) {
        if (number) {
            if (validator.isEmpty(number) && !isNull) {
                return 'حقل رقم مطلوب'
            } else if (!validator.isNumeric(number)) {
                return 'صيغة رقم غير صحيحة'
            }
            return false;
        }
        if (!isNull) {
            return 'حقل رقم مطلوب'
        }
        return false;
    }

    validateDate(date, isNull) {
        if (date) {
            if (!validator.isDate(moment(date).format("YYYY-MM-DD"))) {
                return 'صيغة تاريخ غير صحيحة'
            } else if (validator.isEmpty(moment(date).format("YYYY-MM-DD")) && !isNull) {
                return 'تاريخ مطلوب'
            }
            return false;
        }
        if (!isNull) {
            return 'صيغة تاريخ غير صحيحة'
        }
        return false;
    }
}

const validateFields = new ValidateFields();

// export the class instance, so we can import and use it anywhere
export { validateFields };