import useAuth from "../../../hooks/useAuth"

export default function MainContent() {
  const user = useAuth()
  return (
    <div>
      <div className="p-8 text-text">
        <h1 className="text-3xl font-semibold font-source-serif">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.firstName}{user?.middleName ? '' + user.middleName : ''} {user?.lastName}!</p>
      </div>
    </div>
  )
}
