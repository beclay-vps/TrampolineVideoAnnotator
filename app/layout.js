import './globals.css';

export const metadata = {
  title: 'Annotateur Vidéo Trampoline - FIG Code & Timestamps',
  description: 'Interface web dockerisée pour annoter les sauts de trampoline et codes FIG',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-slate-100 font-sans antialiased overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
