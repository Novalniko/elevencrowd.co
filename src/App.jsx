import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Categories } from './components/Categories';
import { ProductCatalog } from './components/ProductCatalog';
import { Features } from './components/Features';
import { Basecamp } from './components/Basecamp';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { FloatingWA } from './components/FloatingWA';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { catalogService } from './services/catalogService';
import { authService } from './services/authService';

export default function App() {
  // Client-side Routing Helper (supports /admin, /admin/login, #/admin, #/admin/login, and /)
  const getInitialRoute = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin/login' || hash === '#/admin/login' || hash === '#admin-login') {
        return '/admin/login';
      }
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || hash === '#admin') {
        return '/admin';
      }
    }
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => authService.isAdmin());

  // Initialize auth on load and listen to session changes
  useEffect(() => {
    authService.init().then(() => {
      setIsAdminLoggedIn(authService.isAdmin());
    });

    const handleAuthChange = () => {
      setIsAdminLoggedIn(authService.isAdmin());
    };
    window.addEventListener(authService.EVENT_NAME, handleAuthChange);
    return () => {
      window.removeEventListener(authService.EVENT_NAME, handleAuthChange);
    };
  }, []);

  const navigateTo = (route, replace = false) => {
    if (typeof window !== 'undefined') {
      if (replace) {
        window.history.replaceState({}, '', route);
      } else if (window.location.pathname !== route) {
        window.history.pushState({}, '', route);
      }
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync routing state with browser Back/Forward buttons and Hash changes
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin/login' || hash === '#/admin/login' || hash === '#admin-login') {
        setCurrentRoute('/admin/login');
      } else if (path === '/admin' || path.startsWith('/admin/') || hash === '#/admin' || hash === '#admin') {
        setCurrentRoute('/admin');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Authentication Route Guard:
  // - If user tries to open /admin without being logged in -> redirect to /admin/login
  // - If user is already logged in and opens /admin/login -> redirect to /admin
  useEffect(() => {
    if (currentRoute === '/admin') {
      if (!authService.isAdmin()) {
        navigateTo('/admin/login', true);
      }
    } else if (currentRoute === '/admin/login') {
      if (authService.isAdmin()) {
        navigateTo('/admin', true);
      }
    }
  }, [currentRoute, isAdminLoggedIn]);

  // Handle Logout
  const handleLogout = () => {
    authService.logout();
    setIsAdminLoggedIn(false);
    navigateTo('/admin/login', true);
  };

  // Synchronized catalog products from catalogService
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      const result = await catalogService.getRawList();
      if (isMounted) setProducts(result);
    };

    loadProducts();

    const syncProducts = async () => {
      const result = await catalogService.getRawList();
      if (isMounted) setProducts(result);
    };

    window.addEventListener(catalogService.EVENT_NAME, syncProducts);
    return () => {
      isMounted = false;
      window.removeEventListener(catalogService.EVENT_NAME, syncProducts);
    };
  }, []);

  // Load cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('elevencrowd_cart');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading cart from storage:', e);
    }
    return [];
  });

  // Save cart to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('elevencrowd_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  // UI State
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (product, size, quantity = 1, variantOption = '') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size && item.variantOption === variantOption
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            variantOption,
            quantity: quantity,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id, size, newQty, variantOption = '') => {
    if (newQty <= 0) {
      handleRemoveFromCart(id, size, variantOption);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.variantOption === variantOption ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (id, size, variantOption = '') => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size && item.variantOption === variantOption)));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Route 1: Admin Login Page (/admin/login)
  if (currentRoute === '/admin/login') {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          navigateTo('/admin', true);
        }}
        onNavigateToStore={() => navigateTo('/')}
      />
    );
  }

  // Route 2: Protected Admin Dashboard (/admin)
  if (currentRoute === '/admin') {
    // If not authenticated, render login page with return callback
    if (!isAdminLoggedIn) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            navigateTo('/admin', true);
          }}
          onNavigateToStore={() => navigateTo('/')}
        />
      );
    }

    return (
      <AdminPage
        onNavigateToStore={() => navigateTo('/')}
        onLogout={handleLogout}
      />
    );
  }

  // Route 3: Welcome Storefront Page (/)
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-neutral-950 selection:text-white font-body">
      
      {/* Navbar Header */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={setActiveCategory}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onExploreClick={scrollToCatalog} />

        {/* Categories Section */}
        <Categories
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          products={products}
        />

        {/* Catalog Section */}
        <ProductCatalog
          products={products}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onQuickView={(prod) => setSelectedProduct(prod)}
          onAddToCart={handleAddToCart}
        />

        {/* Features / Why Choose Us */}
        <Features />

        {/* Basecamp & Contact */}
        <Basecamp />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      
      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onExploreProducts={scrollToCatalog}
      />

      {/* Floating WhatsApp Button */}
      <FloatingWA />

    </div>
  );
}
