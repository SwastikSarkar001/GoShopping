import { useEffect, useRef, useState } from "react"
import { NavLink } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "../Footer"

const details = [{
  featureID: "inventory-management",
  title: "Inventory Management",
  description: "Manage your stock levels, orders, and suppliers efficiently.",
  }, {
  featureID: "customer-relationship-management",
  title: "Customer Relationship Management",
  description: "Track and manage customer interactions and data throughout the customer lifecycle.",
  }, {
  featureID: "sales-analytics",
  title: "Sales Analytics",
  description: "Analyze sales data to make informed business decisions.",
  }, {
  featureID: "order-processing",
  title: "Order Processing",
  description: "Automate and streamline your order processing workflow.",
  }, {
  featureID: "financial-management",
  title: "Financial Management",
  description: "Manage your financial operations, including accounting, invoicing, and budgeting.",
  }, {
    featureID: "human-resources",
    title: "Human Resources",
    description: "Manage employee records, payroll, and benefits.",
  }, {
    featureID: "project-management",
    title: "Project Management",
    description: "Plan, execute, and monitor projects efficiently.",
  }, {
    featureID: "supply-chain-management",
    title: "Supply Chain Management",
    description: "Optimize your supply chain operations from procurement to delivery.",
  }
]

export default function Register() {
  useEffect(() => {
    document.title = "List of all features | eazzyBizz"
  }, [])

  const searchRef = useRef<HTMLInputElement>(null)
  const [viewableDetails, setViewableDetails] = useState(details)
  const [searchValue, setSearchValue] = useState("")
  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }
  useEffect(() => {
    if (searchRef.current !== null) {
      if (searchRef.current.value === "") {
        setViewableDetails(details)
      } else {
        const filteredDetails = details.filter(
          (detail) =>
            detail.title
              .toLowerCase()
              .includes(searchRef.current!.value.toLowerCase()) ||
            detail.featureID
              .toLowerCase()
              .includes(searchRef.current!.value.toLowerCase())
        )
        setViewableDetails(filteredDetails)
      }
    }
  }, [searchValue])
  return (
    <main className="min-h-screen flex flex-col items-center gap-8 features-background">
      <Navbar />
      <div className="text-text section-header font-bold text-center">
        Explore all of our features
      </div>
      <div className="flex w-full items-center justify-center my-8">
        <input
          type="text"
          ref={searchRef}
          value={searchValue}
          onChange={searchHandler}
          placeholder="What feature are you looking for?"
          className="py-2 px-4 w-3/5 border border-gray-300 rounded-full"
        />
      </div>
      {
        viewableDetails.length === 0 ? (
            <div className="text-center text-gray-500 mb-auto flex flex-col items-center">
              <p className="text-2xl mb-4">🔍</p>
              <p className="text-lg">Oops! We couldn't find any features matching your search.</p>
              <p className="text-sm">Try searching with different keywords.</p>
            </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-3/5 mb-auto">
            {
              viewableDetails.map((detail, index) => (
                <NavLink
                  to={`/features/${detail.featureID}`}
                  className="feature-grid"
                  key={index}
                >
                  <h1 className="text-2xl font-bold font-source-serif">{ detail.title }</h1>
                  <p>{ detail.description }</p>
                </NavLink>
              ))
            }
          </div>
        )
      }
      <Footer />
    </main>
  )
}