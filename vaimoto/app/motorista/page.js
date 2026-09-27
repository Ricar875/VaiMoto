'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Motorista() {
  const [corridas, setCorridas] = useState([]);
  const [nomeMotorista, setNomeMotorista] = useState('');
  const motoristaId = useRef('motorista-' + Math.random().toString(36).slice(2, 8)).current;
  const watchIdRef = useRef(null);

  async function carregarCorridas() {
    const { data } = await supabase
      .from('corridas')
      .select('*')
      .in('status', ['pendente', 'aceita', 'em_andamento'])
      .order('created_at', { ascending: false });
    setCorridas(data || []);
  }

  useEffect(() => {
    carregarCorridas();
    const canal = supabase
      .channel('corridas-motorista')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'corridas' }, carregarCorridas)
      .subscribe();
    return () => supabase.removeChannel(canal);
  }, []);

  useEffect(() => {
    const minhaCorridaAtiva = corridas.find(
      (c) => c.motorista_id === motoristaId && ['aceita', 'em_andamento'].includes(c.status)
    );

    if (minhaCorridaAtiva && !watchIdRef.current && navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (pos) => {
          await supabase
            .from('corridas')
            .update({ motorista_lat: pos.coords.latitude, motorista_lng: pos.coords.longitude })
            .eq('id', minhaCorridaAtiva.id);
        },
        (err) => console.error('Erro geolocalização:', err),
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }

    if (!minhaCorridaAtiva && watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [corridas, motoristaId]);

  async function atualizarStatus(id, status) {
    const payload = { status };
    if (status === 'aceita') {
      payload.motorista_id = motoristaId;
      payload.motorista_nome = nomeMotorista || 'Motorista';
    }
    if (status === 'concluida' || status === 'cancelada') {
      payload.motorista_lat = null;
      payload.motorista_lng = null;
    }
    await supabase.from('corridas').update(payload).eq('id', id);
  }

  return (
    <main className="container">
      <div className="painel">
        <Link href="/" className="voltar">← Voltar</Link>
        <h1>Corridas disponíveis</h1>
        <input
          placeholder="Seu nome (motorista)"
          value={nomeMotorista}
          onChange={(e) => setNomeMotorista(e.target.value)}
        />
        {corridas.length === 0 && <p className="subtitle">Nenhuma corrida no momento.</p>}
        {corridas.map((c) => (
          <div className="card" key={c.id}>
            <p><strong>{c.passageiro_nome}</strong></p>
            <p className={`status-${c.status}`}>Status: {c.status.replace('_', ' ')}</p>
            <p style={{ fontSize: '0.85rem', color: '#9aa5b1' }}>
              Origem: {c.origem_lat.toFixed(4)}, {c.origem_lng.toFixed(4)} → Destino: {c.destino_lat.toFixed(4)}, {c.destino_lng.toFixed(4)}
            </p>
            {c.status === 'pendente' && (
              <button className="acao" onClick={() => atualizarStatus(c.id, 'aceita')}>Aceitar corrida</button>
            )}
            {c.status === 'aceita' && c.motorista_id === motoristaId && (
              <button className="acao" onClick={() => atualizarStatus(c.id, 'em_andamento')}>Iniciar corrida</button>
            )}
            {c.status === 'em_andamento' && c.motorista_id === motoristaId && (
              <button className="acao" onClick={() => atualizarStatus(c.id, 'concluida')}>Concluir corrida</button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
