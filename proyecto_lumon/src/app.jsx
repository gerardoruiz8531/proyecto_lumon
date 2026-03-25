import React, { useState } from 'react';
import { LogIn, Trash2, Edit3, LogOut } from 'lucide-react';
import logo from './assets/logo.png';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('inventario');
  const [products, setProducts] = useState([
    { id: 1, name: 'Silla Aeron', category: 'Asientos', stock: 12, price: 28999 },
    { id: 2, name: 'Silla Embody', category: 'Asientos', stock: 8, price: 32999 },
    { id: 3, name: 'Sillón Eames Lounge', category: 'Lounge', stock: 4, price: 85999 },
    { id: 4, name: 'Banco Nelson', category: 'Mobiliario', stock: 6, price: 15999 },
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

    setView('inventario');
    setCurrentProduct(null);
  };

  const deleteProduct = (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // LOGIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="max-w-sm w-full bg-neutral-900/80 backdrop-blur-md rounded-2xl p-10 border border-neutral-800 shadow-lg">
          
          <div className="flex justify-center mb-8">
            <img 
  src={logo} 
  alt="Lumon" 
  className="w-18 opacity-80 mb-2" 
/>
          </div>

          <h1 className="text-2xl font-medium text-white text-center tracking-wide">
            Lumon
          </h1>
          <p className="text-neutral-500 text-center text-sm mb-8">
            Sistema de Inventario
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              placeholder="Usuario"
              className="w-full bg-neutral-800/70 border border-neutral-700 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/30 transition"
              onChange={(e)=>setLoginData({...loginData,user:e.target.value})}
            />
            <input 
              type="password"
              placeholder="Contraseña"
              className="w-full bg-neutral-800/70 border border-neutral-700 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/30 transition"
              onChange={(e)=>setLoginData({...loginData,password:e.target.value})}
            />

            <button className="w-full bg-white text-black py-3 rounded-lg hover:bg-neutral-200 transition font-medium flex items-center justify-center gap-2">
              <LogIn size={16}/> Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-neutral-950 text-white">
      
      {/* SIDEBAR */}
      <aside className="w-52 bg-neutral-900 p-6 flex flex-col border-r border-neutral-800">
        
        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="Lumon" className="w-16 opacity-50 mb-3" />
          <span className="text-xs tracking-widest text-neutral-500">LUMON</span>
        </div>

        <button onClick={()=>setView('inventario')} className="mb-2 text-neutral-400 hover:text-white text-sm">
          Inventario
        </button>

        <button onClick={()=>setView('agregar')} className="mb-2 text-neutral-400 hover:text-white text-sm">
          Agregar
        </button>

        <button onClick={()=>setIsAuthenticated(false)} className="mt-auto text-red-400 text-sm flex items-center gap-1">
          <LogOut size={14}/> Salir
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10">
        <h2 className="text-lg font-medium mb-6 text-neutral-300">
          Inventario de Productos
        </h2>

        {view === 'inventario' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-800 text-neutral-500">
                <tr>
                  <th className="px-4 py-3 text-left">Producto</th>
                  <th className="px-4 py-3 text-left">Categoría</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-t border-neutral-800">
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3 text-neutral-500">{p.category}</td>
                    <td className={`px-4 py-3 text-center ${p.stock < 5 ? 'text-red-400' : ''}`}>
                      {p.stock}
                    </td>
                    <td className="px-4 py-3">${p.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={()=>{setCurrentProduct(p); setView('editar')}}>
                        <Edit3 size={14}/>
                      </button>
                      <button onClick={()=>deleteProduct(p.id)}>
                        <Trash2 size={14}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(view === 'agregar' || view === 'editar') && (
          <form onSubmit={saveProduct} className="space-y-4 max-w-md">
            <input name="name" defaultValue={currentProduct?.name} placeholder="Nombre del producto" required className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg"/>
            <input name="category" defaultValue={currentProduct?.category} placeholder="Categoría" required className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg"/>
            <input name="stock" type="number" defaultValue={currentProduct?.stock} placeholder="Stock" required className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg"/>
            <input name="price" type="number" step="0.01" defaultValue={currentProduct?.price} placeholder="Precio" required className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg"/>

            <button className="bg-white text-black px-4 py-2 rounded-lg">
              Guardar
            </button>
          </form>
        )}

        <footer className="mt-12 text-center text-neutral-500 text-xs">
          Diseñado y desarrollado por Gerardo Ruiz
        </footer>
      </main>
    </div>
  );
}