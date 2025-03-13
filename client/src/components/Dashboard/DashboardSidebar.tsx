import { IoHome } from "react-icons/io5";
import { IoBarChart } from "react-icons/io5";
import { HiUsers } from "react-icons/hi2";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { LuSettings } from "react-icons/lu";
import Sidebar, { SidebarItem } from "./Sidebar";
import ActivePlans from "./components/ActivePlans";
import Users from "./components/Users";
import Settings from "./components/Settings";
import MainContent from "./components/MainContent";
import Analytics from "./components/Analytics";
import Reports from "./components/Analytics/Reports";
import Stats from "./components/Analytics/Stats";
import Performance from "./components/Analytics/Performance";

const navigationItems: SidebarItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: IoHome,
    content: <MainContent />,
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: IoBarChart,
    content: <Analytics />,
    subItems: [
      { id: "reports", title: "Reports", content: <Reports /> },
      { id: "statistics", title: "Statistics", content: <Stats /> },
      { id: "performance", title: "Performance", content: <Performance /> },
    ],
  },
  {
    id: "users",
    title: "Users",
    icon: HiUsers,
    content: <Users />,
  },
  {
    id: "active-plans",
    title: "Active Plans",
    icon: BiSolidPurchaseTag,
    content: <ActivePlans />,
  },
  {
    id: "settings",
    title: "Settings",
    icon: LuSettings,
    content: <Settings />,
  },
]

export default function DashboardSidebar() {
  return (
    <Sidebar items={navigationItems} />
  )
}