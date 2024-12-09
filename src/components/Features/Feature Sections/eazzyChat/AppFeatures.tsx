import useTheme from "../../../../contexts/useTheme"

export default function AppFeatures() {
  const { theme } = useTheme()
  return (
    <section className="text-text py-16 px-16 flex flex-col md:flex-row items-stretch *:flex-grow text-center gap-16">
      <div className={`border-2 ${ theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10' } rounded-2xl p-8 duration-150 flex items-center justify-center flex-col gap-4`}>
        <div className="rounded-full">Logo</div>
        <div>Description</div>
      </div>
      <div className={`border-2 ${ theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10' } rounded-2xl p-8 duration-150 flex items-center justify-center flex-col gap-4`}>
        <div className="rounded-full">Logo</div>
        <div>Description</div>
      </div>
      <div className={`border-2 ${ theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10' } rounded-2xl p-8 duration-150 flex items-center justify-center flex-col gap-4`}>
        <div className="rounded-full">Logo</div>
        <div>Description</div>
      </div>
      <div className={`border-2 ${ theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10' } rounded-2xl p-8 duration-150 flex items-center justify-center flex-col gap-4`}>
        <div className="rounded-full">Logo</div>
        <div>Description</div>
      </div>
    </section>
  )
}
