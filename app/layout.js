import './globals.css';

export const metadata = {
  title: 'VaiMoto',
  description: 'App de moto-táxi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
