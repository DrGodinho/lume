# Sprint 4: Nichos de Alto Ticket & Aprimoramento do Algoritmo de Corte

> **Meta Central:** Capturar demandas de altíssimo valor agregado (Varandas Gourmet, Películas Antivandalismo e Tetos de Vidro) e elevar a eficiência e praticidade do algoritmo de corte da Calculadora Admin.
> **Status:** Planejamento / Validação de Edge Cases.

---

## 🎯 1. Escopo Estratégico

### Pilar A: Expansão de Nichos Específicos (Alto Ticket)
1. **Landing Page Varanda Gourmet & Sacadas Envidraçadas (`/insulfilm-para-varanda-gourmet/`):**
   - Foco em alívio térmico imediato (sol poente), conforto visual e preservação de cortinas/móveis.
   - Películas recomendadas: Nano Cerâmica (alta transmissão luminosa e rejeição UV/IR) e Fumê Antirreflexo.
2. **Landing Page Segurança Antivandalismo (`/insulfilm-antivandalismo/`):**
   - Foco em retenção de estilhaços, proteção contra arrombamentos, ventanias e impactos em apartamentos e lojas.
   - Películas recomendadas: Linhas PS4, PS8 e PS12 (micras de segurança).
3. **Landing Page Tetos de Vidro, Clarabóias & Coberturas (`/insulfilm-para-teto-de-vidro/`):**
   - Foco na área de maior incidência solar do imóvel, bloqueio de calor descendente e eficiência energética do ar-condicionado.
   - Películas recomendadas: Nano Cerâmica e Refletivas de alta performance.

### Pilar B: Aprimoramento do Algoritmo de Corte (`src/workers/packer.worker.ts`)
1. **Auditoria do Algoritmo Existente:**
   - Modos atuais: `densidade` (foco em m² mínimo) e `facilidade` / `facilidade_v2` (foco em cortes retos).
   - Gargalos: Peças complexas, cortes em "L", sobras fragmentadas e tempo de corte na bancada.
2. **Melhorias Propostas:**
   - Heurística refinada de corte guilhotina (cortes 100% contínuos de ponta a ponta sem retorno de lâmina).
   - Otimização do cálculo de perda real x metro linear cobrado.
   - Interface visual da bobina na Calculadora com marcação clara da sequência de corte (passo 1, passo 2...).

---

## 🗺️ 2. Sequenciamento de Fases

```mermaid
flowchart TD
    subgraph Fase 1: Validação & Assets dos Nichos
        A1[Definição das dores e argumentos comerciais de cada nicho]
        A2[Geração de WebP otimizados para Hero das 3 LPs]
    end

    subgraph Fase 2: Construção das 3 Landing Pages LUME Elite
        B1[Criar LP Varanda Gourmet com Schema Service e FAQ]
        B2[Criar LP Antivandalismo com Tabela de Resistência PS]
        B3[Criar LP Teto de Vidro com Métricas de Redução Térmica]
        B4[Atualizar Navbar, Footer, Sitemap e Rotas]
    end

    subgraph Fase 3: Aprimoramento do Algoritmo de Corte
        C1[Benchmarking de casos de teste no packer.worker.ts]
        C2[Implementação das melhorias de corte guilhotina / aproveitamento]
        C3[Testes unitários automatizados com diferentes dimensões de vidro]
        C4[Ajustes na visualização gráfica da bobina em AdminCalculator.tsx]
    end

    subgraph Fase 4: Auditoria Final & Checklist
        D1[Execução de scripts: lint_runner, seo_checker, ux_audit]
        D2[Validação de TypeScript e build limpo]
    end

    Fase 1: Validação & Assets dos Nichos --> Fase 2: Construção das 3 Landing Pages LUME Elite
    Fase 2: Construção das 3 Landing Pages LUME Elite --> Fase 3: Aprimoramento do Algoritmo de Corte
    Fase 3: Aprimoramento do Algoritmo de Corte --> Fase 4: Auditoria Final & Checklist
```

---

## 📋 3. Checklist de Tarefas Executáveis

### Fase 1: Assets & Estrutura de Conteúdo
- [x] **T1.1:** Gerar e salvar backgrounds WebP otimizados:
  - `public/varanda_gourmet_hero_bg.webp` (138 KB)
  - `public/antivandalismo_hero_bg.webp` (198 KB)
  - `public/teto_vidro_hero_bg.webp` (150 KB)
- [x] **T1.2:** Estruturar copies técnicas de conversão e dados de performance para cada nicho.

### Fase 2: Landing Pages de Alto Ticket
- [x] **T2.1:** Implementar rota e view de Varanda Gourmet (`src/app/insulfilm-para-varanda-gourmet/page.tsx` e `VarandaGourmetPage.tsx`).
- [x] **T2.2:** Implementar rota e view de Película Antivandalismo (`src/app/insulfilm-antivandalismo/page.tsx` e `AntivandalismoPage.tsx`).
- [x] **T2.3:** Implementar rota e view de Tetos de Vidro (`src/app/insulfilm-para-teto-de-vidro/page.tsx` e `TetoVidroPage.tsx`).
- [x] **T2.4:** Atualizar links de navegação cruzada (`Footer.tsx`, `sitemap.ts`, `llms-full.txt`).

### Fase 3: Algoritmo de Corte & Calculadora Admin
- [ ] **T3.1:** Criar conjunto de testes de regressão para o worker de corte (`vitest` para empacotamento).
- [ ] **T3.2:** Refinar heurística de corte para reduzir perdas e priorizar cortes de guilhotina sem entalhes complexos.
- [ ] **T3.3:** Atualizar `AdminCalculator.tsx` para exibir métricas aprimoradas de corte e sobras utilizáveis.

### Fase 4: Validação & Auditoria de Qualidade
- [ ] **T4.1:** Rodar `lint_runner.py` e garantir TypeScript 100% válido.
- [ ] **T4.2:** Rodar `seo_checker.py` e auditar Schemas JSON-LD e Meta Tags.
- [ ] **T4.3:** Rodar `ux_audit.py` para conformidade estrita com o LUME Design System (Dark & Gold, sem roxo, fontes Montserrat).

