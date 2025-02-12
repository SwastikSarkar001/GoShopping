import { IoShieldHalfSharp } from "react-icons/io5"
import { IoChatbubbleEllipses } from "react-icons/io5"
import { FcOpenedFolder } from "react-icons/fc";
import { FcMultipleDevices } from "react-icons/fc";
import { useAppSelector } from "../../../../states/store";

const details = [{
    title: "Secure and Reliable Communication",
    description: "End-to-end encryption ensures your business conversations remain private and protected.",
    icon: <IoShieldHalfSharp className="fill-teal-400" />
  }, {
    title: 'Seamless File Sharing',
    description: 'Easily share files, images and videos with your team in one click.',
    icon: <FcOpenedFolder />
  }, {
    title: 'Customizable Channels',
    description: 'Create channels for specific teams or projects to keep your communications organized.',
    icon: <IoChatbubbleEllipses className="fill-fuchsia-400" />
  }, {
    title: 'Cross-Platform Access',
    description: 'Access eazzyChat from desktop, tablet, or mobile devices with ease.',
    icon: <FcMultipleDevices />
  }
]

export default function AppFeatures() {
  const theme = useAppSelector(state => state.theme.theme)
  return (
    <section className="text-text py-32 px-16 flex flex-wrap items-stretch justify-center place-items-center text-center gap-16">
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
