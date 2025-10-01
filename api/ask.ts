import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Log environment variables for debugging (remove in production)
console.log('Environment variables loaded:', {
  hasOpenAIKey: !!process.env.VITE_OPENAI_API_KEY,
  hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
  hasSupabaseKey: !!process.env.VITE_SUPABASE_ANON_KEY
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({ 
  apiKey: process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY
});

if (!openai.apiKey) {
  console.error('Error: OpenAI API key is not set. Check your environment variables.');
  console.log('Available environment variables:', Object.keys(process.env).filter(k => k.includes('OPENAI') || k.includes('SUPABASE')));
  throw new Error('VITE_OPENAI_API_KEY is not set. Please add it to your environment variables.');
}

interface ChunkResult {
  id: string;
  content: string;
  metadata: any;
  similarity: number;
  source_title: string;
  source_kind: string;
}

function buildSystemPrompt(): string {
  return `You are an expert guide for the Zoroastervers a fantasy series inspired by Persian mythology and Zoroastrian beliefs. Your role is to provide accurate, engaging answers about the world, characters, and lore.

Guidelines:
- Use ONLY the provided context documents to answer questions
- If information isn't in the context, clearly state "I don't have information about that in my current knowledge"
- Reference specific documents when making claims, like [Doc 1] or [Doc 2, Doc 3]
- Maintain the rich, mythological tone of the series
- For character questions, focus on their roles, relationships, and development
- For lore questions, explain the significance and connections to other elements
- Be concise but comprehensive in your explanations`;
}

function buildUserPrompt(question: string, contexts: ChunkResult[]): string {
  const contextBlock = contexts
    .map((ctx, index) => {
      return `# Doc ${index + 1} (${ctx.source_kind}: ${ctx.source_title})
${ctx.content}
[Similarity: ${ctx.similarity.toFixed(3)}]`;
    })
    .join('\n\n---\n\n');

  return `Context Documents:
${contextBlock}

Question: ${question}

Please provide a comprehensive answer based on the context above.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end('Method Not Allowed');
    }

  try {
    const { 
      query, 
      topK = 8, 
      minSimilarity = 0.2, 
      kindFilter 
    } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json(
        { error: 'Query is required and must be a string' }
      );
    }

    // 1. Generate embedding for the user query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query.trim()
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. Search for similar chunks using RPC
    const { data: matches, error: searchError } = await supabase
      .rpc('match_chunks', {
        query_embedding: queryEmbedding as any,
        match_count: topK,
        min_similarity: minSimilarity,
        kind_filter: kindFilter || null
      });

    if (searchError) {
      console.error('Search error:', searchError);
      throw searchError;
    }

    const typedMatches = matches as ChunkResult[] || [];

    if (typedMatches.length === 0) {
      return res.status(200).json({
        answer: "I don't have information about that topic in my current knowledge base. Could you try rephrasing your question or asking about characters, lore, or locations from the Zoroastervers?",
        references: [],
        query: query
      });
    }

    // 3. Generate AI response using retrieved context
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(query, typedMatches);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 800
    });

    const answer = completion.choices[0]?.message?.content || 
      "I couldn't generate a response. Please try asking your question differently.";

    // 4. Format references for the UI
    const references = typedMatches.map((match, index) => ({
      docNumber: index + 1,
      title: match.source_title,
      kind: match.source_kind,
      similarity: match.similarity,
      excerpt: match.content.slice(0, 200) + (match.content.length > 200 ? '...' : '')
    }));

    return res.status(200).json({
      answer,
      references,
      query,
      totalMatches: typedMatches.length
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json(
      { error: 'An unexpected error occurred while processing your question.' }
    );
  }
}
