import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  Upload,
  Plus,
  Trash2,
  User,
  Crown,
  Eye,
  Star,
  Zap,
  Users,
  BookOpen,
  Heart,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { Character, CharacterType, CharacterStatus, PowerLevel } from '../../../types/character';
import {
  CHARACTER_TYPE_CONFIG,
  CHARACTER_STATUS_CONFIG,
  POWER_LEVEL_CONFIG,
  generateCharacterSlug
} from '../../../utils/characterUtils';
import { supabase } from '@zoroaster/shared';

interface CharacterFormProps {
  character?: Character | null;
  onSave: (character: Character) => void;
  onCancel: () => void;
  className?: string;
}

interface CharacterFormData {
  // Basic Information
  name: string;
  slug: string;
  title: string;
  aliases: string[];
  description: string;
  
  // Classification
  character_type: CharacterType;
  status: CharacterStatus;
  power_level: PowerLevel;
  importance_score: number;
  
  // Details
  age?: number;
  age_description: string;
  gender: string;
  species: string;
  occupation: string;
  location: string;
  origin: string;
  
  // Physical Description
  height: string;
  build: string;
  hair_color: string;
  eye_color: string;
  distinguishing_features: string;
  
  // Personality
  personality_traits: string[];
  background_summary: string;
  motivations: string[];
  fears: string[];
  goals: string[];
  skills: string[];
  weaknesses: string[];
  
  // Story Integration
  character_arc_summary: string;
  primary_faction: string;
  allegiances: string[];
  
  // Metadata
  is_major_character: boolean;
  is_pov_character: boolean;
  is_spoiler_sensitive: boolean;
  spoiler_tags: string[];
  
  // SEO
  meta_description: string;
  meta_keywords: string[];
  
  // Visual
  portrait_file_id?: string;
  portrait_url: string;
  color_theme: string;
}

const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onSave,
  onCancel,
  className = ''
}) => {
  const [formData, setFormData] = useState<CharacterFormData>({
    name: '',
    slug: '',
    title: '',
    aliases: [],
    description: '',
    character_type: 'minor',
    status: 'alive',
    power_level: 'mortal',
    importance_score: 50,
    age_description: '',
    gender: '',
    species: 'Human',
    occupation: '',
    location: '',
    origin: '',
    height: '',
    build: '',
    hair_color: '',
    eye_color: '',
    distinguishing_features: '',
    personality_traits: [],
    background_summary: '',
    motivations: [],
    fears: [],
    goals: [],
    skills: [],
    weaknesses: [],
    character_arc_summary: '',
    primary_faction: '',
    allegiances: [],
    is_major_character: false,
    is_pov_character: false,
    is_spoiler_sensitive: false,
    spoiler_tags: [],
    meta_description: '',
    meta_keywords: [],
    portrait_url: '',
    color_theme: CHARACTER_TYPE_CONFIG.minor.color
  });
  
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'personality' | 'story' | 'meta'>('basic');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableFiles, setAvailableFiles] = useState<any[]>([]);

  // Initialize form with character data
  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name || '',
        slug: character.slug || '',
        title: character.title || '',
        aliases: character.aliases || [],
        description: character.description || '',
        character_type: character.character_type || 'minor',
        status: character.status || 'alive',
        power_level: character.power_level || 'mortal',
        importance_score: character.importance_score || 50,
        age: character.age,
        age_description: character.age_description || '',
        gender: character.gender || '',
        species: character.species || 'Human',
        occupation: character.occupation || '',
        location: character.location || '',
        origin: character.origin || '',
        height: character.height || '',
        build: character.build || '',
        hair_color: character.hair_color || '',
        eye_color: character.eye_color || '',
        distinguishing_features: character.distinguishing_features || '',
        personality_traits: character.personality_traits || [],
        background_summary: character.background_summary || '',
        motivations: character.motivations || [],
        fears: character.fears || [],
        goals: character.goals || [],
        skills: character.skills || [],
        weaknesses: character.weaknesses || [],
        character_arc_summary: character.character_arc_summary || '',
        primary_faction: character.primary_faction || '',
        allegiances: character.allegiances || [],
        is_major_character: character.is_major_character || false,
        is_pov_character: character.is_pov_character || false,
        is_spoiler_sensitive: character.is_spoiler_sensitive || false,
        spoiler_tags: character.spoiler_tags || [],
        meta_description: character.meta_description || '',
        meta_keywords: character.meta_keywords || [],
        portrait_url: character.portrait_url || '',
        color_theme: character.color_theme || CHARACTER_TYPE_CONFIG[character.character_type || 'minor'].color
      });
    }
  }, [character]);

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && (!character || character.slug === generateCharacterSlug(character.name))) {
      setFormData(prev => ({
        ...prev,
        slug: generateCharacterSlug(formData.name)
      }));
    }
  }, [formData.name, character]);

  // Update color theme based on character type
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      color_theme: CHARACTER_TYPE_CONFIG[formData.character_type].color
    }));
  }, [formData.character_type]);

  const handleInputChange = (field: keyof CharacterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayInputChange = (field: keyof CharacterFormData, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    handleInputChange(field, array);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Character name is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Character slug is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Character description is required';
    }
    
    if (formData.importance_score < 0 || formData.importance_score > 100) {
      newErrors.importance_score = 'Importance score must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const characterData = {
        ...formData,
        age: formData.age || null,
        meta_description: formData.meta_description || formData.description.substring(0, 160)
      };
      
      let result;
      
      if (character) {
        // Update existing character
        const { data, error } = await supabase
          .from('characters')
          .update(characterData)
          .eq('id', character.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new character
        const { data, error } = await supabase
          .from('characters')
          .insert([characterData])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      console.log('✅ Character saved successfully:', result);
      onSave(result);
    } catch (error: any) {
      console.error('❌ Error saving character:', error);
      
      if (error.code === '23505') {
        setErrors({ slug: 'This slug is already taken. Please choose a different one.' });
      } else {
        setErrors({ general: error.message || 'Failed to save character' });
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <User className="w-4 h-4" /> },
    { id: 'details', label: 'Details', icon: <Eye className="w-4 h-4" /> },
    { id: 'personality', label: 'Personality', icon: <Heart className="w-4 h-4" /> },
    { id: 'story', label: 'Story', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'meta', label: 'Metadata', icon: <Star className="w-4 h-4" /> }
  ];

  const InputField: React.FC<{
    label: string;
    field: keyof CharacterFormData;
    type?: 'text' | 'number' | 'textarea' | 'select';
    options?: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    rows?: number;
  }> = ({ label, field, type = 'text', options, placeholder, required, rows = 3 }) => {
    const value = formData[field];
    const error = errors[field];
    
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {type === 'textarea' ? (
          <textarea
            value={value as string || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
              error ? 'border-red-500' : 'border-border'
            }`}
          />
        ) : type === 'select' ? (
          <select
            value={value as string || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
              error ? 'border-red-500' : 'border-border'
            }`}
          >
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value as string | number || ''}
            onChange={(e) => handleInputChange(field, type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
              error ? 'border-red-500' : 'border-border'
            }`}
          />
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  };

  const ArrayInputField: React.FC<{
    label: string;
    field: keyof CharacterFormData;
    placeholder?: string;
  }> = ({ label, field, placeholder }) => {
    const value = (formData[field] as string[]) || [];
    
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
        <input
          type="text"
          value={value.join(', ')}
          onChange={(e) => handleArrayInputChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Separate multiple items with commas
        </p>
      </div>
    );
  };

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {character ? 'Edit Character' : 'Create New Character'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {character ? `Editing ${character.name}` : 'Add a new character to your story'}
          </p>
        </div>
        
        <button
          onClick={onCancel}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{errors.general}</span>
            </div>
          )}

          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Character Name"
                  field="name"
                  placeholder="Enter character name"
                  required
                />
                <InputField
                  label="Slug"
                  field="slug"
                  placeholder="character-slug"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Title/Nickname"
                  field="title"
                  placeholder="e.g., The Prophet, The Dark Lord"
                />
                <ArrayInputField
                  label="Aliases"
                  field="aliases"
                  placeholder="Alternative names, separated by commas"
                />
              </div>
              
              <InputField
                label="Description"
                field="description"
                type="textarea"
                placeholder="Describe the character's role and significance in your story"
                rows={4}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  label="Character Type"
                  field="character_type"
                  type="select"
                  options={Object.entries(CHARACTER_TYPE_CONFIG).map(([key, config]) => ({
                    value: key,
                    label: config.label
                  }))}
                />
                <InputField
                  label="Status"
                  field="status"
                  type="select"
                  options={Object.entries(CHARACTER_STATUS_CONFIG).map(([key, config]) => ({
                    value: key,
                    label: config.label
                  }))}
                />
                <InputField
                  label="Power Level"
                  field="power_level"
                  type="select"
                  options={Object.entries(POWER_LEVEL_CONFIG).map(([key, config]) => ({
                    value: key,
                    label: config.label
                  }))}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Importance Score (0-100)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.importance_score}
                    onChange={(e) => handleInputChange('importance_score', parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 (Background)</span>
                    <span className="font-medium text-foreground">{formData.importance_score}</span>
                    <span>100 (Legendary)</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_major_character}
                      onChange={(e) => handleInputChange('is_major_character', e.target.checked)}
                      className="rounded border-border focus:ring-primary/20 text-primary"
                    />
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-foreground">Major Character</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_pov_character}
                      onChange={(e) => handleInputChange('is_pov_character', e.target.checked)}
                      className="rounded border-border focus:ring-primary/20 text-primary"
                    />
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-foreground">POV Character</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField
                  label="Age"
                  field="age"
                  type="number"
                  placeholder="25"
                />
                <InputField
                  label="Age Description"
                  field="age_description"
                  placeholder="e.g., Ancient, Young Adult"
                />
                <InputField
                  label="Gender"
                  field="gender"
                  placeholder="Male, Female, Non-binary, etc."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Species"
                  field="species"
                  placeholder="Human, Elf, Dragon, etc."
                />
                <InputField
                  label="Occupation"
                  field="occupation"
                  placeholder="Prophet, King, Warrior, etc."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Current Location"
                  field="location"
                  placeholder="Where they currently reside"
                />
                <InputField
                  label="Origin"
                  field="origin"
                  placeholder="Where they're from originally"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Height"
                  field="height"
                  placeholder="6 feet 2 inches, Tall, Short, etc."
                />
                <InputField
                  label="Build"
                  field="build"
                  placeholder="Athletic, Slender, Muscular, etc."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Hair Color"
                  field="hair_color"
                  placeholder="Brown, Silver, Black, etc."
                />
                <InputField
                  label="Eye Color"
                  field="eye_color"
                  placeholder="Blue, Brown, Green, etc."
                />
              </div>
              
              <InputField
                label="Distinguishing Features"
                field="distinguishing_features"
                type="textarea"
                placeholder="Scars, birthmarks, unique characteristics..."
              />
            </div>
          )}

          {/* Personality Tab */}
          {activeTab === 'personality' && (
            <div className="space-y-6">
              <ArrayInputField
                label="Personality Traits"
                field="personality_traits"
                placeholder="Wise, Brave, Cunning, Compassionate"
              />
              
              <InputField
                label="Background Summary"
                field="background_summary"
                type="textarea"
                placeholder="Character's backstory and history..."
                rows={4}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ArrayInputField
                  label="Motivations"
                  field="motivations"
                  placeholder="What drives this character"
                />
                <ArrayInputField
                  label="Fears"
                  field="fears"
                  placeholder="What they're afraid of"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ArrayInputField
                  label="Goals"
                  field="goals"
                  placeholder="What they want to achieve"
                />
                <ArrayInputField
                  label="Skills"
                  field="skills"
                  placeholder="What they're good at"
                />
              </div>
              
              <ArrayInputField
                label="Weaknesses"
                field="weaknesses"
                placeholder="Character flaws and limitations"
              />
            </div>
          )}

          {/* Story Tab */}
          {activeTab === 'story' && (
            <div className="space-y-6">
              <InputField
                label="Character Arc Summary"
                field="character_arc_summary"
                type="textarea"
                placeholder="How this character evolves throughout the story..."
                rows={4}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Primary Faction"
                  field="primary_faction"
                  placeholder="Main group they belong to"
                />
                <ArrayInputField
                  label="Allegiances"
                  field="allegiances"
                  placeholder="Groups, causes, or people they support"
                />
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_spoiler_sensitive}
                    onChange={(e) => handleInputChange('is_spoiler_sensitive', e.target.checked)}
                    className="rounded border-border focus:ring-primary/20 text-primary"
                  />
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-foreground">Contains Spoilers</span>
                </label>
                
                {formData.is_spoiler_sensitive && (
                  <ArrayInputField
                    label="Spoiler Tags"
                    field="spoiler_tags"
                    placeholder="Major death, plot twist, etc."
                  />
                )}
              </div>
            </div>
          )}

          {/* Metadata Tab */}
          {activeTab === 'meta' && (
            <div className="space-y-6">
              <InputField
                label="Portrait URL"
                field="portrait_url"
                placeholder="https://example.com/character-portrait.jpg"
              />
              
              <InputField
                label="Color Theme"
                field="color_theme"
                placeholder="#3B82F6"
              />
              
              <InputField
                label="Meta Description"
                field="meta_description"
                type="textarea"
                placeholder="SEO description for this character page"
                rows={3}
              />
              
              <ArrayInputField
                label="Meta Keywords"
                field="meta_keywords"
                placeholder="SEO keywords for this character"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : character ? 'Update Character' : 'Create Character'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterForm;