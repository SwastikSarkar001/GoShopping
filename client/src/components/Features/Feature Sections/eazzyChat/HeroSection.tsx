import ChatappSVG from "./ChatappSVG"
import { FaArrowRightLong } from "react-icons/fa6";

export default function HeroSection() {
  return (
    <section className="h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex gap-8 lg:gap-16 px-[8%]">
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
          className="px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-2 border-2 border-white bg-white text-blue-500 shadow-md shadow-black/20 hover:scale-105 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-90 active:shadow-sm active:shadow-black/10"
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
