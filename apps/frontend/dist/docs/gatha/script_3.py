# I need to create many more entries to reach 365 total
# Target: ~130 authentic, ~235 inspired
# Currently have: 31 authentic, 35 inspired

# Let me create larger batches more efficiently

# First, expand authentic entries with more public domain Gathic verses
additional_authentic = [
    # From Yasna 29 (The Cry of the Soul)
    {
        "text": "For whom did You create this earth and sky? Who made the luminaries and the darkness? (Yasna 29.1)",
        "tags": ["wisdom", "reflection", "enlightenment"],
        "source": "yasna"
    },
    
    # From Yasna 32 (Against False Leaders)
    {
        "text": "When will the noble warriors come who shall drive out from here the thirst of the wicked? (Yasna 32.1)",
        "tags": ["justice", "action", "responsibility"],
        "source": "yasna"
    },
    {
        "text": "Through good thinking, truth, and the spirit's power, they shall overcome the violence of the deceitful. (Yasna 32.16)",
        "tags": ["vohu-manah", "asha", "spenta-mainyu", "justice"],
        "source": "yasna"
    },
    
    # From Yasna 33 (Refuge in Ahura Mazda)
    {
        "text": "I take refuge in good thinking, truth, and Your lordship, Mazda, from whom comes the most beneficent spirit. (Yasna 33.5)",
        "tags": ["vohu-manah", "asha", "spenta-mainyu", "devotion"],
        "source": "yasna"
    },
    {
        "text": "May we be among those who make this world progress, who are the healers of this world, O Mazda and You, O Truth. (Yasna 30.9)",
        "tags": ["action", "good-deeds", "asha", "self-renovation", "hope"],
        "source": "yasna"
    },
    
    # From Yasna 44 (Questions to Ahura Mazda)
    {
        "text": "This I ask You: tell me truly, Ahura—who was the first father of truth by begetting? (Yasna 44.3)",
        "tags": ["asha", "wisdom", "reflection", "enlightenment"],
        "source": "yasna"
    },
    {
        "text": "This I ask You: tell me truly, Ahura—who established the path of the sun and stars? (Yasna 44.5)",
        "tags": ["wisdom", "reflection", "enlightenment"],
        "source": "yasna"
    },
    {
        "text": "This I ask You: tell me truly, Ahura—what craftsman created light and darkness? (Yasna 44.5)",
        "tags": ["wisdom", "reflection", "enlightenment"],
        "source": "yasna"
    },
    
    # From Yasna 46 (The Friend of Truth)
    {
        "text": "To what land to flee? Where shall I go to flee? They exclude me from family and clan. (Yasna 46.1)",
        "tags": ["reflection", "devotion", "responsibility"],
        "source": "yasna"
    },
    {
        "text": "The man of good life speaks to him of ill life: 'May your conscience torment you continuously!' (Yasna 46.11)",
        "tags": ["conscience", "justice", "responsibility", "good-deeds"],
        "source": "yasna"
    },
    
    # From Yasna 53 (Wedding Song)
    {
        "text": "Both bridegroom and bride, bring your minds into agreement for the practice of the best thoughts. (Yasna 53.4)",
        "tags": ["good-thoughts", "harmonization", "vohu-manah", "friendship"],
        "source": "yasna"
    },
    {
        "text": "Thus speaks the maiden: 'You are the support of good thinking, of truth, and of the lordship desired by Mazda.' (Yasna 53.3)",
        "tags": ["vohu-manah", "asha", "devotion", "wisdom"],
        "source": "yasna"
    }
]

authentic_entries.extend(additional_authentic)

# Now create many more Gathic-inspired entries organized by themes
def generate_inspired_entries_by_theme():
    entries = []
    
    # Daily Practice and Renewal
    daily_practice = [
        "Each dawn brings the covenant renewed: to think with clarity, speak with truth, act with love.",
        "Morning is creation's invitation to begin again. Accept it with gratitude and intentional presence.",
        "The day unfolds like a scroll waiting to be written. What story will your choices tell?",
        "Begin each day by asking: How shall I increase the good in the world through my being here?",
        "Evening reflection is the mirror of morning intention. End as mindfully as you began.",
        "The rhythm of sunrise and sunset teaches the sacred pace of effort and rest, engagement and reflection.",
        "In the morning, set your mind like a compass toward truth; let all your steps follow this direction.",
        "Each breath is a chance to choose life over death, hope over despair, love over fear.",
        "The morning star reminds us: even in the darkest hour, light is already on its way.",
        "Begin each day as if it were your first—with wonder. End each day as if it were your last—with gratitude."
    ]
    
    # Wisdom and Enlightenment
    wisdom = [
        "Wisdom is not knowing all the answers but asking better questions. Begin with: How can I serve?",
        "The light of understanding grows not by accumulating facts but by illuminating connections.",
        "True knowledge transforms the knower. If you remain unchanged by what you learn, you have learned nothing.",
        "The wise person is not one who has never erred but one who learns from every mistake.",
        "Understanding comes not from standing above others but from standing with them in shared humanity.",
        "The deepest wisdom is often the simplest truth, lived with complete sincerity.",
        "Knowledge builds walls to separate us from ignorance; wisdom builds bridges to connect us with all beings.",
        "The paradox of wisdom: the more you truly know, the more you realize how much you don't know.",
        "Wisdom is like water—it takes the shape of whatever vessel contains it, yet never loses its essence.",
        "The wise heart holds both confidence and humility, certainty and openness, in perfect balance."
    ]
    
    # Justice and Responsibility  
    justice = [
        "Justice is not revenge but restoration—making right what has been wrong, healing what has been harmed.",
        "Where injustice flourishes, it is not enough to be personally righteous. Stand up, speak out, act decisively.",
        "The measure of a society is how it treats those who cannot defend themselves.",
        "True justice considers not only what is legal but what is right, not only what is permitted but what is beneficial.",
        "When you have the power to help and choose not to, you become complicit in the suffering you could have prevented.",
        "Justice delayed is often justice denied, but justice rushed is sometimes injustice accomplished. Seek the balanced way.",
        "The scales of justice are balanced not by equal punishment but by proportional restoration.",
        "Your privilege is not your fault, but your responsibility. Use whatever advantages you have to lift others.",
        "Justice is love applied to systems, compassion embodied in institutions, kindness made structural.",
        "The arc of the moral universe bends toward justice only when conscious beings like you and me choose to bend it."
    ]
    
    # Compassion and Friendship
    compassion = [
        "Compassion is not feeling sorry for others but feeling with them, sharing their burden until it becomes lighter.",
        "The heart that has been broken and healed is stronger than one that has never been tested.",
        "Friendship is truth telling and burden sharing, celebration and consolation, walking together toward the light.",
        "When someone trusts you with their vulnerability, you hold sacred ground. Tread carefully and gratefully.",
        "The stranger is just a friend you haven't met yet, a teacher you haven't learned from yet, a gift you haven't unwrapped yet.",
        "Loneliness is the human condition; connection is the human choice. Choose connection.",
        "Your presence is often more healing than your words, your listening more valuable than your advice.",
        "The most precious gift you can give another person is your full, undivided, loving attention.",
        "Forgiveness is not condoning what was wrong but choosing to be free from the burden of carrying resentment.",
        "Love is the recognition that the other person's happiness is as important as your own—maybe more important."
    ]
    
    # Hope and Renewal
    hope = [
        "Hope is not naive optimism but courageous commitment to work for what ought to be.",
        "Even in the darkest times, remember: you are here for a reason, at this time, in this place.",
        "The future is not predetermined but is being written by every choice you make right now.",
        "When the world seems broken beyond repair, remember that you are part of the repair.",
        "Hope plants seeds in winter, trusting in the promise of spring.",
        "The darkness is never permanent, the light is never extinguished completely. Keep the vigil.",
        "Your life may be a drop in the ocean, but without your drop the ocean would be less.",
        "Renewal comes not from changing everything at once but from changing one thing completely.",
        "The phoenix is not reborn from ashes but through them—transformation requires embracing the fire.",
        "Every ending contains a beginning; every death, a birth; every loss, an opportunity for growth."
    ]
    
    # Compile all with appropriate tags
    themes_with_tags = [
        (daily_practice, ["daily-practice", "renewal", "reflection", "good-thoughts", "gratitude"]),
        (wisdom, ["wisdom", "enlightenment", "reflection", "vohu-manah"]),
        (justice, ["justice", "responsibility", "action", "good-deeds"]),
        (compassion, ["compassion", "friendship", "good-deeds", "harmonization"]),
        (hope, ["hope", "renewal", "enlightenment", "self-renovation"])
    ]
    
    for theme_entries, theme_tags in themes_with_tags:
        for text in theme_entries:
            entries.append({
                "text": text,
                "tags": theme_tags,
                "source": "gathic-inspired"
            })
    
    return entries

# Generate the theme-based entries
new_inspired = generate_inspired_entries_by_theme()
gathic_inspired_entries.extend(new_inspired)

print(f"Updated totals:")
print(f"Authentic entries: {len(authentic_entries)}")
print(f"Inspired entries: {len(gathic_inspired_entries)}")
print(f"Total entries so far: {len(authentic_entries) + len(gathic_inspired_entries)}")

# I need to continue building to reach 365...