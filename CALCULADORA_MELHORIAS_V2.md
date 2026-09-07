# Calculadora Admin — Plano de Melhoria v2 (código leve + interface amigável)

> Mesmo espírito do `CRM_MELHORIAS_V2.md`: menos repetição, informação clara no lugar certo.
> O arquivo antigo (`CALCULADORA_MELHORIAS.md`) é técnico e focado em bugs — este é de
> **produto/UX + leveza de código**, partindo do estado real de hoje:
> `src/views/AdminCalculator.tsx` (~1670–1835 linhas, ~32 `useState`, 11 `useEffect`),
> `ConfigPanel.tsx` (339), `InputPanel.tsx` (233), `CutMap.tsx` (198), `ResumeList.tsx` (110),
> `ColarModal.tsx` (70), `CutModeToolbar.tsx` (57), `HistoryPanel.tsx` (86),
> `lib/calculatorScope.ts`, `lib/numberPrecision.ts`.

---

## 1. Diagnóstico — onde está a repetição/confusão hoje

| # | Sintoma visível | Onde no código |
|---|---|---|
| 1 | **Moeda em 4 formatos**: `{price}` cru, `formatBRL`, `toLocaleString pt-BR`, desconto com outro formato | `InputPanel.tsx:139`, `AdminCalculator.tsx:632-649,1687-1698`, `CutMap.tsx:179-181` |
| 2 | **Mesmo ajuste em 2 lugares**: Rolo/Margem/Filme, Cor+Tamanho do ambiente e Algoritmo existem no painel principal E no Config | `InputPanel.tsx:125-135,168-186`, `AdminCalculator.tsx:1774-1780`, `ConfigPanel.tsx:177-202,229-293` |
| 3 | **Dois "Limpar"**: `Limpar Tudo` no input e `Limpar` no header fazem a mesma coisa | `InputPanel.tsx:232-239`, `AdminCalculator.tsx:1566-1573` |
| 4 | **Status de nuvem duplicado**: header e Config mostram o mesmo estado | `AdminCalculator.tsx:1540-1549`, `ConfigPanel.tsx:114-132` |
| 5 | **`FILM_TYPE_LABELS` copiado** em 2 arquivos (divergem em silêncio) | `AdminCalculator.tsx:42-50`, `ConfigPanel.tsx:10-18` |
| 6 | **Agrupar por ambiente escrito 3x** (resumo, colar, cálculo) | `ResumeList.tsx:42-47`, `ColarModal.tsx:37-43`, `AdminCalculator.tsx:1408-1426` |
| 7 | **Tipos triplicados**: `AppConfig`/`FilmTypeKey`/`OptimizationMode` + 3 mapas de cor de ambiente | `AdminCalculator.tsx:32-103`, `ConfigPanel.tsx:4-37` |
| 8 | **`alert/prompt/confirm` bloqueantes** no meio do fluxo (travam a tela, feios no tablet) | `AdminCalculator.tsx:1057,1136,1169,1178,1211`, `CutModeToolbar.tsx:31` |
| 9 | **Bloco invisível com lógica ativa** (`class=hidden` na cor do ambiente) | `InputPanel.tsx:188-221` |
| 10 | **Régua confusa**: lateral em metros (`val/100`), superior em cm, pill rotacionada 90° ilegível | `CutMap.tsx:150,164,173-183` |
| 11 | **Renomear ambiente é enigma**: 1º clique seleciona, 2º renomeia, e o checkbox faz a mesma coisa | `ResumeList.tsx:66-77,92-101` |
| 12 | **Colar depende de outro painel**: "Novo: digite nome acima" sem o input por perto | `ColarModal.tsx:58-67` |

---

## 2. Princípios (para não reintroduzir repetição)

1. **Uma informação, um lugar.** Moeda, tipos de película, config e status de nuvem têm um componente dono. O resto consome.
2. **Resultado responde 3 perguntas e só 3:** "quanto custa?", "quanto comprar?", "está eficiente?". O resto vaza para painel próprio.
3. **Nenhum `alert/prompt/confirm` nativo.** Tudo vira modal/toast/inline do próprio design system.
4. **Nada escondido com `hidden` que tenha lógica ativa.** Ou mostra, ou deleta.
5. **Nenhum número sem verbo.** Todo valor tem ação ao lado (Salvar, PNG, PDF, Criar lead).

---

## 3. Lista de implementação sugerida (ordem de execução)

### FASE A — Limpeza rápida (1–2 dias, baixo risco)

> Status em 05/09/2026: Fase A completa — A1 ✅, A2 ✅, A3 ✅, A4 ✅ e A5 ✅ (ver detalhes em cada item).

**A1. Moeda única (`formatBRL` em todo lugar)** ✅ IMPLEMENTADO
- ✅ `lib/money.ts` criado com `formatBRL` + `formatNumber2` canônicos.
- ✅ `{price}` cru → `formatNumber2(price)` (`InputPanel.tsx:140`).
- ✅ `toLocaleString` da pill → `formatNumber2(maxY / 100)` (`CutMap.tsx:181`).
- ✅ Desconto local `toLocaleString` → `formatNumber2` + `formatBRL` local deletado (`AdminCalculator.tsx:432-451`).
- Arquivos: `InputPanel.tsx`, `CutMap.tsx`, `AdminCalculator.tsx:632-649,1687-1698`.

**A2. Tipos e películas em um dono (`lib/films.ts`)** ✅ IMPLEMENTADO
- ✅ `lib/films.ts` criado como dono único: `AppConfig`/`FilmTypeKey`/`OptimizationMode`/`LossMode`/`ColorMode`, `FILM_TYPE_LABELS`, `FILM_TYPE_KEYS`, `DEFAULT_CONFIG`, cores de ambiente, `GlassItem`/`Block`/`OrcamentoSalvo` + normalizers.
- ✅ `AdminCalculator.tsx` importa tudo de `lib/films` (bloco local ~150 linhas deletado); `ConfigPanel.tsx` idem (tipos + `FILM_TYPE_LABELS` locais deletados); `InputPanel`/`CutMap`/`ResumeList` importam tipos de `lib/films` em vez de `views/AdminCalculator`.
- Arquivos: `AdminCalculator.tsx:32-103`, `ConfigPanel.tsx:4-37`.

**A3. Um `groupByAmbiente(resumo)` compartilhado** ✅ IMPLEMENTADO
- ✅ `lib/grouping.ts` criado com `groupByAmbiente()` + `ResumoItem` canônico + `SEM_AMBIENTE_LABEL`.
- ✅ Migrados `ResumeList`, `ColarModal`, `AdminCalculator:groupedResumo` — e um 4º `reduce` igual achado no `InvoicePDF.tsx:172` (não listado no plano, migrado de brinde).
- ✅ `ColarModal` re-exporta o tipo (`export type { ResumoItem }`) para compatibilidade.
- Arquivos: `ResumeList.tsx:42-47`, `ColarModal.tsx:37-43`, `AdminCalculator.tsx:1408-1426`.

**A4. Deletar as duplicatas de UI (um dono por ajuste)** ✅ IMPLEMENTADO
- ✅ `Limpar` único: removido `Limpar Tudo` do `InputPanel` (botão + prop `limparTudo` + prop `vidros`, que só servia a ele); mantido o do header (com estado `disabled`).
- ✅ Nuvem única: removido `CloudIndicator` + prop `cloudStatus` do `ConfigPanel`; mantido o indicador do header.
- ✅ Algoritmo dono no painel principal (`#calc-algoritmo`); Config virou atalho (mostra valor atual + botão "Ajustar" que fecha o drawer e rola até o controle).
- ✅ Cor/Tamanho dono no `InputPanel` (`#calc-cor-esquema`); Config virou atalho no mesmo padrão.
- ✅ Bônus zero-risco no caminho: removidos imports/vars não usados (`AdminCalculator`, `InputPanel`, `CutMap`) — lint limpo nos arquivos tocados.
- ⚠️ Fora do escopo (mantido de propósito): Rolo/Margem/Filme e preços por película continuam nos dois painéis — o Config gerencia *padrões persistidos*, o principal ajusta a *sessão*; unificar isso muda semântica e não é "baixo risco".
- Arquivos: `AdminCalculator.tsx:1540-1549,1566-1573,1774-1780`, `InputPanel.tsx:168-186,232-239`, `ConfigPanel.tsx:114-293`.

**A5. Desenterrar ou deletar o bloco `hidden` da cor** ✅ IMPLEMENTADO (desenterrado)
- ✅ Decisão: **mostrar** em vez de deletar — o bloco é a única UI de override manual da cor por ambiente (`roomColors`, persistido no draft local e consumido por `getColorForItem`); deletar removeria feature.
- ✅ `className="hidden"` trocado por renderização condicional: o picker aparece só quando o esquema "Cor por Ambiente" está ON (quando está em "Cor por Tamanho" ele é irrelevante, pois a cor vem do tamanho da peça).
- ✅ Pequenos acabamentos: card com borda para separar do toggle + hint "Digite o ambiente acima para escolher a cor dele" quando o campo está vazio.
- Arquivo: `InputPanel.tsx:188-221`.

### FASE B — Clareza da tela (3–5 dias, muda a percepção)

**B1. Fim dos bloqueantes nativos (modal/toast/inline)** ✅ IMPLEMENTADO
- ✅ Novos componentes do DS em `components/calculator/`: `ConfirmDialog.tsx` (confirmação, variante `danger`), `Toast.tsx` (sucesso/erro, substitui o `showSaveToast` fixo) e `ImportModal.tsx` (input + erro inline, Ctrl+Enter importa).
- ✅ `adicionar` com validação inline (`addError` sob o botão, some ao corrigir os campos) em vez de retorno silencioso.
- ✅ `importarZap` via modal (erro inline "Código inválido…"); `abrirProjeto` com toast de erro — fim do `prompt` + 2 `alert`s.
- ✅ Confirmações destrutivas via diálogo: `limparTudo` (genérico via `confirmDialog`) e sair do modo de corte (`CutModeToolbar` com estado local).
- ✅ `criarLead` sem nome/telefone e erro de API via toast de erro; sucesso com toast ("Lead criado com sucesso!"); salvar segue com toast.
- ✅ Renomear ambiente duplicado com erro inline no `ResumeList` (some ao digitar/reabrir) — fim do `alert`.
- ✅ `parseFloat` com `|| 0` no Rolo/Margem (`InputPanel`), padronizado com o `ConfigPanel`.
- ✅ Zero `alert/prompt/confirm` restantes em `AdminCalculator`, `CutModeToolbar`, `InputPanel`, `ConfigPanel` (fora do escopo B1: `QuotePage`, `AdminDados`, CRM).
- Arquivos: `AdminCalculator.tsx:881,935,1057,1136,1169,1178,1211`, `CutModeToolbar.tsx:31`, `InputPanel.tsx`.

**B2. Resultado em um `ResultPanel.tsx` (as 3 perguntas)** ✅ IMPLEMENTADO
- ✅ `components/calculator/ResultPanel.tsx` criado: Total Cliente + m² / Valor Efetivo / Comprar (m) / Eficiência / Desconto + Perdas, com Salvar/PNG/PDF junto dos números (princípio 5).
- ✅ Corte puro (JSX verbatim, só valores + callbacks via props); `AdminCalculator.tsx` **1295 → 1236 linhas**.
- Arquivos: `AdminCalculator.tsx:1680-1796` → `components/calculator/ResultPanel.tsx`.

**B3. Régua legível no mapa de corte** ✅ PARCIAL (unidade + contraste; pílula mantida por decisão)
- ✅ Uma unidade só: régua lateral marcava metros (`val/100`) e a superior cm — agora as duas em **cm** (`CutMap.tsx:163-164`), com legenda `· réguas em cm` no header do mapa (`CutMap.tsx:137`).
- ✅ Contraste revisado: bordas `white/20 → white/40`, ticks `white/30 → white/50` (maiores: `h/w-2.5/1.5 → 3/2`), números `gray-400 → gray-200`, grid `opacity-5 → opacity-10`.
- ⚠️ Pílula rotacionada 90° mantida de propósito (pedido do usuário) — `CutMap.tsx:172-184` intocado.
- Arquivo: `CutMap.tsx:130-212`.

**B4. Renomear ambiente sem enigma + Colar autocontido** ✅ IMPLEMENTADO
- ✅ Renomear: botão/lápis explícito (`Pencil`) por linha — fim da "mágica do 2º clique"; clique no nome e checkbox agora só selecionam (`onToggleAmbienteSelection`); edição inline com Enter/Escape/blur + erro inline mantidos.
- ✅ Colar: input próprio "Nome do novo ambiente..." DENTRO do `ColarModal` (estado local, Enter cola, sincroniza com `labelIn` ao abrir) — fim da dependência do "digite o nome acima".
- ✅ De quebra: resto do C2 no `ResumeList` — 14 props → 3 grupos (`listaProps`/`renameProps`/`selectionProps`) + `onCancelarRenomeacao` (sem setter cru no filho).
- Arquivos: `ResumeList.tsx:66-101`, `ColarModal.tsx:24-72`.

**B5. Header enxuto (7 ações → 4)** ✅ IMPLEMENTADO (adaptado: 6 → 5 grupos)
- ✅ Undo/Redo juntos num grupo segmentado (uma borda, divisor interno, estados `disabled` mantidos).
- ✅ Status de nuvem virou ponto (`h-2 w-2 rounded-full`: âmbar pulsante = syncing, esmeralda = ok, vermelho = erro/pausado, cinza = idle), com o mesmo tooltip de antes.
- ✅ **Limpar ficou no header** (decisão explícita: não foi para o Config). A parte "confirmação" da proposta já estava coberta pelo diálogo do DS (B1).
- ⚠️ Desvio do plano: sem mover o Limpar, o enxugamento possível foi 6 botões → 5 grupos (Config, CRM, Limpar, Undo|Redo, Histórico) + ponto de status.
- Arquivo: `AdminCalculator.tsx:1531-1600`.

### FASE C — Código (sustenta A e B)

**C1. Quebrar o god component (meta: nenhum arquivo > 350 linhas)** ✅ PARCIAL (hooks extraídos; meta final depende do B2)
- ✅ `src/hooks/useCalculatorState.ts` — os ~32 `useState` + `historyReducer` + `currentConfig` (+ `undo`/`redo`).
- ✅ `src/hooks/usePackingWorker.ts` — ciclo de vida do worker + **timeout de 20s com recriação** e `onerror` (antes o `isCalculating` podia travar ligado para sempre).
- ✅ `src/hooks/useDraftSync.ts` — autosave local+nuvem com debounce + restore nuvem→local.
- ✅ `src/hooks/useCalculatorHistory.ts` — load/salvar/abrir/deletar **com schema zod** (`parseOrcamentoSalvo`; itens corrompidos são filtrados, abrir inválido mostra toast) + 5 testes novos.
- ✅ Suporte: `lib/calculatorConfig.ts` (`load/saveConfig` movidos); `AdminCalculator.tsx` **1702 → 1295 linhas**, cada hook < 200 linhas, call sites intactos (hooks retornam os mesmos nomes).
- ⚠️ Meta "nenhum arquivo > 350" ainda não atingida: o render + lógica de produto (~1300 linhas) ficam para o **B2 (`ResultPanel`)** e próximos cortes.
- Arquivos: `AdminCalculator.tsx:336-1000` → `hooks/useCalculator*.ts` + `ResultPanel.tsx` (B2).

**C2. Acabar com o prop-drilling (InputPanel recebe 34 props)** ✅ IMPLEMENTADO (opção 1: agrupar + intenção; sem contexto)
- ✅ `InputPanel`: 34 props soltas → 4 grupos (`clienteProps`/`roloProps`/`corProps`/`medidaProps`); setters crus (`setVidros`/`setRoomColors`/`setUsarCoresPorAmbiente`/`getColorForItem`) viraram `onToggleCorEsquema`/`onSelectRoomColor`/`onAplicarCorNoAmbiente` (lógica movida para o pai).
- ✅ `CutModeToolbar`: `vidros`/`vidrosBackup`/`setVidros`/`setIsCutMode`/`setVidrosBackup`/`criarLead` → `isCutMode` + `onEnterCutMode`/`onExitCutMode`/`onCriarLead`.
- ✅ `ResumeList`: 14 props → 3 grupos (`listaProps`/`renameProps`/`selectionProps`) + `onCancelarRenomeacao` (feito junto com o B4).
- ⚠️ Contexto global (`CalculatorContext`) adiado de propósito — agrupar resolveu a dor sem risco de re-render.
- Arquivos: `InputPanel.tsx`, `CutModeToolbar.tsx:7-15`, `ResumeList.tsx:8-22`.

**C3. Sanear `calculatorScope.ts` + autosave** ✅ IMPLEMENTADO
- ✅ Duplo `getSession`+`getUser` → `getUser` único (validado no servidor) + **cache em módulo** (`cachedScopeKey` com coalescência de promise; todos os callers — draft, config, histórico — aproveitam sem mudar).
- ✅ `reset... return undefined` noop → **implementado de verdade** (limpa cache + promise) e chamado no `handleLogout` antes do redirect, para a próxima conta resolver do zero.
- ✅ Debounce com escrita fantasma revisado: `useDraftSync` resolve o scope **1x no restore** e guarda em `ref` para os saves locais (sem ida à rede por tecla, sem risco de trocar de scope no meio do debounce de 5s/2s); fallback para chave legada se o scope falhar; guard `mounted` contra `setState` pós-unmount.
- Arquivos: `lib/calculatorScope.ts`, `hooks/useDraftSync.ts`, `AdminCalculator.tsx:handleLogout`.

**C4. Primeiros testes da calculadora** ✅ IMPLEMENTADO (puros; worker de fora)
- ✅ Extração antes de testar: resumo/eficiência/perdas/finalPrice eram useMemo inline — viraram lib/pricing.ts puro (calcTotalAreaM2/calcSubtotalBruto/calcEficiencia/calcCompensacaoPerda/calcFinalPrice/calcValorPraticoM2/calcMetrosComprar); AdminCalculator chama as mesmas funções nos mesmos memos (comportamento verbatim).
- ✅ 4 arquivos novos em lib/__tests__/, 27 testes verdes (vitest run src/lib/__tests__): numberPrecision (incl. 0.1+0.2, NaN/Infinity), grouping (protege a dedup do A3), money (congela o padrão do A1), pricing (fixo/dinâmico/extremos de eficiência).
- ⚠️ packer.worker ficou de fora de propósito: roda em worker e exige mock de ambiente ou extração do núcleo — próximo passo isolado.
- Arquivos: novo lib/__tests__/ + lib/pricing.ts.

**C5. Trocar `gsap` por CSS (1 animação)** ✅ IMPLEMENTADO (na calculadora; pacote mantido no app)
- ✅ `AdminCalculator.tsx`: removidos `import gsap` + `useEffect(gsap.fromTo('.admin-entrance', ...))`; entrada animada agora via CSS.
- ✅ `globals.css`: novo `@keyframes admin-entrance-in` (opacity 0/scale .95 → 1/1, 0.6s `cubic-bezier` ≈ `power3.out`) + `.admin-entrance { animation: ... both }`; `prefers-reduced-motion` global já zera de brinde; cards montados depois também animam (gsap só animava 1x no mount).
- ⚠️ Pacote `gsap` NÃO removido: ainda usado em ~15 lugares fora da calculadora (`Products`, `HeroEntrance`, `ScrollReveal`, etc.) — remover quebraria essas páginas.
- Arquivo: `AdminCalculator.tsx:9,545-548`.

---

## 4. O que NÃO fazer (para não voltar ao repetitivo)

- Não criar o mesmo ajuste em dois painéis — ajuste tem um dono; o outro linka ou some.
- Não formatar moeda inline — sempre pelo helper canônico.
- Não usar `alert/prompt/confirm` — modal/toast/inline do DS.
- Não esconder bloco com `hidden` mantendo lógica — mostra ou deleta.
- Não passar setter cru para componente filho — callback de intenção (`onX`).

## 5. Ordem de execução resumida

1. **A1 + A2 + A3** (1 dia): moeda única, tipos únicos, agrupamento único — remove divergência silenciosa.
2. **A4 + A5 + B5** (1 dia): tira duplicatas de UI e enxuga o header — primeira impressão.
3. **B1** (2 dias): fim dos bloqueantes — o ganho de "amigável" mais visível, incl. tablet.
4. **B2 + C1** (3 dias): `ResultPanel` + quebra do god component (fazer juntos — o B2 é o primeiro corte do C1).
5. **B3 + B4** (1–2 dias): régua legível, renomear e colar sem enigma.
6. **C2 + C3 + C4 + C5** (3 dias): contexto, scope, primeiros testes, adeus gsap.

> Estimativa total: ~2 semanas, entregável por fase sem quebrar a calculadora (cada item é isolado por componente, como foi no CRM).
