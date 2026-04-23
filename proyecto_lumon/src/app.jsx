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
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loginData, setLoginData] = useState({ user: '', password: '' });
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  useEffect(() => {
    localStorage.setItem('productos', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved === 'true') setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('auth', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.user === 'admin' && loginData.password === '1234') {
      setIsAuthenticated(true);
      showToast('Sesión iniciada');
    } else {
      showToast('Credenciales incorrectas');
    }
  };

  const saveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const name = formData.get('name');
    const category = formData.get('category');
    const stock = parseInt(formData.get('stock'));
    const price = parseFloat(formData.get('price'));

    if (!name || !category) {
      showToast('Todos los campos son obligatorios');
      return;
    }

    if (stock < 0 || price < 0) {
      showToast('Valores inválidos');
      return;
    }

    const productData = {
      id: currentProduct ? currentProduct.id : Date.now(),
      name,
      category,
      stock,
      price,
    };

    if (currentProduct) {
      setProducts(products.map(p => p.id === currentProduct.id ? productData : p));
      showToast('Producto actualizado');
    } else {
      setProducts([...products, productData]);
      showToast('Producto agregado');
    }

    setView('inventario');
    setCurrentProduct(null);
  };

  const deleteProduct = (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      setProducts(products.filter(p => p.id !== id));
      showToast('Producto eliminado');
    }
  };

  const resetProducts = () => {
    localStorage.removeItem('productos');
    window.location.reload();
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
              className="w-full p-3 bg-neutral-800 rounded text-white focus:ring-1 focus:ring-white/30"
              onChange={(e)=>setLoginData({...loginData,user:e.target.value})}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-3 bg-neutral-800 rounded text-white focus:ring-1 focus:ring-white/30"
              onChange={(e)=>setLoginData({...loginData,password:e.target.value})}
            />

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

      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}

      <aside className="w-52 bg-neutral-900 p-6 flex flex-col">
        <img src={logo} alt="logo" className="w-10 mx-auto mb-6" />

        <button 
          onClick={()=>{setView('inventario'); setCurrentProduct(null)}}
          className={`mb-2 px-3 py-2 rounded transition ${
            view === 'inventario'
              ? 'bg-white text-black font-semibold'
              : 'hover:bg-neutral-800'
          }`}
        >
          Inventario
        </button>

        <button 
  onClick={()=>{setView('agregar'); setCurrentProduct(null)}}
  className={`mb-2 px-3 py-2 rounded transition-all duration-200 transform ${
    view === 'agregar'
      ? 'bg-white text-black font-semibold scale-105 shadow-md'
      : 'hover:bg-neutral-800 hover:scale-105'
  }`}
>
  + Agregar
</button>

        <button onClick={resetProducts} className="mt-4 text-yellow-400">
          Reset inventario
        </button>

        <button onClick={()=>setIsAuthenticated(false)} className="mt-auto text-red-400">
          <LogOut size={14}/> Salir
        </button>
      </aside>

      <main className="flex-1 p-8">

        <input
          placeholder="Buscar producto..."
          className="mb-4 p-2 w-full bg-neutral-800 rounded"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <p className="text-sm text-neutral-400 mb-2">
          Total: {filteredProducts.length} productos
        </p>

        {view === 'inventario' && (
          <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
            <table className="w-full text-sm">
              <thead className="bg-neutral-800 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 text-left">Producto</th>
                  <th className="px-4 py-3 text-left">Categoría</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3 text-right">Precio</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id} className="border-t border-neutral-800 hover:bg-neutral-800 transition">
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.category}</td>
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

        {(view === 'agregar' || view === 'editar') && (
          <form onSubmit={saveProduct} className="space-y-4">

            <input name="name" defaultValue={currentProduct?.name} placeholder="Nombre" required className="w-full p-2 bg-neutral-800"/>
            <input name="category" defaultValue={currentProduct?.category} placeholder="Categoría" required className="w-full p-2 bg-neutral-800"/>
            <input name="stock" type="number" defaultValue={currentProduct?.stock} placeholder="Stock" required className="w-full p-2 bg-neutral-800"/>
            <input name="price" type="number" defaultValue={currentProduct?.price} placeholder="Precio" required className="w-full p-2 bg-neutral-800"/>

            <div className="flex gap-2">
              <button className="bg-white text-black px-4 py-2 rounded">
                {currentProduct ? "Actualizar" : "Guardar"}
              </button>

              {currentProduct && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentProduct(null);
                    setView('inventario');
                  }}
                  className="bg-gray-600 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        )}
      </main>
    </div>
  );
}