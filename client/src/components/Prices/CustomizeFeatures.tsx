import Select from "react-select"
import { FeatureDetail } from "../Features/FeatureDetails"
import Dialog, { DialogActionBtn, DialogBody, DialogCloseBtn, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../Utilities/Dialog"
import { useState } from "react"
import { tierAndPriceCalculator, tierDetails } from "./utilities"
import { CurrencyDisplay } from "./Pricing"

type CustomizeFeaturesProps = {
  features: FeatureDetail[]
  featuresDispatch: React.Dispatch<{ type: string; key: string; value?: number | undefined; }>
}

export default function CustomizeFeatures({ features, featuresDispatch }: CustomizeFeaturesProps) {
  const deselectFeature = (key: string) => {
    featuresDispatch({ type: 'deselect', key })
  }
  const setUsers = (key: string, value: number) => {
    featuresDispatch({ type: 'set', key, value })
  }

  return (
    <div className="md:mx-32">
      <div className="transition-all">
        <div className='transition-colors flex items-center justify-between gap-2 p-4'>
        </div>
        <div className="m-8 text-text font-source-serif text-4xl text-center">
          Select the apps you want to use in your platform
        </div>
        <div className="px-4 flex flex-col items-stretch gap-4 relative">
          <AddFeature features={features} setFunc={setUsers} />
          <SelectedFeatures
            features={features}
            deselectFunc={deselectFeature}
            setFunc={setUsers}
          />
        </div>
      </div>
    </div>
  )
}

function AddFeature({ features, setFunc }: { features: FeatureDetail[], setFunc: (key: string, value: number) => void }) {
  const [selectedFeature, setSelectedFeature] = useState<{value: string, label: string} | null>(null)
  const [value, setValue] = useState<number>(1); // Initial value of the slider
  const tierOpt = selectedFeature !== null ? 
    tierAndPriceCalculator(
      value,
      features.filter(feature =>
        feature.featureID === selectedFeature.value
      )[0].price_per_user_per_month
    ) :
    null
  if (features.length === 0) {
    return null
  }
  else
  return (
    <Dialog>
      <DialogTrigger
        className="relative focus-visible:outline-2 rounded-4xl border-2 border-transparent hover:border-gray-400"
        tabIndex={0}
        onClick={() => setSelectedFeature(null)}
      >
        <div className="py-4 px-8 rounded-4xl flex gap-4 items-center cursor-pointer bg-gray-300/20 text-gray-500 w-full">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1em]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            Click to add a feature
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-background">
        <DialogHeader>
          Add a feature
        </DialogHeader>
        <DialogBody>
          <form className="flex flex-col gap-2" >
            <label htmlFor="feature">Select a feature</label>
            <Select
              placeholder="Select a feature"
              id="feature"
              value={selectedFeature}
              onChange={
                e => {
                  setSelectedFeature(e)
                  setValue(1)
                }
              }
              classNames={{
                container: () => `!bg-background !text-text`,
                control: ({ isFocused }) => `!bg-background !rounded-lg ${isFocused? 'border-2 !border-gray-300 !shadow-none' : 'border !border-gray-400'} rounded-xl`,
                input: () => `!text-text`,
                indicatorSeparator: () => `!bg-background`,
                menu: () => `!bg-background border-2 border-gray-400`,
                singleValue: () => `!text-text`,
                option: ({ isSelected, isFocused }) => `${isSelected ? 'bg-blue-500' : isFocused? '!bg-blue-500/30' : '!bg-background'}`
              }}
              options={features.filter(feature => feature.tier === 0).map(feature => ({ value: feature.featureID, label: feature.title }))}
            >
            </Select>
            {
              selectedFeature &&
              <>
                <label htmlFor="number-users" className="mt-2 pb-2">Choose your optimal tier plan</label>
                <input
                  disabled={selectedFeature === null}
                  type="range"
                  name=""
                  id="number-users"
                  min={1}
                  max={8}
                  step={1}
                  value={value}
                  onChange={(e) => setValue(parseInt(e.target.value))}
                  className={`h-0.5 ${selectedFeature === null ? 'grayscale' : ''}`}
                />
                <div className="flex justify-between">
                  <div>1</div>
                  <div>8</div>
                </div>
                <div className="grid grid-cols-2 mt-2 items-center justify-between *:even:text-right">
                  <div>Selected Tier:</div>
                  <div className="font-bold">{value} ({tierDetails(value).tierName})</div>
                  <div>Maximum users:</div>
                  <div className="font-bold">Upto {tierOpt?.users} users</div>
                  {
                    tierOpt?.originalprice ?
                    <>
                      <div>Monthly price per user:</div>
                      <div className="text-gray-500"><CurrencyDisplay amountInInr={features.filter(feature => feature.featureID === selectedFeature.value)[0].price_per_user_per_month} /></div>
                      <div>Original Monthly Price:</div>
                      <div className="text-gray-500"><CurrencyDisplay amountInInr={(tierOpt ? tierOpt.originalprice : 0)} /></div>
                      <div>Discount:</div>
                      <div>{tierOpt?.discount}%</div>
                    </> : null
                  }
                  <div>Monthly Price:</div>
                  <div className="font-bold"><CurrencyDisplay amountInInr={(tierOpt ? tierOpt.price : 0)} /></div>
                </div>
              </>
            }
          </form>
        </DialogBody>
        <DialogFooter className={`flex gap-4 py-2 ${selectedFeature !== null ? 'sticky bottom-0' : ''}`}>
          <DialogCloseBtn
            className="w-1/2"
            onClick={() => setSelectedFeature(null)}
          >
            Cancel
          </DialogCloseBtn>
          <DialogActionBtn
            className="w-1/2"
            disabled={selectedFeature === null}
            onClick={() => {
              if (selectedFeature) {
                setFunc(selectedFeature.value, value)
                setSelectedFeature(null)
              }
            }}
          >
            Add
          </DialogActionBtn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type SelectedFeaturesProps = {
  features: FeatureDetail[],
  deselectFunc: (key: string) => void,
  setFunc: (key: string, value: number) => void
}

function SelectedFeatures({ features, deselectFunc, setFunc }: SelectedFeaturesProps) {
  const [selectedFeature, setSelectedFeature] = useState<{value: string, label: string} | null>(null)
  const [value, setValue] = useState<number>(1); // Initial value of the slider
  const tierOpt = selectedFeature !== null ? 
    tierAndPriceCalculator(
      value,
      features.filter(feature =>
        feature.featureID === selectedFeature.value
      )[0].price_per_user_per_month
    ) :
    null
  const [openOption, setOpenOption] = useState<string | null>(null)

  window.onclick = (event) => {
    if (openOption) {
      console.log('Clicked')
      if (event.target instanceof HTMLElement) {
        if (!event.target.closest(`#popover`)) {
          setOpenOption(null)
        }
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {
        features.map(
          feature => 
            feature.tier > 0 && (
            <div key={feature.featureID} className="border-2 border-gray-400/30 rounded-4xl py-4 px-8 gap-8 flex justify-between items-center">
              <div className="text-text">
                {feature.title}
              </div>
              <div className="flex items-center gap-4 text-sm ml-auto">
                <div className="text-gray-400">
                  Selected Tier: {feature.tier}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm mr-8">
                <div className="text-gray-400">
                  Maximum users: {tierAndPriceCalculator(feature.tier, feature.price_per_user_per_month).users}
                </div>
              </div>
              <div id={`popover ${feature.featureID}`}>
                <button
                  onClick={
                    () => {
                      setOpenOption(prev => prev === feature.featureID ? feature.featureID : null)
                    }
                  }
                  className="focus-visible:outline-2 rounded-lg p-2 bg-blue-500 text-white cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1em]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
                {
                  openOption !== feature.featureID &&
                  <div className="absolute right-0 border-2 border-gray-500 p-2 bg-background text-text text-sm">
                    <Dialog>
                      <DialogTrigger
                      className="w-full"
                        onClick={
                          () => {
                            setSelectedFeature({ value: feature.featureID, label: feature.title })
                            setValue(feature.tier)
                          }
                        }
                      >
                        <div className="hover:bg-blue-500 hover:text-white flex cursor-pointer items-center gap-2 py-1 px-2 select-none transition-colors">
                          <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1em]">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                            </svg>
                          </div>
                          <div>Edit</div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-background">
                        <DialogHeader>
                          Edit feature
                        </DialogHeader>
                        <DialogBody>
                          <form className="flex flex-col gap-2" >
                            <div>Selected feature</div>
                            <div className="bg-background rounded-lg border-2 !border-gray-400 px-4 py-2 select-none cursor-not-allowed">
                              {feature.title}
                            </div>
                            <label htmlFor="number-users" className="mt-2 pb-2">Choose your optimal tier plan</label>
                            <input
                              type="range"
                              name=""
                              id="number-users"
                              min={1}
                              max={8}
                              step={1}
                              value={value}
                              onChange={(e) => setValue(parseInt(e.target.value))}
                              className="h-0.5"
                            />
                            <div className="flex justify-between">
                              <div>1</div>
                              <div>8</div>
                            </div>
                            <div className="grid grid-cols-2 mt-2 items-center justify-between *:even:text-right">
                              <div>Selected Tier:</div>
                              <div className="font-bold">{value} ({tierDetails(value).tierName})</div>
                              <div>Maximum users:</div>
                              <div className="font-bold">Upto {tierOpt?.users} users</div>
                              {
                                tierOpt?.originalprice ?
                                <>
                                  <div>Monthly price per user:</div>
                                  <div className="text-gray-500"><CurrencyDisplay amountInInr={feature.price_per_user_per_month} /></div>
                                  <div>Original Monthly Price:</div>
                                  <div className="text-gray-500"><CurrencyDisplay amountInInr={(tierOpt ? tierOpt.originalprice : 0)} /></div>
                                  <div>Discount:</div>
                                  <div>{tierOpt?.discount}%</div>
                                </> : null
                              }
                              <div>Monthly Price:</div>
                              <div className="font-bold"><CurrencyDisplay amountInInr={(tierOpt ? tierOpt.price : 0)} /></div>
                            </div>
                          </form>
                        </DialogBody>
                        <DialogFooter className="flex gap-4 py-2 sticky bottom-0">
                          <DialogCloseBtn
                            className="w-1/2"
                            onClick={() => setSelectedFeature(null)}
                          >
                            Revert Changes
                          </DialogCloseBtn>
                          <DialogActionBtn
                            className="w-1/2"
                            disabled={feature.tier === value}
                            onClick={() => {
                              if (selectedFeature) {
                                setFunc(selectedFeature.value, value)
                                setSelectedFeature(null)
                              }
                            }}
                          >
                            Save Changes
                          </DialogActionBtn>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <div
                      className="text-red-500 hover:bg-red-500 hover:text-white flex cursor-pointer items-center gap-2 py-1 px-2 select-none transition-colors"
                      onClick={
                        () => {
                          setOpenOption(null)
                          if (confirm(`Are you sure you want to remove ${feature.title}?`)) {
                            deselectFunc(feature.featureID)
                          }
                        }
                      }
                    >
                      <div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1em]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      </div>
                      <div>Remove</div>
                    </div>
                  </div>
                }
              </div>
            </div>
          )
        )
      }
    </div>
  )
}

// function RangeSlider() {
//   const [value, setValue] = useState<number>(1); // Initial value of the slider
//   const min = 1, max = 50; // Minimum and maximum values of the slider

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(Number(event.target.value));
//   };

//   return (
//     <div className="grow flex gap-4 items-center text-sm">
//       <div className="text-text">{min}</div>
//       <div className="grow flex items-center">
//         <input
//           type="range"
//           min={min}
//           max={max}
//           value={value}
//           onChange={handleChange}
//           className="w-full accent-indigo-400 h-0.5 peer"
//         />
//       </div>
//       <div className="text-text">{max}</div>
//     </div>
//   )
// };