import { useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { InputEmail, Button, InputOTP } from "../InputElements"
import { signUpFormProps } from "../SignUpForm"

export type FormTwoProps = signUpFormProps & {
  /** Email address that has been saved in the client */
  savedEmail: string | null
  /** Set the email address that has been saved in the client */
  setSavedEmail: React.Dispatch<React.SetStateAction<string | null>>
  /** Value of the OTP typed in OTP field */
  otpValue: string
  /** Set the value of the OTP typed in OTP field */
  setOtpValue: React.Dispatch<React.SetStateAction<string>>
  /** Number of inputs in OTP field */
  numInputs: number
  /** Disable all fields in the form after verification */
  disableAll: boolean
  /** Set the value of the disableAll field */
  setDisableAll: (value: boolean) => void
}

export default function FormTwo({
  data,
  changeData,
  savedEmail,
  setSavedEmail,
  otpValue,
  setOtpValue,
  numInputs,
  disableAll,
  setDisableAll
}: FormTwoProps) {
  const [resendTimer, setResendTimer] = useState<number>(0)
  const [rejected, setRejected] = useState<boolean>(false)

  /** Checks whenever user needs to resend the OTP */
  const resendOtp = resendTimer === 0

  /** Validation regex pattern of email field */
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  /** Checks whether the email field has been modified or not */
  const isEmailFieldModified = savedEmail === data.email

  useEffect(() => {
    if (!resendOtp) {
      if (resendTimer > 0) {
        const timer = setTimeout(() => {
          setResendTimer(resendTimer - 1)
        }, 1000)
        return () => clearTimeout(timer)
      }
      else {
        return
      }
    }
    else return
  }, [resendOtp, resendTimer])

  useEffect(() => {
    if(otpValue.length === numInputs) {
      const verifyOtp = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/check-otp`,
            {
              params: {
                field: 'email',
                value: data.email.trim(),
                otp: otpValue
              },
              validateStatus: (status) => status === 200 || status === 401
            }
          )
          if (response.status === 200) {
            setDisableAll(true)
            toast.success('Email address verified successfully.')
          }
          else {
            toast.error('The OTP you entered is incorrect. Please try again.')
            setOtpValue('')
          }
        }
        catch (err) {
          toast.error('Seems like the server is down. Please try again later.')
          setOtpValue('')
          console.error(err)
        }
      }
      verifyOtp()
    }
    else return
  }, [otpValue, data.email, numInputs, setOtpValue, setDisableAll])

  /**
   * Function to get OTP from the server from the email address.
   */
  const getDataAndSendOtp = async () => {
    try {
      setOtpValue('')
      if (savedEmail !== null && savedEmail !== data.email) {
        const reconfirmation = confirm('Changing your email will cancel the current OTP verification and send a new OTP to the new address. Are you sure?')
        if (reconfirmation) {
          setSavedEmail(null)
          setOtpValue('')
          setResendTimer(0)
        }
        else {
          changeData('email', savedEmail as string)
          return
        }
      }
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/check-field`,
        {
          params: {
            field: 'email',
            value: data.email.trim(),
            to: data.email.trim(),
            fullname: (data.fname.trim() + (data.mname ? ' ' + data.mname.trim() : '') + ' ' + data.lname.trim())
          },
          validateStatus: (status) => status === 200 || status === 409,
        }
      )
      if (response.status === 200) {
        setSavedEmail(data.email)
        setResendTimer(60)
        toast.info('The OTP has been sent to your email address.')
      }
      else if (response.status === 409) {
        setRejected(true)
        toast.error('This email address is already in use. Please provide a different email address.')
      }
      else {
        toast.error('An error occurred while checking the email. Please try again.', response.data.data)
        console.error(response.status)
      }
    }
    catch (err) {
      toast.error('Seems like the server is down. Please try again later.')
      console.error(err)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <InputEmail
        id='email'
        data={data.email}
        label='Email Address'
        name='email'
        disabled={disableAll}
        changeData={
          (e) => {
            setOtpValue('')
            setRejected(false)
            changeData('email', e.target.value)
          }
        }
        isInvalid={ rejected || ((data.email === '') ? false : !emailRegex.test(data.email)) }
        isValid={ isEmailFieldModified }
      />
      <Button
        disabled={ disableAll || isEmailFieldModified || (data.email.trim() === '' || !emailRegex.test(data.email)) }
        onClickPromised={ getDataAndSendOtp }
        text='Confirm and Send OTP'
        Icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        }
      />
      <InputOTP value={otpValue} setValue={setOtpValue} numInputs={numInputs} disabled={disableAll || !isEmailFieldModified} />
      <Button
        text={`Resend OTP${!resendOtp ? ` in ${resendTimer.toString().padStart(2, '0')} s` : ''}`}
        Icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
        }
        onClickPromised={ getDataAndSendOtp }
        disabled = { disableAll || !isEmailFieldModified || !resendOtp }
      />
    </div>
  )
}