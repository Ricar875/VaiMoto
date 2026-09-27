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

## Deploy no GitHub Pages (automático)

Esse projeto já vem configurado pra buildar e publicar sozinho no GitHub Pages a cada push na branch `main`, usando GitHub Actions.

1. No repositório no GitHub, vá em **Settings → Pages** e em "Build and deployment" escolha **Source: GitHub Actions**.
2. Vá em **Settings → Secrets and variables → Actions → New repository secret** e crie:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (com os valores reais do seu projeto Supabase — os mesmos do `.env.local`)
3. Faça o push pra `main` (`git push`). O Actions builda e publica automaticamente.
4. O site fica em `https://SEU-USUARIO.github.io/VaiMoto/`

**Importante:** o `basePath` no `next.config.js` está fixo como `/VaiMoto`. Se o nome do seu repositório no GitHub for diferente (maiúsculas/minúsculas importam), ajuste essa linha pra bater exatamente com o nome do repositório.

## Deploy na Vercel (alternativa)

1. Importe o repositório no https://vercel.com
2. Adicione as mesmas variáveis do `.env.local` em **Environment Variables**
3. Clique em Deploy

Na Vercel **não precisa** do `basePath` — se for usar Vercel como principal, remova as linhas `output`, `basePath` e `trailingSlash` do `next.config.js`, ou deixe as duas rotas de deploy em branches diferentes.
