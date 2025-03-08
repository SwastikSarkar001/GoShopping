import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "../Utilities/Footer"
import GoToTop from "../Utilities/GoToTop"
import { useGetFeaturesQuery } from "../../states/apis/plansApiSlice"
import { FeatureDetail } from "../../types"

export default function FeaturesList() {
  const { data: featuresResponse, isLoading: isLoadingFeatures, error: featuresError } = useGetFeaturesQuery({})
  const [featureDetails, setFeatureDetails] = useState<FeatureDetail[]>([])
  useEffect(() => {
    if (featuresResponse) {
      setFeatureDetails(featuresResponse)
    }
  }, [featuresResponse])

  const [scrolled, setScrolled] = useState(false)
  const handleScroll = () => {
    const scrollThreshold = window.innerHeight * 0.15; // 15% of viewport height
    if (window.scrollY > scrollThreshold) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }
  window.onscroll = handleScroll

  useEffect(() => {
    document.title = "List of all features | eazzyBizz"
  }, [])

  const [searchValue, setSearchValue] = useState("")
  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const filteredDetails = featureDetails.filter(
    (detail) =>
      detail.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      detail.featureID.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <main className="min-h-screen flex flex-col items-center gap-16">
      <Navbar />
      <div className="mt-8 mx-8 text-text font-source-serif font-bold text-5xl text-center">
        Explore all of our featured apps
      </div>
      <div className="flex w-full items-center justify-center">
        <input
          type="text"
          value={searchValue}
          onChange={searchHandler}
          placeholder="What feature are you looking for?"
          className="py-2 px-4 md:py-4 md:px-8 w-4/5 md:w-3/5 border text-text border-gray-300 rounded-full"
        />
      </div>
      {
        isLoadingFeatures ? (
          <div className="text-center text-gray-500 mb-auto flex items-center gap-4">
            <div className="text-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[1em] animate-spin">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <p className="text-lg">Loading features...</p>
          </div>
        ) : featuresError ? (
          <div className="text-center text-gray-500 mb-auto flex flex-col items-center">
            <p className="text-2xl mb-4">🚫</p>
            <p className="text-lg">Error fetching features. Please try again later.</p>
          </div>
        ) :
        filteredDetails.length === 0 ? (
            <div className="text-center text-gray-500 mb-auto flex flex-col items-center">
              <p className="text-2xl mb-4">🔍</p>
              <p className="text-lg">Oops! We couldn't find any features matching your search.</p>
              <p className="text-sm">Try searching with different keywords.</p>
            </div>
        ) : (
          <div className="grid gap-8 items-stretch grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-8 sm:mx-[20%] md:mx-32 mb-auto">
            {
              filteredDetails.map((detail, index) => (
                <NavLink
                  to={`/features/${detail.featureID}`}
                  className="feature-grid"
                  key={index}
                >
                  <h1 className="text-2xl font-bold font-source-serif break-words max-w-full hyphens-auto">{ detail.title }</h1>
                  <p>{ detail.description }</p>
                </NavLink>
              ))
            }
          </div>
        )
      }
      <GoToTop scrolled={scrolled} />
      <Footer />
    </main>
  )
}
