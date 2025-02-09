import { InputPassword } from "../InputElements";
import { signUpFormProps } from "../SignUpForm";

export default function UserPasswordSetup({data, changeData}: signUpFormProps) {
  return (
    <div className='flex flex-col gap-4'>
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