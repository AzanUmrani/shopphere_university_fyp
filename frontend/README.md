# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# ShopSphere - Modern Ecommerce Website

## Overview

ShopSphere is a modern, responsive ecommerce website built with React TypeScript, Vite, Tailwind CSS, Redux Toolkit, and React Router DOM. It features a complete front-end flow including product catalog, shopping cart, checkout process, user authentication, and more.

## Features

### 🛍️ Core Ecommerce Features

- **Product Catalog**: Browse products with filtering and search
- **Product Details**: Detailed product pages with images and specifications
- **Shopping Cart**: Add/remove items with quantity management
- **Wishlist**: Save favorite products for later
- **User Authentication**: Login and registration system
- **Checkout Process**: Complete order flow
- **Order Management**: Track and view order history
- **Responsive Design**: Works on all devices (mobile, tablet, desktop)

### 🎨 Design & UX

- **Modern UI**: Clean, professional design with Tailwind CSS
- **Responsive Layout**: Mobile-first approach
- **Interactive Components**: Hover effects, animations, and smooth transitions
- **Accessible**: Proper semantic HTML and ARIA attributes

### 🔧 Technical Features

- **TypeScript**: Full type safety
- **Redux Toolkit**: Centralized state management
- **React Router**: Client-side routing
- **Vite**: Fast build tool and development server
- **Component Architecture**: Modular, reusable components
- **Custom Hooks**: Reusable logic with React hooks

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Form Handling**: React Hook Form
- **Validation**: Zod

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, Card, etc.)
│   ├── layout/          # Layout components (Header, Footer, Layout)
│   ├── product/         # Product-related components
│   ├── cart/            # Shopping cart components
│   └── auth/            # Authentication components
├── pages/               # Page components
├── store/               # Redux store and slices
│   └── slices/          # Redux slices
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and helpers
└── main.tsx             # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Components

### UI Components

- **Button**: Versatile button component with multiple variants
- **Input**: Form input with validation support
- **Card**: Container component for content
- **Badge**: Small status indicators
- **Loading**: Loading states and spinners

### Layout Components

- **Header**: Navigation bar with search, cart, and user menu
- **Footer**: Site footer with links and contact info
- **Layout**: Main layout wrapper

### Product Components

- **ProductCard**: Display product information with actions
- **ProductGrid**: Grid layout for products
- **ProductFilters**: Filter and sort products

## State Management

The application uses Redux Toolkit for state management with the following slices:

- **authSlice**: User authentication and profile
- **cartSlice**: Shopping cart state and actions
- **productSlice**: Product catalog and search
- **wishlistSlice**: User wishlist management
- **orderSlice**: Order history and tracking
- **uiSlice**: UI state (modals, drawers, etc.)

## Styling

Tailwind CSS is used for styling with:

- Custom color palette
- Responsive design utilities
- Component classes for consistency
- Animations and transitions

## Development Guidelines

### Code Style

- Use TypeScript for all components
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Write reusable, modular components

### State Management

- Use Redux for global state
- Keep component state local when possible
- Use proper TypeScript typing for Redux

### Styling

- Use Tailwind CSS utility classes
- Create component-specific classes for reusable styles
- Ensure responsive design on all screen sizes

## Future Enhancements

- [ ] Payment integration (Stripe, PayPal)
- [ ] Real-time chat support
- [ ] Product reviews and ratings
- [ ] Advanced search with filters
- [ ] Email notifications
- [ ] PWA support
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Performance optimizations

## License

This project is for demonstration purposes only. Please replace placeholder images and content with your own before production use.

## Contributing

This is a showcase project. Feel free to use it as a reference for your own ecommerce implementations.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
