import { useEffect, useState } from "react"
import { CurrencyDisplay, TierFeatureDetail } from "./Pricing"
import { tierAndPriceCalculator } from "./utilities"
import { useAppSelector } from "../../states/store"
import { useLocation, useNavigate } from "react-router-dom"
import { TierData } from "../../types"
import { toast } from "sonner"
import axios from "axios"
import performProtectedRequest from "../../utilities/performProtectedRequest"

type PlanSummaryProps = {
  features: TierFeatureDetail[],
  isLoadingFeatures: boolean,
  tiers: TierData[],
  isLoadingTiers: boolean,
  fetchingData: boolean
}

export default function PlanSummary({ features, isLoadingFeatures, tiers, isLoadingTiers, fetchingData }: PlanSummaryProps) {
  return (
    <div className=" mx-32 mt-4 text-center mb-auto">
      <div className="m-8 text-text font-source-serif text-4xl text-center">
        Prices
      </div>
      <div>
        <h2 className="mb-8 text-text text-3xl font-source-serif">Select the plan that suit your needs</h2>
        <PricingDetails
          features={features}
          isLoadingFeatures={isLoadingFeatures}
          tiers={tiers}
          isLoadingTiers={isLoadingTiers}
          fetchingData={fetchingData}
        />
      </div>
    </div>
  )
}

type PricingDetailsProps = {
  features: TierFeatureDetail[],
  isLoadingFeatures: boolean,
  tiers: TierData[],
  isLoadingTiers: boolean,
  fetchingData: boolean
}

function PricingDetails({ features, isLoadingFeatures, tiers, isLoadingTiers, fetchingData }: PricingDetailsProps) {
  const [billingType, setBillingType] = useState<'Monthly Plan' | 'Yearly Plan'>('Yearly Plan')
  const openMonthlyPlan = () => setBillingType('Monthly Plan')
  const openYearlyPlan = () => setBillingType('Yearly Plan')
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 p-2 bg-gray-400/30 w-max rounded-2xl">
        <button
          className={`${billingType === 'Monthly Plan' ? 'bg-background pointer-events-none' : 'bg-transparent cursor-pointer'} text-text font-source-serif text-lg px-4 py-2 rounded-xl [&:hover]:shadow-md [&:hover]:bg-background/70 [&:active]:bg-background [&:active]:scale-90 transition-all`}
          onClick={openMonthlyPlan}
        >
          Monthly Plan
        </button>
        <button
          className={`${billingType === 'Yearly Plan' ? 'bg-background pointer-events-none' : 'bg-transparent cursor-pointer'} text-text font-source-serif text-lg px-4 py-2 rounded-xl [&:hover]:shadow-md [&:hover]:bg-background/70 [&:active]:bg-background [&:active]:scale-90 transition-all`}
          onClick={openYearlyPlan}
        >
          Yearly Plan<span className="ml-2 text-sm">10% off 💸</span>
        </button>
      </div>
      <div className="flex flex-col gap-4 mt-8 w-1/2">
        <SummaryWrapper
          title={billingType}
          checkedFeatures={features}
          isLoadingFeatures={isLoadingFeatures}
          tiers={tiers}
          isLoadingTiers={isLoadingTiers}
          fetchingData={fetchingData}
        />
      </div>
    </div>
  )
}


type summaryProps = {
  title: 'Monthly Plan' | 'Yearly Plan',
  checkedFeatures: TierFeatureDetail[],
  isLoadingFeatures: boolean,
  tiers: TierData[],
  isLoadingTiers: boolean,
  fetchingData: boolean
}

function SummaryWrapper({ title, checkedFeatures, isLoadingFeatures, tiers, isLoadingTiers, fetchingData }: summaryProps) {
  /** GST applied */
  const gst = 18

  /** Annual discount applied */
  const annualDiscount = 10
  
  const [originalPrice, setOriginalPrice] = useState(0)  // Total original price of the features
  const [discountedPrice, setDiscountedPrice] = useState(0)  // Total discounted price of the features

  /** Total discounted price after applying annual discount (in INR) */
  const totalDiscountedPrice = discountedPrice * (title === 'Monthly Plan' ? 1 : 1 - 0.01*annualDiscount)

  /** Total original price after applying GST (in INR) */
  const originalPayableAmount = originalPrice * (1 + 0.01*gst)

  /** Total discounted price after applying annual discount and GST (in INR) */
  const payableAmount = totalDiscountedPrice * (1 + 0.01*gst)

  useEffect(() => {
    let original_value = 0
    let discounted_value = 0
    checkedFeatures.filter(detail => detail.tier !== 0).map(detail => {
      const { originalprice, price } = tierAndPriceCalculator(tiers, detail.tier, detail.price_per_user_per_month)
      original_value += originalprice * (title === 'Monthly Plan' ? 1 : 12)
      discounted_value += price * (title === 'Monthly Plan' ? 1 : 12)
    })
    setOriginalPrice(original_value)
    setDiscountedPrice(discounted_value)
  }, [checkedFeatures, title, tiers])

  const isUserAuthenticated = useAppSelector(state => state.user.isAuthenticated)
  const navigation = useNavigate()
  const location = useLocation()

  const paymentHandler = async () => {
    await performProtectedRequest(
      () =>
        axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/plans/purchase`,
        {
          subscription: title === 'Monthly Plan' ? 0 : 1,
          data: checkedFeatures
                  .filter(feature => feature.tier !== 0)
                  .map(feature => ({feature: feature.featureID, tier: feature.tier})),
        },
        {
          withCredentials: true,
          validateStatus: status => status === 200 || status === 401
        }
      )
    )
  }

  const buySubscription = () => {
    if (!isUserAuthenticated) {
      navigation('/auth', {
        state: {
          from: location
        }
      })
    }
    // Payment gateway integration goes here
    else {
      if (confirm('Are you sure you want to proceed with the transaction?'))
      toast.promise(paymentHandler, {
        loading: 'Processing your transaction...',
        success: () => {
          navigation('/dashboard')
          return 'Transaction successfully completed!'
        },
        error: 'Transaction failed for some reason! Please try again.'
      })
    }
  }

  return (
    <div className={`border-2 ${title === 'Monthly Plan' ? 'border-gray-400 bg-gray-400/[0.075]' : 'border-emerald-400 bg-emerald-400/[0.08]'} text-text transition-colors rounded-xl py-8 px-4 flex flex-col gap-8 items-center`}>
      <h3 className="capitalize font-source-serif text-xl">{title}{title === 'Yearly Plan' ? ' (Additional 10% off)': ''}</h3>
      <div className="text-left px-2 w-full flex flex-col gap-2">
        {
          checkedFeatures.filter(detail => detail.tier !== 0).length === 0 ? 
            <div className="text-gray-500 text-center">No features selected</div>
          :
          <>
            <h4 className="font-source-serif text-lg">Your Selected Features - </h4>
            <div className="flex justify-between items-center gap-2 *:font-source-serif *:text-lg border-y border-gray-500 py-2 my-2">
              <div className="">Features</div>
              <div className="">Price</div>
            </div>
            <div className="flex flex-col gap-4 items-stretch">
              {
                checkedFeatures.filter(detail => detail.tier !== 0).map(
                  (detail, index) => {
                    const featureTitle = detail.title
                    const tier = detail.tier
                    const { originalprice, price } = tierAndPriceCalculator(tiers, tier, detail.price_per_user_per_month)
                    return (
                      <div className="flex justify-between items-center gap-2" key={index}>
                        <div className="leading-4 flex flex-col *:text-left">
                          <div>{featureTitle}</div>
                          <div className="text-gray-500 text-sm">Tier {tier}</div>
                        </div>
                        <div className="flex flex-col *:text-right leading-4">
                          {
                            fetchingData ? 
                              <>
                                {
                                  (originalprice !== 0 && originalprice !== price)?
                                  <div>
                                    <CurrencyDisplay
                                      className="text-[12px] line-through text-gray-500"
                                      amountInInr={
                                        originalprice * (title === 'Monthly Plan' ? 1 : 12)
                                      } 
                                    />
                                  </div> :
                                  null
                                }
                                <CurrencyDisplay
                                  className=""
                                  amountInInr={
                                    price * (title === 'Monthly Plan' ? 1 : 12)
                                  } 
                                />
                              </>
                            : 'Loading...'
                          }
                        </div>
                      </div>
                    )
                  }
                )
              }
            </div>
            {
              discountedPrice !== 0 &&
              <div className="border-t border-gray-500 mt-2 pt-3">
                <div className="flex justify-between items-center gap-2 font-source-serif">
                  <div className="leading-4 font-source-serif">Subtotal</div>
                  <div className="text-gray-500"><CurrencyDisplay amountInInr={discountedPrice} /></div>
                </div>
                {
                  title === 'Yearly Plan' ?
                  <div className="flex justify-between items-center gap-2 font-source-serif">
                    <div className="leading-4 font-source-serif">Annual Discount</div>
                    <div className="text-gray-500">-10%</div>
                  </div> :
                  <div className="flex justify-between items-center gap-2 font-source-serif">
                    <div className="leading-4 font-source-serif">GST applied on subtotal ({gst}%)</div>
                    <div className="text-gray-500"><CurrencyDisplay amountInInr={payableAmount - totalDiscountedPrice} /></div>
                  </div>
                }
              </div>
            }
            {
              totalDiscountedPrice !== 0 &&
              title === 'Yearly Plan' &&
              <div className="border-t border-gray-500 mt-2 pt-3">
                <div className="flex justify-between items-center gap-2">
                  <div className="leading-4 font-source-serif">Subtotal after applying annual discount</div>
                  <div className="text-gray-500"><CurrencyDisplay amountInInr={totalDiscountedPrice} /></div>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div className="leading-4 font-source-serif">GST applied on subtotal ({gst}%)</div>
                  <div className="text-gray-500"><CurrencyDisplay amountInInr={payableAmount - totalDiscountedPrice} /></div>
                </div>
              </div>
            }
            <div className="border-y border-gray-500 mt-2 py-3">
              <div className="flex justify-between items-center gap-2 text-lg">
                <div className="leading-4 font-bold font-source-serif">Grand Total</div>
                <div className="font-bold"><CurrencyDisplay amountInInr={payableAmount} /></div>
              </div>
              {
                payableAmount !== 0 &&
                payableAmount - originalPayableAmount !== 0 &&
                <div className="flex justify-between items-center gap-2 mt-2">
                  <div className="leading-4 font-source-serif text-lg">You saved</div>
                  <div className="flex flex-col text-right">
                    <div className="text-lg leading-4"><CurrencyDisplay amountInInr={payableAmount - originalPayableAmount} /></div>
                    <div className="text-gray-500 text-sm">({Math.round((payableAmount-originalPayableAmount)*100/originalPayableAmount)}% off)</div>
                  </div>
                </div>
              }
            </div>
          </>
        }
      </div>
      <button
        disabled={isUserAuthenticated && checkedFeatures.filter(detail => detail.tier !== 0).length === 0}
        className="select-none cursor-pointer font-source-serif text-lg w-3/5 bg-cyan-400 px-4 py-2 rounded-xl shadow-md text-black [&:not(:disabled):hover]:shadow-lg [&:not(:disabled):hover]:bg-cyan-300 [&:not(:disabled):active]:shadow-xs [&:not(:disabled):active]:bg-cyan-500 [&:not(:disabled):active]:scale-90 transition-all disabled:cursor-not-allowed disabled:grayscale"
        onClick={buySubscription}
      >
        {
          !isUserAuthenticated ? 'Sign in to continue' :
          checkedFeatures.filter(detail => detail.tier !== 0).length === 0 ? 'Select Features' :
          fetchingData ?
            payableAmount !== 0 ?
            <>
              Pay <CurrencyDisplay className="font-source-serif" amountInInr={payableAmount} />
            </> :
            <>Click to continue</>
          : 'Loading...'
        }
      </button>
    </div>
  )
}