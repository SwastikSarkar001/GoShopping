export default function Loading() {
  return (
    <main className="grid place-content-center bg-background h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 border-4 border-t-[4px] border-blue-500 rounded-full animate-spin"></div>
        <h1 className="text-2xl font-semibold text-text">Loading...</h1>
      </div>
    </main>
  )
}
