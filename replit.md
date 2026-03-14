# CINEKING+ — Área do Cliente

## Visão Geral
PWA (Progressive Web App) para área do cliente de serviço IPTV. Tema escuro com dourado (#FFD700).

## Stack
- **Backend**: Express + TypeScript + PostgreSQL (Drizzle ORM)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + TanStack Query
- **Roteamento**: wouter
- **Animações**: framer-motion

## Banco de Dados (PostgreSQL)
Tabelas:
- `customers` — clientes com código, plano e vencimento
- `content_requests` — pedidos de conteúdo
- `problem_reports` — relatos de problemas
- `notices` — avisos do sistema
- `games` — jogos do dia (times, horário, campeonato, canal, banner opcional)
- `session` — sessões (connect-pg-simple)

## Autenticação
- Login por código único do cliente
- Sessão via express-session + PostgreSQL store
- ADMIN123 = admin | USER123 = cliente teste

## Funcionalidades do Cliente
- Dashboard com card de plano, PIX renovação, WhatsApp suporte
- Avisos do sistema
- Jogos do Dia (página /jogos — times, horário, canal, campeonato)
- Pedidos: solicitar conteúdo + relatar problema

## Funcionalidades Admin
- /admin/clientes — CRUD completo de clientes
- /admin/jogos — CRUD de jogos com upload de banner (base64)
- /admin/avisos — Publicar/deletar avisos
- /admin/relatorios — Ver pedidos e relatos

## PWA
- Manifest: /public/manifest.json
- Service Worker: /public/sw.js (cache + push notifications)
- Notificações do navegador para aviso de plano vencendo
- Banner "Instalar App" integrado no layout

## Design
- Cor primária: hsl(48 100% 50%) = #FFD700
- Fundo: #080811
- Fontes: Outfit (display) + Plus Jakarta Sans (body)
- Glass cards, bordas subtis, efeitos dourados

## PIX
- Chave: 75983734675 (celular)
- Nome: Ed Carlos B. S. Junior
- Valor: R$30

## WhatsApp Suporte
https://wa.me/message/LAAKUUII3T6LA1
