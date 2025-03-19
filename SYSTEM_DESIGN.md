# Brand Zone MVP - Design de Sistema

## 1. Arquitetura Geral

### 1.1 Diagrama de Componentes

```
                                  +------------------+
                                  |                  |
                                  |  Authentication  |
                                  |  (Clerk)         |
                                  |                  |
                                  +--------+---------+
                                           |
                                           v
+------------------+    +-----------------+------------------+    +------------------+
|                  |    |                                    |    |                  |
|                  |    |             Next.js                |    |                  |
|  Client          |    |  +------------+   +-------------+ |    |  PostgreSQL DB   |
|  Browser         <---->  |  App Router|   |Server Actions| <---->  (Neon DB)      |
|                  |    |  +------------+   +-------------+ |    |                  |
|                  |    |                                    |    |                  |
+------------------+    +--+------------------+-------+-----+    +------------------+
                           |                  |       |
                           v                  v       v
                  +----------------+  +-------------+ +----------------+
                  |                |  |             | |                |
                  | OpenAI API     |  | Cloudinary  | | Prisma ORM     |
                  | (Image         |  | (Image      | | (Database      |
                  |  Generation)   |  |  Storage)   | |  Access)       |
                  |                |  |             | |                |
                  +----------------+  +-------------+ +----------------+
```

### 1.2 Fluxo de Dados

O fluxo de dados na aplicação segue o seguinte padrão:

1. **Autenticação**:
   - O usuário se autentica através do Clerk
   - Clerk gerencia todo o fluxo de autenticação e fornece tokens JWT
   - O middleware do Next.js valida as sessões em cada requisição

2. **Requisições de Dados**:
   - Componentes de página iniciam o carregamento de dados via Server Components
   - Os dados são buscados do banco de dados PostgreSQL através do Prisma ORM
   - Os resultados são retornados para o componente de página e passados para componentes client-side

3. **Interações do Usuário**:
   - As ações do usuário (criar, editar, excluir) são processadas pelos componentes client-side
   - As alterações são enviadas ao servidor através de Server Actions
   - Os Server Actions atualizam o banco de dados via Prisma
   - A UI é atualizada para refletir as mudanças através de revalidação de dados

4. **Integração com Serviços Externos**:
   - Imagens são armazenadas no Cloudinary
   - Geração de imagens é processada pela API da OpenAI

### 1.3 Modelo de Estado da Aplicação

A aplicação utiliza múltiplas estratégias para gerenciamento de estado:

1. **Estado Global**:
   - Contexto React (SharedContext) para dados compartilhados entre componentes (grupos, tags)
   - URLSearchParams para persistir o estado dos filtros e opções de visualização

2. **Estado de Componentes**:
   - Estado local com useState para gerenciamento de UI (modais, formulários)
   - React Hook Form para gerenciamento de formulários

3. **Estado do Servidor**:
   - Dados principais armazenados no PostgreSQL
   - Cache de React Server Components para otimização de performance

## 2. Componentes Principais

### 2.1 Módulos Principais

#### 2.1.1 Dashboard (Homepage)

**Responsabilidades**:
- Exibir estatísticas de uso (contagem de imagens, paletas, grupos, tags)
- Apresentar gráficos de distribuição de recursos por grupos e tags
- Fornecer links rápidos para os módulos principais

**Componentes**:
- `HomeDashboard`: Coordena a exibição geral das estatísticas
- `StatisticsSummary`: Exibe contadores de recursos
- `GroupStatisticsChart`: Gráfico de distribuição por grupos
- `TagStatisticsChart`: Gráfico de distribuição por tags
- Componentes de feedback: `EmptyStatistics`, `StatisticsError`, `StatisticsLoading`

#### 2.1.2 Módulo de Imagens

**Responsabilidades**:
- Gerenciar a visualização e filtro de imagens
- Permitir diferentes modos de visualização (grid, lista, detalhes)
- Facilitar a adição, edição e exclusão de imagens
- Permitir organização por grupos e tags

**Componentes**:
- `ImagesModule`: Componente principal que coordena todas as interações
- Visualizações: `ImageGrid`, `ImageList`, `ImageListDetail`
- Cards: `ImageCardGrid`, `ImageCardList`, `ImageCardListDetail`
- Formulários: 
  - `AddImageByURLForm`: Adiciona imagem a partir de uma URL
  - `UploadImageForm`: Faz upload de imagem local via Cloudinary
  - `GenerateImageForm`: Cria imagem a partir de prompt usando a API da OpenAI
  - `EditImageForm`: Edita detalhes de imagem existente

#### 2.1.3 Módulo de Paletas de Cores

**Responsabilidades**:
- Gerenciar a visualização e filtro de paletas de cores
- Permitir diferentes modos de visualização (grid, lista, detalhes)
- Facilitar a adição, edição e exclusão de paletas
- Permitir organização por grupos e tags

**Componentes**:
- `PalettesModule`: Componente principal que coordena todas as interações
- Visualizações: `PaletteGrid`, `PaletteList`, `PaletteListDetail`
- Cards: `PaletteCardGrid`, `PaletteCardList`, `PaletteCardListDetail`
- Formulários: `AddPaletteForm`, `EditPaletteForm`

### 2.2 Componentes de Interface

#### 2.2.1 Componentes de Filtro

**Responsabilidades**:
- Permitir que o usuário filtre recursos por diversos critérios
- Exibir de forma clara os filtros aplicados
- Facilitar a remoção de filtros

**Componentes**:
- `GroupSelect`: Seleção de grupo para filtrar
- `TagsSelect`: Seleção de tags para filtrar
- `SearchInput`: Campo de busca por palavra-chave
- `AppliedFilters`: Exibe os filtros atualmente aplicados e permite removê-los

#### 2.2.2 Componentes de Visualização

**Responsabilidades**:
- Permitir que o usuário alterne entre diferentes modos de visualização
- Adaptar a exibição dos dados conforme a preferência do usuário

**Componentes**:
- `ToggleView`: Alterna entre os modos de visualização primários (grid, lista, detalhes)
- `ToggleGroupView`: Alterna entre visualização agrupada ou individual

### 2.3 Interações entre Componentes

As interações entre componentes seguem um fluxo unidirecional:

1. **Módulos de Recursos → Componentes de Visualização**:
   - Os módulos (`ImagesModule`, `PalettesModule`) passam dados e configurações para os componentes de visualização
   - As interações do usuário na visualização são propagadas de volta para o módulo

2. **Componentes de Filtro → Módulos de Recursos**:
   - Usuários interagem com os filtros para modificar a consulta
   - Os filtros emitem eventos que o módulo principal captura
   - O módulo atualiza a URL com os novos parâmetros
   - A página recarrega os dados filtrados e os passa para o módulo

3. **Componentes de Ação → Backend**:
   - Botões e formulários acionam Server Actions
   - Server Actions modificam dados no banco de dados
   - Os módulos observam os resultados e atualizam a UI

## 3. Estratégia de Gerenciamento de Dados

### 3.1 Estrutura de Dados

A estrutura de dados segue um modelo relacional implementado com Prisma:

**Entidades Principais**:
- `Images`: Armazena referências às imagens (nome, URL, comentários)
- `ColorPalettes`: Armazena paletas de cores (nome, cores, comentários)
- `Group`: Organiza recursos em grupos
- `Tag`: Provê classificação adicional para recursos
- `TagsOnImages` e `TagsOnPalettes`: Tabelas de junção para relacionamentos many-to-many

**Relacionamentos**:
- Um usuário pode ter múltiplos recursos (imagens, paletas, grupos, tags)
- Um grupo pode conter múltiplas imagens e paletas
- Uma tag pode ser aplicada a múltiplas imagens e paletas
- Uma imagem ou paleta pode pertencer a um grupo
- Uma imagem ou paleta pode ter múltiplas tags

### 3.2 Persistência de Dados

A aplicação adota uma estratégia híbrida para persistência:

1. **Banco de Dados Relacional**:
   - PostgreSQL hospedado no Neon DB armazena todos os dados estruturados
   - Prisma ORM gerencia as operações de banco de dados
   - Todos os relacionamentos e dados normalizados são mantidos no PostgreSQL

2. **Armazenamento de Mídia**:
   - As imagens são armazenadas no Cloudinary
   - Apenas as referências (URLs) são armazenadas no banco de dados
   
3. **Persistência de Estado na UI**:
   - Opções de filtro e visualização são persistidas na URL
   - Isso permite compartilhar links com filtros específicos e manter o estado após recarregar

### 3.3 Estratégia de Busca e Filtragem

A busca e filtragem são implementadas através de uma combinação de técnicas:

1. **Filtragem no Servidor**:
   - Parâmetros de consulta na URL são interpretados pelo servidor
   - Consultas Prisma são construídas dinamicamente com base nos filtros
   - Dados filtrados são retornados para o cliente

2. **Mecanismos de Filtragem**:
   - **Por Grupo**: Filtro direto pelo ID do grupo relacionado
   - **Por Tags**: Junção com tabelas de relacionamento para filtrar por múltiplas tags
   - **Por Palavra-chave**: Busca textual nos campos de nome e comentários
   
3. **Organização de Visualização**:
   - Agrupamento visual (por grupo ou visualização individual)
   - Ordenação por data de criação (mais recente primeiro)

## 4. Decisões Técnicas

### 4.1 Stack Tecnológica

| Tecnologia | Justificativa |
|------------|---------------|
| **Next.js 15** | Framework React com suporte a Server Components e App Router, otimizando o carregamento inicial e a arquitetura da aplicação |
| **React 19** | Acesso às APIs mais recentes como hooks, componentes de servidor e suspense |
| **TypeScript** | Tipagem estática para reduzir erros em tempo de desenvolvimento e melhorar a manutenibilidade |
| **Prisma** | ORM type-safe que integra perfeitamente com TypeScript, gerando tipos a partir do schema do banco de dados |
| **Clerk** | Solução completa de autenticação que elimina a necessidade de implementação personalizada de auth |
| **Tailwind CSS** | Framework CSS utility-first que acelera o desenvolvimento de UI e mantém consistência de design |
| **Shadcn/UI** | Componentes acessíveis e customizáveis baseados em Radix UI, permitindo estilização consistente |
| **OpenAI API** | Implementação rápida de geração de imagens baseada em IA sem necessidade de treinar modelos próprios |
| **Cloudinary** | Serviço de gerenciamento de imagens com CDN integrada, otimização automática e transformações |
| **Jest** | Framework de testes com suporte abrangente para testes unitários de componentes React |

### 4.2 Padrões de Design Aplicados

1. **Server Components com Client Islands**:
   - Componentes de servidor para carregamento inicial e busca de dados
   - "Ilhas" de interatividade implementadas como componentes cliente
   - Redução de JavaScript enviado ao cliente

2. **Feature-based Organization**:
   - Organização de código baseada em funcionalidades específicas
   - Componentes específicos colocados junto às páginas que os utilizam
   - Componentes globais compartilhados em diretório central

3. **URL como Fonte de Verdade**:
   - Estado da aplicação (filtros, visualizações) persistido na URL
   - Navegação e compartilhamento de estados específicos
   - Recarga da página mantém o estado da aplicação

4. **Estratégia de Composição de Componentes**:
   - Componentes pequenos e focados com responsabilidades específicas
   - Composição para criar interfaces complexas
   - Props drilling minimizado através de contextos quando necessário

5. **Type-Driven Development**:
   - Definição de tipos como primeiro passo no desenvolvimento
   - Interfaces claras entre componentes
   - Propagação de tipos do banco de dados para a UI

### 4.3 Considerações de Desempenho e Usabilidade

1. **Otimização de Desempenho**:
   - Server Components para reduzir o JavaScript no cliente
   - Streaming de dados com Suspense para carregamento progressivo
   - Lazy loading de componentes pesados
   - Cache eficiente com revalidação sob demanda

2. **Experiência do Usuário**:
   - Feedback instantâneo com atualizações otimistas
   - Estados de carregamento distintos para cada ação
   - Tratamento adequado de erros com mensagens contextuais
   - Múltiplas visualizações para diferentes necessidades do usuário

3. **Acessibilidade**:
   - Componentes de UI baseados em Radix UI com acessibilidade incorporada
   - Suporte a navegação por teclado
   - Contraste adequado e rótulos semânticos
   - Feedback via aria-live para notificações dinâmicas

4. **Usabilidade**:
   - Interfaces consistentes entre módulos
   - Feedback visual para ações (toast notifications)
   - Filtros persistentes para manter o contexto do usuário
   - Modos de visualização adaptados a diferentes necessidades (detalhes vs. visão geral)
