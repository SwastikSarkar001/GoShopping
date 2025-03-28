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
import { ColorSchemeType } from "../../Feature"

export type HRComponentProps = {
  colorScheme: ColorSchemeType,
  isAuthenticated: boolean,
  componentNumber: number,
  setComponentNumber: React.Dispatch<React.SetStateAction<number>>
}


const qna = [
  {
    question: "What is eazzyHR?",
    answer: "eazzyHR is a human resources management platform that automates and simplifies all HR-related processes, from recruitment to payroll, for businesses of all sizes."
  },
  {
    question: "Who can use eazzyHR?",
    answer: "eazzyHR is perfect for businesses of all sizes that want to manage their human resources more effectively and reduce manual effort."
  },
  {
    question: "Does eazzyHR support payroll automation?",
    answer: "Yes! eazzyHR automates the entire payroll process, ensuring timely and accurate salary processing."
  },
  {
    question: "How does eazzyHR handle leave and attendance tracking?",
    answer: "eazzyHR provides a centralized dashboard to manage employee leave requests and track attendance in real time."
  },
  {
    question: "Can I customize reports in eazzyHR?",
    answer: "Absolutely! eazzyHR allows you to create and customize reports to analyze employee data and make informed decisions."
  },
  {
    question: "How secure is eazzyHR?",
    answer: "Security is a priority for eazzyHR. We implement industry-standard encryption and data protection measures to safeguard sensitive information."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! You can explore eazzyHR with a free trial and experience the benefits before committing."
  }
];

export default function HRApp({ colorScheme }: { colorScheme: ColorSchemeType }) {
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
      <HeroSection colorScheme={colorScheme} isAuthenticated={isAuthenticated} componentNumber={componentNumber} setComponentNumber={setComponentNumber} />
      <AppFeatures />
      <ShowTiers colorScheme={colorScheme} />
      <FAQs qna={qna} />
      <CTA colorScheme={colorScheme} isAuthenticated={isAuthenticated} componentNumber={componentNumber} setComponentNumber={setComponentNumber} />
      <Footer />
    </main>
  )
}
