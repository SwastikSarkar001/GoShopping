import { Link } from 'react-router-dom'

export default function UpcomingFeatures() {
  return (
    <section className="text-text py-12 px-6 h-screen flex flex-col items-center justify-center text-center bg-animated">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold font-source-serif mb-4">Coming Soon...</h1>
        <h2 className="text-2xl font-bold font-source-serif mb-4">This Feature is on the Way!</h2>
        <p className="text-gray-500 mb-6">
          We're working hard to bring this feature to life. Stay tuned for updates as we continue to enhance your eazzyBizz experience.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/features" className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">Explore Other Features</Link>
        </div>
      </div>
    </section>
  )
}
