import React from 'react';
import { ShoppingBag, Search, PlusCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="header">
      <div className="logo">
        <ShoppingBag size={28} color="#e63946" />
        <h1>Brechó<span>Online</span></h1>
      </div>

      <div className="search-bar">
        <Search size={18} />
        <input type="text" placeholder="Buscar roupas, sapatos, acessórios..." />
      </div>

      <div className="user-actions">
        <button className="btn-vender">
          <PlusCircle size={18} />
          Anunciar Desapego
        </button>
      </div>
    </header>
  );
}