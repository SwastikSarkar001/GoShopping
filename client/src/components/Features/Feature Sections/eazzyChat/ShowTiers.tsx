import { LuMoveLeft, LuMoveRight } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useGetTiersQuery } from "../../../../states/apis/plansApiSlice";
import { TierData } from "../../../../types";
import ErrorFetching from "../../../Utilities/ErrorFetching";
import { PiConfetti } from "react-icons/pi";
import { TbMoneybag } from "react-icons/tb";
import { HiX } from "react-icons/hi";

export default function ShowTiers() {
  const scrollableRef = useRef<HTMLDivElement>(null);

  // Scroll left by the width of the window
  const handleScrollLeft = () => {
    if (scrollableRef.current) scrollableRef.current.scrollBy(-100, 0);
  };
  
  // Scroll right by the width of the window
  const handleScrollRight = () => {
    if (scrollableRef.current) scrollableRef.current.scrollBy(100, 0);
  };

  const colors = [
    "from-gray-400 to-gray-500",
    "from-teal-400 to-teal-500",
    "from-green-400 to-green-500",
    "from-fuchsia-400 to-fuchsia-500",
    "from-purple-400 to-purple-500",
    "from-yellow-400 to-yellow-500",
    "from-orange-400 to-orange-500",
    "from-rose-400 to-rose-500"
  ];
  
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  /** Fetching all tiers data */
  const { data: tiersResponse, isLoading: isLoadingTiers, error: tiersError } = useGetTiersQuery({})
  const [tiers, setTiers] = useState<TierData[]>([])  // Initial state is empty; will be populated from server.

  useEffect(() => {
    if (tiersResponse) {
      setTiers(tiersResponse)
    }
  }, [tiersResponse])

  if (tiersError) {
    console.error('Error fetching tiers:', tiersError)
    return <ErrorFetching />
  }

  return (
    <section className="flex text-white flex-col items-stretch gap-16 py-16 px-8 bg-linear-to-r from-blue-500 to-blue-600 mb-20">
      <div className="flex items-center justify-between gap-3 sm:gap-6">
          <h1 className='text-3xl sm:text-4xl self-center font-bold font-source-serif'>Tier Offerings</h1>
        <div className="flex gap-3 sm:gap-6 items-center">
          <button aria-label="Scroll left" onClick={handleScrollLeft} className="cursor-pointer p-3 sm:p-4 rounded-full transition-colors text-text border-text border-2 bg-background disabled:invert hover:text-background hover:border-background hover:bg-text">
            <LuMoveLeft className="stroke-3" />
          </button>
          <button aria-label="Scroll right" onClick={handleScrollRight} className="cursor-pointer p-3 sm:p-4 rounded-full transition-colors text-text border-text border-2 bg-background hover:text-background hover:border-background hover:bg-text">
            <LuMoveRight className="stroke-3" />
          </button>
        </div>
      </div>
      <div ref={scrollableRef} className="scrollbar-hide overflow-x-scroll scroll-smooth snap-x snap-mandatory">
        <div className="flex items-stretch gap-8 p-4">
          {
            isLoadingTiers ? <div>Loading...</div> :
            tiers.map((tier, index) => (
              // Wrap each card in a motion.div to use the parent's variants
              <motion.div
                key={tier.tier}
                variants={cardVariants}
                className="snap-start"
              >
                <Card tier={tier} bgcolor={colors[index % colors.length]} />
              </motion.div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

function Card({ tier, bgcolor }: { tier: TierData, bgcolor: string }) {
  return (
    <div className={`w-60 h-full text-black bg-linear-to-l ${bgcolor} px-6 py-6 rounded-xl flex flex-col gap-6 shadow-md hover:shadow-lg transition-shadow`}>
      <div>
        <h2 className="text-2xl mb-auto font-source-serif font-semibold">{tier.tierName}</h2>
        <p className="text-sm text-gray-800">Tier {tier.tier}</p>
      </div>
      <p className="text-sm line-clamp-3">
        {tier.tierDescription}
      </p>
      <div className="border-t-2 pt-5 border-black flex flex-col text-sm">
        {
          tier.tier === 1 ? (
        <div className="*:flex *:gap-1 *:items-center">
          <div>
            <PiConfetti className="mb-0.5" /><div>Trial version available</div>
          </div>
          <div>
            <TbMoneybag className="mb-0.5" /><div>Available for paid users</div>
          </div>
        </div>
          ) : (
        <div className="*:flex *:gap-1 *:items-center">
          <div>
            <HiX className="mb-0.5" /><div>Trial version not available</div>
          </div>
          <div>
            <TbMoneybag className="mb-0.5" /><div>Only for paid users</div>
          </div>
        </div>
          )
        }
      </div>
    </div>
  )
}