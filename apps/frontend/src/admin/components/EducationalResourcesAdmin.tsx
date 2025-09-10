
import React, { useState } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import WritingGuidesAdmin from './WritingGuidesAdmin';
import VideoTutorialsAdmin from './VideoTutorialsAdmin';
import DownloadableTemplatesAdmin from './DownloadableTemplatesAdmin';

type ResourceType = 'writing_guides' | 'video_tutorials' | 'downloadable_templates';

const RESOURCE_TITLES = {
  writing_guides: 'Writing Guides',
  video_tutorials: 'Video Tutorials',
  downloadable_templates: 'Downloadable Templates',
};

type EducationalResourcesAdminProps = {
  color: 'primary' | 'secondary' | 'success';
};

export default function EducationalResourcesAdmin({ color }: EducationalResourcesAdminProps) {
  const [activeTab, setActiveTab] = useState<ResourceType>('writing_guides');

  return (
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={(key) => setActiveTab(key as ResourceType)}
      aria-label="Educational resources sections"
      color={color}
      variant="bordered"
      className="mb-6"
    >
      {Object.entries(RESOURCE_TITLES).map(([key, title]) => (
        <Tab key={key} title={title}>
          <div className="mt-4">
            {activeTab === 'writing_guides' && <WritingGuidesAdmin color={color} />}
            {activeTab === 'video_tutorials' && <VideoTutorialsAdmin color={color} />}
            {activeTab === 'downloadable_templates' && <DownloadableTemplatesAdmin color={color} />}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
}
