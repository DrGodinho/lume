# 📋 Plano de Implementação: Leitura de Medições por Foto com Gemini Vision (Opção A)

> **Task Slug:** `task-ia-vision-measures`  
> **Status:** Concluído com Sucesso ✅  
> **API Validada:** Google AI (Gemini 3.8 Flash Multimodal)  

---

## 🎯 Objetivo
Permitir que o administrador da Calculadora LUME envie uma foto de anotações de papel, prancheta ou mensagem de medição e, através do Gemini 2.5 Flash, extraia automaticamente as dimensões (convertidas para centímetros/milímetros padrão) e ambientes, apresentando um **Modal de Validação Rápida** interativo antes de injetar no algoritmo de corte 2D.

---

## 🗺️ Fases de Implementação

### Fase 1: Configuração Segura & Backend
1. **Ambiente:** Adicionar `GEMINI_API_KEY` ao `.env.local` (protegido contra commits via `.gitignore`).
2. **API Route (`src/app/api/ai/vision-measures/route.ts`):**
   - Recebe `multipart/form-data` ou payload Base64 da imagem.
   - Valida tamanho e tipo MIME (JPEG, PNG, WebP).
   - Envia requisição multimodal com *System Prompt* rigoroso de medição de vidraçaria/insulfilm.
   - Força retorno estruturado (JSON Schema) contendo:
     - `ambiente`: string (ex: "Varanda", "Quarto 1")
     - `largura`: number (em centímetros)
     - `altura`: number (em centímetros)
     - `quantidade`: number (default: 1)
     - `observacao`: string opcional (ex: "peça superior")
     - `grauConfianca`: 'alto' | 'medio' | 'baixo'

### Fase 2: Componente do Modal de Validação Rápida (`src/components/calculator/AiVisionModal.tsx`)
1. **Design System:** Dark & Gold (LUME Elite), sem roxo (`#040811`, `#111e33`, `#c9a227`, borders `white/10`).
2. **Upload & Câmera:**
   - Suporte a Drag-and-Drop de imagem.
   - Botão para tirar foto direto da câmera do smartphone/tablet.
   - Pré-visualização com zoom da foto enviada.
3. **Tabela de Edição Rápida:**
   - Lista lado a lado com a foto para conferência visual.
   - Inputs editáveis para Ambiente, Largura, Altura e Quantidade.
   - Botão de excluir item ou adicionar item faltante.
   - Badge de confiança da IA.
4. **Ação de Conclusão:**
   - Opções: "Adicionar aos vidros existentes" ou "Substituir lista atual".
   - Converte para o formato interno `GlassItem` com IDs únicos e cores de ambiente correspondentes.

### Fase 3: Integração com `AdminCalculator.tsx`
1. Botão elegante na barra de ferramentas da calculadora: `[✨ Ler Foto com IA]`.
2. Feedback visual com Skeleton / Spinner dourado durante os 1-2 segundos de processamento.
3. Notificação via `Toast` informando quantos vidros foram importados.

### Fase 4: Testes & Verificação
1. Teste com rascunhos manuscritos reais e impressos.
2. Tratamento de erros de rede ou imagem ilegível.
3. Execução de lint e checagem de tipos TypeScript.

