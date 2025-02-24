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
 * @param tier The tier number.
 * @param price The price of a particular feature per user per month.
 * @returns The maximum number of users, original price, discount percentage, and price after discount.
 */
export function tierAndPriceCalculator(tier: number, price: number): TierProps {
  const { maxUsers, discount } = tierDetails(tier)
  return {
    users: maxUsers,
    originalprice: price * maxUsers,
    discount: discount,
    price: price * maxUsers * (1 - 0.01 * discount)
  }
}

type TierDetails = {
  /** The tier number */
  tier: number,
  /** The name of the tier */
  tierName: string,
  /** A brief description of the tier */
  tierDescription: string,
  /** The maximum number of users that can use the tier */
  maxUsers: number,
  /** The discount percentage for the tier */
  discount: number
}

/**
 * Returns the details of a given tier.
 * @param tier The tier number.
 * @returns The tier number, name, description, maximum number of users, and discount percentage.
 */
export function tierDetails(tier: number): TierDetails {
  switch (tier) {
    case 1:
      return {
        tier: 1,
        tierName: 'Basic',
        tierDescription: 'Can be used by upto 5 users. No discount.',
        maxUsers: 5,
        discount: 0,
      }
    case 2:
      return {
        tier: 2,
        tierName: 'Standard',
        tierDescription: 'Can be used by upto 10 users. 10% discount.',
        maxUsers: 10,
        discount: 10,
      }
    case 3:
      return {
        tier: 3,
        tierName: 'Premium',
        tierDescription: 'Can be used by upto 15 users. 15% discount.',
        maxUsers: 15,
        discount: 15,
      }
    case 4:
      return {
        tier: 4,
        tierName: 'Advanced',
        tierDescription: 'Can be used by upto 20 users. 20% discount.',
        maxUsers: 20,
        discount: 20,
      }
    case 5:
      return {
        tier: 5,
        tierName: 'Enterprise',
        tierDescription: 'Can be used by upto 25 users. 25% discount.',
        maxUsers: 25,
        discount: 25,
      }
    case 6:
      return {
        tier: 6,
        tierName: 'Ultimate',
        tierDescription: 'Can be used by upto 30 users. 30% discount.',
        maxUsers: 30,
        discount: 30,
      }
    case 7:
      return {
        tier: 7,
        tierName: 'Supreme',
        tierDescription: 'Can be used by upto 40 users. 40% discount.',
        maxUsers: 40,
        discount: 40,
      }
    case 8:
      return {
        tier: 8,
        tierName: 'Elite',
        tierDescription: 'Can be used by upto 50 users. 50% discount.',
        maxUsers: 50,
        discount: 50,
      }
    default:
      return {
        tier: 0,
        tierName: 'Not Selected',
        tierDescription: 'No tier selected.',
        maxUsers: 0,
        discount: 0,
      }
  }
}