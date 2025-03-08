# * - Aplicativo de Desafios de Estudos e Leitura

## 📖 O que é o *?
GymTas é um aplicativo que transforma o estudo e a leitura em uma experiência gamificada.,O * incentiva os usuários a criarem e participarem de desafios de aprendizado, acompanhando seu progresso e competindo de forma saudável com amigos e outros participantes.

## 🎯 Qual problema ele resolve?
Muitas pessoas têm dificuldade em manter uma rotina consistente de estudos e leitura. A falta de motivação e disciplina pode tornar o aprendizado desafiador e desorganizado. O * resolve esse problema ao oferecer um sistema de desafios, pontuação e ranking, incentivando o engajamento contínuo e promovendo uma comunidade de apoio ao aprendizado.


# pi-v
# 📌 Regras para Uso do Git e GitHub no Desenvolvimento

## ✅ 1. Siga um fluxo de trabalho definido, como **Git Flow**.

### 📂 Exemplo de branches:
- `main` → Produção
- `develop` → Desenvolvimento
- `feature/nome-da-feature` → Novos recursos
- `bugfix/nome-do-bug` → Correções de bugs
- `hotfix/nome-do-hotfix` → Correções urgentes em produção
- `release/versao` → Preparação para lançamento

Exemplo de branches:
main (produção)
develop (desenvolvimento)
feature/nome-da-feature (novos recursos)
bugfix/nome-do-bug (correções de bugs)
hotfix/nome-do-hotfix (correções urgentes em produção)
release/versão (preparação para lançamento)

---

## ✅ 2. Commits pequenos e descritivos
- Faça commits pequenos e frequentes, evitando alterações gigantes.
- Cada commit deve conter **apenas uma mudança lógica**.
- Utilize **um padrão consistente** para os commits.

### 📋 Tabela de Emojis para Commits:
| Emoji | Tipo de Commit      | Exemplo |
|--------|------------------|---------|
| 🎉  | Início de um projeto | `🎉 feat: inicia o projeto` |
| ✨  | Nova funcionalidade | `✨ feat: adiciona autenticação JWT` |
| 🐛  | Correção de bug | `🐛 fix: corrige erro de validação no formulário` |
| ♻️  | Refatoração | `♻️ refactor: melhora performance do endpoint` |
| 🔥  | Remoção de código | `🔥 chore: remove código obsoleto` |
| 🚀  | Melhoria de performance | `🚀 perf: otimiza consulta ao banco de dados` |
| 📝  | Documentação | `📝 docs: adiciona instruções ao README` |
| ✅  | Testes | `✅ test: adiciona novos testes unitários` |
| 🎨  | Estilização | `🎨 style: melhora layout do botão` |
| 🚑  | Hotfix | `🚑 hotfix: corrige erro crítico em produção` |
| ⏪  | Reversão de commit | `⏪ revert: reverte commit X` |

---

## ✅ 3. Sempre use branches para novas funcionalidades e correções
- Nunca faça commits diretamente na branch `main` ou `develop`.
- Crie branches específicas para cada tarefa:
  ```sh
  git checkout -b feature/nova-feature
  ```
