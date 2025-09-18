import { KpiCard } from '../../../admin/components/KpiCard';
import { ChartsSection } from '../../../admin/components/ChartsSection';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Analytics Overview
        </h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Sales"
          value="€12,530"
          trend="+15.2%"
          color="green"
        />
        <KpiCard
          title="Active Orders"
          value="284"
          trend="+8.7%"
          color="blue"
        />
        <KpiCard
          title="Blog Views (7d)"
          value="4,210"
          trend="+6.3%"
          color="purple"
        />
        <KpiCard
          title="Beta Applications"
          value="42"
          color="red"
        />
      </div>

      {/* Creative Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Wiki Entries"
          value="127"
          color="blue"
        />
        <KpiCard
          title="Characters"
          value="45"
          color="purple"
        />
        <KpiCard
          title="Timeline Events"
          value="238"
          color="green"
        />
        <KpiCard
          title="Artist Projects"
          value="7"
          trend="3 active"
          color="red"
        />
      </div>

      {/* Charts */}
      <ChartsSection />
    </div>
  );
}
