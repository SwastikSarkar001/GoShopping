import { useNavigate } from 'react-router-dom'
import { useState, useReducer, useEffect } from 'react'
import { toast } from 'sonner'
import StepNavigator from './Sign Up Components/StepNavigator'
import UserRegistration from './Sign Up Components/UserRegistration'
import EmailVerification from './Sign Up Components/EmailVerification'
import UserPasswordSetup from './Sign Up Components/UserPasswordSetup'
import PhoneNumberVerification from './Sign Up Components/PhoneNumberVerification'
import UserLocation from './Sign Up Components/UserLocation'
import UserConsent from './Sign Up Components/UserConsent'

type UserCredentialsType = {
  fname: string
  mname: string
  lname: string
  email: string
  password: string
  confirm: string
  phone: string
  city: string
  state: string
  country: string
}

const initialState: UserCredentialsType = {
  fname: '',
  mname: '',
  lname: '',
  email: '',
  password: '',
  confirm: '',
  phone: '',
  city: '',
  state: '',
  country: ''
}

type dispatchType = {
  type: 'fname' | 'mname' | 'lname' | 'email' | 'password' | 'confirm' | 'phone' | 'city' | 'state' | 'country' | 'reset'
  value: string
}

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
      return data.password.trim() === '' || data.confirm.trim() === '' || data.password.trim() !== data.confirm.trim()
    case 4:
      return false // Intentionally set to false to allow logic for phone verification
    case 5:
      return data.city.trim() === '' || data.state.trim() === '' || data.country.trim() === ''
    case 6:
      return false
    default:
      return true
  }
}

export type signUpFormProps = {
  /** The user data of Registration Form */
  data: UserCredentialsType,
  /** Function to change the data in the form */
  changeData: (type: dispatchType['type'], value: string) => void
}

export default function SignUpForm() {
  // User credentials state and dispatch function for updating the state
  const [userCredentials, dispatch] = useReducer(
    (state: UserCredentialsType, action: dispatchType) => {
      switch (action.type) {
        case 'fname':
          return { ...state, fname: action.value }
        case 'mname':
          return { ...state, mname: action.value }
        case 'lname':
          return { ...state, lname: action.value }
        case 'password':
          return { ...state, password: action.value }
        case 'confirm':
          return { ...state, confirm: action.value }
        case 'email':
          return { ...state, email: action.value }
        case 'phone':
          return { ...state, phone: action.value }
        case 'city':
          return { ...state, city: action.value }
        case 'state':
          return { ...state, state: action.value }
        case 'country':
          return { ...state, country: action.value }
        case 'reset':
          return initialState
        default:
          return state
      }
    },
    initialState
  )
  const changeData = (type: dispatchType['type'], value: string) => {
    dispatch({ type: type, value: value })
  }

  const navigate = useNavigate()
  const sampleFn = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigate('/')
    toast.success('Sign in successful')
  }

  // OTP state and dispatch function for updating the state
  const [savedData, setSavedData] = useState<(string | null)[]>([null, null])
  const [disableAll, setDisableAll] = useState([false, false])
  const [otpValue, setOtpValue] = useState(['', ''])

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

  /** Manage the steps and block pages */
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
    <UserConsent data={ userCredentials } changeData={ changeData } />
  ]
  const [step, setStep] = useState(1)
  const totalSteps = stepPages.length
  // const [blockPages, setBlockPages] = useState(Array.from({ length: totalSteps }, () => true))
  
  useEffect(() => {
    console.log(userCredentials)
  }, [userCredentials])
  
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
          blockPage={blocker(step, userCredentials) || (step === 2 && !disableAll[0]) || (step === 4 && !disableAll[1])}
          currentStep={step}
          setStep={setStep}
          totalSteps={totalSteps}
          submitFunc={sampleFn}
        />
      </form>
      <p className="text-gray-400 mt-4">
      </p>
    </div>
  )
}