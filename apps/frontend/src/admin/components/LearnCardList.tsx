import { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Button, Spinner, Input, Textarea } from '@nextui-org/react';
import { TrashIcon, ArrowUpIcon, ArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { supabase } from '@zoroaster/shared';

// Define proper types for our data
interface LearnSection {
  id: string;
  title: string;
  section_type: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

interface LearnCard {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  action_text: string | null;
  action_link: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string | null;
  isEditing?: boolean;
}

type SectionType = 'authors_journey' | 'educational_resources' | 'professional_services';

interface LearnCardListProps {
  sectionType: SectionType;
  isLoading: boolean;
  onLoadingChange: (isLoading: boolean) => void;
}

export default function LearnCardList({ sectionType, isLoading, onLoadingChange }: LearnCardListProps) {
  const [cards, setCards] = useState<LearnCard[]>([]);
  const [editingCard, setEditingCard] = useState<LearnCard | null>(null);
  const [section, setSection] = useState<LearnSection | null>(null);

  const fetchSectionAndCards = useCallback(async () => {
    console.log('Fetching section and cards...');
    try {
      onLoadingChange(true);
      
      // Ensure user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Authentication required:', sessionError?.message || 'No active session');
        // Optionally redirect to login or show error
        return;
      }
      
      
      
      // Get the section ID for the current section type
      const { data: sectionData, error: sectionError } = await supabase
        .from('learn_sections')
        .select('*')
        .eq('section_type', sectionType)
        .single();

      if (sectionError) {
        console.error('Error fetching section:', sectionError);
        throw sectionError;
      }
      
      if (sectionData) {
        // Only update section if it's different to prevent unnecessary re-renders
        setSection(prev => {
          if (!prev || prev.id !== sectionData.id) {
            return sectionData;
          }
          return prev;
        });
        
        // Get cards for this section
        const { data: cardsData, error: cardsError } = await supabase
          .from('learn_cards')
          .select('*')
          .eq('section_id', sectionData.id)
          .order('display_order');
          
        if (cardsError) {
          console.error('Error fetching cards:', cardsError);
          throw cardsError;
        }
        
        // Only update cards if they're different to prevent unnecessary re-renders
        setCards(prev => {
          const newCards = cardsData || [];
          if (prev.length !== newCards.length || 
              JSON.stringify(prev.map(c => c.id).sort()) !== 
              JSON.stringify(newCards.map(c => c.id).sort())) {
            return newCards;
          }
          return prev;
        });
      }
    } catch (error) {
      console.error('Error in fetchSectionAndCards:', error);
      // Consider showing an error message to the user
    } finally {
      onLoadingChange(false);
    }
  }, [sectionType, onLoadingChange, supabase]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        await fetchSectionAndCards();
      } catch (error) {
        if (!controller.signal.aborted && isMounted) {
          console.error('Error in fetchData:', error);
        }
      }
    };
    
    if (isMounted) {
      fetchData();
    }
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [fetchSectionAndCards, supabase]);

  // Handle card reordering
  const handleUpdateCardOrder = useCallback(async (reorderedCards: LearnCard[]) => {
    try {
      // Ensure we have valid cards
      if (!Array.isArray(reorderedCards) || reorderedCards.length === 0) {
        console.error('Invalid cards array for update');
        return;
      }

      // Create updates with proper typing
      const updates: Array<{ id: string; display_order: number }> = reorderedCards
        .filter(card => card && card.id) // Filter out any invalid cards
        .map((card, idx) => ({
          id: card.id,
          display_order: idx + 1
        }));

      // Update local state optimistically
      setCards(reorderedCards);

      // Only proceed if we have valid updates
      if (updates.length === 0) {
        console.error('No valid card updates to process');
        return;
      }

      // Update in the database
      const { error } = await supabase
        .from('learn_cards')
        .upsert(updates, { onConflict: 'id' });

      if (error) {
        console.error('Error updating card order:', error);
        await fetchSectionAndCards(); // Refetch to restore correct order
      }
    } catch (error) {
      console.error('Error updating card order:', error);
      await fetchSectionAndCards(); // Refetch to restore correct order
    }
  }, [fetchSectionAndCards, supabase]);

  const handleDeleteCard = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;
    
    try {
      onLoadingChange(true);
      
      const { error } = await supabase
        .from('learn_cards')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setCards(prev => prev.filter(card => card.id !== id));
    } catch (error) {
      console.error('Error deleting card:', error);
    } finally {
      onLoadingChange(false);
    }
  }, [onLoadingChange]);

  const handleSaveCard = useCallback(async () => {
    if (!editingCard || !section?.id) {
      console.error('Cannot save card: No editing card or section ID');
      return;
    }
    
    try {
      onLoadingChange(true);
      const cardData: Omit<LearnCard, 'id' | 'created_at' | 'updated_at' | 'isEditing'> = {
        section_id: section.id,
        title: editingCard.title ?? '',
        description: editingCard.description ?? null,
        action_text: editingCard.action_text ?? null,
        action_link: editingCard.action_link ?? null,
        image_url: editingCard.image_url ?? null,
        is_active: editingCard.is_active ?? true,
        display_order: editingCard.display_order ?? 0
      };

      if (editingCard.id.startsWith('temp-')) {
        // New card
        const newCard = {
          ...cardData,
          display_order: cards.length + 1,
          created_at: new Date().toISOString(),
          updated_at: null
        };
        
        const { data, error } = await supabase
          .from('learn_cards')
          .insert(newCard)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setCards(prev => [...prev, { ...data, isEditing: false }]);
        }
      } else {
        // Update existing card
        const { data, error } = await supabase
          .from('learn_cards')
          .update({
            ...cardData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCard.id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setCards(prev => prev.map(c => (c.id === editingCard.id ? { ...data, isEditing: false } : c)));
        }
      }

      // Don't set editingCard to null if we're still editing
      setEditingCard(null);
    } catch (error) {
      console.error('Error saving card:', error);
    } finally {
      onLoadingChange(false);
    }
  }, [editingCard, section?.id, cards.length, onLoadingChange]);

  const handleMoveCard = useCallback(async (index: number, direction: 'up' | 'down') => {
    // Add type guard for cards array
    if (!Array.isArray(cards) || cards.length === 0) {
      console.error('Invalid cards array');
      return;
    }
    
    // Validate index bounds
    if (index < 0 || index >= cards.length) {
      console.error('Invalid card index');
      return;
    }
    
    // Check if move is valid
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index >= cards.length - 1)) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedCards = [...cards];
    
    // Ensure we have valid cards at both indices
    const currentCard = updatedCards[index];
    const targetCard = updatedCards[newIndex];
    
    if (!currentCard || !targetCard) {
      console.error('Invalid card at index');
      return;
    }
    
    // Create new objects to avoid reference issues and ensure type safety
    updatedCards[index] = { ...targetCard, display_order: currentCard.display_order };
    updatedCards[newIndex] = { ...currentCard, display_order: targetCard.display_order };
    
    try {
      onLoadingChange(true);
      
      // Update display order for all affected cards
      const updates = updatedCards.map((card, idx) => ({
        id: card.id,
        display_order: idx + 1
      }));
      
      // Update local state optimistically
      setCards(prev => prev.map((card, idx) => ({
        ...card,
        display_order: updates.find(u => u.id === card.id)?.display_order || card.display_order
      })));
      
      // Update in the database
      const { error } = await supabase
        .from('learn_cards')
        .upsert(updates, { onConflict: 'id' });
        
      if (error) throw error;
      
    } catch (error) {
      console.error('Error moving card:', error);
      await fetchSectionAndCards(); // Revert to server state on error
    } finally {
      onLoadingChange(false);
    }
  }, [cards, onLoadingChange, fetchSectionAndCards]);

  const handleAddNewCard = useCallback(() => {
    if (!section?.id) {
      console.error('Cannot add card: No section ID available');
      return;
    }
    
    const newCard: LearnCard = {
      id: `temp-${Date.now()}`,
      section_id: section.id,
      title: 'New Card',
      description: null,
      action_text: null,
      action_link: null,
      image_url: null,
      is_active: true,
      display_order: cards.length + 1,
      created_at: new Date().toISOString(),
      updated_at: null,
      isEditing: true
    };
    
    setCards(prev => [...prev, newCard]);
    setEditingCard(newCard);
  }, [section?.id, cards.length]);

  // Helper function to safely render card content
  const renderCardContent = (card: LearnCard) => {
    if (!card) return null;
    
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{card.title || 'Untitled Card'}</h3>
        {card.description && <p className="text-gray-600">{card.description}</p>}
        {card.action_text && card.action_link && (
          <a 
            href={card.action_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {card.action_text}
          </a>
        )}
      </div>
    );
  };

  if (isLoading && cards.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(() => {
        return cards.filter(Boolean).map((card, index) => (
          <Card key={card.id} className="relative">
            <CardBody>
              {editingCard?.id === card.id ? (
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={editingCard?.title ?? ''}
                  onChange={(e) =>
                    setEditingCard(prev => prev ? {
                      ...prev,
                      title: e.target.value,
                    } : null)
                  }
                />
                <Textarea
                  label="Description"
                  value={editingCard?.description ?? ''}
                  onChange={(e) =>
                    setEditingCard(prev => prev ? {
                      ...prev,
                      description: e.target.value,
                    } : null)
                  }
                />
                <div className="flex space-x-2">
                  <Input
                    label="Action Text"
                    value={editingCard?.action_text ?? ''}
                    onChange={(e) =>
                      setEditingCard(prev => prev ? {
                        ...prev,
                        action_text: e.target.value,
                      } : null)
                    }
                  />
                  <Input
                    label="Action Link"
                    value={editingCard?.action_link ?? ''}
                    onChange={(e) =>
                      setEditingCard(prev => prev ? {
                        ...prev,
                        action_link: e.target.value,
                      } : null)
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => setEditingCard(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onPress={handleSaveCard}
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {renderCardContent(card)}
                </div>
                <div className="flex space-x-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => handleMoveCard(index, 'up')}
                    isDisabled={index === 0}
                    title="Move up"
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => handleMoveCard(index, 'down')}
                    isDisabled={index === cards.length - 1}
                    title="Move down"
                  >
                    <ArrowDownIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    color="danger"
                    variant="light"
                    onPress={() => handleDeleteCard(card.id)}
                    title="Delete card"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      ));
      })()}
      
      <Button
        className="w-full mt-4"
        startContent={<PlusIcon className="h-5 w-5" />}
        onPress={handleAddNewCard}
        isLoading={isLoading}
      >
        Add New Card
      </Button>
    </div>
  );
}
