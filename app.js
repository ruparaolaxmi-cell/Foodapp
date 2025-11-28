// Simple cart manager using localStorage
(function(){
  const STORAGE_KEY = 'tasteway_cart_v1';

  function saveCart(cart){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
  function loadCart(){ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }

  // public helpers used by page scripts
  window.getCart = function(){ return loadCart(); };
  window.addToCart = function(product, qty = 1){
    const cart = loadCart();
    const idx = cart.findIndex(i => i.id === product.id);
    if (idx >= 0) {
      cart[idx].qty += qty;
    } else {
      cart.push({ id: product.id, title: product.title || product.name, price: Number(product.price), qty });
    }
    saveCart(cart);
    refreshCartCount();
    // small feedback
    alert(${product.title} added to cart);
  };
  window.updateQty = function(id, delta){
    const cart = loadCart();
    const idx = cart.findIndex(i => i.id === id);
    if (idx >= 0) {
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) cart.splice(idx,1);
      saveCart(cart);
      refreshCartCount();
    }
  };
  window.removeFromCart = function(id){
    const cart = loadCart().filter(i => i.id !== id);
    saveCart(cart);
    refreshCartCount();
  };
  window.clearCart = function(){
    localStorage.removeItem(STORAGE_KEY);
  };
  window.refreshCartCount = function(){
    const cart = loadCart();
    const count = cart.reduce((s,i)=> s + i.qty, 0);
    // update elements if present
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
  };

  // initialize small behavior: refresh count on load
  document.addEventListener('DOMContentLoaded', ()=> refreshCartCount());
})();
