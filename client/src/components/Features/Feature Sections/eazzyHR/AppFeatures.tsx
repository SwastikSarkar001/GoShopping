import { useAppSelector } from "../../../../states/store";
import { FaUserCog, FaRegCalendarCheck, FaMoneyBillAlt, FaFileAlt } from "react-icons/fa";

const details = [
  {
    title: "Automated Payroll Management",
    description: "Process employee salaries accurately and on time with automated payroll workflows.",
    icon: <FaMoneyBillAlt className="fill-yellow-500" />
  },
  {
    title: "Leave & Attendance Tracking",
    description: "Track employee attendance, manage leave requests, and ensure compliance effortlessly.",
    icon: <FaRegCalendarCheck className="fill-blue-500" />
  },
  {
    title: "Seamless Recruitment & Onboarding",
    description: "Manage hiring, interviews, and onboarding smoothly with intuitive tools.",
    icon: <FaUserCog className="fill-green-500" />
  },
  {
    title: "Custom Reports & Analytics",
    description: "Generate insightful reports to track employee performance and make data-driven decisions.",
    icon: <FaFileAlt className="fill-red-500" />
  }
];


export default function AppFeatures() {
  const theme = useAppSelector(state => state.theme.theme)
  return (
    <section className="text-text py-24 px-16 flex flex-wrap items-stretch justify-center place-items-center text-center gap-16">
      {
        details.map((detail, index) => (
          <div key={index} className={`border-2 ${ theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10' } rounded-2xl min-w-48 w-full max-w-xs p-8 duration-150 flex items-center justify-between flex-col gap-4`}>
            <div className="flex items-center flex-col gap-8">
              <div className="rounded-full text-4xl">{ detail.icon }</div>
              <div className="text-2xl capitalize">{ detail.title }</div>
            </div>
            <div>{ detail.description }</div>
          </div>
        ))
      }
    </section>
  )
}
