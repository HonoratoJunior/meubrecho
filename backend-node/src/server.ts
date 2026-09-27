import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database';
import { VendaService } from './VendaService';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rota 1: Listar Categorias
app.get('/api/categorias', async (req: Request, res: Response) => {
  try {
    const resultado = await db.query('SELECT id, nome, slug, descricao FROM categorias ORDER BY id ASC');
    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar categorias:', erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// Rota 2: Listar Produtos (Brechó + Afiliados)
app.get('/api/produtos', async (req: Request, res: Response) => {
  const { categoria } = req.query;

  try {
    let query = `
      SELECT 
        p.id,
        p.titulo,
        p.descricao,
        p.preco,
        p.condicao,
        p.imagem_url,
        p.link_afiliado,
        p.status,
        c.nome AS categoria_nome,
        c.slug AS categoria_slug,
        u.nome AS vendedor
      FROM produtos p
      JOIN categorias c ON p.categoria_id = c.id
      JOIN usuarios u ON p.vendedor_id = u.id
      WHERE p.status = 'disponivel'
    `;

    const params: any[] = [];

    if (categoria && categoria !== 'todas') {
      query += ` AND c.slug = $1`;
      params.push(categoria);
    }

    query += ` ORDER BY p.criado_em DESC;`;

    const resultado = await db.query(query, params);
    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Node.js + TypeScript rodando em http://localhost:${PORT}`);
});

// Rota para cadastrar um novo desapego
app.post('/api/produtos', async (req: Request, res: Response) => {
  const { titulo, descricao, preco, condicao, categoria_id, imagem_url } = req.body;

  try {
    // Usando o vendedor_id = 1 (Ana Silva) como vendedor padrão de testes
    const query = `
      INSERT INTO produtos (vendedor_id, categoria_id, titulo, descricao, preco, condicao, imagem_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'disponivel')
      RETURNING *;
    `;
    const params = [
      1, 
      categoria_id || 1, 
      titulo, 
      descricao || '', 
      preco, 
      condicao || 'Usado - Bom estado', 
      imagem_url || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500'
    ];

    const resultado = await db.query(query, params);
    res.status(201).json({ mensagem: 'Desapego anunciado com sucesso!', produto: resultado.rows[0] });
  } catch (erro) {
    console.error('Erro ao anunciar produto:', erro);
    res.status(500).json({ erro: 'Erro ao cadastrar desapego' });
  }
});

// Rota de Venda com retenção dos 3% e integração com o Microsserviço Go
app.post('/api/vendas', async (req: Request, res: Response) => {
  const { produtoId, compradorId } = req.body;

  try {
    const produtoRes = await db.query(
      `SELECT p.*, u.email as email_vendedor 
       FROM produtos p 
       JOIN usuarios u ON p.vendedor_id = u.id 
       WHERE p.id = $1 AND p.status = $2`, 
      [produtoId, 'disponivel']
    );

    if (produtoRes.rows.length === 0) {
      return res.status(404).json({ erro: 'Produto indisponível ou não encontrado' });
    }

    const produto = produtoRes.rows[0];
    const calculo = VendaService.calcularComissao(Number(produto.preco));

    const vendaRes = await db.query(
      `INSERT INTO vendas (produto_id, comprador_id, vendedor_id, valor_total, taxa_plataforma, valor_vendedor, status_pagamento)
       VALUES ($1, $2, $3, $4, $5, $6, 'pago') RETURNING *`,
      [produto.id, compradorId || 2, produto.vendedor_id, calculo.valorTotal, calculo.taxaPlataforma, calculo.valorVendedor]
    );

    await db.query('UPDATE produtos SET status = $1 WHERE id = $2', ['vendido', produto.id]);

    const vendaCadastrada = vendaRes.rows[0];

    // Disparo assíncrono para o microsserviço Go (porta 5001)
    fetch('http://localhost:5001/api/vendas/notificar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendaId: vendaCadastrada.id,
        produtoTitulo: produto.titulo,
        valorTotal: calculo.valorTotal,
        valorVendedor: calculo.valorVendedor,
        taxaPlataforma: calculo.taxaPlataforma,
        emailVendedor: produto.email_vendedor || 'vendedor@email.com'
      })
    }).catch(err => console.error('Erro ao notificar microsserviço Go:', err.message));

    res.status(201).json({
      mensagem: 'Venda realizada com sucesso!',
      venda: vendaCadastrada,
      comissao_plataforma: calculo.taxaPlataforma
    });
  } catch (erro) {
    console.error('Erro ao processar venda:', erro);
    res.status(500).json({ erro: 'Erro ao processar venda' });
  }
});