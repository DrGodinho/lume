# Sprint 3: Expansão de Alto Ticket & Funil Simulador ➡️ CRM

> **Objetivo:** Conquistar clientes com alto poder aquisitivo na Zona Sul e Tijuca (foco em Nano Cerâmica de alta margem) e transformar simulações do site em leads rastreáveis no CRM.

---

## 🎯 Escopo Alinhado (Decisões Socráticas)
1. **Landing Pages Sob Medida:** 4 novas LPs cinematográficas dedicadas com narrativa e dores locais específicas (maresia, fachada, sol poente, privacidade) no padrão LUME Elite.
2. **Sequenciamento:** Fase 1 (4 LPs de Alto Padrão) ➡️ Fase 2 (Integração Simulador ➡️ Modal Pré-Lead ➡️ CRM).
3. **Coleta de Lead no Simulador:** Modal ágil (Nome + WhatsApp + Bairro) que grava no CRM via endpoint público seguro antes de abrir o WhatsApp pré-formatado.

---

## 📋 Lista de Tarefas (Pequenas & Verificáveis)

### Fase 1: Assets & Imagens Hero de Alto Padrão
- [x] **T1.1:** Gerar e salvar hero backgrounds otimizados em WebP:
  - `public/copacabana_hero_bg.webp` (Varanda/living luxo com vista mar de Copacabana)
  - `public/ipanema_hero_bg.webp` (Apartamento alto padrão vista Morro Dois Irmãos / Ipanema)
  - `public/leblon_hero_bg.webp` (Residencial exclusivo no Leblon com vidro termoacústico/solar)
  - `public/tijuca_hero_bg.webp` (Living tradicional e moderno com vista montanhas na Tijuca)

### Fase 2: Criação das 4 Landing Pages de Alto Padrão
- [x] **T2.1:** Criar `CopacabanaPage.tsx` e `src/app/insulfilm-em-copacabana/page.tsx` com Schemas completos (`LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList`).
- [x] **T2.2:** Criar `IpanemaPage.tsx` e `src/app/insulfilm-em-ipanema/page.tsx` com foco em fachadas nobres e máxima transparência Nano Cerâmica.
- [x] **T2.3:** Criar `LeblonPage.tsx` e `src/app/insulfilm-no-leblon/page.tsx` com ênfase em alto luxo, privacidade e isolamento térmico.
- [x] **T2.4:** Criar `TijucaPage.tsx` e `src/app/insulfilm-na-tijuca/page.tsx` com ênfase em calor urbano, conforto térmico e proteção de móveis.

### Fase 3: Indexação & Link Building Interno
- [x] **T3.1:** Atualizar `src/app/sitemap.ts` com as 4 novas rotas.
- [x] **T3.2:** Atualizar `src/sections/Footer.tsx` incluindo Copacabana, Ipanema, Leblon e Tijuca.
- [x] **T3.3:** Atualizar `src/sections/Coverage.tsx` (seção Onde Atendemos da Home).

### Fase 4: Integração do Simulador ao CRM
- [x] **T4.1:** Criar API route pública segura `POST /api/crm/public-lead/` com validação Zod, sanitização, limitação e inserção com status `Novo` e nota `[Origem: Simulador Online LUME]`.
- [x] **T4.2:** Desenvolver componente de modal de pré-lead em `src/views/Simulator.tsx` (Nome, WhatsApp, Bairro) disparado ao clicar em "Quero Este Insulfilm no Orçamento".
- [x] **T4.3:** Conectar o envio ao endpoint `/api/crm/public-lead/` e em seguida disparar o WhatsApp com o texto customizado.

### Fase 5: Validação, Auditoria & Checklist
- [x] **T5.1:** Executar `lint_runner.py` e validar ausência de erros TypeScript (`tsc --noEmit` e ESLint 100% limpos).
- [x] **T5.2:** Executar `seo_checker.py` para validar metadados e schemas das novas páginas.
- [x] **T5.3:** Executar `ux_audit.py` para conformidade com LUME Elite Design (Purple Ban, Montserrat, contrastes, todas as páginas PASS).
- [x] **T5.4:** Atualizar `PLANO_DE_CRESCIMENTO_E_MELHORIAS.md` marcando Sprint 3 como concluído.
