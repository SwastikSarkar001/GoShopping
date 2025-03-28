import { useState } from 'react'
import { useAppSelector } from '../../../../states/store'
import { QnAType } from '../../Feature';

export default function FAQs({ qna }: { qna: QnAType[] }) {
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
