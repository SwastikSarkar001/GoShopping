import { useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import libphonenumber from 'google-libphonenumber'
import { Button, InputOTP, InputPhone } from "../InputElements"
import { signUpFormPagesProps } from "../SignUpForm"

type PhoneVerificationProps = signUpFormPagesProps & {
  /** Phone number that has been saved in the client */
  savedPhone: string | null
  /** Set the phone number that has been saved in the client */
  setSavedPhone: (value: string | null) => void
  /** Value of the OTP typed in OTP field */
  otpValue: string
  /** Set the value of the OTP typed in OTP field */
  setOtpValue: (value: string) => void
  /** Number of inputs in OTP field */
  numInputs: number
  /** Disable all fields in the form after verification */
  disableAll: boolean
  /** Set the value of the disableAll field */
  setDisableAll: (value: boolean) => void
}

export default function PhoneNumberVerification({
  data,
  changeData,
  savedPhone,
  setSavedPhone,
  otpValue,
  setOtpValue,
  numInputs,
  disableAll,
  setDisableAll
}: PhoneVerificationProps) {
  const [resendTimer, setResendTimer] = useState<number>(0)
  const [rejected, setRejected] = useState<boolean>(false)
  const [otpStatus, setOtpStatus] = useState<'none' | 'success' | 'error'>(disableAll ? 'success' : 'none');
  const phoneutil = libphonenumber.PhoneNumberUtil.getInstance()

  /** Checks whenever user needs to resend the OTP */
  const resendOtp = resendTimer === 0
  
  /** Checks whether the phone field contains the same data as previously saved phone number or not */
  const isPhoneFieldUnchanged = savedPhone === data.phone
  const isValidPhoneNumber = (phoneNumber: string) => {
    try {
      return phoneutil.isValidNumber(phoneutil.parse(phoneNumber))
    }
    catch {
      return false
    }
  }

  /** Original verifyOtp (to be used later) */
  // const verifyOtp = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/check-otp`,
  //       {
  //         params: {
  //           field: 'phone',
  //           value: data.phone.trim(),
  //           otp: otpValue
  //         },
  //         validateStatus: (status) => status === 200 || status === 401
  //       }
  //     )
  //     if (response.status === 200) {
  //       setOtpStatus('success')
  //       console.log('Phone number verified successfully.')
  //       setDisableAll(true)
  //       setResendTimer(0)
  //       toast.success('Phone number verified successfully.')
  //     }
  //     else {
  //       setOtpStatus('error')
  //       console.log('The OTP you entered is incorrect. Please try again.')
  //       toast.error('The OTP you entered is incorrect. Please try again.')
  //       setOtpValue('')
  //     }
  //   }
  //   catch (err) {
  //     toast.error('Seems like the server is down. Please try again later.')
  //     setOtpValue('')
  //     console.error(err)
  //   }
  // }

  /** Fake verifyOtp (for current illustration purposes) */
  const verifyOtp = async () => {
    try {
      if (otpValue.toString().padStart(numInputs, '0') === '1234') {
        setOtpStatus('success')
        setDisableAll(true)
        setResendTimer(0)
        toast.success('Phone number verified successfully.')
      }
      else {
        setOtpStatus('error')
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

  useEffect(() => {
    if (!resendOtp) {
      if (resendTimer > 0) {
        const timer = setTimeout(() => {
          setResendTimer(prev => prev - 1)
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
    if (disableAll) return
    else {
      if(otpValue.length === numInputs) {
        verifyOtp()
      }
      else return
    }
  }, [otpValue]) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Function to get OTP from the server from the phone number.
   */
  const getDataAndSendOtp = async () => {
    try {
      setOtpValue('')
      if (savedPhone !== null && savedPhone !== data.phone) {
        const reconfirmation = confirm('Changing your phone number will cancel the current OTP verification and send a new OTP to the new phone number. Are you sure?')
        if (reconfirmation) {
          setSavedPhone(null)
          setOtpValue('')
          setResendTimer(0)
        }
        else {
          changeData('phone', savedPhone as string)
          return
        }
      }
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/check-field`,
        {
          params: {
            field: 'phone',
            value: data.phone.trim(),
            fullname: (data.fname.trim() + (data.mname ? ' ' + data.mname.trim() : '') + ' ' + data.lname.trim())
          },
          validateStatus: (status) => status === 200 || status === 409,
        }
      )
      if (response.status === 200) {
        setSavedPhone(data.phone)
        setResendTimer(60)
        toast.info('The OTP has been sent to your phone number. Check your messages. (For testing purposes, the OTP is 1234)')
      }
      else if (response.status === 409) {
        setRejected(true)
        toast.error('This phone number is already in use. Please provide a different phone number.')
      }
      else {
        toast.error('An error occurred while checking the phone number. Please try again.', response.data.data)
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
      <InputPhone
        id='phone'
        data={data.phone}
        label='Phone Number'
        name='phone'
        disabled={disableAll }
        isInvalid={ rejected || ((data.phone === '') ? false : !isValidPhoneNumber(data.phone)) }
        isValid={ isPhoneFieldUnchanged }
        changeData={
          (e) => {
            setOtpValue('')
            setRejected(false)
            changeData('phone', e.target.value)
          }
        }
      />
      <Button
        disabled={ disableAll || isPhoneFieldUnchanged || (data.phone.trim() === '' || !isValidPhoneNumber(data.phone)) }
        onClickPromised={ getDataAndSendOtp }
        text='Confirm and Send OTP'
        className="bg-black text-white"
        Icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        }
      />
      <InputOTP
        value={otpValue}
        setValue={setOtpValue}
        numInputs={numInputs}
        disabled={disableAll || !isPhoneFieldUnchanged}
        otpStatus = {otpStatus}
        setOtpStatus = {setOtpStatus}
      />
      <Button
        text={`Resend OTP${!resendOtp ? ` in ${resendTimer.toString().padStart(2, '0')}s` : ''}`}
        Icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
        }
        onClickPromised={ getDataAndSendOtp }
        className="bg-black text-white"
        disabled = { disableAll || !isPhoneFieldUnchanged || !resendOtp }
      />
    </div>
  )
}