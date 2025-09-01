import json
import random

# Set up the tag taxonomy as specified in the user's report
tags_list = [
    "asha", "vohu-manah", "spenta-mainyu", "choice", "free-will", 
    "good-thoughts", "good-words", "good-deeds", "fire", "conscience", 
    "enlightenment", "responsibility", "compassion", "justice", "devotion", 
    "gratitude", "reflection", "renewal", "friendship", "action", 
    "offerings", "wisdom", "hope", "harmonization", "daily-practice", 
    "self-renovation"
]

# Create the 365-day devotional calendar
devotional_calendar = []

# I'll create a mix of authentic Gathic verses and original inspired content
# Approximately 35% authentic (about 128 entries) and 65% inspired (about 237 entries)

# First, let me create some authentic Gathic entries based on public domain translations
authentic_entries = [
    {
        "text": "Reflect with a clear mind—each person for themselves—before the Great Event of Choices. Awaken to this doctrine: there is no compromise between right and wrong. (Yasna 30.2)",
        "tags": ["choice", "free-will", "asha", "responsibility", "wisdom"],
        "source": "yasna"
    },
    {
        "text": "I who shall serve You with good thinking... may I thus bring solace to the soul of Earth. (Yasna 28.2)",
        "tags": ["vohu-manah", "good-thoughts", "devotion", "action"],
        "source": "yasna"
    },
    {
        "text": "The true order of existence is good; the most-good existence it is; desire it! Wish it! Happiness, bliss, enlightenment it is for that existence which is the true order of existence. (Yasna 27.14 - Ashem Vohu)",
        "tags": ["asha", "enlightenment", "wisdom", "hope"],
        "source": "yasna"
    },
    {
        "text": "I shall serve You with good thinking, with truth and righteous action, so that You may grant to me that bliss which leads to the straight path. (Yasna 28.5)",
        "tags": ["vohu-manah", "asha", "good-deeds", "devotion", "wisdom"],
        "source": "yasna"
    },
    {
        "text": "For a wise Lord I knew You to be, Mazda, when Good Mind came to me and asked: 'Who are you? To whom do you belong?' (Yasna 43.7)",
        "tags": ["vohu-manah", "wisdom", "reflection", "enlightenment"],
        "source": "yasna"
    }
]

# Let me continue building authentic entries - I'll add more as I build the dataset
print("Starting to build the 365-day Gathic devotional calendar...")
print(f"Using tag taxonomy with {len(tags_list)} tags")
print("Building authentic and inspired entries...")