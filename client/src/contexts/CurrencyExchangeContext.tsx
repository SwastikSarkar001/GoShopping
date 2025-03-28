import { createContext } from "react";

type Currency = {
  /** Country code of client */
  name: string,
  /** Conversion rate of INR to client's country's currency */
  conversion: number,
}

export type CurrencyProps = {
  /** Country code of client */
  name: string,
  /** Conversion rate of INR to client's country's currency */
  conversion: number
  /** State function to set the currency */
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>
};

const CurrencyExchangeContext = createContext<CurrencyProps | undefined>(undefined);

export default CurrencyExchangeContext;