# Plano: Alternância de Modo de Desconto (Real R$ vs Porcentagem %)

## Contexto & Objetivos
Permitir que o usuário defina nas Configurações Padrão se o desconto na calculadora admin é digitado em valor real (R$) ou porcentagem (%). Além da configuração padrão no painel lateral (`ConfigPanel`), adicionar um botão de alternância rápida na tela principal ao lado do campo de desconto, exibindo a conversão em R$ quando em porcentagem e aplicando o percentual sobre o valor total com perdas.

## Tarefas de Implementação

- [x] **Fase 1: Tipos & Configurações de Domínio**
  - Atualizado `src/lib/films.ts` adicionando `DiscountMode = 'real' | 'porcentagem'`, integrando `modoDesconto` a `AppConfig`, `DEFAULT_CONFIG` e `OrcamentoSalvo`.
  - Atualizado `src/lib/calculatorConfig.ts` para persistir e carregar `modoDesconto` no `localStorage`.
  - Atualizado `src/lib/cloudSync.ts` (`ConfigData`, `saveConfigToCloud`, `loadConfigFromCloud`) e `src/app/api/calculator/config/route.ts` (`CONFIG_OPTIONAL_COLUMNS`).

- [x] **Fase 2: Lógica de Cálculo & Helpers de Desconto**
  - Adicionado em `src/lib/pricing.ts` os helpers:
    - `calcDescontoEmReais(modoDesconto: DiscountMode, valorInput: number, baseCalculo: number): number`
    - `converterDescontoEntreModos(novoModo: DiscountMode, valorAtual: number, baseCalculo: number): number`
  - Adicionados testes unitários em `src/lib/__tests__/pricing.test.ts` cobrindo cálculo e conversão entre modos (100% dos testes aprovados).

- [x] **Fase 3: Painel de Configurações (`ConfigPanel`)**
  - Em `src/components/ConfigPanel.tsx`, adicionado o seletor `Modo Padrão do Desconto` com `SegmentGroup` (`Valor em Reais (R$)` e `Porcentagem (%)`).

- [x] **Fase 4: Estado da Calculadora & Sincronização de Rascunho**
  - Em `src/hooks/useCalculatorState.ts`, adicionado estado `modoDesconto`, inicializado com `cfg.modoDesconto || 'real'` e integrado a `currentConfig`.
  - Atualizado `useDraftSync.ts` para persistir e restaurar `modoDesconto` em rascunhos locais e nuvem.
  - Atualizado schema de validação em `src/hooks/useCalculatorHistory.ts`.

- [x] **Fase 5: Componente de Interface (`ResultPanel`) & `AdminCalculator`**
  - Em `src/components/calculator/ResultPanel.tsx`:
    - Adicionado seletor de alternância rápida `[ R$ | % ]` ao lado do campo de desconto.
    - Input adaptado com prefixo `R$` ou sufixo `%` e validação numérica adequada.
    - Exibição de badge com valor convertido em R$ ao lado (ex: `10% → -R$ 150,00`).
  - Em `src/views/AdminCalculator.tsx`:
    - Conectado `handleDescontoChange`, `displayDesconto` e `handleToggleModoDesconto`.
    - Conectado `descontoEmReais` a `calcFinalPrice`, `InvoicePNG`, `InvoicePDF`, `salvarNoHistorico` e notas do CRM.

- [x] **Fase 6: Verificação & Testes**
  - Executados testes de precificação (`npx vitest run src/lib/__tests__/pricing.test.ts`): 24/24 aprovados.
  - Executados testes de histórico (`npx vitest run src/hooks/__tests__/parseOrcamentoSalvo.test.ts`): 6/6 aprovados.
  - Verificação de tipos TypeScript (`npx tsc --noEmit`): 0 erros.
