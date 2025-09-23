import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  Shield,
  Search,
  Image as ImageIcon,
  Upload,
  FolderOpen,
  Filter,
  Check
} from 'lucide-react';
import { Character, CharacterType, CharacterStatus, PowerLevel } from '../../../types/character';
import {
  CHARACTER_TYPE_CONFIG,
  CHARACTER_STATUS_CONFIG,
  POWER_LEVEL_CONFIG,
  generateCharacterSlug
} from '../../../utils/characterUtils';
import { supabase } from '@zoroaster/shared';

/* 
🎯 CHARACTER FORM WITH CORRECTED MEDIA PICKER v4.0 - Sep 24, 2025
- Fixed database schema mismatch (storage_path vs path)
- Corrected URL generation for Supabase storage
- Matches your existing files table structure
*/

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
  portrait_file_id?: string;
  color_theme: string;
}

// 🗄️ CORRECTED FILE RECORD INTERFACE - Matches your schema!
interface FileRecord {
  id: string;
  name: string;
  original_name: string;
  type: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  alt_text?: string;
  folder: string;
  storage_path: string; // ✅ This is the correct field name!
  url?: string;
  created_at: string;
}

const FOLDERS = ['backgrounds', 'characters', 'banners', 'covers', 'heroes', 'misc'] as const;

const normalizeSlug = (slug: string): string => {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// 🔧 CORRECTED FILE URL GENERATOR - Uses storage_path!
const getFileUrl = (file: FileRecord): string | null => {
  try {
    // Check if file has URL already
    if (file.url) {
      return file.url;
    }
    
    // Check if file has required data (using storage_path instead of path)
    if (!file || !file.storage_path) {
      console.warn('⚠️ File missing storage_path:', file);
      return null;
    }
    
    // Generate public URL using Supabase storage (media bucket)
    const { data } = supabase.storage.from('media').getPublicUrl(file.storage_path);
    return data.publicUrl;
  } catch (error) {
    console.error('❌ Error generating file URL:', error, file);
    return null;
  }
};

// 🖼️ CORRECTED MEDIA PICKER COMPONENT
const InlineMediaPicker: React.FC<{
  selectedFileId?: string;
  onSelect: (fileId: string, fileUrl: string) => void;
  onClear: () => void;
}> = ({ selectedFileId, onSelect, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState<'all' | typeof FOLDERS[number]>('characters');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string>('');

  // Load selected file info
  useEffect(() => {
    if (selectedFileId) {
      loadSelectedFile(selectedFileId);
    }
  }, [selectedFileId]);

  const loadSelectedFile = async (fileId: string) => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .single();

      if (error) throw error;
      if (data) {
        setSelectedFile(data);
        const url = getFileUrl(data);
        if (url) {
          setSelectedUrl(url);
          console.log('🖼️ LOADED SELECTED FILE:', data.name, url);
        }
      }
    } catch (err) {
      console.error('Error loading selected file:', err);
    }
  };

  const loadFiles = useCallback(async () => {
    if (!isOpen) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [MediaPicker] Fetching files from database...');

      // ✅ CORRECTED QUERY: Uses proper field names and includes images only
      let query = supabase
        .from('files')
        .select('*')
        .in('type', ['images', 'image']) // Support both 'images' and 'image' types
        .not('storage_path', 'is', null) // ✅ Using storage_path instead of path
        .order('created_at', { ascending: false });

      // Apply folder filter
      if (folderFilter !== 'all') {
        query = query.eq('folder', folderFilter);
      }

      const { data, error: queryError } = await query;
      if (queryError) {
        console.error('❌ Database query error:', queryError);
        throw queryError;
      }

      console.log('📊 [MediaPicker] Raw files from DB:', data?.length, data);

      // ✅ Filter for valid files with storage_path
      const validFiles = (data || []).filter(file => {
        const isValid = file && file.storage_path && file.name;
        if (!isValid) {
          console.warn('⚠️ Skipping invalid file:', file);
        }
        return isValid;
      });

      console.log('🎯 [MediaPicker] Valid files after filtering:', validFiles.length);
      setFiles(validFiles);
      
      if (validFiles.length === 0) {
        const message = data && data.length > 0 
          ? `Found ${data.length} files but none have valid storage paths` 
          : folderFilter === 'all' 
            ? 'No image files found in the database' 
            : `No images found in the '${folderFilter}' folder`;
        setError(message);
      }
    } catch (err: any) {
      console.error('❌ Error loading files:', err);
      setError('Database error: ' + (err.message || err.toString()));
    } finally {
      setLoading(false);
    }
  }, [isOpen, folderFilter]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const filteredFiles = files.filter(file => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      file.name?.toLowerCase().includes(searchLower) ||
      file.original_name?.toLowerCase().includes(searchLower) ||
      file.alt_text?.toLowerCase().includes(searchLower)
    );
  });

  const handleFileSelect = (file: FileRecord) => {
    const url = getFileUrl(file);
    if (!url) {
      console.error('❌ Cannot generate URL for file:', file);
      setError('Cannot generate URL for selected file');
      return;
    }
    
    console.log('🖼️ FILE SELECTED:', file.name, url);
    onSelect(file.id, url);
    setSelectedFile(file);
    setSelectedUrl(url);
    setIsOpen(false);
  };

  const handleClear = () => {
    console.log('🗑️ CLEARING SELECTION');
    onClear();
    setSelectedFile(null);
    setSelectedUrl('');
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / 1024 / 1024;
    return mb < 1 
      ? `${Math.round(bytes / 1024)} KB`
      : `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      {/* Selected File Preview */}
      {selectedFile && selectedUrl ? (
        <div className="space-y-3">
          <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
            <img 
              src={selectedUrl} 
              alt={selectedFile.alt_text || selectedFile.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                console.error('❌ Failed to load image:', selectedUrl);
                setError('Failed to load selected image');
              }}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <a
                href={selectedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="View full size"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={handleClear}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="font-medium">{selectedFile.name}</div>
            <div className="flex items-center gap-4 text-xs">
              <span>{formatFileSize(selectedFile.size)}</span>
              {selectedFile.width && selectedFile.height && (
                <span>{selectedFile.width} × {selectedFile.height}px</span>
              )}
              <span className="capitalize">{selectedFile.folder}</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Change Portrait
          </button>
        </div>
      ) : (
        /* Select Image Button */
        <button
          type="button"
          onClick={() => {
            console.log('🎯 OPENING MEDIA PICKER MODAL');
            setIsOpen(true);
          }}
          className="w-full h-48 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
        >
          <ImageIcon className="w-8 h-8" />
          <span className="font-medium">Select Character Portrait</span>
          <span className="text-sm">Choose from your media library</span>
        </button>
      )}

      {/* Media Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] mx-4 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Select Character Portrait
              </h2>
              <button
                type="button"
                onClick={() => {
                  console.log('❌ CLOSING MEDIA PICKER MODAL');
                  setIsOpen(false);
                }}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-6 border-b border-border">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={folderFilter}
                    onChange={e => {
                      console.log('📂 FOLDER FILTER CHANGED:', e.target.value);
                      setFolderFilter(e.target.value as any);
                    }}
                    className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
                  >
                    <option value="all">All Folders</option>
                    {FOLDERS.map(f => (
                      <option key={f} value={f}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
                  />
                </div>

                <div className="text-sm text-muted-foreground flex items-center">
                  {filteredFiles.length} image{filteredFiles.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3 text-muted-foreground">Loading images...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-700 dark:text-red-300">Database Issue</span>
                  </div>
                  <p className="text-red-700 dark:text-red-300 text-sm mb-3">{error}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setError(null);
                        loadFiles();
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Retry
                    </button>
                    <button 
                      onClick={() => setFolderFilter('all')}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Try All Folders
                    </button>
                  </div>
                </div>
              )}

              {/* No Images State */}
              {!loading && !error && filteredFiles.length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground text-lg mb-2">No images found</p>
                  <p className="text-muted-foreground text-sm mb-4">
                    {files.length === 0 
                      ? 'No image files found in the database. Upload some images first!' 
                      : `No images match your search in the '${folderFilter}' folder`
                    }
                  </p>
                  <a
                    href="/admin/content/files"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Open File Manager
                  </a>
                </div>
              )}

              {/* Images Grid */}
              {!loading && !error && filteredFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFiles.map(file => {
                    const fileUrl = getFileUrl(file);
                    const isSelected = selectedFileId === file.id;
                    
                    // Skip files that can't generate URLs
                    if (!fileUrl) {
                      console.warn('⚠️ Skipping file with invalid URL:', file.name);
                      return null;
                    }
                    
                    return (
                      <div
                        key={file.id}
                        className={`relative group cursor-pointer bg-card rounded-lg border-2 transition-all hover:shadow-md ${
                          isSelected 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleFileSelect(file)}
                      >
                        {/* Image Preview */}
                        <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                          <img
                            src={fileUrl}
                            alt={file.alt_text || file.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                            onError={(e) => {
                              console.error('❌ Failed to load image:', fileUrl, file);
                              // Hide broken images but don't set global error
                              (e.target as HTMLImageElement).style.opacity = '0.5';
                            }}
                          />
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md">
                            <Check className="w-4 h-4" />
                          </div>
                        )}

                        {/* File Info */}
                        <div className="p-3">
                          <div className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <span>{formatFileSize(file.size)}</span>
                            {file.width && file.height && (
                              <span>{file.width}×{file.height}</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground capitalize mt-1">
                            📁 {file.folder || 'misc'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Found {files.length} total files • Showing {filteredFiles.length}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CharacterForm: React.FC<CharacterFormProps> = ({
  character,
  onSave,
  onCancel,
  className = ''
}) => {
  console.log('🎨 CHARACTER FORM v4.0: Fixed schema mismatch - Build:', new Date().toISOString());
  
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
      portrait_file_id: (character as any)?.portrait_file_id || '',
      color_theme: character?.color_theme || CHARACTER_TYPE_CONFIG.minor.color
    };
    
    console.log('🔥 NUCLEAR INIT: Form initialized with portrait data:', {
      portrait_file_id: initialData.portrait_file_id,
      portrait_url: initialData.portrait_url
    });
    return initialData;
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'personality' | 'story' | 'meta'>('basic');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(!!character?.slug);
  const [slugNormalized, setSlugNormalized] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const slugInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const updateField = useCallback((field: keyof CharacterFormData, value: any) => {
    console.log(`🔥 NUCLEAR UPDATE: ${field} = "${value}"`);
    
    setFormData(current => ({
      ...current,
      [field]: value
    }));
    
    setHasUnsavedChanges(true);
    
    if (errors[field]) {
      setErrors(current => {
        const { [field]: _, ...rest } = current;
        return rest;
      });
    }
  }, [errors]);

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

  const handleArrayField = useCallback((field: keyof CharacterFormData, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    updateField(field, array);
  }, [updateField]);

  const handleNameChange = useCallback((value: string) => {
    updateField('name', value);
    
    if (!isSlugManual && value) {
      const newSlug = generateCharacterSlug(value);
      updateField('slug', normalizeSlug(newSlug));
    }
  }, [updateField, isSlugManual]);

  const handleCharacterTypeChange = useCallback((value: string) => {
    updateField('character_type', value);
    updateField('color_theme', CHARACTER_TYPE_CONFIG[value as CharacterType].color);
  }, [updateField]);

  const handlePortraitSelect = useCallback((fileId: string, fileUrl: string) => {
    console.log(`🖼️ PORTRAIT SELECTED: File ID = ${fileId}, URL = ${fileUrl}`);
    updateField('portrait_file_id', fileId);
    updateField('portrait_url', fileUrl);
  }, [updateField]);

  const handlePortraitClear = useCallback(() => {
    console.log('🗑️ PORTRAIT CLEARED');
    updateField('portrait_file_id', '');
    updateField('portrait_url', '');
  }, [updateField]);

  const handleSave = useCallback(async () => {
    console.log('🔥 NUCLEAR SAVE: Starting manual save');
    
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
      
      console.log('🎨 SAVING CHARACTER WITH PORTRAIT:', {
        portrait_file_id: characterData.portrait_file_id,
        portrait_url: characterData.portrait_url
      });
      
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
      
      console.log('🔥 NUCLEAR SAVE: Success with portrait data');
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
                onClick={() => {
                  console.log(`🎯 TAB CHANGE: Switching to ${tab.id}`);
                  if (tab.id === 'meta') {
                    console.log('🎨 SWITCHING TO METADATA TAB - MediaPicker should appear!');
                  }
                  setActiveTab(tab.id as any);
                }}
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
            </div>
          )}

          {/* Personality Tab */}
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
            </div>
          )}

          {/* Story Tab */}
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
            </div>
          )}

          {/* 🖼️ FIXED METADATA TAB */}
          {activeTab === 'meta' && (
            <div className="space-y-6">
              {console.log('🎨 RENDERING METADATA TAB v4.0 - Fixed schema')}
              
              {/* Character Portrait with Fixed MediaPicker */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  🖼️ Character Portrait
                </label>
                <div className="bg-muted/20 p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-4">
                    🎯 Now using correct database schema (storage_path). Should show your {'{'}4 images{'}'} from File Manager!
                  </p>
                  
                  <InlineMediaPicker 
                    selectedFileId={formData.portrait_file_id}
                    onSelect={handlePortraitSelect}
                    onClear={handlePortraitClear}
                  />
                </div>
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