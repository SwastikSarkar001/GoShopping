import { useAppSelector } from "../../../../states/store";
import { IoIosContact, IoIosSettings, IoMdCart, IoIosStats } from "react-icons/io";

const details = [
  {
    title: "360° Customer View",
    description: "Access comprehensive customer profiles and detailed interaction histories at a glance.",
    icon: <IoIosContact className="fill-blue-500" />
  },
  {
    title: "Automated Workflows",
    description: "Streamline your sales process with smart automation and seamless follow-ups.",
    icon: <IoIosSettings className="fill-green-500" />
  },
  {
    title: "Sales Pipeline Management",
    description: "Visualize and manage your sales funnel to close deals faster with intuitive tools.",
    icon: <IoMdCart className="fill-purple-500" />
  },
  {
    title: "Custom Reporting & Analytics",
    description: "Generate actionable insights with tailored reports and real-time data analysis.",
    icon: <IoIosStats className="fill-orange-500" />
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
