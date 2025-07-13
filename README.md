# 🎓 EduTech API

Uma API educacional robusta e escalável desenvolvida para hackathon da FIAP, utilizando Firebase Functions e TypeScript. Esta API oferece funcionalidades completas para uma plataforma de aprendizagem gamificada.

## 🚀 Visão Geral

A EduTech API é uma solução backend completa para aplicações educacionais que implementa:
- Sistema de gamificação com XP, níveis e conquistas
- Acompanhamento de progresso de estudos
- Gestão de módulos e lições por grade, matéria e dificuldade
- Autenticação segura com Firebase Authentication
- Arquitetura serverless escalável

## ✨ Funcionalidades

### 🎮 Sistema de Gamificação
- **Experiência (XP)**: Sistema de pontuação para engajar estudantes
- **Níveis**: Progressão baseada em XP acumulado
- **Conquistas (Badges)**: Sistema de recompensas por marcos alcançados

### 📊 Acompanhamento de Progresso
- Rastreamento de lições completadas
- Histórico de módulos finalizados
- Estatísticas detalhadas do usuário
- Progresso por matéria e dificuldade

### 📚 Gestão de Conteúdo
- Módulos organizados por:
  - Grade escolar
  - Matéria
  - Nível de dificuldade
- Estrutura hierárquica de módulos e lições
- Sistema de ordenação customizável

### 🔐 Segurança
- Autenticação via Firebase Authentication
- Middleware de autenticação JWT
- Proteção de rotas sensíveis
- Validação de dados de entrada

## 🏗️ Arquitetura

### Stack Tecnológico
- **Backend**: Firebase Functions (Node.js 22)
- **Linguagem**: TypeScript
- **Framework**: Express.js
- **Banco de Dados**: Cloud Firestore
- **Autenticação**: Firebase Authentication
- **Hosting**: Firebase Hosting
- **Região**: South America East 1

### Estrutura do Projeto

```
edutech-api/
├── functions/
│   ├── src/
│   │   ├── index.ts                 # Ponto de entrada da API
│   │   ├── shared/
│   │   │   └── router.ts           # Roteador principal
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts   # Middleware de autenticação
│   │   ├── user/
│   │   │   ├── controller/         # Controladores de usuário
│   │   │   ├── service/           # Serviços de negócio
│   │   │   └── router/            # Rotas de usuário
│   │   ├── seeds/
│   │   │   └── user.seeds.ts      # Scripts de seed
│   │   └── config/
│   │       └── firebase-adminsdk.json
│   ├── lib/                       # Código compilado
│   └── package.json
├── public/                        # Arquivos estáticos
├── firebase.json                  # Configuração do Firebase
├── firestore.rules               # Regras de segurança
└── firestore.indexes.json        # Índices do Firestore
```

### Padrão de Arquitetura
- **MVC (Model-View-Controller)**: Separação clara de responsabilidades
- **Service Layer**: Lógica de negócio isolada
- **Middleware Pattern**: Autenticação e validação reutilizáveis
- **Repository Pattern**: Abstração do acesso a dados

## 📡 Endpoints da API

### Base URL
```
https://southamerica-east1-[project-id].cloudfunctions.net/api
```

### Rotas Públicas
```http
GET /ping                    # Health check
POST /dados                  # Endpoint genérico de dados
```

### Rotas de Usuário (Autenticadas)
```http
GET /api/user/stats          # Estatísticas do usuário (XP, nível, progresso)
GET /api/user/progress       # Progresso detalhado do usuário
POST /api/user/progress/complete  # Marcar lição como concluída
GET /api/user/badges         # Conquistas do usuário
GET /api/user/modules        # Módulos filtrados por grade/matéria/dificuldade
GET /api/user/modules/:id    # Detalhes de um módulo específico
```

### Parâmetros de Query para Módulos
```
grade: string       # Grade escolar (ex: "5ano", "6ano")
subject: string     # Matéria (ex: "matematica", "portugues")
difficulty: string  # Dificuldade (ex: "facil", "medio", "dificil")
```

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 22+
- Firebase CLI
- Conta Firebase configurada

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd edutech-api
```

2. **Instale as dependências**
```bash
npm install
cd functions && npm install
```

3. **Configure o Firebase**
```bash
firebase login
firebase init
```

4. **Configure as credenciais**
- Adicione o arquivo `firebase-adminsdk.json` em `functions/src/config/`

5. **Execute localmente**
```bash
cd functions
npm run serve
```

6. **Deploy para produção**
```bash
npm run deploy
```

## 🛠️ Scripts Disponíveis

### Root
```bash
npm run deploy      # Deploy completo para Firebase
```

### Functions
```bash
npm run build       # Compilar TypeScript
npm run build:watch # Compilar em modo watch
npm run serve       # Executar emuladores locais
npm run deploy      # Deploy apenas das functions
npm run seed        # Executar scripts de seed
npm run lint        # Linting do código
```

## 📊 Estrutura do Banco de Dados

### Collections Principais

#### Users
```javascript
{
  uid: string,
  xp: number,
  level: number,
  createdAt: timestamp,
  lastActivity: timestamp
}
```

#### Modules
```javascript
{
  id: string,
  title: string,
  description: string,
  grade: string,
  subject: string,
  difficulty: string,
  orderIndex: number,
  lessons: array
}
```

#### Progress (Subcollection)
```javascript
progress/{uid}/items/{docId} {
  moduleId: string,
  lessonId: string,
  completed: boolean,
  completedAt: timestamp
}
```

#### Badges (Subcollection)
```javascript
badges/{uid}/items/{docId} {
  badgeId: string,
  title: string,
  description: string,
  earned: boolean,
  earnedAt: timestamp
}
```

## 🔐 Autenticação

A API utiliza Firebase Authentication com tokens JWT:

1. **Frontend**: Obtém o token via Firebase Auth SDK
2. **Headers**: Inclui `Authorization: Bearer <token>`
3. **Middleware**: Valida o token e extrai o UID do usuário

## 🌐 CORS e Segurança

- CORS configurado para `https://edutech-wine.vercel.app`
- Métodos permitidos: GET, POST
- Headers permitidos: Content-Type, Authorization
- Validação de entrada em todos os endpoints
- Tratamento de erros padronizado

## 📈 Monitoramento

- Logs disponíveis via Firebase Console
- Métricas de performance automáticas
- Limite de 10 instâncias simultâneas
- Região otimizada para América do Sul

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é licenciado sob a licença ISC.

## 👥 Equipe

Desenvolvido durante o hackathon da FIAP - Turma de Pós-graduação.

---

**Frontend conectado**: [EduTech Web App](https://edutech-wine.vercel.app)