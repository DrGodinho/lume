# Tarefa: Expansão Ofensiva Zona Oeste — Freguesia, Jardim Oceânico, Taquara e Pechincha

> **Objetivo:** Criar 4 landing pages irresistíveis de alta conversão para sub-bairros estratégicos da Zona Oeste (Freguesia, Jardim Oceânico, Taquara e Pechincha), utilizando uma arquitetura modular inteligente (`PremiumNeighborhoodView`), SEO local geo-otimizado e design system cinematográfico LUME Elite.

---

## 🎯 Escopo Alinhado (Decisões Socráticas)
1. **Bairros Selecionados:** 
   - `Freguesia (Jacarepaguá)`: foco em varandas gourmet, efeito estufa sol da tarde e Nano Cerâmica sem alterar fachada.
   - `Jardim Oceânico (Barra)`: foco em prédios baixos, privacidade total de pedestres e películas antivandalismo/segurança.
   - `Taquara`: foco em alívio térmico extremo, isolamento solar e custo-benefício (Carbono e Nano Cerâmica).
   - `Pechincha`: foco em condomínios residenciais densos, redução de consumo de ar-condicionado e privacidade.
2. **Arquitetura Modular:** `src/views/PremiumNeighborhoodView.tsx` reutilizável, tipado e com todas as animações e componentes LUME Elite (`HeroEntrance`, `AnimatedCounter`, `LevelDots`, `GoogleReviews`, `ContactCTA`).
3. **SEO & Schemas:** Schemas completos para cada página (`BreadcrumbList`, `LocalBusiness`, `Service` com `aggregateRating`, `FAQPage`).
4. **Link Building & Indexação:** Inclusão em `sitemap.ts`, `Coverage.tsx`, `Footer.tsx` e bases LLM (`llms-full.txt` e `llms.txt`).

---

## 📋 Lista de Tarefas Verificadas

### Fase 1: Hero Backgrounds WebP
- [x] **T1.1:** Criar e salvar os 4 fundos WebP otimizados em `public/`:
  - `public/freguesia_hero_bg.webp` (141 KB)
  - `public/jardim_oceanico_hero_bg.webp` (91 KB)
  - `public/taquara_hero_bg.webp` (120 KB)
  - `public/pechincha_hero_bg.webp` (122 KB)

### Fase 2: Componente Reutilizável de Alta Conversão
- [x] **T2.1:** Criar `src/views/PremiumNeighborhoodView.tsx` com suporte a dores locais, referências geográficas, catálogo técnico com `LevelDots`, contadores animados e FAQ interativo.

### Fase 3: Criação das 4 Páginas Next.js
- [x] **T3.1:** Criar `src/app/insulfilm-na-freguesia/page.tsx`
- [x] **T3.2:** Criar `src/app/insulfilm-no-jardim-oceanico/page.tsx`
- [x] **T3.3:** Criar `src/app/insulfilm-na-taquara/page.tsx`
- [x] **T3.4:** Criar `src/app/insulfilm-no-pechincha/page.tsx`

### Fase 4: Indexação & Distribuição de Autoridade
- [x] **T4.1:** Atualizar `src/app/sitemap.ts` com as 4 rotas (priority 0.85).
- [x] **T4.2:** Atualizar `src/sections/Coverage.tsx` com as 4 novas regiões ativas.
- [x] **T4.3:** Atualizar `src/sections/Footer.tsx` com badges e links indexáveis em destaque.
- [x] **T4.4:** Atualizar `public/llms-full.txt` e `public/llms.txt` para IA/AEO.

### Fase 5: Auditoria & Verificação Final
- [x] **T5.1:** `tsc --noEmit` compilado com 100% de sucesso (Exit code 0).
- [x] **T5.2:** `seo_checker.py` validado com zero pendências nas 4 novas páginas.
- [x] **T5.3:** Conformidade total com o Design System LUME Elite (Dark & Gold, Purple Ban respeitado).
