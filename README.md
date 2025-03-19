# Brand Zone MVP

## Visão Geral

O Brand Zone é uma plataforma para gerenciamento e organização de referências visuais para profissionais de marketing e design. Ela permite que os usuários organizem imagens e paletas de cores em grupos, atribuam tags e adicionem comentários, criando uma biblioteca visual estruturada para projetos de branding.

Este MVP oferece três módulos principais:
- **Dashboard**: página inicial com resumo de uso das paletas, grupos, tags e imagens, proporcionando uma visão geral estatística do conteúdo do usuário.
- **Módulo de Imagens**: gerenciamento completo de imagens, incluindo upload, organização e anotações.
- **Módulo de Paletas de Cores**: criação e gerenciamento de paletas de cores personalizadas.

## Tecnologias Utilizadas

- **Next.js 15**: Framework React com suporte a renderização híbrida e rotas API.
- **React 19**: Biblioteca para construção de interfaces de usuário.
- **TypeScript**: Superset de JavaScript com tipagem estática.
- **Prisma**: ORM para interação com o banco de dados PostgreSQL.
- **Clerk**: Solução completa para autenticação e gerenciamento de usuários.
- **Tailwind CSS**: Framework CSS utility-first para design rápido e responsivo.
- **Shadcn/UI**: Componentes de UI reutilizáveis e personalizáveis.
- **OpenAI**: API utilizada para geração de imagens baseadas em descrições textuais.
- **Cloudinary**: Serviço para hospedagem e gerenciamento de imagens.
- **Jest**: Framework para testes unitários.

## Live Demo

A aplicação está disponível em [brand-zone-mvp.vercel.app](https://brand-zone-mvp.vercel.app)

## Instalação e Execução

### Pré-requisitos

- Node.js (versão indicada no arquivo .nvmrc)
- Conta no Clerk para autenticação
- Conta no Neon DB (PostgreSQL)
- Conta no OpenAI para geração de imagens
- Conta no Cloudinary para armazenamento de imagens

### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e preencha as seguintes variáveis:

```bash
# Neon DB - https://neon.tech/
DATABASE_URL=

# Clerk - https://clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# OpenAI - https://platform.openai.com/
OPENAI_API_KEY=

# Cloudinary - Já configurado no .env.example, mas você pode substituir por sua própria conta
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

### Instalação

```bash
# Instalação das dependências
npm install --legacy-peer-deps
# O --legacy-peer-deps é necessário pois o projeto usa a versão 19 do React,
# que ainda não é amplamente suportada por todas as dependências

# Gerar o cliente Prisma
npx prisma generate

# Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
src/
├── app/                   # Estrutura de páginas da aplicação
│   ├── (home)/           # Página inicial
│   ├── images/           # Módulo de gerenciamento de imagens
│   ├── palettes/         # Módulo de gerenciamento de paletas de cores
│   └── api/              # Rotas de API
├── components/           # Componentes globais reutilizáveis
│   ├── fields/           # Componentes de formulário
│   ├── filters/          # Componentes de filtragem
│   ├── layout/           # Componentes de layout
│   ├── ui/               # Componentes de interface
│   └── feedback/         # Componentes de feedback (toasts, alerts)
├── actions/              # Server actions para operações de dados
├── contexts/             # Contextos React para gerenciamento de estado
├── data/                 # Funções para acesso a dados
└── lib/                  # Utilitários e configurações
```

O projeto segue a arquitetura App Router do Next.js, onde cada pasta dentro de `app/` representa uma rota. Os componentes específicos de cada página ficam dentro da pasta `components` de cada rota, enquanto os componentes globais reutilizáveis estão na pasta `components` principal.

Os testes ficam junto do componente testado, sendo que apenas os componentes globais que são reutilizáveis possuem testes unitários implementados.

## Decisões Técnicas e Justificativas

### Arquitetura e Organização do Código

- **Componentes por Página**: Optei por colocar componentes específicos de cada página dentro da própria pasta da página. Esta abordagem facilita a manutenção, já que os componentes específicos estão próximos do seu contexto de uso.

- **Duplicação Controlada**: Existe uma duplicação consciente de código em algumas partes para facilitar a manutenção. Apenas componentes verdadeiramente reutilizáveis foram tornados globais, o que simplifica mudanças específicas em determinadas páginas sem afetar o resto da aplicação.

### Stack Tecnológica

- **Prisma**: Escolhido pela facilidade de modelagem de dados e tipo-segurança entre o banco de dados e o código TypeScript. O schema do Prisma funciona como fonte única de verdade para os tipos de dados.

- **Clerk**: Implementa autenticação completa com suporte a múltiplos provedores, dispensando o desenvolvimento de toda a infraestrutura de auth.

- **Shadcn/UI + Tailwind**: Combinação que permite componentes de UI personalizáveis e estilização eficiente, acelerando o desenvolvimento da interface.

- **OpenAI**: Utilizada para gerar imagens com base em descrições de texto, proporcionando uma forma criativa de adicionar conteúdo ao sistema.

### Deploy

- **Vercel**: Plataforma de deploy escolhida pela integração nativa com Next.js e facilidade de configuração.

## Limitações Conhecidas e Melhorias Futuras

### Limitações

- **Geração de Imagens com OpenAI**: Devido às limitações do plano gratuito da Vercel, a funcionalidade de geração de imagens via OpenAI não funciona no ambiente de produção, pois excede o limite de timeout. Para habilitar essa funcionalidade, seria necessário fazer upgrade para o plano Pro da Vercel.

- **URLs de Imagens Geradas por IA**: As URLs das imagens geradas pela API da OpenAI expiram após um período, pois não estão sendo salvas em servidor próprio. Esta é uma feature experimental implementada para demonstrar a utilidade da geração de imagens por IA, mas para funcionamento completo seria necessário salvar as imagens geradas em serviço de armazenamento permanente, como já acontece com as imagens enviadas via upload.

- **Gerenciamento de Tags**: Atualmente as tags podem ser criadas e atribuídas, mas não existe uma interface dedicada para gerenciá-las (editar, excluir).

### Melhorias Futuras

- Implementar interface para gerenciamento completo de tags
- Otimizar a geração de imagens para funcionar dentro dos limites de timeout
- Adicionar mais opções de visualização para paletas e imagens
- Implementar exportação e importação de dados
- Melhorar a cobertura de testes automáticos
- Adicionar funcionalidades de colaboração entre usuários
