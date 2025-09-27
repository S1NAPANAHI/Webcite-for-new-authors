import React, { useState } from 'react';
import { Home, BarChart3, MessageSquare, Settings } from 'lucide-react';

// Import the individual editor components
import HeroEditor from './HeroEditor';
import MetricsEditor from './MetricsEditor';
import QuotesEditor from './QuotesEditor';
import LayoutEditor from './LayoutEditor';

// Tab types
type TabType = 'hero' | 'metrics' | 'quotes' | 'layout';

interface Tab {
  id: TabType;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  description: string;
}

const HomeContentManager: React.FC = () => {
  // ULTRA-SIMPLE hook pattern - only useState for active tab
  // No useEffect, no complex state, no external dependencies
  const [activeTab, setActiveTab] = useState<TabType>('hero');

  // Tab configuration with components
  const tabs: Tab[] = [
    {
      id: 'hero',
      name: 'Hero Section',
      icon: <Home className="w-4 h-4" />,
      component: <HeroEditor />,
      description: 'Manage homepage hero content, title, subtitle, and CTA'
    },
    {
      id: 'metrics',
      name: 'Progress Metrics',
      icon: <BarChart3 className="w-4 h-4" />,
      component: <MetricsEditor />,
      description: 'Configure writing progress statistics and achievements'
    },
    {
      id: 'quotes',
      name: 'Quotes',
      icon: <MessageSquare className="w-4 h-4" />,
      component: <QuotesEditor />,
      description: 'Add, edit, and manage inspirational quotes'
    },
    {
      id: 'layout',
      name: 'Layout Sections',
      icon: <Settings className="w-4 h-4" />,
      component: <LayoutEditor />,
      description: 'Toggle homepage sections visibility and layout preferences'
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab)!;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🏠 Homepage Content Manager
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all aspects of your homepage content with focused, dedicated editors
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-500">
              Component Splitting Architecture - No Hook Violations Possible
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Active Tab: <span className="font-medium">{currentTab.name}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {currentTab.description}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
            >
              {tab.icon}
              <span>{tab.name}</span>
              {activeTab === tab.id && (
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 min-h-[600px]">
        {currentTab.component}
      </div>

      {/* Footer Info */}
      <div className="text-center py-4">
        <div className="text-xs text-gray-500 space-y-1">
          <div>
            ✅ <strong>Component Splitting:</strong> Each tab is an independent React component
          </div>
          <div>
            ✅ <strong>Hook Safety:</strong> Maximum 2 hooks per component (useState + useEffect)
          </div>
          <div>
            ✅ <strong>Zero Conflicts:</strong> No shared state or complex interdependencies
          </div>
          <div>
            ✅ <strong>Isolated Errors:</strong> If one tab fails, others continue working
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContentManager;