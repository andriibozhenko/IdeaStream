# IdeaStream

A modern web application for sharing and discovering ideas. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Simple local authentication system with session management
- **Idea Sharing**: Users can post their thoughts and ideas
- **Marketplace**: Public marketplace where users can share their best ideas
- **Modern UI**: Beautiful, responsive interface built with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ 
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

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication System

The app uses a simple local authentication system:

- **Sign Up**: Users can create accounts with email, password, and display name
- **Sign In**: Existing users can sign in with their credentials
- **Session Management**: Uses HTTP-only cookies for secure session management
- **Local Storage**: User data and ideas are stored locally in JSON files

### Data Storage

- User data: `data/users.json`
- Ideas data: `data/ideas.json`

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes for authentication
│   ├── login/             # Login/signup page
│   ├── marketplace/       # Marketplace page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Navigation header
│   ├── idea-card.tsx     # Individual idea display
│   ├── idea-form.tsx     # Idea creation form
│   └── idea-list.tsx     # Ideas list component
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication functions
│   ├── database.ts       # Local database operations
│   ├── actions.ts        # Server actions
│   └── types.ts          # TypeScript type definitions
└── hooks/                # Custom React hooks
    └── use-auth-client.tsx # Client-side auth hook
```

## Development

- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
