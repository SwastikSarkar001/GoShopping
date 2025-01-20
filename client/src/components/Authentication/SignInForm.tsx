import { useState, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { CheckBox } from './InputElements'
import { InputText, InputPassword } from './InputElements'
import { UserSVG } from './Icons'

type UserCredentialsType = {
  username: string
  password: string
}

const initialState: UserCredentialsType = {
  username: '',
  password: '',
}

type dispatchType = { type: 'username' | 'password' | 'reset', value: string }

export default function SignInForm() {
  const [userCredentials, dispatch] = useReducer(
    (state: UserCredentialsType, action: dispatchType) => {
      switch (action.type) {
        case 'username':
          return { ...state, username: action.value }
        case 'password':
          return { ...state, password: action.value }
        case 'reset':
          return initialState
        default:
          return state
      }
    },
    initialState
  )
  const changeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: e.target.name as dispatchType['type'], value: e.target.value })
  }
  const [checked, setChecked] = useState(false);
  const toggler = () => setChecked(prev => !prev);
  const navigate = useNavigate()
  const sampleFn = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigate('/')
    toast.success('Sign in successful')
  }
  // return (
  //   <form method='post' className="size-full overflow-hidden flex flex-col items-center justify-center gap-4 p-4">
  //     <Link to='/' className='block md:hidden font-source-serif text-4xl font-bold'>
  //       eazzyBizz
  //     </Link>
  //     <div className='text-center mb-4'>
  //       <div className='capitalize text-3xl font-bold font-source-serif'>Sign in</div>
  //     </div>
  //     <InputWrapper
  //       inputType='text'
  //       SvgElement={ <UserSVG /> }
  //       uniqueName='username'
  //       placeholder='Enter your username'
  //      />
  //     <InputWrapper
  //       inputType='password'
  //       SvgElement={ <PasswordSVG /> }
  //       uniqueName='signInPassword'
  //       placeholder='Enter your password'
  //      />
  //     <div className='text-left w-4/5 text-slate-500'>Forgot password?</div>
  //     <button onClick={sampleFn} className="px-6 py-2 *:font-source-serif border-2 rounded-full shadow-md flex gap-4 items-center">
  //       <div>
  //         <svg viewBox="0 0 512 512" className='w-[1em]'>
  //           <path className='fill-black duration-300' d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
  //         </svg>
  //       </div>
  //       <div>Sign in</div>
  //     </button>
  //   </form>
  // )

  return (
    <div className='bg-white rounded-2xl flex flex-col items-center justify-center relative h-full'>
      <h1 className="font-bold text-3xl font-source-serif">Welcome Back!</h1>
      <p className="text-gray-400">Sign in to your account</p>
      <form className="flex flex-col gap-4 w-3/5 mt-8" method='post'>
        <InputText
          label='Username'
          id='username'
          name='username'
          Logo={<UserSVG />}
          data={userCredentials.username}
          changeData={changeData}
          required
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
        <button
          className='disabled:bg-gray-400 disabled:cursor-not-allowed bg-black hover:bg-blue-500 cursor-pointer transition-colors text-white font-bold p-4 rounded-2xl flex items-center justify-center gap-3'
          onClick={sampleFn}
          disabled={(userCredentials.username === '' || userCredentials.password === '')}
        >
          <div>
            <svg viewBox="0 0 512 512" className='w-[1em]'>
              <path className='fill-white duration-300' d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
            </svg>
          </div>
          <div>Sign In</div>
        </button>
      </form>
      <p className="text-gray-400 mt-4">
      </p>
    </div>
  )
}