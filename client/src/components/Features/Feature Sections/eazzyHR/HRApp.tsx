import { useEffect, useRef, useState } from "react"

import Navbar from "../../Navbar"
import HeroSection from "./HeroSection"
import AppFeatures from "./AppFeatures"
import FAQs from "./FAQs"
import CTA from "./CTA"
import Footer from "../../../Utilities/Footer"
import { useAnimation } from "framer-motion";
import { useAppSelector } from "../../../../states/store";
import ShowTiers from "./ShowTiers"
import { useGetUserPlansQuery } from "../../../../states/apis/plansApiSlice"

export type HRComponentProps = {
  isAuthenticated: boolean,
  componentNumber: number,
  setComponentNumber: React.Dispatch<React.SetStateAction<number>>
}

export default function HRApp() {
  const [scrolled, setScrolled] = useState(false)
  const handleScroll = () => {
    const scrollThreshold = window.innerHeight * 0.15; // 15% of viewport height
    if (window.scrollY > scrollThreshold) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }
  
  window.onscroll = handleScroll
  const theme = useAppSelector(state => state.theme.theme)
  const ref = useRef<HTMLDivElement>(null)
  /* For filling background */
	const controls = useAnimation();
	useEffect(() => {
		controls.start({
			borderBottomWidth: scrolled ? '2px' : '0px',
			backgroundColor: (theme === 'dark') ? scrolled ? '#030711ff' : '#03071100' : scrolled ? '#fcf8eeff' : '#03071100',
			transition: { duration: 0.2 },
		});
	}, [scrolled, controls, theme])

  
  const [componentNumber, setComponentNumber] = useState(0);
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
  const [shouldPoll, setShouldPoll] = useState(false);

  const { data: userPlans, error, refetch } = useGetUserPlansQuery(
    {},
    {
      skip: !isAuthenticated,
      pollingInterval: shouldPoll ? 10000 : 0, // No polling if no "Pending" status
    }
  );

  // Refresh data on mount or when isAuthenticated changes
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);
  
  useEffect(() => {
    if (userPlans) {
      const eazzyCrmPlan = userPlans['eazzy-crm']
      const hasPending = eazzyCrmPlan?.find((plan) => plan.userStatus === "Pending");
      setShouldPoll(!!hasPending);
      if (!eazzyCrmPlan) {
        setComponentNumber(1);
      }
      else {
        if (eazzyCrmPlan.find(plan => plan.userStatus === 'Active')) {
          setComponentNumber(2);
        }
        else if (eazzyCrmPlan.find(plan => plan.userStatus === 'Pending')) {
          setComponentNumber(3);
        }
        else if (eazzyCrmPlan.find(plan => plan.userStatus === 'Expired' || plan.userStatus === 'Cancelled')) {
          if (!eazzyCrmPlan.find(plan => plan.subStatus === 'Monthly' || plan.subStatus === 'Yearly')) {
            setComponentNumber(4);
          }
          else {
            setComponentNumber(5);
          }
        }
        else {
          setComponentNumber(6);
        }
      }
    }
  }, [userPlans]);
  if (error) return <div>Error</div>;
  else
  return (
    <main className="min-h-screen flex flex-col items-stretch [&>:nth-last-child(2)]:mb-auto [&>:first-child]:fixed">
      <Navbar ref={ref} animate={controls} />
      <HeroSection isAuthenticated={isAuthenticated} componentNumber={componentNumber} setComponentNumber={setComponentNumber} />
      <AppFeatures />
      <ShowTiers />
      <FAQs />
      <CTA isAuthenticated={isAuthenticated} componentNumber={componentNumber} setComponentNumber={setComponentNumber} />
      <Footer />
    </main>
  )
}
