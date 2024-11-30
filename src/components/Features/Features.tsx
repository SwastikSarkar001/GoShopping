import { useEffect, useRef, useState } from "react"
import { NavLink } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "../Footer"
import details from "./FeatureDetails"

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
    <main className="min-h-screen flex flex-col items-center gap-16">
      <Navbar />
      <div className="mt-8 mx-8 text-text font-source-serif font-bold text-5xl text-center">
        Explore all of our featured apps
      </div>
      <div className="flex w-full items-center justify-center">
        <input
          type="text"
          ref={searchRef}
          value={searchValue}
          onChange={searchHandler}
          placeholder="What feature are you looking for?"
          className="py-2 px-4 md:py-4 md:px-8 w-4/5 md:w-3/5 border border-gray-300 rounded-full"
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
          <div className="grid gap-8 items-stretch md:grid-cols-2 lg:grid-cols-4 mx-[10%] sm:mx-[20%] md:mx-32 mb-auto">
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
