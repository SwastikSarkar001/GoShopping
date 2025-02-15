import { useEffect, useState, forwardRef } from "react"
import details from "../Features/FeatureDetails"
import axios from "axios"
import getSymbolFromCurrency from "currency-symbol-map"

type Currency = {
  /** Country code of client */
  name: string,
  /** Conversion rate of INR to client's country's currency */
  conversion: number
}

const initialCurrency = {
  name: 'INR',
  conversion: 1
}

interface CurrencyDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number,
  currencyCode: string,
  htmlprops?: React.HTMLAttributes<HTMLSpanElement>
}

const CurrencyDisplay = forwardRef<HTMLSpanElement, CurrencyDisplayProps>(({ amount, currencyCode, ...htmlprops }, ref) => {
  return <span {...htmlprops} ref={ref}>{(amount.toFixed(2) !== '0.00') ? getSymbolFromCurrency(currencyCode.toUpperCase())+amount.toFixed(2) : 'Free'}</span>;
})

type PlanSummaryProps = {
  checkedFeatures: { [key: string]: boolean }
}

export default function PlanSummary(props: PlanSummaryProps) {
  const [currency, setCurrency] = useState(initialCurrency)  // Client's currency name and conversion rate
  const countryDataUrl = 'https://restcountries.com/v3.1/all?fields=cca2,currencies'; // Free (Without API key)
  const primaryExchangeRatesUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/inr.min.json'; // Free (Without API key)
  const fallbackExchangeRatesUrl = 'https://latest.currency-api.pages.dev/v1/currencies/inr.min.json'; // Free (Without API key) - Backup
  const [fetchingData, setFetchingData] = useState(false)   // To check if data is being fetched

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
                  .finally(() => setFetchingData(true))
              })
              /* Showing prices */
              .finally(() => setFetchingData(true))
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
      setFetchingData(true)
    })
    // setFetchingData(true)
  }, [])
  return (
    <div className=" mx-32 mt-4 text-center mb-auto">
      <div className="m-8 text-text font-source-serif text-4xl text-center">
        Prices
      </div>
      <div>
        <h2 className="mb-8 text-text text-3xl font-source-serif">Select the plan that suit your needs</h2>
        <div className="grid lg:grid-cols-3 gap-8 text-text">
          <SummaryWrapper fetchingData={fetchingData} currencyData={currency} title="Per User/Month Plan" checkedFeatures={props.checkedFeatures} />
          <SummaryWrapper fetchingData={fetchingData} currencyData={currency} title="Yearly Plan" checkedFeatures={props.checkedFeatures} />
          <SummaryWrapper fetchingData={fetchingData} currencyData={currency} title="Enterprise Plan" checkedFeatures={props.checkedFeatures} />
        </div>
      </div>
    </div>
  )
}

type summaryProps = {
  title: string,
  checkedFeatures: { [key: string]: boolean }
  currencyData: Currency,
  fetchingData: boolean
}

function SummaryWrapper(props: summaryProps) {
  const [totalPrice, setTotalPrice] = useState(0)
  useEffect(() => {
    let value = 0
    details.filter(detail => props.checkedFeatures[detail.featureID]).map(detail => {
      value += props.title === 'Per User/Month Plan' ? detail.price_per_user_per_month : props.title === 'Yearly Plan' ? detail.price_yearly : detail.price_enterprise
      return value
  })
    setTotalPrice(props.currencyData.conversion*value)
  }, [props.checkedFeatures, props.title, props.currencyData])
  return (
    <div className="border-2 hover:border-cyan-500 transition-colors rounded-xl py-8 px-4 flex flex-col gap-8 items-center bg-background">
      <h3 className="capitalize font-source-serif text-xl">{props.title}</h3>
      <div className="text-left px-2 w-full flex flex-col gap-2">
        {
          details.filter(detail => props.checkedFeatures[detail.featureID]).length === 0 ? 
            <div className="text-gray-500 text-center">No features selected</div>
          :
          <>
            <h4 className="">Includes -</h4>
            <div className="px-2 flex flex-col gap-2 items-stretch">
              {
                details.filter(detail => props.checkedFeatures[detail.featureID]).map((detail, index) => (
                  <div className="flex justify-between items-center gap-2" key={index}>
                  <div className="leading-4">{detail.title}</div>
                  <div className="text-gray-500">
                    {
                      props.fetchingData ? 
                        <CurrencyDisplay
                          amount={
                            props.title === 'Per User/Month Plan' ? detail.price_per_user_per_month*props.currencyData.conversion : props.title === 'Yearly Plan' ? detail.price_yearly*props.currencyData.conversion : detail.price_enterprise*props.currencyData.conversion
                          } 
                          currencyCode={props.currencyData.name}
                        />
                      : 'Loading...'
                    }
                  </div>
                  </div>
                ))
              }
            </div>
          </>
        }
      </div>
      <button
        disabled={details.filter(detail => props.checkedFeatures[detail.featureID]).length === 0}
        className="select-none font-source-serif text-lg w-3/5 bg-cyan-400 px-4 py-2 rounded-xl shadow-md text-black [&:not(:disabled):hover]:shadow-lg [&:not(:disabled):hover]:bg-cyan-300 [&:not(:disabled):active]:shadow-sm [&:not(:disabled):active]:bg-cyan-500 [&:not(:disabled):active]:scale-90 transition-all disabled:cursor-not-allowed disabled:grayscale"
        onClick={() => console.log('Hii')}
      >
        {
          details.filter(detail => props.checkedFeatures[detail.featureID]).length === 0 ? 'Select Features' :
          props.fetchingData ?
          <>
            Pay <CurrencyDisplay className="font-source-serif" amount={totalPrice} currencyCode={props.currencyData.name} />
          </>
          : 'Loading...'
        }
      </button>
    </div>
  )
}