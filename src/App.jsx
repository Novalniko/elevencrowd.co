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
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { TrackingPage } from './pages/TrackingPage';
import { OrderModal } from './components/OrderModal';
import { MemberAuthPage } from './pages/MemberAuthPage';
import { MemberOrdersPage } from './pages/MemberOrdersPage';
import { catalogService } from './services/catalogService';
import { authService } from './services/authService';
import { memberService } from './services/memberService';

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
      if (path === '/tracking') {
        return '/tracking';
      }
      if (path === '/member/orders') {
        return '/member/orders';
      }
      if (path === '/member/login' || path === '/member/register') {
        return path;
      }
    }
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => authService.isAdmin());
  const [member, setMember] = useState(() => memberService.getCurrent());

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
      } else if (path === '/tracking') {
        setCurrentRoute('/tracking');
      } else if (path === '/member/orders') {
        setCurrentRoute('/member/orders');
      } else if (path === '/member/login' || path === '/member/register') {
        setCurrentRoute(path);
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

  useEffect(() => {
    const handleMemberChange = () => setMember(memberService.getCurrent());
    window.addEventListener(memberService.EVENT_NAME, handleMemberChange);
    return () => window.removeEventListener(memberService.EVENT_NAME, handleMemberChange);
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
    } else if (currentRoute === '/member/orders' && !memberService.isLoggedIn()) {
      navigateTo('/member/login', true);
    }
  }, [currentRoute, isAdminLoggedIn, member]);

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
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState([]);

  // Cart operations
  const handleAddToCart = (product, size, quantity = 1, variantOption = '', color = '') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === size && item.variantOption === variantOption && (item.color || '') === color
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
            color,
            quantity: quantity,
          },
        ];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id, size, newQty, variantOption = '', color = '') => {
    if (newQty <= 0) {
      handleRemoveFromCart(id, size, variantOption, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.variantOption === variantOption && (item.color || '') === color ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (id, size, variantOption = '', color = '') => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size && item.variantOption === variantOption && (item.color || '') === color)));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('katalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const startCheckout = (items) => {
    if (!memberService.isLoggedIn()) {
      setPendingCheckout(items);
      navigateTo('/member/login');
      return;
    }
    setCheckoutItems(items);
    setIsCartOpen(false);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const finishMemberLogin = (loggedInMember) => {
    setMember(loggedInMember);
    if (pendingCheckout.length > 0) {
      setCheckoutItems(pendingCheckout);
      setPendingCheckout([]);
      setIsCheckoutOpen(true);
      navigateTo('/', true);
    } else {
      navigateTo('/member/orders', true);
    }
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

  if (currentRoute === '/tracking') {
    return <TrackingPage onNavigateToStore={() => navigateTo('/')} />;
  }

  if (currentRoute === '/member/orders') {
    if (!member) return null;
    return (
      <MemberOrdersPage
        member={member}
        onNavigateToStore={() => navigateTo('/')}
        onLogout={() => {
          memberService.logout();
          setMember(null);
          navigateTo('/member/login', true);
        }}
      />
    );
  }

  if (currentRoute === '/member/login' || currentRoute === '/member/register') {
    return <MemberAuthPage mode={currentRoute.endsWith('register') ? 'register' : 'login'} onSuccess={finishMemberLogin} onNavigateToStore={() => navigateTo('/')} />;
  }

  // Route 3: Welcome Storefront Page (/)
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-neutral-900 flex flex-col selection:bg-neutral-950 selection:text-white font-body">
      
      {/* Navbar Header */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => navigateTo('/tracking')}
        onOpenMember={() => navigateTo(member ? '/member/orders' : '/member/login')}
        member={member}
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
          onStartOrder={(product, size, quantity, variantOption, color) => startCheckout([{ ...product, size, quantity, variantOption, color }])}
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
        onStartOrder={(product, size, quantity, variantOption, color) => startCheckout([{ ...product, size, quantity, variantOption, color }])}
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
        onCheckout={() => startCheckout(cart)}
      />

      <OrderModal
        isOpen={isCheckoutOpen}
        items={checkoutItems}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCreated={() => setCheckoutItems([])}
        member={member}
      />

    </div>
  );
}
