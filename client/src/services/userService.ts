import { User } from '@shared/schema';

// Mock data for users
const mockUsers: (User & { password: string })[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@logidash.com',
    role: 'admin',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: 2,
    username: 'manager',
    password: 'manager123',
    email: 'manager@logidash.com',
    role: 'manager',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15')
  },
  {
    id: 3,
    username: 'operator',
    password: 'operator123',
    email: 'operator@logidash.com',
    role: 'user',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10')
  }
];

// Current user session
let currentUser: Omit<User, 'password'> | null = null;

export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export const userService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // Set current user (without password)
    const { password: _, ...userWithoutPassword } = user;
    currentUser = userWithoutPassword;
    
    // Return user data with mock token
    return {
      user: userWithoutPassword,
      token: `mock-jwt-token-${Date.now()}`
    };
  },
  
  async register(username: string, email: string, password: string): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if username already exists
    if (mockUsers.some(u => u.username === username)) {
      throw new Error('Username already exists');
    }
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    // Create new user
    const now = new Date();
    const newUser: User & { password: string } = {
      id: Math.max(0, ...mockUsers.map(u => u.id)) + 1,
      username,
      email,
      password,
      role: 'user',
      createdAt: now,
      updatedAt: now
    };
    
    mockUsers.push(newUser);
    
    // Set current user (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    currentUser = userWithoutPassword;
    
    // Return user data with mock token
    return {
      user: userWithoutPassword,
      token: `mock-jwt-token-${Date.now()}`
    };
  },
  
  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Clear current user
    currentUser = null;
  },
  
  async getCurrentUser(): Promise<Omit<User, 'password'> | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return currentUser ? { ...currentUser } : null;
  },
  
  async updateProfile(userId: number, data: Partial<Omit<User, 'id' | 'role' | 'password' | 'createdAt' | 'updatedAt'>>): Promise<Omit<User, 'password'>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user data
    const now = new Date();
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: now
    };
    
    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
      const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
      currentUser = userWithoutPassword;
    }
    
    // Return updated user data (without password)
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
    return userWithoutPassword;
  },
  
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Verify current password
    if (mockUsers[userIndex].password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // Update password
    mockUsers[userIndex].password = newPassword;
    mockUsers[userIndex].updatedAt = new Date();
  }
}; 