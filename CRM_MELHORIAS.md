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

### 1.3 `useTokenRefresh` — evitar rajada de refresh concorrente
**Onde:** `hooks/useTokenRefresh.ts`. Já há dedupe via `refreshPromise` (bom). Mas quando a
página monta, vários hooks disparam fetch simultâneo; se o access token estiver expirado,
cada um recebe 401 e chama `refreshAccessToken` — o dedupe segura, ok. Reforço: após
refresh falhar, redirecionar uma única vez (hoje cada 401 chamaria `window.location.href`
e poderia gerar múltiplos redirects). Usar flag de "já redirecionando".

### 1.4 Tratamento de "offline"
**Ação:** detectar `navigator.onLine` e mostrar banner de "sem conexão" em vez de spinners.
Útil justamente para acesso via IP na rede local, onde o tablet pode perder o notebook.

---

## 2. Prioridade MÉDIA — Performance em mobile/tablet

### 2.1 Paginação ou virtualização da lista de leads
**Problema:** `useLeadList` carrega **todos** os leads de uma vez e o `KanbanBoard` +
`LeadCard` renderiza tudo no cliente. Com centenas de leads, o primeiro render no tablet
fica pesado e o `next dev` demora a compilar a rota gigante (`page.tsx` tem 842 linhas).

**Ação:**
- Server-side pagination em `/api/crm/leads?cursor=&limit=50`, ou
- Virtualização com `@tanstack/react-virtual` no Kanban/Lista.
- Manter filtros (bairro/status) no servidor, não só no cliente.

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

### 2.3 Memoização de seletores pesados
**Onde:** `useLeads.ts` expõe `filteredLeads` / `sortedFilteredLeads` recalculados a cada
render. Encapsular em `useMemo` com deps estáveis (já deve haver em `useLeadPreferences`,
conferir). Adicionar `React.memo` nos `LeadCard`/`SortableLeadCard` para evitar re-render
em massa ao mover um card no Kanban.

### 2.4 Skeletons em vez de "Carregando..."
**Ação:** trocar os textos "Carregando histórico...", "Carregando lixeira...", etc. por
esqueletos (shimmer) que imitam o layout — percepção de velocidade muito melhor no mobile.

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

### 3.3 Atalhos de teclado e busca global
- `/` foca a busca; `Esc` fecha modais (já há `DiscardChangesDialog`/`ConfirmDialog`).
- `n` abre "novo lead". Pequeno ganho de produtividade no notebook.

### 3.4 Indicador de "última sincronização"
**Onde:** `useLeadSync.ts` já expõe `lastCloudCheckAt`, `isVerifyingCloud`, `crmSync`.
Mostrar um badge discreto "Sincronizado há 2 min" no topo, e permitir pull-to-refresh no
mobile.

---

## 4. Prioridade BAIXA / Nice-to-have — Novas funcionalidades

### 4.1 Notas relacionais (issue #17 já mapeada)
**Onde:** `types.ts` já define `LeadNote` e comenta a migração de `LeadStatusInfo.notes`
(hoje string única) para tabela `LeadNote[]` (1:N). Implementar: tabela + hook
`useLeadNotes(leadId)` + UI de linha do tempo de anotações no `LeadDetailModal`.

### 4.2 Detecção de leads duplicados
Ao criar/editar, cruzar `phone`/`email` e avisar "este contato já existe (lead X)".

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

---

## 5. Prioridade MÉDIA — Arquitetura / código

### 5.1 `useLeads` é um "god hook"
`useLeads.ts` tem 231 linhas e retorna ~70 props, orquestrando 10+ hooks. Difícil de testar
e de fazer code-splitting. **Ação:** mover estado para um Context (`CrmContext`) com
reducers, ou adotar Zustand, expondo seletores. Facilita também os testes (já há `vitest`
para vários hooks).

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
