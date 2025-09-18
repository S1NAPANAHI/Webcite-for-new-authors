import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Database } from '@/types/supabase';

type LearnSection = Database['public']['Tables']['learn_sections']['Row'] & {
  section_type: 'authors_journey' | 'educational_resources' | 'professional_services';
};

type LearnCard = Database['public']['Tables']['learn_cards']['Row'] & {
  title: string;
  description: string | null;
  action_text: string | null;
  action_link: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
};

export default function LearnPage() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [sections, setSections] = useState<LearnSection[]>([]);
  const [cards, setCards] = useState<Record<string, LearnCard[]>>({});
  const [activeTab, setActiveTab] = useState<LearnSection['section_type']>('authors_journey');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('learn_sections')
          .select('*')
          .order('section_type');

        if (sectionsError) throw sectionsError;
        
        if (sectionsData && sectionsData.length > 0) {
          const typedSections = sectionsData as LearnSection[];
          setSections(typedSections);
          
          if (!activeTab && typedSections.length > 0) {
            setActiveTab(typedSections[0].section_type);
          }
          
          // Fetch cards for each section
          const cardsBySection: Record<string, LearnCard[]> = {};
          
          for (const section of typedSections) {
            const { data: cardsData, error: cardsError } = await supabase
              .from('learn_cards')
              .select('*')
              .eq('section_id', section.id)
              .eq('is_active', true)
              .order('display_order');
              
            if (cardsError) throw cardsError;
            
            cardsBySection[section.id] = (cardsData as LearnCard[]) || [];
          }
          
          setCards(cardsBySection);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [supabase]);

  const activeSection = sections.find(s => s.section_type === activeTab);
  const activeSectionCards = activeSection ? cards[activeSection.id] || [] : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Learn</h1>
      
      <div className="flex space-x-4 mb-8 border-b">
        {sections.map((section) => (
          <button
            key={section.section_type}
            className={`px-4 py-2 font-medium ${
              activeTab === section.section_type
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(section.section_type)}
          >
            {section.title}
          </button>
        ))}
      </div>
      
      {activeSection && (
        <div className="mb-8">
          {activeSection.description && (
            <p className="text-gray-600 mb-6">{activeSection.description}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSectionCards.length > 0 ? (
              activeSectionCards.map((card) => (
                <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {card.image_url && (
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={card.image_url}
                        alt={card.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    {card.description && (
                      <p className="text-gray-600 mb-4">{card.description}</p>
                    )}
                    {card.action_text && card.action_link && (
                      <a
                        href={card.action_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                      >
                        {card.action_text}
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No content available for this section.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
