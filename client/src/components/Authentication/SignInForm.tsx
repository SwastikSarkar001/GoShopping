import { Link, useNavigate } from 'react-router-dom'
import { Button, CheckBox, InputEmail } from './InputElements'
import { InputPassword } from './InputElements'
import { signInDispatchType, UserSignInType } from './AuthenticationPage'
import { useAppDispatch } from '../../states/store'
import { signInUser } from '../../states/reducers/userSlice'
import { toast } from 'sonner'

type SignInFormProps = {
  /** Toggler to switch to Sign Up Form */
  openSignUp: () => void
  /** User Sign In Credentials */
  userCredentials: UserSignInType
  /** Function to dispatch the user credentials */
  dispatch: (dispatchObj: signInDispatchType) => void
  /** State to hold the value of **Remember Me** checkbox */
  checked: boolean
  /** Dispatch function of the state variable of **Remember Me** checkbox */
  setChecked: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SignInForm({
  openSignUp,
  userCredentials,
  dispatch,
  checked,
  setChecked
}: SignInFormProps) {
  const changeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: e.target.name as signInDispatchType['type'], value: e.target.value })
  }
  const toggler = () => setChecked(prev => !prev);
  const navigate = useNavigate()

  const dispatchUser = useAppDispatch()
  const submitFunc = async (e: React.FormEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault()
      
      const userSignIn = dispatchUser(signInUser(userCredentials)).unwrap()
      toast.promise(userSignIn, {
        loading: 'Signing in...',
        success: () => {
          navigate('/features', { replace: true })
          return 'Signed in successfully! Welcome back!'
        },
        error: (error) => `${ error.message }`,
      })
      // useCreateUserAfterRegistration(userCredentials)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='bg-white rounded-2xl flex flex-col items-center justify-center relative h-full'>
      <h1 className="font-bold text-3xl font-source-serif">Welcome Back!</h1>
      <p className="text-gray-400">Sign in to your account</p>
      <form className="flex flex-col gap-4 w-[70%] mt-8" method='post'>
        <InputEmail
          id='regemail'
          name='email'
          label='Email Address'
          data={ userCredentials.email }
          changeData={ changeData }
        />
        <InputPassword
          id='password'
          name='password'
          label='Password'
          autocomplete='current-password'
          data={ userCredentials.password }
          changeData={ changeData }
        />
        <div className="flex items-center justify-between text-sm gap-4">
          <CheckBox id='remember' label='Remember me' checked={checked} toggler={toggler} />
          <Link to='/' className="text-red-600 hover:underline text-right">Forgot password?</Link>
        </div>
        <Button
          onClick={submitFunc}
          disabled={(userCredentials.email === '' || userCredentials.password === '')}
          className='bg-black text-white'
          text='Sign In'
          Icon={
            <svg viewBox="0 0 512 512" className='w-[1em]'>
              <path className='fill-white duration-300' d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
            </svg>
          }
        />
      </form>
      <p className="md:hidden md:pointer-events-none text-gray-400 mt-4">
        Don't have an account? <button onClick={ openSignUp } className="text-blue-500 hover:underline active:text-purple-500">Sign Up</button>
      </p>
    </div>
  )
}