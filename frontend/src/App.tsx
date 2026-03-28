import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://web-s-ch.onrender.com/api';

function App(): React.ReactElement {
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));
  const [cartCount, setCartCount] = useState(0);

  // Hàm lấy số lượng giỏ hàng để hiện lên Header
  const updateCartCount = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data && data.items) {
        const totalQty = data.items.reduce((sum: number, item: any) => sum + item.qty, 0);
        setCartCount(totalQty);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { updateCartCount(); }, [userName]);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
    setCartCount(0);
    window.location.hash = "/login";
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 50px', backgroundColor: '#111', borderBottom: '1px solid #333', position: 'sticky', top: 0, zIndex: 1000 }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#00d4ff' }}>E-Commerce Store</h1>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>Products</Link>
            <Link to="/cart" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
              Cart {cartCount > 0 && <span style={{ backgroundColor: '#ff4d4d', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', position: 'absolute', top: '-10px', right: '-15px' }}>{cartCount}</span>}
            </Link>
            
            {userName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '1px solid #444', paddingLeft: '20px' }}>
                <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>Chào, {userName}</span>
                <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Thoát</button>
              </div>
            ) : (
              <Link to="/login" style={{ backgroundColor: '#00d4ff', color: 'black', padding: '6px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
            )}
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage onAddSuccess={updateCartCount} />} />
            <Route path="/cart" element={<CartPage onUpdateSuccess={updateCartCount} />} />
            <Route path="/login" element={<LoginPage setUserName={setUserName} />} />
          </Routes>
        </main>

        <footer className="app-footer" style={{ textAlign: 'center', padding: '30px', borderTop: '1px solid #333', marginTop: '50px', color: '#666' }}>
          <p>&copy; 2026 E-Commerce Store. Thiết kế bởi Tiến.</p>
        </footer>
      </div>
    </Router>
  );
}

// --- TRANG CHỦ ---
function HomePage(): React.ReactElement {
  return (
    <div style={{ textAlign: 'center', padding: '120px 20px' }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Trải nghiệm Công nghệ mới</h2>
      <p style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '40px' }}>Mua sắm iPhone, Samsung và Macbook với giá tốt nhất thị trường.</p>
      <Link to="/products">
         <button style={{ padding: '15px 45px', cursor: 'pointer', backgroundColor: '#00d4ff', border: 'none', borderRadius: '30px', fontWeight: 'bold', color: 'black', fontSize: '1.2rem', transition: '0.3s' }}>
            Bắt đầu mua sắm
         </button>
      </Link>
    </div>
  );
}

// --- TRANG SẢN PHẨM ---
function ProductsPage({ onAddSuccess }: { onAddSuccess: () => void }): React.ReactElement {
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
      alert("Tiến ơi, vui lòng Đăng nhập để mua hàng!");
      window.location.hash = "/login";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ productId, qty: 1 })
      });
      if (res.ok) {
        alert("Đã thêm vào giỏ hàng! 🛒");
        onAddSuccess(); // Cập nhật số trên Header ngay lập tức
      } else alert("Có lỗi xảy ra!");
    } catch (err) { alert("Lỗi kết nối!"); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Đang nạp hàng vào kho...</div>;

  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2rem' }}>SẢN PHẨM NỔI BẬT</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '35px', maxWidth: '1200px', margin: '0 auto' }}>
        {products.map((item: any) => (
          <div key={item._id} className="product-card" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', padding: '25px', borderRadius: '20px', textAlign: 'center', transition: '0.3s' }}>
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', background: '#222', borderRadius: '15px' }}>
              <img src={(item.images && item.images[0]) || 'https://via.placeholder.com/200'} alt={item.name} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: '1.3rem' }}>{item.name}</h3>
            <p style={{ color: '#00d4ff', fontWeight: 'bold', fontSize: '1.2rem' }}>{Number(item.price).toLocaleString()}đ</p>
            <button onClick={() => handleAddToCart(item._id)} style={{ backgroundColor: '#00d4ff', color: 'black', border: 'none', padding: '12px', borderRadius: '10px', width: '100%', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
              Mua ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- TRANG GIỎ HÀNG ---
function CartPage({ onUpdateSuccess }: { onUpdateSuccess: () => void }): React.ReactElement {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/cart`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      setCart(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (productId: string) => {
    try {
      const res = await fetch(`${API_URL}/cart/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        fetchCart();
        onUpdateSuccess();
      }
    } catch (err) { alert("Lỗi xóa hàng!"); }
  };

  if (!token) return <div style={{ textAlign: 'center', padding: '100px' }}>Vui lòng đăng nhập để xem giỏ hàng.</div>;
  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Đang tải...</div>;
  if (!cart || !cart.items || cart.items.length === 0) return <div style={{ textAlign: 'center', padding: '100px' }}>Giỏ hàng đang trống. Quay lại mua sắm nhé! 🛒</div>;

  const total = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);

  return (
    <div style={{ maxWidth: '900px', margin: '60px auto', padding: '40px', backgroundColor: '#161616', borderRadius: '25px', border: '1px solid #333' }}>
      <h2 style={{ color: '#00d4ff', marginBottom: '40px', textAlign: 'center' }}>GIỎ HÀNG CỦA BẠN</h2>
      {cart.items.map((item: any) => (
        <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #222' }}>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{item.name}</h4>
            <p style={{ color: '#888', margin: '8px 0' }}>Số lượng: {item.qty} | Đơn giá: {item.price.toLocaleString()}đ</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
             <span style={{ fontWeight: 'bold', color: '#00d4ff', fontSize: '1.2rem' }}>{(item.price * item.qty).toLocaleString()}đ</span>
             <button onClick={() => removeItem(item.product)} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer' }}>Xóa</button>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'right', marginTop: '40px', borderTop: '2px solid #222', paddingTop: '30px' }}>
        <h3 style={{ fontSize: '1.8rem' }}>Tổng thanh toán: <span style={{ color: '#00d4ff' }}>{total.toLocaleString()}đ</span></h3>
        <button style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '15px 50px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '15px' }}>
           CHỐT ĐƠN NGAY
        </button>
      </div>
    </div>
  );
}

// --- TRANG ĐĂNG NHẬP (GIỮ NGUYÊN) ---
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
        window.location.hash = "/";
      } else alert(data.error || "Lỗi rồi!");
    } catch (err) { alert("Lỗi kết nối!"); }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '100px auto', padding: '45px', border: '1px solid #333', borderRadius: '25px', textAlign: 'center', backgroundColor: '#111' }}>
      <h2 style={{ color: '#00d4ff', marginBottom: '35px' }}>{isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}</h2>
      {!isLogin && <input type="text" placeholder="Tên" value={name} style={{ width: '100%', padding: '14px', marginBottom: '15px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px' }} onChange={(e) => setName(e.target.value)} />}
      <input type="email" placeholder="Email" value={email} style={{ width: '100%', padding: '14px', marginBottom: '15px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px' }} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mật khẩu" value={password} style={{ width: '100%', padding: '14px', marginBottom: '30px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px' }} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit} style={{ width: '100%', padding: '15px', backgroundColor: '#00d4ff', color: 'black', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>{isLogin ? "Vào mua hàng" : "Tạo tài khoản"}</button>
      <p style={{ marginTop: '25px', color: '#888', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Bạn mới đến? Đăng ký tại đây" : "Đã có tài khoản? Đăng nhập"}</p>
    </div>
  );
}

export default App;