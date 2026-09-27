import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <h1>VAIMOTO</h1>
      <p className="subtitle">Sua moto-táxi em Paulo Afonso</p>
      <div className="botoes">
        <Link href="/passageiro" className="botao-opcao">Sou Passageiro</Link>
        <Link href="/motorista" className="botao-opcao">Sou Motorista</Link>
      </div>
      <Link href="/admin" style={{ marginTop: 32, color: '#9aa5b1', fontSize: '0.85rem' }}>
        Painel Admin
      </Link>
    </main>
  );
}
