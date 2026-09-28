'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const FILTROS = ['todas', 'pendente', 'aceita', 'em_andamento', 'concluida', 'cancelada'];

export default function Admin() {
  const [corridas, setCorridas] = useState([]);
  const [filtro, setFiltro] = useState('todas');

  async function carregarTudo() {
    const { data } = await supabase
      .from('corridas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    setCorridas(data || []);
  }

  useEffect(() => {
    carregarTudo();
    const canal = supabase
      .channel('corridas-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'corridas' }, carregarTudo)
      .subscribe();
    return () => supabase.removeChannel(canal);
  }, []);

  const listaFiltrada = filtro === 'todas' ? corridas : corridas.filter((c) => c.status === filtro);

  const totais = FILTROS.slice(1).reduce((acc, s) => {
    acc[s] = corridas.filter((c) => c.status === s).length;
    return acc;
  }, {});

  return (
    <main className="container">
      <div className="painel" style={{ maxWidth: 1100 }}>
        <Link href="/" className="voltar">← Voltar</Link>
        <h1>Painel Admin — VaiMoto</h1>

        <div className="botoes" style={{ marginBottom: 20 }}>
          {FILTROS.map((f) => (
            <button
              key={f}
              className="acao"
              style={{ opacity: filtro === f ? 1 : 0.5, fontSize: '0.85rem' }}
              onClick={() => setFiltro(f)}
            >
              {f === 'todas' ? `Todas (${corridas.length})` : `${f.replace('_', ' ')} (${totais[f] || 0})`}
            </button>
          ))}
        </div>

        {listaFiltrada.length === 0 && <p className="subtitle">Nenhuma corrida nesse filtro.</p>}

        {listaFiltrada.map((c) => (
          <div className="card" key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <p><strong>{c.passageiro_nome}</strong></p>
                <p className={`status-${c.status}`}>Status: {c.status.replace('_', ' ')}</p>
                {c.motorista_nome && <p style={{ fontSize: '0.85rem' }}>Motorista: {c.motorista_nome}</p>}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9aa5b1', textAlign: 'right' }}>
                <p>{new Date(c.created_at).toLocaleString('pt-BR')}</p>
                <p>Origem: {c.origem_lat.toFixed(4)}, {c.origem_lng.toFixed(4)}</p>
                <p>Destino: {c.destino_lat.toFixed(4)}, {c.destino_lng.toFixed(4)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
