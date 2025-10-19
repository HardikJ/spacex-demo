# SpaceX Launches Explorer

## Table of Contents

- [Overview](#overview)
- [API Choice](#api-choice)
- [Design Decisions](#design-decisions)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Commands](#commands)
- [Testing](#testing)
- [Folder Structure](#folder-structure)
- [Future Improvements](#future-improvements)

---

## Overview

A web application built with **Next.js 15** with **App Router**, **TypeScript**, and **Tailwind CSS** that lets users explore SpaceX launches with search, filtering, sorting, favorites management and detailed launch information pages.

---

**Key Features:**

- **SpaceX API Integration** - Real-time launch data from SpaceX API
- **Search & Filtering** - Debounced search with multiple sort options
- **Favorites System** - Save favorites with bulk management
- **Infinite Scroll** - Smooth pagination using IntersectionObserver
- **Responsive Design** - Works on mobile and desktop
- **Testing** - Unit tests for hooks and components

---

## API Choice

The project uses the **[SpaceX API v3](https://github.com/r-spacex/SpaceX-API)** because:

- **Good Data**: Provides information about SpaceX launches, rockets, missions, and payloads
- **Easy to Use**: Clean API structure with consistent endpoints
- **Up to Date**: Regularly updated with latest launch information
- **Free**: No authentication required, good for learning
- **Rich Data**: Includes mission patches, launch sites, rocket details, and failure information

**Primary Endpoint:**

- `https://api.spacexdata.com/v3/launches` – Fetch all launches

---

## Design Decisions

### 1. **Framework & Architecture**

- **Next.js 15 with App Router**: React framework with server-side rendering
- **TypeScript**: Type safety throughout the application
- **Redux Toolkit**: State management for launches and favorites
- **Modular Architecture**: Reusable components with clear separation

### 2. **Styling & UI**

- **Tailwind CSS v4**: Utility-first CSS framework
- **Responsive Design**: Works on mobile and desktop
- **Dark Theme**: Space-themed dark UI with gradients
- **Loading States**: Skeleton loaders and transitions

### 3. **Performance & UX**

- **Debounced Search**: 500ms delay to prevent too many API calls
- **Infinite Scroll**: IntersectionObserver for smooth pagination
- **Request Cancellation**: Prevents race conditions
- **Caching**: localStorage for favorites, sessionStorage for navigation
- **Error Handling**: Error states and fallbacks

### 4. **Data Management**

- **Client-side Filtering**: Search and sort after fetching data
- **Pagination**: Load data efficiently with hasMore tracking
- **State Persistence**: Favorites saved to localStorage
- **Type Safety**: TypeScript for all data structures

---

## Features

### **Core Requirements**

#### 1. **Search & Filter**

- **Global Search**: Debounced search (500ms) by mission name
- **Sorting**: Sort by flight number or mission name (asc/desc)
- **Real-time Updates**: UI updates with smooth transitions

#### 2. **List & Detail Views**

- **Launch Cards**: Cards with mission patches, status badges, and key details
- **Responsive Grid**: Layout that adapts to screen size (1-3 columns)
- **Detail Pages**: Launch information with metadata
- **Mission Patches**: Display of SpaceX mission patches

#### 3. **Infinite Scroll Pagination**

- **Smooth Loading**: IntersectionObserver-based infinite scroll
- **Pagination**: 12 items per page with hasMore tracking
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Error states and retry mechanisms

#### 4. **Favorites System**

- **Add/Remove Favorites**: One-click favorite management
- **Persistent Storage**: localStorage-based persistence
- **Bulk Management**: Select all, bulk remove functionality
- **Favorites Counter**: Count display in header
- **Confirmation Dialogs**: Safe bulk deletion with confirmation

#### 5. **Sorting**

- **Flight Number**: Sort by launch sequence (asc/desc)
- **Mission Name**: Alphabetical sorting (A-Z, Z-A)
- **Instant Updates**: Sorting without page refresh

#### 6. **Performance & UX**

- **Debounced Search**: Prevents too many API calls
- **Request Cancellation**: Handles stale requests properly
- **Caching**: Multiple caching strategies for better performance
- **Mobile Optimized**: Touch-friendly interface with responsive design

#### 7. **Code Quality & Architecture**

- **Modular Components**: Reusable, well-structured components
- **Redux State Management**: Centralized state with Redux Toolkit
- **Clean Structure**: Organized folder hierarchy
- **TypeScript**: Type safety and IntelliSense support

#### 8. **Testing**

- **Unit Tests**: Test coverage for hooks and components
- **Jest + React Testing Library**: Testing setup
- **6 Passing Tests**: useDebounce hook and SearchHeader component tests

#### 9. **Documentation**

- **README**: Setup and feature documentation
- **API Documentation**: Explanation of chosen API and endpoints
- **Architecture Notes**: Design decisions and implementation details

---

## Architecture

### **State Management**

- **Redux Toolkit**: State management for launches and favorites
- **Slices**: Separate slices for launches and favorites
- **Async Thunks**: `fetchLaunches` for API calls with error handling
- **Local Storage**: Favorites persistence with real-time updates

### **Component Structure**

```
components/
├── Home.tsx              # Main dashboard component
├── SearchHeader.tsx      # Search and sort controls
├── LaunchCard.tsx        # Individual launch display
├── LaunchDetails.tsx     # Detailed launch view
├── Favorites.tsx         # Favorites management
├── InfiniteScroll.tsx    # Pagination component
├── ViewToggle.tsx        # Grid/List view switcher
└── LoadingSkeletons.tsx  # Loading state components
```

### **API Layer**

- **Next.js API Routes**: `/api/launches` for data fetching
- **Client-side Filtering**: Search and sort applied after data fetch
- **Error Handling**: Error states and fallbacks
- **Type Safety**: TypeScript coverage for API responses

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd spacex-demo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

---

## Environment Variables

Create a `.env.local` file in the root of the project to configure runtime environment values used in the app.

### **.env Example**

```env
# SpaceX API Base URL
NEXT_PUBLIC_BASE_URL=https://api.spacexdata.com/v3

```

> These variables are automatically loaded by Next.js during development and production builds.
> Variables prefixed with `NEXT_PUBLIC_` are accessible in client-side code using `process.env`.

---

## Commands

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Start development server with Turbopack |
| `npm run build`      | Build the application for production    |
| `npm run start`      | Start the production server             |
| `npm run lint`       | Run ESLint to check code quality        |
| `npm test`           | Run all tests                           |
| `npm run test:watch` | Run tests in watch mode                 |

---

## Testing

The project includes comprehensive testing setup:

### **Test Framework**

- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **ts-jest**: TypeScript support for Jest

### **Test Coverage**

- **useDebounce Hook**: 3 tests covering debounce functionality
- **SearchHeader Component**: 3 tests covering search and sort behavior
- **Total**: 6 passing tests

### **Running Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

---

## Folder Structure

```
spacex-demo/
├── __tests__/              # Test files
│   ├── searchHeader.test.tsx
│   └── useDebounce.test.ts
├── app/                    # Next.js App Router
│   ├── [id]/              # Dynamic route for launch details
│   │   └── page.tsx
│   ├── api/               # API routes
│   │   └── launches/
│   │       └── route.ts
│   ├── favorites/         # Favorites page
│   │   └── page.tsx
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Favorites.tsx
│   ├── Home.tsx
│   ├── InfiniteScroll.tsx
│   ├── LaunchCard.tsx
│   ├── LaunchDetails.tsx
│   ├── LoadingSkeletons.tsx
│   ├── SearchHeader.tsx
│   └── ViewToggle.tsx
├── hooks/                 # Custom React hooks
│   └── useDebounce.ts
├── lib/                   # Utility functions
│   └── api.ts
├── store/                 # Redux store
│   ├── favoritesSlice.ts
│   ├── launchesSlice.ts
│   └── store.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
├── jest.config.js         # Jest configuration
├── jest.setup.js          # Jest setup file
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

---

## Future Improvements

### **Short-term (Next 1-2 weeks)**

- **Launch Videos**: Integrate YouTube/streaming video embeds
- **Analytics Dashboard**: Add launch statistics and trends
- **Notifications**: Real-time launch alerts and updates
- **Theme Toggle**: Light/dark mode switching

### **Medium-term (Next 1-2 months)**

- **Rocket Details**: Dedicated rocket information pages
- **Calendar View**: Launch schedule calendar interface
- **Advanced Filters**: Filter by rocket type, launch site, success rate
- **PWA Support**: Progressive Web App capabilities

### **Long-term (Next 3-6 months)**

- **AI Integration**: Smart recommendations and insights
- **Data Visualization**: Interactive charts and graphs
- **Global Features**: Multi-language support and timezone handling
- **API Expansion**: Integration with additional space APIs

---

## Assumptions

1. **Data Source**: SpaceX API v3 provides reliable, up-to-date launch information
2. **Browser Support**: Modern browsers with ES6+ support and localStorage
3. **Network**: Stable internet connection for API calls and data fetching
4. **Performance**: Client-side filtering provides acceptable performance for the dataset size
5. **User Experience**: Infinite scroll is preferred over traditional pagination for this use case

---