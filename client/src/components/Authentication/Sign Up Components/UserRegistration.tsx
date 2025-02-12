import { UserSVG } from "../Icons";
import { InputText } from "../InputElements";
import { signUpFormPagesProps } from "../SignUpForm";

export default function UserRegistration({data, changeData}: signUpFormPagesProps) {
  return (
    <div className='flex flex-col gap-4'>
      <InputText
        id='fname'
        data={data.fname}
        label='First Name'
        name='fname'
        Logo={<UserSVG />}
        changeData={e => changeData('fname', e.target.value)}
        pattern="[A-Za-z\\-']+"
        required
      />
      <InputText
        id='mname'
        data={data.mname}
        label='Middle Name'
        name='mname'
        Logo={<UserSVG />}
        changeData={e => changeData('mname', e.target.value)}  
      />
      <InputText
        id='lname'
        data={data.lname}
        label='Last Name'
        name='lname'
        Logo={<UserSVG />}
        changeData={e => changeData('lname', e.target.value)}
        required
      />
    </div>
  )
}