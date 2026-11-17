# AGENTS & AI INSTRUCTIONS

Para qualquer agente ou IA que for dar continuidade ao desenvolvimento deste projeto, leia obrigatoriamente o arquivo:

👉 **[AI_HANDOFF.md](./AI_HANDOFF.md)**

Ele contém:
1. Contexto completo do ecossistema PW (estilo Discord) + Painel Administrativo da Loja.
2. Tudo o que já foi desenvolvido e estruturado (Next.js 16, Supabase PostgreSQL/Storage, Firebase Webhook, Discord Dark Theme, Live Profile Preview, Modais, Seed).
3. O Roadmap exato de tarefas pendentes e próximos passos.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
