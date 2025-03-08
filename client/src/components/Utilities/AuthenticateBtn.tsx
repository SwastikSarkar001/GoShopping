import { Link, useLocation } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { signOutUser, UserData } from "../../states/reducers/userSlice"
import { useAppDispatch, useAppSelector } from "../../states/store"
import { useState } from "react"
import { toast } from "sonner"

function SignInBtn() {
  const location  = useLocation()
  return (
    <Link
      to='/auth'
      state={{ from: location }}
      className="relative border-none p-[2px] rounded-full ml-4 sm:ml-8 lg:ml-16 sm:mr-[2%] cursor-pointer transition-all duration-300 shadow-[2px_2px_10px_rgba(0,_0,_0,_0.199)] bg-linear-to-r from-cyan-500 to-blue-500 outline-0 group/signin active:scale-90 after:absolute after:inset-[2px] after:z-10 hover:after:scale-[0.4] hover:after:opacity-0 after:transition-all after:duration-300 after:rounded-full after:bg-background"
    >
      <div className='relative z-20 flex items-center py-2 px-6 gap-4 bg-transparent rounded-full transition-all duration-300'>
        <div className="w-full duration-300 flex items-center justify-center">
          <svg viewBox="0 0 512 512" className='w-[1em]'>
            <path className='fill-text group-hover/signin:fill-white duration-300' d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
          </svg>
        </div>
        <div className="text-text group-hover/signin:text-white text-[1.2em] font-[600] duration-300">Login</div>
      </div>
    </Link>
  )
}

function UserBtn({user}: {user: UserData}) {
  const theme = useAppSelector(state => state.theme.theme)
  const [isOpen, setIsOpen] = useState(false)
  window.onclick = (e) => {
    if (isOpen) {
      if (e.target instanceof HTMLElement) {
        if (!e.target.closest('#userbtn.relative')) {
          setIsOpen(false)
        }
      }
    }
  }
  const dispatch = useAppDispatch()
  return (
    <div id='userbtn' className="relative">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="rounded-full cursor-pointer select-none size-11 bg-green-700 text-white flex items-center justify-center ml-4 sm:ml-8 lg:ml-16 sm:mr-[2%]">
        <div className="text-lg">
          {user.firstName[0]}
        </div>
      </button>
      {
        isOpen &&
        <div className="absolute right-0 top-16 transition-all">
          <div className={`rounded-xl bg-background ${theme === 'dark' ? 'shadow-[2px_2px_10px_rgba(255,_255,_255,_0.2)]' : 'shadow-[2px_2px_10px_rgba(0,_0,_0,_0.2)]'} p-4`}>
            <div className="flex gap-3 pb-2 border-b border-gray-400/30">
              <div className="rounded-full size-10 select-none bg-green-700 text-white flex items-center justify-center">
                <div className="text-lg">
                  {user.firstName[0]}
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div className="text-text font-bold">
                  {user.firstName}{user.middleName ? ` ${user.middleName}` : ''} {user.lastName}
                </div>
                <div className="text-gray-400 text-sm">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="py-2 border-b border-gray-400/30">
              <button className="text-sm text-left flex gap-2 items-center" onClick={() => {}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1.3em]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <div>Manage Account</div>
              </button>
            </div>
            <div className="py-2 border-b border-gray-400/30">
              <Link to='/dashboard' className="text-sm text-left flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1.3em]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <div>Go to dashboard</div>
              </Link>
            </div>
            <div className="pt-2">
              <button
                className="text-sm text-red-600 text-left flex gap-2 items-center cursor-pointer"
                onClick={
                  () => {
                    const b = confirm('Are you sure you want to logout?')
                    if (b) {
                      const promise = dispatch(signOutUser())
                      toast.promise(promise, {
                        loading: 'Logging out...',
                        success: () => 'Logged out successfully!',
                        error: (error) => error.message
                      })
                    }
                  }
                }
              >
                <svg viewBox="0 0 512 512" className="w-[1em] fill-red-600 ml-[3px] mr-[1px]">
                  <path
                    d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                  />
                </svg>
                <div>Logout</div>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default function AuthenticateBtn() {
  const user = useAuth()
  return (
    <>
      { user === null ? <SignInBtn /> : <UserBtn user={user} /> }
    </>
  )
}
