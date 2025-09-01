# Library Wireframe Annotations

## Header Section
- Title: "Your Library"
- Subtitle: "Files may include a purchaser-specific watermark. Download limits: 5 per format."
- Dismissible info banner with watermark notice

## Navigation Chips
- All | Issues | Bundles | Deluxe | Downloads
- Active state styling
- Filter library contents by type

## Item Cards Layout
Grid layout with responsive columns (2-4 depending on screen size)

### Individual Item Card
- Left: Cover thumbnail (consistent aspect ratio)
- Center: Content details
  - Title + Edition tag (Standard/Deluxe/Bundle)
  - Season/Issue number
  - Format buttons with download counters
- Right: Actions and status

### Format Download Buttons
- EPUB: "Download (2/5 used)"
- PDF: "Download (0/5 used)" 
- MOBI: "Download (5/5 used)" - disabled state when limit reached

### Download Counter States
- Available: Blue button with counter
- In progress: Spinner + "Downloading..."
- Success: Brief "Downloaded" confirmation
- Limit reached: Disabled button + reset prompt
- Error: Red state + retry option

## Progress and Status Controls

### Mark as Finished Toggle
- Checkbox: "Mark as finished"
- Tooltip: "Unlocks deeper spoiler content across the site"
- Updates global spoiler availability when toggled

### Route Suggestions Panel
- "Based on what you've read:" header
- 2-3 suggested items with route connections
- Links to related wiki entries and timelines

## Support and Reset Prompts
- Under download counters: "Need a reset? Email support@zoroasterverse.com"
- Helper text: "Include your Order ID"
- Additional help: "Problems downloading? Check your reader app supports EPUB/PDF/MOBI"

## Empty States
- No owned items: "Your library is empty. Browse the Store to get started."
- Filtered view empty: "No [filter] items found. Try a different filter."

## Loading States
- Card skeletons while loading library contents
- Progressive loading for large libraries
- Smooth transitions between states

## Responsive Behavior
- Desktop: 3-4 column grid
- Tablet: 2 column grid
- Mobile: Single column, stacked layout
- Touch-friendly download buttons

## Error Handling
- Network errors: Retry mechanism
- Download failures: Clear error messaging
- Authentication issues: Redirect to login

## Microcopy
- Watermark disclosure: "Your files may include a purchaser-specific watermark"
- Reset request hint: "Include your Order ID when contacting support"
- Download limits: "Each purchase includes up to 5 downloads per format"
- File format help: "EPUB works on most e-readers, PDF for fixed layouts, MOBI for older Kindles"