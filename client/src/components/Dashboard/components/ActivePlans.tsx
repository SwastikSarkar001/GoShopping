type Plan = {
  id: number,
  subscriptionType: 'Trial' | 'Monthly' | 'Yearly',
  status: 'Active' | 'Inactive' | 'Cancelled' | 'Expired' | 'Pending',
  startDate: Date,
  endDate: Date,
  plans: {
    feature: string,
    tier: 'Basic' | 'Standard' | 'Premium',
  }[]
}

const plans: Plan[] = [
  {
    id: 1,
    subscriptionType: 'Monthly',
    status: 'Active',
    startDate: new Date('2021-09-01'),
    endDate: new Date('2021-09-30'),
    plans: [
      {
        feature: 'eazzyChat',
        tier: 'Basic'
      },
      {
        feature: 'eazzyCRM',
        tier: 'Standard'
      }
    ]
  }
]

export default function ActivePlans() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-semibold font-source-serif">Active plans</h1>
      <div className="mt-8 px-4">
        {
          plans.map((plan: Plan) => (
            <div key={plan.id} className="border text-black border-gray-300 bg-linear-45 from-blue-200 to-violet-400 rounded-lg p-4 my-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-semibold">{plan.subscriptionType} Plan</div>
                  <div className="text-sm text-gray-500">{plan.status}</div>
                </div>
                <div>
                  <div>Start Date: {plan.startDate.toDateString()}</div>
                  <div>End Date: {plan.endDate.toDateString()}</div>
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Features</h2>
                <ul className="list-disc pl-8">
                  {
                    plan.plans.map((p, i) => (
                      <li key={i}>{p.feature} - {p.tier}</li>
                    ))
                  }
                </ul>
              </div>
            </div>
          ))
        }
      </div>
    </main>
  )
}