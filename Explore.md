# Lightning.js & Blits Framework - Complete Learning Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Core Concepts](#core-concepts)
4. [Component System](#component-system)
5. [Routing System](#routing-system)
6. [State Management](#state-management)
7. [Template System](#template-system)
8. [Input Handling](#input-handling)
9. [Lifecycle Hooks](#lifecycle-hooks)
10. [Props & Events](#props--events)
11. [API Integration](#api-integration)
12. [Best Practices](#best-practices)
13. [Common Patterns](#common-patterns)

---

## Introduction

### What is Lightning.js?

Lightning.js is a framework for building TV applications. It's built on top of WebGL and provides a high-performance, GPU-accelerated rendering engine specifically optimized for TV devices and set-top boxes.

**Key Benefits:**
- **High Performance**: GPU-accelerated rendering on low-spec TV devices
- **TV-Optimized**: Designed for remote control navigation
- **Lightweight**: Works on devices with limited resources
- **Responsive**: Smooth animations and transitions

### What is Blits?

Blits is a Vue-like component framework built on top of Lightning.js. It provides:
- **Component-Based Architecture**: Reusable, encapsulated UI components
- **Reactive State**: Automatic UI updates when state changes
- **Template Syntax**: Vue-like syntax for building UIs
- **Routing**: Built-in routing system for multi-page apps
- **Input Management**: Remote control input handling

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────┐
│         Blits Application Layer            │
│  (Components, Routing, State Management)   │
├─────────────────────────────────────────────┤
│      Lightning.js Rendering Engine         │
│  (GPU Acceleration, Animations, Effects)   │
├─────────────────────────────────────────────┤
│            WebGL Canvas                    │
│     (GPU-Based 2D/3D Rendering)            │
└─────────────────────────────────────────────┘
```

### Application Structure

**Single-Page Application (SPA):**
- One main Application component
- Multiple Page components
- Router to switch between pages
- Shared state and services

**Component Tree Example:**
```
Application
├── Home Page
├── TMDB Browse Page
├── Movie Detail Page
└── Movie Player Page
    ├── PlayerManager (Service)
    └── Controls (Sub-component)
```

---

## Core Concepts

### 1. Elements

An **Element** is the basic building block in Lightning.js/Blits. It's a rectangular visual object that can contain text, images, or other elements.

```javascript
<Element
  x="0"
  y="0"
  w="1920"
  h="1080"
  color="#000000"
>
  <!-- Child elements -->
</Element>
```

**Properties:**
- `x`, `y`: Position on screen
- `w`, `h`: Width and height
- `color`: Background color (hex)
- `alpha`: Opacity (0-1)
- `rotation`: Rotation in degrees
- `scale`: Scale factor
- `zIndex`: Layer ordering

### 2. Reactive Binding

Blits uses the `$` prefix to bind component state to the template. When state changes, the UI automatically updates.

```javascript
export default Blits.Component('MyComponent', {
  state() {
    return {
      count: 0,
      isVisible: true,
    }
  },
  template: `
    <Element>
      <Text :content="'Count: ' + $count" />
      <Element v-if="$isVisible" color="#FF0000" />
    </Element>
  `,
})
```

**Binding Types:**
- `:content="$variable"` - Bind text content
- `:color="$variable"` - Bind color
- :x.transition="{value: $x, d: 300}" - Smooth transition
- `v-if="$condition"` - Conditional rendering

### 3. Transitions & Animations

Smooth animations between property changes.

```javascript
// Smooth color transition
:color.transition="{value: '#FF0000', d: 500, f: 'ease-in-out'}"

// Properties:
// value: Target value
// d: Duration in milliseconds
// f: Easing function (linear, ease-in-out, ease-in, ease-out)
```

---

## Component System

### Component Structure

```javascript
export default Blits.Component('ComponentName', {
  // Props received from parent
  props: {
    movieId: null,
    title: 'Default Title',
  },

  // UI Template
  template: `
    <Element w="200" h="300">
      <Text :content="$title" />
    </Element>
  `,

  // Local Component State
  state() {
    return {
      isLoading: false,
      data: null,
    }
  },

  // Lifecycle Hooks
  hooks: {
    init() {
      // Called when component is created
    },
    ready() {
      // Called when component is rendered and ready
    },
    focus() {
      // Called when component receives focus
    },
    unfocus() {
      // Called when component loses focus
    },
    destroy() {
      // Called when component is destroyed
    },
  },

  // Input Handlers
  input: {
    enter() {
      // Remote control ENTER/OK button
    },
    back() {
      // Remote control BACK button
    },
    left() {},
    right() {},
    up() {},
    down() {},
  },

  // Methods
  methods: {
    loadData() {
      this.isLoading = true
      // Load data...
      this.isLoading = false
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible
    },
  },
})
```

### Component Communication

**Parent to Child (Props):**
```javascript
// Child component usage in parent
<MovieCard :movieId="$selectedMovieId" :title="$selectedTitle" />

// Child component
props: {
  movieId: null,
  title: 'Untitled',
},
template: `<Text :content="'ID: ' + $movieId + ' Title: ' + $title" />`
```

**Child to Parent (Events):**
```javascript
// Child emits event
this.$emit('movieSelected', movieData)

// Parent listens
@movieSelected="handleSelection"

// Parent method
methods: {
  handleSelection(movieData) {
    this.selectedMovie = movieData
  },
}
```

---

## Routing System

### How Routing Works

Blits provides a router that maps URL paths to components and manages navigation.

```javascript
export default Blits.Application({
  template: `<RouterView />`,

  routes: [
    { path: '/', component: Home },
    { path: '/tmdb', component: TmdbBrowse },
    { path: '/tmdb/:id', component: MovieDetail },
    { path: '/tmdb/:id/play', component: MoviePlayer },
  ],
})
```

### Route Parameters

Routes can have dynamic parameters extracted from the URL.

```javascript
// Route definition
{ path: '/tmdb/:id/play', component: MoviePlayer }

// Component receives params via props
props: {
  id: null, // Parameter from URL
},

// Access in template or methods
this.id // Contains the movie ID from URL
```

### Navigation

```javascript
// Navigate to route
this.$router.to('/')
this.$router.to('/tmdb')
this.$router.to(`/tmdb/${movieId}`)

// Go back
this.$router.back()

// Get current route info
this.$router.currentRoute.path  // Current path
this.$router.currentRoute.params // Route parameters
```

### Route Order Matters

Routes are matched in order, so specific routes should come before generic ones:

```javascript
routes: [
  { path: '/tmdb/:id/play', component: MoviePlayer },  // Specific
  { path: '/tmdb/:id', component: MovieDetail },       // Generic
  { path: '/tmdb', component: TmdbBrowse },
  { path: '/', component: Home },
]
```

---

## State Management

### Local Component State

Each component has its own local state.

```javascript
state() {
  return {
    counter: 0,
    items: [],
    isVisible: true,
    activeIndex: -1,
  }
}

// Update state
this.counter++
this.items.push(newItem)
this.isVisible = false
```

### State Reactivity

When state changes, the template automatically re-renders.

```javascript
// State change triggers template update
methods: {
  increment() {
    this.count++ // Template re-renders with new count
  },
}
```

### Passing State Between Components

Via **props** (parent → child):
```javascript
<ChildComponent :value="$parentState" :title="$parentTitle" />
```

Via **events** (child → parent):
```javascript
// Child
this.$emit('update', newValue)

// Parent
@update="handleUpdate"
```

---

## Template System

### Basic Template Syntax

```javascript
template: `
  <Element w="1920" h="1080" color="#000000">
    <!-- Text -->
    <Text content="Hello World" size="30" />

    <!-- Conditional Rendering -->
    <Element v-if="$isLoading" color="#FF0000" />
    <Element v-else color="#00FF00" />

    <!-- For Loops -->
    <Element v-for="(movie, index) in $movies" :key="index">
      <Text :content="movie.title" />
    </Element>

    <!-- Binding -->
    <Element :color="$selectedColor" :alpha="$opacity">
      <Text :content="'Title: ' + $title" />
    </Element>
  </Element>
`
```

### Text Element

```javascript
<Text
  content="Hello"
  size="30"
  color="#FFFFFF"
  x="100"
  y="50"
  wordWrap="true"
  wordWrapWidth="500"
/>
```

### Image Element

```javascript
<Element w="200" h="300" :src="$imageUrl" />
```

### Circles

```javascript
<Circle
  x="960"
  y="540"
  size="50"
  bgColor="#FFFFFF"
  mount="0.5"
/>
```

### Dynamic Styling

```javascript
// Conditional color
:color="$isActive ? '#00FF00' : '#CCCCCC'"

// Conditional size
:w="$isExpanded ? 400 : 200"
:h="$isExpanded ? 600 : 300"

// Multiple state binding
:alpha.transition="{value: $hidden ? 0 : 1, d: 300}"
```

---

## Input Handling

### Remote Control Input

Blits handles TV remote control input.

```javascript
input: {
  up() {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1)
  },
  down() {
    this.selectedIndex = Math.min(this.maxIndex, this.selectedIndex + 1)
  },
  left() {
    this.leftPanel = true
    this.rightPanel = false
  },
  right() {
    this.leftPanel = false
    this.rightPanel = true
  },
  enter() {
    // Select/OK button
    this.handleSelection()
  },
  back() {
    // Back/Return button
    this.$router.back()
  },
}
```

### Input Prevention

```javascript
input: {
  up() {
    if (this.isLoading) return // Ignore if loading
    this.moveUp()
  },
}
```

### Focus Management

Only the focused component receives input events.

```javascript
hooks: {
  focus() {
    // Component is focused
    this.isFocused = true
  },
  unfocus() {
    // Component lost focus
    this.isFocused = false
  },
}

// Give focus to a child component
this.$focus()
```

---

## Lifecycle Hooks

### Hook Execution Order

```
1. init()      → Component instance created
   ↓
2. ready()     → Component rendered and ready
   ↓
3. focus()     → Component receives focus (if applicable)
   ↓
4. [User interaction]
   ↓
5. unfocus()   → Component loses focus (if applicable)
   ↓
6. destroy()   → Component cleaned up
```

### Hook Examples

```javascript
hooks: {
  async init() {
    // Initialize: Set up variables, listeners
    console.log('Component created')
  },

  async ready() {
    // Ready: Load data, initialize services
    this.data = await this.fetchData()
    this.startAnimation()
  },

  focus() {
    // Focused: Highlight selection
    this.isSelected = true
    this.$emit('componentFocused')
  },

  unfocus() {
    // Unfocused: Reset selection
    this.isSelected = false
  },

  async destroy() {
    // Cleanup: Clear intervals, remove listeners
    clearInterval(this.updateInterval)
    await this.service.cleanup()
  },
}
```

---

## Props & Events

### Props

Props are input to a component from its parent.

```javascript
// Component definition
props: {
  movieId: null,
  title: 'Default Title',
  isActive: false,
  categories: [],
}

// Using props
template: `
  <Element>
    <Text :content="$title" />
    <Text :content="'Movie: ' + $movieId" />
  </Element>
`
```

### Events

Components emit events to communicate with parents.

```javascript
// Emit event from child
methods: {
  selectMovie() {
    this.$emit('movieSelected', {
      id: this.movieId,
      title: this.title,
    })
  },
}

// Listen in parent component
<MovieCard
  :movieId="$selectedMovieId"
  @movieSelected="handleMovieSelection"
/>

methods: {
  handleMovieSelection(movieData) {
    console.log('Movie selected:', movieData)
    this.selectedMovie = movieData
  },
}
```

---

## API Integration

### Making API Calls

```javascript
// In component
async ready() {
  try {
    const response = await fetch('https://api.example.com/movies')
    const data = await response.json()
    this.movies = data
  } catch (error) {
    console.error('API Error:', error)
    this.error = 'Failed to load movies'
  }
}
```

### API Service Pattern

Create a separate service file for API calls:

```javascript
// src/api/providers/index.js
const API_URL = 'https://api.themoviedb.org/3'
const API_KEY = 'your_api_key'

export const fetchPopularMovies = async () => {
  const response = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}`)
  return response.json()
}

export const fetchMovieDetails = async (movieId) => {
  const response = await fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}`)
  return response.json()
}
```

### Using API Service in Component

```javascript
import { fetchMovieDetails } from '../api/providers/index.js'

export default Blits.Component('MovieDetail', {
  props: {
    id: null,
  },

  state() {
    return {
      movie: null,
      isLoading: false,
    }
  },

  async ready() {
    this.isLoading = true
    try {
      this.movie = await fetchMovieDetails(this.id)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      this.isLoading = false
    }
  },

  template: `
    <Element>
      <Text v-if="$isLoading" content="Loading..." />
      <Element v-else>
        <Text :content="$movie.title" />
        <Text :content="$movie.overview" />
      </Element>
    </Element>
  `,
})
```

---

## Best Practices

### 1. Component Organization

```
src/
├── pages/          # Full-page components
│   ├── Home.js
│   ├── TmdbBrowse.js
│   └── MoviePlayer.js
├── components/     # Reusable components
│   ├── MovieCard.js
│   ├── TmdbRow.js
│   └── PlayerManager.js
├── api/            # API calls
│   └── providers/
│       └── index.js
└── App.js          # Main application
```

### 2. State Management

- Keep component state local unless it needs to be shared
- Use props for parent → child communication
- Use events for child → parent communication
- Create services for shared logic

### 3. Performance Optimization

```javascript
// Use conditional rendering to avoid rendering hidden elements
<Element v-if="$isVisible">
  <ComplexComponent />
</Element>

// Use .transition only when necessary
:x.transition="{value: $targetX, d: 300}"

// Unsubscribe from listeners in destroy hook
async destroy() {
  clearInterval(this.interval)
  this.emitter.off('event', this.handler)
}
```

### 4. Error Handling

```javascript
async ready() {
  try {
    this.data = await this.fetchData()
  } catch (error) {
    console.error('Error loading data:', error)
    this.error = getReadableErrorMessage(error)
  }
}

// Display error to user
<Element v-if="$error" color="#FF0000">
  <Text :content="$error" />
</Element>
```

### 5. Code Organization

Keep methods organized:

```javascript
methods: {
  // Data methods
  async loadMovies() { },
  async loadMovieDetails() { },

  // UI methods
  updateSelection() { },
  showMenu() { },

  // Navigation methods
  goToDetail() { },
  goBack() { },
}
```

---

## Common Patterns

### Pattern 1: Loading State

```javascript
state() {
  return {
    isLoading: false,
    data: null,
    error: null,
  }
},

async ready() {
  this.loadData()
},

methods: {
  async loadData() {
    this.isLoading = true
    this.error = null
    try {
      this.data = await fetchData()
    } catch (err) {
      this.error = err.message
    } finally {
      this.isLoading = false
    }
  },
},

template: `
  <Element>
    <Text v-if="$isLoading" content="Loading..." />
    <Text v-else-if="$error" :content="$error" />
    <Element v-else>
      <!-- Display data -->
    </Element>
  </Element>
`
```

### Pattern 2: Selection List

```javascript
state() {
  return {
    items: [],
    selectedIndex: 0,
  }
},

input: {
  up() {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1)
  },
  down() {
    this.selectedIndex = Math.min(this.items.length - 1, this.selectedIndex + 1)
  },
  enter() {
    this.selectItem(this.items[this.selectedIndex])
  },
},

template: `
  <Element>
    <Element v-for="(item, index) in $items" :key="index">
      <Element
        :color="index === $selectedIndex ? '#00FF00' : '#CCCCCC'"
        :alpha="index === $selectedIndex ? 1 : 0.7"
      >
        <Text :content="item.title" />
      </Element>
    </Element>
  </Element>
`
```

### Pattern 3: Tab Navigation

```javascript
state() {
  return {
    activeTab: 0,
    tabs: ['Browse', 'Favorites', 'Settings'],
  }
},

input: {
  left() {
    this.activeTab = Math.max(0, this.activeTab - 1)
  },
  right() {
    this.activeTab = Math.min(this.tabs.length - 1, this.activeTab + 1)
  },
},

template: `
  <Element>
    <!-- Tab Headers -->
    <Element y="0">
      <Element v-for="(tab, index) in $tabs" :key="index" x="{index * 200}">
        <Element
          :color="index === $activeTab ? '#0087CEEB' : '#CCCCCC'"
        >
          <Text :content="tab" />
        </Element>
      </Element>
    </Element>

    <!-- Tab Content -->
    <Element y="60">
      <BrowseTab v-if="$activeTab === 0" />
      <FavoritesTab v-else-if="$activeTab === 1" />
      <SettingsTab v-else-if="$activeTab === 2" />
    </Element>
  </Element>
`
```

### Pattern 4: Modal Dialog

```javascript
state() {
  return {
    showModal: false,
    message: '',
  }
},

methods: {
  openModal(message) {
    this.message = message
    this.showModal = true
  },
  closeModal() {
    this.showModal = false
  },
},

input: {
  enter() {
    if (this.showModal) {
      this.closeModal()
    }
  },
},

template: `
  <Element>
    <!-- Main content -->
    <MainContent v-if="!$showModal" />

    <!-- Modal overlay -->
    <Element
      v-if="$showModal"
      w="1920"
      h="1080"
      color="#000000"
      :alpha="0.8"
    >
      <!-- Modal box -->
      <Element x="460" y="390" w="1000" h="300" color="#FFFFFF">
        <Text :content="$message" x="50" y="50" />
        <Text content="Press OK to close" x="50" y="200" />
      </Element>
    </Element>
  </Element>
`
```

---

## Key Takeaways

1. **Lightning.js** = GPU-accelerated rendering engine
2. **Blits** = Component framework on top of Lightning.js
3. **Components** = Reusable, encapsulated UI blocks
4. **State** = Component data that triggers UI updates
5. **Props** = Component inputs from parent
6. **Events** = Component outputs to parent
7. **Routes** = Map paths to components
8. **Hooks** = Specific moments in component lifecycle
9. **Input** = Handle remote control interactions
10. **Templates** = Vue-like syntax for building UIs

---

## For More Information

- Official Blits Documentation: https://lightningjs.io/
- Lightning.js GitHub: https://github.com/LightningJS
- Explore the codebase: Start in `src/App.js` and trace through the routing
