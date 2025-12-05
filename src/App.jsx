import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

const App = () => (
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Header />
          <main className="page-content">
            <AppRouter />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);

export default App;
