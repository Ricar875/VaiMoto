# VaiMoto

App de moto-táxi (Next.js + Supabase + Leaflet) para Paulo Afonso - BA.

## Como configurar

1. Crie um projeto em https://supabase.com
2. No **SQL Editor** do Supabase, rode o conteúdo de `supabase.sql`
3. Em **Project Settings → API**, copie a `Project URL` e a `anon public key`
4. Renomeie `.env.local.example` para `.env.local` e preencha as duas variáveis

## Como rodar local

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Como subir no GitHub

```bash
git init
git add .
git commit -m "primeira versão do vaimoto"
git remote add origin https://github.com/SEU-USUARIO/vaimoto.git
git branch -M main
git push -u origin main
```

## Deploy na Vercel

1. Importe o repositório no https://vercel.com
2. Adicione as mesmas variáveis do `.env.local` em **Environment Variables**
3. Clique em Deploy
