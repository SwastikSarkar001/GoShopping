import { createContext, useContext, useEffect, useState, Suspense, lazy } from "react"
import { createPortal } from "react-dom"
import Loading from "../Utilities/Loading"
import { AnimatePresence, motion, Variants } from "framer-motion"
import { HiOutlineMenu, HiX } from "react-icons/hi"
import { LuChevronRight } from "react-icons/lu"
import DashboardAuthBtn from "./DashboardAuthBtn"
import ThemeToggler from "../Utilities/ThemeToggler"
import Footer from "../Utilities/Footer"

export type SidebarItem = {
  id: string
  title: string
  icon?: React.ComponentType<{ className: string }>
  content: React.ReactNode,
  subItems?: SidebarItem[]
}

// Context to manage sidebar state
type SidebarContextType = {
  expanded: boolean
  toggleSidebar: () => void
  activeItem: string
  setActiveItem: (item: string) => void
  expandedSubMenus: string[]
  toggleSubMenu: (item: string) => void
  items: SidebarItem[]
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

type SidebarProps = {
  items: SidebarItem[]
}

export default function Sidebar({ items }: React.PropsWithChildren<SidebarProps>) {
  const [expanded, setExpanded] = useState(false)
  const [activeItem, setActiveItem] = useState("dashboard")
  const [expandedSubMenus, setExpandedSubMenus] = useState<string[]>([])
  const toggleSidebar = () => setExpanded(!expanded)

  const toggleSubMenu = (itemId: string) => {
    setExpandedSubMenus((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Clean up on unmount or when open changes.
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  return (
    <SidebarContext.Provider
      value={{
        expanded,
        toggleSidebar,
        activeItem,
        setActiveItem,
        expandedSubMenus,
        toggleSubMenu,
        items: items,
      }}
    >
      <div className="flex min-h-screen relative">
        <SidebarNav />
        <main className="flex-1 flex flex-col transition-all duration-300 ml-20 overflow-x-hidden overflow-y-auto">
          <SidebarContent />
          <Footer />
        </main>
      </div>
      <SidebarOverlay onClick={toggleSidebar} />
    </SidebarContext.Provider>
  )
}

export function SidebarOverlay({ onClick }: { onClick: () => void }) {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("SidebarOverlay must be used within a Sidebar");
  }
  const { expanded } = context;
  return createPortal(
    <AnimatePresence>
      {expanded && (
        <motion.div
          onClick={onClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed top-0 left-0 w-full h-full bg-black/50 z-98"
        />
      )}
    </AnimatePresence>,
    document.body
  );
}

function SidebarNav() {
  const { expanded, toggleSidebar, items } = useContext(SidebarContext)!

  // Animation variants
  const sidebarVariants: Variants = {
    expanded: { width: "320px" },
    collapsed: { width: "80px" },
  }

  return (
    <motion.div
      className="fixed z-99 flex flex-col inset-y-0 left-0 h-screen bg-background text-text overflow-hidden shadow-lg border-r-2 border-gray-500/30"
      initial={expanded ? "expanded" : "collapsed"}
      animate={expanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {/* <AnimatePresence> */}
          {
            expanded &&
            <div
              // initial={{ opacity: 0 }}
              // animate={{ opacity: 1 }}
              // exit={{ opacity: 0 }}
              // transition={{ duration: 0.3 }}
              className="flex origin-left items-center gap-3 text-2xl font-bold font-source-serif"
            >
              eazzyBizz
            </div>
          }
        {/* </AnimatePresence> */}
        <button onClick={toggleSidebar} aria-label={ expanded ? 'Close Sidebar' : 'Open Sidebar' } className={`p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors`}>
          {
            expanded ?
            <HiX className="size-5" /> :
            <HiOutlineMenu className="size-5" />
          }
        </button>
      </div>

      {/* Navigation Items */}
      <div className="py-4 grow overflow-y-auto overflow-x-hidden">
        {items.map((item) => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className={`${expanded ? '' : 'hidden'} bottom-0 left-0 right-0 px-2 py-4 border-t border-gray-400/30`}>
        <div className="flex items-center flex-col gap-3 text-gray-300 hover:text-white transition-colors">
          <div className="flex items-center w-full gap-3 px-2">
            <ThemeToggler disableTooltip />
            <div className="font-semibold text-text text-nowrap">Switch Theme</div>
          </div>
          <DashboardAuthBtn />
        </div>
      </div>
    </motion.div>
  )
}

type SidebarItemProps = {
  item: SidebarItem
}

function SidebarItem({ item }: SidebarItemProps) {
  const { expanded, activeItem, setActiveItem, expandedSubMenus, toggleSubMenu } = useContext(SidebarContext)!
  const isActive = activeItem === item.id
  const hasSubItems = item.subItems && item.subItems.length > 0
  const isSubMenuExpanded = expandedSubMenus.includes(item.id)

  // Animation variants for submenu
  const subMenuVariants: Variants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.25,
          delay: 0.05,
        },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.2,
        },
      },
    },
  }

  return (
    <div>
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
          isActive ? "bg-indigo-500 text-text-inversed dark:text-text dark:bg-indigo-700" : "hover:bg-gray-200 dark:hover:bg-gray-800"
        }`}
        onClick={() => {
          setActiveItem(item.id)
          if (!hasSubItems) {
            // If no subitems, just set active
          }
        }}
      >
        <div className="flex items-center gap-3 pl-2">
          {item.icon && <item.icon className='size-5' />}
          {expanded && <span className="text-nowrap">{item.title}</span>}
        </div>

        {hasSubItems && expanded && (
          <button
            className={`p-1 rounded-full transition-transform duration-300 ${isSubMenuExpanded ? "rotate-90" : ""}`}
            onClick={(e) => {
              e.stopPropagation()
              toggleSubMenu(item.id)
            }}
          >
            <LuChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Submenu items */}
      {hasSubItems && expanded && (
        <AnimatePresence initial={false}>
          {isSubMenuExpanded && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={subMenuVariants}
              className="overflow-hidden bg-gray-300 dark:bg-gray-800"
            >
              {item.subItems && item.subItems.map((subItem) => (
                <div
                  key={subItem.id}
                  className={`flex items-center pl-12 pr-4 py-2 cursor-pointer transition-colors ${
                    activeItem === subItem.id ? "text-text-inversed dark:text-text bg-blue-500 dark:bg-blue-700" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveItem(subItem.id)}
                >
                  <span className="text-sm">{subItem.title}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}


function SidebarContent() {
  const { activeItem, items } = useContext(SidebarContext)!;
  const activeItemData = items.find((item) => item.id === activeItem);

  const LazyComponent = activeItemData
    ? lazy(() => Promise.resolve({ default: () => activeItemData.content }))
    : null;

  return (
    <div className="flex-1 mb-auto">
      {LazyComponent && (
        <Suspense fallback={<Loading full />}>
          <LazyComponent />
        </Suspense>
      )}
    </div>
  );
}