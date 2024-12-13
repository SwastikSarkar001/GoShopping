import { useState } from 'react'
import useTheme from '../../../../hooks/useTheme'

const qna = [{
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

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<boolean[]>(Array(qna.length).fill(false))
  const toggleAccordion = (index: number) => {
    setOpenIndex(prev => prev.map((_, i) => i === index ? !prev[i] : false))
  }
  const { theme } = useTheme()
  return (
    <section className='text-text md:px-24 text-center'>
      <h1 className='font-source-serif text-6xl font-extrabold px-8 md:px-0'>Frequently Asked Questions (FAQs)</h1>
      <div className="my-16">
        {
          qna.map((qa, index) => (
              <div className="border-t last:border-b transition-all text-left" key={index}>
                <div
                  className={`transition-colors flex items-center justify-between gap-2 p-4 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} ${openIndex[index] ? theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100' : ''}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <h2 className="text-lg font-semibold text-text">
                    { qa.question }
                  </h2>
                  <svg
                    className={`w-5 h-5 stroke-text transition-transform ${openIndex[index] ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 7l7 7 7-7" />
                  </svg>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex[index] ? 'max-h-[1000px]' : 'max-h-0'
                  }`}
                >
                  <div className="p-4 md:pb-4">
                    { qa.answer }
                  </div>
                </div>
              </div>
            )
          )
        }
      </div>
    </section>
  )
}
