# CRM — Plano de Melhoria v2 (clareza + menos repetição)

> Foco pedido: eliminar itens repetitivos e deixar informações mais claras e relevantes.
> Arquivos antigos (`CRM_MELHORIAS.md`, `crm_analise.md`) são técnicos e quase 100% concluídos.
> Este documento é novo, é de **produto/UX**, e parte do estado real do código hoje:
> `page.tsx`, `CrmSidebar.tsx`, `CrmHeader.tsx`, `CrmTabRouter.tsx`, `KanbanBoard.tsx` (758 linhas),
> `LeadCard.tsx`, `MetricsPanel.tsx` (486 linhas), `AgendaSection.tsx` (1118 linhas).

---

## 1. Diagnóstico — onde está a repetição/confusão hoje

| # | Sintoma visível | Onde no código |
|---|---|---|
| 1 | **Meta editável em 2 lugares** (sidebar + card "Meta de Vendas" no dashboard) com UX diferente | `CrmSidebar.tsx:115-161` + `MetricsPanel.tsx:266-361` |
| 2 | **Dois blocos de sync no header**, um visível e um morto com `className="hidden"` | `CrmHeader.tsx:92-123` (ativo) + `CrmHeader.tsx:125-160` (morto, remover) |
| 3 | **"Sem Próxima Ação" vs "Alerta Comercial"** mostram quase o mesmo número (`staleNoAgenda` aparece nos dois cards) | `MetricsPanel.tsx:163-199` |
| 4 | **4 mini-cards do dashboard** com rótulos técnicos ("Previsão por Serviço", "taxa de resposta", "priorityRoute") que ninguém entende de relance | `MetricsPanel.tsx:147-216` |
| 5 | **Tabela de leads duplicada**: markup mobile (cards) + markup desktop (`<table>`) repetidos dentro do mesmo arquivo; mesma tabela repetida de novo em "Leads Recentes" | `KanbanBoard.tsx:254-442` + `MetricsPanel.tsx:414-483` |
| 6 | **"Capacidade da semana" duplicada**: versão mobile (carrossel) + versão desktop (grid) com o mesmo map | `MetricsPanel.tsx:373-412` |
| 7 | **Arquivo vs Lixeira**: duas abas, dois componentes quase idênticos, mesma tabela/esqueleto/botão restaurar | `ArchiveLeadsView.tsx` + `TrashLeadsView.tsx` |
| 8 | **Histórico Supabase vs Extratos Mensais vs Dashboard**: três lugares mostram "dinheiro por mês" com nomes parecidos | `HistoricoSupabase.tsx` + `ExtratosMensaisSupabase.tsx` + `MetricsPanel.tsx` |
| 9 | **LeadCard sobrecarregado**: collapse + pin + sync + ←/→ + editar + excluir = 7 alvos de toque num card de ~120px | `LeadCard.tsx:96-249` |
| 10 | **Textos em inglês no meio do PT-BR**: "Collapse all / Expand all", tooltips, `title` de DnD | `KanbanBoard.tsx:177-196` |
| 11 | **3 formatadores de moeda** para a mesma coisa | `formatLeadCurrency` (utils), `formatDashboardCurrency` (useMetrics), `formatCurrencyBRL` (useAgenda) |
| 12 | **Cores de estágio definidas 2x**: `stageStyles` no Kanban + `LEAD_STAGE_*` nas constants | `KanbanBoard.tsx:488-514` |

---

## 2. Princípios (para não reintroduzir repetição)

1. **Uma informação, um lugar.** Meta, sync, dinheiro do mês e lista de leads têm um componente dono. O resto consome.
2. **Dashboard responde 3 perguntas e só 3:** "preciso agir em quem hoje?", "vou bater a meta?", "o que entra essa semana?". Todo o resto vaza para a aba própria.
3. **Nada de markup mobile/desktop duplicado.** Um componente, CSS responsivo (`hidden md:` só em wrapper, nunca dois maps).
4. **Nenhum número sem verbo.** Todo número tem ação ao lado ("Abrir fila", "Ver leads", "Agendar").

---

## 3. Lista de implementação sugerida (ordem de execução)

### FASE A — Limpeza rápida (1–2 dias, alto impacto visual, baixo risco)

**A1. Deletar o bloco morto do `CrmHeader`** — ✅ CONCLUÍDO (2026-09-04)
- Remover `CrmHeader.tsx:125-160` (`<div className="hidden">` com segundo badge "Salvo/Salvando" + botão "Verificar").
- Manter só o painel visível. Renomear rótulos: `Sincronizado` → `Atualizado há X` / `Sincronizar` → `Atualizar agora`.
- Arquivo: `components/CrmHeader.tsx`.
- **Implementado:** bloco `hidden` removido; rótulos `Atualizado` / `Atualizando` / `Erro`, botão `Atualizar agora` / `Atualizando...` com `title` atualizado.

**A2. Meta em um componente único (`TargetGoalCard`)** — ✅ CONCLUÍDO (2026-09-04)
- Extrair o editor de meta da sidebar e do dashboard para `components/TargetGoalCard.tsx` (modo `compact` na sidebar, `full` no dashboard).
- Sidebar vira só leitura + clique para editar; dashboard mantém o anel de progresso.
- Remove ~60 linhas duplicadas. Arquivos: `CrmSidebar.tsx`, `MetricsPanel.tsx`.
- **Implementado:** criado `components/TargetGoalCard.tsx` (`compact` + `full`, com `monthTotal`/`formatMonthTotal` no `full`); `CrmSidebar.tsx` e `MetricsPanel.tsx` consomem o componente; adicionada prop `onCancelTargetEdit` na sidebar (ligada a `closeSidebarTargetEdit` em `page.tsx`) para o Escape cancelar sem reabrir a edição.

**A3. Fundir os dois cards confusos em um "Precisa de ação"** — ✅ CONCLUÍDO (2026-09-04)
- Hoje: `Alerta Comercial (staleNoAgenda)` + `Sem Próxima Ação (noNextAction)` — o usuário não sabe a diferença.
- Novo: 1 card vermelho "🔴 X leads parados há 3+ dias" com botão "Abrir fila" (vai para agenda `sem_acao`). O número `noNextAction` vira subtítulo, não card próprio.
- Arquivo: `MetricsPanel.tsx:163-199`. Reduz 4 mini-cards para 3: `Ação necessária` / `Serviços futuros` / `Pipeline (R$)`.
- **Implementado:** os dois cards viraram um botão único `Precisam de ação` — número grande `staleNoAgenda` (`parados 3+ dias`) + subtítulo `{noNextAction} sem próxima ação`; mantém o destino `onOpenAgendaNoAction` e o CTA `Abrir fila`; grid `lg:grid-cols-4` → `lg:grid-cols-3`. (`staleNoAgenda` é subconjunto de `noNextAction`: parados 3+ dias dentre os sem próxima ação — confirmado em `useMetrics.ts:179-183`.)

**A4. PT-BR total + microcopy do Kanban** — ✅ CONCLUÍDO (2026-09-04)
- `Collapse all/Expand all` → `Recolher/Expandir`; `Mostrar mais N leads` → `Ver mais N`; tooltip DnD → "Arraste para trocar de etapa".
- Tirar `priorityRoute` e `taxa de resposta` do card "Previsão por Serviço" (ninguém sabe o que é) — mover para tooltip ou remover.
- Arquivos: `KanbanBoard.tsx`, `LeadCard.tsx`, `MetricsPanel.tsx:201-216`.
- **Implementado:** botões `Recolher`/`Expandir` (`KanbanBoard.tsx:185,193`); 3× `Mostrar mais N leads` → `Ver mais` (2 na tabela, 1 na coluna); tooltip sortable `Arraste para trocar de etapa, duplo clique para editar` (`LeadCard.tsx:85`); card renomeado para `Valor agendado` com sublinha `ticket médio R$ X` (ou `nenhum serviço futuro`) — `responseRate`/`priorityRoute` removidos da UI (continuam calculados em `useMetrics`, sem uso visual).

**A5. Unificar formatadores de moeda** — ✅ CONCLUÍDO (2026-09-04)
- Criar `formatBRL(value)` único em `src/app/crm/utils.ts`, deletar `formatDashboardCurrency` e `formatCurrencyBRL` (viram alias depreciado por 1 release).
- Arquivos: `utils.ts`, `hooks/useMetrics.ts`, `hooks/useAgenda.ts`.
- **Implementado:** `formatBRL` canônico em `utils.ts` (Intl `pt-BR`/`BRL`); `formatCurrencyBRL` (`useAgenda.ts`) virou alias lazy `@deprecated` (lazy para não quebrar o ciclo `utils ↔ useAgenda`, que já existia via `normalizeLeadStatus`); `useMetrics` retorna `formatDashboardCurrency: formatBRL` (chave mantida como alias — props de `MetricsPanel`/`MonthlyChart`/`AgendaSection` intactas). `formatLeadCurrency` mantido de propósito: saída diferente (só número, sem `R$` — chamadores prefixam `R$ `).

### FASE B — Clareza da tela (3–5 dias, muda percepção de "repetitivo")

**B1. Dashboard: de 6 seções para 4, na ordem de decisão** — ⏳ FATIA 1 CONCLUÍDA (2026-09-04); restante pendente
Ordem nova:
1. `Hoje` — 3 números clicáveis: Atrasados / Para hoje / Serviços hoje (cada um navega para a agenda filtrada).
2. `Meta do mês` — anel + "faltam R$ X" (frase, não só %).
3. `Funil` — barras por etapa (mantém, é bom).
4. `Esta semana` — 7 dias, um componente só (remove duplicação mobile/desktop — A6).
- Deletar seção "Leads Recentes no Funil" (é a mesma tabela do Kanban, só com 3 linhas — não informa nada). Trocar por "Top 3 prontos para fechar" (leads `Agendado` com maior valor) OU remover e deixar CTA "Ver todos os leads".
- Arquivo: `MetricsPanel.tsx` (quebrar em `DashboardHoje.tsx`, `DashboardMeta.tsx`, `DashboardFunil.tsx`, `DashboardSemana.tsx`).
- **Fatia 1 implementada:** novo `components/DashboardHoje.tsx` (3 cards clicáveis — Atrasados/`overdueFollowUps` vermelho, Para hoje/`dueFollowUpsToday` dourado, Serviços hoje/`servicesToday` azul — todos navegam para a agenda de hoje via `onOpenAgendaToday`; contagens já existiam em `useMetrics`, sem mudança de hooks) inserido como **primeira seção** do dashboard; `TargetGoalCard` (full) ganhou a frase `Faltam R$ X para a meta` / `Meta alcançada` sob o anel (usa `monthTotal`+`targetGoal` já recebidos). **Gráfico mensal (`MonthlyChart`) preservado** a pedido do usuário.
- **Fatia 5 implementada (2026-09-04, a pedido do usuário):** `DashboardHoje` + pílulas fundidos numa **barra única** (~56px): contadores clicáveis à esquerda (`3 atrasados · 5 hoje · 2 serviços`, com divisórias) + `PeriodPills` à direita (novo `PeriodPills.tsx`, que herdou `PERIOD_OPTIONS` e a lógica de default do custom). Gráfico sobe ~150px na tela. `MetricsPanel` perdeu o `date-fns` e encolheu para ~170 linhas.

**B2. Unificar Arquivo + Lixeira em `LeadsArquivadosView`** — ✅ CONCLUÍDO (2026-09-04)
- Um componente com prop `mode: 'archive' | 'trash'`. Título, texto vazio e ação primária ("Reativar" vs "Restaurar") mudam; tabela, skeleton e busca são iguais.
- Sidebar: juntar em uma seção "Histórico" ou manter 2 itens que apontam para a mesma view com filtro. Recomendado: manter 2 itens no menu (menos re-aprendizado), 1 componente no código.
- Arquivos: `ArchiveLeadsView.tsx` + `TrashLeadsView.tsx` → `ArchivedLeadsView.tsx`.
- **Implementado:** criado `components/ArchivedLeadsView.tsx` (`mode` + `MODE_META` com eyebrow/título/descrição/texto vazio/rótulo e cor do botão por modo; `ArchivedLeadRow` interno com selos por modo — dourado `Serviço executado em` + valor no archive, vermelho `Excluído em` + `N dias para recuperar` no trash); `CrmTabRouter.tsx` usa 1 dynamic import com `mode="trash"`/`mode="archive"` (menu e títulos inalterados); `ArchiveLeadsView.tsx` e `TrashLeadsView.tsx` removidos (~226 linhas → ~200 num arquivo só). Única microdivergência: botão `Atualizar` da lixeira herdou o hover dourado do arquivo (antes era hover branco) — padronização intencional.

**B3. Renomear abas para linguagem do vendedor** — ⚠️ PARCIAL (2026-09-04, a pedido do usuário: demais nomes mantidos por hábito)
- ~~`Histórico Supabase` → `Orçamentos`~~ ✅ FEITO — `CrmSidebar.tsx:47`, `CrmHeader.tsx:21`, `CrmTabRouter.tsx:195` (descrição da sidebar ajustada `Orçamentos salvos` → `Da calculadora` para não repetir o rótulo).
- ~~`Controle de Leads` → `Leads`~~ ✅ FEITO — `CrmSidebar.tsx:40`, `CrmHeader.tsx` (`Gestão de Leads` → `Leads`), `CrmTabRouter.tsx:122`.
- `Extratos Mensais` → `Fechamentos` ❌ mantido original.
- `Configuracoes` → `Automação` ❌ mantido original.

**B4. Agenda: trocar 6 fritas por 3** — ✅ CONCLUÍDO (2026-09-04, com adaptação documentada abaixo)
- Hoje a agenda tem views demais (`hoje`, `semana`, `atrasados`, `sem_acao`, `dormentes`, `serviços`…) e cada card repete telefone/WhatsApp/Google Calendar.
- Novo: 3 abas — `Hoje e atrasados` / `Próximos 7 dias` / `Parados` (sem ação + dormentes juntos, com selo do motivo).
- Extrair `LeadCardAgenda` para arquivo próprio (`AgendaLeadCard.tsx`) — tira ~300 linhas do `AgendaSection.tsx` (1118 linhas hoje).
- Arquivos: `AgendaSection.tsx`.
- **Implementado:**
  - Extração: `LeadCardAgenda` (307 linhas) → `components/AgendaLeadCard.tsx` (renomeado `AgendaLeadCard`); `AgendaSection.tsx` 1118 → ~810 linhas, sem mudança visual nos cards.
  - Fusão `sem_acao` + `dormentes` → aba única **`Parados`** (contador somado, ordem 3ª: Hoje / Próximos 7 dias / Parados / Serviços / Mês). Listas apenas concatenadas (`idle` + `dormant`) — os selos existentes (`Parado há Nd` / `Dormente`) já distinguem o motivo, sem código novo de selo.
  - `AgendaView`: `'sem_acao' | 'dormentes'` removidos, `'parados'` adicionado (`types.ts`); `useLeadPreferences.ts` migra valores antigos de URL/localStorage via `migrateAgendaView()`; `CrmTabRouter` (`sem_acao` → `parados`) e grid `xl:grid-cols-7` → `xl:grid-cols-6`.
  - **Adaptação vs. plano original:** Serviços (pipeline + rotas por bairro), Mês (calendário) e Ciclo 5 anos foram **mantidos** — cada um carrega informação única que as 3 abas não cobrem (logística de rotas, horizonte mensal, reativação com restore-from-archive). Para reduzir o ruído mesmo assim, a frita **Ciclo 5 anos só aparece quando há leads** (antes era permanente). Ir para 3 abas literais exigiria deletar essas 3 funções — decisão proposital de não perder funcionalidade.

**B5. LeadCard: modo "calmo" por padrão** — ✅ CONCLUÍDO (2026-09-04, com adaptações a pedido do usuário)
- Card expandido mostra hoje: telefone + m² + bairro + serviço + película + dias + valor + 5 botões. É muita coisa para escanear.
- Novo expandido: nome + valor + selo etapa + **próxima ação** ("Retornar 12/09" ou "Agendar retorno") + bairro. Telefone, m², película e botões (editar/excluir/←/→) aparecem só no hover (desktop) ou no tap no card (mobile → abre detalhe).
- Manter pin e sync, mas sync vira ponto colorido (sem ícone grande) quando `ok`; ícone só aparece em `pending/error`.
- Arquivo: `LeadCard.tsx`.
- **Implementado:** expandido agora tem nome + linha de **próxima ação** (`Serviço dd/MM` sky / `Retorno dd/MM` dourado / `Em atraso — retorno dd/MM` vermelho / `Sem retorno agendado` neutro, via nova prop `getLeadFollowUpDate` propagada `CrmTabRouter → KanbanBoard → KanbanDnD → KanbanColumn → SortableLeadCard → LeadCard` + DragOverlay) + bairro + linha [película + valor]. Removidos do card: telefone, m², contador `Xd` e botão editar (duplo clique e modal de detalhe cobrem a edição). Sync `ok` virou ponto verde discreto; selo com ícone só em `pending`/`error`. Rodapé: ← / 🗑 / →.
- **Adaptações:** (1) **película mantida à mostra** (pedido do usuário); (2) botão **excluir mantido** no card — o modal de detalhe não tem caminho de exclusão, então tirá-lo do Kanban deixaria a exclusão só na visão tabela; (3) selo de etapa **não** adicionado (redundante: a coluna já indica a etapa); (4) `daysInStatus` removido do chain do Kanban (mantido na visão tabela, que continua usando).

### FASE C — Código (sustenta B, evita regressão)

**C1. Um `LeadTable` compartilhado** — ✅ CONCLUÍDO (2026-09-04)
- Extrair a `<table>` usada no Kanban (desktop) e em "Leads Recentes" para `components/LeadTable.tsx` com props `leads`, `onOpen`, `onEdit`, `onDelete`, `compact?`.
- Mobile: um `LeadListItem` único (substitui os dois markups `md:hidden` duplicados).
- Arquivos: `KanbanBoard.tsx:254-442`, `MetricsPanel.tsx:414-483`.
- **Implementado:** criados `components/LeadTable.tsx` (união discriminada: `compact` = 5 colunas sem ordenação para Recentes; completo = 9 colunas com `SortableHeader`, debounce de clique/duplo-clique preservado via novas props `onRowClick`/`onRowDoubleClick`, empty states com CTA) e `components/LeadListItem.tsx` (card mobile) + `LeadTableEmpty` (empty em caixa); `KanbanBoard` (~190 linhas removidas) e `MetricsPanel` (~50 linhas removidas, props `formatCurrency`/`getLeadStatusClasses` eliminadas do dashboard) consomem os compartilhados; corrigido de brinde o `Mostrar mais` restante da tabela desktop (A4). Bônus C5: `LeadTable`/`LeadListItem` importam `formatBRL` (A5) e `getLeadStatusClasses` diretamente — menos 2 props perfuradas. Restante perfurado (cards do Kanban ainda recebem `formatCurrency`, saída idêntica) fica para limpeza futura. Suíte: 88/88.

**C2. Uma `SemanaServicos` única (remove duplicação mobile/desktop)** — ✅ CONCLUÍDO (2026-09-04)
- Um map, layout em grid com `overflow-x-auto` no mobile (scroll-snap) em vez de dois maps (`sm:hidden` + `hidden sm:grid`).
- Arquivo: `MetricsPanel.tsx:373-412`.
- **Implementado:** criado `components/SemanaServicos.tsx` (seção inteira — cabeçalho + grade — com **um `map`**; contêiner flex com snap-scroll no celular que vira `sm:grid-cols-2`/`lg:grid-cols-7` no desktop; card unificado no desenho da versão desktop, com `min-w-[158px] snap-start` preservando o carrossel mobile). `MetricsPanel` perdeu ~50 linhas. Suíte: 88/88.

**C3. Centralizar estilo de etapa** — ✅ CONCLUÍDO (2026-09-04)
- Deletar `stageStyles` local do `KanbanBoard.tsx:488-514`; estender `LEAD_STAGE_*` das constants com `border`, `headerBg`, `badge`. Um mapa, todos consomem.
- Arquivos: `constants/stages.ts` (ou novo `constants/stageStyles.ts`), `KanbanBoard.tsx`.
- **Implementado:** criado `LEAD_STAGE_STYLES` (+ tipo `LeadStageStyle`) em `constants/stages.ts`, reexportado no barrel; `KanbanBoard` consome o mapa canônico (fallback local mantido só para etapa desconhecida). Decisão do usuário aplicada: **Agendado = roxo em todo lugar** — `LEAD_STAGE_DOT_COLORS.Agendado` corrigido `sky → purple`, então a barra do funil no dashboard agora combina com a coluna do Kanban (antes divergiam). Suíte: 88/88.

**C4. Quebrar `AgendaSection.tsx` (1118 linhas)** — ✅ CONCLUÍDO (2026-09-04)
- Extrair: `AgendaLeadCard.tsx`, `AgendaFilters.tsx` (abas + contadores), `AgendaCalendar.tsx` (mês/semana). Meta: nenhum arquivo > 350 linhas.
- Mesmo padrão já usado com sucesso em `page.tsx` → `CrmSidebar/CrmHeader/CrmTabRouter`.
- **Implementado:** `AgendaSection.tsx` 1118 → **338 linhas**, sem mudança visual/comportamental:
  - `hooks/useAgendaLists.ts` (~330 linhas, novo): todos os `useMemo`s de listas/contagens + tipos `WeekActionDay`/`MonthActionDay`;
  - `AgendaFilters.tsx` (abas + contadores, ciclo 5 anos condicional mantido);
  - `AgendaWeekStrip.tsx` (faixa "Capacidade diária"; grade desktop passou a usar `weeklyActionDays`, eliminando 3 helpers de contagem por dia);
  - `AgendaMonthCalendar.tsx` (calendário + navegação + resumo do filtro);
  - (`AgendaLeadCard.tsx` já havia saído na B4).
- **Incidente durante a execução:** um script de extração removeu além do previsto (helpers `renderLeadCard`/`renderAgendaSection` + cabeçalho "Central de Agenda"). Detectado pelo `tsc`, **reconstruído verbatim e validado** (tsc + eslint + 88/88 testes). Lição registrada: preferir âncoras fim-a-fim verificadas (como nas extrações que deram certo) e nunca encadear remoções sem compilar entre elas. Suíte: 88/88.

**C5. Reduzir prop-drilling (Kanban recebe 25+ props, Metrics 20+)**
- Kanban/Metrics/Agenda passam a consumir `useCrm()` (selectors `useCrmLeads`, `useCrmFilters`…) em vez de receber tudo via `CrmTabRouter`. `CrmTabRouter` vira só switch de abas (~60 linhas).
- Arquivos: `CrmTabRouter.tsx`, `KanbanBoard.tsx`, `MetricsPanel.tsx`, `AgendaSection.tsx`, `context/CrmContext.tsx`.

---

## 4. O que NÃO fazer (para não voltar ao repetitivo)

- Não criar nova aba para cada métrica nova — métrica nova entra num card existente ou na aba dona.
- Não duplicar markup mobile/desktop — responsivo via CSS, um map.
- Não exibir número sem ação — todo KPI tem destino de clique.
- Não manter bloco `hidden` morto "para depois" — deletar; git guarda histórico.

## 5. Ordem de execução resumida

1. **A1 + A3 + A4** (meio dia): header limpo, 1 card de ação, PT-BR — muda a primeira impressão.
2. **A2 + A5 + C3** (1 dia): meta única, moeda única, cor de etapa única — remove duplicação de código.
3. **B1** (2 dias): dashboard de 6 → 4 seções — o ganho de clareza mais visível.
4. **B2 + B3** (1 dia): arquivo/lixeira unificados + nomes de vendedor.
5. **B5 + C1** (2 dias): LeadCard calmo + tabela compartilhada.
6. **B4 + C4 + C5** (3 dias): agenda de 3 abas + quebra de arquivos + menos props.

> Estimativa total: ~2 semanas em ritmo normal, entregável por fase sem quebrar o app (cada item é isolado por componente).

---

## 6. Correções fora do plano (bugs encontrados no caminho)

**F1. `signal is aborted without reason` no `fetchWithTimeout`** — ✅ CONCLUÍDO (2026-09-04)
- Sintoma: overlay/painel de erro exibindo `signal is aborted without reason` apontando para `src/lib/fetchWithTimeout.ts:15` (`controller.abort()` sem motivo — o Chromium preenche a mensagem criptica).
- Causa dupla: (1) abort sem `reason`; (2) `DOMException` não herda de `Error`, então qualquer checagem `instanceof Error && name === 'AbortError'` (ex.: `ExtratosMensaisSupabase.tsx:384`) **nunca** detectava o timeout — caía sempre no ramo "erro inesperado".
- Correção central em `src/lib/fetchWithTimeout.ts`: abort agora passa `DOMException('Requisicao abortada apos Ns sem resposta (timeout)...', 'AbortError')` como motivo (o fetch rejeita com ele, `name` preservado); novo helper `isAbortError(error)` checando por `name` sem `instanceof`; `ExtratosMensaisSupabase` migrado para o helper.
- Teste: `hooks/__tests__/fetchWithTimeout.test.ts` (3 testes — timeout com mensagem, sucesso antes do timeout, `isAbortError`). Suíte: 88/88.
