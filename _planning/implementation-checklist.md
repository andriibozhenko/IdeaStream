# Implementation Checklist

This checklist breaks down the key features into specific implementation tasks.

### Feature: User Authentication

- [x] Create Sign Up page (`/signup`)
- [x] Create Sign In page (`/login`)
- [x] Implement Sign Up API endpoint (`/api/auth/signup`)
- [x] Implement Sign In API endpoint (`/api/auth/signin`)
- [x] Implement Sign Out API endpoint (`/api/auth/signout`)
- [x] Implement "Get Me" API endpoint for user data (`/api/auth/me`)
- [x] Implement Delete Account API endpoint (`/api/auth/delete-account`)
- [x] Implement Google SSO
- [ ] Implement "Forgot Password" functionality

### Feature: Core Idea Management

- [x] Create `idea-card.tsx` component for a single idea
- [x] Create `idea-list.tsx` component to display multiple ideas
- [x] Create `idea-form.tsx` component for creating/editing ideas
- [x] Create main ideas page (`/`) to host the idea components
- [ ] Implement API endpoint to **CREATE** a new idea
- [ ] Implement API endpoint to **READ** all of a user's ideas
- [ ] Implement API endpoint to **UPDATE** an existing idea
- [ ] Implement API endpoint to **DELETE** an idea
- [ ] Connect the frontend components to the API endpoints

### Feature: Idea Marketplace

- [x] Create Marketplace page (`/marketplace`)
- [ ] Implement API endpoint to fetch all **public** ideas
- [ ] Design and implement the UI to display public ideas
- [ ] Implement search functionality
- [ ] Implement filtering and sorting options

### Feature: AI-Powered Features

- [x] Initial setup for Genkit (`src/ai/genkit.ts`)
- [ ] Develop an AI flow for generating new idea suggestions
- [ ] Integrate the idea generation flow into the `idea-form.tsx`
- [ ] Develop an AI flow for summarizing an existing idea
- [ ] Add a "Summarize with AI" button to the `idea-card.tsx` 