
# 🛍️ Thrift Store & Partners Online

> **Plataforma Full-Stack de E-commerce Híbrido (Marketplace de Desapegos + Módulo de Afiliados)** desenvolvida com arquitetura distribuída, microsserviço assíncrono em Go e banco de dados relacional PostgreSQL.

---

## 📌 Sobre o Projeto

O **Thrift Store & Partners Online** é uma solução moderna focada no consumo consciente e na monetização digital. A plataforma permite que usuários e lojas locais anunciem roupas, calçados e utensílios semi-novos, ao mesmo tempo em que atua como uma vitrine de **Marketing de Afiliados** integrada a grandes varejistas (Amazon, Mercado Livre, Magazine Luiza).

### 💡 Modelo de Negócio
1. **Desapegos Locais (Marketplace Direto):** Retenção automática de **3% de comissão** sobre cada venda realizada na plataforma, repassando 97% diretamente ao vendedor via Pix.
2. **Produtos Afiliados (Lojas Parceiras):** Redirecionamento direto do comprador para a loja parceira através de link parametrizado com tag de afiliado.

---

## 🏗️ Arquitetura do Sistema

A aplicação adota uma arquitetura orientada a serviços para garantir escalabilidade, baixa latência e desacoplamento de responsabilidades:

```text
               +----------------------------------+
               |   Frontend (React 19 + Vite)     |
               |      http://localhost:5173       |
               +----------------+-----------------+
                                |
                                v
               +----------------------------------+
               |  Backend API (Node.js + Express) |
               |      http://localhost:3001       |
               +-------+------------------+-------+
                       |                  |
            SQL Query  |                  | HTTP POST (Assíncrono)
                       v                  v
    +----------------------+          +----------------------------------+
    | PostgreSQL Database  |          | Notification Service (Go/Golang) |
    |     (brecho_db)      |          |      http://localhost:5001       |
    +----------------------+          +----------------------------------+



🛠️ Tecnologias Utilizadas
Frontend
React 19 com Vite: Interface reativa, modular e de alto desempenho.

CSS3 Customizado: Layout moderno, responsivo (CSS Grid / Flexbox) e Hero Banner com destaque visual.

Backend Principal (API Marketplace)
Node.js com TypeScript: Tipagem estática e segurança na execução de regras de negócio.

Express.js: Roteamento RESTful para CRUD de produtos, categorias e transações.

PostgreSQL (pg): Persistence layer relacional para consistência ACID em compras e cálculo de comissões.

Microsserviço de Notificações
Go (Golang): Microsserviço de altíssima performance para processamento assíncrono e envio de e-mails/comprovantes de venda utilizando Goroutines e baixo consumo de memória.

📊 Estrutura do Banco de Dados (PostgreSQL)
usuarios: Cadastro de vendedores e compradores.

categorias: Mapeamento e navegação dinâmica por seções do e-commerce.

produtos: Registro de itens do brechó local e links parametrizados de afiliados.

vendas: Histórico financeiro com cálculo e retenção automática dos 3% da plataforma.

🚀 Como Executar o Projeto Localmente
Pré-requisitos
Node.js (v18+)

Go (v1.20+)

PostgreSQL configurado e rodando localmente

1. Configurar o Banco de Dados
No seu terminal PostgreSQL, crie o banco de dados e as tabelas executando o script SQL disponível no projeto:

Bash
sudo -u postgres psql -d brecho_db

2. Executar o Backend (Node.js API)
Bash
cd backend-node
npm install
npm run dev

# Rodando em http://localhost:3001
3. Executar o Microsserviço de Notificação (Go)
Bash
cd notification-service
go run main.go


4. Executar o Frontend (React/Vite)
Bash
cd frontend
npm install
npm run dev


👨‍💻 Autor
Desenvolvido por Honorato — Engenheiro de Software.
EOF



```bash
git add README.md
git commit -m "docs: adiciona documentação técnica detalhada no README"
git push origin main
