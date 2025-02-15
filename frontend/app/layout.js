import './globals.css';

export const metadata = {
  title: 'My Chat App',
  description: 'A chat app connecting Next.js with Flask',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}