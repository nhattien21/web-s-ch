import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

function App(): React.ReactElement {
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    setUserName(null);
    window.location.hash = "/login";
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 50px', backgroundColor: '#111', borderBottom: '1px solid #333' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>E-Commerce Store</h1>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>Products</Link>
            <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>Cart</Link>
            
            {userName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #444', paddingLeft: '20px' }}>
                <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>Chào, {userName}</span>
                <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Thoát</button>
              </div>
            ) : (
              <Link to="/login" style={{ backgroundColor: '#00d4ff', color: 'black', padding: '5px 15px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
            )}
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage setUserName={setUserName} />} />
          </Routes>
        </main>

        <footer className="app-footer" style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #333', marginTop: '50px' }}>
          <p>&copy; 2026 E-Commerce Store. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

// --- TRANG CHỦ ---
function HomePage(): React.ReactElement {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to E-Commerce Store</h2>
      <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '40px' }}>Khám phá thế giới công nghệ trong tầm tay bạn.</p>
      <Link to="/products">
         <button style={{ padding: '15px 40px', cursor: 'pointer', backgroundColor: '#00d4ff', border: 'none', borderRadius: '8px', fontWeight: 'bold', color: 'black', fontSize: '1.1rem', transition: '0.3s' }}>
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

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Đang nạp hàng vào kho...</div>;

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Sản phẩm mới nhất</h2>
      {products && products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {products.map((item: any) => (
            <div key={item._id || Math.random()} className="product-card" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', padding: '20px', borderRadius: '15px', textAlign: 'center', transition: '0.3s' }}>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <img src={(item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/150'} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '10px' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{item.name}</h3>
              <p style={{ color: '#00d4ff', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>{Number(item.price || 0).toLocaleString()}đ</p>
              <button style={{ backgroundColor: '#00d4ff', color: 'black', border: 'none', padding: '12px', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 'bold' }}>Mua ngay</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
            <p>Hiện tại chưa có sản phẩm nào trong kho.</p>
        </div>
      )}
    </div>
  );
}

function CartPage(): React.ReactElement {
  return <div style={{ textAlign: 'center', padding: '100px' }}><h2>Giỏ hàng của bạn đang trống</h2></div>;
}

// --- TRANG ĐĂNG NHẬP / ĐĂNG KÝ ---
function LoginPage({ setUserName }: { setUserName: (name: string | null) => void }): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async () => {
    const apiUrl = (import.meta as any).env.VITE_API_URL || 'https://web-s-ch.onrender.com/api';
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Lưu token và thông tin user
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userName', data.user.name);
        setUserName(data.user.name);
        
        alert(`${isLogin ? "Đăng nhập" : "Đăng ký"} thành công! Chào ${data.user.name}`);
        window.location.hash = "/";
      } else {
        alert(data.error || "Có lỗi xảy ra!");
      }
    } catch (err) {
      alert("Lỗi kết nối Server! Tiến check lại Render nhé.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '40px', border: '1px solid #333', borderRadius: '20px', textAlign: 'center', backgroundColor: '#111', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      <h2 style={{ color: '#00d4ff', marginBottom: '30px' }}>{isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}</h2>
      
      {!isLogin && (
        <input type="text" placeholder="Tên của bạn" value={name} style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px' }} onChange={(e) => setName(e.target.value)} />
      )}
      
      <input type="email" placeholder="Email" value={email} style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px' }} onChange={(e) => setEmail(e.target.value)} />
      
      <input type="password" placeholder="Mật khẩu" value={password} style={{ width: '100%', padding: '12px', marginBottom: '25px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px' }} onChange={(e) => setPassword(e.target.value)} />
      
      <button onClick={handleSubmit} style={{ width: '100%', padding: '14px', backgroundColor: isLogin ? '#00d4ff' : '#28a745', color: isLogin ? 'black' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
        {isLogin ? "Vào cửa hàng" : "Tạo tài khoản ngay"}
      </button>

      <p style={{ marginTop: '25px', color: '#888', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Chưa có tài khoản? Đăng ký tại đây" : "Đã có tài khoản? Quay lại Đăng nhập"}
      </p>
    </div>
  );
}

export default App;