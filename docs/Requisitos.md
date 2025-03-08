# Documento de Requisitos  

## Aplicativo de Estudos  

**Janeiro / 2025**  

## Sumário  

1. [INTRODUÇÃO](#1-introdução)  
2. [REQUISITOS](#2-requisitos)  
   - [Requisitos Funcionais](#21-requisitos-funcionais)  
   - [Requisitos Não Funcionais](#22-requisitos-não-funcionais)  
3. [PRIORIZAÇÃO](#3-priorização)  
4. [CASOS DE USO](#4-casos-de-uso)  

---

## 1. INTRODUÇÃO  

Este documento descreve os requisitos para um aplicativo de estudos e leitura. A plataforma busca estimular a criação de hábitos saudáveis de aprendizado por meio da gamificação e da interação social. Os usuários poderão criar desafios de estudo, acompanhar seu progresso e competir de forma amigável.

### 1.1 Objetivo  

O objetivo é criar um espaço onde os usuários possam se desafiar e se motivar a estudar e ler mais. Os desafios acadêmicos e de leitura proporcionarão uma experiência divertida e engajante, promovendo o aprendizado e o desenvolvimento pessoal por meio da competição saudável e do apoio entre participantes.

### 1.2 Escopo  

O aplicativo incluirá funcionalidades como criação e participação em grupos de estudo, rastreamento de tempo de estudo e páginas lidas, sistema de pontuação e ranking. Ele será acessível via dispositivos móveis, garantindo uma experiência intuitiva e responsiva.

---

## 2. REQUISITOS  

Os requisitos representam as funcionalidades e condições essenciais que o software precisa cumprir para funcionar de maneira eficaz e atender às expectativas dos usuários.

### 2.1 Requisitos Funcionais  

- **RF01:** Cadastro e Autenticação de Usuários  
  - Criar conta com e-mail e senha.  
  - Permitir login e recuperação de senha.  
  - Perfil do usuário com nome, áreas de interesse e objetivos de estudo.  

- **RF02:** Criar Desafios  
  - Inserir desafios (exemplo: leitura de um livro).  
  - Criar grupos.  
  - Definir título, descrição, área de estudo e duração do desafio.  

- **RF03:** Participação em Desafios  
  - Inscrição em desafios existentes.  
  - Adesão via convites ou códigos compartilhados.  
  - Registro de progresso no desafio.  

- **RF04:** Rastreamento de Atividades  
  - Registro manual de tempo de estudo e páginas lidas.  
  - Atualização do progresso do desafio.  

- **RF05:** Sistema de Pontuação e Ranking  
  - Pontuação baseada no desempenho do usuário.  
  - Atualização de ranking e comparação com outros participantes.  

### 2.2 Requisitos Não Funcionais  

- **RNF01:** Responsividade  
  - Aplicativo acessível e funcional em dispositivos móveis.  

- **RNF02:** Sincronização de Dados  
  - Dados atualizados em tempo real entre dispositivos.  

- **RNF03:** Desempenho  
  - Tempo de resposta inferior a 2 segundos.  

- **RNF04:** Segurança  
  - Armazenamento seguro de informações dos usuários.  

---

## 3. PRIORIZAÇÃO  

- **Imprescindível:** Cadastro, autenticação, desafios, rastreamento de atividades, ranking e responsividade.  
- **Desejável:** Sincronização de dados entre dispositivos.  
- **Poderia Ter:** Lembretes para desafios.  
- **Não Terá:** Integração com dispositivos externos e personalização avançada.  

---

## 4. CASOS DE USO  

### 4.1 Gerenciar Desafios  

#### 4.1.1 Criar Desafio  
**Ator Principal:** Usuário  
**Objetivo:** Criar um novo desafio na plataforma.  
**Pré-condições:** Usuário autenticado.  

**Fluxo Principal:**  
1. Usuário seleciona a opção para criar desafio.  
2. Insere título, descrição, tipo de atividade e duração.  
3. Confirma a criação do desafio.  
4. Sistema armazena o desafio e o disponibiliza.  

#### 4.1.2 Participar de um Desafio  
**Ator Principal:** Usuário  
**Objetivo:** Inscrição em um desafio existente.  
**Pré-condições:** Usuário logado.  

**Fluxo Principal:**  
1. Usuário acessa a lista de desafios.  
2. Escolhe um desafio e solicita participação.  
3. Sistema registra o usuário no desafio.  

### 4.2 Visualizar Tarefas  

#### 4.2.1 Visualizar Desempenho  
**Ator Principal:** Usuário  
**Objetivo:** Acompanhar o desempenho nos desafios.  
**Pré-condições:** Usuário autenticado e participando de pelo menos um desafio.  

**Fluxo Principal:**  
1. Usuário acessa a seção de progresso.  
2. Sistema exibe pontuação e ranking.  

---

**Faculdade Senac Ceará**  
Av. Tristão Gonçalves, 1245 - Bairro Centro  
CEP 60015-000 - Fortaleza - CE  
Telefone: (85) 3270-5830 / (85) 99119-6391  
[www.faculdadesenacce.com.br](http://www.faculdadesenacce.com.br)
