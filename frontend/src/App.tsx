import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://web-s-ch.onrender.com/api';

function App(): React.ReactElement {
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));

  const handleLogout = () => {
    localStorage.clear();
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
         <button style={{ padding: '15px 40px', cursor: 'pointer', backgroundColor: '#00d4ff', border: 'none', borderRadius: '8px', fontWeight: 'bold', color: 'black', fontSize: '1.1rem' }}>
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
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.items || data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddToCart = async (productId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("Tiến ơi, đăng nhập cái đã mới mua hàng được nhé! 😊");
      window.location.hash = "/login";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ productId, qty: 1 })
      });
      if (res.ok) alert("Hàng đã vào giỏ rồi nhé! 🛒");
      else alert("Lỗi khi thêm hàng!");
    } catch (err) {
      alert("Lỗi kết nối Server!");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Đang nạp hàng...</div>;

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Sản phẩm mới nhất</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {products.map((item: any) => (
          <div key={item._id} className="product-card" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <img 
                src={(item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/150'} 
                alt={item.name} 
                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '10px', objectFit: 'contain' }} 
              />
            </div>
            <h3>{item.name}</h3>
            <p style={{ color: '#00d4ff', fontWeight: 'bold' }}>{Number(item.price).toLocaleString()}đ</p>
            <button onClick={() => handleAddToCart(item._id)} style={{ backgroundColor: '#00d4ff', color: 'black', border: 'none', padding: '12px', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 'bold' }}>Mua ngay</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- TRANG GIỎ HÀNG ---
function CartPage(): React.ReactElement {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (productId: string) => {
    try {
      const res = await fetch(`${API_URL}/cart/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ productId })
      });
      if (res.ok) fetchCart();
    } catch (err) {
      alert("Lỗi khi xóa món hàng!");
    }
  };

  if (!token) return <div style={{ textAlign: 'center', padding: '100px' }}>Vui lòng đăng nhập để xem giỏ hàng.</div>;
  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải giỏ hàng...</div>;
  if (!cart || !cart.items || cart.items.length === 0) return <div style={{ textAlign: 'center', padding: '100px' }}>Giỏ hàng của bạn đang trống. 🛒</div>;

  const total = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '30px', backgroundColor: '#1a1a1a', borderRadius: '15px', border: '1px solid #333' }}>
      <h2 style={{ textAlign: 'center', color: '#00d4ff', marginBottom: '30px' }}>Giỏ hàng của bạn</h2>
      {cart.items.map((item: any) => (
        <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #333' }}>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{item.name}</h4>
            <p style={{ color: '#888', margin: '5px 0' }}>Số lượng: {item.qty} | Giá: {item.price.toLocaleString()}đ</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
             <span style={{ fontWeight: 'bold', color: '#00d4ff' }}>{(item.price * item.qty).toLocaleString()}đ</span>
             <button onClick={() => removeItem(item.product)} style={{ backgroundColor: '#ff4d4d', border: 'none', color: 'white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Xóa</button>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'right', marginTop: '40px', borderTop: '2px solid #333', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '1.5rem' }}>Tổng cộng: <span style={{ color: '#00d4ff' }}>{total.toLocaleString()}đ</span></h3>
        <button style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px' }}>
           Đặt hàng ngay
        </button>
      </div>
    </div>
  );
}

// --- TRANG ĐĂNG NHẬP ---
function LoginPage({ setUserName }: { setUserName: (name: string | null) => void }): React.ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async () => {
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userName', data.user.name);
        setUserName(data.user.name);
        alert("Tuyệt vời! Đăng nhập thành công.");
        window.location.hash = "/";
      } else alert(data.error || "Lỗi rồi Tiến ơi!");
    } catch (err) { alert("Lỗi kết nối!"); }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '40px', border: '1px solid #333', borderRadius: '20px', textAlign: 'center', backgroundColor: '#111' }}>
      <h2 style={{ color: '#00d4ff' }}>{isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}</h2>
      {!isLogin && <input type="text" placeholder="Tên của bạn" value={name} style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '5px' }} onChange={(e) => setName(e.target.value)} />}
      <input type="email" placeholder="Email" value={email} style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '5px' }} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mật khẩu" value={password} style={{ width: '100%', padding: '12px', marginBottom: '25px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '5px' }} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit} style={{ width: '100%', padding: '14px', backgroundColor: '#00d4ff', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{isLogin ? "Vào mua hàng" : "Tạo tài khoản"}</button>
      <p style={{ marginTop: '20px', color: '#888', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}</p>
    </div>
  );
}

export default App;