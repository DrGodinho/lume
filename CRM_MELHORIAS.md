# Sugestões de melhoria — Página de CRM (LUME Controle Solar)

Documento com propostas concretas, organizadas por prioridade e com referência aos
arquivos reais do projeto (`src/app/crm/`). O foco é: (1) estabilidade, que está na
origem do problema atual no tablet; (2) performance em dispositivos móveis; (3) UX/design;
(4) novas funcionalidades; (5) arquitetura/código.

> Estado atual relevante: CRM é 100% client-side (`'use client'`), autenticado via
> cookies `crm-token` (15 min) + `crm-refresh-token` (7 dias), dados servidos por rotas
> `/api/crm/*` com service-role. Hooks de dados: `useLeadList`, `useAgenda`, `useMetrics`,
> `useMonthlySnapshots`, `useCrmSettings`. Tela de loading global vem do `AuthGuard`
> (`useAuthGuard.tsx`).

---

## 1. Prioridade ALTA — Estabilidade (resolve o "trava no tablet")

### 1.1 Colocar timeout + tela de erro em TODOS os hooks de dados — ✅ CONCLUÍDO (2026-08-18)
**Problema:** O `AuthGuard` acabou de ser blindado (timeout 12s + botão "Tentar
novamente"), mas os hooks de dados **não têm** nenhum timeout nem `AbortController`. Se
qualquer rota `/api/crm/*` pendurar (compile do dev server, queda de rede, requisição
enfileirada), a UI fica para sempre em "Carregando...". Esse é o padrão exato que trava o
tablet hoje — só que nas seções internas.

**Status:** Implementado via helper `src/lib/fetchWithTimeout.ts` (wrapper com `AbortController`, 30s)
aplicado em `useLeadList`, `useMonthlySnapshots`, `useLeadSync`, `useCrmSettings`,
`useLeadStatusHistory`, `useLeadOrcamento`, `usePlaybooks`, `useLeadMutations`,
`useTokenRefresh` (só a chamada API), `ExtratosMensaisSupabase`, `HistoricoSupabase` e
`useLogout`. A tela de erro já existia nos componentes que consomem esses hooks (ou nos
`TabErrorBoundary`). Typecheck e lint OK.

**Onde:** `useLeadList.ts`, `useAgenda.ts`, `useMetrics.ts`, `useMonthlySnapshots.ts`,
`useCrmSettings.ts`, `useLeadStatusHistory.ts`, `useLeadOrcamento.ts`, e os componentes
`HistoricoSupabase.tsx`, `ExtratosMensaisSupabase.tsx`, `ArchiveLeadsView.tsx`,
`TrashLeadsView.tsx`.

**Ação:** criar um helper `useResource<T>(fetcher, deps)` que faz `fetch` com
`AbortController` + timeout (ex.: 15s) e expõe `{ data, loading, error, reload }`. Trocar
os hooks acima por ele. Mostrar `error` como mensagem + botão "Recarregar", nunca spinner
infinito.

### 1.2 Rate-limiter de login compartilha IP — ✅ CONCLUÍDO (2026-08-18)
**Problema:** `api/auth/login/route.ts` usa `getClientIp` que cai em `'unknown'` quando não
há `x-forwarded-for` (acesso direto ao dev server, sem proxy). **Todo** dispositivo na rede
divide o mesmo bucket de 10 tentativas / 15 min (`loginAttempts` é um `Map` global). Um
tablet ou celular na mesma rede pode ser barrado com `rate_limit` por causa de tentativas de
outro aparelho.

**Ação:** usar o IP real da interface (ex.: ler de `request.headers` do Next ou,
em produção atrás de proxy, `x-forwarded-for` já tratado) e/ou reduzir a janela para
login autenticado. Melhor: diferenciar tentativas de IP por `x-forwarded-for` confiável ou
marcar o bucket por sessão.

**Status:** Implementado em `src/app/api/auth/login/route.ts` — removidas `getClientIp`/`clientIp`;
o `checkRateLimit` agora usa o e-mail normalizado (`normalizeLoginIdentifier(login)`) como chave do
bucket (10 tentativas / 15 min por conta), eliminando o bloqueio cruzado entre aparelhos na mesma rede.
Typecheck OK.

### 1.3 `useTokenRefresh` — evitar rajada de refresh concorrente — ✅ CONCLUÍDO (2026-08-19)
**Onde:** `hooks/useTokenRefresh.ts`. Já há dedupe via `refreshPromise` (bom). Mas quando a
página monta, vários hooks disparam fetch simultâneo; se o access token estiver expirado,
cada um recebe 401 e chama `refreshAccessToken` — o dedupe segura, ok. Reforço: após
refresh falhar, redirecionar uma única vez (hoje cada 401 chamaria `window.location.href`
e poderia gerar múltiplos redirects). Usar flag de "já redirecionando".

**Status:** adicionada flag de módulo `isRedirecting` em `useTokenRefresh.ts`. Após o
`refreshAccessToken` falhar, o redirect para `/login` (com `redirectTo`) é disparado apenas
uma vez — chamadas 401 concorrentes subsequentes não reatribuem `window.location.href`.
O `refreshPromise` (dedupe) e o `patchedFetch` compartilhado por instância já evitavam a
rajada de refresh; esta flag fecha a lacuna do redirect múltiplo. Typecheck e lint OK.

### 1.4 Tratamento de "offline" — ✅ CONCLUÍDO (já existente)
**Ação:** detectar `navigator.onLine` e mostrar banner de "sem conexão" em vez de spinners.
Útil justamente para acesso via IP na rede local, onde o tablet pode perder o notebook.

**Status:** já havia sido implementado em `src/app/crm/components/OfflineBanner.tsx` e está
renderizado no `CrmApp` (`page.tsx:119`). O componente lê `navigator.onLine` no mount e
escuta os eventos `online`/`offline` (via `useEffect`), exibindo um banner fixo no topo
(`role="status"`, `aria-live="polite"`) com a mensagem "Sem conexao. Verifique se o tablet
ainda esta na mesma rede do notebook...", oculto quando `isOnline` é verdadeiro. Lint OK
(conferido nesta sessão).

### 1.5 GET de leads falhava sem as colunas opcionais — ✅ CONCLUÍDO (2026-08-19)
**Problema:** o `GET` de `/api/crm/leads` (carga inicial da lista) usava um filtro
`.or('archived.eq.false,and(archived.eq.true,data_servico.lte.<data>)')` que referencia as
colunas opcionais `archived` e `data_servico`. Se o schema do Supabase for mais antigo e não
tiver essas colunas, o PostgREST retornava erro e **nenhum lead carregava** (tela de erro /
"Supabase nao carregou os leads"), mesmo que as rotas de escrita (POST/PUT/PATCH) funcionassem
— elas já tinham o fallback `isMissingOptionalLeadColumnError`. Sintoma reportado: "Leads não
carregam" de forma persistente.

**Status:** adicionado fallback no `GET` de `src/app/api/crm/leads/route.ts`: quando o erro
indica coluna opcional ausente (`isMissingOptionalLeadColumnError`), refaz a consulta apenas
com `deleted_at is null` + ordenação, sem o filtro de `archived`/`data_servico`. Assim a lista
de leads carrega mesmo em schemas sem essas colunas (mesma resiliência das rotas de escrita).
Typecheck e lint OK.

---

## 2. Prioridade MÉDIA — Performance em mobile/tablet

### 2.1 Paginação ou virtualização da lista de leads — ✅ CONCLUÍDO (2026-08-19)
**Problema:** `useLeadList` carrega **todos** os leads de uma vez e o `KanbanBoard` +
`LeadCard` renderiza tudo no cliente. Com centenas de leads, o primeiro render no tablet
fica pesado e o `next dev` demora a compilar a rota gigante (`page.tsx` tem 842 linhas).

**Ação:** server-side pagination em `/api/crm/leads?cursor=&limit=50`, ou virtualização com
`@tanstack/react-virtual` no Kanban/Lista. Manter filtros (bairro/status) no servidor.

**Status:** optou-se pela **paginação client-side "Load more"** (`KanbanBoard.tsx`), pois a
virtualização (`@tanstack/react-virtual`) conflita com o drag-and-drop do dnd-kit e o
usuário priorizou manter o DnD funcionando. Implementado:
- Constante `KANBAN_COLUMN_PAGE_SIZE = 25`.
- Cada coluna do Kanban renderiza só os primeiros 25 cards + botão "Mostrar mais N leads"
  (estado `visibleCount` por coluna). O DnD continua 100% funcional — os cards são DOM real;
  "Mostrar mais" apenas revela os seguintes. `SortableContext` usa apenas os ids visíveis.
- A vista Tabela (mobile e desktop) também respeita o limite, com botão "Mostrar mais".
- O header de cada coluna continua mostrando o total (`stageLeads.length`).

Isso reduz diretamente os nós do DOM no primeiro render do tablet (o gargalo relatado), sem
nova dependência e sem tocar no fluxo de sincronização. O fetch continua trazendo todos os
leads (necessário para agrupar as colunas). Typecheck, lint e `test:crm` (85 testes) OK.

**Pendente (se um dia houver milhares de leads):** paginação server-side real na rota
`/api/crm/leads` com filtros no backend, ou virtualização — ambas exigiriam redesenhar o
Kanban e/ou abrir mão de parte do DnD.

### 2.2 Code-splitting das abas (lazy load) — ✅ CONCLUÍDO (2026-08-18)
**Problema:** `CrmContent` importa tudo no topo (`HistoricoSupabase`, `ExtratosMensaisSupabase`,
`AgendaSection`, `MetricsPanel`, `PlaybookSettings`...). O JS inicial é enorme.

**Status:** As 8 abas viraram `next/dynamic` com `TabSkeleton` como loading (agora isolado em
`CrmTabRouter.tsx`). Os imports estáticos restantes são `LeadModal`, `TabErrorBoundary` e
`ToastProvider`. Typecheck e lint OK.

**Ação:** `React.lazy` + `next/dynamic` para carregar cada aba sob demanda:
```tsx
const HistoricoSupabase = dynamic(() => import('./components/HistoricoSupabase'), { loading: Skeleton });
```
Reduz tempo de carregamento no tablet e o tempo de cold-compile do dev server.

### 2.3 Memoização de seletores pesados — ✅ CONCLUÍDO (2026-08-19)
**Onde:** `useLeads.ts` expõe `filteredLeads` / `sortedFilteredLeads` recalculados a cada
render. Encapsular em `useMemo` com deps estáveis (já deve haver em `useLeadPreferences`,
conferir). Adicionar `React.memo` nos `LeadCard`/`SortableLeadCard` para evitar re-render
em massa ao mover um card no Kanban.

**Status:** `filteredLeads` e `sortedFilteredLeads` já estavam em `useMemo` com deps estáveis
em `useLeadPreferences.ts` (conferido). Adicionado `React.memo` em `LeadCard.tsx` e
`SortableLeadCard.tsx`. Para que o memo tenha efeito, os callbacks por card não podem ser
arrows inline: `onMoveLeft`/`onMoveRight` viraram `(leadId) => void` estáveis por coluna
(`KanbanColumn` usa `useCallback` em `KanbanBoard.tsx`), e o `CrmTabRouter` passa os
callbacks `crm.*` diretamente (sem wrapper inline: `onStatusChange`, `onOpenEdit`,
`onDelete`, `onTogglePin`, `onOpenCreateModal`). Resultado: ao digitar na busca ou reordenar
cards, os `LeadCard` cujo `lead` não muda de referência deixam de re-renderizar. Typecheck,
lint e `test:crm` (85 testes) OK.

**Observação:** o benefício do `React.memo` é limitado enquanto o `CrmContext` recria o
objeto de valor a cada render (itens 5.1) — callbacks estáveis ajudam, mas uma mudança de
`leads` (ex.: troca de status) ainda troca a referência de alguns callbacks. Para isolamento
total, ver divisão do contexto em fatias (comentado no 5.1).

### 2.4 Skeletons em vez de "Carregando..." — ✅ CONCLUÍDO (2026-08-19)
**Ação:** trocar os textos "Carregando histórico...", "Carregando lixeira...", etc. por
esqueletos (shimmer) que imitam o layout — percepção de velocidade muito melhor no mobile.

**Status:** adicionada a classe utilitária `.skeleton-shimmer` em `src/app/globals.css`
(bloco com `::after` animado pela keyframe `skeleton-shimmer`). Os estados de loading foram
trocados por skeletons que imitam o layout real:
- `CrmTabRouter.tsx` → `TabSkeleton()` agora renderiza 4 colunas com cards de placeholder
  (antes era só o texto "Carregando...").
- `ArchiveLeadsView.tsx` → lista de 5 cards esqueleto (nome/telefone/badges/bbotão
  "Reativar") no lugar de "Carregando arquivo..." (removido o ícone `RefreshCw` não usado).
- `TrashLeadsView.tsx` → lista de 5 cards esqueleto no lugar de "Carregando lixeira...".
- `LeadModal.tsx` → 3 linhas de histórico esqueleto no lugar de "Carregando histórico...".

Todos usam `aria-hidden="true"` e a classe `.skeleton-shimmer`. Typecheck, lint e `test:crm`
(85 testes) OK.

---

## 3. Prioridade MÉDIA — UX / Design

### 3.1 Responsividade do Kanban no toque
**Onde:** `KanbanBoard.tsx` + `SortableLeadCard.tsx` (dnd-kit). Verificar se o drag-and-drop
funciona bem com toque no tablet (dnd-kit suporta `PointerSensor`, mas precisa de
`activationConstraint` para não conflitar com scroll). Adicionar `TouchSensor` do dnd-kit.

### 3.2 Acessibilidade (a11y)
- Foco visível nos inputs/modais (`LeadModal.tsx`).
- `aria-live` nos toasts e em atualizações de status.
- Contraste do texto `text-gray-400` sobre fundo `#04080f` está no limite — revisar.

### 3.3 Atalhos de teclado e busca global — ✅ CONCLUÍDO (2026-08-21)
- `/` foca a busca; `Esc` fecha modais (já há `DiscardChangesDialog`/`ConfirmDialog`).
- `n` abre "novo lead". Pequeno ganho de produtividade no notebook.

**Status:** adicionado handler global de teclado em `CrmApp` (`page.tsx`):
- `/` (quando não há campo editável em foco) foca o input de busca global. Como a busca só
  existe na aba "Leads", se o atalho for usado em outra aba ele troca para "Leads" e foca o
  campo após o mount (`searchInputRef` + `pendingFocusSearchRef`).
- `n` abre o modal de novo lead (`crm.openCreateModal()`), ignorado se já houver modal aberto
  ou foco em campo editável.
- `Esc` fecha o `LeadDetailModal` (se aberto) ou o `LeadFormModal` quando não está "sujo"
  (o `useDirtyFormGuard` já trata o `Esc` do formulário com alterações, exibindo o diálogo de
  descarte — sem duplo fechamento).
- O `ref` da busca (`searchInputRef`) foi propagado de `CrmApp` → `CrmTabRouter` →
  `KanbanBoard` (nova prop `searchInputRef`). Typecheck, lint e `test:crm` (85 testes) OK.

### 3.4 Indicador de "última sincronização" — ✅ CONCLUÍDO (2026-08-21)
**Onde:** `useLeadSync.ts` já expõe `lastCloudCheckAt`, `isVerifyingCloud`, `crmSync`.
Mostrar um badge discreto "Sincronizado há 2 min" no topo, e permitir pull-to-refresh no
mobile.

**Status:** o `CrmHeader` agora mostra o rótulo relativo "Sincronizado há X min" (atualizado a
cada 30s via `setInterval`) ao lado do horário absoluto (`HH:mm`, no `title`). Criado o hook
`src/app/crm/hooks/usePullToRefresh.ts` que detecta o gesto "puxar para atualizar" no topo
(`window.scrollY === 0`) apenas em dispositivos de toque (`ontouchstart`/`maxTouchPoints`),
evitando o overscroll nativo (`preventDefault` no `touchmove`). Ao soltar além do limite
(72px) ele dispara `handleVerifyCloudLeads` e exibe um indicador discreto ("Puxe para
atualizar" → "Solte para atualizar" → "Atualizando...") no topo do `<main>`. O `onRefresh` é
memoizado (`crmRef`) para não re-subscrever a cada render. Typecheck, lint e `test:crm` (85
testes) OK.

---

## 4. Prioridade BAIXA / Nice-to-have — Novas funcionalidades

### 4.1 Notas relacionais (issue #17 já mapeada) — ✅ CONCLUÍDO (2026-08-19)
**Onde:** `types.ts` já define `LeadNote` e comenta a migração de `LeadStatusInfo.notes`
(hoje string única) para tabela `LeadNote[]` (1:N). Implementar: tabela + hook
`useLeadNotes(leadId)` + UI de linha do tempo de anotações no `LeadDetailModal`.

**Status:** implementado como feature **aditiva** (não quebra o `notes` legado):
- SQL: `supabase/crm_lead_notes.sql` cria a tabela `lead_notes` (FK em `leads.id` `on delete
  cascade`), índice por `lead_id` e RLS habilitado (a app usa service role, que ignora RLS).
- API: `src/app/api/crm/leads/notes/route.ts` com `GET ?leadId=` e `POST`. Reusa o padrão de
  auth das rotas de CRM (`crm-token` cookie + fallback Supabase bearer). Se a tabela ainda não
  existir (`42P01`), o `GET` retorna `{ notes: [] }` e o `POST` retorna `409` com hint de rodar
  o SQL — degradação graciosa até aplicar a migração.
- Hook: `src/app/crm/hooks/useLeadNotes.ts` (`notes`, `loading`, `adding`, `error`, `addNote`,
  `reload`), busca por `leadId` e faz prepend otimista da nova nota.
- UI: `LeadDetailModal` (`LeadModal.tsx`) ganha a seção "Notas relacionais" — timeline das notas
  (corpo + data + autor), skeleton de carregamento e campo "Adicionar nota". O bloco "Observações"
  (string legada) permanece, servindo de fallback até a migração completa.

**Pendente (migração total):** mover o conteúdo de `LeadStatusInfo.notes` para `lead_notes` e
remover o campo da tabela/form — fora do escopo desta entrega para não quebrar dados existentes.
Typecheck, lint e `test:crm` (85 testes) OK.

### 4.2 Detecção de leads duplicados — ✅ CONCLUÍDO (2026-08-19)
Ao criar/editar, cruzar `phone`/`email` e avisar "este contato já existe (lead X)".

**Status:** adicionado `findDuplicateLead` em `src/app/crm/utils.ts` (normaliza telefone
`só dígitos` e email `lowercase/trim`; match por telefone com ≥8 dígitos ou email idêntico,
ignorando o próprio lead em edição). O `LeadFormModal` (`LeadModal.tsx`) recebe `leads` e
`onOpenLead` e, via `useMemo`, exibe um banner âmbar acima dos campos Telefone/E-mail quando
encontra duplicata: "Este contato já existe: **Nome** (Status)" + botão "Abrir lead existente"
que fecha o formulário e abre o `LeadDetailModal` do lead encontrado. É um aviso (não bloqueia
o envio). `page.tsx` passa `leads={crm.leads}` e o callback que faz `closeLeadModal` +
`setLeadDetail`. Typecheck, lint e `test:crm` (85 testes) OK.

### 4.3 Ações em lote (bulk)
Selecionar vários leads (checkbox no Kanban/Lista) → arquivar / excluir / mudar status em
lote. Útil para limpeza periódica.

### 4.4 Relatórios exportáveis
`ExtratosMensaisSupabase.tsx` já gera PDF (`jsPDF`/`html-to-image`). Generalizar: export de
**CSV** de leads filtrados (leve e útil no mobile) e relatório de conversão por
**bairro/filme** (aproveitar `RJ_NEIGHBORHOODS` e `filmTypes`).

### 4.5 Dashboard de conversão por bairro
`DashboardStats` (`types.ts`) já tem contadores. Adicionar gráfico de pizza de origem
(bairro) e de tipo de película — ajuda a decidir onde focar marketing.

### 4.6 Integração Google Calendar já está prevista
`utils/googleCalendar.ts` existe. Finalizar: botão "Adicionar à agenda" no `AgendaSection`
gerando convite `.ics` / link do Google Calendar para o `proximoContato`/`dataServico`.

### 4.7 Multi-usuário / permissões
O modelo `owner_key` (`drgodinho` vs `jrquintans`) já existe no banco. Expor seletor de
"vendedor" no `PlaybookSettings` (já há `sellerIds`/`activeSellerId`) e relatórios por
vendedor — sem misturar dados entre donos.

### 4.8 Automação de follow-up (playbooks) — evoluir
`FollowUpPlaybookRule` já existe. Adicionar: disparo de **mensagem WhatsApp automática**
via `WhatsAppTemplateMenu.tsx` quando um lead entra em `sem_acao`/`dormentes` há X dias.

### 4.9 Histórico Supabase — agrupamento por mês e paginação client-side — ✅ CONCLUÍDO (2026-08-19)
**Problema:** a aba "Histórico Supabase" (`HistoricoSupabase.tsx`) carregava **todos** os
orçamentos numa única tabela plana, sem paginação. Com um número grande de orçamentos o DOM
ficava pesado e a rolagem/leitura ruins.

**Status:** implementado agrupamento client-side por mês (`yyyy-MM` de `created_at`, seções
retáteis, mais recente primeiro e expandido por padrão). Cada mês mostra cabeçalho com
contagem + total do mês, e "Mostrar mais N" revela 25 linhas por vez (`HISTORY_MONTH_PAGE_SIZE`).
O spinner de loading virou skeleton (`.skeleton-shimmer`, ver 2.4). Busca/filtros continuam
ativos sobre o conjunto filtrado; o CSV exporta tudo. Typecheck e lint OK.

**Evolução futura (quando houver milhares de clientes/orçamentos):** paginação **server-side**
na rota `/api/calculator/history` com `?month=yyyy-MM&cursor=&limit=50` (filtro de mês já
separado no cliente), para não trazer tudo de uma vez. O agrupamento por mês da UI já isola por
`mêsKey`, então a troca para buscas paginadas por mês é incremental.

---

## 5. Prioridade MÉDIA — Arquitetura / código

### 5.1 `useLeads` é um "god hook" — ✅ CONCLUÍDO (2026-08-19)
`useLeads.ts` tinha 231 linhas e retorna ~70 props, orquestrando 10+ hooks. Difícil de testar
e de fazer code-splitting.

**Status:** Estado movido para um `CrmContext` (`src/app/crm/context/CrmContext.tsx`) via
`CrmProvider` + `useCrm()`, sem nova dependência. A composição dos hooks de fatia (já
separados: `useLeadList`, `useLeadSync`, `useLeadPreferences`, `usePlaybooks`,
`useLeadOrcamento`, `useLeadModal`, `useLeadStatusHistory`, `useLeadMutations`,
`useLeadCommercialAction`) continua centralizada em `useCrmState`, mas o consumo agora é por
Context em vez de prop-drilling do objeto gigante. Foram adicionados **selectors por fatia**
(`useCrmLeads`, `useCrmFilters`, `useCrmModal`, `useCrmSync`, `useCrmPlaybooks`,
`useCrmMutations`, `useCrmCommercial`, `useCrmStatusHistory`) para importar apenas o que cada
componente precisa. `useLeads.ts` foi removido; `page.tsx` virou `CrmContent` (estado de
`activeTab`) → `CrmProvider` → `CrmApp` (consome `useCrm()`), e `CrmTabRouter` consome
`useCrm()` diretamente. Typecheck, lint e `test:crm` (85 testes) OK.

**Ação original:** mover estado para um Context (`CrmContext`) com reducers, ou adotar Zustand,
expondo seletores. Facilita também os testes (já há `vitest` para vários hooks).

### 5.2 `page.tsx` muito grande (842 linhas) — ✅ CONCLUÍDO (2026-08-18)
Extrair `CrmSidebar`, `CrmHeader`, `CrmTabRouter` em componentes próprios. Reduz o tempo de
compile no dev (relevante para o tablet) e melhora manutenção.

**Status:** Extraídos para `src/app/crm/components/CrmSidebar.tsx`, `CrmHeader.tsx` e
`CrmTabRouter.tsx`. O `page.tsx` agora orquestra esses três componentes (mais `useLeads`,
`useMetrics`, `useCrmSettings`); as constantes `CRM_NAV_SECTIONS`/`NAV_TONE_CLASSES` migraram
para o `CrmSidebar` e `TAB_TITLES` para o `CrmHeader`. O `page.tsx` caiu de 870 para ~200 linhas.
Typecheck e lint OK.

### 5.3 Tipo `Lead` monolítico
`Lead = LeadCore & LeadStatusInfo` (`types.ts:91`). Manter, mas separar claramente updates
(`LeadCoreUpdate` / `LeadStatusInfoUpdate` já existem) e evitar spreads que misturam camadas
imutáveis com mutáveis (já há comentário sobre isso).

### 5.4 Testes E2E do fluxo mobile
Adicionar **Playwright** cobrindo: login → abrir `/crm` → criar lead → mover no Kanban.
Incluir um teste que simula **IP de outro dispositivo** (cookie presente) para evitar
regressão do bug do tablet. Hoje só há testes unitários de hooks.

### 5.5 CSP do Trustindex (pendente da sessão anterior)
`Reviews.tsx` injeta iframe do Trustindex que é bloqueado pelo CSP (falta `frame-src`).
Liberar `cdn.trustindex.io` em `next.config.mjs` para o widget de avaliações aparecer.

---

## Ordem de implementação sugerida

1. **1.1** (timeout/erro em todos os hooks) — elimina o travamento silencioso de raiz.
2. **1.2** (rate-limit por IP) — evita bloqueio cruzado entre aparelhos na rede.
3. **2.2** (lazy load das abas) — resolve o "demora muito" no primeiro acesso do tablet.
4. **2.1** (paginação/virtualização) — escala conforme a base de leads cresce.
5. Restante conforme prioridade.

> Observação: as melhorias 1.1 e 1.2 são as que mais impactam o sintoma relatado hoje
> ("fica parado em Carregando..." no tablet). Recomendo fazer essas duas primeiro e
> re-testar no tablet antes de seguir para performance/UX.
