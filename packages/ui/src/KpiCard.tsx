import React from 'react';

export function KpiCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="bg-white rounded border p-4">
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      <div className="text-xs mt-1 text-emerald-600">{trend}</div>
    </div>
  );
}