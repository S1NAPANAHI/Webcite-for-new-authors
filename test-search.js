// Load environment variables
require('dotenv').config({ path: '.env.local' });

const fetch = require('node-fetch');

async function testSearch() {
  const response = await fetch('http://localhost:3000/api/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: 'Tell me about Zoroaster',
      topK: 3,
      minSimilarity: 0.2
    })
  });

  if (!response.ok) {
    console.error('Error:', response.status, response.statusText);
    const errorText = await response.text();
    console.error('Error details:', errorText);
    return;
  }

  const data = await response.json();
  console.log('Search results:', JSON.stringify(data, null, 2));
}

testSearch().catch(console.error);
