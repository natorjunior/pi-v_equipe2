# Documento de Requisitos

## Stay and Learn

## Sumário

1. [INTRODUÇÃO](#1-introdução)
2. [REQUISITOS](#2-requisitos)
   - [Requisitos Funcionais](#21-requisitos-funcionais)
   - [Requisitos Não Funcionais](#22-requisitos-não-funcionais)
3. [PRIORIZAÇÃO](#3-priorização)
4. [CASOS DE USO](#4-casos-de-uso)

---

## 1. INTRODUÇÃO

Este documento descreve os requisitos para um aplicativo de estudos e leitura. O SAL busca estimular a criação de hábitos saudáveis de aprendizado por meio da interação social. Os usuários poderão criar desafios de estudo, acompanhar seu progresso e competir de forma amigável.

### 1.1 Objetivo

O objetivo é criar um espaço onde os usuários possam se desafiar e se motivar a estudar e ler mais. Os desafios de estudo e de leitura proporcionarão uma experiência divertida e engajante, promovendo o aprendizado e o desenvolvimento pessoal por meio da competição saudável e do apoio entre participantes.

### 1.2 Escopo

O aplicativo incluirá funcionalidades como criação e participação em grupos de estudo, rastreamento de tempo de estudo e páginas lidas, sistema de pontuação e ranking. Ele será acessível via dispositivos móveis, garantindo uma experiência intuitiva e responsiva.

---

## 2. REQUISITOS

Os requisitos representam as funcionalidades e condições essenciais que o software precisa cumprir para funcionar de maneira eficaz e atender às expectativas dos usuários.

### 2.1 Requisitos Funcionais

- **RF01:** Cadastro e Autenticação de Usuários
- Permitir criação de conta com nome de usuário, e-mail e senha.
- Implementar login e recuperação de senha.
- Disponibilizar um perfil de usuário contendo nome, áreas de interesse e objetivos de estudo.

- **RF02:** Criação de Grupos e Desafios
- Possibilitar a criação de grupos, grupo de estudos ou um clube.
- Permitir a criação de desafios (exemplo: leitura de um livro).
- Definir título, descrição, área de estudo e duração do desafio.

- **RF03:** Participação em Desafios
- Permitir inscrição em desafios existentes.
- Registrar o progresso do usuário no desafio.

- **RF04:** Sistema de Pontuação e Ranking
- Atribuir pontuação com base no desempenho do usuário.
- Atualizar o ranking e permitir a comparação com outros participantes.

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
**Objetivo:** Criar um novo desafio no grupo.
**Pré-condições:** Usuário logado.

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
