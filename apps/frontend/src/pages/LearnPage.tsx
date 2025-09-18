import React, { useState, useEffect, useCallback } from 'react';
import { 
  Tabs, 
  Tab, 
  Spinner, 
  Card, 
  CardBody, 
  Button, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter 
} from '@nextui-org/react';
import { supabase } from '@zoroaster/shared';
import { Database } from '@/types/supabase';
import { toast } from 'react-hot-toast';
import { FileText, Video, Download, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define types for the new tables
type AuthorJourneyPost = Database['public']['Tables']['authors_journey_posts']['Row'];
type WritingGuide = Database['public']['Tables']['writing_guides']['Row'];
type VideoTutorial = Database['public']['Tables']['video_tutorials']['Row'];
type DownloadableTemplate = Database['public']['Tables']['downloadable_templates']['Row'];
type ProfessionalService = Database['public']['Tables']['professional_services']['Row'];

type LearnSectionType = 'authors_journey' | 'educational_resources' | 'professional_services';
type EducationalResourceType = 'writing_guides' | 'video_tutorials' | 'downloadable_templates';

const SECTION_TITLES = {
  authors_journey: "Author's Journey",
  educational_resources: 'Educational Resources',
  professional_services: 'Professional Services',
};

const EDUCATIONAL_RESOURCE_TITLES = {
  writing_guides: 'Writing Guides',
  video_tutorials: 'Video Tutorials',
  downloadable_templates: 'Downloadable Templates',
};

export default function LearnPage() {
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState<LearnSectionType>('authors_journey');
  const [activeEduTab, setActiveEduTab] = useState<EducationalResourceType>('writing_guides');
  const [isLoading, setIsLoading] = useState(true);

  const [authorsJourneyPosts, setAuthorsJourneyPosts] = useState<AuthorJourneyPost[]>([]);
  const [writingGuides, setWritingGuides] = useState<WritingGuide[]>([]);
  const [videoTutorials, setVideoTutorials] = useState<VideoTutorial[]>([]);
  const [downloadableTemplates, setDownloadableTemplates] = useState<DownloadableTemplate[]>([]);
  const [professionalServices, setProfessionalServices] = useState<ProfessionalService[]>([]);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: postsData, error: postsError } = await supabase.from('authors_journey_posts').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (postsError) throw postsError;
      setAuthorsJourneyPosts(postsData);

      const { data: guidesData, error: guidesError } = await supabase.from('writing_guides').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (guidesError) throw guidesError;
      setWritingGuides(guidesData);

      const { data: videosData, error: videosError } = await supabase.from('video_tutorials').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (videosError) throw videosError;
      setVideoTutorials(videosData);

      const { data: templatesData, error: templatesError } = await supabase.from('downloadable_templates').select('*').eq('status', 'published').order('created_at', { ascending: false });
      if (templatesError) throw templatesError;
      setDownloadableTemplates(templatesData);

      const { data: servicesData, error: servicesError } = await supabase.from('professional_services').select('*').eq('is_available', true).order('created_at', { ascending: false });
      if (servicesError) throw servicesError;
      setProfessionalServices(servicesData);

    } catch (error: any) {
      toast.error('Error fetching learn data: ' + error.message);
      console.error('Error fetching learn data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading content..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Learn & Grow</h1>
      
      <Tabs 
        selectedKey={activeMainTab}
        onSelectionChange={(key) => setActiveMainTab(key as LearnSectionType)}
        aria-label="Learn main sections"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider justify-center",
          cursor: "w-full",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:font-semibold"
        }}
      >
        {(Object.keys(SECTION_TITLES) as LearnSectionType[]).map((key) => (
          <Tab 
            key={key} 
            title={SECTION_TITLES[key]}
          >
            <div className="mt-8">
              {activeMainTab === 'authors_journey' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {authorsJourneyPosts.length > 0 ? (
                    authorsJourneyPosts.map((post) => (
                      <Card key={post.id} isPressable onPress={() => navigate(`/learn/authors-journey/${post.slug}`)} className="py-4 px-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                        <CardBody>
                          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{post.content ? post.content.replace(/<[^>]*>/g, '') : 'No content preview available.'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Published: {new Date(post.created_at).toLocaleDateString()}</p>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">No author's journey posts available.</div>
                  )}
                </div>
              )}

              {activeMainTab === 'educational_resources' && (
                <Tabs 
                  selectedKey={activeEduTab}
                  onSelectionChange={(key) => setActiveEduTab(key as EducationalResourceType)}
                  aria-label="Educational resources sub-sections"
                  color="secondary"
                  variant="bordered"
                  classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider justify-center",
                    cursor: "w-full",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:font-semibold"
                  }}
                >
                  {(Object.keys(EDUCATIONAL_RESOURCE_TITLES) as EducationalResourceType[]).map((eduKey) => (
                    <Tab 
                      key={eduKey} 
                      title={EDUCATIONAL_RESOURCE_TITLES[eduKey]}
                    >
                      <div className="mt-8">
                        {eduKey === 'writing_guides' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {writingGuides.length > 0 ? (
                              writingGuides.map((guide) => (
                                <Card key={guide.id} isPressable onPress={() => navigate(`/learn/writing-guides/${guide.slug}`)} className="py-4 px-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                                  <CardBody>
                                    <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{guide.content ? guide.content.replace(/<[^>]*>/g, '') : 'No content preview available.'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Published: {new Date(guide.created_at).toLocaleDateString()}</p>
                                  </CardBody>
                                </Card>
                              ))
                            ) : (
                              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">No writing guides available.</div>
                            )}
                          </div>
                        )}

                        {eduKey === 'video_tutorials' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videoTutorials.length > 0 ? (
                              videoTutorials.map((video) => (
                                <Card key={video.id} isPressable onPress={() => window.open(video.video_url || '', '_blank')} className="py-4 px-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                                  <CardBody>
                                    <Video size={48} className="mb-4 text-blue-500" />
                                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{video.description || 'No description available.'}</p>
                                  </CardBody>
                                </Card>
                              ))
                            ) : (
                              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">No video tutorials available.</div>
                            )}
                          </div>
                        )}

                        {eduKey === 'downloadable_templates' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {downloadableTemplates.length > 0 ? (
                              downloadableTemplates.map((template) => (
                                <Card key={template.id} isPressable onPress={() => window.open(template.file_path || '', '_blank')} className="py-4 px-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                                  <CardBody>
                                    <Download size={48} className="mb-4 text-green-500" />
                                    <h3 className="text-xl font-semibold mb-2">{template.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{template.description || 'No description available.'}</p>
                                  </CardBody>
                                </Card>
                              ))
                            ) : (
                              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">No downloadable templates available.</div>
                            )}
                          </div>
                        )}
                      </div>
                    </Tab>
                  ))}
                </Tabs>
              )}

              {activeMainTab === 'professional_services' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {professionalServices.length > 0 ? (
                    professionalServices.map((service) => (
                      <Card key={service.id} className="py-4 px-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                        <CardBody>
                          <DollarSign size={48} className="mb-4 text-purple-500" />
                          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{service.description || 'No description available.'}</p>
                          <p className="text-lg font-bold mt-2">${service.price?.toFixed(2)}</p>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">No professional services available.</div>
                  )}
                </div>
              )}
            </div>
          </Tab>
        ))}
      </Tabs>

      
    </div>
  );
}