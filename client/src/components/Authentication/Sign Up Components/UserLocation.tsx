import { InputText } from "../InputElements"
import { signUpFormPagesProps } from "../SignUpForm"
import { LocationPinSVG } from "../Icons"

export default function UserLocation({data, changeData}: signUpFormPagesProps) {
  return (
    <div className='flex flex-col gap-4'>
      <InputText
        id='country'
        data={data.country}
        label='Country of Residence'
        name='country'
        Logo={<LocationPinSVG />}
        changeData={e => changeData('country', e.target.value)}
        required
      />
      <InputText
        id='state'
        data={data.state}
        label='State of Residence'
        name='state'
        Logo={<LocationPinSVG />}
        changeData={e => changeData('state', e.target.value)}
        required
      />
      <InputText
        id='city'
        data={data.city}
        label='City of Residence'
        name='city'
        Logo={<LocationPinSVG />}
        changeData={e => changeData('city', e.target.value)}
        required
      />
    </div>
  )
}