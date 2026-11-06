# Tarefa: Expansão Ofensiva Zona Sul — Botafogo, Flamengo, Laranjeiras e Jardim Botânico

> **Objetivo:** Criar 4 landing pages cinematográficas e de altíssima conversão para a conclusão do circuito da Zona Sul (Botafogo, Flamengo, Laranjeiras e Jardim Botânico/Gávea), com foco absoluto em conforto térmico, tecnologia Nano Cerâmica e economia de climatização.

---

## 🎯 Escopo Alinhado (Decisões Socráticas)
1. **Bairros Selecionados (Opção 1-A):**
   - `Botafogo / Humaitá`: foco em lançamentos residenciais, varandas envidraçadas no sol da tarde e alívio térmico para livings e escritórios.
   - `Flamengo`: foco em apartamentos tradicionais voltados para o Aterro/Praia, sol nascente intenso, preservação de móveis e conforto visual.
   - `Laranjeiras`: foco em alívio do calor em vales urbanos, conforto para quartos e home office com excelente custo-benefício térmico.
   - `Jardim Botânico / Gávea`: foco em residências nobres cercadas de verde, insolação contínua e proteção máxima contra raios UV e calor sem alterar fachadas.
2. **Abordagem Comercial (Opção 2-B):** Foco 100% Térmico (Nano Cerâmica Térmica, alívio de ar-condicionado e proteção de pisos/móveis).
3. **Arquitetura Modular:** Reutilizar `PremiumNeighborhoodView.tsx` com `HeroEntrance`, `AnimatedCounter`, `LevelDots`, `GoogleReviews` e `ContactCTA`.
4. **SEO & Link Building:** Schemas completos, inclusão em `sitemap.ts`, `Coverage.tsx`, `Footer.tsx` e `llms-full.txt`.

---

## 📋 Lista de Tarefas Verificadas

### Fase 1: Hero Backgrounds WebP
- [x] **T1.1:** Criar e salvar os 4 fundos WebP em `public/`:
  - `public/botafogo_hero_bg.webp` (150 KB)
  - `public/flamengo_hero_bg.webp` (122 KB)
  - `public/laranjeiras_hero_bg.webp` (123 KB)
  - `public/jardimbotanico_hero_bg.webp` (129 KB)

### Fase 2: Criação das 4 Páginas Next.js
- [x] **T2.1:** Criar `src/app/insulfilm-em-botafogo/page.tsx`
- [x] **T2.2:** Criar `src/app/insulfilm-no-flamengo/page.tsx`
- [x] **T2.3:** Criar `src/app/insulfilm-em-laranjeiras/page.tsx`
- [x] **T2.4:** Criar `src/app/insulfilm-no-jardim-botanico/page.tsx`

### Fase 3: Link Building & Indexação
- [x] **T3.1:** Atualizar `src/app/sitemap.ts` (priority 0.85)
- [x] **T3.2:** Atualizar `src/sections/Coverage.tsx` com os novos bairros ativos
- [x] **T3.3:** Atualizar `src/sections/Footer.tsx` com links em destaque
- [x] **T3.4:** Atualizar `public/llms-full.txt` e `public/llms.txt`

### Fase 4: Auditoria e Verificação
- [x] **T4.1:** TypeScript `tsc --noEmit` compilado com 100% de sucesso (Exit code 0).
- [x] **T4.2:** `seo_checker.py` executado sem nenhuma pendência nas 4 novas páginas.
- [x] **T4.3:** Conformidade total com Design System LUME Elite (Dark & Gold, sem cores proibidas).
