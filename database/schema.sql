-- ============================================================
-- SCRIPT DE BANCO DE DADOS: BRECHÓ ONLINE (MARKETPLACE)
-- SGBD: PostgreSQL
-- ============================================================

-- Limpeza preventiva de tabelas caso já existam (ordem inversa das dependências)
DROP TABLE IF EXISTS vendas CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- ------------------------------------------------------------
-- 1. TABELA DE USUÁRIOS (Compradores e Vendedores)
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    chave_pix VARCHAR(100), -- Para repasse dos 97% das vendas
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. TABELA DE CATEGORIAS / SEÇÕES DO BRECHÓ
-- ------------------------------------------------------------
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL, -- Para URLs amigáveis (ex: /secao/roupas-masculinas)
    descricao TEXT
);

-- ------------------------------------------------------------
-- 3. TABELA DE PRODUTOS (Anúncios do Brechó)
-- ------------------------------------------------------------
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    vendedor_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria_id INT NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL CHECK (preco > 0),
    condicao VARCHAR(30) DEFAULT 'Usado - Bom estado', -- ex: 'Novo com etiqueta', 'Usado - Marcas de uso'
    tamanho VARCHAR(20), -- ex: 'P', 'M', 'G', '38', '42'
    imagem_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'vendido')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 4. TABELA DE VENDAS E DIVISÃO DE COMISSÃO (3% PLATAFORMA / 97% VENDEDOR)
-- ------------------------------------------------------------
CREATE TABLE vendas (
    id SERIAL PRIMARY KEY,
    produto_id INT UNIQUE NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    comprador_id INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    vendedor_id INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    valor_total DECIMAL(10, 2) NOT NULL CHECK (valor_total > 0),
    taxa_plataforma DECIMAL(10, 2) NOT NULL, -- 3%
    valor_vendedor DECIMAL(10, 2) NOT NULL,  -- 97%
    status_pagamento VARCHAR(30) DEFAULT 'pago' CHECK (status_pagamento IN ('pendente', 'pago', 'repassado_ao_vendedor')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_comprador_diferente_vendedor CHECK (comprador_id <> vendedor_id)
);

-- Índices para otimizar buscas frequentes
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_vendedor ON produtos(vendedor_id);
CREATE INDEX idx_produtos_status ON produtos(status);

-- ============================================================
-- INSERÇÃO DE DADOS DE TESTE (MOCK DATA)
-- ============================================================

-- 1. Inserir Usuários (Compradores e Vendedores)
INSERT INTO usuarios (nome, email, senha_hash, telefone, chave_pix) VALUES
('Ana Silva', 'ana.silva@email.com', '$2b$10$e8T73f1...hash_simulado_1', '(21) 99999-1111', 'ana.silva@email.com'),
('Carlos Eduardo', 'carlos.eduardo@email.com', '$2b$10$e8T73f1...hash_simulado_2', '(21) 98888-2222', '21988882222'),
('Mariana Costa', 'mariana.costa@email.com', '$2b$10$e8T73f1...hash_simulado_3', '(21) 97777-3333', 'mariana.costa@email.com');

-- 2. Inserir Categorias/Seções do Brechó
INSERT INTO categorias (nome, slug, descricao) VALUES
('Roupas Femininas', 'roupas-femininas', 'Vestidos, blusas, saias e casacos'),
('Roupas Masculinas', 'roupas-masculinas', 'Camisas, camisetas, calças e bermudas'),
('Calçados', 'calcados', 'Tênis, sapatos, sandálias e botas'),
('Acessórios', 'acessorios', 'Bolsas, cintos, relógios e óculos de sol'),
('Infantil', 'infantil', 'Roupas e calçados para crianças e bebês');

-- 3. Inserir Produtos para Venda
INSERT INTO produtos (vendedor_id, categoria_id, titulo, descricao, preco, condicao, tamanho, imagem_url, status) VALUES
(1, 1, 'Jaqueta Jeans Vintage Oversized', 'Jaqueta jeans anos 90 em excelente estado, sem marcas de uso.', 120.00, 'Usado - Excelente', 'G', 'https://via.placeholder.com/400x400.png?text=Jaqueta+Jeans', 'disponivel'),
(1, 4, 'Bolsa de Couro Marrom', 'Bolsa transversal em couro legítimo com pequenos detalhes de uso.', 85.50, 'Usado - Bom estado', 'Único', 'https://via.placeholder.com/400x400.png?text=Bolsa+Couro', 'disponivel'),
(2, 3, 'Tênis Nike Air Force 1 Retro', 'Tênis clássico, higienizado e conservado.', 250.00, 'Usado - Pouco uso', '41', 'https://via.placeholder.com/400x400.png?text=Tenis+Nike', 'vendido'),
(2, 2, 'Camisa Xadrez Flanela', 'Camisa xadrez perfeita para dias frios, 100% algodão.', 60.00, 'Usado - Excelente', 'M', 'https://via.placeholder.com/400x400.png?text=Camisa+Xadrez', 'disponivel'),
(3, 1, 'Vestido Floral de Verão', 'Vestido leve, estampado, ideal para dias quentes.', 45.00, 'Novo com etiqueta', 'P', 'https://via.placeholder.com/400x400.png?text=Vestido+Floral', 'disponivel');

-- 4. Inserir Transação de Teste (Venda concluída com cálculo de 3% de taxa)
-- Produto ID 3 (Tênis Nike R$ 250,00) vendido por Carlos (ID 2) para Ana (ID 1)
-- Taxa 3%: R$ 7,50 | Valor Líquido Vendedor (97%): R$ 242,50
INSERT INTO vendas (produto_id, comprador_id, vendedor_id, valor_total, taxa_plataforma, valor_vendedor, status_pagamento) VALUES
(3, 1, 2, 250.00, 7.50, 242.50, 'pago');

-- ------------------------------------------------------------
-- TABELA DE LOJAS (Para usuários que cadastrarem suas lojas no brechó)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lojas (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_loja VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    cnpj_cpf VARCHAR(20),
    chave_pix_loja VARCHAR(100) NOT NULL, -- Onde o lojista receberá os 97% das vendas
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir as novas categorias no banco
INSERT INTO categorias (nome, slug, descricao) VALUES
('Cama, Mesa e Banho', 'cama-mesa-banho', 'Edredons, lençóis, toalhas e panos de prato'),
('Eletrodomésticos', 'eletrodomesticos', 'Batedeiras, liquidificadores, micro-ondas e cafeteiras')
ON CONFLICT (nome) DO NOTHING;