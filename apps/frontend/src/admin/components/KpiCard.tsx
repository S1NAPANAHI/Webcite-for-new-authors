interface KpiCardProps {
  title: string
  value: string | number
  trend?: string
  color?: 'blue' | 'green' | 'purple' | 'red'
}

export function KpiCard({ title, value, trend, color = 'blue' }: KpiCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    red: 'bg-red-50 border-red-200'
  }

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <p className="ml-2 text-sm font-medium text-green-600">{trend}</p>
        )}
      </div>
    </div>
  )
}
