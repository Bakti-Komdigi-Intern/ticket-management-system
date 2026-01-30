import { redirect } from 'next/navigation';

export default function RootPage() {
  // Langsung redirect ke halaman login
  redirect('/login');
}