// app.js - minimal, safe cart manager (used by all pages)
(function(){
  const KEY = 'tasteway_cart_v1';
  function load(){ try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e){ return []; } }
  function save(cart){ localStorage.setItem(KEY, JSON.stringify(cart)); }

  window.getCart = function(){ return load(); };

  window.addToCart = function(product, qty=1){
    if (!product || !product.id) return;
    const cart = load();
    const i = cart.findIndex(x=>x.id === product.id);
    if (i >= 0) cart[i].qty = Number(cart[i].qty) + Number(qty);
    else cart.push({ id:product.id, title:product.title || product.name, price: Number(product.price), qty: Number(qty) });
    save(cart);
    refreshCartCount();
  };

  window.updateQty = function(id, delta){
    const cart = load();
    const i = cart.findIndex(x=>x.id === id);
    if (i >= 0) {
      cart[i].qty = Number(cart[i].qty) + Number(delta);
      if (cart[i].qty <= 0) cart.splice(i,1);
      save(cart);
      refreshCartCount();
    }
  };

  window.removeFromCart = function(id){
    const cart = load().filter(x=>x.id !== id);
    save(cart);
    refreshCartCount();
  };

  window.clearCart = function(){ localStorage.removeItem(KEY); refreshCartCount(); };

  window.refreshCartCount = function(){
    const cart = load();
    const count = cart.reduce((s,i)=> s + Number(i.qty || 0), 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  };

  // init on DOM ready
  document.addEventListener('DOMContentLoaded', function(){ refreshCartCount(); });

  // small helper for debugging (optional)
  window._seedCart = function(items){ save(items); refreshCartCount(); };
})();
