import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App(): React.ReactElement {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>E-Commerce Store</h1>
          <nav>
            {/* Dùng Link giúp chuyển trang không bị load lại và không bị lỗi 404 */}
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

// Các Component bên dưới giữ nguyên logic của bạn
function HomePage(): React.ReactElement {
  return <div><h2>Welcome to E-Commerce Store</h2></div>;
}

function ProductsPage(): React.ReactElement {
  return <div><h2>Products (Coming Soon)</h2></div>;
}

function CartPage(): React.ReactElement {
  return <div><h2>Shopping Cart (Coming Soon)</h2></div>;
}

function LoginPage(): React.ReactElement {
  return <div><h2>Login (Coming Soon)</h2></div>;
}

export default App;