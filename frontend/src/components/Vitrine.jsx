import React, { useState } from 'react';

export function Vitrine({ categorias, produtos }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');

  // Filtra os produtos com base na seção selecionada
  const produtosExibidos = categoriaAtiva === 'todas'
    ? produtos
    : produtos.filter(p => p.categoria_slug === categoriaAtiva);

  return (
    <main className="vitrine-container">
      {/* Navegação por Seções/Categorias */}
      <section className="secoes-navigation">
        <h2>Seções do Brechó</h2>
        <div className="botoes-secoes">
          <button 
            className={categoriaAtiva === 'todas' ? 'ativo' : ''}
            onClick={() => setCategoriaAtiva('todas')}
          >
            Todas as Seções
          </button>
          
          {categorias.map(cat => (
            <button
              key={cat.id}
              className={categoriaAtiva === cat.slug ? 'ativo' : ''}
              onClick={() => setCategoriaAtiva(cat.slug)}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </section>

      {/* Grid de Exibição dos Produtos */}
      <section className="produtos-grid">
        {produtosExibidos.map(produto => (
          <div key={produto.id} className="card-produto">
            <div className="badge-condicao">{produto.condicao}</div>
            <img src={produto.imagem_url} alt={produto.titulo} />
            <div className="card-conteudo">
              <span className="categoria-label">{produto.categoria_nome}</span>
              <h3>{produto.titulo}</h3>
              <p className="vendedor">Vendido por: <strong>{produto.vendedor}</strong></p>
              <div className="card-rodape">
                <span className="preco">R$ {produto.preco.toFixed(2)}</span>
                <button className="btn-comprar">Comprar</button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}