#!/usr/bin/env node
import { ingestMultiple } from '../src/lib/ingest';

// Example data - replace with your actual content
const sampleData = [
  {
    kind: 'character' as const,
    title: 'Asha Vardaan',
    slug: 'asha-vardaan',
    text: `Asha Vardaan is the protagonist of the Zoroastervers series. Born in the ancient city of Persepolis, she possesses the rare ability to communicate with the divine flames of Ahura Mazda. Her journey begins when she discovers her heritage as a descendant of the legendary Fereydun.

    Throughout the first book, Asha struggles with her newfound powers while navigating the complex political landscape of the Persian Empire. Her character arc focuses on accepting responsibility and learning to balance her human desires with her divine destiny.

    Key relationships include her mentor Cyrus the Wise, her childhood friend Darius, and her complex relationship with the antagonist Ahriman's champion. Her weapon of choice is the sacred Akinaka sword passed down through her family line.`,
    metadata: {
      faction: 'Light Bearers',
      powers: ['Divine Flame', 'Prophecy'],
      location: 'Persepolis',
      book_appearances: ['Book 1', 'Book 2']
    }
  },
  {
    kind: 'lore' as const,
    title: 'The Divine Flames of Ahura Mazda',
    slug: 'divine-flames',
    text: `The Divine Flames represent the purest form of Ahura Mazda's power in the physical world. These eternal fires burn in sacred temples across the Persian Empire and serve as conduits between the mortal realm and the divine.

    There are three primary types of flames: Atar-Bahram (the Victorious Fire), Atar-Gushnasp (the Royal Fire), and Atar-Farnbag (the Priestly Fire). Each flame has specific properties and can only be tended by those with the appropriate spiritual training.

    The flames are said to have been kindled at the dawn of creation and will burn until the final renovation of the world. They serve as both sources of divine power and tests of worthiness for those who would serve the light.`,
    metadata: {
      category: 'Religious Lore',
      related_characters: ['Asha Vardaan', 'Cyrus the Wise'],
      importance: 'High'
    }
  }
];

async function main() {
  try {
    console.log('🚀 Starting data ingestion...');
    await ingestMultiple(sampleData);
    console.log('✅ Ingestion complete!');
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
    process.exit(1);
  }
}

main();
