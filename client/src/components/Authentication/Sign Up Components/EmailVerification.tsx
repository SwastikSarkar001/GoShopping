import { useState } from "react"
import { toast } from "sonner"
import { InputEmail, Button, InputOTP } from "../InputElements"

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

type signUpFormProps = {data: UserCredentialsType, changeData: (e: React.ChangeEvent<HTMLInputElement>) => void}

type FormTwoProps = signUpFormProps & {
  otpSent: boolean
  sendOtp: (e: React.MouseEvent<HTMLButtonElement>) => void
  otpValue: string
  setOtpValue: React.Dispatch<React.SetStateAction<string>>
  numInputs: number
}

export default function EmailVerification({data, changeData, otpSent, sendOtp, otpValue, setOtpValue, numInputs}: FormTwoProps) {
  const [savedEmail, setSavedEmail] = useState<string | null>(null)  // null signifies that no email has been saved
  const [fnState, setFnState] = useState(0)
  const getDataAndSendOtp = () => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const data = Math.round(Math.random())  // 1 means email is unique, 0 means email is already in use
        if (data) {
          // Add a nodemailer for sending OTP
          toast.info('An email has been sent to your mail.')
          setFnState(1)
          resolve()
        }
        else {
          toast.error('This email address is already in use. Please provide a different email address.')
          setFnState(0)
          reject()
        }
      }, 500);
    })
  }

  const sendOTP = () => {
  }

  return (
    <div className='flex flex-col gap-4'>
      <InputEmail id='email' data={data.email} label='Email Address' name='email' changeData={changeData} />
      <Button
      disabled={ data.email.trim() === '' }
        onClickPromised={
          async () => (
            await getDataAndSendOtp()
          )
        }
        text='Confirm and Send OTP'
        Icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        }
      />
      <InputOTP value={otpValue} setValue={setOtpValue} numInputs={numInputs} disabled={false} />
      <Button
        text='Resend OTP'
        Icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
        }
      />
    </div>
  )
}