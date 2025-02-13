import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import StepNavigator from './Sign Up Components/StepNavigator'
import UserRegistration from './Sign Up Components/UserRegistration'
import EmailVerification from './Sign Up Components/EmailVerification'
import UserPasswordSetup from './Sign Up Components/UserPasswordSetup'
import PhoneNumberVerification from './Sign Up Components/PhoneNumberVerification'
import UserLocation from './Sign Up Components/UserLocation'
import UserConsent from './Sign Up Components/UserConsent'
import { signUpDispatchType, UserCredentialsType } from './AuthenticationPage'
import { useAppDispatch } from '../../states/store'
import { createUserAccount } from '../../states/reducers/userSlice'
import { toast } from 'sonner'
import { passwordStrength } from 'check-password-strength'

/**
 * Determines whether the current step in the sign-up process should be blocked based on the provided user credentials.
 *
 * @param {number} step - The current step in the sign-up process.
 * @param {UserCredentialsType} data - The user credentials data.
 * @returns {boolean} - Returns `true` if the step should be blocked, otherwise `false`.
 *
 * @remarks
 * The function checks different conditions based on the step number:
 * - Step 1: Blocks if the first name or last name is empty.
 * - Step 2: Always allows to proceed (intended for email verification logic).
 * - Step 3: Blocks if the password or confirmation password is empty, or if they do not match.
 * - Step 4: Always allows to proceed (intended for phone verification logic).
 * - Step 5: Blocks if the city, state, or country is empty.
 * - Step 6: Always allows to proceed.
 * - Default: Blocks by default for any undefined step.
 */
function blocker(step: number, data: UserCredentialsType): boolean {
  switch (step) {
    case 1:
      return data.fname.trim() === '' || data.lname.trim() === ''
    case 2:
      return false // Intentionally set to false to allow logic for email verification
    case 3:
      return (
        data.password === '' ||
        data.confirm === '' ||
        data.password.length < 10 ||
        passwordStrength(data.password).id < 2 ||
        passwordStrength(data.password).contains.length !== 4 ||
        data.password !== data.confirm
      )
    case 4:
      return false // Intentionally set to false to allow logic for phone verification
    case 5:
      return data.city.trim() === '' || data.state.trim() === '' || data.country.trim() === ''
    case 6:
      return false // Intentionally set to false to allow custom state logic for submission of form
    default:
      return true
  }
}

export type signUpFormPagesProps = {
  /** The user data of Registration Form */
  data: UserCredentialsType,
  /** Function to change the data in the form */
  changeData: (type: signUpDispatchType['type'], value: string) => void
}

type signUpFormProps = {
  /** Toggler to swich to Sign In Form */
  openSignIn: () => void
  /** User Sign Up Credentials */
  userCredentials: UserCredentialsType
  /** Function to dispatch the user credentials */
  dispatch: (dispatchObj: signUpDispatchType) => void
  /** Array State to hold the saved values during verification of user data */
  savedData: (string | null)[]
  /** Function to update the saved data */
  setSavedData: React.Dispatch<React.SetStateAction<(string | null)[]>>
  /**
   * Array State to check whether the verification of a particular data has succeeded or not
   * and if verification is successful then disable all of the related fields
   */
  disableAll: boolean[]
  /** Function to update the disabled state */
  setDisableAll: React.Dispatch<React.SetStateAction<boolean[]>>
  otpValue: string[]
  setOtpValue: React.Dispatch<React.SetStateAction<string[]>>
  allChecked: boolean
  setAllChecked: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SignUpForm({
  openSignIn,
  userCredentials,
  dispatch,
  savedData,
  setSavedData,
  disableAll,
  setDisableAll,
  otpValue,
  setOtpValue,
  allChecked,
  setAllChecked
}: signUpFormProps) {
  const changeData = (type: signUpDispatchType['type'], value: string) => {
    dispatch({ type: type, value: value })
  }

  const navigate = useNavigate()
  const dispatchUser = useAppDispatch()
  const submitFunction = async (e: React.FormEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault()
      
      const createUser = dispatchUser(createUserAccount(userCredentials)).unwrap()
      toast.promise(createUser, {
        loading: 'Creating your account...',
        success: () => {
          navigate('/features', { replace: true })
          return 'Registration successful! You are now a part of eazzyBizz family.'
        },
        error: (error) => `Registration failed! ${ error.message }`,
      })
      // useCreateUserAfterRegistration(userCredentials)
    } catch (error) {
      console.error(error)
    }
  }

  /** Update the email field in the form */
  const updateEmail = (value: string | null) => {
    setSavedData(prev => {
      const newState = [...prev]
      newState[0] = value
      return newState
    })
  }

  /** Disable the email field in the form after verification. */
  const disableEmailField = (value: boolean) => {
    setDisableAll(prev => {
      const newState = [...prev]
      newState[0] = value
      return newState
    })
  }

  /** Update the OTP field in the form */
  const updateEmailOtp = (value: string) => {
    setOtpValue(prev => {
      const newState = [...prev]
      newState[0] = value
      return newState
    })
  }

  /** Update the phone number field in the form */
  const updatePhoneNumber = (value: string | null) => {
    setSavedData(prev => {
      const newState = [...prev]
      newState[1] = value
      return newState
    })
  }

  /** Disable the phone number field in the form after verification. */
  const disablePhoneField = (value: boolean) => {
    setDisableAll(prev => {
      const newState = [...prev]
      newState[1] = value
      return newState
    })
  }
  
  /** Update the OTP field in the form */
  const updatePhoneOtp = (value: string) => {
    setOtpValue(prev => {
      const newState = [...prev]
      newState[1] = value
      return newState
    })
  }

  /** Number of inputs in the OTP field */
  const numInputs = 4

  /** Contains the Page Components of various steps */
  const stepPages = [
    <UserRegistration data={ userCredentials } changeData={ changeData } />,
    <EmailVerification
      data={ userCredentials }
      changeData={ changeData }
      savedEmail={ savedData[0] }
      setSavedEmail={ updateEmail }
      otpValue={ otpValue[0] }
      setOtpValue={ updateEmailOtp }
      numInputs={ numInputs }
      disableAll={ disableAll[0] }
      setDisableAll={ disableEmailField }
    />,
    <UserPasswordSetup data={ userCredentials } changeData={ changeData } />,
    <PhoneNumberVerification
      data={ userCredentials }
      changeData={ changeData }
      savedPhone={ savedData[1] }
      setSavedPhone={ updatePhoneNumber }
      otpValue={ otpValue[1] }
      setOtpValue={ updatePhoneOtp }
      numInputs={ numInputs }
      disableAll={ disableAll[1] }
      setDisableAll={ disablePhoneField }
    />,
    <UserLocation data={ userCredentials } changeData={ changeData } />,
    <UserConsent setAllChecked={ setAllChecked } />
  ]
  const [step, setStep] = useState(3)
  const totalSteps = stepPages.length
  
  return (
    <div className='bg-white rounded-2xl flex flex-col items-center justify-center relative h-full'>
      <h1 className="font-bold text-3xl font-source-serif">Get Started!</h1>
      <p className="text-gray-400">Register a new account</p>
      <form className="flex flex-col gap-4 w-[70%] mt-8" method='post'>
        <div className='text-center text-sm'>
          Step { step } of { totalSteps }
        </div>
        { stepPages[step - 1] }
        <StepNavigator
          blockPage={
            blocker(step, userCredentials) || (step === 2 && !disableAll[0]) || (step === 4 && !disableAll[1]) || (step === 6 && !allChecked)
          }
          currentStep={step}
          setStep={setStep}
          totalSteps={totalSteps}
          submitFunc={submitFunction}
        />
      </form>
      <p className="md:hidden md:pointer-events-none text-gray-400 mt-4">
        Already have an account? <button onClick={ openSignIn } className="text-blue-500 hover:underline active:text-purple-500">Sign In</button>
      </p>
    </div>
  )
}