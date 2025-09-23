// Character quote system for dynamic quotes based on character type and power level

interface CharacterQuote {
  text: string;
  context?: string;
}

const ZOROASTRIAN_QUOTES: Record<string, CharacterQuote[]> = {
  // Divine/Cosmic characters
  'zoroaster-zarathustra': [
    { text: "Good thoughts, good words, good deeds - this is the path of righteousness.", context: "Core teaching" },
    { text: "Choose your side wisely, for in the end, truth shall prevail over falsehood.", context: "To his followers" },
    { text: "The light of Ahura Mazda illuminates all who seek wisdom.", context: "Vision" }
  ],
  'angra-mainyu': [
    { text: "Where there is light, I shall bring darkness. Where there is truth, I shall sow lies.", context: "Declaration of opposition" },
    { text: "I am the shadow that follows every good deed, the doubt that questions every truth.", context: "To mortals" },
    { text: "Destruction is the only constant in this world.", context: "Philosophy" }
  ],
  'spenta-armaiti': [
    { text: "Devotion is not blind faith, but the conscious choice to serve goodness.", context: "Teaching" },
    { text: "In every act of kindness, I am present. In every moment of compassion, I am there.", context: "To believers" },
    { text: "The earth itself is sacred, treat it with the reverence it deserves.", context: "Environmental wisdom" }
  ],
  'ahura-mazda': [
    { text: "I am the uncreated creator, the source of all that is good and true.", context: "Divine proclamation" },
    { text: "Choose wisely between good and evil, for choice is the greatest gift I have given you.", context: "To humanity" },
    { text: "In wisdom there is strength, in truth there is victory.", context: "Universal wisdom" }
  ],
  
  // Supporting divine beings
  'vohu-manah': [
    { text: "Good thoughts are the seeds from which righteous actions grow.", context: "Teaching" },
    { text: "Think well, speak well, act well - this is the threefold path.", context: "Guidance" }
  ],
  'asha-vahishta': [
    { text: "Truth is not what you wish to be real, but what is eternal and unchanging.", context: "Philosophy" },
    { text: "In the fire of truth, all falsehoods are burned away.", context: "Judgment" }
  ],
  'khshathra-vairya': [
    { text: "True sovereignty comes not from power over others, but from mastery of oneself.", context: "Leadership wisdom" },
    { text: "A righteous ruler serves their people as I serve the cosmic order.", context: "To kings" }
  ],
  
  // Mortal characters
  'king-vishtaspa': [
    { text: "A king who embraces truth becomes a beacon of light for his people.", context: "Royal declaration" },
    { text: "I have seen the wisdom of the prophet, and I choose to follow the path of righteousness.", context: "Conversion" },
    { text: "Let my kingdom be a reflection of the cosmic order - just, true, and good.", context: "Decree" }
  ],
  'jamasp': [
    { text: "Wisdom is not the accumulation of knowledge, but the understanding of truth.", context: "Teaching" },
    { text: "I have served the prophet faithfully, for his words carry the light of divine wisdom.", context: "Loyalty" },
    { text: "In counsel, speak truth. In action, choose righteousness.", context: "Advice" }
  ],
  'hvovi': [
    { text: "Behind every great prophet stands a devoted companion who believes in their mission.", context: "Support" },
    { text: "Love is the foundation of faith, and faith the foundation of truth.", context: "Personal reflection" },
    { text: "I have witnessed miracles, not of magic, but of transformation through divine truth.", context: "Testimony" }
  ]
};

// Fallback quotes by character type
const TYPE_FALLBACK_QUOTES: Record<string, CharacterQuote[]> = {
  protagonist: [
    { text: "Every journey begins with a single step toward truth." },
    { text: "In darkness, I shall be the light that guides others." },
    { text: "Righteousness is not a burden, but a privilege." }
  ],
  antagonist: [
    { text: "Order is an illusion. Chaos is the only truth." },
    { text: "Why choose light when darkness offers such sweet freedom?" },
    { text: "I am the necessary shadow that defines the light." }
  ],
  supporting: [
    { text: "Not all heroes wear crowns. Some simply choose to do what is right." },
    { text: "In service to a greater cause, I find my purpose." },
    { text: "Even the smallest light can push back the darkness." }
  ],
  mentor: [
    { text: "Wisdom is only valuable when it is shared with others." },
    { text: "A teacher's greatest victory is when the student surpasses them." },
    { text: "Knowledge without compassion is merely clever ignorance." }
  ],
  minor: [
    { text: "Every voice matters in the grand symphony of existence." },
    { text: "Small actions can have great consequences." },
    { text: "I may be humble, but my choices still echo in eternity." }
  ]
};

// Power level fallback quotes
const POWER_FALLBACK_QUOTES: Record<string, CharacterQuote[]> = {
  divine: [
    { text: "From the realm of light, I bring wisdom to the world." },
    { text: "Mortality cannot comprehend the full scope of divine purpose." },
    { text: "I am both eternal and ever-present, beyond time and space." }
  ],
  cosmic: [
    { text: "The universe itself bends to the will of cosmic order." },
    { text: "I have seen the birth and death of stars, yet truth remains constant." },
    { text: "What seems impossible to mortals is merely the natural order to us." }
  ],
  supernatural: [
    { text: "I walk between worlds, seeing truths hidden from mortal eyes." },
    { text: "Power without purpose is mere destruction." },
    { text: "The supernatural is simply natural on a grander scale." }
  ],
  enhanced: [
    { text: "With great power comes the responsibility to use it wisely." },
    { text: "I am more than mortal, but not yet divine." },
    { text: "Enhancement is meaningless without the wisdom to direct it." }
  ],
  mortal: [
    { text: "In mortality lies the greatest potential for both good and evil." },
    { text: "What I lack in power, I make up for in determination." },
    { text: "The mortal heart is capable of infinite courage." }
  ]
};

export const getCharacterQuote = (character: {
  slug: string;
  character_type: string;
  power_level: string;
  quote?: string;
}): string => {
  // If character already has a quote, use it
  if (character.quote) {
    return character.quote;
  }
  
  // Try to get a specific quote for this character
  const specificQuotes = ZOROASTRIAN_QUOTES[character.slug];
  if (specificQuotes && specificQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * specificQuotes.length);
    return specificQuotes[randomIndex].text;
  }
  
  // Fallback to type-based quotes
  const typeQuotes = TYPE_FALLBACK_QUOTES[character.character_type];
  if (typeQuotes && typeQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * typeQuotes.length);
    return typeQuotes[randomIndex].text;
  }
  
  // Fallback to power level quotes
  const powerQuotes = POWER_FALLBACK_QUOTES[character.power_level];
  if (powerQuotes && powerQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * powerQuotes.length);
    return powerQuotes[randomIndex].text;
  }
  
  // Ultimate fallback
  return "The path of truth is walked by those who dare to seek it.";
};

export const getAllQuotesForCharacter = (slug: string): CharacterQuote[] => {
  return ZOROASTRIAN_QUOTES[slug] || [];
};

export const getRandomQuoteByType = (type: string): string => {
  const quotes = TYPE_FALLBACK_QUOTES[type];
  if (quotes && quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex].text;
  }
  return "Wisdom comes to those who seek truth with an open heart.";
};

export const getRandomQuoteByPowerLevel = (powerLevel: string): string => {
  const quotes = POWER_FALLBACK_QUOTES[powerLevel];
  if (quotes && quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex].text;
  }
  return "Every being has a role to play in the cosmic balance.";
};