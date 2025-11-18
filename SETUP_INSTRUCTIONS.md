# Setup

## Docker (Recomendado)
```bash
docker-compose up
```

## Local (Sem Docker)

### Backend
```bash
cd backend
cp .env.example .env
pnpm install
pnpm prisma migrate dev
pnpm prisma db seed
pnpm start:dev
```

### Frontend
```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
pnpm install
pnpm dev
```

## Credenciais

Atendente: atendente@healthflow.com / senha123
Médico: medico@healthflow.com / senha123
