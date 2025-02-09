import { CheckBox } from "../InputElements";
import { signUpFormProps } from "../SignUpForm";

export default function UserConsent({data, changeData}: signUpFormProps) {
  return (
    <div className='flex flex-col gap-4'>
      <CheckBox id='acknowledgement' label='By clicking this, I confirm that the details provided are accurate.' checked={false} toggler={() => {}} />
      <CheckBox id='terms' label='I agree to the Terms and Conditions' checked={false} toggler={() => {}} />
      <CheckBox id='privacy' label='I agree to the Privacy Policy' checked={false} toggler={() => {}} />
    </div>
  )
}