cat << 'EOF' > ~/meubrecho/README.md
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