import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import useAuth from "../../hooks/useAuth"
import { signOutUser } from "../../states/reducers/userSlice"
import { useAppSelector, useAppDispatch } from "../../states/store"
import { HiDotsHorizontal } from "react-icons/hi";
import { LuSettings } from "react-icons/lu"


export default function DashboardAuthBtn() {
  const user = useAuth()
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
  if (!user) return null
  else
  return (
    <div id='userbtn' className="w-full relative">
      <div className="py-2 px-2 flex items-center justify-between hover:bg-gray-400/30 rounded-full transition-colors">
        <div className="flex gap-2 items-center">
          <div className="px-3 py-1 bg-green-700 leading-6 text-white select-none rounded-full">
            {user.firstName[0].toUpperCase()}
          </div>
          <div className="flex flex-col justify-around">
            <div className="text-text font-semibold text-xs line-clamp-1">
              {user.firstName}{user.middleName ? ` ${user.middleName}` : ''} {user.lastName}
            </div>
            <div className="text-gray-400 text-xs line-clamp-1">
              {user.email}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="cursor-pointer select-none hover:bg-gray-400/30 p-1 rounded-full transition-colors text-text"
          aria-label={isOpen ? 'Close User Options' : 'Open User Options' }
        >
          <HiDotsHorizontal className="size-5" />
        </button>
      </div>
      {
        isOpen &&
        <div className="absolute z-1 inset-x-0 bottom-16 transition-all">
          <div className={`rounded-xl bg-background text-text divide-y divide-gray-400/30 border border-gray-400/30 ${theme === 'dark' ? 'shadow-[2px_2px_10px_rgba(255,_255,_255,_0.1)]' : 'shadow-[2px_2px_10px_rgba(0,_0,_0,_0.2)]'} px-4 py-2`}>
            <div className="py-2">
              <button aria-labelledby="manage-account" className="text-xs text-left flex gap-2 items-center" onClick={() => {}}>
                <LuSettings className="size-[1.3em]" />
                <div id='manage-account'>Manage Account</div>
              </button>
            </div>
            <div className="py-2">
              <Link to='/dashboard' aria-labelledby="go-dashboard" className="text-xs text-left flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1.3em]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <div id='go-dashboard'>Go to dashboard</div>
              </Link>
            </div>
            <div className="pt-2">
              <button
                aria-labelledby="logout"
                className="text-xs text-red-600 text-left flex gap-2 items-center cursor-pointer"
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
                <div id='logout'>Logout</div>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}