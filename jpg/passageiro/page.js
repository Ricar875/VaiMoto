'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const MapaSelecao = dynamic(() => import('@/components/MapaSelecao'), { ssr: false });
const MapaAcompanhamento = dynamic(() => import('@/components/MapaAcompanhamento'), { ssr: false });

export default function Passageiro() {
  const [nome, setNome] = useState('');
  const [origem, setOrigem] = useState(null);
  const [destino, setDestino] = useState(null);
  const [modoSelecao, setModoSelecao] = useState('origem');
  const [corridaAtual, setCorridaAtual] = useState(null);

  useEffect(() => {
    if (!corridaAtual) return;
    const canal = supabase
      .channel('corrida-' + corridaAtual.id)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'corridas', filter: `id=eq.${corridaAtual.id}` },
        (payload) => setCorridaAtual(payload.new)
      )
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, [corridaAtual?.id]);

  async function pedirCorrida() {
    if (!nome || !origem || !destino) {
      alert('Preencha seu nome e marque origem e destino no mapa.');
      return;
    }
    const { data, error } = await supabase
      .from('corridas')
      .insert({
        passageiro_nome: nome,
        origem_lat: origem.lat,
        origem_lng: origem.lng,
        destino_lat: destino.lat,
        destino_lng: destino.lng,
        status: 'pendente',
      })
      .select()
      .single();

    if (error) {
      alert('Erro ao pedir corrida: ' + error.message);
      return;
    }
    setCorridaAtual(data);
  }

  if (corridaAtual) {
    const temMotorista = corridaAtual.motorista_lat && corridaAtual.motorista_lng;
    return (
      <main className="container">
        <div className="painel">
          <h1>Sua corrida</h1>
          <div className="card">
            <p>Passageiro: {corridaAtual.passageiro_nome}</p>
            <p className={`status-${corridaAtual.status}`}>
              Status: {corridaAtual.status.replace('_', ' ')}
            </p>
            {corridaAtual.motorista_nome && <p>Motorista: {corridaAtual.motorista_nome}</p>}
          </div>
          {['aceita', 'em_andamento'].includes(corridaAtual.status) && (
            <div className="mapa">
              <MapaAcompanhamento
                origem={{ lat: corridaAtual.origem_lat, lng: corridaAtual.origem_lng }}
                destino={{ lat: corridaAtual.destino_lat, lng: corridaAtual.destino_lng }}
                motorista={temMotorista ? { lat: corridaAtual.motorista_lat, lng: corridaAtual.motorista_lng } : null}
              />
            </div>
          )}
          {corridaAtual.status === 'concluida' && (
            <p className="subtitle">Corrida concluída. Obrigado por usar o VaiMoto!</p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="painel">
        <Link href="/" className="voltar">← Voltar</Link>
        <h1>Pedir corrida</h1>
        <input
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <div className="botoes" style={{ marginBottom: 12 }}>
          <button
            className="acao"
            style={{ opacity: modoSelecao === 'origem' ? 1 : 0.5 }}
            onClick={() => setModoSelecao('origem')}
          >
            Marcar Origem
          </button>
          <button
            className="acao"
            style={{ opacity: modoSelecao === 'destino' ? 1 : 0.5 }}
            onClick={() => setModoSelecao('destino')}
          >
            Marcar Destino
          </button>
        </div>
        <div className="mapa">
          <MapaSelecao
            modo={modoSelecao}
            origem={origem}
            destino={destino}
            onSelecionar={(ponto) => {
              if (modoSelecao === 'origem') setOrigem(ponto);
              else setDestino(ponto);
            }}
          />
        </div>
        <button className="acao" onClick={pedirCorrida}>Confirmar corrida</button>
      </div>
    </main>
  );
}
