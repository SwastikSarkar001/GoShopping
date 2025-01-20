import { useNavigate } from 'react-router-dom'
import { useState, useReducer } from 'react'
import { toast } from 'sonner'
import { InputText, InputPassword, InputEmail, InputOTP, Button, CheckBox, InputPhone } from './InputElements'
import { UserSVG } from './Icons'

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

function blocker(step: number, data: UserCredentialsType): boolean {
  switch (step) {
    case 1:
      return data.fname.trim() === '' || data.lname.trim() === ''
    case 2:
      return data.email.trim() === ''
    case 3:
      return data.password.trim() === '' || data.confirm.trim() === '' || data.password.trim() !== data.confirm.trim()
    case 4:
      return data.phone.trim() === ''
    case 5:
      return data.city.trim() === '' || data.state.trim() === '' || data.country.trim() === ''
    case 6:
      return false
    default:
      return true
  }
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
        case 'reset':
          return initialState
        default:
          return state
      }
    },
    initialState
  )
  const changeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: e.target.name as dispatchType['type'], value: e.target.value })
  }

  const navigate = useNavigate()
  const sampleFn = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigate('/')
    toast.success('Sign in successful')
  }

  // OTP state and dispatch function for updating the state
  const [otpSent, setOtpSent] = useState(false)
  const sendOTP = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setOtpSent(true)
  }
  const [otpValue, setOtpValue] = useState('')
  const numInputs = 4

  // Manage the steps and block pages
  const stepPages = [
    <FormOne data={ userCredentials } changeData={changeData} />,
    <FormTwo
    data={ userCredentials }
    changeData={changeData}
    otpSent={otpSent}
    sendOtp={sendOTP}
    otpValue={otpValue}
    setOtpValue={setOtpValue}
    numInputs={numInputs}
    />,
    <FormThree data={ userCredentials } changeData={changeData} />,
    <FormFour
    data={ userCredentials }
    changeData={changeData}
    otpSent={otpSent}
    sendOtp={sendOTP}
    otpValue={otpValue}
    setOtpValue={setOtpValue}
    numInputs={numInputs}
    />,
    <FormFive data={ userCredentials } changeData={changeData} />,
    <FormSix data={ userCredentials } changeData={changeData} />
  ]
  const [step, setStep] = useState(1)
  const totalSteps = stepPages.length
  // const [blockPages, setBlockPages] = useState(Array.from({ length: totalSteps }, () => true))
  
  
  return (
    <div className='bg-white rounded-2xl flex flex-col items-center justify-center relative h-full'>
      <h1 className="font-bold text-3xl font-source-serif">Get Started!</h1>
      <p className="text-gray-400">Register a new account</p>
      <form className="flex flex-col gap-4 w-3/5 mt-8" method='post'>
        <div className='text-center text-sm'>
          Step { step } of { totalSteps }
        </div>
        { stepPages[step - 1] }
        <StepNavigator
          blockPage={blocker(step, userCredentials)}
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

type NavigatorProps = {
  blockPage: boolean
  currentStep: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  totalSteps: number
  submitFunc: (e: React.FormEvent<HTMLButtonElement>) => void
}

function StepNavigator({blockPage, currentStep, setStep, totalSteps, submitFunc}: NavigatorProps) {
  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStep(prev => prev === totalSteps ? prev : prev + 1)
  }
  const prevStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStep(prev => prev === 1 ? prev : prev - 1)
  }
  const isFirstPage = currentStep === 1
  const isLastPage = currentStep === totalSteps
  return (
    <div className={`grid ${isFirstPage ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
      {
        isFirstPage ? null :
        <Button
          onClick={prevStep}
          text='Previous'
          Icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          }
        />
      }
      {
        isLastPage ? null :
        <Button
          onClick={nextStep}
          text='Next'
          disabled={blockPage}
          Icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
            </svg>
          }
        />
      }
      {
        isLastPage ?
        <Button
          onClick={submitFunc}
          text='Sign In'
          disabled={blockPage}
          Icon={
            <svg viewBox="0 0 512 512" className='w-[1em]'>
              <path className='fill-white duration-300' d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
            </svg>
          }
        /> : null
      }
    </div>
  )
}

type signUpFormProps = {data: UserCredentialsType, changeData: (e: React.ChangeEvent<HTMLInputElement>) => void}

function FormOne({data, changeData}: signUpFormProps) {
  return (
    <div className='flex flex-col gap-4'>
      <InputText id='fname' data={data.fname} label='First Name' name='fname' Logo={<UserSVG />} changeData={changeData} required />
      <InputText id='mname' data={data.mname} label='Middle Name' name='mname' Logo={<UserSVG />} changeData={changeData} />
      <InputText id='lname' data={data.lname} label='Last Name' name='lname' Logo={<UserSVG />} changeData={changeData} required />
    </div>
  )
}

type FormTwoProps = signUpFormProps & {
  otpSent: boolean
  sendOtp: (e: React.MouseEvent<HTMLButtonElement>) => void
  otpValue: string
  setOtpValue: React.Dispatch<React.SetStateAction<string>>
  numInputs: number
}

function FormTwo({data, changeData, otpSent, sendOtp, otpValue, setOtpValue, numInputs}: FormTwoProps) {
  return (
    <div className='flex flex-col gap-4'>
      <InputEmail id='email' data={data.email} label='Email Address' name='email' changeData={changeData} />
      <Button
        text='Confirm and Send OTP'
        Icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        }
      />
      <InputOTP value={otpValue} setValue={setOtpValue} numInputs={numInputs} disabled={false} />
      <Button
        text='Check OTP and Verify Email'
        Icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
        }
      />
    </div>
  )
}

function FormThree({data, changeData}: signUpFormProps) {
  return (
    <div className='flex flex-col gap-4'>
      <InputPassword
        id='pass'
        name='password'
        label='Password'
        autocomplete='new-password'
        data={ data.password }
        changeData={ changeData }
        requirePasswordStrength
        />
      <InputPassword
        id='confirm'
        name='confirm'
        label='Confirm Password'
        data={ data.confirm }
        changeData={ changeData }
        />
    </div>
  )
}

function FormFour({data, changeData, otpSent, sendOtp, otpValue, setOtpValue, numInputs}: FormTwoProps) {
  return (
    <div className='flex flex-col gap-4'>
      <InputPhone id='email' data={data.phone} label='Email Address' name='email' changeData={changeData} />
      <Button
        text='Confirm and Send OTP'
        Icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        }
      />
      <InputOTP value={otpValue} setValue={setOtpValue} numInputs={numInputs} disabled={false} />
      <Button
        text='Check OTP and Verify Email'
        Icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
        }
      />
    </div>
  )
}

function FormFive({data, changeData}: signUpFormProps) {
  return (
    <div className='flex flex-col gap-4'>
      <InputText id='fname' data={data.fname} label='First Name' name='fname' Logo={<UserSVG />} changeData={changeData} required />
      <InputText id='mname' data={data.mname} label='Middle Name' name='mname' Logo={<UserSVG />} changeData={changeData} />
      <InputText id='lname' data={data.lname} label='Last Name' name='lname' Logo={<UserSVG />} changeData={changeData} required />
    </div>
  )
}

function FormSix({data, changeData}: signUpFormProps) {
  return (
    <div className='flex flex-col gap-4'>
      <CheckBox id='acknowledgement' label='By clicking this, I confirm that the details provided are accurate.' checked={false} toggler={() => {}} />
      <CheckBox id='terms' label='I agree to the Terms and Conditions' checked={false} toggler={() => {}} />
      <CheckBox id='privacy' label='I agree to the Privacy Policy' checked={false} toggler={() => {}} />
    </div>
  )
}