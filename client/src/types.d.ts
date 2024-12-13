export type emptyProps = {}

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
  isAuthenticated: boolean;
  id: string,
  displayName?: string,
  profilePic?: string
}