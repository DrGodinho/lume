# Manual de Uso - Calculadora Admin Lume
## Guia Completo para Iniciantes

Este manual explica todos os botões e funcionalidades da Calculadora Admin da Lume Controle Solar de forma simples e direta.

## 🎯 Visão Geral
A Calculadora Admin é uma ferramenta profissional para:
- Calcular o aproveitamento de películas para vidros
- Otimizar cortes para mínimo desperdício
- Gerar orçamentos profissionais
- Integrar com o CRM para gestão de leads
- Sincronizar dados na nuvem automaticamente

---

## 🖱️ PAINEL PRINCIPAL - BOTÕES E FUNÇÕES

### 🔹 SEÇÃO DE ENTRADA DE DADOS (lado esquerdo)

**Cliente**
- Campo de texto para inserir o nome do cliente
- Exemplo: "João Silva", "Empresa XYZ Ltda."

**Telefone**
- Campo para telefone de contato do cliente
- Formato: (21) 99999-9999

**Botão Zap (📱)**
- **Função**: Importar dados de uma mensagem do WhatsApp
- **Como usar**: Cole o código de importação que você recebeu via WhatsApp
- **Formato esperado**: Código contendo nome do cliente, bairro, filme, preço e lista de vidros

**Botão Salvar Projeto (💾)**
- **Função**: Salvar o projeto atual no seu computador
- **Formato**: Arquivo .insul (contém todas as configurações e vidros)
- **Útil para**: Fazer backup ou transferir projetos entre computadores

**Botão Abrir Projeto (📁)**
- **Função**: Carregar um projeto salvo anteriormente
- **Formato**: Selecione um arquivo .insul do seu computador

### 🔹 SEÇÃO DE CONFIGURAÇÃO RÁPIDA (centro-esquerda)

**Rolo**
- Largura do rolo de película em centímetros
- Padrão: 152 cm (largura comercial padrão)
- Ajuste conforme o fornecedor ou tipo de película

**Película**
- Tipo de película selecionado para o cálculo
- Opções disponíveis:
  - Carbono G5
  - Carbono G20
  - Refletiva
  - Dupla Camada
  - Nano Cerâmica 75
  - Nano Cerâmica G20
  - Jateado
- **Importante**: O preço/m² muda conforme o tipo selecionado

**Margem**
- Espaço adicional em cm para perdas de corte
- Padrão: 3 cm
- Valores típicos: 2-5 cm dependendo da habilidade do instalador

**R$/m²**
- Preço por metro quadrado da película
- Atualizado automaticamente quando você muda o tipo de película
- Pode ser editado diretamente para ajustes personalizados

### 🔹 SEÇÃO DE MEDIDAS (centro)

**Ambiente / Identificação**
- Campo para descrever onde o vidro será instalado
- Exemplos: "Sala", "Cozinha", "Quarto", "Banheiro", "Varanda"
- **Dica**: Ao digitar o ambiente, a cor do vidro muda automaticamente para facilitar a visualização

**Altura**
- Altura do vidro em centímetros
- Use ponto ou vírgula para decimais (ex: 120.5 ou 120,5)

**Largura**
- Largura do vidro em centímetros
- Use ponto ou vírgula para decimais

**Qtd**
- Quantidade de vidros idênticos
- Padrão: 1
- Exemplo: Se você tem 3 vidros de 80x120 cm, digite 3 no campo Qtd

**Botão Adicionar (+)**
- **Função**: Adicionar o vidro com as dimensões especificadas à lista de cálculo
- **Atalho**: Pressione ENTER após preencher a quantidade
- Após clicar, os campos de altura, largura e quantidade são limpos para o próximo vidro

### 🔹 SEÇÃO DE LISTA DE VIDROS (abaixo das medidas)

Esta seção mostra todos os vidros que você adicionou, agrupados por tamanho e ambiente.

**Para cada grupo de vidros:**
- Mostra: `[quantidade]x [altura] x [largura] cm` + nome do ambiente
- **Botão de lixeira (🗑️)**: Remove TODOS os vidros daquele tamanho e ambiente
- **Checkbox**: Seleciona/Deseleciona todos os vidros daquele grupo
- **Ícone de camadas (📊)**: Mostra a cor atribuída ao ambiente

**Funcionalidades de seleção:**
- Clique no checkbox ao lado de cada grupo para selecionar/deselecionar
- Clique no ícone de camadas para selecionar apenas aquele ambiente
- Use Ctrl+clique para seleção múltipla de grupos específicos

### 🔹 BARRA FLUTUANTE DE AÇÕES (quando itens estão selecionados - aparece na parte inferior)

Esta barra aparece automaticamente quando você seleciona um ou mais vidros.

**Botões disponíveis:**
- **Girar 90º (🔄)**: Rotaciona os vidros selecionados 90 grados (útil para otimizar o encaixe)
- **Alinhar à Esquerda (◀️)**: Alinha os vidros selecionados à esquerda do rolo
- **Alinhar à Direita (▶️)**: Alinha os vidros selecionados à direita do rolo
- **Copiar (📋)**: Copia os vidros selecionados para colar em outro ambiente
- **Colar (📋➕)**: Aparece após copiar - permite colar os vidros em um ambiente existente ou novo
- **Deletar Peças (🗑️)**: Remove apenas os vidros selecionados (não todos)
- **X (✖️)**: Limpa toda a seleção

### 🔹 SEÇÃO DE RESULTADOS (lado direito)

Esta seção mostra os resultados do cálculo em tempo real.

**Informações exibidas:**
- **Total Cliente**: Valor final do orçamento (com margem, descontos e perdas)
- **Área Total**: Área total de vidro em m²
- **Comprar**: Quantidade de rolo necessária em metros
- **Eficiência**: Percentual de aproveitamento do rolo (quanto maior, melhor)
- **Vlr Efetivo**: Valor real por m² considerando o desperdício
- **Desconto R$**: Valor do desconto aplicado
- **Perdas**: Botão para ativar/desativar compensação de perdas
- **Salvar (📚)**: Salva o cálculo atual no histórico
- **PNG (📷)**: Gera uma imagem do layout para visualização/compartilhamento
- **PDF (📄)**: Gera um orçamento profissional em PDF
- **Criar Lead (👤)**: Cria um opportunity no CRM para seguir com o cliente

**Botão Modo de Corte (✂️):**
- **Função**: Alterna entre vista de edição e vista de corte otimizado
- **Modo Edição (padrão)**: Você pode adicionar, remover e mover peças livremente
- **Modo de Corte**: Mostra exatamente como as peças devem ser posicionadas no rolo para corte
  - **Importante**: Neste modo, a sincronização com a nuvem é pausada para evitar conflitos
  - Para sair: Clique em "Sair do Modo de Corte" ou use o botão X vermelho

**Botões de Algoritmo de Corte (abaixo dos resultados):**
- **Corte Densidade**: Máximo aproveitamento (mais linhas de corte, menos desperdício)
- **Corte Fácil v1**: Menos linhas de corte, mais fácil de seguir (ligeiramente mais desperdício)
- **Corte Fácil v2**: Balanceado entre facilidade e aproveitamento (padrão)
- **Agressividade do Corte Fácil v2**: Ajuste fino para o algoritmo v2 (0-100%)
  - Valores baixos: Mais linhas de corte
  - Valores altos: Menos linhas de corte, mais econômico

### 🔹 BOTÕES SUPERIORES (canto direito superior)

Estes botões ficam sempre visíveis no topo direito da tela:

- **Config (⚙️)**: Abre o painel de configurações avançadas
- **Desfazer (↶)**: Ctrl+Z - Desfaz a última ação
- **Refazer (↷)**: Ctrl+Y - Refaz a última ação desfeita
- **Histórico (📜)**: Abre o painel de histórico de orçamentos
- **Limpar (🗑️)**: Remove TUDO (vidros, configurações, cliente) - pede confirmação
  - **ATENÇÃO**: Esta ação não pode ser desfeita!

---

## ⚙️ PAINEL DE CONFIGURAÇÕES AVANÇADAS

Acesse clicando no botão de engrenagem (⚙️) no topo direito.

### **Nome do Responsável**
- Seu nome ou identificação de usuário
- Aparece nos orçamentos gerados

### **Largura do Rolo (cm)**
- Largura comercial do rolo de película
- Valor padrão: 152 cm

### **Margem de Corte (cm)**
- Espaço adicional para perdas de corte
- Valor padrão: 3 cm

### **Película Padrão**
- Tipo de película que será selecionada ao iniciar uma nova sessão

### **Preços por Película (R$/m²)**
- Preço específico para cada tipo de película
- Atualize conforme sua tabela de preços

### **Algoritmo Padrão**
- Seleciona qual método de otimização será usado por padrão
- Opções: Densidade, Fácil v1, Fácil v2

### **Comportamento do Botão de Perdas**
- **Dinâmico**: Calcula perdas automaticamente baseado na eficiência do corte atual
- **Fixo**: Aplica sempre a mesma porcentagem de perda configurada abaixo

### **Porcentagem fixa (%)**
- Valor usado quando o modo "Fixo" está selecionado
- Padrão recomendado: 20%

### **Modo de Cor**
- **Ambiente**: Cada ambiente/identificação tem uma cor única
- **Tamanho**: A cor é baseada nas dimensões de cada peça

### **Agressividade do Corte Fácil v2**
- Ajuste fino para o algoritmo Fácil v2 (0-100%)
- **Mais linhas de corte** (valor baixo): Mais fácil de seguir, ligeiramente mais desperdício
- **Mais econômico** (valor alto): Menos linhas de corte, mais complexo de executar
- Padrão: 35%

### **Sair da Conta**
- Encerra sua sessão e retorna à tela de login
- Seus dados são mantidos na nuvem para a próxima sessão

---

## 📜 PAINEL DE HISTÓRICO

Acesse clicando no ícone de relógio (📜) no topo direito.

Esta tela mostra todos os orçamentos que você salvou anteriormente.

**Para cada orçamento salvo:**
- Nome do cliente e data
- Valor formatado (ex: R$ 1.250,00)
- Quantidade de peças e largura do rolo usada
- **Botão Carregar (▶️)**: Recupera esse orçamento para edição ou reutilização
- **Botão Lixeira (🗑️)**: Remove esse orçamento do histórico permanentemente

**Dica**: Use o histórico para:
- Reutilizar orçamentos similares
- Acompanhar seu histórico de vendas
- Duplicar orçamentos para clientes com necessidades semelhantes

---

## ☁️ SINCRONIZAÇÃO NA NUVEM

O sistema salva automaticamente seu trabalho na nuvem a cada:
- **5 segundos**: Rascunho do trabalho em progresso
- **2 segundos**: Configurações pessoais

**Indicador de status (nó na parte superior esquerda):**
- **☁️ Cinza**: Ocioso (aguardando para salvar)
- **🔄 Girando**: Sincronizando neste momento
- **☁️ Verde**: Sincronizado com sucesso
- **☁️ Vermelho**: Erro na sincronização (verifique sua internet)

**Modo de Corte**: Quando ativado, pausa a sincronização para evitar conflitos durante o trabalho intenso. A sincronização retorna automaticamente ao sair desse modo.

---

## 💡 DICAS DE USO

### Para Iniciantes:
1. Comece adicionando seus vidros usando os campos Altura, Largura e Qtd
2. Clique em "Adicionar" ou pressione ENTER
3. Repita para todos os vidros do orçamento
4. Observe os resultados em tempo real na lateral direita
5. Ajuste a margem ou preço se necessário
6. Quando satisfeito, clique em "Salvar" para guardar no histórico
7. Use "PDF" para gerar o orçamento para enviar ao cliente

### Para Otimização Avançada:
- Experimente os diferentes modos de corte (Densidade, Fácil v1, Fácil v2)
- Use o modo de corte (tesoura) para visualizar exatamente como as peças ficarão no rolo
- Selecione peças específicas para girar ou alinhar manualmente se necessário
- Ative "Compensar Perdas" para incluir automaticamente o desperdício no orçamento

### Para Trabalho em Equipe:
- Seu nome aparece nos orçamentos gerados
- Cada usuário tem seu próprio espaço na nuvem (dados não se misturam)
- Faça logout quando terminar para proteger sua conta

---

## 🚨 SOLUÇÃO DE PROBLEMAS COMUNS

**Não consigo adicionar vidros:**
- Verifique se Altura e Largura são números maiores que zero
- Confirme que a Quantidade é pelo menos 1
- Pressione ENTER no campo de quantidade após digitar os valores

**O cálculo parece estranho:**
- Confirme se a largura do rolo está correta (padrão 152 cm)
- Verifique se o preço/m² corresponde ao tipo de película selecionado
- Cheque se a margem está configurada adequadamente

**Não consigo salvar no histórico:**
- Você precisa ter pelo menos um vidro adicionado
- O botão "Salvar" só fica ativo quando há vidros na lista

**Sincronização travando:**
- Verifique sua conexão com a internet
- Tente recarregar a página (F5)
- Se persistir, faça logout e login novamente

**Botões não respondendo:**
- Clique em uma área vazia da tela para desfocar possíveis campos ativos
- Tente usar os atalhos de teclado (Ctrl+Z, Ctrl+Y)
- Recarregue a página como último recurso

---

## 📱 ATALHOS DE TECLADO

- **Ctrl + Z**: Desfazer última ação
- **Ctrl + Y**: Refazer última ação desfeita
- **Enter** (no campo de quantidade): Adicionar vidro
- **Escape**: Cancela operações em progresso (como edição de nome de ambiente)
- **Clique fora**: Desfoca campos de entrada ativos

---

## 🎓 PRÓXIMOS PASSOS

Depois de se familiarizar com as funções básicas:
1. Explore os relatórios no painel de AdminDados
2. Experimente integrar com o WhatsApp usando o código de importação
3. Personalize as cores dos ambientes para sua equipe
4. Ajuste as configurações padrão para seu fluxo de trabalho específico
5. Use o recurso de criar lead para seguir seus prospects no CRM

---

**Lembre-se**: 
- Seus dados são salvos automaticamente na nuvem
- Você pode trabalhar offline - as alterações serão sincronizadas quando voltar online
- Sempre gere o PDF antes de enviar ao cliente para um orçamento profissional
- Use o histórico para não repetir trabalho em orçamentos similares

**Versão do Manual**: 1.0 - Agosto 2026
**Para suporte**: Consulte a documentação técnica ou sua equipe de TI