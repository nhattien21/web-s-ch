import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

function App(): React.ReactElement {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>E-Commerce Store</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/login">Login</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2026 E-Commerce Store. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

function HomePage(): React.ReactElement {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Welcome to E-Commerce Store</h2>
      <p>Khám phá thế giới công nghệ trong tầm tay bạn.</p>
      <Link to="/products">
         <button style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#00d4ff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            Mua sắm ngay
         </button>
      </Link>
    </div>
  );
}

// --- TRANG SẢN PHẨM ---
function ProductsPage(): React.ReactElement {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'https://web-s-ch.onrender.com/api';
    
    fetch(`${apiUrl}/products`)
      .then(res => res.json())
      .then(data => {
        // API trả về { items: [...] } nên phải lấy data.items
        if (data && Array.isArray(data.items)) {
          setProducts(data.items);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]); 
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi gọi API:", err);
        setProducts([]); 
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang nạp hàng vào kho...</div>;

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Sản phẩm mới nhất</h2>
      
      {products && products.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '25px', maxWidth: '1200px', margin: '0 auto'
        }}>
          {products.map((item: any) => (
            <div key={item._id || Math.random()} className="product-card" style={{ 
              backgroundColor: '#1e1e1e', border: '1px solid #333', padding: '15px', borderRadius: '12px', textAlign: 'center' 
            }}>
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                {/* SỬA LỖI HIỂN THỊ ẢNH: Lấy item.images[0] vì images là mảng */}
                <img 
                  src={(item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/150'} 
                  alt={item.name} 
                  style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }} 
                />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
              <p style={{ color: '#00d4ff', fontWeight: 'bold' }}>{Number(item.price || 0).toLocaleString()}đ</p>
              <button style={{ backgroundColor: '#00d4ff', color: 'black', border: 'none', padding: '10px', borderRadius: '6px', width: '100%', cursor: 'pointer' }}>
                Mua ngay
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#888' }}>
            <p>Hiện tại chưa có sản phẩm nào trong kho.</p>
            <p><small>(Vui lòng kiểm tra Database Atlas của bạn)</small></p>
        </div>
      )}
    </div>
  );
}

function CartPage(): React.ReactElement {
  return <div style={{ textAlign: 'center', padding: '50px' }}><h2>Giỏ hàng của bạn đang trống</h2></div>;
}

function LoginPage(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'https://web-s-ch.onrender.com/api';
    try {
      const res = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      alert(data.message || "Đã gửi yêu cầu!");
    } catch (err) {
      alert("Lỗi kết nối Server!");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #333', borderRadius: '10px', textAlign: 'center' }}>
      <h2>Đăng ký tài khoản</h2>
      <input type="email" placeholder="Email" value={email} style={{ width: '90%', padding: '10px', marginBottom: '10px', background: '#222', color: '#fff' }} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mật khẩu" value={password} style={{ width: '90%', padding: '10px', marginBottom: '20px', background: '#222', color: '#fff' }} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister} style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Đăng ký thành viên
      </button>
    </div>
  );
}

export default App;