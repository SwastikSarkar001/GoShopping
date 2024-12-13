import { logoWrapper } from "../../../types"

export default function LogoWrapper({
  viewBox,
  children,
  ...properties
}: logoWrapper) {
    return (
      <div className="w-full group/logo transition-all">
        <svg
          className="grayscale group-hover/logo:grayscale-0 transition-all w-max"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={viewBox}
          {...properties}
        >
          { children }
        </svg>
      </div>
    )
  }