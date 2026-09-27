import React, { useState } from 'react';
import { Header } from './components/Header';
import { Vitrine } from './components/Vitrine';
import './App.css';

// Dados simulados baseados no banco de dados PostgreSQL que criamos
const CATEGORIAS_MOCK = [
  { id: 1, nome: 'Roupas Femininas', slug: 'roupas-femininas' },
  { id: 2, nome: 'Roupas Masculinas', slug: 'roupas-masculinas' },
  { id: 3, nome: 'Calçados', slug: 'calcados' },
  { id: 4, nome: 'Acessórios', slug: 'acessorios' },
  { id: 5, nome: 'Infantil', slug: 'infantil' },
];

const PRODUTOS_MOCK = [
  {
    id: 1,
    titulo: 'Jaqueta Jeans Vintage Oversized',
    categoria_slug: 'roupas-femininas',
    categoria_nome: 'Roupas Femininas',
    preco: 120.00,
    condicao: 'Usado - Excelente',
    vendedor: 'Ana Silva',
    imagem_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400'
  },
  {
    id: 2,
    titulo: 'Bolsa de Couro Marrom',
    categoria_slug: 'acessorios',
    categoria_nome: 'Acessórios',
    preco: 85.50,
    condicao: 'Usado - Bom estado',
    vendedor: 'Ana Silva',
    imagem_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400'
  },
  {
    id: 3,
    titulo: 'Tênis Nike Air Force 1 Retro',
    categoria_slug: 'calcados',
    categoria_nome: 'Calçados',
    preco: 250.00,
    condicao: 'Usado - Pouco uso',
    vendedor: 'Carlos Eduardo',
    imagem_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'
  },
  {
    id: 4,
    titulo: 'Camisa Xadrez Flanela',
    categoria_slug: 'roupas-masculinas',
    categoria_nome: 'Roupas Masculinas',
    preco: 60.00,
    condicao: 'Usado - Excelente',
    vendedor: 'Carlos Eduardo',
    imagem_url: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400'
  },
  {
    id: 5,
    titulo: 'Vestido Floral de Verão',
    categoria_slug: 'roupas-femininas',
    categoria_nome: 'Roupas Femininas',
    preco: 45.00,
    condicao: 'Novo com etiqueta',
    vendedor: 'Mariana Costa',
    imagem_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'
  }
];

export default function App() {
  return (
    <div className="app-container">
      <Header />
      <Vitrine categorias={CATEGORIAS_MOCK} produtos={PRODUTOS_MOCK} />
    </div>
  );
}