# Sugestões de melhoria — Calculadora Admin (LUME Controle Solar)

Documento com propostas concretas para a `src/views/AdminCalculator.tsx` (componente
único de ~2122 linhas). O foco é: (1) correção de bugs/inconsistências; (2) UX/design;
(3) performance; (4) novas funcionalidades. Referências apontam para
`src/views/AdminCalculator.tsx` quando não houver outro indicado.

> Estado atual relevante: a calculadora é 100% client-side, com estado em dezenas de
> `useState`, undo/redo via `useReducer` (`historyReducer`), cálculo de corte delegado a um
> Web Worker (`workers/packer.worker.ts`), autosave local + nuvem (debounced), exportação
> PNG (`html-to-image`) e PDF (`@react-pdf/renderer`), e importação via "código Zap"
> (`atob`+`JSON`). Hooks de UI extraídos parcialmente (`ConfigPanel`, `HistoryPanel`).

---

## 1. Prioridade ALTA — Corretude / Bugs

### 1.1 `criarLead` fixa bairro e deixa campos vazios ✅ CONCLUÍDO
**Onde:** `AdminCalculator.tsx:1098-1150` (POST `/api/crm/leads`).
O `neighborhood` era hardcoded `'Barra da Tijuca'`, e `email`/`address` iam vazios.
**Ação implementada:** adicionado campo **Bairro** no formulário do cliente; o
`criarLead` agora envia o `neighborhood` real do formulário (`neighborhood || ''`) em vez
do valor fixo `'Barra da Tijuca'`. Os campos **E-mail** e **Endereço** foram removidos da
interface a pedido; `email`/`address` seguem sendo enviados vazios (comportamento válido do
backend). O `neighborhood` persiste no rascunho local (`localStorage`) e no arquivo de
projeto `.insul` (exportar/abrir). O vínculo lead↔orçamento (`leadId` no item de histórico)
permanece inalterado, então a leitura do orçamento na página de CRM (`useLeadOrcamento`)
não quebra. Observação: o campo **não** é salvo no rascunho em nuvem (`/api/calculator/draft`
faz upsert em colunas fixas do Supabase), evitando quebra do autosave; persiste apenas via
localStorage/arquivo.

### 1.2 Campo de desconto em "centavos" mas rotulado em R$
**Onde:** `AdminCalculator.tsx:716-720` (`handleDescontoChange`) e `:1859-1883`.
```ts
const valor = e.target.value.replace(/\D/g, '');
setDesconto(parseInt(valor, 10) / 100 || 0);
```
O usuário digita dígitos que são interpretados como centavos: digitar `10` resulta em
`R$ 0,10`. O input exibe o valor formatado em reais, mas a digitação é em centavos —
comportamento confuso e sujeito a erro de orçamento. **Ação:** usar um input de moeda
controlado (ex.: `react-currency-mask` / `Intl`) onde o valor digitado seja reais, ou
mudar o placeholder/label para deixar claro que é centavos.

### 1.3 Duas paletas de cor conflitantes para o mesmo ambiente ✅ CONCLUÍDO
**Onde:** `DEFAULT_ROOM_COLORS` e `ROOM_PALETTE`.
As duas definiam cores **diferentes** para os mesmos ambientes (ex.: cozinha =
`#facc15` vs `#eab308`). `getColorForItem` usava `roomColors` (de `DEFAULT_ROOM_COLORS`)
como prioridade e `stableRoomColor` → `ROOM_PALETTE` como fallback, gerando cores
inconsistentes e manutenção dupla. **Ação implementada:** `ROOM_PALETTE` foi removida;
`DEFAULT_ROOM_COLORS` virou a **única fonte canônica**, absorvendo as chaves extras que
só existiam em `ROOM_PALETTE` (`lavabo`, `sacada`, `homeoffice`, `sala_jantar`,
`sala_tv`, `area_gourmet`, `area_servico`). `stableRoomColor` agora faz fallback para
`DEFAULT_ROOM_COLORS[key]`. A cor de `cozinha` foi mantida como `#facc15` (consistente
com os swatches do seletor `ROOM_COLOR_SWATCHES`). `ROOM_SWATCHES` permanece apenas como
lista genérica de fallback por hash para ambientes desconhecidos. `next build` e 85
testes CRM continuam passando.

### 1.4 `loadConfig()` executado a cada render ✅ CONCLUÍDO
**Onde:** `AdminCalculator.tsx` — `const cfg = loadConfig();` no corpo do componente.
Lia `localStorage` em **toda** render (e devolvia um objeto novo a cada vez), alimentando
apenas os *initializers* dos `useState`. **Ação implementada:** `cfg` passou a ser
computado uma única vez via `useMemo(() => loadConfig(), [])`. O `localStorage` é lido
uma vez e o objeto não é recriado a cada interação. `next build` e 85 testes CRM
continuam passando.

### 1.5 ID de histórico colide em saves rápidos
**Onde:** `AdminCalculator.tsx:1076` — `id: Date.now().toString()`.
Dois cliques rápidos em "Salvar" no mesmo milissegundo geram o mesmo id → o segundo
sobrepõe o primeiro no `slice(0, 20)`. **Ação:** usar `crypto.randomUUID()` (já usado em
`createGlassId`) para o id do orçamento.

### 1.6 Validação de altura/largura silenciosa e sem teto
**Onde:** `AdminCalculator.tsx:901-905` (`adicionar`).
```ts
if (!h || !w || h <= 0 || w <= 0 || q <= 0) return;
```
Se inválido, retorna **sem mensagem nem feedback**. Também não há valor máximo — uma
medida absurda (ex.: 99999cm) quebra o layout do mapa de corte. **Ação:** dar feedback
(`toast`/alert discreto) e limitar valores plausíveis (ex.: 0 < x ≤ 999cm).

### 1.7 "Modo de Corte" é incompleto/ambíguo
**Onde:** `AdminCalculator.tsx:658-666` e o botão em `:1589-1593`.
O modo apenas **filtra os blocos deletados** (`setBlocosCalculados(prev => prev.filter(...))`)
e guarda `vidrosBackup` para restaurar ao sair. Não há nenhuma interação de "cortar" —
o nome sugere divisão de peça ao meio, o que não existe. **Ação:** ou remover/renomear
("Modo de Edição") ou implementar o corte real (arrastar divisória, gerar 2 peças,
preview de sobra).

### 1.8 Histórico limitado a 20 itens sem paginação ✅ CONCLUÍDO
**Onde:** `AdminCalculator.tsx` (`salvarNoHistorico`, `[novo, ...historico].slice(0, 20)`) e
`src/components/HistoryPanel.tsx`.
Orçamentos além de 20 eram descartados silenciosamente (no localStorage e no estado).
**Ação implementada:** o cap foi elevado para **100** (`slice(0, 100)`), eliminando a perda
silenciosa de orçamentos recentes. O `HistoryPanel` agora **pagina** a lista em blocos de
15 (`PAGE_SIZE`), com botão "Carregar mais (N)" que incrementa em 15; o contador de itens
volta ao zero ao abrir o painel ou ao mudar o total. Adicionado um badge com o total de
itens no cabeçalho. `npx tsc --noEmit` passa sem erros. Observação: validação de build
completo + `test:crm` reservada para checkpoint, conforme combinado.

---

## 2. Prioridade MÉDIA — UX / Design

### 2.1 Cápsulas de medida estouram peças pequenas ✅ CONCLUÍDO
**Onde:** `src/components/calculator/CutMap.tsx` (`MemoBlock`, movido de `AdminCalculator.tsx` na refatoração 3.1).
As cápsulas usavam fonte fixa `text-[30px] sm:text-[36px]` dentro de `min-w-[44px]`, fazendo
o número ser maior que peças pequenas (ex.: 20×30cm) e transbordar sobre vizinhas. **Ação
implementada:** a fonte agora é dinâmica, calculada em `MemoBlock` a partir de `b.rh*scale`
e `b.rw*scale` (`heightFont`/`widthFont`, limitadas a 9–34px via `Math.max/min`), aplicada
por `style={{ fontSize }}`. Além disso o número de altura (`left-1 top-1/2 -rotate-90`) e o
de largura (`bottom-1 right-1`) são **ocultados** quando a respectiva dimensão em px for
menor que 32, reaparecendo automaticamente quando a peça está selecionada (`isSelected`) —
evitando estouro em peças muito pequenas. Removido o `min-w-[44px]` fixo. `next build` e 85
testes CRM continuam passando.

### 2.2 Mapa de corte com `overflow-x-hidden` corta labels da esquerda
**Onde:** `AdminCalculator.tsx:1966` (container `overflow-x-hidden`).
Blocos na coluna mais à esquerda (x≈0) podem ter a cápsula de altura cortada pelo
container — já atenuado, mas vale revisar a régua lateral e o "Comprimento Total" à
direita (`right-[-45px]`, `:2000`) que também pode ser clipado.

### 2.3 Atalhos de teclado limitados
**Onde:** `AdminCalculator.tsx:627-642` (só `Ctrl+Z`/`Ctrl+Y`).
**Ação (espelhar o CRM 3.3):** `Esc` para fechar modais (`showColarModal`) e o
`ConfigPanel`; talvez `Ctrl+S` para salvar no histórico. A busca global (`/`) não se
aplica (não há busca na calculadora).

### 2.4 Acessibilidade do modal "Colar"
**Onde:** render de `showColarModal` (~`:2068+`).
Sem `focus trap` e sem fechar no `Esc`; contraste de `text-gray-400` sobre `#040811` está
no limite (igual ao apontado no CRM 3.2). **Ação:** adicionar `role="dialog"`,
`aria-modal`, fechar com `Esc` e `focus` no primeiro elemento.

### 2.5 Nome de arquivo de projeto sem sanitização ✅ CONCLUÍDO
**Onde:** `AdminCalculator.tsx` — exportação `.insul`: `` `${cliente || 'projeto'}.insul` ``.
Espaços/caracteres especiais no nome do cliente geravam nomes de arquivo quebrados.
**Ação implementada:** o nome agora é sanitizado com `cliente.replace(/\W+/g, '_')`
(fallback `'projeto'`), espelhando o padrão já usado nos exports PNG/PDF
(`Orcamento_${cliente.replace(/\W+/g, '_') || 'LUME'}`). `npx tsc --noEmit` passa sem erros.

### 2.6 Preço é global e atrelado ao filme selecionado
**Onde:** `AdminCalculator.tsx:491-493` (`price` é redefinido pelo `filmTypes[selectedFilm]`)
e `:1053-1055` (`subtotalBruto = totalAreaM2 * price`).
Um orçamento pode misturar Carbono e Nano Cerâmica, mas **todas as peças usam o mesmo
preço R$/m²**. Não há preço por peça/filme. **Ação:** permitir `filmType` + preço por
`GlassItem` e calcular o subtotal por faixas de filme (melhoria funcional grande).

### 2.7 Sem feedback visual durante o cálculo
**Onde:** `isCalculating` (`:548`, `:670`, `:1241`, `:1280`) existe, mas **não há overlay
nem spinner** no mapa de corte enquanto o worker processa. **Ação:** mostrar um skeleton
ou spinner discreto sobre o mapa.

### 2.8 Responsividade do mapa no toque
**Onde:** layout `grid-cols-1 xl:grid-cols-12` (`:1536`); cápsulas 30–36px.
Em telas pequenas o mapa e o painel de inputs empilham; as cápsulas grandes e o
`touchAction: 'pan-y'` nos blocos merecem teste de usabilidade no tablet (arrasto de
peça selecionada, zoom).

### 2.9 Autosave com dependências pesadas ✅ CONCLUÍDO
**Onde:** `AdminCalculator.tsx` — efeitos de draft local (antigas linhas ~632-669) e cloud
compartilhavam *dependency arrays* quase idênticas (~13 variáveis: `cliente`, `phone`,
`vidros`, `desconto`, `rollW`, `price`, etc.) e disparavam **juntos** a cada digitação,
reconstruindo o payload do rascunho duas vezes (local imediato + nuvem debounced 5s).
**Ação implementada:** os dois efeitos foram **consolidados num único** `useEffect` que,
numa só passada, grava o `localStorage` imediatamente e agenda o debounce de nuvem de 5s,
reaproveitando os mesmos valores e construindo o payload uma vez. O `neighborhood`, que
antes só entrava no salvage de nuvem, agora também persiste no local (corrigindo
inconsistência). Fim da reconstrução dupla e das duas comparações de dependências por
render. `npx tsc --noEmit` passa sem erros (build completo + `test:crm` reservados para
checkpoint, conforme combinado). Observação: o efeito de `currentConfig` (config) é
separado e não foi alterado, pois o gargalo real era o rascunho.

---

## 3. Prioridade MÉDIA — Performance

### 3.1 Componente único de 2122 linhas ✅ CONCLUÍDO
Toda a calculadora vivia em um só arquivo/componente. **Ação implementada:** extraídos
`InputPanel` (`src/components/calculator/InputPanel.tsx`), `CutMap` (com `MemoBlock`
embutido, `src/components/calculator/CutMap.tsx`), `ResumeList`
(`src/components/calculator/ResumeList.tsx`), `ColarModal`
(`src/components/calculator/ColarModal.tsx`) e `CutModeToolbar`
(`src/components/calculator/CutModeToolbar.tsx`), mantendo `ConfigPanel` e
`HistoryPanel` já isolados. O `AdminCalculator.tsx` reduziu de ~2130 para ~1780 linhas e
agora orquestra os subcomponentes via props (todas as ações/estado continuam no pai).
Para viabilizar os imports, foram exportados de `AdminCalculator.tsx`: `Block`,
`FilmTypeKey`, `ROOM_COLOR_SWATCHES`, `FILM_TYPE_LABELS`, `FILM_TYPE_KEYS`.
`next build` e os 85 testes de CRM continuam passando. Reduz acoplamento, facilita
code-splitting e testes unitários dos painéis.

### 3.2 Render de rolos muito longos
**Onde:** altura do container `maxY/rollW * containerWidth + 40` (`:2016`) com dezenas de
`MemoBlock` em `position: absolute`. Para `maxY` grande (muitas peças), o container vira
dezenas de milhares de px e o DOM fica pesado. **Ação:** paginar o rolo (segmentos de N
cm) ou virtualizar; ou limitar a altura com scroll interno por seção.

### 3.3 Duplicação de autosave local + cloud ✅ CONCLUÍDO
**Onde:** os dois `useEffect` (draft local + nuvem) com dep arrays praticamente idênticas
eram exatamente os mesmos do item 2.9. A consolidação feita em 2.9 (um único efeito
`AUTO-SAVE` em `AdminCalculator.tsx:632` que escreve o `localStorage` imediatamente e
agenda o debounce de nuvem de 5s) **já satisfaz este item**. Não há mais duplicação de
autosave de rascunho. (O efeito de config em nuvem, debounced 2s, é separado e permanece
isolado, pois trata de `currentConfig`, não do rascunho.)

---

## 4. Prioridade BAIXA / Nice-to-have — Novas funcionalidades

### 4.1 Preço por peça/filme
`GlassItem` ganha `filmType` e preço individual; resumo e PDF agrupam por filme. Resolve
a limitação do 2.6 de forma definitiva.

### 4.2 Persistir cores de ambiente customizadas ✅ CONCLUÍDO
`roomColors` (`:405`) é inicializado de `DEFAULT_ROOM_COLORS` mas **nunca era salvo** —
cores manuais eram perdidas ao recarregar. **Ação implementada:** `roomColors` agora entra
no objeto do rascunho do `localStorage` (`lume_calculator_draft`) no auto-save, e foi
adicionado às dependências do efeito para disparar o save ao mudar uma cor. No restore
(efeito de mount), a cor é reaplicada a partir do rascunho local tanto no branch da nuvem
quanto no fallback do `localStorage` via `applyLocalRoomColors`. (As cores são preferência
estética local; a nuvem não tem coluna `room_colors`, então persistem só no localStorage —
suficiente para não perdê-las no reload, que é o problema do item.) `npx tsc --noEmit` passa
sem erros.

### 4.3 Import/export de planilha
Hoje só há "código Zap" (`prompt`+`atob`, `:1179-1191`) e `.insul` JSON (`:1193-1225`).
**Ação:** importar/exportar CSV de peças (útil para replanilhar no Excel) e tornar o
modal de importação amigável (textarea + validação de erro com mensagem).

### 4.4 Templates de ambiente ✅ CONCLUÍDO (via clipboard persistente)
A necessidade de reaproveitar conjuntos recorrentes ("Sala 2,00×1,20 ×3") foi atendida
**persistindo o copiar/colar existente** (escolha feita em vez de criar templates nomeados
separados). O `handleCopiarSelecionados` já copia **só peças selecionadas** e o clipboard
(`itensCopiados`) carrega **só peças** (`GlassItem[]`). O que faltava — o "quebrado" — era a
persistência: agora o clipboard é gravado em `localStorage` (`lume_calculator_clipboard`,
**global**, sem `scopeKey`, sobrevive a reload e fica disponível entre sessões) ao copiar e
restaurado no mount; é consumido (removido) ao colar, e também limpo em `limparTudo`. Assim dá
para copiar um conjunto, recarregar/navegar e colar de novo, cobrindo a lacuna de conjuntos
recorrentes sem a complexidade de templates nomeados. `npx tsc --noEmit` passa sem erros.

### 4.5 "Modo de Corte" real com snap
Implementar divisão de peça ao meio com arraste de divisória e sobra evidenciada (resolve
o 1.7), útil para aproveitar retalhos no rolo.

### 4.6 Vincular lead ↔ orçamento de forma estável ✅ CONCLUÍDO
Hoje `criarLead` criava um lead **e** salvava um orçamento na nuvem (com `leadId`), enquanto
`salvarNoHistorico` criava **outro** registro (local + nuvem) **sem** `leadId` → duplicata
e desvínculo. **Ação implementada:** adicionado `leadId?: string | null` ao `OrcamentoSalvo`
(local) e um estado `currentLeadId`. O `criarLead` agora: (1) obtém o `leadId` e o guarda em
`currentLeadId`; (2) se já existe um orçamento local deste cliente **sem** `leadId`, apenas
**vincula** aquele registro existente (atualiza local + `upsert` na nuvem pelo mesmo `id`,
aproveitando o `upsert` por `id` do `/api/calculator/history`); (3) senão, cria **um único**
orçamento já vinculado (`leadId`), com `id` estável via `crypto.randomUUID()`. O
`salvarNoHistorico` agora carrega `leadId: currentLeadId`, então saves manuais após criar o
lead permanecem vinculados (sem órfão). Ao carregar um orçamento salvo (`carregarDoHistorico`),
o `currentLeadId` é restaurado do `orc.leadId`, mantendo o vínculo estável. Resultado: um só
orçamento por lead, sempre vinculado, sem duplo registro. `npx tsc --noEmit` passa sem erros.

### 4.7 Relatório por vendedor / empresa
`userName` já existe; aproveitar para agrupar orçamentos por vendedor (espelar CRM 4.7).

### 4.8 Testes automatizados
A calculadora **não tem testes** (o CRM tem 85). **Ação:** cobrir `packer.worker`,
`eficiencia`, `compensacaoPerda`, `getColorForItem`/`stableRoomColor` e o reducer de
undo/redo com `vitest` (padrão já usado no CRM).

### 4.9 Melhorias de mobile
Gestos de toque no mapa (pinçar/zoom), e talvez "pull-to-refresh" do histórico (como no
CRM 3.4) — aplicável se o histórico crescer.

---

## Ordem de implementação sugerida

1. **1.1** (bairro no lead) e **1.2** (desconto em centavos) — corrigem dados de orçamento
   enviados ao CRM e evitam erro de valor.
2. **1.4** (`loadConfig` no initializer) e **1.5** (id uuid) — baratas de correção rápida.
3. **2.1 / 2.2** (cápsulas e overflow) — consertam o "número cortado" que já foi tema.
4. **1.3** (paleta única) e **4.2** (persistir cores) — saneiam o esquema de cor.
5. **3.1 / 3.2** (divisão do componente + rolo longo) — estabilidade/performance no tablet.
6. **4.6 / 4.1** (vínculo lead↔orçamento, preço por filme) — funcionalidades de maior valor.
7. Restante conforme prioridade.

> Observação: as seções 1.6, 1.7 e 2.7 são as que mais impactam o uso diário no tablet
> (feedback de erro e carregamento). Recomendo validá-las cedo.
