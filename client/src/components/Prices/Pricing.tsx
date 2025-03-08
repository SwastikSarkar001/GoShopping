import Navbar from "../Features/Navbar"
import axios from "axios"
import React, { forwardRef, useEffect, useState, useReducer, createContext, useContext } from "react"
import CustomizeFeatures from "./CustomizeFeatures"
import PlanSummary from "./PlanSummary"
import GoToTop from "../Utilities/GoToTop"
import Footer from "../Utilities/Footer"
import getSymbolFromCurrency from "currency-symbol-map"
import { useGetFeaturesQuery, useGetTiersQuery } from "../../states/apis/plansApiSlice"
import { FeatureDetail, TierData } from "../../types"

export type TierFeatureDetail = FeatureDetail & {
  /**
   * The tier for the feature.
   * The tiers are as follows:
   * 1. Basic - upto 5 users
   * 2. Standard - upto 10 users
   * 3. Premium - upto 15 users
   * 4. Advanced - upto 20 users
   * 5. Enterprise - upto 25 users
   * 6. Ultimate - upto 30 users
   * 7. Supreme - upto 40 users
   * 8. Elite - upto 50 users
   * @example 100
   * @default 0 (Not selected)
   */
  tier: number;
}

type CurrencyProps = {
  /** Country code of client */
  name: string,
  /** Conversion rate of INR to client's country's currency */
  conversion: number
  /** State function to set the currency */
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>
};

const CurrencyExchangeContext = createContext<CurrencyProps | undefined>(undefined);

type Currency = {
  /** Country code of client */
  name: string,
  /** Conversion rate of INR to client's country's currency */
  conversion: number,
}

const initialCurrency = {
  name: 'INR',
  conversion: 1
}

/** Test Currency */
// const initialCurrency = {
//   name: 'SGD',
//   conversion: 0.5
// }

interface CurrencyDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
  amountInInr: number,
  htmlprops?: React.HTMLAttributes<HTMLSpanElement>
}

export const CurrencyDisplay = forwardRef<HTMLSpanElement, CurrencyDisplayProps>(
  ({ amountInInr, ...htmlprops }, ref) => {
    const { name, conversion } = useContext(CurrencyExchangeContext) as CurrencyProps;
    const amountInClientCurrency = amountInInr * conversion;
    const isNegative = amountInClientCurrency < 0;

    // Get the absolute value for formatting and for the "Free" check
    const absoluteAmount = Math.abs(amountInClientCurrency);

    // Use Intl.NumberFormat for comma + decimal formatting
    // Adjust locale ("en-US") as needed, or make it configurable
    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(absoluteAmount);

    // If the amount is effectively zero, display 'Free'
    if (absoluteAmount === 0) {
      return <span {...htmlprops} ref={ref}>Free</span>;
    }

    return (
      <span {...htmlprops} ref={ref}>
        {isNegative ? '-' : ''}
        {getSymbolFromCurrency(name.toUpperCase())}{formattedAmount}
      </span>
    );
  }
);

export default function Pricing() {
  const [currency, setCurrency] = useState(initialCurrency)  // Client's currency name and conversion rate
  const countryDataUrl = 'https://restcountries.com/v3.1/all?fields=cca2,currencies'; // Free (Without API key)
  const primaryExchangeRatesUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.min.json'; // Free (Without API key)
  const fallbackExchangeRatesUrl = 'https://latest.currency-api.pages.dev/v1/currencies/inr.min.json'; // Free (Without API key) - Backup
  const [isFetchingData, updateFetchingStatus] = useState(false)   // To check if data is being fetched (For texting purposes set it to true by default)

  /** For texting purposes comment out this useEffect hook */
  useEffect(() => {
    /* Using Geolocation to set client's currency name */
    navigator.geolocation.getCurrentPosition(pos => {
      const {latitude,longitude} = pos.coords

      /* Based on client's coordinates find out Country Code in 2 letter format */
      axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
      .then (response => {
        const country_code = response.data.address.country_code.toUpperCase()

        /* Get the currency of the client's country and show prices after resolving this request */
        axios.get(countryDataUrl)
          .then(res => {
            const countries: {cca2: string, currencies: {[key: string]: {[key: string]: string}}}[] = res.data
            const country = countries.find(country => country.cca2 === country_code)
            axios.get(primaryExchangeRatesUrl)
              .then(r => {
                if (country !== undefined) {
                  const currencies = Object.keys(country.currencies)
                  for(let i = 0; i < currencies.length; i++) {
                    if (r.data.inr[currencies[i].toLowerCase()] !== undefined) {
                      setCurrency({
                        name: currencies[i],
                        conversion: r.data.inr[currencies[i].toLowerCase()]
                      })
                      break
                    }
                  }
                }
              })
              /* Requesting to a fallback URL if the promise rejects */
              .catch(e => {
                console.error(e)
                axios.get(fallbackExchangeRatesUrl)
                  .then(rr => {
                    if (country !== undefined) {
                      const currencies = Object.keys(country.currencies)
                      for(let i = 0; i < currencies.length; i++) {
                        if (rr.data.inr[currencies[i].toLowerCase()] !== undefined) {
                          setCurrency({
                            name: currencies[i],
                            conversion: rr.data.inr[currencies[i].toLowerCase()]
                          })
                          break
                        }
                      }
                    }
                  })
                  .catch(ee => {
                    console.error(ee)
                  })
                  /* Showing prices */
                  .finally(() => updateFetchingStatus(true))
              })
              /* Showing prices */
              .finally(() => updateFetchingStatus(true))
          })

        // console.log('Finished')
      })
      .catch(err => {
        console.error(err)
      })
    }, (e) => {
      console.log(e)
      console.log('Unable to get location')
      console.log('Continuing with default currency')
      updateFetchingStatus(true)
    })
    // setFetchingData(true)
  }, [])

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
    document.title = 'Plans and Pricing | eazzyBizz'
  }, [])

  /** Fetching all features data */
  const { data: featuresResponse, isLoading: isLoadingFeatures, error: featuresError } = useGetFeaturesQuery({})
  const initDetails: TierFeatureDetail[] = []
  const [allDetails, setAllDetails] = useReducer(
    (state: TierFeatureDetail[], action: { type: string; key?: TierFeatureDetail["featureID"]; value?: number; payload?: TierFeatureDetail[] }) => {
      switch (action.type) {
        case 'init':
          return action.payload || [];
        case 'deselect':
          return state.map(detail => detail.featureID === action.key ? { ...detail, tier: 0 } : detail)
        case 'set':
          return state.map(detail => detail.featureID === action.key ? (action.value !== undefined ? { ...detail, tier: action.value } : detail) : detail)
        default:
          return state
      }
    },
    initDetails // Initial state is empty; will be populated from server.
  )
  useEffect(() => {
    if (featuresResponse) {
      const featureData: TierFeatureDetail[] = featuresResponse.map(feature => {
        return {
          ...feature,
          tier: 0
        }
      })
  
      setAllDetails({ type: 'init', payload: featureData })
    }
  }, [featuresResponse])

  
  /** Fetching all tiers data */
  const { data: tiersResponse, isLoading: isLoadingTiers, error: tiersError } = useGetTiersQuery({})
  const [tiers, setTiers] = useState<TierData[]>([])  // Initial state is empty; will be populated from server.

  useEffect(() => {
    if (tiersResponse) {
      setTiers(tiersResponse)
    }
  }, [tiersResponse])

  if (featuresError || tiersError) {
    console.error('Error fetching features:', featuresError)
    console.error('Error fetching tiers:', tiersError)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-3xl text-red-500">Error fetching data</h1>
      </div>
    )
  }
  else
  return (
    <CurrencyExchangeContext.Provider value={{...currency, setCurrency: setCurrency}}>
      <main className="min-h-screen flex flex-col items-stretch gap-8">
        <Navbar />
        <CustomizeFeatures
          features={allDetails}
          isLoadingFeatures={isLoadingFeatures}
          tiers={tiers}
          isLoadingTiers={isLoadingTiers}
          featuresDispatch={setAllDetails}
        />
        <PlanSummary
          features={allDetails}
          isLoadingFeatures={isLoadingFeatures}
          tiers={tiers}
          isLoadingTiers={isLoadingTiers}
          fetchingData={isFetchingData}
        />
        <GoToTop scrolled={scrolled} />
        <Footer />
      </main>
    </CurrencyExchangeContext.Provider>
  )
}

