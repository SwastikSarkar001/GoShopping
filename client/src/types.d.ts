export type emptyProps = {}  // eslint-disable-line @typescript-eslint/no-empty-object-type

export type messageType = {
  heading: string,
  description: string
}

export type messagesType = messageType[]

export type themeValues = 'dark' | '' | null

export type navbar = {
  scrolled: boolean,
  sectionRefs: React.RefObject<HTMLDivElement>[]
}

export type scrollable = {
  scrolled: boolean
}

export interface logoWrapper extends React.SVGAttributes<SVGSVGElement> {
  viewBox: string,
  children: React.ReactNode
}

export type sectionsInfoType = {
  name: string,
  sectionComponent: React.ForwardRefExoticComponent<RefAttributes<HTMLDivElement>>
}[]

export type windowSizesType = {
  value: number,
  valInPx: string
}

type User = AuthContextType | null

interface AuthContextType {
  // isAuthenticated: boolean;
  // displayName?: string,
  // profilePic?: string
  user: User | null,
  loading: boolean,
  signIn: (data: UserSignInType) => Promise<void>,
  signUp: (data: UserCredentialsType) => Promise<void>,
  signOut: () => void
}

/** Represents the tier details of a plan. */
export type TierData = {
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

export type TiersResponse = {
  /** Status code of the response */
  statusCode: number,
  /** Data from the server */
  data: [TierData[]],
  /** Message from the server */
  message: string,
  /** Success status of the response */
  success: boolean
}

/** Represents the details of a feature in the shopping website. */
export type FeatureDetail = {
  /**
   * Unique identifier for the feature.
   * @example "feature023"
   */
  featureID: string;

  /**
   * The name of the feature.
   * @example "Premium Support"
   */
  title: string;

  /**
   * A brief description of what the feature offers.
   * @example "Provides 24/7 premium customer support."
   */
  description: string;

  /**
   * A React component that renders the feature's section.
   * @returns A JSX element representing the feature's section.
   */
  sectionComponent: () => JSX.Element;

  /**
   * Monthly price for the feature used by 1 user, in INR.
   * @example 9.99
   */
  price_per_user_per_month: number;
}

export type FeaturesResponse = {
  /** Status code of the response */
  statusCode: number,
  /** Data from the server */
  data: [FeatureDetail[]],
  /** Message from the server */
  message: string,
  /** Success status of the response */
  success: boolean
}

type SubscriptionHistoryType = {
  [key: string]: ({
    subId: number,
    subStatus: 'Trial',
    startDate: Date,
    endDate: Date,
    userStatus: 'Active' | 'Pending' | 'Cancelled' | 'Expired',
  } | {
    subId: number,
    subStatus: 'Monthly' | 'Yearly',
    tierId: number,
    paymentDate: Date,
    startDate?: Date,
    endDate?: Date,
    userStatus: 'Active' | 'Pending' | 'Cancelled' | 'Expired' | 'Ongoing',
  })[]
}

export type UserPlansResponse = {
  /** Status code of the response */
  statusCode: number,
  /** Data from the server */
  data: [SubscriptionHistoryType],
  /** Message from the server */
  message: string,
  /** Success status of the response */
  success: boolean
}