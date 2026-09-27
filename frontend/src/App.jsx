import React, { useState, useEffect } from 'react';
import './App.css';

const IMAGEM_HERO = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&auto=format&fit=crop&q=80';
const IMAGEM_PADRAO = 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500';

export default function App() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todas');
  
  // Modais
  const [modalLojaAberto, setModalLojaAberto] = useState(false);
  const [modalDesapegoAberto, setModalDesapegoAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Form de Desapego
  const [novoDesapego, setNovoDesapego] = useState({
    titulo: '',
    preco: '',
    categoria_id: '1',
    condicao: 'Usado - Excelente',
    imagem_url: '',
    descricao: ''
  });

  const carregarProdutos = () => {
    setCarregando(true);
    const url = categoriaAtiva === 'todas'
      ? 'http://localhost:3001/api/produtos'
      : `http://localhost:3001/api/produtos?categoria=${categoriaAtiva}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProdutos(data);
        setCarregando(false);
      })
      .catch(err => {
        console.error('Erro ao buscar produtos:', err);
        setCarregando(false);
      });
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/categorias')
      .then(res => res.json())
      .then(data => Array.isArray(data) && setCategorias(data))
      .catch(err => console.error('Erro ao buscar categorias:', err));
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [categoriaAtiva]);

  // Enviar novo desapego para o backend
  const handleEnviarDesapego = (e) => {
    e.preventDefault();
    
    fetch('http://localhost:3001/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoDesapego)
    })
      .then(res => res.json())
      .then(data => {
        alert('🎉 Seu desapego foi anunciado com sucesso e já está na vitrine!');
        setModalDesapegoAberto(false);
        setNovoDesapego({
          titulo: '',
          preco: '',
          categoria_id: '1',
          condicao: 'Usado - Excelente',
          imagem_url: '',
          descricao: ''
        });
        carregarProdutos(); // Recarrega os produtos para exibir o novo item cadastrado
      })
      .catch(err => {
        console.error('Erro ao cadastrar desapego:', err);
        alert('Erro ao cadastrar desapego. Verifique o servidor.');
      });
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>🛍️ Thrift Store <span>& Partners Online</span></h1>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="🔍 Buscar peças únicas ou produtos parceiros..." />
        </div>

        <div className="user-actions">
          <button className="btn-loja" onClick={() => setModalLojaAberto(true)}>
            🏪 Cadastrar Minha Loja
          </button>
          <button className="btn-vender" onClick={() => setModalDesapegoAberto(true)}>
            ➕ Anunciar Desapego
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="hero-banner">
        <img src={IMAGEM_HERO} alt="Thrift Store & Partners Online" className="hero-bg" />
        <div className="hero-overlay">
          <h2>Moda Consciente & Melhores Achadinhos</h2>
          <p>Garimpe peças vintage exclusivas de brechós parceiros ou confira as principais ofertas da Amazon, Magalu e Mercado Livre.</p>
          <div className="hero-badge">
            ⚡ Taxa de apenas 3% para vendedores locais | Links de parceiros oficiais
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className="vitrine-container">
        <section className="secoes-navigation">
          <h2>Seções & Categorias</h2>
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

        {carregando ? (
          <p style={{ textAlign: 'center', margin: '3rem', fontSize: '1.1rem', color: '#1d3557' }}>
            ⏳ Carregando produtos...
          </p>
        ) : produtos.length === 0 ? (
          <p style={{ textAlign: 'center', margin: '3rem', color: '#6c757d' }}>
            Nenhum produto encontrado nesta seção no momento.
          </p>
        ) : (
          <section className="produtos-grid">
            {produtos.map(produto => {
              const precoFormatado = produto.preco ? Number(produto.preco).toFixed(2) : '0.00';
              const ehAfiliado = Boolean(produto.link_afiliado);

              return (
                <div key={produto.id} className="card-produto">
                  <div className={`badge-condicao ${ehAfiliado ? 'badge-afiliado' : ''}`}>
                    {ehAfiliado ? '🛒 Loja Parceira' : produto.condicao}
                  </div>
                  
                  <img 
                    src={produto.imagem_url || IMAGEM_PADRAO} 
                    alt={produto.titulo} 
                    onError={(e) => { e.target.src = IMAGEM_PADRAO; }} 
                  />
                  
                  <div className="card-conteudo">
                    <span className="categoria-label">{produto.categoria_nome}</span>
                    <h3>{produto.titulo}</h3>
                    <p className="vendedor">
                      {ehAfiliado ? 'Link de Afiliado' : `Vendido por: ${produto.vendedor}`}
                    </p>
                    
                    <div className="card-rodape">
                      <span className="preco">R$ {precoFormatado}</span>
                      
                      {ehAfiliado ? (
                        <a 
                          href={produto.link_afiliado} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-comprar btn-afiliado"
                        >
                          Ver na Loja ↗
                        </a>
                      ) : (
                        <button className="btn-comprar">Comprar</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>

      {/* Modal 1: Cadastrar Loja */}
      {modalLojaAberto && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <h3>🏪 Cadastrar Sua Loja no Thrift Store</h3>
            <p>Venda seus produtos para milhares de clientes com repasse automático de 97% das vendas!</p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Loja cadastrada com sucesso!'); setModalLojaAberto(false); }}>
              <label>Nome da Loja:</label>
              <input type="text" placeholder="Ex: Brechó Chic Vintage" required />

              <label>Chave Pix para Recebimento (97% do valor):</label>
              <input type="text" placeholder="E-mail, CPF ou Telefone" required />

              <label>Descrição da Loja:</label>
              <textarea placeholder="Conte um pouco sobre os itens que você vende..."></textarea>

              <div className="modal-acoes">
                <button type="submit" className="btn-salvar">Criar Minha Loja</button>
                <button type="button" className="btn-fechar" onClick={() => setModalLojaAberto(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Anunciar Desapego (NOVO) */}
      {modalDesapegoAberto && (
        <div className="modal-overlay">
          <div className="modal-conteudo">
            <h3>➕ Anunciar Novo Desapego</h3>
            <p>Cadastre sua peça usada ou semi-nova. Cobramos apenas 3% de comissão na venda!</p>
            
            <form onSubmit={handleEnviarDesapego}>
              <label>Título do Item:</label>
              <input 
                type="text" 
                placeholder="Ex: Vestido Floral Anos 90" 
                value={novoDesapego.titulo}
                onChange={e => setNovoDesapego({...novoDesapego, titulo: e.target.value})}
                required 
              />

              <label>Preço (R$):</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="Ex: 89.90" 
                value={novoDesapego.preco}
                onChange={e => setNovoDesapego({...novoDesapego, preco: e.target.value})}
                required 
              />

              <label>Seção/Categoria:</label>
              <select 
                value={novoDesapego.categoria_id}
                onChange={e => setNovoDesapego({...novoDesapego, categoria_id: e.target.value})}
              >
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>

              <label>Estado de Conservação:</label>
              <select 
                value={novoDesapego.condicao}
                onChange={e => setNovoDesapego({...novoDesapego, condicao: e.target.value})}
              >
                <option value="Usado - Excelente">Usado - Excelente</option>
                <option value="Usado - Bom estado">Usado - Bom estado</option>
                <option value="Seminovo (Pouco uso)">Seminovo (Pouco uso)</option>
              </select>

              <label>URL da Foto (Link da Imagem):</label>
              <input 
                type="url" 
                placeholder="https://exemplo.com/foto.jpg (opcional)" 
                value={novoDesapego.imagem_url}
                onChange={e => setNovoDesapego({...novoDesapego, imagem_url: e.target.value})}
              />

              <label>Descrição detalhada:</label>
              <textarea 
                placeholder="Informe tamanho, cor, marca e detalhes do desapego..."
                value={novoDesapego.descricao}
                onChange={e => setNovoDesapego({...novoDesapego, descricao: e.target.value})}
              ></textarea>

              <div className="modal-acoes">
                <button type="submit" className="btn-salvar">Publicar Anúncio</button>
                <button type="button" className="btn-fechar" onClick={() => setModalDesapegoAberto(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}