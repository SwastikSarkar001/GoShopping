import { z } from 'zod'
import libphonenumber from 'google-libphonenumber'
import { passwordStrength } from 'check-password-strength'

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()

const UserSchema = z.object({
  userid: z
    .number()
    .positive()
    .int()
    .describe('The unique identifier for the user'),
  firstname: z
    .string()
    .regex(/^[A-Za-z'-]+$/, { message: 'First name must contain only alphabets, hyphens and apostrophes' })
    .describe('The first name of the user'),
  middlename: z
    .string()
    .optional()
    .refine(name => name !== undefined && (name === '' || /^[A-Za-z'-]+\.?$/.test(name)), { message: 'Middle name must contain only alphabets, hyphens and apostrophes and may end with a full stop' })
    .default('')
    .describe('The middle name of the user'),
  lastname: z
    .string()
    .regex(/^[A-Za-z'-]+$/, { message: 'Last name must contain only alphabets, hyphens and apostrophes' })
    .describe('The last name of the user'),
  email: z
    .string()
    .email()
    .describe('The email address of the user'),
  phone: z
    .string()
    .refine(
      phoneNumber => {
        try {
          return phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber))
        } catch (error) {
          return false
        }
      }, { message: 'Phone number is invalid. Only international phone numbers starting with the country code are valid.' }
    )
    .describe('The phone number of the user'),
  city: z.string().describe('The city of residence of the user'),
  state: z.string().describe('The state of residence of the user'),
  country: z.string().describe('The country of residence of the user'),
  password: z
    .string()
    .min(10, { message: 'Password must be at least 10 characters long' })
    .refine(
      password => {
        const data = passwordStrength(password)
        return data.id >= 2 && data.contains.length === 4
      },
      { message: 'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.' }
    )
    .describe('The password of the user, must be more than 10 characters long and must contain an uppercase letter, a lowercase letter, a digit and a special symbol'),
})

export default UserSchema