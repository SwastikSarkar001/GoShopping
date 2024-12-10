import { useState } from "react"
import { Link } from 'react-router-dom'
import SignInForm from "./SignInForm"
import SignUpForm from "./SignUpForm"

export default function AuthenticationPage() {
  // const user = useAuth()
  // const navigate = useNavigate()
  // useEffect(() => {
  //   if (user !== null) navigate('/dashboard', { replace: true })
  // }, [user])

  const [openSignUp, setOpenSignUp] = useState(false)  // false -> Sign In ,  true -> Sign Up
  const toggleSignUp = () => {
    setOpenSignUp(prev => !prev)
  }
  return (
    <main className="flex items-center justify-center h-screen bg-white">
      <div className="size-full md:w-[80vw] lg:w-[60vw] md:h-[80vh] shadow-2xl md:rounded-3xl overflow-hidden relative">
        <div id='sign-up-form' className={`bg-white form-container absolute size-full md:w-[60%] transition-all duration-[600ms] z-10 ${openSignUp ? 'left-[40%] opacity-100' : 'left-0 opacity-0'}`}>
          <SignUpForm />
        </div>
        <div id='sign-in-form' className={`bg-white form-container absolute size-full md:w-[60%] transition-all duration-[600ms] z-20 ${openSignUp ? 'left-[40%] opacity-0' : 'left-0 opacity-100'}`}>
          <SignInForm />
        </div>
        <div className={`hidden md:block text-white overlay-container absolute top-0 w-[40%] h-full bg-black overflow-hidden transition-all duration-[600ms] z-30 ${openSignUp ? 'left-0' : 'left-[60%]'}`}>
          <div id='toggle-to-sign-in' className={`absolute gap-4 w-full flex items-center justify-center flex-col py-0 px-[40px] text-center h-full transform-all duration-[600ms] ${openSignUp ? 'left-0 opacity-100 pointer-events-auto' : 'left-full opacity-0 pointer-events-none'}`}>
            <Link to='/' className='font-source-serif text-4xl font-bold'>
              eazzyBizz
            </Link>
            <div>
              Description
            </div>
            <button onClick={ toggleSignUp }>Sign In</button>
          </div>
          <div id='toggle-to-sign-up' className={`absolute gap-4 w-full flex items-center justify-center flex-col py-0 px-[40px] text-center h-full transform-all duration-[600ms] ${openSignUp ? '-left-full opacity-0 pointer-events-none' : 'left-0 opacity-100 pointer-events-auto'}`}>
            <Link to='/' className='font-source-serif text-4xl font-bold'>
              eazzyBizz
            </Link>
            <div>
              Already signed in to your account?
            </div>
            <button onClick={ toggleSignUp }>Sign Up</button>
          </div>
        </div>
      </div>
    </main>
  )
}
