import fs from 'fs';
import path from 'path';

// Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  password: string;
  photoURL?: string;
  createdAt: string;
}

export interface Idea {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  createdAt: string;
  isMarketplace: boolean;
}

// Database file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const IDEAS_FILE = path.join(DATA_DIR, 'ideas.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initialize empty files if they don't exist
function initializeFiles() {
  ensureDataDir();
  
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  
  if (!fs.existsSync(IDEAS_FILE)) {
    fs.writeFileSync(IDEAS_FILE, JSON.stringify([], null, 2));
  }
}

// Read data from files
function readUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

function readIdeas(): Idea[] {
  try {
    const data = fs.readFileSync(IDEAS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading ideas:', error);
    return [];
  }
}

// Write data to files
function writeUsers(users: User[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users:', error);
  }
}

function writeIdeas(ideas: Idea[]) {
  try {
    fs.writeFileSync(IDEAS_FILE, JSON.stringify(ideas, null, 2));
  } catch (error) {
    console.error('Error writing ideas:', error);
  }
}

// Initialize database
initializeFiles();

// Database operations
export const db = {
  // User operations
  users: {
    create: (user: Omit<User, 'id' | 'createdAt'>): User => {
      const users = readUsers();
      const newUser: User = {
        ...user,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      writeUsers(users);
      return newUser;
    },
    
    findByEmail: (email: string): User | undefined => {
      const users = readUsers();
      return users.find(user => user.email === email);
    },
    
    findById: (id: string): User | undefined => {
      const users = readUsers();
      return users.find(user => user.id === id);
    },
    
    update: (id: string, updates: Partial<User>): User | null => {
      const users = readUsers();
      const index = users.findIndex(user => user.id === id);
      if (index === -1) return null;
      
      users[index] = { ...users[index], ...updates };
      writeUsers(users);
      return users[index];
    },
    
    delete: (id: string): boolean => {
      const users = readUsers();
      const filteredUsers = users.filter(user => user.id !== id);
      if (filteredUsers.length === users.length) return false;
      
      writeUsers(filteredUsers);
      return true;
    }
  },
  
  // Idea operations
  ideas: {
    create: (idea: Omit<Idea, 'id' | 'createdAt'>): Idea => {
      const ideas = readIdeas();
      const newIdea: Idea = {
        ...idea,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      ideas.push(newIdea);
      writeIdeas(ideas);
      return newIdea;
    },
    
    findAll: (): Idea[] => {
      return readIdeas().sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    
    findByUserId: (userId: string): Idea[] => {
      const ideas = readIdeas();
      return ideas
        .filter(idea => idea.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    
    findMarketplace: (): Idea[] => {
      const ideas = readIdeas();
      return ideas
        .filter(idea => idea.isMarketplace)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    
    findById: (id: string): Idea | undefined => {
      const ideas = readIdeas();
      return ideas.find(idea => idea.id === id);
    },
    
    update: (id: string, updates: Partial<Idea>): Idea | null => {
      const ideas = readIdeas();
      const index = ideas.findIndex(idea => idea.id === id);
      if (index === -1) return null;
      
      ideas[index] = { ...ideas[index], ...updates };
      writeIdeas(ideas);
      return ideas[index];
    },
    
    delete: (id: string): boolean => {
      const ideas = readIdeas();
      const filteredIdeas = ideas.filter(idea => idea.id !== id);
      if (filteredIdeas.length === ideas.length) return false;
      
      writeIdeas(filteredIdeas);
      return true;
    },
    
    deleteByUserId: (userId: string): number => {
      const ideas = readIdeas();
      const filteredIdeas = ideas.filter(idea => idea.userId !== userId);
      const deletedCount = ideas.length - filteredIdeas.length;
      
      if (deletedCount > 0) {
        writeIdeas(filteredIdeas);
      }
      
      return deletedCount;
    }
  }
}; 