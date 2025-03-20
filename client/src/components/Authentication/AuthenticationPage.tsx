import { useEffect, useReducer, useState } from "react"
import { Link } from 'react-router-dom'
import SignInForm from "./SignInForm"
import SignUpForm from "./SignUpForm"

export type UserSignInType = {
  email: string
  password: string
}

const signInInitialState: UserSignInType = {
  email: '',
  password: ''
}

export type signInDispatchType = { type: 'email' | 'password' | 'reset', value: string }

export type UserCredentialsType = {
  fname: string
  mname: string
  lname: string
  email: string
  sitename: string
  password: string
  confirm: string
  phone: string
  city: string
  state: string
  country: string
}

const signUpInitialState: UserCredentialsType = {
  fname: '',
  mname: '',
  lname: '',
  email: '',
  sitename: '',
  password: '',
  confirm: '',
  phone: '',
  city: '',
  state: '',
  country: ''
}

export type signUpDispatchType = {
  type: 'fname' | 'mname' | 'lname' | 'email' | 'sitename' | 'password' | 'confirm' | 'phone' | 'city' | 'state' | 'country' | 'reset'
  value: string
}

export default function AuthenticationPage() {
  /** Sign In details */
  const [signInUserCredentials, signInDispatch] = useReducer(
    (state: UserSignInType, action: signInDispatchType) => {
      switch (action.type) {
        case 'email':
          return { ...state, email: action.value }
        case 'password':
          return { ...state, password: action.value }
        case 'reset':
          return signInInitialState
        default:
          return state
      }
    },
    signInInitialState
  )
  const [checked, setChecked] = useState(false);

  /** Sign Up details */
  const [signUpUserCredentials, signUpDispatch] = useReducer(
    (state: UserCredentialsType, action: signUpDispatchType) => {
      switch (action.type) {
        case 'fname':
          return { ...state, fname: action.value }
        case 'mname':
          return { ...state, mname: action.value }
        case 'lname':
          return { ...state, lname: action.value }
        case 'sitename':
          return { ...state, sitename: action.value }
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
          return signUpInitialState
        default:
          return state
      }
    },
    signUpInitialState
  )

  // Sign Up Page Step state and dispatch function for updating the states
  const [signUpPageStep, setSignUpPageStep] = useState(3)

  // OTP state and dispatch function for updating the states
  const [savedData, setSavedData] = useState<{'email': string | null, 'sitename': string | null, 'phone': string | null}>({
    email: null,
    sitename: null,
    phone: null
  })
  const [disableAll, setDisableAll] = useState<{'email': boolean, 'phone': boolean}>({
    email: false,
    phone: false
  })
  const [otpValue, setOtpValue] = useState<{'email': string, 'phone': string}>({
    email: '',
    phone: ''
  })
  const [allChecked, setAllChecked] = useState(false)


  // const user = useAuth()
  // const navigate = useNavigate()
  // useEffect(() => {
  //   if (user !== null) navigate('/dashboard', { replace: true })
  // }, [user])

  /** Sign In and Sign Up Toggler */
  const [openSignUp, setOpenSignUp] = useState(false)  // false -> Sign In ,  true -> Sign Up
  
  /**
   * Toggles the sign-up state and handles form data reset if necessary.
   * 
   * This function performs the following actions:
   * 1. Checks if the user has entered any data in the sign-in form. If so, it prompts the user for confirmation
   *    to leave the page, warning that all data will be lost. If the user confirms, it resets the sign-in form data.
   * 2. Checks if the user has entered any data in the sign-up form. If so, it prompts the user for confirmation
   *    to leave the page, warning that all data will be lost. If the user confirms, it resets the sign-up form data.
   * 3. Toggles the state of the sign-up form visibility.
   */
  const toggleSignUp = () => {
    // Check if the user has entered any data in the sign in form
    if (!Object.entries(signInUserCredentials).every(([, value]) => value === '')) {
      const b = confirm('Are you sure you want to leave this page? All of your data will be lost.')
      if (!b) return
      else {
        signInDispatch({ type: 'reset', value: '' })
        setChecked(false)
      }
    }

    // Check if the user has entered any data in the sign up form
    if (!Object.entries(signUpUserCredentials).every(([, value]) => value === '')) {
      const b = confirm('Are you sure you want to leave this page? All of your data will be lost.')
      if (!b) return
      else {
        signUpDispatch({ type: 'reset', value: '' })
        setSignUpPageStep(1)
        setSavedData({ email: null, sitename: null, phone: null })
        setDisableAll({ email: false, phone: false })
        setOtpValue({ email: '', phone: '' })
        setAllChecked(false)
      }
    }

    // Toggle the sign-up form visibility
    setOpenSignUp(prev => !prev)
  }

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (
        !Object.entries(signInUserCredentials).every(([, value]) => value === '') ||
        !Object.entries(signUpUserCredentials).every(([, value]) => value === '')
      ) {
        event.preventDefault();
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [signInUserCredentials, signUpUserCredentials])

  useEffect(() => {
    document.title = openSignUp ? 'eazzyBizz | Register Now!' : 'eazzybizz | Sign in to continue!'
  }, [openSignUp])

  return (
    <main className="flex items-center justify-center h-screen bg-white">
      <div className="size-full md:w-[80vw] lg:w-[60vw] md:h-[80vh] shadow-2xl md:rounded-3xl overflow-hidden relative">
        <div id='sign-up-form' className={`bg-white form-container absolute size-full md:w-[60%] transition-all duration-[600ms] z-10 ${openSignUp ? 'left-0 md:left-[40%] opacity-100 pointer-events-auto' : '-left-full md:left-full opacity-0 pointer-events-none'}`}>
          <SignUpForm
            step={signUpPageStep}
            setStep={setSignUpPageStep}
            openSignIn={toggleSignUp}
            userCredentials={signUpUserCredentials}
            dispatch={signUpDispatch}
            savedData={savedData}
            setSavedData={setSavedData}
            disableAll={disableAll}
            setDisableAll={setDisableAll}
            otpValue={otpValue}
            setOtpValue={setOtpValue}
            allChecked={allChecked}
            setAllChecked={setAllChecked}
          />
        </div>
        <div id='sign-in-form' className={`bg-white form-container absolute size-full md:w-[60%] transition-all duration-[600ms] z-20 ${openSignUp ? 'left-full md:-left-full opacity-0 pointer-events-none' : 'left-0 md:left-0 opacity-100 pointer-events-auto'}`}>
          <SignInForm
            openSignUp={toggleSignUp}
            userCredentials={signInUserCredentials}
            dispatch={signInDispatch}
            checked={checked}
            setChecked={setChecked}
          />
        </div>
        <div className={`hidden md:block text-white overlay-container absolute top-0 w-[40%] h-full bg-linear-to-tr from-blue-500 to-indigo-600 overflow-hidden transition-all duration-[600ms] z-30 ${openSignUp ? 'left-0' : 'left-[60%]'}`}>
          <div id='toggle-to-sign-in' className={`absolute gap-4 w-full flex items-center justify-center flex-col py-0 px-[40px] text-center h-full transform-all duration-[600ms] ${openSignUp ? 'left-0 opacity-100 pointer-events-auto' : 'left-full opacity-0 pointer-events-none'}`}>
            <Link to='/' className='font-source-serif text-4xl font-bold' tabIndex={openSignUp ? 0 : -1}>
              eazzyBizz
            </Link>
            <div>
              Already have an account? Click the button below to sign in and continue enjoying our services.
            </div>
            <button
              onClick={ toggleSignUp }
              className="rounded-lg px-4 py-2 border-2 font-semibold cursor-pointer"
              tabIndex={openSignUp ? 0 : -1}
            >
              Sign In
            </button>
          </div>
          <div id='toggle-to-sign-up' className={`absolute gap-4 w-full flex items-center justify-center flex-col py-0 px-[40px] text-center h-full transform-all duration-[600ms] ${openSignUp ? '-left-full opacity-0 pointer-events-none' : 'left-0 opacity-100 pointer-events-auto'}`}>
            <Link to='/' className='font-source-serif text-4xl font-bold' tabIndex={openSignUp ? -1 : 0}>
              eazzyBizz
            </Link>
            <div>
            New to eazzyBizz? Click the button below to create your account and start exploring all the features we offer.
            </div>
            <button
              onClick={ toggleSignUp }
              className="rounded-lg px-4 py-2 border-2 font-semibold cursor-pointer"
              tabIndex={openSignUp ? -1 :0}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
