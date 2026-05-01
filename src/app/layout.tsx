
import type {Metadata} from 'next';
import './globals.css';
import { Toast } from '../components/ui/toast';

export const metadata: Metadata = {
  title: 'Clarity Flow | AI-Driven Life Strategic Planning',
  description: 'You are one decision away from changing your life. Get your life clarity in 2 minutes with Clarity Flow AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {children}
        <Toast />
      </body>
    </html>
  );
}
