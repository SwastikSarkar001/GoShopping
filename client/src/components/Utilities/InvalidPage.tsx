import { useEffect } from "react"

export default function InvalidPage() {
  useEffect(() => {
    document.title = '404 Not Found'
  }, [])
  return (
    <main className="relative px-4 flex h-screen items-center justify-center flex-col *:text-center bg-white">
      <h1 className="text-8xl leading-[6rem] text-red-800 font-extrabold">404</h1>
      <h2 className="text-xl text-red-800 capitalize font-bold">Page not found</h2>
      <p className="mt-8">Hmm... It looks like there's a typo in the URL.</p>
      <p>Double-check it and try again!</p>
    </main>
  )
}