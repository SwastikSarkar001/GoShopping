export default function Settings() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold font-source-serif mb-8">Settings</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-lg text-gray-500">Dark Mode</p>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Enable</button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg text-gray-500">Notifications</p>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Enable</button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg text-gray-500">Email Notifications</p>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Enable</button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg text-gray-500">SMS Notifications</p>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Enable</button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg text-gray-500">Push Notifications</p>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Enable</button>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg text-gray-500">Location</p>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">Change</button>
        </div>
      </div>
    </div>
  )
}
