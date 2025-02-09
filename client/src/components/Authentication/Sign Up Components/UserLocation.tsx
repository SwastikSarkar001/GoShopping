import { UserSVG } from "../Icons";
import { InputText } from "../InputElements";
import { signUpFormProps } from "../SignUpForm";

export default function UserLocation({data, changeData}: signUpFormProps) {
  return (
    <div className='flex flex-col gap-4'>
      <InputText id='fname' data={data.fname} label='First Name' name='fname' Logo={<UserSVG />} changeData={e => changeData('fname', e.target.value)} required />
      <InputText id='mname' data={data.mname} label='Middle Name' name='mname' Logo={<UserSVG />} changeData={e => changeData('mname', e.target.value)} />
      <InputText id='lname' data={data.lname} label='Last Name' name='lname' Logo={<UserSVG />} changeData={e => changeData('lname', e.target.value)} required />
    </div>
  )
}