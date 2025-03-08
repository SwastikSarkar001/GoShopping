import { FaRotateLeft } from "react-icons/fa6";

export default function ErrorFetching() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 text-red-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
      <h1 className="text-3xl text-red-500">Error fetching data</h1>
      <p className="text-lg text-gray-600">There might be some issues with the server. Please try again later.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition cursor-pointer"
      >
        <FaRotateLeft />
        <div>Retry</div>
      </button>
    </div>
  )
}
