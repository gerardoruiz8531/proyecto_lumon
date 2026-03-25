import React, { useState } from 'react';
import { 
  Package, 
  LogIn, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  LogOut,
  ClipboardList
} from 'lucide-react';

import logo from './assets/logo.png';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('inventory');
  const [products, setProducts] = useState([
    { id: 1, name: 'Papel Bond A4', category: 'Papelería', stock: 150, price: 5.50 },
    { id: 2, name: 'Silla Ergonómica', category: 'Mobiliario', stock: 12, price: 1200.00 },
    { id: 3, name: 'Bolígrafos Negros (12pk)', category: 'Papelería', stock: 45, price: 12.00 },
  ]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loginData, setLoginData] = useState({ user: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.user === 'admin' && loginData.password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Credenciales inválidas');
    }
  };

  const saveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      id: currentProduct ? currentProduct.id : Date.now(),
      name: formData.get('name'),
      category: formData.get('category'),
      stock: parseInt(formData.get('stock')),
      price: parseFloat(formData.get('price')),
    };

    if (currentProduct) {
      setProducts(products.map(p => p.id === currentProduct.id ? productData : p));
    } else {
      setProducts([...products, productData]);
    }

    setView('inventory');
    setCurrentProduct(null);
  };

  const deleteProduct = (id) => {
    if (window.confirm('¿Desea eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // LOGIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          
          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Lumon" className="w-24" />
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">Lumon</h1>
          <p className="text-slate-400 text-center mb-8">Gestión de Inventario</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              placeholder="Usuario"
              className="w-full px-4 py-2 rounded-lg"
              onChange={(e)=>setLoginData({...loginData,user:e.target.value})}
            />
            <input 
              type="password" 
              placeholder="Contraseña"
              className="w-full px-4 py-2 rounded-lg"
              onChange={(e)=>setLoginData({...loginData,password:e.target.value})}
            />
            <button className="w-full bg-lime-400 py-2 rounded-lg">
              <LogIn size={18}/> Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        
        {/* LOGO */}
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="Lumon" className="w-16 mb-2" />
          <span className="text-xl font-bold">LUMON</span>
        </div>

        <button onClick={()=>setView('inventory')} className="mb-2">Inventario</button>
        <button onClick={()=>setView('add')} className="mb-2">Agregar</button>

        <button onClick={()=>setIsAuthenticated(false)} className="mt-auto text-red-400">
          <LogOut size={18}/> Salir
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Inventario</h2>

        {view === 'inventory' && (
          <table className="w-full border">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td className={p.stock < 20 ? 'text-red-500' : ''}>{p.stock}</td>
                  <td>${p.price}</td>
                  <td>
                    <button onClick={()=>{setCurrentProduct(p); setView('edit')}}>
                      <Edit3 size={16}/>
                    </button>
                    <button onClick={()=>deleteProduct(p.id)}>
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {(view === 'add' || view === 'edit') && (
          <form onSubmit={saveProduct} className="space-y-2">
            <input name="name" defaultValue={currentProduct?.name} placeholder="Nombre" required />
            <input name="category" defaultValue={currentProduct?.category} placeholder="Categoría" required />
            <input name="stock" type="number" defaultValue={currentProduct?.stock} required />
            <input name="price" type="number" step="0.01" defaultValue={currentProduct?.price} required />

            <button className="bg-lime-400 px-4 py-2 rounded">Guardar</button>
          </form>
        )}

        {/* FOOTER */}
        <footer className="mt-10 text-center text-slate-400 text-sm">
          Desarrollado por Gerardo Ruiz
        </footer>
      </main>
    </div>
  );
}
