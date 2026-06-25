# MedMonstros — Frontend

Interface web da plataforma MedMonstros. Consome a API do repositorio `medmonstros-backend`.

## Tecnologias

- React 18
- Vite
- Tailwind CSS v4
- React Router
- Axios

## Como rodar

Requer Node.js 18+. O backend precisa estar rodando em `localhost:8080` (ou outro endereco
configurado em `.env`).

```bash
cp .env.example .env
npm install
npm run dev
```

O Vite encaminha `/api` para o backend (proxy configurado via `VITE_BACKEND_URL` em `.env`).
