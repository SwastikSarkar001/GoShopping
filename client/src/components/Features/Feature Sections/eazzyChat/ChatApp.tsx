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
import { ColorSchemeType, QnAType } from "../../Feature"

const qna: QnAType[] = [{
  question: 'What is eazzyChat?',
  answer: "eazzyChat is a free communication platform designed to enhance collaboration within and between businesses. It's one of the featured apps of eazzyBizz, our enterprise resource management platform."
}, {
  question: 'Can I integrate eazzyChat with other tools?',
  answer: 'Not yet, but we are working on it. We plan to add integrations with popular tools like Slack, Microsoft Teams, and Google Chat in the future.'
}, {
  question: 'Who can use eazzyChat?',
  answer: 'eazzyChat is perfect for businesses of all sizes—startups, SMEs, and large enterprises. It helps teams communicate effectively and streamline operations.'
}, {
  question: 'What are the benefits of eazzyChat?',
  answer: 'eazzyChat enables real-time text and media communication between users. It is designed to enhance collaboration within and between businesses.'
}, {
  question: 'How secure is eazzyChat?',
  answer: 'Security is our top priority. eazzyChat offers end-to-end encryption, ensuring that your messages and data are safe from unauthorized access.'
}, {
  question: 'Where is my data stored?',
  answer: 'All data is stored securely on our servers, which comply with the highest standards of data protection and privacy regulations.'
}, {
  question: 'How much does eazzyChat cost?',
  answer: 'eazzyChat is free to use for all users. All you have to do is sign up for eazzyBizz, our enterprise resource management platform.'
}, {
  question: 'How can I get eazzyChat?',
  answer: 'You can get eazzyChat by signing up for eazzyBizz, our enterprise resource management platform. eazzyChat is one of the featured apps of eazzyBizz.'
}, {
  question: 'Can I use eazzyChat on mobile devices?',
  answer: 'Yes! eazzyChat is available as a web app and is fully responsive on both desktop and mobile devices. Mobile apps for iOS and Android are in development.'
}, {
  question: 'What kind of customer support do you offer?',
  answer: 'Our support team is available 24/7 via phone call and email to assist you with any questions or issues. Our WhatsApp support line is also available during business hours.'
}
]

export default function ChatApp({ colorScheme }: { colorScheme: ColorSchemeType }) {
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
  return (
    <main className="min-h-screen flex flex-col items-stretch [&>:nth-last-child(2)]:mb-auto [&>:first-child]:fixed">
      <Navbar ref={ref} animate={controls} />
      <HeroSection colorScheme={colorScheme} />
      <AppFeatures />
      <ShowTiers colorScheme={colorScheme} />
      <FAQs qna={qna} />
      <CTA colorScheme={colorScheme} />
      <Footer />
    </main>
  )
}
