import { Button } from "../InputElements"

type NavigatorProps = {
  /** If set true, then the next button will be disabled */
  blockPage: boolean

  /** Determines the current step value of the form */
  currentStep: number

  /** Set the current step value of the form */
  setStep: React.Dispatch<React.SetStateAction<number>>

  /** Total number of steps in the form */
  totalSteps: number

  /** Function to execute when the form is submitted */
  submitFunc: (e: React.FormEvent<HTMLButtonElement>) => void
}

export default function StepNavigator({blockPage, currentStep, setStep, totalSteps, submitFunc}: NavigatorProps) {
  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStep(prev => prev === totalSteps ? prev : prev + 1)
  }
  const prevStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStep(prev => prev === 1 ? prev : prev - 1)
  }
  const isFirstPage = currentStep === 1
  const isLastPage = currentStep === totalSteps
  return (
    <div className={`grid ${isFirstPage ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
      {
        isFirstPage ? null :
        <Button
          onClick={prevStep}
          text='Previous'
          Icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          }
        />
      }
      {
        isLastPage ? null :
        <Button
          onClick={nextStep}
          text='Next'
          disabled={blockPage}
          Icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
            </svg>
          }
        />
      }
      {
        isLastPage ?
        <Button
          onClick={submitFunc}
          text='Sign In'
          disabled={blockPage}
          Icon={
            <svg viewBox="0 0 512 512" className='w-[1em]'>
              <path className='fill-white duration-300' d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
            </svg>
          }
        /> : null
      }
    </div>
  )
}