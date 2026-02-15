# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Moduł Spectra** is an educational web application built with React and Vite, featuring interactive cognitive training games in Polish. The app includes multiple learning modules focused on symbol recognition, emotions, sequences, patterns, categorization, and memory exercises.

## Development Commands

```bash
# Start development server (runs on localhost with HMR)
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Application Structure

- **Entry point**: [src/main.jsx](src/main.jsx) renders the App into the DOM
- **Root component**: [src/App.jsx](src/App.jsx) contains React Router setup with sidebar layout
- **Navigation**: [src/components/Sidebar.jsx](src/components/Sidebar.jsx) provides the main navigation menu
- **Modules**: Each game/page lives in `src/pages/<ModuleName>/` with its own `index.jsx` and `style.css`

### Module Pattern

Each game module follows a consistent structure:

1. **Data definition**: Array of questions/items (e.g., `questions`, `emotions`)
2. **State management**:
   - Current question/item tracking
   - Score and progress
   - Answer feedback
   - Game completion status
3. **Core functions**:
   - Answer checking logic
   - Navigation to next question
   - Game restart functionality
   - Optional: shuffle functions, celebration animations
4. **UI components**:
   - Progress bar (typically shows completion percentage)
   - Score display (often with star ratings)
   - Question/prompt area
   - Answer options (buttons)
   - Feedback messages (success/error states)
   - Completion screen with restart option

### Routing

All routes are defined in [src/App.jsx](src/App.jsx):
- `/` - Main menu (landing page)
- `/symbole` - Symbol and image analysis
- `/sekwencje` - Sequence understanding
- `/wzorce` - Patterns and layouts
- `/kategoryzacja` - Categorization and sorting
- `/pamiec` - Memory and concentration
- `/przepiszklowo` - Word copying
- `/uczucia` - Emotions recognition
- `/dwaid` - Dwaid module
- `/wrozka` - Fortune teller module
- `/zjadanie` - Pac-Man style game
- `/settings` - Settings page

### Styling

- Global styles: [src/App.css](src/App.css) and [src/components/Sidebar.css](src/components/Sidebar.css)
- Module-specific: Each page has its own `style.css` file co-located with `index.jsx`
- No CSS preprocessors or CSS-in-JS libraries are used

## Adding New Modules

When creating a new game module:

1. Create a new folder in `src/pages/<ModuleName>/`
2. Add `index.jsx` and `style.css` files
3. Follow the established module pattern (see existing modules like [Symbole](src/pages/Symbole/index.jsx) or [Uczucia](src/pages/Uczucia/index.jsx))
4. Import and add the route in [src/App.jsx](src/App.jsx)
5. Add the navigation link to the `modules` array in [src/components/Sidebar.jsx](src/components/Sidebar.jsx)

## Key Dependencies

- **react-router-dom** (v7): Client-side routing - uses `BrowserRouter`, `Routes`, `Route`, and `NavLink`
- **react-confetti** (v6): Celebration animations for correct answers (used in modules like Uczucia)
- **firebase** (v12): Firebase SDK initialized in [src/firebase.js](src/firebase.js) (currently minimal usage)
- **tldraw** (v4): Drawing/whiteboard functionality (used in specific modules)

## Language and Content

- All UI text, module names, and content are in **Polish**
- User-facing strings should maintain this language consistency
- Module names use Polish terminology for cognitive training concepts

## Firebase Configuration

Firebase is initialized in [src/firebase.js](src/firebase.js) but is not extensively used throughout the app yet. The configuration includes authentication, hosting, and analytics setup for the `modulspectratest` project.
