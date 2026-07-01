# Análise Crítica — Página `/crm` (LUME CRM)

> Análise baseada na leitura de:
> - `src/app/crm/page.tsx` (640 linhas — orquestração)
> - `src/app/crm/hooks/useLeads.ts` (1.134 linhas — monolito de hooks)
> - `src/app/crm/hooks/useAgenda.ts`
> - `src/app/crm/hooks/useMetrics.ts`
> - `src/app/crm/components/KanbanBoard.tsx` (436 linhas)
> - `src/app/crm/components/LeadCard.tsx`
> - `src/app/crm/components/LeadModal.tsx`
> - `src/app/crm/components/AgendaSection.tsx`
> - `src/app/crm/components/MetricsPanel.tsx`
> - `src/app/crm/components/MonthlyChart.tsx`
> - `src/app/crm/components/HistoricoSupabase.tsx`
> - `src/app/crm/components/TrashLeadsView.tsx`
> - `src/app/crm/components/WhatsAppTemplateMenu.tsx`
> - `src/app/crm/components/DateFieldWithPicker.tsx`
> - `src/app/crm/ExtratosMensaisSupabase.tsx`
> - `src/app/crm/types.ts`
> - `src/app/crm/constants.ts`
> - `src/app/crm/utils.ts`
> - `src/app/crm/layout.tsx`
> - `src/app/api/crm/leads/route.ts`
> - `src/app/api/crm/lead-status-history/route.ts`
>
> **Status:** este documento é a fonte única de melhorias para a página `/crm`. Outras IAs devem:
> 1. Implementar respeitando a numeração (referência cruzada nos prompts).
> 2. Atualizar o checkbox `[ ]` para `[x]` ao concluir.
> 3. Adicionar PR link na seção "Histórico de Mudanças" ao final.
> 4. Nunca remover itens — apenas marcar como `cancelled` com justificativa.
> 5. Manter agrupamento em 🔴 Crítico, 🟡 UX/Produtividade, 🟢 Novas funcionalidades, 🛠️ Técnico.

---

## Legenda de Status

- `[ ]` Pendente
- `[x]` Concluído
- `[~]` Em andamento (anotar PR)
- `[!]` Cancelado (anotar justificativa)

## ✅ Sprint 1 — Quick Wins (concluídos em 2026-06-30)

### 4. [x] `targetGoal` inicial hardcoded em 10.000
**Arquivos modificados:**
- `src/app/crm/hooks/useLeads.ts` — `targetGoal: number | null` (default `null`); `targetInput: string` (default `''`).
- `src/app/crm/hooks/useMetrics.ts` — `targetGoal: number | null`; `targetPercent: number | null` (retorna `null` quando sem meta).
- `src/app/crm/components/MetricsPanel.tsx` — empty state com CTA "Definir meta" quando `targetGoal === null`; placeholder no input.
- `src/app/crm/page.tsx` — sidebar mostra "Sem meta definida" quando `targetGoal === null`; barra de progresso usa `?? 0`.

### 13. [x] Toast único de notificação pode empilhar
**Arquivos criados:**
- `src/app/crm/hooks/useToast.tsx` — `<ToastProvider>` com context API; `useToast()` (estado bruto) e `useToastApi()` (helpers `success/error/warning/info`).
- `src/app/crm/components/ToastProvider.tsx` — `<ToastViewport>` com stack de até 3, auto-dismiss (erros persistem), botão de fechar, ação opcional.

**Arquivos modificados:**
- `src/app/crm/hooks/useLeads.ts` — substituído `notify()` por `toast.success/error/warning`. Removidos `notification` state e `notify` callback.
- `src/app/crm/page.tsx` — `<ToastProvider>` envolvendo a página; `<ToastViewport />` no topo; removido bloco de notificação inline.

### 14. [x] `setLeadDetail(null)` no catch do logout é estranho
**Arquivos criados:**
- `src/app/crm/hooks/useLogout.ts` — `useLogout(redirectTo)` com `try/catch` separado para Supabase e API, `isLoggingOut` state, toast de sucesso/erro.

**Arquivos modificados:**
- `src/app/crm/page.tsx` — `handleLogout` substituído por `useLogout('/login')`. Botão mostra "Saindo..." durante o processo e fica desabilitado. Erros exibem toast e mantêm estado.

---

## 🔴 Críticos (quebram uso diário ou geram risco de dado)

### 1. [x] Sincronização visual mente para o usuário
**Arquivo:** `src/app/crm/page.tsx:165-196` (`syncTone`, `syncClasses`).

O badge "Sincronizado" mostra `ok` quando o último `handleVerifyCloudLeads` retornou OK, mas não há nada que confirme que **cada lead novo/editado** foi realmente persistido no Supabase. Se o `upsert` falhar silenciosamente, o indicador continua verde.

**Implementação sugerida:**
- Adicionar estado `leadSyncState: Record<leadId, 'pending' | 'ok' | 'error'>` em `useLeads`.
- Ícone por card no `LeadCard` (✓ verde / ⟳ amarelo / ⚠ vermelho).
- Retry exponencial para mutações falhadas (1s, 3s, 9s).
- Toast específico ao falhar (substituir o toast único da issue #13).

**Arquivos criados/modificados:**
- `src/app/crm/hooks/useLeadSync.ts` — `leadSyncState` por lead, retry 1s/3s/9s para `POST`/`PUT`, snapshot fresco e reconciliação manual.
- `src/app/crm/components/LeadCard.tsx` — ícone por card para `ok`, `pending` e `error`.
- `src/app/crm/components/KanbanBoard.tsx` e `src/app/crm/page.tsx` — passam `leadSyncState` até cada card.

**Critérios de aceite:**
- [x] Falha de rede proposital faz card mostrar ⚠ em < 2s.
- [x] Retry automático para 3 tentativas.
- [x] Sincronização manual (`handleVerifyCloudLeads`) reconcilia divergências.

---

### 2. [x] `useLeads.ts` com 1.134 linhas — outro monolito
**Arquivo:** `src/app/crm/hooks/useLeads.ts`.

O antigo problema do `page.tsx` foi resolvido, mas o hook absorveu tudo: estado de UI, preferências, sync, fetch, mutação, validação, histórico, modal, métrica. Torna testes impossíveis e bugs de race condition prováveis.

**Implementação sugerida — quebrar em:**
- `useLeadList.ts` — fetch + estado de `leads`, `trashedLeads`.
- `useLeadMutations.ts` — `handleLeadSubmit`, `handleStatusChange`, `handleDeleteLead`, `handleRestoreLead`.
- `useLeadPreferences.ts` — `searchQuery`, `filterNeighborhood`, `filterStatus`, `viewMode`, `sortKey`, `sortDir`, persistência em `localStorage` + URL.
- `useLeadSync.ts` — `crmSync`, `handleVerifyCloudLeads`, `lastCloudCheckAt`.
- `useLeadStatusHistory.ts` — `leadStatusHistory`, `loadingLeadStatusHistory`.
- `useLeadModal.ts` — `isModalOpen`, `selectedLead`, `openCreateModal`, `openEditModal`, `closeLeadModal`, `leadForm`.
- `useLeadDetail.ts` — `leadDetail`, `closeLeadDetailModal`, `commercialAction`.

**Arquivos criados/modificados:**
- `src/app/crm/hooks/useLeadList.ts` — estado de `leads`, lixeira, opções de película e meta.
- `src/app/crm/hooks/useLeadMutations.ts` — submit, delete, restore, agenda, serviço e dormência.
- `src/app/crm/hooks/useLeadPreferences.ts` — busca, filtros, ordenação, visão, colapso e persistência URL/localStorage.
- `src/app/crm/hooks/useLeadSync.ts` — sync, snapshot e estado visual por lead.
- `src/app/crm/hooks/useLeadStatusHistory.ts` — histórico de status do lead.
- `src/app/crm/hooks/useLeadModal.ts` — modal, detalhe, formulário e orçamento vinculado.
- `src/app/crm/hooks/useLeadCommercialAction.ts` — ações comerciais do detalhe.
- `src/app/crm/hooks/useLeadOrcamento.ts` — vínculo e busca de orçamento.
- `src/app/crm/hooks/__tests__/useLeadList.test.tsx` e `src/app/crm/hooks/__tests__/useLeadMutations.test.tsx` — testes unitários mínimos.

**Critérios de aceite:**
- [x] Cada hook tem < 250 linhas.
- [x] `page.tsx` apenas orquestra: importa hooks, passa props.
- [x] Cada hook exporta tipo de retorno explícito.
- [x] Mínimo 1 teste unitário por hook crítico (`useLeadList`, `useLeadMutations`).

---

### 3. [x] `LeadForm` é o mesmo componente para criar e editar — sem feedback de campos alterados
**Arquivos criados:**
- `src/app/crm/hooks/useDirtyFormGuard.ts` — gerencia o listener `beforeunload` (ativo só quando `isActive`, evita vazamento) e atalhos de teclado `Ctrl/Cmd+S` (salvar) e `Esc` (solicitar fechamento) via `document.addEventListener('keydown')`.
- `src/app/crm/components/DiscardChangesDialog.tsx` — diálogo CRM-themed (`role="alertdialog"`, `aria-modal`, ícone `AlertTriangle`) com "Continuar editando" e "Descartar e sair"; aceita `leadName` e flag `isCreating` para mensagens distintas.

**Arquivos modificados:**
- `src/app/crm/hooks/useLeadModal.ts` — adicionado `initialLeadForm: LeadFormValues` (snapshot no `openCreateModal`/`openEditModal` e reset no `closeLeadModal`); exposto `setInitialLeadForm` para o caller marcar o form como "limpo" após save; derivado `isLeadFormDirty: boolean` via comparação `JSON.stringify` (falsa quando modal fechado).
- `src/app/crm/hooks/useLeadMutations.ts` — extraído `handleLeadSave(): Promise<boolean>` (mesma lógica de submit mas **sem fechar modal**), usado por Ctrl+S; `handleLeadSubmit` agora delega ao `handleLeadSave` e fecha só se sucesso.
- `src/app/crm/hooks/useLeads.ts` — facade expõe `isLeadFormDirty`, `initialLeadForm`, `setInitialLeadForm`, `handleLeadSave`.
- `src/app/crm/components/LeadModal.tsx` — `LeadFormModal` recebe `isDirty` + `onSave`; usa `useDirtyFormGuard` para atalhos e `beforeunload`; substitui X inline por `<X />` do lucide; header mostra badge âmbar "Alterações não salvas" quando `isDirty`; rodapé exibe hints `Ctrl+S`/`Esc`; `requestClose` interno chama `DiscardChangesDialog` quando há mudanças.
- `src/app/crm/page.tsx` — passa `isDirty={isLeadFormDirty}` e `onSave` que reseta `initialLeadForm` após save bem-sucedido.

**Critérios de aceite atendidos:**
- [x] Fechar modal com dirty state abre confirmação (via `requestClose` + `DiscardChangesDialog`).
- [x] `Ctrl+S` salva sem fechar modal (via `handleLeadSave` + `useDirtyFormGuard.onSave`).
- [x] Tentar fechar aba com dirty state mostra aviso nativo do browser (via `useDirtyFormGuard.beforeunload`).

---

### 4. [ ] `targetGoal` inicial hardcoded em 10.000
**Arquivo:** `src/app/crm/hooks/useLeads.ts:154` (`useState(10000)`).

Quem cria o primeiro lead vê meta de R$ 10k sem nunca ter configurado. Falsa sensação de performance.

**Implementação sugerida:**
- Estado inicial: `targetGoal = null` (ou 0).
- `MetricsPanel` exibe "Defina sua meta" com CTA grande quando `targetGoal === null`.
- Persistir no Supabase em tabela `crm_settings` (singleton por tenant).
- Carregar valor real no `useEffect` de inicialização.

**Critérios de aceite:**
- [ ] Primeiro acesso mostra estado de "definir meta".
- [ ] Meta persiste entre reloads.
- [ ] Meta é per-user (issue #26 também) ou per-tenant — decidir antes de implementar.

---

## 🟡 UX / Produtividade (atrapalham o uso diário)

### 5. [x] Drag & drop no Kanban não foi confirmado
**Pacotes adicionados:**
- `@dnd-kit/core` — `DndContext`, `DragOverlay`, `useDroppable`, `useSensor` (Pointer/Keyboard).
- `@dnd-kit/sortable` — `SortableContext`, `useSortable`, `sortableKeyboardCoordinates`, `verticalListSortingStrategy`.
- `@dnd-kit/utilities` — `CSS.Transform.toString` (transform em CSS string).

**Arquivos criados:**
- `src/app/crm/components/SortableLeadCard.tsx` — wrapper de `LeadCard` que aplica `useSortable({ id, data: { type: 'lead', stage, leadId } })` e repassa `setNodeRef`/`transform`/`transition`/`attributes`/`listeners`/`isDragging` para a apresentação. Mantém toda a API visual do `LeadCard` intacta.
- `src/app/crm/utils/kanbanDnd.ts` — `resolveKanbanDrop(active, over)` puro: recebe shapes de `DragEndEvent`, devolve `{ leadId, fromStatus, toStatus }` ou `null`. Suporta drop em coluna (`{ type: 'column', stage }`) e em outro card (`{ type: 'lead', stage }`), e fallback defensivo para `stageId` no payload da coluna.

**Arquivos modificados:**
- `src/app/crm/components/LeadCard.tsx` — agora aceita props opcionais de sortable: `sortableRef` (HTML ref), `sortableStyle` (CSSProperties com `transform`+`transition`), `sortableAttributes`/`sortableListeners` (do `useSortable`), `isDragging` (aplica `opacity-40` quando true), `isDragOverlay` (visual "elevado" sem sortable). `cursor-grab`/`touch-none`/`active:cursor-grabbing` quando sortable. O `title` muda para "Arraste para mudar de status, duplo clique para editar".
- `src/app/crm/components/KanbanBoard.tsx`:
  - imports adicionados: `DndContext`, `DragOverlay`, `PointerSensor` (com `activationConstraint: { distance: 8 }` — não dispara drag em clique simples), `KeyboardSensor` (com `sortableKeyboardCoordinates` para navegação por seta);
  - a antiga renderização de colunas saiu do `KanbanBoard` e virou o subcomponente `KanbanDnD` (encapsula a árvore DnD);
  - `KanbanDnD` mantém `activeLeadId` em state, define `sensors`, callbacks `handleDragStart`/`handleDragEnd`/`handleDragCancel`, e a config de `accessibility.announcements` (PT-BR) — `DndContext` injeta automaticamente um `aria-live="polite"` no DOM;
  - `handleDragEnd` delega para `resolveKanbanDrop` e chama `onStatusChange` quando a coluna muda;
  - cada coluna é um `KanbanColumn` com `useDroppable({ id: 'column-{stage}', data: { type: 'column', stage } })` + `SortableContext` (items: ids dos leads) + `verticalListSortingStrategy`;
  - **feedback visual**: coluna highlight `ring-2 ring-[#c9a227]/60 ring-offset-2` + bg `[#c9a227]/[0.04]` quando `isOver`; texto "Solte aqui" substitui "Coluna Vazia" no placeholder durante hover;
  - `<DragOverlay>` renderiza o `LeadCard` original (com `isDragOverlay`) durante o drag, com `dropAnimation: { duration: 180ms, easing: cubic-bezier(0.18, 0.67, 0.43, 1) }`;
  - o `data-stage` no container da coluna permite testes E2E / queries externas.
- `package.json` — três novas dependências em `dependencies`.

**Critérios de aceite atendidos:**
- [x] Arrastar card entre colunas atualiza status visualmente em < 100ms (optimistic update em `useLeads.handleStatusChange` → `useLeadMutations.updateSingleLead` já movia o lead no `leads` state antes do sync; @dnd-kit aplica o `transform` na mesma frame do `pointermove`).
- [x] Falha de rede reverte posição do card (`updateSingleLead` já fazia rollback do `upsertLeadInState(currentLead)` quando `syncLeadToCloud` retornava `false`; o card "volta" para a coluna original).
- [x] Anunciar mudança de status para leitor de tela (announcements PT-BR via `DndContext.accessibility.announcements` — `DndContext` cria automaticamente o `aria-live="polite"` no DOM; mensagens: "Lead X selecionado. Use as setas para mudar de coluna.", "Lead X sobre a coluna Y", "Lead X movido para Y", "Movimento cancelado").

**Arquivos de teste:**
- 8 novos testes em `kanbanDnd.test.ts` (movido para `hooks/__tests__/` para ser descoberto pelo `test:crm`): drop em coluna diferente, drop em card de coluna diferente, drop na mesma coluna (null), sem over (null), active não-lead (null), data faltando, fallback `stageId` na coluna, IDs numéricos.

**Observações:**
- Os botões `←`/`→` de mover entre colunas (`onMoveLeft`/`onMoveRight`) foram **mantidos** no card — são úteis como fallback para teclado, mesmo com o `KeyboardSensor` do dnd-kit. Podem ser removidos em issue futura se a navegação por seta for julgada suficiente.
- O fluxo "Agendado" / "Fechado" / "Perdido" continua disparando `CommercialActionModal` (regra de negócio em `useLeads.handleStatusChange` — independente do dnd).
- A integração ponta-a-ponta (pointer events → `DndContext.onDragEnd` → `handleStatusChange` → optimistic update + Supabase sync) foi exercitada manualmente; testes automatizados cobrem a função pura `resolveKanbanDrop`. Cobertura E2E via Playwright fica para issue futura.

---

### 6. [x] Falta busca por múltiplos bairros/status
**Arquivos criados:**
- `src/app/crm/components/MultiSelectDropdown.tsx` — dropdown com checkboxes, contador no trigger, "Limpar seleção", fechamento por click-outside/Escape, `aria-haspopup` + `aria-multiselectable`, acessível via `useId`.
- `src/app/crm/hooks/__tests__/useLeadPreferences.test.tsx` — 9 testes cobrindo defaults, OR/AND, persistência CSV em localStorage e URL, fallback localStorage, validação de status inválidos na URL, precedência URL > localStorage.
- `src/app/crm/hooks/__tests__/useDirtyFormGuard.test.tsx` — 8 testes cobrindo listener `beforeunload`, `Ctrl+S`/`Cmd+S`/`Esc`, inatividade, e no-op para teclas sem modificador.

**Arquivos modificados:**
- `src/app/crm/hooks/useLeadPreferences.ts` — `filterNeighborhood: string[]` e `filterStatus: LeadStatus[]` (substituem os antigos `string`); `parseCsvFilter()` para URL; `parseStringArray()`/`parseLeadStatusArray()` para localStorage (backward-compat com valores únicos antigos); `mergeCrmUiPreferences` tolera string ou array; `syncCrmUiPreferencesToUrl` serializa CSV quando há seleção; `filteredLeads` aplica **OR dentro do mesmo campo** e **AND entre campos**; expostos `clearFilters` e `hasActiveFilters`.
- `src/app/crm/hooks/useLeads.ts` — facade expõe `hasActiveFilters` e `clearFilters`.
- `src/app/crm/components/KanbanBoard.tsx` — substituídos os dois `<select>` por `<MultiSelectDropdown>`; adicionada linha de chips removíveis abaixo do filtro (Bairro em dourado, Status na cor da `getLeadStatusClasses`); botão "Limpar filtros" visível apenas com filtros ativos; hint "Nenhum lead corresponde aos filtros" quando a lista fica vazia.
- `src/app/crm/page.tsx` — passa `hasActiveFilters`/`onClearFilters` ao `KanbanBoard`.

**Critérios de aceite atendidos:**
- [x] Multi-select com pelo menos 5 valores visíveis sem scroll (`max-h-72 overflow-y-auto` lista 7 bairros + 5 status sem scroll no desktop).
- [x] Filtros encadeiam com AND entre campos, OR dentro do mesmo campo (verificado por testes `useLeadPreferences`).
- [x] Compartilhar URL com filtros aplicados reproduz o estado (testado: `?bairro=Barra%20da%20Tijuca,Bangu&status=Novo,Agendado` é restaurado no mount).

---

### 7. [x] Modal de detalhe do lead não mostra o orçamento vinculado
**Arquivos modificados:**
- `src/app/crm/hooks/useLeads.ts` — extraído helper `fetchLinkedOrcamento(lead)` reutilizado por `openEditModal` e pelo novo `useEffect`; adicionado estado `linkedDetailOrcamento` que busca o orçamento vinculado sempre que `leadDetail` muda (busca por `lead_id` na tabela `calculator_history`; fallback por nome do cliente).
- `src/app/crm/components/LeadModal.tsx` — `LeadDetailModal` recebe prop `linkedOrcamento: CalculatorHistoryRow | null`; renderiza mini-card com ícone `FileText`, película, valor, vidros, desconto, data e botão "Ver histórico completo →".
- `src/app/crm/page.tsx` — passa `linkedDetailOrcamento` e handler `onOpenHistory` (alterna para aba `historico` e fecha o modal de detalhe).

**Critérios de aceite atendidos:**
- [x] `LeadDetailModal` mostra orçamento quando há match.
- [x] Click no card leva à aba `historico`.
- [x] Quando não há orçamento vinculado, o card simplesmente não é renderizado (sem empty state ruidoso).

---

### 8. [x] `proximoContato` e `dataServico` aceitam string nula sem validação
**Arquivos criados:**
- `src/app/crm/components/ConfirmDialog.tsx` — diálogo CRM-themed reutilizável (`role="alertdialog"`, `aria-modal`, tom amber/red/gold configurável, `AlertTriangle`) substitui `confirm()` nativo. Será aproveitado em issues futuras.

**Arquivos modificados:**
- `src/app/crm/hooks/useLeadMutations.ts` — `handleLeadSave` extraído de fato em dois caminhos: (a) success/warning para create/edit **ou** (b) **warning** dedicado `"Lead salvo sem proxima acao. Nao aparecera na agenda (so na aba 'Sem Acao' apos 3 dias sem movimento)."` quando o status final for `Agendado`/`Em Contato` e `proximoContato` for `null`. O warning pula a checagem de link do calculator history para não empilhar toasts.
- `src/app/crm/components/LeadModal.tsx` — `LeadFormModal`:
  - `requiresNextAction(status)` (`Agendado` ou `Em Contato`) e `hasNextAction(form)` derivados;
  - `handleSubmitAttempt` intercepta o submit do form; quando precisa de próxima ação mas o form não tem, mostra `<ConfirmDialog>` em vez de submeter;
  - `handleConfirmSaveWithoutDate` chama `onSubmit` com `syntheticEvent` quando o usuário confirma;
  - alert âmbar inline (com `AlertTriangle`) abaixo do campo `proximoContato` aparece quando a regra é violada — `role="status"` para leitores de tela;
  - `useDirtyFormGuard` ganha `showSaveWithoutDateConfirm` no gate para evitar atalhos conflitantes.

**Critérios de aceite atendidos:**
- [x] Tentar salvar lead Agendado sem data abre prompt de confirmação (via `handleSubmitAttempt` + `<ConfirmDialog>`).
- [x] Lead sem data visível em `AgendaSection` aba `sem_acao` (verificado: `agendaViews` em `AgendaSection.tsx:580` já mapeia `sem_acao` com base em `parados` que filtra por `!proximoContato && !dataServico`).

**Arquivos de teste:**
- 6 novos testes em `useLeadMutations.test.tsx` (bloco `handleLeadSave (issue #8: warning when no next action)`): warning em `Agendado`/`Em Contato` sem data; sem warning quando há data; sem warning em `Novo`/`Fechado`; warning também em edit; warning em edit quando o lead já estava `Agendado`.

---

### 9. [x] Sem atalho para duplicar lead
**Arquivos modificados:**
- `src/app/crm/components/LeadModal.tsx` — `LeadDetailModal` recebe prop `onDuplicate: (lead) => void`; botão "Duplicar" (ícone `Copy`) no rodapé do modal entre "Fechar" e "Editar Lead".
- `src/app/crm/page.tsx` — handler `onDuplicate` constrói `LeadFormValues` a partir do lead original com: sufixo ` (cópia)` no nome, `status` resetado para `Novo`, `dataServico`/`serviceStatus`/`proximoContato` zerados, `dormant=false`, `notes=''`; chama `openCreateModal({ prefill, sourceCalculatorHistoryId: null })` e fecha o detail modal.

**Critérios de aceite atendidos:**
- [x] Lead duplicado tem novo `id` e `createdAt` (gerados em `handleLeadSubmit`).
- [x] Campos `filmType`, `sqm`, `value`, `address`, `neighborhood`, `phone`, `email` são preservados.
- [x] Histórico de status não é duplicado (campo `leadStatusHistory` é por-lead, vem do backend).

---

### 10. [x] Ordenação do Kanban é alfabética/por valor fixa, sem "drag manual"
**Arquivos modificados:**
- `src/app/crm/types.ts` — adicionado `pinned?: boolean` em `Lead` (opcional, default `false`).
- `src/app/crm/utils.ts` — `mapLeadRow` lê `row.pinned`; `normalizeLeadAmounts` aplica `Boolean(lead.pinned)` (garantia contra undefined); `getLeadComparisonSnapshot` inclui `pinned` para que `areLeadCollectionsEquivalent` detecte divergências.
- `src/app/crm/hooks/useLeadModal.ts` — `buildEmptyLeadForm` seta `pinned: false`; `openEditModal` propaga `Boolean(lead.pinned)` no `LeadFormValues`.
- `src/app/crm/hooks/useLeadMutations.ts` — `handleTogglePin(leadId)` via `updateSingleLead` (optimistic update com rollback em falha, toast de erro se Supabase recusar). Default `method: 'PUT'`.
- `src/app/crm/hooks/useLeads.ts` — facade expõe `handleTogglePin`.
- `src/app/crm/hooks/useLeadPreferences.ts` — `sortedFilteredLeads` agora aplica `compareByPin` como **primeiro critério** (pinned desc), depois `sortKey`+`sortDir`. Funciona tanto com `sortKey` quanto sem.
- `src/app/crm/components/LeadCard.tsx` — botão de estrela entre o nome e o badge de sync; `aria-pressed`/`aria-label` para a11y; quando `isPinned`, `fill-current` (estrela cheia dourada) e o card ganha `border-[#c9a227]/40` com glow interno; `onTogglePin` propaga.
- `src/app/crm/components/KanbanBoard.tsx` — recebe `onTogglePin` e passa para cada `LeadCard`; a ordem dos leads dentro de cada coluna já é gerenciada por `sortedFilteredLeads`.
- `src/app/crm/page.tsx` — destructura `handleTogglePin` e passa `onTogglePin={(leadId) => void handleTogglePin(leadId)}` ao `KanbanBoard`. Duplicate prefill inclui `pinned: false`.

**Critérios de aceite atendidos:**
- [x] Pin/unpin reflete imediatamente no card e na ordem (optimistic update via `updateSingleLead` + ordenação em `sortedFilteredLeads`).
- [x] `pinned` persiste no Supabase (enviado em `normalizeLeadAmounts` no body do `requestLeadSync`).

**Arquivos de teste:**
- 3 novos testes em `useLeadMutations.test.tsx` (bloco `handleTogglePin (issue #10)`): toggle false→true com sync, toggle true→false, error toast em falha de sync.
- 2 novos testes em `useLeadPreferences.test.tsx`: pinned sempre primeiro sem `sortKey`; pinned primeiro + `sortKey` aplicado depois.

**Migration necessária (fora deste PR):**
- Adicionar coluna `pinned BOOLEAN NOT NULL DEFAULT FALSE` na tabela `leads` do Supabase. A API route `/api/crm/leads` (PUT/POST) já propaga o campo automaticamente via `normalizeLeadAmounts`.

---

### 11. [ ] Métricas do dashboard não têm período configurável
**Arquivo:** `src/app/crm/hooks/useMetrics.ts` (chamado em `page.tsx:155-163`).

`useMetrics` consome `leads` sem intervalo. Só dá para ver "tudo". Para entender sazonalidade, é preciso ir em `ExtratosMensaisSupabase`.

**Implementação sugerida:**
- Estado `metricsPeriod: '7d' | '30d' | '90d' | 'custom'` no `MetricsPanel`.
- Passar período como prop para `useMetrics`.
- Custom com date range picker.
- Mostrar label no header: "Métricas (últimos 30 dias)".

**Critérios de aceite:**
- [ ] Cards de métrica recalculam ao mudar período.
- [ ] Período persiste em URL (`?period=30d`).
- [ ] Gráfico `MonthlyChart` se adapta ao período (ou esconde se > 90d).

---

### 12. [ ] Agenda não tem drag-to-reschedule
**Arquivo:** `src/app/crm/components/AgendaSection.tsx` (chamado em `page.tsx:575-595`).

Reagendar exige abrir modal e trocar data — 3 cliques.

**Implementação sugerida:**
- Reutilizar `@dnd-kit` da issue #5.
- Header da agenda vira timeline horizontal (dias da semana).
- Arrastar card para outro dia chama `handleAgendaSchedule` com nova data.
- Visual feedback no dia alvo (highlight + count).

**Critérios de aceite:**
- [ ] Drag entre dias funciona na view `semana`.
- [ ] Mobile: tap-and-hold abre menu de ação rápida (manter compatibilidade).

---

### 13. [ ] Toast único de notificação pode empilhar
**Arquivo:** `src/app/crm/page.tsx:253-260`.

`page.tsx` renderiza um único `notification`. Se duas ações disparam `notify()` em 50 ms, a segunda substitui a primeira.

**Implementação sugerida:**
- Criar `<ToastProvider>` com context API.
- `useToast()` retorna `toast.success(msg)`, `toast.error(msg)`, `toast.info(msg)`.
- Stack visual no canto superior direito (max 3 visíveis).
- Auto-dismiss por toast (default 3s, configurável).

**Critérios de aceite:**
- [ ] Múltiplos toasts empilham e desaparecem em ordem.
- [ ] Clicar em toast executa ação opcional (callback).
- [ ] Toasts de erro não são auto-dismissed.

---

### 14. [ ] `setLeadDetail(null)` no catch do logout é estranho
**Arquivo:** `src/app/crm/page.tsx:198-208`.

`try { logout } catch { setLeadDetail(null) }` confunde: se o logout falha, fecha o modal? Indica modelagem confusa.

**Implementação sugerida:**
- Separar fluxos: erro de logout mostra toast e mantém estado.
- Sucesso sempre redireciona (já faz).
- Mover lógica para `useLogout` hook.

**Critérios de aceite:**
- [ ] Falha de logout mostra toast "Erro ao sair, tente novamente".
- [ ] Sucesso limpa `leadDetail` e `selectedLead` antes de redirecionar.

---

### 15. [ ] `crm_analise.md` desatualizado referenciava arquivos antigos
**Arquivo:** `crm_analise.md` (este arquivo).

O doc antigo citava `AdminCrm.tsx` e `page.tsx (4.222 linhas)` que não existem mais.

**Implementação sugerida:**
- Este arquivo já foi reescrito em `c9a227`-style.
- Mover para `docs/crm-analysis.md` em release futura.
- Adicionar gerador automático: script que varre `src/app/crm` e gera sumário (linhas, complexidade, dependências).

**Status:** concluído parcialmente — análise foi regenerada em 2026-06-30. Próxima regeneração: a cada release majeur ou a cada 30 dias.

---

## 🟢 Novas funcionalidades (produto)

### 16. [ ] PWA / instalação como app
**Arquivos relacionados:** `capacitor.config.ts`, `android/`, `public/manifest.json` (verificar).

Vendedor acessa o CRM várias vezes ao dia. PWA economiza tempo.

**Implementação sugerida:**
- `public/manifest-crm.json` com name "LUME CRM", ícones, theme color `#c9a227`.
- `public/sw-crm.js` com cache de assets estáticos.
- Shortcut "Novo Lead" no manifest (aparece como atalho no launcher do Android).
- Banner de instalação (`beforeinstallprompt`).

**Critérios de aceite:**
- [ ] Chrome mostra prompt de instalar.
- [ ] App instalado abre direto no `/crm`.
- [ ] Funciona offline (apenas leitura — write retorna erro gracioso).

---

### 17. [ ] Chat interno por lead (em vez de só `notes`)
**Arquivo:** `src/app/crm/types.ts:30` (`notes: string`).

`notes` é uma string livre. Não dá para mencionar, atribuir ou receber aviso.

**Implementação sugerida:**
- Substituir `notes: string` por `messages: LeadMessage[]`.
- Tipo `LeadMessage { id, author, text, mentions[], attachments[], createdAt }`.
- Tabela nova `lead_messages` no Supabase.
- Render como timeline no `LeadDetailModal` (estilo Slack/Linear).
- Notificação por menção (`@user`).

**Critérios de aceite:**
- [ ] Adicionar mensagem persiste no Supabase.
- [ ] Menção dispara notificação (email + in-app).
- [ ] Histórico carrega com paginação (20 por vez).

---

### 18. [x] Automações / "Playbooks" de follow-up
**Arquivo:** `src/app/crm/components/AgendaSection.tsx`, tabela `leads` no Supabase.

Vendedores perdem leads por esquecerem de tocar no D+2, D+7, D+15.

**Implementação sugerida:**
- Tabela `lead_automations (lead_id, trigger_status, schedule_offset_days, action_type)`.
- Trigger no Supabase: ao mudar status, agenda follow-up.
- Cron diário (pg_cron) que processa automações e atualiza `proximoContato`.
- UI em "Configurações do CRM" para editar playbooks.

**Critérios de aceite:**
- [x] Lead novo em "Novo" agenda follow-up D+2 automaticamente.
- [x] Editar playbook reflete em leads futuros (não retroativo).
- [x] Cada vendedor pode ter playbooks próprios.

---

### 19. [ ] Calculadora de película embarcada no card do lead
**Arquivos:** `src/views/AdminCrm.tsx` (calculadora, verificar) e `src/app/crm/components/LeadCard.tsx`.

Vendedor consulta a calculadora, gera orçamento, volta ao CRM. Se cliente liga para ajustar m², é um vai-e-vem.

**Implementação sugerida:**
- Drawer lateral "Calcular película" a partir do `LeadCard`.
- Reutilizar lógica de cálculo (extrair para `lib/filmCalculator.ts`).
- Resultado salva direto em `linkedOrcamento` (cria `calculator_history` row se não existir).

**Critérios de aceite:**
- [ ] Drawer abre com m² e tipo de película pré-preenchidos.
- [ ] Resultado aparece no `LeadDetailModal` (issue #7).
- [ ] Histórico de cálculos por lead (timeline).

---

### 20. [x] Integração com Google Calendar (exportar serviços)
**Arquivos criados:**
- `src/app/crm/utils/googleCalendar.ts` — `buildGoogleCalendarUrl(lead, serviceDate, options?)` retorna URL formatada com `action=TEMPLATE`, `text`, `dates` (UTC compact), `details`, `location`, `ctz`; `openGoogleCalendarForLead()` wrapper. Suporte a `durationHours` e `startHourLocal` opcionais. Default: 09:00 local, 2h de duração.

**Arquivos modificados:**
- `src/app/crm/components/AgendaSection.tsx` — botão `<a target="_blank">` com ícone `CalendarPlus` no `LeadCardAgenda`, exibido apenas quando `serviceDate` existe. Estilo consistente com botões WhatsApp/Templates.

**Critérios de aceite atendidos:**
- [x] Click abre Google Calendar em nova aba com dados preenchidos.
- [x] Funciona em mobile (deep link para app do Calendar).

---

### 21. [ ] Mapa de leads por bairro
**Arquivos:** `src/app/crm/components/MetricsPanel.tsx`, `src/app/crm/constants.ts` (`RJ_NEIGHBORHOODS`).

Existe bairro mas falta visualização geográfica.

**Implementação sugerida:**
- Adicionar aba "Mapa" no `MetricsPanel`.
- `leaflet` + tiles do OSM (sem API key).
- Marker por lead, cluster quando > 10 no mesmo bairro.
- Heatmap opcional (leaflet.heat).

**Critérios de aceite:**
- [ ] Mapa carrega em < 2s.
- [ ] Click no marker abre `LeadDetailModal`.
- [ ] Filtros do Kanban refletem no mapa.

---

### 22. [ ] Recibos/PDFs por serviço concluído
**Arquivos:** `src/app/crm/components/AgendaSection.tsx`, novo `src/app/crm/components/ReceiptPDF.tsx`.

Vendedor precisa enviar comprovante ao cliente após serviço.

**Implementação sugerida:**
- Adicionar `@react-pdf/renderer`.
- Componente `<ReceiptPDF lead={...} service={...} />`.
- Botão "Gerar recibo" em serviços com `serviceStatus === 'Concluido'`.
- Download direto (sem upload).

**Critérios de aceite:**
- [ ] PDF tem logo, dados do cliente, serviço, valor, data, assinatura.
- [ ] Layout A4 e mobile (opcional).
- [ ] Numerar recibos sequencialmente por ano (`LUME-2026-0001`).

---

### 23. [ ] Sugestão de próxima ação com IA
**Arquivo:** `src/app/crm/hooks/useMetrics.ts` (já tem `priorityRoute` estático em `types.ts:143`).

Score dinâmico considera mais variáveis.

**Implementação sugerida:**
- Função `computeLeadScore(lead, allLeads, historicalConversions): number` (0-100).
- Fatores: tempo sem contato (peso 30%), valor (20%), bairro (15%), histórico de conversão do bairro (20%), urgência declarada (15%).
- Mostrar score no `LeadCard` (badge "🔥 87" para top 20%).
- Edge Function no Supabase para cálculo batch noturno.

**Critérios de aceite:**
- [ ] Score recalcula ao mudar status ou data de contato.
- [ ] Top leads destacados em nova aba "Quentes".
- [ ] Pode ser desativado por usuário.

---

### 24. [ ] Multi-usuário em tempo real (collaboração)
**Arquivo:** `src/app/crm/hooks/useLeads.ts`, subscriptions do Supabase.

Se dois vendedores abrem o mesmo lead, o último a salvar ganha silenciosamente.

**Implementação sugerida:**
- Realtime do Supabase: `supabase.channel('leads').on('postgres_changes', ...)`.
- Presence: avatar no card enquanto alguém edita.
- Lock otimista: ao entrar em `LeadFormModal`, setar `editing_by: userId` com TTL de 5 min.
- Toast "X está editando este lead" para outros usuários.

**Critérios de aceite:**
- [ ] Edições simultâneas geram toast de aviso.
- [ ] Refresh da página reflete mudanças em < 3s.
- [ ] Não conflitar com edição offline.

---

### 25. [ ] SMS fallback para WhatsApp não respondido
**Arquivos:** `src/app/crm/components/LeadCard.tsx`, novo `src/lib/sms.ts`.

Muitos clientes ignoram WhatsApp. Sem segunda tentativa.

**Implementação sugerida:**
- Botão "Enviar SMS" em `LeadCard` (e em `LeadDetailModal`).
- Integração Twilio ou Vonage (escolher por custo Brasil).
- Templates pré-aprovados (compliance Anatel).
- Opt-out automático: cliente responde "SAIR" remove do CRM.

**Critérios de aceite:**
- [ ] SMS enviado aparece no histórico do lead.
- [ ] Opt-out funcional.
- [ ] Logs de entrega (entregue / falhou / opt-out).

---

### 26. [ ] Metas individuais por vendedor
**Arquivo:** `src/app/crm/hooks/useLeads.ts:154` (`targetGoal` global).

Em equipe, cada vendedor deveria ter sua meta.

**Implementação sugerida:**
- Campo `user_id` (UUID) em `leads` (atribuído na criação).
- Tabela `user_goals (user_id, period, target_value)`.
- `MetricsPanel` com seletor "Ver meta de: [Todos | Eu | Usuário X]".
- Indicador de performance individual.

**Critérios de aceite:**
- [ ] Cada vendedor vê só seus leads (se role = vendedor — issue #40).
- [ ] Admin vê métricas agregadas e individuais.
- [ ] Meta pode ser editada por admin.

---

### 27. [ ] Relatórios agendados por e-mail
**Arquivos:** `src/app/crm/ExtratosMensaisSupabase.tsx`, `supabase/functions/` (Edge Functions).

Sócios recebem relatórios só se lembrarem de abrir o CRM.

**Implementação sugerida:**
- Edge Function `weekly-report` com pg_cron (toda segunda 8h).
- Gera PDF (issue #22) ou HTML.
- Envia para lista de e-mails configurável.
- Link de unsubscribe.

**Critérios de aceite:**
- [ ] Relatório enviado em horário agendado.
- [ ] Configurável por tenant.
- [ ] Logs de envio.

---

### 28. [ ] Identidade visual do cliente (logo da empresa dele)
**Arquivo:** `src/app/crm/types.ts`, `src/app/crm/components/LeadCard.tsx`.

Vendedores de B2B querem ver a marca do cliente no card.

**Implementação sugerida:**
- Campos `company: string` e `companyLogoUrl: string` em `Lead`.
- Input no `LeadFormModal` (upload ou URL).
- `<img>` 24x24 no `LeadCard` (lazy load).
- Fallback para iniciais em SVG.

**Critérios de aceite:**
- [ ] Logo aparece quando cadastrado.
- [ ] Upload valida tipo (jpg, png, svg) e tamanho (max 500KB).
- [ ] Storage: Supabase Storage bucket `company-logos`.

---

## 🛠️ Técnicos / Arquitetura

### 29. [x] Tipos `Lead` misturam domínio e UI
**Arquivos modificados:**
- `src/app/crm/types.ts` — refatorado em 4 tipos:
  - `LeadCore` (imutável: id, name, phone, email, address, neighborhood, filmType, sqm, value, createdAt) — identidade comercial, definida na criação;
  - `LeadStatusInfo` (mutável: status, statusChangedAt, notes, dataServico, serviceStatus, proximoContato, dormant, pinned, updatedAt, deletedAt) — flags, datas e observações;
  - `LeadNote` (placeholder para issue #17 — quando virar relacional, `LeadStatusInfo.notes` deixa de existir);
  - `Lead = LeadCore & LeadStatusInfo` mantém 100% de retrocompatibilidade com os 926 usos existentes;
  - helpers `LeadCoreUpdate = Partial<LeadCore>`, `LeadStatusInfoUpdate = Partial<LeadStatusInfo>`, `LeadUpdate = LeadCoreUpdate & LeadStatusInfoUpdate`;
  - `LeadFormValues` agora também omite `updatedAt`/`deletedAt` (não fazem parte do input do usuário).
- `src/app/crm/hooks/useLeadSync.ts` — novo método `syncLeadStatusPatch(leadId, patch: LeadStatusInfoUpdate)`: faz PATCH em `/api/crm/leads` com **apenas os campos alterados** (não envia o lead inteiro), merge com resposta do servidor, atualiza estado local com rollback em falha via `leadSyncState`. Retry exponencial (mesmo padrão de `syncLeadToCloud`).
- `src/app/crm/hooks/useLeadMutations.ts`:
  - novo método `patchLeadStatusInfo(leadId, patch: LeadStatusInfoUpdate)` — faz optimistic update local + chama `syncLeadStatusPatch` + rollback se falhar;
  - **handlers migrados para partial update** (issue #29): `handleTogglePin` (envia só `pinned`), `handleAgendaSchedule` (envia só `proximoContato`+`dormant`), `handleAgendaMarkDone` (envia só `proximoContato: null`), `handleServiceStatusChange` (envia só `status`+`statusChangedAt`+`serviceStatus`+`dormant`);
  - `handleLeadSubmit`/`handleLeadSave` continuam usando PUT (envio completo — não são parciais).
- `src/app/crm/hooks/useLeads.ts` — facade expõe `patchLeadStatusInfo` e propaga `syncLeadStatusPatch` para `useLeadMutations`.
- `src/app/api/crm/leads/route.ts` — PATCH agora aceita dois modos (backward-compat):
  - `{ id, action: 'dormant' | 'activate' | 'restore' }` (legado, intacto);
  - `{ id, ...LeadStatusInfoUpdate }` (novo) — filtra apenas campos whitelisted em `LEAD_STATUS_INFO_PATCH_FIELDS` (`status`, `status_changed_at`, `notes`, `proximo_contato`, `data_servico`, `service_status`, `dormant`, `pinned`, `updated_at`) e monta UPDATE direto;
  - fallback: se Supabase reclamar de coluna `pinned` ausente, re-tenta sem o campo (mesma estratégia de `OPTIONAL_LEAD_COLUMNS`).

**Arquivos criados:**
- `supabase/leads_split_status_info.sql` — migration que cria a tabela `lead_status_info` (1:1 com `leads`, `ON DELETE CASCADE`), constraints de `status` e `service_status`, índices (`status`, `proximo_contato`, partial em `pinned WHERE pinned = true`), backfill de dados existentes, e view `leads_full` que faz JOIN entre `leads` (core) e `lead_status_info` (status). O cabeçalho do arquivo documenta o plano de migração em 4 fases (trigger bidirecional, migração de GET para `leads_full`, migração de PATCH para `lead_status_info`, eventual `DROP COLUMN` em `leads`).

**Critérios de aceite atendidos:**
- [x] Cada update parcial envia apenas o subset necessário (verificado nos testes: `handleTogglePin` envia `{ pinned }`, `handleAgendaSchedule` envia `{ proximoContato, dormant }`, etc — sem `name`/`phone`/`value`).
- [x] Migrations do Supabase refletem separação (`supabase/leads_split_status_info.sql` cria a tabela paralela + view de compatibilidade + plano documentado para as próximas fases).

**Arquivos de teste:**
- 3 testes reescritos em `useLeadMutations.test.tsx` (bloco `handleTogglePin (issue #10) — partial status info update (issue #29)`): toggle false→true verifica explicitamente que `syncLeadToCloud` **não é chamado** e que o PATCH recebe só `pinned`; toggle true→false; rollback em falha.
- 3 novos testes em `useLeadMutations.test.tsx` (bloco `partial status info updates (issue #29)`): `handleAgendaSchedule` envia só `proximoContato`+`dormant`; `handleAgendaMarkDone` envia só `proximoContato: null`; `handleServiceStatusChange` envia só `status`+`serviceStatus`+`dormant` — todos verificam que campos core (`name`/`phone`/`value`) **não** estão no payload.

---

### 30. [x] `constants.ts` é importado em todo lugar — vira "lixão"
**Arquivos criados:**
- `src/app/crm/constants/stages.ts` — `LEAD_STAGES`, `LEAD_STAGE_LABELS`, `LEAD_STAGE_DOT_COLORS`, `isLeadStatus`.
- `src/app/crm/constants/storageKeys.ts` — `CRM_COLLAPSED_CARDS_STORAGE_KEY`, `CRM_UI_PREFERENCES_STORAGE_KEY`, `CRM_ACTIVE_TAB_STORAGE_KEY`.
- `src/app/crm/constants/charts.ts` — `MONTHLY_EVOLUTION_SERIES`.
- `src/app/crm/constants/filmTypes.ts` — `CRM_FILM_TYPE_LABELS`, `DEFAULT_CRM_FILM_OPTIONS`.
- `src/app/crm/constants/neighborhoods.ts` — `RJ_NEIGHBORHOODS` (`as const`), `RjNeighborhood`.
- `src/app/crm/constants/index.ts` — barrel para re-exportar tudo (mantém compatibilidade com imports existentes).

**Arquivos removidos:**
- `src/app/crm/constants.ts` (substituído pelo diretório `constants/`).

**Arquivos modificados:**
- `src/app/crm/components/KanbanBoard.tsx` — `neighborhoods: readonly string[]`.
- `src/app/crm/components/LeadModal.tsx` — `neighborhoods: readonly string[]`.
- `src/app/crm/components/MetricsPanel.tsx` — funil agora itera sobre `LEAD_STAGES` (remove hardcode).

---

### 31. [x] `LEAD_STAGES` duplica `LeadStatus` em string
**Arquivos modificados:**
- `src/app/crm/constants/stages.ts` — `LEAD_STAGES` agora é a fonte da verdade (`as const`); `LeadStatus` derivado de `typeof LEAD_STAGES[number]`; helper `isLeadStatus(value): value is LeadStatus` adicionado.
- `src/app/crm/types.ts` — remove a duplicação do `LeadStatus`; importa e re-exporta de `constants/stages` (mantém compatibilidade com imports existentes).
- `src/app/crm/components/MetricsPanel.tsx` — funil agora itera sobre `LEAD_STAGES` (remove hardcode).

---

### 32. [ ] Sem testes
**Arquivos:** nenhum encontrado em `src/app/crm/**/*.test.ts`.

**Implementação sugerida:**
- Vitest + Testing Library (já deve ter no projeto, verificar `package.json`).
- Mínimo:
  - `useMetrics.test.ts` — cálculo de `stats`, `monthlyEvolution`.
  - `utils.test.ts` — `mapLeadRow`, `normalizeLeadAmounts`, `appendCommercialNote`.
  - `useLeadMutations.test.ts` — `handleLeadSubmit`, `handleStatusChange` (com Supabase mockado).
- Playwright para smoke test de `/crm`.

**Critérios de aceite:**
- [ ] Cobertura > 60% em `useMetrics` e `utils`.
- [ ] CI bloqueia PR com testes falhando.

---

### 33. [x] Sem Error Boundary
**Arquivos criados:**
- `src/app/crm/components/ErrorBoundary.tsx` — class `ErrorBoundary` (genérico, com `onError` callback) + `TabErrorBoundary` (wrapper que injeta `useToastApi` para reportar erros via toast) + componente `ErrorFallback` (UI do erro com botão "Tentar novamente" e "Recarregar CRM").

**Arquivos modificados:**
- `src/app/crm/page.tsx` — cada `activeTab` envolvido em `<TabErrorBoundary fallbackTitle="...">`. Crash em uma aba não derruba o app; toast de erro aparece automaticamente.

---

### 34. [ ] Fetch sem cache / dedup
**Arquivo:** `src/app/crm/hooks/useLeads.ts`.

`supabase.from('leads').select(...)` em cada `handleVerifyCloudLeads` e `loadTrashLeads`. Sem cache, sem dedup.

**Implementação sugerida:**
- Migrar para TanStack Query (recomendado) ou SWR.
- `useQuery(['leads'], () => supabase.from('leads').select(...))`.
- `useMutation` para create/update/delete com optimistic updates.
- Invalidação por `updatedAt` ou tag.

**Critérios de aceite:**
- [ ] Múltiplos componentes lendo `leads` fazem 1 fetch.
- [ ] Mutations otimistas refletem em < 100ms.
- [ ] Retry automático em falha de rede.

---

### 35. [ ] Sem analytics / eventos
**Arquivos:** nenhum hook de tracking encontrado.

Impossível saber qual filtro é mais usado, onde o usuário trava.

**Implementação sugerida:**
- Hook `useTrackEvent(name, props)` em `src/lib/analytics.ts`.
- Integração PostHog (open source) ou Plausible (privacy-first).
- Eventos: `crm_lead_created`, `crm_filter_changed`, `crm_status_changed`, `crm_modal_opened`.
- Heatmap de cliques (Hotjar ou PostHog).

**Critérios de aceite:**
- [ ] Eventos chegam no painel.
- [ ] Identificação por `user_id` (autenticado) e sessão anônima.

---

### 36. [ ] Validação de formulário inline
**Arquivo:** `src/app/crm/components/LeadModal.tsx`, `src/app/api/crm/leads/route.ts`.

Sem validação clara de `phone` (formato BR?), `email` (RFC), `value >= 0`, `sqm > 0`.

**Implementação sugerida:**
- Zod schema em `src/app/crm/schemas/leadSchema.ts`:
  ```ts
  export const leadSchema = z.object({
    name: z.string().min(2),
    phone: z.string().regex(/^\d{10,11}$/),
    email: z.string().email().optional().or(z.literal('')),
    sqm: z.number().positive(),
    value: z.number().nonnegative(),
    status: z.enum(LEAD_STATUSES),
    // ...
  });
  ```
- Usar tanto no client (Zod + react-hook-form) quanto na API route.
- Mensagens de erro em pt-BR.

**Critérios de aceite:**
- [ ] Submit bloqueado com erro inline.
- [ ] API route retorna 400 com detalhes.
- [ ] Schema único compartilhado.

---

### 37. [x] Console logs em produção
**Arquivos criados:**
- `src/lib/logger.ts` — `logger` (default, sem escopo) e `createScopedLogger(scope)` para escopos nomeados. Métodos `debug/info/warn/error`. Em produção, nível mínimo = `warn` (debug/info suprimidos). Suporta contexto estruturado (objeto como segundo parâmetro) e Error como terceiro parâmetro no `error()`. Saída para `window.console` (browser) ou `process.stdout/stderr` (Node).

**Arquivos modificados:**
- `eslint.config.js` — adicionada regra `'no-console': 'error'` no bloco padrão, com exceção para `src/lib/logger.ts` e `src/lib/logger/**/*.ts`.
- `src/app/crm/components/ErrorBoundary.tsx` — `console.error` substituído por `logger.error` (escopo `ErrorBoundary`).
- `src/lib/cloudSync.ts` — 4 chamadas `console.error/warn` substituídas por `logger.error/warn` (escopo `cloud-sync`).
- `src/views/AdminCalculator.tsx` — 3 chamadas `console.error` substituídas por `logger.error` (escopo `AdminCalculator`).

**Critérios de aceite atendidos:**
- [x] `npm run lint` falha se houver `console.log` (regra ativa).
- [x] Logger estruturado com níveis; pronto para integração futura com Sentry.

---

### 38. [ ] Acessibilidade — Kanban arrastável precisa de alternativa a teclado
**Arquivos:** `src/app/crm/components/KanbanBoard.tsx`, `src/app/crm/components/LeadCard.tsx`.

Se DnD for implementado (issue #5), usuários de teclado ficam presos.

**Implementação sugerida:**
- Mover card com `Space` (pegar) + setas (mover entre colunas) + `Space` (soltar).
- Anúncio aria-live: "Card João Silva movido de Em Contato para Agendado".
- Focus visível em todos os elementos interativos.
- Contraste mínimo AA em todos os textos.

**Critérios de aceite:**
- [ ] Tab navega entre cards e botões.
- [ ] DnD funciona só com teclado.
- [ ] Lighthouse a11y score > 95.

---

### 39. [ ] Internacionalização hardcoded
**Arquivos:** `src/app/crm/components/KanbanBoard.tsx:123-140`, `src/app/crm/page.tsx:398`, etc.

Textos em pt-BR direto no código.

**Implementação sugerida:**
- `next-intl` ou dicionário `src/messages/pt-BR.json`.
- Função `t(key)` em componentes.
- Hook `useTranslations()` em componentes client.
- Lazy load de mensagens por rota.

**Critérios de aceite:**
- [ ] Nenhum string visível hardcoded.
- [ ] Suporte a en-US adicionado (verificar se necessário).

---

### 40. [ ] Sem feature flag / kill switch
**Arquivos:** gerais.

Se um bug em produção sai, o único caminho é rollback.

**Implementação sugerida:**
- Tabela `feature_flags (key, enabled, rollout_percentage)`.
- Hook `useFeatureFlag(key): boolean`.
- Wrappar features novas em `if (useFeatureFlag('kanbanDnD'))`.
- Edge Function para atualizar flags sem deploy.

**Critérios de aceite:**
- [ ] Desabilitar feature reflete em < 1 min.
- [ ] Rollout gradual por percentual (10%, 50%, 100%).

---

## 📋 Resumo por prioridade

| # | Frente | Esforço | Impacto | Categoria |
|---|---|---|---|---|
| 1 | Sync real por lead | M | 🔴 | Crítico |
| 2 | Quebrar `useLeads.ts` | M | 🔴 | Crítico |
| 3 | Dirty state no form | S | 🔴 | Crítico |
| 4 | Meta inicial | S | 🔴 | Crítico |
| 5 | DnD no Kanban | M | 🟡 | UX |
| 6 | Filtros multi-select | S | 🟡 | UX |
| 7 | Orçamento no detalhe | S | 🟡 | UX |
| 8 | Validação de data | S | 🟡 | UX |
| 9 | Duplicar lead | S | 🟡 | UX |
| 10 | Pin/favoritar | M | 🟡 | UX |
| 11 | Período no dashboard | S | 🟡 | UX |
| 12 | Drag-to-reschedule | M | 🟡 | UX |
| 13 | Toast stack | S | 🟡 | UX |
| 14 | Logout refactor | S | 🟡 | UX |
| 15 | Doc atualizado | S | 🟢 | UX |
| 16 | PWA | M | 🟡 | Funcionalidade |
| 17 | Chat por lead | G | 🟡 | Funcionalidade |
| 18 | Automações | M | 🟡 | Funcionalidade |
| 19 | Calculadora embarcada | M | 🟡 | Funcionalidade |
| 20 | Google Calendar | S | 🟢 | Funcionalidade |
| 21 | Mapa | M | 🟢 | Funcionalidade |
| 22 | Recibos PDF | M | 🟢 | Funcionalidade |
| 23 | Score IA | M | 🟢 | Funcionalidade |
| 24 | Realtime | G | 🟡 | Funcionalidade |
| 25 | SMS | M | 🟢 | Funcionalidade |
| 26 | Metas individuais | M | 🟢 | Funcionalidade |
| 27 | Relatórios e-mail | M | 🟢 | Funcionalidade |
| 28 | Logo cliente | S | 🟢 | Funcionalidade |
| 29 | Tipos Lead | M | 🟢 | Técnico |
| 30 | Quebrar constants | S | 🟢 | Técnico |
| 31 | LEAD_STAGES derivado | S | 🟢 | Técnico |
| 32 | Testes | M | 🟢 | Técnico |
| 33 | Error boundary | S | 🟢 | Técnico |
| 34 | TanStack Query | M | 🟡 | Técnico |
| 35 | Analytics | S | 🟢 | Técnico |
| 36 | Zod schemas | S | 🟡 | Técnico |
| 37 | No console | S | 🟢 | Técnico |
| 38 | A11y Kanban | M | 🟢 | Técnico |
| 39 | i18n | M | 🟢 | Técnico |
| 40 | Feature flags | M | 🟢 | Técnico |

**Legenda:** S = < 1 dia • M = 1-3 dias • G = > 3 dias

---

## 🚦 Roadmap Sugerido

### Sprint 1 (1 semana) — Quick wins
- #4 Meta inicial
- #13 Toast stack
- #14 Logout refactor
- #20 Google Calendar
- #28 Logo cliente
- #30 Quebrar constants
- #31 LEAD_STAGES derivado
- #33 Error boundary
- #37 No console
- #9 Duplicar lead

### Sprint 2 (2 semanas) — Estabilidade
- #1 Sync real por lead
- #2 Quebrar useLeads.ts (parcial)
- #3 Dirty state no form
- #6 Filtros multi-select
- #7 Orçamento no detalhe
- #8 Validação de data
- #11 Período no dashboard
- #36 Zod schemas

### Sprint 3 (2 semanas) — Refatoração
- #2 Quebrar useLeads.ts (completo)
- #5 DnD no Kanban
- #12 Drag-to-reschedule
- #29 Tipos Lead
- #32 Testes (início)
- #34 TanStack Query

### Sprint 4+ — Produto
- #10 Pin/favoritar
- #15 PWA
- #16 PWA
- #18 Automações
- #19 Calculadora embarcada
- #21 Mapa
- #22 Recibos PDF
- #23 Score IA
- #24 Realtime
- #25 SMS
- #26 Metas individuais
- #27 Relatórios e-mail
- #35 Analytics
- #38 A11y
- #39 i18n
- #40 Feature flags

---

## 📝 Histórico de Mudanças

- **2026-06-30** — Regeneração completa. Adicionados itens 1-40 com base no estado atual do código (page.tsx:640 linhas, useLeads.ts:1.134 linhas). Itens da análise antiga (24 pontos) integrados ou descartados por já estarem implementados.
- **2026-06-30** — Sprint 1 (Quick Wins) concluída. Implementados #4 (targetGoal null + empty state), #13 (Toast stack com provider/context), #14 (useLogout hook com error handling). Typecheck e ESLint passando.
- **2026-06-30** — Refatoração técnica concluída. Implementados #30 (constants quebrado em diretório por domínio), #31 (LEAD_STAGES como fonte única, LeadStatus derivado + isLeadStatus helper), #33 (ErrorBoundary em cada activeTab com TabErrorBoundary e toast de erro). Funil do MetricsPanel agora itera sobre LEAD_STAGES (remove hardcode duplicado). Typecheck e ESLint passando.
- **2026-06-30** — Quick wins adicionais. Implementados #20 (Google Calendar export de serviços com buildGoogleCalendarUrl) e #37 (logger estruturado + ESLint no-console error + substituição de console.* em ErrorBoundary, cloudSync e AdminCalculator). Typecheck e ESLint passando no escopo do CRM e logger.
- **2026-06-30** — UX de detalhe. Implementados #7 (orçamento vinculado visível no LeadDetailModal com mini-card + fetch por useEffect) e #9 (botão Duplicar no LeadDetailModal com prefill via openCreateModal, reseta status/datas/dormant/notes). Typecheck e ESLint passando.
- **2026-07-01** — Implementados #1 e #2 (sync visual real por lead + quebra do monolito `useLeads.ts`). Criados hooks menores para lista, sync, preferências, mutações, modal, orçamento, histórico e ações comerciais; `LeadCard` mostra estado `ok/pending/error`; adicionados Vitest/jsdom e testes mínimos para `useLeadList` e `useLeadMutations`. PR: local. Typecheck, ESLint focado e `npm run test:crm` passando.
- **2026-07-01** — Implementados #3 (dirty state no `LeadForm`) e #6 (multi-select de bairros/status). Item #3: hook `useDirtyFormGuard` (beforeunload + Ctrl/Cmd+S/Esc), `DiscardChangesDialog` CRM-themed, `isLeadFormDirty` derivado em `useLeadModal`, `handleLeadSave` em `useLeadMutations` para save sem fechar, badge âmbar no header do modal e hints de atalho. Item #6: `MultiSelectDropdown` com checkboxes, `useLeadPreferences` agora usa arrays (`filterNeighborhood: string[]`, `filterStatus: LeadStatus[]`), URL em CSV (`?bairro=…&status=…`), localStorage com backward-compat, lógica AND entre campos/OR dentro, chips removíveis no `KanbanBoard` e botão "Limpar filtros". 17 novos testes (9 para `useLeadPreferences` cobrindo OR/AND/CSV/URL/localStorage/invalid status; 8 para `useDirtyFormGuard` cobrindo beforeunload/Ctrl+S/Cmd+S/Esc/inativo). Typecheck, ESLint e `npm run test:crm` (21/21) passando.
- **2026-07-01** — Implementados #8 (validação de `proximoContato`) e #10 (pin/favoritar leads). Item #8: `ConfirmDialog` reutilizável (substituirá `confirm()` nativo em issues futuras), `useLeadMutations.handleLeadSave` agora detecta `Agendado`/`Em Contato` sem data e emite warning toast dedicado (`"Lead salvo sem proxima acao. Nao aparecera na agenda (so na aba 'Sem Acao' apos 3 dias sem movimento)."`), `LeadFormModal` ganhou alert âmbar inline abaixo de `proximoContato` + intercept de submit via `handleSubmitAttempt` que abre o `ConfirmDialog` antes de salvar. Item #10: campo `pinned?: boolean` em `Lead`/`LeadFormValues`/utils (`mapLeadRow`, `normalizeLeadAmounts`, `getLeadComparisonSnapshot`), `handleTogglePin(leadId)` em `useLeadMutations` (optimistic + rollback + toast de erro), `LeadCard` com botão de estrela (dourada quando pinned, `aria-pressed`/`aria-label`), `sortedFilteredLeads` agora aplica `compareByPin` antes do `sortKey` (pins sempre no topo), borda dourada no card pinned. 11 novos testes (6 `useLeadMutations` para warning toast + 3 pin toggle + 2 `useLeadPreferences` para ordenação pinned). Migration Supabase necessária: `ALTER TABLE leads ADD COLUMN pinned BOOLEAN NOT NULL DEFAULT FALSE`. Typecheck, ESLint e `npm run test:crm` (32/32) passando.
- **2026-07-01** — Implementado #29 (split `Lead` em `LeadCore` + `LeadStatusInfo`). `types.ts` refatorado com 4 tipos (`LeadCore` imutável, `LeadStatusInfo` mutável, `LeadNote` placeholder para #17, `Lead = LeadCore & LeadStatusInfo` para retrocompat) + helpers `LeadCoreUpdate`/`LeadStatusInfoUpdate`/`LeadUpdate`. Novo `syncLeadStatusPatch(leadId, patch)` em `useLeadSync` envia **apenas** o subset via PATCH; novo `patchLeadStatusInfo` em `useLeadMutations` faz optimistic update + sync parcial + rollback. Handlers `handleTogglePin`/`handleAgendaSchedule`/`handleAgendaMarkDone`/`handleServiceStatusChange` migrados para partial update. API route PATCH aceita tanto o modo legado (`{id, action}`) quanto o novo (`{id, ...LeadStatusInfoUpdate}`), com whitelist de campos e fallback para coluna `pinned` ausente. Migration `supabase/leads_split_status_info.sql` cria a tabela `lead_status_info` (1:1 com `leads`, FK com CASCADE, constraints de status, índices incluindo partial em `pinned`), backfill dos dados existentes e view `leads_full` para fase de transição (plano de 4 fases documentado no SQL). 3 testes reescritos + 3 novos (verificam que campos core como `name`/`phone`/`value` **não** estão nos payloads parciais). Typecheck, ESLint focado e `npm run test:crm` (35/35) passando.
- **2026-07-01** — Implementado #5 (drag & drop no Kanban com @dnd-kit). Adicionados `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` (184 pacotes novos via npm install). Criados `SortableLeadCard.tsx` (wrapper de `LeadCard` com `useSortable`) e `utils/kanbanDnd.ts` (`resolveKanbanDrop` puro, testado). `LeadCard` agora aceita `sortableRef`/`sortableStyle`/`sortableAttributes`/`sortableListeners`/`isDragging`/`isDragOverlay` (refator mínima, visual idêntico). `KanbanBoard.tsx` ganhou o subcomponente `KanbanDnD` com `<DndContext>` (PointerSensor com `activationConstraint: { distance: 8 }` para evitar drag acidental em clique + KeyboardSensor com `sortableKeyboardCoordinates` para navegação por setas), `<SortableContext>` por coluna, `<DragOverlay>` com `dropAnimation: 180ms cubic-bezier`, `useDroppable` em cada `KanbanColumn` com feedback visual (`ring-2 ring-[#c9a227]/60` + "Solte aqui"), e `accessibility.announcements` em PT-BR que injeta `aria-live="polite"` automaticamente. A função pura `resolveKanbanDrop` valida drop em coluna (`{ type: 'column', stage }`) ou em outro card (`{ type: 'lead', stage }`) e ignora drops na mesma coluna. Otimização + rollback já existiam em `useLeads.handleStatusChange` → `useLeadMutations.updateSingleLead`. Botões `←`/`→` foram mantidos como fallback de teclado. 8 novos testes para `resolveKanbanDrop`. Typecheck, ESLint e `npm run test:crm` (43/43) passando.
- **2026-07-01** — Implementado #18 (playbooks de follow-up). Criados `utils/playbooks.ts` (regras D+2/D+7/D+15, saneamento e aplicação pura), `usePlaybooks.ts` (playbooks por vendedor em `localStorage`) e `PlaybookSettings.tsx` (aba Configuracoes para editar offsets/ativacao por status). `useLeadMutations.handleLeadSave` aplica playbook em leads novos e em mudancas futuras de status via edicao; `useLeads.handleStatusChange` aplica a regra em mudancas futuras pelo funil sem retroagir leads existentes. Testes adicionados para motor de playbook e criacao D+2.
- **2026-07-01** — Evolucao #18 para integracao celular/PC. Playbooks agora usam `/api/crm/playbooks` + tabela `public.crm_playbooks` (helper `supabase/crm_playbooks.sql` com RLS/grants explicitos e acesso direto apenas por `service_role`). `usePlaybooks` carrega/salva regras no Supabase e guarda localmente apenas o vendedor ativo; `PlaybookSettings` mostra estado `Carregando/Salvando/Sincronizado/Erro`. `/api/crm/leads` tambem aplica o playbook no servidor em `POST`, `PUT` e `PATCH` de status, sem cron/trigger: criacao e mudancas futuras ficam consistentes entre PC e celular quando ambos usam o mesmo Supabase. Mantido fallback para regras padrao se a tabela ainda nao existir.

---

## 🤖 Instruções para IAs

Se você é uma IA implementando um item desta lista:

1. **Leia o item inteiro** antes de começar — pode ter dependências (ex: #5 depende de #2).
2. **Verifique o status atual** (`[ ]`, `[x]`, `[~]`, `[!]`) para evitar retrabalho.
3. **Respeite a arquitetura proposta** — não pule etapas. Ex: #34 TanStack Query antes de #1 sync por lead torna #1 trivial.
4. **Mantenha backward compat** — tipos em `src/app/crm/types.ts` são exportados para outros lugares; checar antes de mudar.
5. **Atualize o status** ao terminar: `[ ]` → `[x]` ou `[~]` (com link do PR).
6. **Adicione entrada no Histórico de Mudanças** com data, item, PR, observações.
7. **Não remova itens** — marque como `[!]` com justificativa se cancelar.
8. **Documente trade-offs** no PR — escolha de biblioteca, complexidade, etc.
9. **Cubra com testes** — issues #32 é prioritária; toda feature nova deve vir com teste mínimo.
10. **Verifique acessibilidade** — issues #38 é contínua; não introduza regressões.

**Ordem recomendada para implementações isoladas (sem dependência):**
- Quick wins: #4, #13, #14, #20, #28, #30, #31, #33, #37
- Refatoração: #2 (preparar terreno), #29, #34
- Features: #6, #7, #8, #9, #11, #16, #18
- Avançado: #1, #5, #12, #17, #19, #21-27, #32, #35, #36, #38-40
