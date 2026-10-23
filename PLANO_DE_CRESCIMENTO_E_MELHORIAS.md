# Plano Estratégico de Crescimento, Upgrades & Aquisição de Clientes
## LUME Controle Solar — 2026

> **Meta Central:** Aquisição Máxima de Clientes via Google e WhatsApp (Conversão e Faturamento).  
> **Status:** Ativo & Pronto para Execução.  
> **Escopo Atual:** Web Desktop & Mobile (App Nativo Android despriorizado conforme alinhamento estratégico).

---

## 🎯 1. Visão Geral & Diretriz Estratégica

A meta única e prioritária deste ciclo é **trazer novos clientes pagantes** para a LUME Controle Solar.  
Para atingir o pico de conversão com o menor custo de aquisição, focamos em três pilares integrados:

1. **Expansão Geográfica Ofensiva (GEO):** Capturar a onda de novos empreendimentos residenciais no Rio de Janeiro, com foco máximo em **Santo Cristo (Porto Maravilha)** e **Centro**.
2. **Eliminação de Fricção no Funil:** Destravar o menu principal (`Navbar`), rodapé (`Footer`) e botões de ação para conduzir qualquer visitante imediatamente ao WhatsApp com contexto do orçamento.
3. **Padronização de Alta Conversão:** Elevar todas as landing pages existentes ao padrão visual cinematográfico da Home, com prova social de alto impacto e carregamento ultrarrápido.

---

## 🚀 2. A Oportunidade de Ouro: Explosão Residencial em Santo Cristo & Porto Maravilha

### Por que Santo Cristo é a prioridade #1 de expansão?
A região do **Porto Maravilha (Santo Cristo, Gamboa e arredores)** vive a maior explosão imobiliária residencial da história recente da cidade:
- **Milhares de novos apartamentos entregues e em fase de chaves:** Condomínios de grande porte (empreendimentos Cury, Porto Maravilha, Novocanto, Rio Wonder, Pateo Nazaret, Heitor dos Prazeres, Epicentro, etc.).
- **Características arquitetônicas favoráveis à LUME:**
  - Fachadas envidraçadas e varandas integradas sujeitas à forte insolação da Baía de Guanabara e sol poente.
  - Calor intenso na região portuária sem a brisa típica da orla marítima.
  - **Falta de privacidade aguda:** Prédios verticais de alta densidade próximos entre si geram necessidade imediata de películas fumê, carbono ou jateadas.
  - Proibição frequente de cortinas pesadas ou padrões destoantes de fachada por convenção de condomínio, tornando a **Nano Cerâmica** e películas neutras de alta performance a solução perfeita.
- **Momento de compra ideal:** O morador que acaba de pegar as chaves precisa de insulfilm antes de mudar os móveis para evitar que o sol queime o piso e o sofá novo.

---

## 📋 3. Diagnóstico Consolidado dos Pontos Fracos do Site

| Categoria | Ponto Fraco Identificado | Impacto Comercial / Técnico | Ação Corretiva |
|---|---|---|---|
| **GEO / SEO** | Sem cobertura no Centro e Santo Cristo | Zero tráfego orgânico da maior entrega de chaves do Rio | Criar Landing Pages dedicadas com Schema LocalBusiness/Service |
| **GEO / SEO** | 7 páginas de bairro da Zona Oeste desatualizadas | Conversão inferior ao padrão da Home; falta de uniformidade | Migrar para `HeroEntrance` palavra por palavra, `ScrollReveal` e `LevelDots` |
| **Conversão / UX** | Ferramentas (Simulador, Calculadora, Guia) fora do Menu | Visitantes não encontram os recursos mais atraentes de fechamento | Inserir dropdown/atalhos "Ferramentas" e trocar CTA por "Pedir Orçamento" |
| **Conversão / UX** | Links de cômodos (Sala, Quarto, etc.) e Sulacap fora do Footer | Menor distribuição de link juice (SEO) e rotas escondidas | Adicionar matriz completa de soluções e bairros no rodapé |
| **AEO / IA** | Dados conflitantes no `llms-full.txt` | IAs (ChatGPT, Perplexity) recomendam dados divergentes (garantia e preços) | Sincronizar garantia (até 10 anos), preços unificados e barras finais |
| **SEO Técnico** | Catálogo Schema incompleto no `layout.tsx` | Google não indexa todas as categorias de serviços oferecidas | Incluir Jateado, Dupla Camada e Portas no `OfferCatalog` |
| **Performance** | `images: { unoptimized: true }` no Next.js | Imagens brutas enviadas para celulares lentos | Ativar otimização responsiva e limpar PNGs de alta densidade do `public/` |
| **Segurança** | Falta de `middleware.ts` no Next.js | Rotas internas dependem apenas de verificação client-side | Criar Edge Middleware para redirecionar acessos diretos com segurança |
| **Operação** | Tabela de preços descentralizada | Simulador marca R$ 240/m² e a base usa R$ 220/m² | Centralizar em `src/lib/films.ts` como fonte única da verdade |

---

## 🗺️ 4. Roadmap de Execução (Prioridade Máxima: Clientes)

```mermaid
graph TD
    subgraph "Sprint 1: Aquisição Imediata & Santo Cristo"
        S1A[Nova LP: Santo Cristo / Porto Maravilha]
        S1B[Nova LP: Centro do Rio]
        S1C[Ajustes Navbar & Footer: CTAs Diretos de Orçamento]
        S1D[Unificação da Tabela de Preços em films.ts]
    end

    subgraph "Sprint 2: Conversão & LUME Design Standards"
        S2A[Refatoração dos 7 Bairros da Zona Oeste para HeroEntrance]
        S2B[Otimização de Imagens e Assets Pesados]
        S2C[Expansão do Schema OfferCatalog e LocalBusiness]
        S2D[Alinhamento AEO / llms-full.txt para IAs]
    end

    subgraph "Sprint 3: Escala & Expansão de Alto Ticket"
        S3A[Novas LPs Zona Sul: Copacabana, Ipanema, Barra/Recreio v2]
        S3B[Nova LP Tijuca & Grande Tijuca]
        S3C[Funil Direto: Simulador ➡️ WhatsApp com Pré-Lead]
    end

    Sprint 1: Aquisição Imediata & Santo Cristo --> Sprint 2: Conversão & LUME Design Standards
    Sprint 2: Conversão & LUME Design Standards --> Sprint 3: Escala & Expansão de Alto Ticket
```

---

## 🏗️ 5. Detalhamento dos Planos por Sprint

### 🟢 SPRINT 1: Aquisição Imediata & Onda Santo Cristo (Semana 1)
> **Objetivo:** Posicionar o site no Google para novos moradores do Porto Maravilha/Centro e transformar visitantes em conversas no WhatsApp.

1. **Criação da Landing Page de Santo Cristo (`/insulfilm-em-santo-cristo/`)** `[CONCLUÍDO]`:
   - **Foco:** Empreendimentos residenciais novos do Porto Maravilha, proteção térmica para grandes painéis de vidro, privacidade entre torres e conformidade com regras de condomínio.
   - **Design:** Seguir rigorosamente o padrão LUME Elite (Dark & Gold, `<HeroEntrance>` com `.word`, `<ScrollReveal>`, `<AnimatedCounter>`, `Particles`, `GoogleReviews`).
   - **Schema:** `LocalBusiness`, `Service` e `FAQPage` geo-localizados nas coordenadas de Santo Cristo.
   - **Inclusão:** Inserir em `sitemap.ts`, `robots.txt` e links internos do Footer e Home.

2. **Criação da Landing Page do Centro (`/insulfilm-no-centro-do-rio/`)** `[CONCLUÍDO]`:
   - **Foco:** Novos residenciais do Reviver Centro, coberturas, salas comerciais e escritórios.

3. **Revolução na Navegação (`Navbar` & `Footer`)** `[CONCLUÍDO]`:
   - Atualizar a `Navbar`:
     - Adicionar dropdown ou links diretos para **Simulador**, **Calculadora** e **Guia**.
     - Substituir o botão secundário pelo botão de alta conversão: `[Pedir Orçamento Grátis]` direcionando para o WhatsApp com mensagem contextual.
   - Atualizar o `Footer`:
     - Incluir a nova seção "Soluções por Ambiente" (Sala, Quarto, Cozinha, Banheiro, Escritório, Portas).
     - Adicionar **Santo Cristo**, **Centro** e **Sulacap** na lista de bairros atendidos.

4. **Harmonização de Preços (`src/lib/films.ts` & `Simulator.tsx`)** `[CONCLUÍDO]`:
   - Conectado o [Simulator.tsx](file:///c:/Users/ThinkPad/Downloads/app/src/views/Simulator.tsx) diretamente às constantes canônicas de [films.ts](file:///c:/Users/ThinkPad/Downloads/app/src/lib/films.ts), eliminando qualquer divergência entre simulação e orçamento final (Nano Cerâmica padronizada em R$ 220/m²).

---

### 🟡 SPRINT 2: Conversão & LUME Standards nas Páginas Existentes (Semana 2)
> **Objetivo:** Aumentar a taxa de fechamento das visitas que já chegam na Zona Oeste e deixar o SEO impecável para o algoritmo do Google.

1. **Padronização das 7 Landing Pages da Zona Oeste** `[CONCLUÍDO]`:
   - Atualizados `Bangu`, `Campo Grande`, `Realengo`, `Sulacap`, `Barra da Tijuca`, `Recreio` e `Jacarepaguá` e o `NeighborhoodTemplate.tsx`:
     - Componente `<HeroEntrance>` com spans `.word inline-block` animando cada palavra sequencialmente.
     - Subtítulo com traços dourados laterais e classe `.animate-hero`.
     - Inclusão do `<NavigationBreadcrumbs>` no topo do Hero em todas as 7 páginas.
     - Refatoração de `NeighborhoodAnimations` com triggers dinâmicos e limpeza segura de ScrollTrigger sem afetar outros componentes.
2. **Otimização de Carregamento & Assets**:
   - Converter `novo-logo-lume.png` (388 KB) para WebP/SVG.
   - Remover arquivos órfãos não utilizados da pasta `public/` para reduzir o payload.
   - Ativar suporte a formatos modernos de imagem no `next.config.mjs`.
3. **Indexação Semântica Expandida (Schemas)**:
   - Adicionar todos os tipos de películas (`Jateado`, `Dupla Camada`, `Portas de Vidro`) no `OfferCatalog` do [layout.tsx](file:///c:/Users/ThinkPad/Downloads/app/src/app/layout.tsx).
   - Inserir `aggregateRating` no schema principal da empresa.
4. **Alinhamento da Base de Conhecimento de IA (`llms-full.txt` e `llms.txt`)**:
   - Atualizar as especificações para garantir recomendação precisa em buscas no ChatGPT, Perplexity e Google Gemini.

---

### 🟣 SPRINT 3: Expansão de Alto Ticket (Semana 3) `[CONCLUÍDO]`
> **Objetivo:** Conquistar a demanda de bairros com maior capacidade de investimento em películas Nano Cerâmica (margem de lucro elevada) e integrar a captação de leads do Simulador ao CRM.

1. **Criação das Landing Pages de Alto Padrão** `[CONCLUÍDO]`:
   - [Copacabana](/insulfilm-em-copacabana/): Foco em orla marítima, resistência à maresia sem oxidação, preservação da vista e conforto térmico na Av. Atlântica.
   - [Ipanema](/insulfilm-em-ipanema/): Foco em residências nobres (Vieira Souto / Prudente de Morais), sol poente, conformidade com regras estritas de fachada e corte de 95% do calor com Nano Cerâmica.
   - [Leblon](/insulfilm-no-leblon/): Foco no m² mais valorizado do país (Delfim Moreira / Alto Leblon), proteção UV absoluta para acervos de arte, isolamento acústico e discrição.
   - [Tijuca](/insulfilm-na-tijuca/): Foco em alívio térmico urbano (redução de até 8°C), redução de ofuscamento para home office e custo-benefício com Carbono Elite e Dupla Camada.
   - Todas as 4 páginas contam com:
     - Hero backgrounds em `.webp` de alta fidelidade e contraste cinematográfico.
     - Design System LUME Elite: `<HeroEntrance>` palavra por palavra, `<ScrollReveal>`, `<AnimatedCounter>`, `<GoogleReviews>`, `<LevelDots>` e `<ContactCTA>`.
     - Schemas JSON-LD completos: `LocalBusiness` com coordenadas geo-localizadas, `Service` com `Offer` e `FAQPage` indexável.
     - Registro em `sitemap.ts`, `Footer.tsx` e `Coverage.tsx` ("Onde Atendemos").

2. **Integração do Simulador ao CRM LUME (Funil Direto de Conversão)** `[CONCLUÍDO]`:
   - **Modal de Pré-Lead:** Disparado ao clicar em "Quero Este Insulfilm no Orçamento", permitindo coletar Nome, WhatsApp e Bairro com opção de abertura direta.
   - **API Pública Segura (`POST /api/crm/public-lead/`):** Endpoint server-side com validação Zod, honeypot anti-spam e inserção com credencial de serviço no Supabase (`status: 'Novo'` e histórico).
   - **Disparo Contextual para WhatsApp:** Mensagem pré-formatada com o nome do cliente, bairro e produto recomendado (ex: Nano Cerâmica), gerando um fluxo de atendimento contínuo.

---

## 📌 6. Tabela de Monitoramento & Métricas de Sucesso (KPIs)

| Métrica | Situação Atual | Meta Pós-Sprint 1 e 2 |
|---|---|---|
| **Páginas Geo-Otimizadas (GEO)** | 7 bairros (apenas Zona Oeste) | 9 bairros (+ Santo Cristo e Centro) |
| **Taxa de Conversão da Navbar** | Baixa (sem CTA direto de orçamento) | Aumento estimado de +35% em cliques de WhatsApp |
| **Indexação em IAs (AEO / LLM)** | Inconsistente (dados desatualizados) | 100% alinhada com as tabelas de 2026 |
| **Conformidade com LUME Design** | Parcial (apenas Home e Cômodos) | 100% de todas as LPs seguindo o padrão oficial |
| **Leads no Porto Maravilha / Santo Cristo** | 0 por busca orgânica | Posição #1 para buscas de insulfilm no Porto |

---

*Documento gerado automaticamente pela suíte de auditoria Antigravity Kit. Aprovado para execução imediata.*
