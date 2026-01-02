# Hungarian Immigration Document Tracker

A React-based progress tracker designed for expats moving to Hungary. This application helps users organize and track the documents required for the Enter Hungary portal, ensuring a smooth immigration process.

## Features

- **Organized Checklist**: Documents are grouped by category (Essential, Financial, Employment, Personal, Administrative)
- **Progress Tracking**: Visual progress bar shows completion percentage
- **Local Storage Persistence**: Your progress is automatically saved in your browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean UI**: Modern, intuitive interface with gradient design

## Required Documents Tracked

### Essential Documents
- Valid Passport
- Proof of Accommodation
- Health Insurance
- Passport Photos

### Financial Documents
- Bank Statements (3-6 months)

### Employment Documents
- Employment Contract

### Personal Documents
- Birth Certificate (apostilled with Hungarian translation)
- Criminal Background Check
- Marriage Certificate (if applicable)

### Administrative
- Tax Registration (Hungarian tax ID)

## Tech Stack

- **React** (v19.2.3) - UI framework
- **CSS3** - Styling with modern gradients and animations
- **localStorage** - Client-side data persistence
- **Create React App** - Build tooling

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/hungary-tracker.git
cd hungary-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

## Usage

1. **Check off documents** as you gather them by clicking the checkboxes
2. **Track your progress** with the visual progress bar at the top
3. **Reset progress** if needed using the Reset Progress button
4. Your progress is **automatically saved** and will persist between browser sessions

## How It Works

The application uses React hooks for state management:

- `useState` - Manages the document checklist state
- `useEffect` - Syncs state with localStorage for persistence

When you check or uncheck a document:
1. The component state updates
2. The change is saved to localStorage
3. The progress bar recalculates
4. The UI updates with smooth transitions

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder ready for deployment.

## Project Structure

```
src/
├── components/
│   ├── ImmigrationTracker.js    # Main tracker component
│   └── ImmigrationTracker.css   # Component styling
├── App.js                       # Root component
├── App.css                      # App-level styles
└── index.js                     # Entry point
```

## Future Enhancements

Potential features for future versions:
- Add notes for each document
- Set reminder dates
- Upload document scans
- Export progress as PDF
- Multi-language support (English/Hungarian)

## About

This project was created to help expats navigate the Hungarian immigration process. It demonstrates practical React skills including:
- Component-based architecture
- React Hooks (useState, useEffect)
- Browser localStorage API
- Responsive CSS design
- User experience design

Built by a developer committed to relocating to Hungary and contributing to the local tech community.

## License

This project is open source and available under the MIT License.

## Contributing

Suggestions and contributions are welcome! Feel free to open an issue or submit a pull request.

---

**Note**: This tracker is for personal organization purposes. Always verify current requirements with official Hungarian immigration authorities and the Enter Hungary portal.
