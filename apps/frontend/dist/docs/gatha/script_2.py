# Let me build the complete dataset more efficiently
# I'll create batches of both authentic and inspired entries

# Expand authentic entries with more from public domain sources
more_authentic = [
    # From Yasna 45
    {
        "text": "Then shall I recognize You as mighty, Mazda, when through good thinking You shall grant the blessings that the truthful and untruthful seek. (Yasna 45.8)",
        "tags": ["vohu-manah", "wisdom", "enlightenment", "justice"],
        "source": "yasna"
    },
    {
        "text": "I shall worship You with good thinking, O Mazda Ahura, so that You may teach me truth through Your spirit. (Yasna 45.6)",
        "tags": ["vohu-manah", "devotion", "asha", "spenta-mainyu"],
        "source": "yasna"
    },
    
    # From Yasna 47
    {
        "text": "Through the beneficent spirit, Mazda, give me strength for good thinking, that I may find the straight paths of life. (Yasna 47.2)",
        "tags": ["spenta-mainyu", "vohu-manah", "wisdom", "enlightenment"],
        "source": "yasna"
    },
    {
        "text": "Who, Mazda, is the faithful friend of Your spirit? Let him teach me the straight paths of good thinking and of truth. (Yasna 47.4)",
        "tags": ["friendship", "spenta-mainyu", "vohu-manah", "asha", "wisdom"],
        "source": "yasna"
    },
    
    # From Yasna 48
    {
        "text": "To You, the beneficent ones shall come for refuge, Mazda, not to the followers of falsehood. (Yasna 48.4)",
        "tags": ["spenta-mainyu", "devotion", "asha", "wisdom"],
        "source": "yasna"
    },
    {
        "text": "Those who seek to destroy my family and clan, Mazda, I put them in Your hands through good thinking and truth. (Yasna 48.8)",
        "tags": ["vohu-manah", "asha", "devotion", "justice"],
        "source": "yasna"
    },
    
    # From Yasna 49
    {
        "text": "I have realized You as beneficent, Mazda Ahura, when You came to me with good thinking and asked: 'Who are you willing to please?' (Yasna 49.3)",
        "tags": ["spenta-mainyu", "vohu-manah", "reflection", "choice"],
        "source": "yasna"
    },
    
    # From Yasna 50
    {
        "text": "I approach You, Mazda, with hands outstretched, with good thinking, with truth, hoping to please Your spirit with righteous actions. (Yasna 50.5)",
        "tags": ["devotion", "vohu-manah", "asha", "spenta-mainyu", "good-deeds"],
        "source": "yasna"
    },
    
    # From Yasna 51
    {
        "text": "This I ask You: tell me truly, Ahura—how shall I drive deceit far from us who seek to promote truth in the world? (Yasna 51.4)",
        "tags": ["asha", "wisdom", "action", "responsibility"],
        "source": "yasna"
    },
    {
        "text": "One chooses that rule of good thinking allied with truth in order to serve the beneficent spirit. (Yasna 51.18)",
        "tags": ["vohu-manah", "asha", "spenta-mainyu", "devotion", "action"],
        "source": "yasna"
    }
]

authentic_entries.extend(more_authentic)

# Now let me create a systematic approach to generate the remaining entries
def create_gathic_inspired_batch(themes, count=20):
    """Create a batch of Gathic-inspired entries based on themes"""
    entries = []
    
    # Fire/Conscience theme entries
    fire_entries = [
        "The sacred fire burns brightest in the heart that chooses truth over comfort. Let your conscience be the altar where right intention dwells.",
        "When shadows of doubt gather, kindle the inner flame of discernment. Fire purifies not by destroying, but by revealing what is true.",
        "Your conscience is the hearth of heaven—tend it with thoughts of justice, words of compassion, deeds of righteousness.",
        "Like fire transforms wood to light, let your choices transform the world from what it is to what it should be.",
        "The fire of wisdom burns without consuming. Feed it with honest reflection, and it will illumine your path forever."
    ]
    
    # Asha/Truth entries  
    truth_entries = [
        "Truth is not a destination but a way of walking. Each step in harmony with what is right brings the world closer to wholeness.",
        "The order of existence reveals itself to those who seek with sincere hearts. Look closely—truth hides in plain sight.",
        "Where truth blooms, falsehood cannot take root. Cultivate the garden of your life with seeds of honesty and integrity.",
        "Truth is the architect of happiness, the foundation of peace, the cornerstone of wisdom. Build your life upon this rock.",
        "Like a river finds its course, truth finds its way through every obstacle. Be the clear channel through which it flows."
    ]
    
    # Vohu Manah/Good Mind entries
    good_mind_entries = [
        "The good mind is a gift that grows with giving. Share your wisdom freely, and watch understanding multiply among all beings.",
        "When the mind is clear like mountain water, right decisions flow naturally. Still the turbulent thoughts and find your center.",
        "Good thinking is the bridge between knowing and acting. Cross it with courage, and find yourself in the land of fulfillment.",
        "The mind illuminated by truth sees possibilities where others see only problems. Think with hope, and hope becomes reality.",
        "Clear thinking leads to clear speaking, which leads to clear acting. Begin each day by clarifying your deepest intentions."
    ]
    
    # Spenta Mainyu/Beneficent Spirit entries
    beneficial_spirit_entries = [
        "The beneficent spirit manifests wherever love meets action. Be the hands and heart through which goodness enters the world.",
        "When you choose increase over decrease, healing over harm, you align with the progressive spirit of creation itself.",
        "The bounteous mentality sees abundance everywhere—in every sunrise, every breath, every opportunity to serve the good.",
        "Let your spirit be a fountain, not a drain. Pour out blessing upon blessing, and watch the desert of despair bloom.",
        "The progressive spirit never asks 'Why me?' but always 'How can I help?' Be an answer to someone's prayer today."
    ]
    
    # Choice/Free Will entries
    choice_entries = [
        "Every moment offers the great choice: will you add to the world's burden or its blessing? Choose consciously.",
        "Freedom is not the absence of consequences but the power to choose which consequences you will embrace.",
        "At the crossroads of decision, remember: you are always choosing not just for yourself but for all who will follow.",
        "The weight of choice is the price of consciousness. Bear it gladly, for it makes you a partner in creation's unfolding.",
        "Each choice carves a channel for future choices to follow. Choose wisely what river you dig for tomorrow."
    ]
    
    # Good Thoughts, Words, Deeds entries
    triad_entries = [
        "Let your thoughts be seeds of kindness, your words be rain of encouragement, your deeds be sunshine of hope.",
        "The threefold path begins in the silence of right thinking, flows through the beauty of truthful speech, and culminates in the power of loving action.",
        "When thought, word, and deed align like three rivers meeting, their combined power can move mountains of indifference.",
        "Pure thoughts birth noble words; noble words inspire righteous deeds; righteous deeds purify thoughts in return.",
        "The trinity of human goodness—think well, speak well, act well—echoes the divine harmony that sustains all worlds."
    ]
    
    # Compile all entries with appropriate tagging
    all_theme_entries = [
        (fire_entries, ["fire", "conscience", "choice", "wisdom", "enlightenment"]),
        (truth_entries, ["asha", "wisdom", "good-deeds", "enlightenment", "reflection"]),
        (good_mind_entries, ["vohu-manah", "wisdom", "reflection", "good-thoughts", "enlightenment"]),
        (beneficial_spirit_entries, ["spenta-mainyu", "compassion", "action", "good-deeds", "hope"]),
        (choice_entries, ["choice", "free-will", "responsibility", "wisdom", "daily-practice"]),
        (triad_entries, ["good-thoughts", "good-words", "good-deeds", "harmonization", "wisdom"])
    ]
    
    for theme_entries, theme_tags in all_theme_entries:
        for entry_text in theme_entries:
            if len(entries) < count:
                entries.append({
                    "text": entry_text,
                    "tags": theme_tags,
                    "source": "gathic-inspired"
                })
    
    return entries

# Generate a large batch of inspired entries
inspired_batch1 = create_gathic_inspired_batch([], 30)
gathic_inspired_entries.extend(inspired_batch1)

print(f"Total authentic entries: {len(authentic_entries)}")
print(f"Total inspired entries so far: {len(gathic_inspired_entries)}")
print("Continuing to build to reach 365 total...")