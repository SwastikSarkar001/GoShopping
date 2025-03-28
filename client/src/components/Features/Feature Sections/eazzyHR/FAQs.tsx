import { useState } from 'react'
import { useAppSelector } from '../../../../states/store'

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

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<boolean[]>(Array(qna.length).fill(false))
  const toggleAccordion = (index: number) => {
    setOpenIndex(prev => prev.map((_, i) => i === index ? !prev[i] : false))
  }
  const theme = useAppSelector(state => state.theme.theme)
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
