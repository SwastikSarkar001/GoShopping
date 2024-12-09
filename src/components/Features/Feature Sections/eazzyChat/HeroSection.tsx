import ChatappSVG from "./ChatappSVG"
import { FaArrowRightLong } from "react-icons/fa6";

export default function HeroSection() {
  return (
    <section className="h-screen bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex gap-8 lg:gap-16 px-[8%]">
      <div className="md:w-[50%] h-full flex flex-col gap-8 justify-center">
        <h1 className="text-6xl font-extrabold font-source-serif mb-8">eazzyChat</h1>
        <div>
          <p className="text-3xl">
            Effortless Communication for Businesses, Anytime, Anywhere
          </p>
          <p className="mt-2 text-[#ddd]">Communication without the cost. Just sign up and start chatting!</p>
        </div>
        <button
          onClick={() => window.location.href=import.meta.env.VITE_EAZZYCHAT_URL}
          className="px-4 w-max py-2 flex duration-[150ms] ease-in-out items-center gap-2 border-2 border-teal-600 bg-teal-600 shadow-md shadow-black/20 hover:scale-105 hover:bg-teal-900 hover:shadow-lg hover:shadow-black/30"
        >
          <p>Try eazzyChat Now</p>
          <FaArrowRightLong />
        </button>
      </div>
      <div className="hidden md:block w-1/2">
        <ChatappSVG />
      </div>
    </section>
  )
}
