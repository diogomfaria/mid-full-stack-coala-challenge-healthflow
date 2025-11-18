[Seu Nome] | [Data]

## Descrição

Implementação completa do sistema HealthFlow conforme especificações do desafio técnico.

**Funcionalidades implementadas:**
- Sistema de autenticação com JWT e autorização por roles (ATTENDANT/DOCTOR)
- CRUD de usuários com validação e hash de senha
- Upload e gerenciamento de exames médicos
- Processamento assíncrono simulado via RabbitMQ
- Interface para atendente cadastrar exames
- Interface para médico laudar exames processados
- Polling automático para atualização em tempo real
- Estados do exame: PENDING → PROCESSING → DONE → REPORTED

## Decisões Técnicas e Trade-offs

**Arquitetura Backend**
- NestJS com módulos separados (users, auth, exams) para manter o código organizado e escalável
- Prisma ORM pela simplicidade de uso com TypeScript e migrations automatizadas
- Guards customizados para autenticação (JWT) e autorização (Roles) aplicados por decorator

**Processamento Assíncrono**
- RabbitMQ para fila de processamento simulado com consumer dedicado
- Simulação com Math.random() e setTimeout para demonstrar o fluxo assíncrono
- Trade-off: Não implementei DLQ ou retry policies por ser apenas teste técnico

**Frontend**
- Next.js com App Router para melhor performance e SSR quando necessário
- Tailwind CSS + Framer Motion para UI moderna com animações suaves
- Polling a cada 10s com reconciliação por ID para evitar re-renders desnecessários
- localStorage para JWT (consciente do risco XSS, mas aceitável para teste técnico)

**Banco de Dados**
- PostgreSQL com índices em campos de query frequente (status, createdById, createdAt)
- Schema com relacionamentos simples User -> MedicalExam

**Docker**
- Docker Compose para facilitar avaliação com setup automatizado
- Migrations e seed rodam automaticamente ao subir containers

## URL de Deploy

Não realizei deploy em produção. O projeto roda localmente via Docker.

## Como executar o projeto localmente

```bash
git clone https://github.com/[usuario]/mid-full-stack-coala-challenge-healthflow
cd mid-full-stack-coala-challenge-healthflow
docker-compose up
```

Aguarde cerca de 30 segundos para os serviços iniciarem.

Acesse:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- RabbitMQ Management: http://localhost:15672 (healthflow/healthflow123)

**Credenciais de teste (já criadas via seed):**
- Atendente: atendente@healthflow.com / senha123
- Médico: medico@healthflow.com / senha123

## Comentários Adicionais ou implementação dos requisitos bonus

**Implementações além do solicitado:**
- UI/UX refinada com animações e microinterações (Framer Motion)
- Polling otimizado com reconciliação de estado para evitar jumps visuais
- Seções colapsáveis na tela do atendente para melhor organização
- Listas com scroll interno e headers sticky para grandes volumes de dados
- Validações robustas nos DTOs com class-validator
- Docker Compose completo para facilitar avaliação
- Seed automático com dados de exemplo

**Observabilidade (Bonus parcialmente implementado):**
- Logs básicos no consumer RabbitMQ
- Tratamento de erros centralizado
- Não implementei interceptor global por questão de tempo, mas a estrutura está preparada

Checklist

- [x] O código segue as diretrizes e padrões de estilo do projeto.
- [x] Eu revisei o código e verifiquei a presença de bugs ou problemas.
- [x] Eu verifiquei que todas as funcionalidades estão funcionando como esperado.
- [ ] Eu realizei o deploy da aplicação para um ambiente de produção.
