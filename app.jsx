import React, { useState, useEffect } from 'react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loginData, setLoginData] = useState({ user: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Cargar productos desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts([
        { id: 1, name: 'Papel Bond A4', category: 'Papelería', stock: 150, price: 5.5 },
        { id: 2, name: 'Silla Ergonómica', category: 'Mobiliario', stock: 12, price: 1200 },
      ]);
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.user === 'admin' && loginData.password === '1234') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  // Guardar producto
  const saveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const stock = parseInt(formData.get('stock'));
    const price = parseFloat(formData.get('price'));

    if (stock < 0 || price < 0) {
      alert('Stock y precio deben ser positivos');
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
    } else {
      setProducts([...products, productData]);
    }

    setView('inventory');
    setCurrentProduct(null);
  };

  // Eliminar
  const deleteProduct = (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Filtro de búsqueda
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  // LOGIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="space-y-3">
          <h2>Login</h2>

          <input
            placeholder="Usuario"
            onChange={(e) => setLoginData({ ...loginData, user: e.target.value })}
          />

          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />

          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}

          <button>Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Inventario</h1>

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setView('add')}>Agregar</button>
      </div>

      {/* TABLA */}
      {view === 'inventory' && (
        <table border="1" cellPadding="5">
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
            {filteredProducts.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td style={{ color: p.stock < 20 ? 'red' : 'black' }}>{p.stock}</td>
                <td>${p.price}</td>
                <td>
                  <button onClick={() => { setCurrentProduct(p); setView('edit'); }}>
                    Editar
                  </button>
                  <button onClick={() => deleteProduct(p.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* FORM */}
      {(view === 'add' || view === 'edit') && (
        <form onSubmit={saveProduct}>
          <input name="name" defaultValue={currentProduct?.name} placeholder="Nombre" required />
          <input name="category" defaultValue={currentProduct?.category} placeholder="Categoría" required />
          <input name="stock" type="number" defaultValue={currentProduct?.stock} placeholder="Stock" required />
          <input name="price" type="number" step="0.01" defaultValue={currentProduct?.price} placeholder="Precio" required />

          <button type="submit">Guardar</button>
          <button type="button" onClick={() => { setView('inventory'); setCurrentProduct(null); }}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
