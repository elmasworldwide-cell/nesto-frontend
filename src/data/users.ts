export interface DummyUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'tenant' | 'owner' | 'agent' | 'admin';
}

export const dummyUsers: DummyUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'tenant',
  },
  {
    id: '2',
    name: 'Agent Smith',
    email: 'agent@example.com',
    password: 'agentpass',
    role: 'agent',
  },
];
