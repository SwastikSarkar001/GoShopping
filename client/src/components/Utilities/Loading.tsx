type LoadingProps = {
  full?: boolean
}

export default function Loading({ full = false }: LoadingProps) {
  return (
    <main className={`grid place-content-center bg-background ${full? 'h-full' : 'h-screen'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 border-t-4 border-blue-500 rounded-full animate-spin" aria-label='Loading' />
        <h1 className="text-2xl font-semibold text-text">Loading...</h1>
      </div>
    </main>
  )
}
