# Plano: Catálogo de Películas & Lucratividade Discreta

## Objetivo
Implementar o gerenciamento dinâmico de catálogo de películas com preços de venda e custos de aquisição (metro linear vs bloco de 7,5m), modo discreto "pressione para ver" na calculadora (revelando custo mínimo, ajudante, lucro em R$ e margem %), e tela de administração dedicada dentro do CRM.

---

## Fases de Execução

### Fase 1: Domínio e Matemática de Custos (`src/lib/films.ts` e `src/lib/pricing.ts`)
- [x] Definir interface `FilmCatalogItem` com:
  - `id`: chave única (ex: `window_blue_75`, `carbono_g20`)
  - `name`: rótulo legível (ex: "Window Blue 75%")
  - `priceSale`: preço de venda por m² (R$)
  - `priceCost`: custo de aquisição da unidade (R$)
  - `purchaseType`: `'metro'` (compra fracionada ao metro) | `'bloco_7_5m'` (lotes de 7,5m)
  - `active`: boolean
- [x] Implementar função pura `calcLucroCalculadora`:
  - Se `usarSobra === true`: custo de película = 0.
  - Se `purchaseType === 'metro'`: `qtdComprada = Math.ceil(metrosComprar)` e `custo = qtdComprada * precoCusto`.
  - Se `purchaseType === 'bloco_7_5m'`: `lotes = Math.max(1, Math.ceil(metrosComprar / 7.5))` e `custo = lotes * precoCusto`.
  - Custo total = Custo Película + Custo Ajudante.
  - Lucro Líquido = `finalPrice - custoTotal`.
  - Margem % = `(lucroLiquido / finalPrice) * 100`.
- [x] Criar testes unitários em `src/lib/__tests__/profit.test.ts`.

### Fase 2: Persistência & Sincronização em Nuvem (`src/lib/cloudSync.ts` e API)
- [x] Suportar `film_catalog` no payload de sincronização de configurações sem quebrar retrocompatibilidade com `filmTypes`.
- [x] Preencher valores padrão de custo iniciais para as películas existentes.

### Fase 3: Modo Discreto na Calculadora (`src/views/AdminCalculator.tsx` e `ResultPanel.tsx`)
- [x] Adicionar estados: `custoAjudante` (padrão 0) e `usarSobra` (padrão false).
- [x] Implementar mecanismo de interação "Pressione para Ver" (Press & Hold / Long Press de 500ms):
  - Desktop e Mobile: toque ou clique sustentado sobre o card de valor total.
  - Discreto: sem rótulos suspeitos ao lado do cliente; ao clicar novamente fecha.
- [x] Desenvolver popover discreto e minimalista com:
  - Custo Mínimo do Material (mostrando metros a comprar)
  - Toggle rápido "Usar sobra (Custo R$ 0)"
  - Input discreto para "Ajudante (R$)"
  - Lucro Líquido em Verde (R$) e Margem em Destaque (%)

### Fase 4: Tela de Gestão de Películas no CRM (`src/app/crm/`)
- [x] Adicionar item de navegação no `CrmSidebar.tsx` em **Dados → "Tabela de Películas"**.
- [x] Criar componente `CatalogoPeliculas.tsx`:
  - Tabela com listagem de todas as películas e filtros.
  - Edição de Preço de Venda (R$/m²), Preço de Custo e Tipo de Compra (Metro livre vs Bloco 7,5m).
  - Adicionar nova película personalizada com nome, custo e venda.
  - Botão de salvar alterações na nuvem via Supabase.

### Fase 5: Validação e Testes
- [x] Executar suíte de testes Vitest (20 arquivos, 150 testes passando, incluindo `profit.test.ts`).
- [x] Validar tipagem com `npx tsc --noEmit` (0 erros).

---

## Próximos Passos Sugeridos:
1. **Testar visualmente no navegador:** Abrir a calculadora e testar o clique longo no "Total Cliente", e acessar o CRM na aba "Tabela de Películas".
2. **Git Commit & Push:** Enviar as alterações para o repositório remoto.
