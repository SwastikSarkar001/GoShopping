import { TierData } from "../../types"

type TierProps = {
  /** Maximum number of users */
  users: number,
  /** Original price of the tier */
  originalprice: number,
  /** Discount percentage for the tier */
  discount: number,
  /** Price after applying the discount */
  price: number
}

/**
 * Calculates the price and discount for a given tier and price.
 * @param tiers The tiers data.
 * @param tier The tier number.
 * @param price The price of a particular feature per user per month.
 * @returns The maximum number of users, original price, discount percentage, and price after discount.
 */
export function tierAndPriceCalculator(tiers: TierData[], tiernum: number, price: number): TierProps {
  const { maxUsers, discount } = tiers.filter(tier => tier.tier === tiernum)[0]
  return {
    users: maxUsers,
    originalprice: price * maxUsers,
    discount: discount,
    price: price * maxUsers * (1 - 0.01 * discount)
  }
}