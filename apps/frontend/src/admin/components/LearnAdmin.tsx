
import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthorsJourneyAdmin from './AuthorsJourneyAdmin';
import EducationalResourcesAdmin from './EducationalResourcesAdmin';
import ProfessionalServicesAdmin from './ProfessionalServicesAdmin';

type SectionType = 'authors_journey' | 'educational_resources' | 'professional_services';

const sectionDetails: { [key in SectionType]: { title: string; color: 'primary' | 'secondary' | 'success'; content: JSX.Element; bgClass: string } } = {
  authors_journey: {
    title: "Author's Journey",
    color: 'primary',
    content: <AuthorsJourneyAdmin color="primary" />,
    bgClass: 'bg-gradient-authors-journey',
  },
  educational_resources: {
    title: 'Educational Resources',
    color: 'secondary',
    content: <EducationalResourcesAdmin color="secondary" />,
    bgClass: 'bg-gradient-educational-resources',
  },
  professional_services: {
    title: 'Professional Services',
    color: 'success',
    content: <ProfessionalServicesAdmin color="success" />,
    bgClass: 'bg-gradient-professional-services',
  },
};

export default function LearnAdmin() {
  const [activeTab, setActiveTab] = useState<SectionType>('authors_journey');

  const activeColor = sectionDetails[activeTab].color;
  const activeBgClass = sectionDetails[activeTab].bgClass;

  useEffect(() => {
    document.body.className = ''; // Clear existing classes
    document.body.classList.add(activeBgClass);
    return () => {
      document.body.classList.remove(activeBgClass);
    };
  }, [activeBgClass]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl w-full mx-auto glass-effect-silver rounded-lg shadow-xl p-6 sm:p-8 lg:p-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">Learn Page Management</h1>
          <p className="text-lg text-white dark:text-gray-400 mt-2 max-w-2xl mx-auto">Manage all educational content and professional services from this dashboard.</p>
        </header>
        
        <Tabs 
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as SectionType)}
          aria-label="Learn page sections"
          color={activeColor}
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider justify-center",
            cursor: "w-full",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:font-semibold"
          }}
        >
          {(Object.keys(sectionDetails) as SectionType[]).map((key) => (
            <Tab 
              key={key} 
              title={sectionDetails[key].title}
            >
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    layout
                    overflow="hidden"
                  >
                    {sectionDetails[activeTab].content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
