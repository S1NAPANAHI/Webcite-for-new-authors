import React, { useState, useRef, useCallback } from 'react';
import {
  Save,
  X,
  User,
  Crown,
  Eye,
  Star,
  BookOpen,
  Heart,
  AlertTriangle,
  Copy,
  ExternalLink,
  RefreshCw,
  Shield
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
  name: string;
  slug: string;
  title: string;
  aliases: string[];
  description: string;
  character_type: CharacterType;
  status: CharacterStatus;
  power_level: PowerLevel;
  importance_score: number;
  age?: number;
  age_description: string;
  gender: string;
  species: string;
  occupation: string;
  location: string;
  origin: string;
  height: string;
  build: string;
  hair_color: string;
  eye_color: string;
  distinguishing_features: string;
  personality_traits: string[];
  background_summary: string;
  motivations: string[];
  fears: string[];
  goals: string[];
  skills: string[];
  weaknesses: string[];
  character_arc_summary: string;
  primary_faction: string;
  allegiances: string[];
  is_major_character: boolean;
  is_pov_character: boolean;
  is_spoiler_sensitive: boolean;
  spoiler_tags: string[];
  meta_description: string;
  meta_keywords: string[];
  portrait_url: string;
  color_theme: string;
}

const normalizeSlug = (slug: string): string => {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onSave,
  onCancel,
  className = ''
}) => {
  // 🔥 NUCLEAR APPROACH: Initialize state once and NEVER change the structure
  const [formData, setFormData] = useState<CharacterFormData>(() => {
    const initialData = {
      name: character?.name || '',
      slug: character?.slug || '',
      title: character?.title || '',
      aliases: character?.aliases || [],
      description: character?.description || '',
      character_type: (character?.character_type as CharacterType) || 'minor',
      status: (character?.status as CharacterStatus) || 'alive',
      power_level: (character?.power_level as PowerLevel) || 'mortal',
      importance_score: character?.importance_score || 50,
      age: character?.age,
      age_description: character?.age_description || '',
      gender: character?.gender || '',
      species: character?.species || 'Human',
      occupation: character?.occupation || '',
      location: character?.location || '',
      origin: character?.origin || '',
      height: character?.height || '',
      build: character?.build || '',
      hair_color: character?.hair_color || '',
      eye_color: character?.eye_color || '',
      distinguishing_features: character?.distinguishing_features || '',
      personality_traits: character?.personality_traits || [],
      background_summary: character?.background_summary || '',
      motivations: character?.motivations || [],
      fears: character?.fears || [],
      goals: character?.goals || [],
      skills: character?.skills || [],
      weaknesses: character?.weaknesses || [],
      character_arc_summary: character?.character_arc_summary || '',
      primary_faction: character?.primary_faction || '',
      allegiances: character?.allegiances || [],
      is_major_character: character?.is_major_character || false,
      is_pov_character: character?.is_pov_character || false,
      is_spoiler_sensitive: character?.is_spoiler_sensitive || false,
      spoiler_tags: character?.spoiler_tags || [],
      meta_description: character?.meta_description || '',
      meta_keywords: character?.meta_keywords || [],
      portrait_url: character?.portrait_url || '',
      color_theme: character?.color_theme || CHARACTER_TYPE_CONFIG.minor.color
    };
    
    console.log('🔥 NUCLEAR INIT: Form initialized with data:', initialData);
    return initialData;
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'personality' | 'story' | 'meta'>('basic');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(!!character?.slug);
  const [slugNormalized, setSlugNormalized] = useState(false);

  // 🔥 NUCLEAR: Static refs that NEVER change
  const nameInputRef = useRef<HTMLInputElement>(null);
  const slugInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  // 🔥 NUCLEAR: Direct state update function that does NOTHING else
  const updateField = useCallback((field: keyof CharacterFormData, value: any) => {
    console.log(`🔥 NUCLEAR UPDATE: ${field} = "${value}"`);
    
    setFormData(current => ({
      ...current,
      [field]: value
    }));
    
    setHasUnsavedChanges(true);
    
    // Clear errors
    if (errors[field]) {
      setErrors(current => {
        const { [field]: _, ...rest } = current;
        return rest;
      });
    }
  }, [errors]);

  // 🔥 NUCLEAR: Handle slug changes
  const handleSlugChange = useCallback((value: string) => {
    updateField('slug', value);
    setIsSlugManual(true);
    setSlugNormalized(false);
  }, [updateField]);

  const handleSlugBlur = useCallback(() => {
    const normalized = normalizeSlug(formData.slug);
    if (normalized !== formData.slug) {
      updateField('slug', normalized);
      setSlugNormalized(true);
      setTimeout(() => setSlugNormalized(false), 2000);
    }
  }, [formData.slug, updateField]);

  const handleRegenerateSlug = useCallback(() => {
    if (formData.name) {
      const newSlug = generateCharacterSlug(formData.name);
      updateField('slug', normalizeSlug(newSlug));
      setIsSlugManual(false);
    }
  }, [formData.name, updateField]);

  // 🔥 NUCLEAR: Array field handler
  const handleArrayField = useCallback((field: keyof CharacterFormData, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updateField(field, array);
  }, [updateField]);

  // 🔥 NUCLEAR: Auto-generate slug from name (but without useEffect)
  const handleNameChange = useCallback((value: string) => {
    updateField('name', value);
    
    // Auto-generate slug if not manually set
    if (!isSlugManual && value) {
      const newSlug = generateCharacterSlug(value);
      updateField('slug', normalizeSlug(newSlug));
    }
  }, [updateField, isSlugManual]);

  // Character type change handler
  const handleCharacterTypeChange = useCallback((value: string) => {
    updateField('character_type', value);
    updateField('color_theme', CHARACTER_TYPE_CONFIG[value as CharacterType].color);
  }, [updateField]);

  // 🔥 NUCLEAR: Manual save function - ONLY way to save
  const handleSave = useCallback(async () => {
    console.log('🔥 NUCLEAR SAVE: Starting manual save');
    
    // Validate
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
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const finalSlug = normalizeSlug(formData.slug);
      
      // Check slug uniqueness
      const { data: existingChar } = await supabase
        .from('characters')
        .select('id')
        .eq('slug', finalSlug)
        .neq('id', character?.id || '');
      
      if (existingChar && existingChar.length > 0) {
        setErrors({ slug: 'This slug is already taken' });
        setLoading(false);
        return;
      }
      
      const characterData = {
        ...formData,
        slug: finalSlug,
        age: formData.age || null,
        meta_description: formData.meta_description || formData.description.substring(0, 160)
      };
      
      let result;
      
      if (character) {
        const { data, error } = await supabase
          .from('characters')
          .update(characterData)
          .eq('id', character.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('characters')
          .insert([characterData])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      console.log('🔥 NUCLEAR SAVE: Success');
      setHasUnsavedChanges(false);
      onSave(result);
      
    } catch (error: any) {
      console.error('🔥 NUCLEAR SAVE: Failed', error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  }, [formData, character, onSave]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  }, [handleSave]);

  const copySlugToClipboard = useCallback(async () => {
    if (formData.slug) {
      const url = `https://www.zoroastervers.com/characters/${formData.slug}`;
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }, [formData.slug]);

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <User className="w-4 h-4" /> },
    { id: 'details', label: 'Details', icon: <Eye className="w-4 h-4" /> },
    { id: 'personality', label: 'Personality', icon: <Heart className="w-4 h-4" /> },
    { id: 'story', label: 'Story', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'meta', label: 'Metadata', icon: <Star className="w-4 h-4" /> }
  ];

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
        
        <div className="flex items-center space-x-4">
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 text-sm text-yellow-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Unsaved changes</span>
            </div>
          )}
          
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !hasUnsavedChanges}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Saving...' : 'Save Now'}
          </button>
          
          <button
            onClick={onCancel}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
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
                {/* 🔥 NUCLEAR: Static input components */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Character Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      console.log(`🔥 NUCLEAR: NAME = "${e.target.value}"`);
                      handleNameChange(e.target.value);
                    }}
                    placeholder="Enter character name"
                    className={`w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                      errors.name ? 'border-red-500' : 'border-border'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                
                {/* Slug Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Slug <span className="text-red-500">*</span>
                    <span className="text-xs text-muted-foreground ml-2">(URL-friendly version)</span>
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        ref={slugInputRef}
                        type="text"
                        value={formData.slug}
                        onChange={(e) => {
                          console.log(`🔥 NUCLEAR: SLUG = "${e.target.value}"`);
                          handleSlugChange(e.target.value);
                        }}
                        onBlur={handleSlugBlur}
                        placeholder="character-slug"
                        className={`flex-1 px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                          errors.slug ? 'border-red-500' : slugNormalized ? 'border-green-500' : 'border-border'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleRegenerateSlug}
                        className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      {formData.slug && (
                        <button
                          type="button"
                          onClick={copySlugToClipboard}
                          className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {slugNormalized && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                        <Shield className="w-4 h-4" />
                        <span>Slug automatically cleaned</span>
                      </div>
                    )}
                    
                    {formData.slug && (
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm text-muted-foreground">
                        <ExternalLink className="w-4 h-4" />
                        <span className="font-mono">https://www.zoroastervers.com/characters/{formData.slug}</span>
                      </div>
                    )}
                    
                    {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title/Nickname</label>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      console.log(`🔥 NUCLEAR: TITLE = "${e.target.value}"`);
                      updateField('title', e.target.value);
                    }}
                    placeholder="e.g., The Prophet, The Dark Lord"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Aliases</label>
                  <input
                    type="text"
                    value={formData.aliases.join(', ')}
                    onChange={(e) => {
                      console.log(`🔥 NUCLEAR: ALIASES = "${e.target.value}"`);
                      handleArrayField('aliases', e.target.value);
                    }}
                    placeholder="Alternative names, separated by commas"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Separate multiple items with commas</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  ref={descriptionInputRef}
                  value={formData.description}
                  onChange={(e) => {
                    console.log(`🔥 NUCLEAR: DESCRIPTION = "${e.target.value}"`);
                    updateField('description', e.target.value);
                  }}
                  placeholder="Describe the character's role and significance in your story"
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 ${
                    errors.description ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Character Type</label>
                  <select
                    value={formData.character_type}
                    onChange={(e) => {
                      console.log(`🔥 NUCLEAR: CHARACTER_TYPE = "${e.target.value}"`);
                      handleCharacterTypeChange(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  >
                    {Object.entries(CHARACTER_TYPE_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      console.log(`🔥 NUCLEAR: STATUS = "${e.target.value}"`);
                      updateField('status', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  >
                    {Object.entries(CHARACTER_STATUS_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Power Level</label>
                  <select
                    value={formData.power_level}
                    onChange={(e) => {
                      console.log(`🔥 NUCLEAR: POWER_LEVEL = "${e.target.value}"`);
                      updateField('power_level', e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  >
                    {Object.entries(POWER_LEVEL_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Importance Score (0-100)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.importance_score}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      console.log(`🔥 NUCLEAR: IMPORTANCE = ${value}`);
                      updateField('importance_score', value);
                    }}
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
                      onChange={(e) => {
                        console.log(`🔥 NUCLEAR: IS_MAJOR = ${e.target.checked}`);
                        updateField('is_major_character', e.target.checked);
                      }}
                      className="rounded border-border focus:ring-primary/20 text-primary"
                    />
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-foreground">Major Character</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_pov_character}
                      onChange={(e) => {
                        console.log(`🔥 NUCLEAR: IS_POV = ${e.target.checked}`);
                        updateField('is_pov_character', e.target.checked);
                      }}
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
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      console.log(`🔥 NUCLEAR: AGE = ${value}`);
                      updateField('age', value);
                    }}
                    placeholder="25"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Age Description</label>
                  <input
                    type="text"
                    value={formData.age_description}
                    onChange={(e) => updateField('age_description', e.target.value)}
                    placeholder="e.g., Ancient, Young Adult"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                  <input
                    type="text"
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    placeholder="Male, Female, Non-binary, etc."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Species</label>
                  <input
                    type="text"
                    value={formData.species}
                    onChange={(e) => updateField('species', e.target.value)}
                    placeholder="Human, Elf, Dragon, etc."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Occupation</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => updateField('occupation', e.target.value)}
                    placeholder="Prophet, King, Warrior, etc."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Current Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="Where they currently reside"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => updateField('origin', e.target.value)}
                    placeholder="Where they're from originally"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Height</label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => updateField('height', e.target.value)}
                    placeholder="6 feet 2 inches, Tall, etc."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Build</label>
                  <input
                    type="text"
                    value={formData.build}
                    onChange={(e) => updateField('build', e.target.value)}
                    placeholder="Athletic, Slender, etc."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Hair Color</label>
                  <input
                    type="text"
                    value={formData.hair_color}
                    onChange={(e) => updateField('hair_color', e.target.value)}
                    placeholder="Brown, Silver, Black, etc."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Eye Color</label>
                  <input
                    type="text"
                    value={formData.eye_color}
                    onChange={(e) => updateField('eye_color', e.target.value)}
                    placeholder="Blue, Brown, Green, etc."
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Distinguishing Features</label>
                <textarea
                  value={formData.distinguishing_features}
                  onChange={(e) => updateField('distinguishing_features', e.target.value)}
                  placeholder="Scars, birthmarks, unique characteristics..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                />
              </div>
            </div>
          )}

          {/* Other tabs would go here with similar static structure */}
          {activeTab === 'personality' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Personality Traits</label>
                <input
                  type="text"
                  value={formData.personality_traits.join(', ')}
                  onChange={(e) => handleArrayField('personality_traits', e.target.value)}
                  placeholder="Wise, Brave, Cunning, Compassionate"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                />
                <p className="mt-1 text-xs text-muted-foreground">Separate multiple items with commas</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Background Summary</label>
                <textarea
                  value={formData.background_summary}
                  onChange={(e) => updateField('background_summary', e.target.value)}
                  placeholder="Character's backstory and history..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Motivations</label>
                  <input
                    type="text"
                    value={formData.motivations.join(', ')}
                    onChange={(e) => handleArrayField('motivations', e.target.value)}
                    placeholder="What drives this character"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Separate multiple items with commas</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Fears</label>
                  <input
                    type="text"
                    value={formData.fears.join(', ')}
                    onChange={(e) => handleArrayField('fears', e.target.value)}
                    placeholder="What they're afraid of"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Separate multiple items with commas</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Character Arc Summary</label>
                <textarea
                  value={formData.character_arc_summary}
                  onChange={(e) => updateField('character_arc_summary', e.target.value)}
                  placeholder="How this character evolves throughout the story..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                />
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_spoiler_sensitive}
                    onChange={(e) => updateField('is_spoiler_sensitive', e.target.checked)}
                    className="rounded border-border focus:ring-primary/20 text-primary"
                  />
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-foreground">Contains Spoilers</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Portrait URL</label>
                <input
                  type="text"
                  value={formData.portrait_url}
                  onChange={(e) => updateField('portrait_url', e.target.value)}
                  placeholder="https://example.com/character-portrait.jpg"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => updateField('meta_description', e.target.value)}
                  placeholder="SEO description for this character page"
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                />
              </div>
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