import { Button, InputPassword, InputText } from "../InputElements";
import { signUpFormPagesProps } from "../SignUpForm";
import { PiLinkBold } from "react-icons/pi";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";

type UserPasswordSetupProps = signUpFormPagesProps & {
  savedSitename: string | null,
  setSavedSitename: (value: string | null) => void
}

export default function UserPasswordSetup({data, changeData, savedSitename, setSavedSitename}: UserPasswordSetupProps) {
  const [rejected, setRejected] = useState(false)
  const isSitenameChanged = savedSitename === data.sitename
  const changeSitename = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[a-z]{0,15}$/)) {
      changeData('sitename', e.target.value)
    }
  }
  /**
   * Function to get OTP from the server from the email address.
   */
  const isUniqueSitename = async () => {
    try {
      if (savedSitename !== null && savedSitename !== data.sitename) {
        const reconfirmation = confirm('The current site name is already saved as unique. Are you sure you want to change it and check the availability of this new site name?')
        if (reconfirmation) {
          setSavedSitename(null)
        }
        else {
          changeData('sitename', savedSitename as string)
          return
        }
      }
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/check-sitename`,
        {
          params: {
            value: data.sitename.trim()
          },
          validateStatus: (status) => status === 200 || status === 409,
        }
      )
      if (response.status === 200) {
        setSavedSitename(data.sitename)
        toast.success(`${response.data.message} Your website URL will be generated as https://${data.sitename}.eazzybizz.com`)
      }
      else if (response.status === 409) {
        setRejected(true)
        toast.error('This site name is already in use. Please provide a different site name.')
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
      <div>
        <InputText
          id='sitename'
          name='sitename'
          label='Create New Site Name'
          data={ data.sitename }
          isInvalid={rejected || data.sitename.length > 0 && data.sitename.length < 5}
          changeData={
            e => {
              setRejected(false)
              changeSitename(e)
            }
          }
          isValid={ isSitenameChanged }
          Logo={<PiLinkBold className="size-[1.2em]" />}
        />
        <div className="text-xs text-gray-500 mt-1 mx-1">
          <HiOutlineInformationCircle className="inline size-[1.3em] mb-0.5 mr-0.5" />
          <span>The site name is used to create a unique URL for your site. It can only contain lowercase letters and will be between 5-15 characters long.</span>
        </div>
        <Button
          className="bg-black text-white mt-1 not-md:w-full md:rounded-full md:mx-auto md:py-2 md:text-sm"
          disabled={isSitenameChanged || data.sitename.length < 5}
          onClickPromised={isUniqueSitename}
          text='Check Availability'
          Icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          }
        />
      </div>
      <InputPassword
        id='pass'
        name='password'
        label='Password'
        autocomplete='new-password'
        data={ data.password }
        changeData={e => changeData('password', e.target.value)}
        requirePasswordStrength
      />
      <InputPassword
        id='confirm'
        name='confirm'
        label='Confirm Password'
        data={ data.confirm }
        changeData={e => changeData('confirm', e.target.value)}
      />
    </div>
  )
}