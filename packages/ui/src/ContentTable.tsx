
import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, Search } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode; // Optional render function for custom cell content
}

interface ContentTableProps {
  contentType: string; // e.g., 'posts', 'pages', 'characters'
  items: any[]; // Array of content items
  title: string; // Title for the section (e.g., "Blog Posts")
  columns: Column[]; // Array of column definitions
  createActionLabel: string; // Label for the "Add New" button (e.g., "New Post")
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export const ContentTable: React.FC<ContentTableProps> = ({
  contentType,
  items,
  title,
  columns,
  createActionLabel,
  onEdit,
  onDelete,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = Object.values(item).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {createActionLabel}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${title.toLowerCase()}...`}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="text-left py-3 px-6 text-sm font-medium text-gray-900">
                  {column.label}
                </th>
              ))}
              <th className="text-right py-3 px-6 text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="py-4 px-6">
                    {column.render ? column.render(item) : (
                      <div className={column.key === columns[0].key ? "font-medium text-gray-900" : "text-sm text-gray-500"}>
                        {item[column.key]}
                      </div>
                    )}
                  </td>
                ))}
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit(item)}
                      className="p-1 text-gray-500 hover:text-blue-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-green-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


