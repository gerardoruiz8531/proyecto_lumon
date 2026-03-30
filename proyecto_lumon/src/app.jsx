import React, { useState, useEffect } from 'react';
import { LogIn, Trash2, Edit3, LogOut } from 'lucide-react';
import logo from './assets/logo.png';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('inventario');

  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('productos');
    if (stored) return JSON.parse(stored);

    return [
      { id: 1, name: 'Silla Aeron', category: 'Sillas', stock: 12, price: 16499 },
      { id: 2, name: 'Silla Embody', category: 'Sillas', stock: 8, price: 32999 }
    ];
  });

  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loginData, setLoginData] = useState({ user: '', password: '' });

  // 🔹 Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('productos', JSON.stringify(products));
  }, [products]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.user === 'admin' && loginData.password === '1234') {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('Usuario o contraseña incorrectos');
    }
  };

  const saveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const stock = parseInt(formData.get('stock'));
    const price = parseFloat(formData.get('price'));

    if (stock < 0 || price < 0) {
      setMessage('Valores inválidos');
      return;
    }

    const productData = {
      id: currentProduct ? currentProduct.id : Date.now(),
      name: formData.get('name'),
      category: formData.get('category'),
      stock,
      price,
    };

    if (currentProduct) {
      setProducts(products.map(p => p.id === currentProduct.id ? productData : p));
      setMessage('Producto actualizado');
    } else {
      setProducts([...products, productData]);
      setMessage('Producto agregado');
    }

    setView('inventario');
    setCurrentProduct(null);
  };

  const deleteProduct = (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      setProducts(products.filter(p => p.id !== id));
      setMessage('Producto eliminado');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // LOGIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="max-w-sm w-full bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
          
          <div className="flex justify-center mb-6">
            <img src={logo} alt="logo" className="w-16" />
          </div>

          <h1 className="text-white text-xl text-center">Lumon</h1>

          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <input 
              placeholder="Usuario"
              className="w-full p-3 bg-neutral-800 rounded text-white"
              onChange={(e)=>setLoginData({...loginData,user:e.target.value})}
            />
            <input 
              type="password"
              placeholder="Contraseña"
              className="w-full p-3 bg-neutral-800 rounded text-white"
              onChange={(e)=>setLoginData({...loginData,password:e.target.value})}
            />

            {message && <p className="text-red-400 text-sm">{message}</p>}

            <button className="w-full bg-white text-black py-3 rounded flex justify-center gap-2">
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
      <aside className="w-52 bg-neutral-900 p-6 flex flex-col">
        <img src={logo} alt="logo" className="w-10 mx-auto mb-6" />

        <button onClick={()=>{setView('inventario'); setCurrentProduct(null)}} className="mb-2">
          Inventario
        </button>

        <button onClick={()=>{setView('agregar'); setCurrentProduct(null)}} className="mb-2">
          Agregar
        </button>

        <button onClick={()=>setIsAuthenticated(false)} className="mt-auto text-red-400">
          <LogOut size={14}/> Salir
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">

        {/* BUSCADOR */}
        <input
          placeholder="Buscar producto..."
          className="mb-4 p-2 w-full bg-neutral-800 rounded"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        {/* MENSAJE */}
        {message && (
          <div className="mb-4 p-2 bg-green-700 rounded text-center">
            {message}
          </div>
        )}

        {/* TABLA */}
        {view === 'inventario' && (
          <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
            <table className="w-full text-sm">
              <thead className="bg-neutral-800 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 text-left">Producto</th>
                  <th className="px-4 py-3 text-left">Categoría</th>
                  <th className="px-4 py-3 text-center w-24">Stock</th>
                  <th className="px-4 py-3 text-right w-32">Precio</th>
                  <th className="px-4 py-3 text-right w-24">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id} className="border-t border-neutral-800">
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3 text-neutral-400">{p.category}</td>
                    <td className="px-4 py-3 text-center">{p.stock}</td>
                    <td className="px-4 py-3 text-right">${p.price}</td>
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

        {/* FORMULARIO */}
        {(view === 'agregar' || view === 'editar') && (
          <form onSubmit={saveProduct} className="space-y-4">

            <input 
              name="name" 
              defaultValue={currentProduct?.name} 
              placeholder="Nombre" 
              required 
              className="w-full p-2 bg-neutral-800"
            />

            <input 
              name="category" 
              defaultValue={currentProduct?.category} 
              placeholder="Categoría" 
              required 
              className="w-full p-2 bg-neutral-800"
            />

            <input 
              name="stock" 
              type="number" 
              defaultValue={currentProduct?.stock} 
              placeholder="Stock" 
              required 
              className="w-full p-2 bg-neutral-800"
            />

            <input 
              name="price" 
              type="number" 
              defaultValue={currentProduct?.price} 
              placeholder="Precio" 
              required 
              className="w-full p-2 bg-neutral-800"
            />

            <button className="bg-white text-black px-4 py-2 rounded">
              {currentProduct ? "Actualizar" : "Guardar"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}