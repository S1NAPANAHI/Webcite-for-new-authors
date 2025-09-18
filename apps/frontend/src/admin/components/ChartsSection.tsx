'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const blogViewsData = [
  { date: 'Mon', views: 400 },
  { date: 'Tue', views: 520 },
  { date: 'Wed', views: 800 },
  { date: 'Thu', views: 620 },
  { date: 'Fri', views: 700 },
  { date: 'Sat', views: 900 },
  { date: 'Sun', views: 860 }
]

const chaptersReadData = [
  { date: 'Mon', reads: 300 },
  { date: 'Tue', reads: 360 },
  { date: 'Wed', reads: 540 },
  { date: 'Thu', reads: 820 },
  { date: 'Fri', reads: 610 },
  { date: 'Sat', reads: 700 },
  { date: 'Sun', reads: 410 }
]

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Blog Views Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Views (7 days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={blogViewsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ fill: '#2563eb' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chapters Read Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chapters Read (7 days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chaptersReadData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="reads" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
