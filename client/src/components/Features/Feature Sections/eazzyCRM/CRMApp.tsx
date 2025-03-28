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

export type CRMComponentProps = {
  colorScheme: ColorSchemeType,
  isAuthenticated: boolean,
  componentNumber: number,
  setComponentNumber: React.Dispatch<React.SetStateAction<number>>
}

const qna = [
  {
    question: 'What is eazzyCRM?',
    answer: "eazzyCRM is a premium customer relationship management platform designed to empower your sales and support teams with a 360° view of customer interactions. It's a key component of the eazzyBizz suite."
  },
  {
    question: 'Who can benefit from eazzyCRM?',
    answer: 'eazzyCRM is ideal for businesses of all sizes—from startups to large enterprises—that want to improve customer engagement, streamline sales processes, and gain actionable insights.'
  },
  {
    question: 'What features does eazzyCRM offer?',
    answer: 'eazzyCRM provides a comprehensive set of features including a 360° customer view, automated workflows, sales pipeline management, and custom reporting & analytics to drive data-informed decisions.'
  },
  {
    question: 'How secure is eazzyCRM?',
    answer: 'Security is a top priority at eazzyCRM. We employ industry-standard encryption and robust security protocols to ensure that all customer data and interactions remain safe and confidential.'
  },
  {
    question: 'How does eazzyCRM integrate with other tools?',
    answer: 'eazzyCRM seamlessly integrates with the other applications in the eazzyBizz platform. We are continuously working on adding integrations with popular third-party tools to further enhance your workflow.'
  },
  {
    question: 'Can I customize the CRM dashboard?',
    answer: 'Absolutely! eazzyCRM offers a highly customizable dashboard, allowing you to tailor views and reports to suit your business needs and track the metrics that matter most.'
  },
  {
    question: 'How can eazzyCRM help my sales team?',
    answer: 'eazzyCRM streamlines the sales process by providing clear insights into customer journeys, automating routine tasks, and offering tools for efficient pipeline management to help your team close deals faster.'
  },
  {
    question: 'What kind of customer support do you offer?',
    answer: 'Our dedicated support team is available 24x7 to assist you via phone and email around the clock. We also offer a comprehensive help center with tutorials, guides, and best practices to ensure your success.'
  },
  {
    question: 'How do I get started with eazzyCRM?',
    answer: 'You can start using eazzyCRM by signing up through the eazzyBizz platform. Once registered, you’ll gain access to all the powerful tools designed to enhance your customer relationships.'
  },
  {
    question: 'Is there a free trial available?',
    answer: 'eazzyCRM is a premium solution, but we offer a risk-free trial period of 15 days so you can experience the benefits firsthand before making a commitment.'
  }
];

export default function CRMApp({ colorScheme }: { colorScheme: ColorSchemeType }) {
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
