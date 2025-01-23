import { EmailSVG, PasswordSVG } from "./Icons"
import { passwordStrength } from "check-password-strength"
import React, { useState } from "react"
import PhoneInput from "react-phone-input-2"
import OTPInput from "react-otp-input"
import 'react-phone-input-2/lib/style.css'

type CheckBoxProps = {
  /** The id of the checkbox. */
  id: string,
  /** The label of the checkbox. */
  label: string,
  /** The checked state of the checkbox. */
  checked: boolean,
  /** Function to toggle the checked state. */
  toggler: () => void
}

/** CheckBox component renders a checkbox with a label and custom SVG. */
export function CheckBox({id, label, checked, toggler}: CheckBoxProps) {
  return (
    <label className="cursor-pointer flex items-center justify-center gap-2 relative" htmlFor={id}>
      <input type="checkbox" id={id} className='absolute scale-0 outline-none peer' checked={checked} onChange={toggler} />
      <svg viewBox="0 0 64 64" className='size-[1.3em] overflow-visible peer-focus-visible:outline peer-focus-visible:outline-black peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2'>
        <path
          className={`fill-none ${checked ? 'stroke-green-600' : 'stroke-black'} stroke-[6px] transition-all ease-[ease] duration-500`}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeDasharray={checked ? '70.5096664428711 9999999' : '241 9999999'}
          strokeDashoffset={checked ? -262.2723388671875 : 0}
          pathLength="575.0541381835938"
          d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
        />
      </svg>
      <div>{label}</div>
    </label>
  )
}

type InputProps = {
  /** The input data. */
  data: string
  /** The label for the input. */
  label: string
  /** The id of the checkbox. */
  id: string,
  /** The name of the input. */
  name: string
  /** The logo to be displayed inside the input. */
  Logo: React.ReactNode
  /** Function to handle input changes. */
  changeData: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Whether the input is required. */
  required?: boolean
  /** The pattern to validate the input. */
  pattern?: string
}

/** Renders a text input with an id, label and optional logo. */
export function InputText({ label, id, name, Logo, data, changeData, required, pattern }: InputProps) {
  return (
    <label htmlFor={ name } className="bg-gray-300/20 invalid:bg-red-300/20 p-4 rounded-2xl flex items-center gap-4">
      <input
        type="text"
        id={ id }
        name={ name }
        className="bg-transparent min-w-0 flex-grow outline-none flex-shrink"
        placeholder={ label }
        value={ data }
        onChange={ changeData }
        pattern={ pattern }
        required={ required }
      />
      { Logo }
    </label>
  )
}

type PasswordProps = {
  /** The id of the input. */
  id: string
  /** The name of the input. */
  name: string
  /** The label for the input. */
  label: string
  /**  */
  autocomplete?: React.InputHTMLAttributes<HTMLInputElement>['autoComplete']
  /** The input data. */
  data: string
  /** Function to handle input changes. */
  changeData: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Whether to display password strength meter. */
  requirePasswordStrength?: boolean
}

/** Renders a password input with visibility toggle and optional password strength indicator. */
export function InputPassword({id, name, label, data, autocomplete, changeData, requirePasswordStrength}: PasswordProps) {
  if (requirePasswordStrength === undefined) requirePasswordStrength = false
  const [visible, setVisible] = useState(false)
  const visibilityToggler = () => setVisible(prev => !prev)
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
  const strength = passwordStrength(data)
  return (
    <>
      <label htmlFor={id} className="bg-gray-300/20 p-4 rounded-2xl flex items-center gap-4">
        <input
          type={`${visible ? 'text' : 'password'}`}
          id={ id }
          name={ name }
          autoComplete={ autocomplete }
          className={`bg-transparent flex-grow flex-shrink min-w-0 outline-none ${(!visible && data !== '') ? 'font-[Verdana] tracking-wide' : ''}`}
          placeholder={ label }
          value={ data }
          onChange={ changeData }
          required
        />
        <PasswordSVG visible={visible} toggler={visibilityToggler} />
      </label>
      {
        requirePasswordStrength &&
        <div className="text-gray-400 text-sm">
          {/* Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character. */}
          <div className="grid grid-cols-4 gap-1">
            <div className={`h-[4px] rounded-md ${(strength.id >= 0 && data !== '') ? strengthColors[strength.id] : 'bg-gray-400'}`}></div>
            <div className={`h-[4px] rounded-md ${strength.id >= 1 ? strengthColors[strength.id] : 'bg-gray-400'}`}></div>
            <div className={`h-[4px] rounded-md ${strength.id >= 2 ? strengthColors[strength.id] : 'bg-gray-400'}`}></div>
            <div className={`h-[4px] rounded-md ${strength.id >= 3 ? strengthColors[strength.id] : 'bg-gray-400'}`}></div>
          </div>
        </div>
      }
    </>
  )
}

type EmailProps = {
  /** The input data. */
  data: string
  /** The label for the input. */
  label: string
  /** The id of the checkbox. */
  id: string,
  /** The name of the input. */
  name: string
  /** Function to handle input changes. */
  changeData: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/** Renders a text input with an id, label and optional logo. */
export function InputEmail({ label, id, name, data, changeData }: EmailProps) {
  return (
    <label htmlFor={ name } className="bg-gray-300/20 [&:has(>input:invalid)]:bg-red-300/20 p-4 rounded-2xl flex items-center gap-4">
      <input
        type="email"
        id={ id }
        name={ name }
        className="bg-transparent min-w-0 flex-grow outline-none flex-shrink"
        placeholder={ label }
        value={ data }
        onChange={ changeData }
        required
      />
      <EmailSVG />
    </label>
  )
}

type PhoneProps = {
  /** The input data. */
  data: string
  /** The label for the input. */
  label: string
  /** The id of the checkbox. */
  id: string,
  /** The name of the input. */
  name: string
  /** Function to handle input changes. */
  changeData: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/** Renders a text input with an id, label and optional logo. */
export function InputPhone({ label, id, name, data, changeData }: PhoneProps) {
  const [phone, setPhone] = useState('')
  return (
    // <label htmlFor={ name } className="bg-gray-300/20 [&:has(>input:invalid)]:bg-red-300/20 p-4 rounded-2xl flex items-center gap-4">
    //   <input
    //     type="tel"
    //     id={ id }
    //     name={ name }
    //     className="bg-transparent min-w-0 flex-grow outline-none flex-shrink"
    //     placeholder={ label }
    //     value={ data }
    //     onChange={ changeData }
    //     required
    //   />
    //   <EmailSVG />
    // </label>
    <PhoneInput
      placeholder="Phone Number"
      containerClass="bg-gray-300/20 [&:has(>input:invalid)]:bg-red-300/20 p-4 rounded-2xl flex items-center gap-4 "
      inputClass="outline-none"
      country='in'
      value={phone}
      onChange={(value) => setPhone(value)}
      enableAreaCodes
    />
  )
}

type InputOTPProps = {
  /** The value of the OTP input. */
  value: string
  /** Function to set the OTP input value. */
  setValue: (value: string) => void
  /** The number of OTP inputs. */
  numInputs: number
  /** Whether the OTP input is disabled. */
  disabled: boolean
}

export function InputOTP({value, setValue, numInputs, disabled}: InputOTPProps) {
  return (
    <OTPInput
      inputType="number"
      value={value}
      onChange={setValue}
      numInputs={numInputs}
      renderInput={
        (inputProps, i) => (
          <input disabled={disabled} key={i} {...inputProps} />
        )
      }
      containerStyle='flex gap-4'
      inputStyle='bg-gray-300/20 flex-grow p-4 rounded-2xl disabled:pointer-not-allowed'
      placeholder={"•".repeat(numInputs)}
    />
  )
}

type ButtonProps = {
  /** Function to be called on button click. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Asynchronous function to be called on button click. */
  onClickPromised?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>
  /** Whether the button is disabled. */
  disabled?: boolean
  /** The icon to be displayed inside the button. */
  Icon?: React.ReactNode
  /** The text to be displayed inside the button. */
  text: string
}

export function Button({ onClick, onClickPromised, disabled, Icon, text }: ButtonProps) {
  const [loading, setLoading] = useState(false)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (onClick) {
      onClick(e)
    }
    if (onClickPromised) {
      setLoading(true); // Start by setting the status to 'pending'
  
      onClickPromised(e)
        .then(() => {
          setLoading(false); // If the promise resolves, set status to 'resolved'
        })
        .catch(() => {
          setLoading(false); // If the promise rejects, set status to 'rejected'
        });
    }
  }
  return (
    <button
      className='disabled:bg-gray-400 disabled:cursor-not-allowed bg-black hover:bg-blue-500 cursor-pointer transition-colors text-white font-bold p-4 rounded-2xl flex items-center justify-center gap-3'
      onClick={handleClick}
      disabled={disabled || loading}
    >
      <div>
        {
          loading ?
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em] animate-spin">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          :
          Icon
        }
      </div>
      <div className="select-none">{ loading ? 'Please wait' : text }</div>
    </button>
  )
}