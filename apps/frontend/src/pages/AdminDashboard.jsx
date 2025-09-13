import React from 'react';
import { KpiCard, ChartsGrid } from '@zoroaster/ui';


const AdminDashboard = () => {
  const kpis = [
    { label: 'Total Sales', value: '€12,530', trend: '+15.2%' },
    { label: 'Orders', value: '1,284', trend: '+8.7%' },
    { label: 'Customers', value: '1,092', trend: '+4.1%' },
    { label: 'E‑Books', value: '320', trend: '—' },
    { label: 'Blog Views (7d)', value: '4,210', trend: '+6.3%' },
    { label: 'Chapters Read (7d)', value: '3,740', trend: '+9.1%' },
    { label: 'Beta Apps (7d)', value: '42', trend: '—' },
    { label: 'Artist Projects', value: '7', trend: '—' },
  ];
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </section>
      <ChartsGrid />
    </div>
  );
};

export default AdminDashboard;
