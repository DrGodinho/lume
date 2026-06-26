# Análise Crítica — Página `/crm` (LUME CRM)

> Baseada na leitura completa de [page.tsx](file:///c:\Users\ThinkPad\Downloads\app\src\app\crm\page.tsx) (4.222 linhas), [AdminCrm.tsx](file:///c:\Users\ThinkPad\Downloads\app\src\views\AdminCrm.tsx), e [crm_leads_agendado_data_servico.sql](file:///c:\Users\ThinkPad\Downloads\app\supabase\crm_leads_agendado_data_servico.sql).

---

## 🔴 Problemas Críticos (quebram ou degradam severamente o uso)

### 1. Dois CRMs paralelos sem integração real

Existe um **CRM de Leads** em `/crm/page.tsx` (com funil, agenda, calendário, gráficos) e um **CRM de Orçamentos** em `AdminCrm.tsx` (com Kanban de `calculator_history`). São sistemas completamente separados que operam sobre dados distintos (`leads` vs `calculator_history`) e não conversam entre si.

**Problema:** Um lead que veio do formulário do site entra no CRM de leads. Um orçamento gerado pela calculadora entra no CRM de orçamentos. Nunca são linkados. O vendedor não sabe se aquele lead já tem um orçamento calculado.

**Sugestão:** Criar um `lead_id` em `calculator_history` para linkagem. Ou unificar numa única view com abas (Lead → Orçamento → Serviço).

---

### 2. Dados em localStorage — arquitetura frágil

O `/crm/page.tsx` usa `localStorage` como fonte primária:

```ts
const getStoredLeads = () => {
  const saved = localStorage.getItem('lume_crm_leads');
  ...
};
```

O Supabase é **secundário** — os dados da nuvem são _mergeados_ sobre o que está salvo localmente (`mergeCloudLeadsWithLocal`). Isso cria riscos sérios:

- Limpar o cache do navegador **apaga todos os leads locais** que não foram sincronizados
- Dois navegadores/dispositivos verão dados diferentes
- Leads criados offline nunca chegam ao servidor

**Sugestão:** Supabase como **fonte única de verdade**. localStorage apenas para cache de leitura rápida, nunca como write-first.

---

### 3. Nenhuma paginação — busca hardcoded em 100 registros

Em `AdminCrm.tsx`:
```ts
.limit(100)
```

Com crescimento do negócio, leads e orçamentos acima de 100 ficam invisíveis no Kanban sem aviso algum.

**Sugestão:** Paginação infinita com scroll ou por página. Mínimo: remover o limite e adicionar um aviso visual quando há mais de X registros.

---

### 4. O campo `status` dos leads não tem histórico de transições

Quando um lead muda de `Novo` → `Agendado` → `Fechado`, nenhum timestamp parcial é guardado além de `statusChangedAt` (que é sobrescrito). Não é possível saber quanto tempo o lead ficou em cada estágio.

**Sugestão:** Tabela `lead_status_history (lead_id, from_status, to_status, changed_at, changed_by)` para análise de funil real.

---

### 5. Deleção de leads é permanente e sem soft-delete

```ts
await supabase.from('calculator_history').delete().eq('id', id);
```

Não existe `deleted_at` nem lixeira. Um clique errado apaga o dado para sempre, sem opção de recuperar.

**Sugestão:** Adicionar `deleted_at timestamptz` e fazer `soft delete`. Exibir uma "Lixeira" com recover por 30 dias.

---

## 🟡 Problemas de UX / Produto (afetam a produtividade diária)

### 6. Nenhum campo de telefone clicável para ligação direta

Os cartões de lead mostram o telefone como texto. Há um botão de WhatsApp, mas **não há `tel:` link** para ligar diretamente do celular — crítico para uso mobile.

**Sugestão:**
```tsx
<a href={`tel:+55${lead.phone.replace(/\D/g, '')}`}>{lead.phone}</a>
```

---

### 7. Busca/filtro não persiste entre sessões

Toda vez que o usuário recarrega a página, filtros e ordenação voltam ao padrão. Em uso intenso, o vendedor precisa reaplicar os mesmos filtros continuamente.

**Sugestão:** Persistir filtros ativos em `sessionStorage` ou na URL como query params (`?status=Agendado&bairro=Bangu`).

---

### 8. Criação de lead manual não existe (ou está escondida)

O CRM recebe leads via formulário do site. Mas para leads vindos de indicação, ligação, ou qualquer canal offline, **não há botão "Novo Lead"** visível na interface principal.

**Sugestão:** Botão fixo "+ Novo Lead" que abre um modal de criação rápida com os campos essenciais (nome, telefone, bairro, tipo de película, valor estimado).

---

### 9. Agenda não tem view de calendário mensal

A `AgendaFollowUpSection` oferece views `hoje`, `semana`, `serviços` e `sem_ação`, mas não há um **calendário mensal visual** para enxergar a distribuição de serviços e follow-ups no mês inteiro.

**Sugestão:** Adicionar view `mês` com mini-calendário onde cada dia mostra bolhas coloridas (azul = follow-up, verde = serviço). Clicar no dia filtra os cards.

---

### 10. Não há indicação de bairro ou região nos cards do Kanban (`AdminCrm`)

O Kanban de orçamentos mostra cliente, película, valor e desconto — mas **não mostra o bairro/região**. O técnico não sabe se pode agrupar visitas próximas.

**Sugestão:** Adicionar campo `neighborhood` em `calculator_history` e exibi-lo no card. Ou linkar com o lead que originou o orçamento.

---

### 11. Modal de edição de lead não mostra histórico de anotações

O campo `anotacoes` é um textarea simples. Cada save **sobrescreve** a anotação anterior. Não dá para ver o que foi dito em cada contato.

**Sugestão:** Estrutura de `notes[]` — array de objetos `{ text, author, timestamp }` com input para nova nota no topo e histórico em scroll abaixo (similar ao Notion/Linear).

---

### 12. Sem atalho de teclado e sem navegação entre leads

Ao abrir um lead, não há navegação para o próximo/anterior. O usuário precisa fechar o modal e clicar no próximo — especialmente lento no Kanban com muitos cards.

**Sugestão:** Setas `←` `→` no modal para navegar entre leads. `Esc` para fechar (já funciona parcialmente via backdrop click).

---

## 🟢 Funcionalidades Novas (melhorias de produto)

### 13. 🔔 Sistema de notificações / alertas internos

Não há nenhum sistema que **avisa proativamente** o vendedor sobre:
- Follow-ups vencidos (já existe no card, mas sem alerta no topo)
- Serviços agendados para amanhã
- Leads parados há mais de 7 dias

**Sugestão:** Banner/toast no topo do CRM ao entrar: _"Você tem 3 follow-ups atrasados e 2 serviços amanhã."_ Com link direto para cada grupo.

---

### 14. 📊 Análise de motivo de perda (Churn Reason Analysis)

O campo `motivo_declinio` existe no Kanban de orçamentos, mas **não há nenhuma agregação visual** mostrando os motivos mais comuns de perda.

**Sugestão:** Seção "Análise de Perdas" no painel de relatórios com gráfico de pizza/barras: _"Preço alto (40%), Achou outro (25%), Sem resposta (20%)..."_. Isso permite ajustar a estratégia comercial com dados reais.

---

### 15. 🏷️ Tags e labels personalizados nos leads

Atualmente a categorização é apenas por `status` e `filmType`. Não é possível marcar um lead como `VIP`, `Urgente`, `Retrofit`, `Condomínio`, etc.

**Sugestão:** Campo `tags text[]` no Supabase + UI de multi-seleção no modal do lead. Filtro por tag no painel.

---

### 16. 📍 Agrupamento de serviços por rota geográfica

O CRM tem os bairros dos clientes mas **não sugere roteiro** para o técnico no dia do serviço. Um dia com 3 serviços em bairros próximos pode ser otimizado — mas hoje o vendedor precisa fazer isso manualmente.

**Sugestão:** Na view "Serviços", ordenar os cards por bairro e mostrar um mini-mapa ou agrupamento visual por região (Zona Oeste, Barra, Zona Sul, etc.) para facilitar o planejamento de rota.

---

### 17. 💬 Envio de mensagem WhatsApp com template pré-definido

O botão WhatsApp abre o app com número preenchido, mas **sem mensagem**. O vendedor precisa escrever do zero toda vez.

**Sugestão:** Botão com dropdown de templates:
- _"Olá [Nome], tudo bem? Passando para confirmar o orçamento de insulfilm para [bairro]..."_
- _"[Nome], seu serviço está agendado para amanhã às [hora]..."_
- Texto pré-preenchido com dados do lead via `wa.me/...?text=...`

---

### 18. 📈 Métricas de desempenho por período comparável

O painel de métricas do `AdminCrm` mostra faturamento confirmado, potencial e taxa de conversão do mês atual. Mas **não há comparação com o mês anterior** na mesma tela.

**Sugestão:** Adicionar delta percentual em cada card de métrica:
```
Faturamento Confirmado
R$ 8.400
▲ +23% vs. mai/26
```

---

### 19. 🔒 Controle de acesso por papel (Role-Based Access)

Atualmente qualquer usuário autenticado pode ver e editar tudo. Se houver mais de uma pessoa usando o CRM (vendedor + instalador + gestor), cada um deveria ver apenas o que é relevante para seu papel.

**Sugestão:** Tabela `user_roles (user_id, role)` com roles: `admin`, `vendedor`, `tecnico`. Técnico vê apenas a agenda de serviços. Vendedor vê apenas os leads e orçamentos. Admin vê tudo.

---

### 20. 📤 Exportação de leads (além do CSV de orçamentos)

O `AdminDados` exporta orçamentos em CSV. Mas o CRM de leads **não tem exportação**. Isso impede:
- Backup manual dos dados
- Importar para Google Sheets para análise
- Enviar relatório para o cliente/sócio

**Sugestão:** Botão "Exportar CSV" no CRM de leads com campos: nome, telefone, email, bairro, película, m², valor, status, data criação, data último contato.

---

## 📐 Problemas Técnicos / Arquitetura

### 21. `page.tsx` com 4.222 linhas — monolito insustentável

O arquivo do CRM principal tem mais de 4 mil linhas em um único componente. Isso:
- Torna o desenvolvimento paralelo impossível
- Dificulta debugging e code review
- Aumenta o tempo de compilação e hot reload

**Sugestão:** Dividir em módulos:
```
/crm/
  components/
    LeadCard.tsx
    LeadModal.tsx
    AgendaSection.tsx
    KanbanBoard.tsx
    MetricsPanel.tsx
    MonthlyChart.tsx
  hooks/
    useLeads.ts
    useMetrics.ts
    useAgenda.ts
  page.tsx  ← apenas orquestração
```

---

### 22. Preços de película hardcoded no frontend

```ts
const FILM_PRICES: Record<string, number> = {
  'Nano Cerâmica': 150,
  'Refletiva': 90,
  'Carbono': 120,
  'Jateada': 100,
};
```

Se o preço mudar, é necessário um deploy. E já existe uma tabela `calculator_config` no Supabase com `film_types` (preços por película) — mas o CRM de leads não lê essa tabela.

**Sugestão:** Remover `FILM_PRICES` do código. Buscar via `calculator_config` no load da página.

---

### 23. Dados mock no código de produção

```ts
const INITIAL_LEADS: Lead[] = [
  { id: 'lead_1', name: 'Carlos Henrique Silva', ... },
  { id: 'lead_2', name: 'Mariana Costa Ferreira', ... },
  { id: 'lead_4', name: 'Doutor Godinho', ... },
```

Esses leads fictícios são o fallback quando `localStorage` está vazio. Em produção, se alguém acessa o CRM sem dados salvos, vê leads falsos.

**Sugestão:** Substituir por estado vazio + empty state UI claro com botão "Adicionar primeiro lead".

---

### 24. Merge local/cloud pode gerar conflitos silenciosos

A função `mergeCloudLeadsWithLocal` prioriza dados locais em caso de conflito:
```ts
return { ...lead, ...cloud, ... }
```
Cloud sobrescreve local nos campos listados, mas **se o local tem uma versão mais nova do que a cloud** (ex: edição offline), pode haver perda de dados silenciosa.

**Sugestão:** Comparar `updatedAt` antes de mergear. Se local é mais novo, fazer upsert para a nuvem antes de aceitar a versão cloud.

---

## 🎯 Prioridade de Implementação Sugerida

| # | Funcionalidade | Impacto | Esforço | Prioridade |
|---|---|---|---|---|
| 1 | Supabase como fonte única (remover localStorage write-first) | 🔴 Crítico | Médio | P0 |
| 2 | Botão "Novo Lead" manual | 🔴 Alto | Baixo | P0 |
| 3 | Soft delete + lixeira | 🔴 Alto | Baixo | P0 |
| 4 | Templates de WhatsApp | 🟡 Alto | Baixo | P1 |
| 5 | Link `tel:` para ligar | 🟡 Médio | Baixo | P1 |
| 6 | Análise de motivos de perda | 🟡 Alto | Médio | P1 |
| 7 | Filtros persistentes na URL | 🟡 Médio | Baixo | P1 |
| 8 | Notas com histórico (array) | 🟡 Alto | Médio | P1 |
| 9 | Dividir page.tsx em componentes | 🟡 Técnico | Alto | P1 |
| 10 | Alerta de follow-ups atrasados no topo | 🟢 Médio | Baixo | P2 |
| 11 | Calendário mensal na agenda | 🟢 Médio | Médio | P2 |
| 12 | Tags personalizados | 🟢 Médio | Médio | P2 |
| 13 | Agrupamento por rota geográfica | 🟢 Médio | Alto | P2 |
| 14 | Exportação CSV de leads | 🟢 Baixo | Baixo | P2 |
| 15 | Linkagem Lead ↔ Orçamento | 🔴 Alto | Alto | P3 |
| 16 | Histórico de transições de status | 🟡 Médio | Médio | P3 |
| 17 | RBAC (roles por usuário) | 🟢 Baixo | Alto | P3 |
| 18 | Paginação de registros | 🟡 Médio | Médio | P3 |
