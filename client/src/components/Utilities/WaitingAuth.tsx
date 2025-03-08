export default function WaitingAuth() {
  return (
    <main className="grid place-content-center bg-background h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 border-t-4 border-blue-500 rounded-full animate-spin" />
        <h1 className="text-2xl font-semibold text-text">Checking for authentication status...</h1>
      </div>
    </main>
  )
}
