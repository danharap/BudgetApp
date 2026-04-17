import { Colors } from './colors';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  glowColor: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food & Drink',
    icon: 'restaurant',
    color: Colors.orange,
    glowColor: Colors.orangeGlow,
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: 'car',
    color: Colors.blue,
    glowColor: Colors.blueGlow,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'bag-handle',
    color: Colors.purple,
    glowColor: Colors.purpleGlow,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'film',
    color: Colors.pink,
    glowColor: 'rgba(236, 72, 153, 0.20)',
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'medical',
    color: Colors.red,
    glowColor: Colors.redGlow,
  },
  {
    id: 'housing',
    name: 'Housing',
    icon: 'home',
    color: Colors.teal,
    glowColor: 'rgba(20, 184, 166, 0.20)',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: 'flash',
    color: Colors.yellow,
    glowColor: 'rgba(234, 179, 8, 0.20)',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    icon: 'repeat',
    color: Colors.indigo,
    glowColor: 'rgba(99, 102, 241, 0.20)',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'airplane',
    color: Colors.accent,
    glowColor: Colors.accentGlow,
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'book',
    color: Colors.blue,
    glowColor: Colors.blueGlow,
  },
  {
    id: 'savings',
    name: 'Savings',
    icon: 'wallet',
    color: Colors.accent,
    glowColor: Colors.accentGlow,
  },
  {
    id: 'income',
    name: 'Income',
    icon: 'trending-up',
    color: Colors.accent,
    glowColor: Colors.accentGlow,
  },
  {
    id: 'transfer',
    name: 'Transfer',
    icon: 'swap-horizontal',
    color: Colors.blue,
    glowColor: Colors.blueGlow,
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'ellipsis-horizontal',
    color: Colors.textMuted,
    glowColor: 'rgba(71, 85, 105, 0.20)',
  },
];

export const getCategoryById = (id: string): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
