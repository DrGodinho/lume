# 📋 Plano de Implementação: Consultor Estratégico de Bobinas & Sobras com Gemini + Bluetech (Opção C)

> **Task Slug:** `task-ia-cut-advisor`  
> **Status:** Concluído com Sucesso ✅  
> **Regra Bluetech:** Apenas películas da família **Nano Cerâmica** (`nano_ceramica`, `nano_ceramica_g20`) possuem a opção de bobina de 1,00m. As demais linhas (Carbono, Refletiva, Dupla Camada, Jateado, etc.) são restritas a 1,52m (ou rolos fechados).

---

## 🎯 Objetivo
Integrar um assistente inteligente de rentabilidade de corte que analisa o mapa de peças gerado pelo empacotador 2D e sugere:
1. **Troca de Bobina Inteligente (apenas Nano Cerâmica):** Simula em tempo real se a bobina de 1,00m reduz o desperdício em relação à de 1,52m, calculando metros lineares e economia em R$, com botão de troca em 1 clique.
2. **Restrição Real Bluetech:** Para películas que não possuem 1,00m, o consultor não sugere 1m; foca em aproveitamento de retalhos nobres e otimização de rotação.
3. **Detecção de Retalhos Nobres:** Identifica automaticamente sobras grandes aproveitáveis (ex: largura >= 40cm e comprimento >= 100cm) para evitar descarte desnecessário.

---

## 🗺️ Fases de Implementação

### Fase 1: Endpoint de Análise (`src/app/api/ai/cut-advisor/route.ts`)
- Recebe: dados do pedido (vidros, filme selecionado, bobina atual, metros lineares, eficiência %, simulação de 1,00m e retalhos).
- Valida a família de película contra o catálogo da Bluetech.
- Envia para o **Gemini 3.8 Flash** gerar diagnóstico comercial em português claro e conciso.

### Fase 2: Componente UI (`src/components/calculator/AiCutAdvisor.tsx`)
- Card no padrão Dark & Gold LUME Elite (`#0a0e17`, `#c9a227`, borda suave).
- Exibe métrica de diagnóstico:
  - Badge de Status: "Otimizado" ou "Oportunidade de Economia".
  - Diagnóstico em linguagem direta.
  - Ação rápida de 1 clique: `[Alternar para Bobina de 1,00m]` ou `[Alternar para Bobina de 1,52m]`.
  - Chip de "Retalho Nobre" com medidas da sobra aproveitável.

### Fase 3: Integração no `AdminCalculator.tsx`
- Posicionado estrategicamente acima ou junto ao `CutMap`.
- Execução automática / sob demanda (botão de atualizar análise com IA).
- Atualização dinâmica ao trocar vidros ou bobina.

### Fase 4: Validação & Build
- Testes com Nano Cerâmica e com Carbono G5.
- Execução de `npx tsc --noEmit` para 0 erros de compilação.

