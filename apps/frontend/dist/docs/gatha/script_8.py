# Now I need to combine all entries, shuffle them, and create the final JSON dataset
import random

# Combine all entries
all_entries = authentic_entries + gathic_inspired_entries

print(f"Total entries to process: {len(all_entries)}")

# Shuffle the entries to distribute authentic and inspired throughout the year
# rather than clustering them together
random.seed(42)  # For reproducible shuffling
random.shuffle(all_entries)

# Add sequential IDs from 1 to 365
final_calendar = []
for i, entry in enumerate(all_entries, 1):
    calendar_entry = {
        "id": i,
        "text": entry["text"],
        "tags": entry["tags"],
        "source": entry["source"]
    }
    final_calendar.append(calendar_entry)

# Verify we have exactly 365 entries
print(f"Final calendar entries: {len(final_calendar)}")

# Quick statistics
authentic_count = sum(1 for entry in final_calendar if entry["source"] == "yasna")
inspired_count = sum(1 for entry in final_calendar if entry["source"] == "gathic-inspired")

print(f"Final statistics:")
print(f"- Authentic (yasna): {authentic_count} entries ({authentic_count/365*100:.1f}%)")
print(f"- Inspired (gathic-inspired): {inspired_count} entries ({inspired_count/365*100:.1f}%)")

# Sample a few entries to verify formatting
print(f"\nSample entries:")
for i in [0, 100, 200, 300, 364]:  # Sample from different parts of the year
    entry = final_calendar[i]
    print(f"Day {entry['id']}: {entry['text'][:80]}...")
    print(f"  Source: {entry['source']}, Tags: {entry['tags'][:3]}...")

# Convert to JSON format
calendar_json = json.dumps(final_calendar, indent=2, ensure_ascii=False)

print(f"\n✅ Successfully created complete 365-day Gathic devotional calendar!")
print(f"📊 Total size: {len(calendar_json)} characters")
print(f"📅 Ready for integration into the Zoroasterverse website")

# Display first few entries as preview
print(f"\nFirst 3 entries preview:")
for entry in final_calendar[:3]:
    print(f"Entry {entry['id']}:")
    print(f"  Text: {entry['text']}")
    print(f"  Tags: {entry['tags']}")
    print(f"  Source: {entry['source']}")
    print()