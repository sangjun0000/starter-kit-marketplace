import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Starter Kit Marketplace',
  description: 'Role-based tools for Claude Code',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
