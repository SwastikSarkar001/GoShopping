import { useEffect, useState } from "react";
import { CheckBox } from "../InputElements";

export default function UserConsent(
  { setAllChecked }: {setAllChecked: React.Dispatch<React.SetStateAction<boolean>>}
) {
  const [checked, setChecked] = useState([false, false, false]);
  const toggler = (index: number) => {
    const temp = [...checked];
    temp[index] = !temp[index];
    setChecked(temp)
  }
  useEffect(() => {
    setAllChecked(checked.every((value) => value === true))
  }, [setAllChecked, checked])
  return (
    <div className='flex flex-col gap-4 *:justify-start *:gap-4'>
      <CheckBox id='acknowledgement' label='By clicking this, I confirm that the details provided are accurate.' checked={checked[0]} toggler={() => toggler(0)} />
      <CheckBox id='terms' label='I agree to the Terms and Conditions' checked={checked[1]} toggler={() => toggler(1)} />
      <CheckBox id='privacy' label='I agree to the Privacy Policy' checked={checked[2]} toggler={() => toggler(2)} />
    </div>
  )
}