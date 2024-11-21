# Suffra Dev

---
## 📋 **Descrição**
Este projeto é uma aplicação mobile para monitorar e gerenciar o consumo de energia em torres de um condomínio, incentivando práticas mais sustentáveis. A aplicação permite o cadastro, autenticação de usuários, gerenciamento de medições e a visualização de dados em tempo real.

---
## Equipe

> *Artur Lopes Fiorindo* » 53481  
> 
> *Eduardo Felipe Nunes Função* » 553362  
> 
> *Jhoe Kochi Hashimoto* » 553831  
>

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React Native com Expo
- **Backend**: Node.js com Express
- **Banco de Dados**: SQLite
- **Gerenciamento de Estado**: Context API
- **Persistência Local**: AsyncStorage
- **Bibliotecas Adicionais**:
  - `native-base` para componentes estilizados
  - `expo-linear-gradient` para efeitos visuais
  - `react-native-picker` para seleção de valores
  - `react-navigation` para navegação entre telas

---

## 📚 Funcionalidades

### Usuário
- Cadastro de novos usuários com validação.
- Login e autenticação com JWT.
- Atualização de perfil (username e email).
- Redefinição de senha via email.
- Logout com remoção do token.

### Medições
- Adicionar novas medições (torre e consumo em kWh).
- Listar medições com ordenação por data.
- Atualizar ou excluir medições existentes.
- Visualizar medições em gráficos e porcentagens.

### Interface
- Layout moderno e responsivo.
- Navegação fluida entre as telas.
- Componentes reutilizáveis, como Header, Footer e Layout.

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js instalado (v14+ recomendado)
- Expo CLI (`npm install -g expo-cli`)
- SQLite disponível no ambiente

### Passo a Passo

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. **Instale as dependências**:
   No diretório do projeto:
   ```bash
   yarn install
   ```

3. **Inicie o backend**:
   No diretório `backend`:
   ```bash
   node server.js
   ```

4. **Inicie o frontend**:
   No diretório principal:
   ```bash
   yarn start
   ```

5. **Teste o aplicativo**:
   - Use o aplicativo Expo Go no seu dispositivo para testar.
   - Escaneie o QR Code gerado no terminal.

---

## 📂 Estrutura do Projeto

```plaintext
.
├── src/
│   ├── components/        # Componentes reutilizáveis (Footer, Header, etc.)
│   ├── hooks/             # Estado global (Context API)
│   ├── navigation/        # Configuração de navegação
│   ├── screens/           # Telas do aplicativo
│   └── assets/            # Imagens e recursos visuais
├── backend/               # Backend Node.js
│   ├── controllers/       # Lógica dos endpoints
│   ├── db/                # Banco de dados SQLite
│   ├── middlewares/       # Middleware para autenticação
│   ├── routes/            # Rotas do backend
│   └── server.js          # Configuração principal do servidor
├── README.md              # Documentação do projeto
└── package.json           # Configurações e dependências do projeto
```

