import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function SignInForm() {
  const navigate = useNavigate()
  const sampleFn = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigate('/')
    toast.success('Sign in successful')
  }
  return (
    <form method='post' className="size-full overflow-hidden flex flex-col items-center justify-center gap-4 p-4">
      <Link to='/' className='block md:hidden font-source-serif text-4xl font-bold'>
        eazzyBizz
      </Link>
      <div className='text-center'>
        <div className='mt-2 capitalize text-3xl font-bold font-source-serif'>Sign in</div>
      </div>
      <div className="relative flex items-center w-4/5 border-b-2 has-[>input[value='']]:border-green-400 has-[>input:focus]:border-cyan-400 has-[>input:invalid]:border-orange-400 has-[>input:not(:placeholder-shown)]:border-cyan-400 has-[>input:invalid:not(:placeholder-shown)]:border-orange-400">
        <label
          htmlFor="username"
          className="absolute top-1/2 -translate-y-1/2 left-8 pointer-events-none transition-all duration-150 ease-[ease] has-[~input:focus]:top-1 has-[~input:focus]:-translate-y-[120%] has-[~input:focus]:left-0 has-[~input:focus]:text-sm has-[~input:not(:placeholder-shown)]:top-1 has-[~input:not(:placeholder-shown)]:-translate-y-[120%] has-[~input:not(:placeholder-shown)]:left-0 has-[~input:not(:placeholder-shown)]:text-sm"
        >
          Enter your username
        </label>
        <label htmlFor="username" className='size-6 pl-2 cursor-pointer *:size-full'>
          <UserSVG />
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          className="w-full focus:outline-none pl-3 pr-2 py-1 bg-transparent placeholder:text-transparent"
          required
        />
      </div>
      
      <button onClick={sampleFn} className="px-6 py-2 *:font-source-serif border-2 rounded-full shadow-md flex gap-4 items-center">
        <div>
          <svg viewBox="0 0 512 512" className='w-[1em]'>
            <path className='fill-black duration-300' d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
          </svg>
        </div>
        <div>Sign in</div>
      </button>
    </form>
  )
}


function UserSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  )
}

function PasswordSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
    </svg>
  )
}

{/* <div className="relative w-1/2 border-b-2 has-[>input[value='']]:border-green-400 has-[>input:focus]:border-cyan-400 has-[>input:invalid]:border-orange-400 has-[>input:not(:placeholder-shown)]:border-cyan-400 has-[>input:invalid:not(:placeholder-shown)]:border-orange-400">
        <label
          htmlFor="password"
          className="absolute top-1/2 -translate-y-1/2 left-2  pointer-events-none transition-all duration-150 ease-[ease] has-[~input:focus]:top-1 has-[~input:focus]:-translate-y-[120%] has-[~input:focus]:left-0 has-[~input:focus]:text-sm has-[~input:not(:placeholder-shown)]:top-1 has-[~input:not(:placeholder-shown)]:-translate-y-[120%] has-[~input:not(:placeholder-shown)]:left-0 has-[~input:not(:placeholder-shown)]:text-sm"
        >
          Enter your password
        </label>
        <input
          type="text"
          name="password"
          id="password"
          placeholder="Enter your password"
          className="w-full focus:outline-none px-2 py-1 bg-transparent  placeholder:text-transparent"
          required
        />
      </div> */}