const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initLearnPage() {
  try {
    console.log('Initializing Learn Page sections...');
    
    // Define the sections we want to create
    const sections = [
      {
        section_type: 'authors_journey',
        title: "Author's Journey",
        description: 'Resources and guidance for authors at every stage of their writing journey.'
      },
      {
        section_type: 'educational_resources',
        title: 'Educational Resources',
        description: 'Learning materials and resources to improve your writing and publishing skills.'
      },
      {
        section_type: 'professional_services',
        title: 'Professional Services',
        description: 'Professional services to help you succeed in your writing career.'
      }
    ];

    // Insert sections if they don't exist
    const { data: existingSections, error: fetchError } = await supabase
      .from('learn_sections')
      .select('section_type');

    if (fetchError) {
      throw fetchError;
    }

    const existingSectionTypes = existingSections?.map(s => s.section_type) || [];
    const sectionsToInsert = sections.filter(s => !existingSectionTypes.includes(s.section_type));

    if (sectionsToInsert.length > 0) {
      const { data: insertedSections, error: insertError } = await supabase
        .from('learn_sections')
        .insert(sectionsToInsert)
        .select();

      if (insertError) {
        throw insertError;
      }

      console.log(`Added ${insertedSections?.length || 0} new sections:`);
      insertedSections?.forEach(section => {
        console.log(`- ${section.title} (${section.section_type})`);
      });
    } else {
      console.log('All sections already exist in the database.');
    }

    console.log('\nLearn Page initialization complete!');
  } catch (error) {
    console.error('Error initializing Learn Page:', error);
    process.exit(1);
  }
}

initLearnPage();
