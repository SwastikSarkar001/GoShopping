import { Link } from 'react-router-dom'

export default function SignUpForm() {
  return (
    <form action="" className="size-full overflow-hidden flex flex-col items-center justify-center gap-8 p-8">
      <div className='text-center'>
        <div className='mt-2 capitalize text-3xl font-bold font-source-serif'>Register yourself</div>
      </div>
      <div className="relative w-1/2 border-b-2 has-[>input[value='']]:border-green-400 has-[>input:focus]:border-cyan-400 has-[>input:invalid]:border-orange-400 has-[>input:not(:placeholder-shown)]:border-cyan-400 has-[>input:invalid:not(:placeholder-shown)]:border-orange-400">
        <label
          htmlFor="fname"
          className="absolute top-1/2 -translate-y-1/2 left-2  pointer-events-none transition-all duration-150 ease-[ease] has-[~input:focus]:top-1 has-[~input:focus]:-translate-y-[120%] has-[~input:focus]:left-0 has-[~input:focus]:text-sm has-[~input:not(:placeholder-shown)]:top-1 has-[~input:not(:placeholder-shown)]:-translate-y-[120%] has-[~input:not(:placeholder-shown)]:left-0 has-[~input:not(:placeholder-shown)]:text-sm"
        >
          Enter your first name
        </label>
        <input
          type="text"
          name="fname"
          id="fname"
          placeholder="Enter your first name"
          className="w-full focus:outline-none px-2 py-1 bg-transparent placeholder:text-transparent"
          required
        />
      </div>
      <div className="relative w-1/2 border-b-2 has-[>input[value='']]:border-green-400 has-[>input:focus]:border-cyan-400 has-[>input:invalid]:border-orange-400 has-[>input:not(:placeholder-shown)]:border-cyan-400 has-[>input:invalid:not(:placeholder-shown)]:border-orange-400">
        <label
          htmlFor="lname"
          className="absolute top-1/2 -translate-y-1/2 left-2  pointer-events-none transition-all duration-150 ease-[ease] has-[~input:focus]:top-1 has-[~input:focus]:-translate-y-[120%] has-[~input:focus]:left-0 has-[~input:focus]:text-sm has-[~input:not(:placeholder-shown)]:top-1 has-[~input:not(:placeholder-shown)]:-translate-y-[120%] has-[~input:not(:placeholder-shown)]:left-0 has-[~input:not(:placeholder-shown)]:text-sm"
        >
          Enter your last name
        </label>
        <input
          type="text"
          name="lname"
          id="lname"
          placeholder="Enter your last name"
          className="w-full focus:outline-none px-2 py-1 bg-transparent  placeholder:text-transparent"
          required
        />
      </div>
      <div className="relative w-1/2 border-b-2 has-[>input[value='']]:border-green-400 has-[>input:focus]:border-cyan-400 has-[>input:invalid]:border-orange-400 has-[>input:not(:placeholder-shown)]:border-cyan-400 has-[>input:invalid:not(:placeholder-shown)]:border-orange-400">
        <label
          htmlFor="email"
          className="absolute top-1/2 -translate-y-1/2 left-2  pointer-events-none transition-all duration-150 ease-[ease] has-[~input:focus]:top-1 has-[~input:focus]:-translate-y-[120%] has-[~input:focus]:left-0 has-[~input:focus]:text-sm has-[~input:not(:placeholder-shown)]:top-1 has-[~input:not(:placeholder-shown)]:-translate-y-[120%] has-[~input:not(:placeholder-shown)]:left-0 has-[~input:not(:placeholder-shown)]:text-sm"
        >
          Enter your email address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email address"
          className="w-full focus:outline-none px-2 py-1 bg-transparent  placeholder:text-transparent"
          required
        />
      </div>
      <div className="relative w-1/2 border-b-2 has-[>input[value='']]:border-green-400 has-[>input:focus]:border-cyan-400 has-[>input:invalid]:border-orange-400 has-[>input:not(:placeholder-shown)]:border-cyan-400 has-[>input:invalid:not(:placeholder-shown)]:border-orange-400">
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
      </div>
      <button className="px-6 py-2 *:font-source-serif border-2 rounded-full  shadow-md flex gap-4 items-center">
        <div>
          <svg viewBox="0 0 512 512" className='w-[1em]'>
            <path className='fill-black duration-300' d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
          </svg>
        </div>
        <div>Register</div>
      </button>
    </form>
  )
}
