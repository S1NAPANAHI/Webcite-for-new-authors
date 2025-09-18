import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role for admin operations
);

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY! 
});

interface IngestOptions {
  kind: 'character' | 'lore' | 'book' | 'location' | 'timeline';
  title: string;
  slug?: string;
  text: string;
  description?: string;
  metadata?: Record<string, any>;
  isPublic?: boolean;
}

// Smart text chunker that preserves context
function chunkText(text: string, maxChars = 1500, overlap = 200): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      
      // Add overlap by keeping last part of current chunk
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 10)); // Rough word estimate
      currentChunk = overlapWords.join(' ') + ' ' + sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.filter(chunk => chunk.length > 50); // Remove tiny chunks
}

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });
    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Embedding generation failed:', error);
    throw error;
  }
}

export async function ingestContent(options: IngestOptions): Promise<void> {
  const { kind, title, slug, text, description, metadata = {}, isPublic = true } = options;
  
  try {
    console.log(`Starting ingestion for ${kind}: ${title}`);
    
    // 1. Upsert source record
    const { data: source, error: sourceError } = await supabase
      .from('sources')
      .upsert({
        kind,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        extra: metadata,
        is_public: isPublic,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'slug',
        ignoreDuplicates: false 
      })
      .select('id')
      .single();

    if (sourceError) throw sourceError;
    const sourceId = source.id;

    // 2. Delete existing chunks for this source (for updates)
    await supabase
      .from('knowledge_chunks')
      .delete()
      .eq('source_id', sourceId);

    // 3. Create text chunks
    const chunks = chunkText(text);
    console.log(`Created ${chunks.length} chunks`);

    // 4. Generate embeddings in batches
    const batchSize = 20;
    const allEmbeddings: number[][] = [];
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const embeddings = await generateEmbeddings(batch);
      allEmbeddings.push(...embeddings);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 5. Insert chunks with embeddings
    const chunkRecords = chunks.map((content, index) => ({
      source_id: sourceId,
      content,
      metadata: {
        ...metadata,
        chunk_index: index,
        kind,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        chunk_length: content.length
      },
      embedding: allEmbeddings[index]
    }));

    const { error: insertError } = await supabase
      .from('knowledge_chunks')
      .insert(chunkRecords);

    if (insertError) throw insertError;

    console.log(`✅ Successfully ingested ${chunks.length} chunks for ${title}`);
    
  } catch (error) {
    console.error(`❌ Ingestion failed for ${title}:`, error);
    throw error;
  }
}

// Batch ingestion helper
export async function ingestMultiple(contents: IngestOptions[]): Promise<void> {
  for (const content of contents) {
    try {
      await ingestContent(content);
      // Small delay between ingestions
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to ingest ${content.title}:`, error);
      // Continue with other items even if one fails
    }
  }
}
