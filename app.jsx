import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Package, 
  LogIn, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  LogOut,
  ChevronRight,
  ClipboardList
} from 'lucide-react';

/**
 * PROYECTO LUMON - SISTEMA DE GESTIÓN DE INVENTARIO
 * Unidad 1 - Desarrollo con React y SCRUM
 */

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('inventory'); // 'inventory' | 'add' | 'edit'
  const [products, setProducts] = useState([
    { id: 1, name: 'Papel Bond A4', category: 'Papelería', stock: 150, price: 5.50 },
    { id: 2, name: 'Silla Ergonómica', category: 'Mobiliario', stock: 12, price: 1200.00 },
    { id: 3, name: 'Bolígrafos Negros (12pk)', category: 'Papelería', stock: 45, price: 12.00 },
  ]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loginData, setLoginData] = useState({ user: '', password: '' });

  // Manejo de Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.user === 'admin' && loginData.password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Credenciales inválidas (Pruebe admin/1234)');
    }
  };

  // CRUD: Agregar / Editar
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

  // CRUD: Eliminar
  const deleteProduct = (id) => {
    if (window.confirm('¿Desea eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <div className="flex justify-center mb-6">
            <div className="bg-lime-400 p-3 rounded-xl">
              <Package size={40} className="text-slate-900" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white text-center mb-2">Lumon</h1>
          <p className="text-slate-400 text-center mb-8">Gestión de Inventario v1.0</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Usuario</label>
              <input 
                type="text" 
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-lime-400 outline-none transition-all"
                placeholder="admin"
                onChange={(e) => setLoginData({...loginData, user: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <input 
                type="password" 
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-lime-400 outline-none transition-all"
                placeholder="••••"
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
            </div>
            <button className="w-full bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mt-6">
              <LogIn size={20} /> Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6">
        <div className="flex items-center gap-3 mb-10">
          <Package className="text-lime-400" />
          <span className="text-xl font-bold tracking-tight">LUMON</span>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => {setView('inventory'); setCurrentProduct(null);}}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'inventory' ? 'bg-lime-400 text-slate-900' : 'hover:bg-slate-800'}`}
          >
            <ClipboardList size={20} /> Inventario
          </button>
          <button 
            onClick={() => setView('add')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${view === 'add' ? 'bg-lime-400 text-slate-900' : 'hover:bg-slate-800'}`}
          >
            <Plus size={20} /> Nuevo Producto
          </button>
        </nav>

        <div className="mt-auto pt-10">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {view === 'inventory' ? 'Control de Stock' : view === 'add' ? 'Registrar Producto' : 'Editar Producto'}
            </h2>
            <p className="text-slate-500">Panel de control administrativo</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-slate-600 font-medium">Bienvenido, Administrador</span>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">A</div>
          </div>
        </header>

        {view === 'inventory' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-bottom border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 justify-between items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o categoría..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-lime-400 outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => setView('add')}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <Plus size={18} /> Agregar
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Producto</th>
                    <th className="px-6 py-4 font-semibold">Categoría</th>
                    <th className="px-6 py-4 font-semibold text-center">Stock</th>
                    <th className="px-6 py-4 font-semibold">Precio</th>
                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold uppercase">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-bold ${product.stock < 20 ? 'text-red-500' : 'text-slate-700'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => {setCurrentProduct(product); setView('edit');}}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={saveProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto</label>
                  <input 
                    name="name"
                    defaultValue={currentProduct?.name}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                  <select 
                    name="category"
                    defaultValue={currentProduct?.category}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                  >
                    <option>Papelería</option>
                    <option>Mobiliario</option>
                    <option>Electrónica</option>
                    <option>Limpieza</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock Inicial</label>
                  <input 
                    type="number"
                    name="stock"
                    defaultValue={currentProduct?.stock}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio Unitario</label>
                  <input 
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={currentProduct?.price}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold px-8 py-3 rounded-lg transition-colors"
                >
                  {currentProduct ? 'Actualizar' : 'Guardar Producto'}
                </button>
                <button 
                  type="button"
                  onClick={() => {setView('inventory'); setCurrentProduct(null);}}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-8 py-3 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}