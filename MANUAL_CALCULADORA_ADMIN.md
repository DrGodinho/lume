# Manual Resumido - Calculadora Admin Lume

## Visão Geral
A Calculadora Admin é um sistema profissional para cálculo e otimização de cortes de películas para vidros, integrado com CRM e sincronização em nuvem.

## 🚀 Acesso
- URL: `/admin` (requer autenticação)
- Usuário padrão: MP Godinho
- Sincronização automática com Supabase

## 🛠️ Funcionalidades Principais

### 1. **Painel Principal**
- **Entrada de vidros**: Adicionar vidros com dimensões (altura x largura)
- **Otimização automática**: Algoritmos inteligentes para corte mínimo
- **Cores por ambiente**: Sala, Cozinha, Quarto, Banheiro, Escritório
- **Modo corte**: Ativa/desativa layout travado para corte real

### 2. **Configurações (`ConfigPanel`)**
- **Largura do rolo**: 152cm (padrão)
- **Preço/m²**: R$ 80
- **Margem**: 3x
- **Modos de otimização**:
  - `densidade`: Máximo aproveitamento (menos desperdício)
  - `facilidade`: Corte simplificado
  - `facilidade_v2`: Balanceado (padrão)
- **Perdas**: Dinâmico (calculado) ou Fixo (20%)
- **Tipos de película**: Preços configuráveis por tipo

### 3. **Sincronização em Nuvem (`cloudSync.ts`)**
- **Rascunhos**: Salva automaticamente na nuvem
- **Histórico**: Todos os cálculos sincronizados
- **Backup**: Recuperação em caso de falha
- **Multi-usuário**: Cada usuário tem seu escopo isolado

### 4. **CRM Integrado**
- **Leads**: Converte cálculos em oportunidades
- **Histórico**: Acompanha todas as interações
- **Orçamentos**: Gera PDF profissional
- **Dashboard**: Métricas de vendas e conversão

## 📋 Fluxo de Trabalho

### 1. **Criar Novo Projeto**
1. Acesse `/admin`
2. Adicione vidros (+)
3. Configure dimensões (H x W)
4. Selecione ambiente (cor automática)
5. Pressione `Otimizar`

### 2. **Configurar Orçamento**
1. **Preço**: Ajuste valor por m²
2. **Margem**: Defina multiplicador (3x padrão)
3. **Desconto**: Aplique % se necessário
4. **Cliente**: Insira nome para histórico

### 3. **Gerar Saídas**
- **PDF**: Gera orçamento profissional
- **Imagem**: Exporta layout para corte
- **CRM**: Cria lead automaticamente
- **Histórico**: Salva para consulta futura

### 4. **Gerenciar Dados**
- **Histórico**: Visualiza todos os cálculos
- **Filtros**: Busca por cliente/data
- **Estatísticas**: Métricas de desempenho
- **Exportação**: Dados em CSV

## 🔧 Dicas Rápidas

### Otimização
- **Projetos complexos**: Use `facilidade_v2` para melhor balanceamento
- **Vidros pequenos**: `densidade` maximiza aproveitamento
- **Corte manual**: Desative otimização e organize livremente

### Performance
- **Sincronização**: Funciona offline com fallback
- **Cache**: Dados locais + nuvem
- **Limite**: 100 itens no histórico online

### Segurança
- **Autenticação**: JWT via Supabase Auth
- **Escopo**: Dados isolados por usuário
- **Backup**: Sincronização automática

## 🚨 Solução de Problemas

### Erro de Sincronização
1. Verifique conexão internet
2. Confirme login em `/login`
3. Recarregue página (F5)
4. Use modo offline (salva localmente)

### Cálculo Incorreto
1. Verifique unidade (cm)
2. Confirme preço/m² configurado
3. Ajuste margem se necessário
4. Reotimize com outro modo

### Interface Travada
1. Desative "Modo Corte"
2. Limpe cache do navegador
3. Reduza quantidade de vidros (>50 pode travar)

## 📞 Suporte
- **Documentação**: Código comentado em `/src/views/AdminCalculator.tsx`
- **Logs**: Console do navegador (`F12`)
- **Backend**: Supabase Tables (`calculator_history`, `calculator_drafts`)

---

**Versão**: 1.0  
**Atualizado**: Agosto 2026  
**Próximas features**: Relatórios avançados, integração WhatsApp, multi-lojas