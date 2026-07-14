const PRODUCTS = [
  {id:'boobie', name:'Boobie Bouncer Decal', price:8, category:'funny', image:'images/products/boobie-bouncer.jpg', badge:'Funny'},
  {id:'head', name:'Good Head Decal', price:8, category:'quotes', image:'images/products/good-head.jpg', badge:'Quote'},
  {id:'skull', name:'Desert Skull Decal', price:12, category:'automotive', image:'images/products/desert-skull.jpg', badge:'Automotive'},
  {id:'wasted', name:'Wasted Paychecks Decal', price:9, category:'quotes', image:'images/products/wasted-paychecks.jpg', badge:'Quote'},
  {id:'fact', name:"Fun Fact: I Don’t Care", price:7, category:'funny', image:'images/products/fun-fact.jpg', badge:'Funny'},
  {id:'google', name:'Ask Google Not Me', price:7, category:'funny', image:'images/products/ask-google.jpg', badge:'Funny'},
  {id:'adult', name:"I’m An Adult", price:7, category:'funny', image:'images/products/adult.jpg', badge:'Funny'},
  {id:'pack10', name:'Paper Sticker Pack — 10', price:12, category:'packs', image:'images/brand/913-sharpcut-logo.png', badge:'Sticker Pack'},
  {id:'pack20', name:'Paper Sticker Pack — 20', price:20, category:'packs', image:'images/brand/913-sharpcut-logo.png', badge:'Sticker Pack'},
  {id:'pack30', name:'Paper Sticker Pack — 30', price:27, category:'packs', image:'images/brand/913-sharpcut-logo.png', badge:'Sticker Pack'},
  {id:'pack40', name:'Paper Sticker Pack — 40', price:34, category:'packs', image:'images/brand/913-sharpcut-logo.png', badge:'Sticker Pack'},
  {id:'pack50', name:'Paper Sticker Pack — 50', price:40, category:'packs', image:'images/brand/913-sharpcut-logo.png', badge:'Sticker Pack'}
];

const money = n => new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD'}).format(n);
const getCart = () => JSON.parse(localStorage.getItem('scCart') || '[]');
const saveCart = cart => { localStorage.setItem('scCart', JSON.stringify(cart)); updateCartCount(); };

function addToCart(id, options={}) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const cart = getCart();
  const key = `${id}-${options.color || ''}-${options.size || ''}-${Date.now()}`;
  cart.push({...product, key, options, qty:1});
  saveCart(cart);
  alert(`${product.name} added to cart`);
}
function removeFromCart(key) {
  saveCart(getCart().filter(i => i.key !== key));
  renderCart();
}
function updateCartCount() {
  const count = getCart().reduce((sum,i)=>sum+(i.qty||1),0);
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = count);
}
function toggleMenu() {
  document.getElementById('mainNav')?.classList.toggle('open');
}
function footerYear() {
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
}
function renderProducts(list=PRODUCTS) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = list.map(p => `
    <article class="card product-card" data-category="${p.category}">
      <img src="${p.image}" alt="${p.name}">
      <div class="card-body">
        <span class="badge">${p.badge}</span>
        <h3>${p.name}</h3>
        <div class="price">${money(p.price)}</div>
        ${p.category === 'packs'
          ? `<a class="btn btn-primary product-actions" href="sticker-packs.html">Choose Pack</a>`
          : `<button class="btn btn-primary product-actions" onclick="addToCart('${p.id}')">Add to Cart</button>`}
      </div>
    </article>`).join('');
}
function filterProducts(category, button) {
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  button?.classList.add('active');
  const search = document.getElementById('shopSearch')?.value.toLowerCase() || '';
  const list = PRODUCTS.filter(p => (category==='all'||p.category===category) && p.name.toLowerCase().includes(search));
  renderProducts(list);
}
function searchProducts() {
  const query = document.getElementById('shopSearch').value.toLowerCase();
  renderProducts(PRODUCTS.filter(p=>p.name.toLowerCase().includes(query)));
}
function buildStickerPack() {
  const qty = Number(document.getElementById('packQty').value);
  const color = document.querySelector('input[name="packColor"]:checked')?.value || 'Pink';
  const prices = {10:12,20:20,30:27,40:34,50:40};
  document.getElementById('packSummary').innerHTML = `
    <h3>Your sticker pack</h3>
    <div class="summary-line"><span>Quantity</span><strong>${qty} stickers</strong></div>
    <div class="summary-line"><span>Main colour</span><strong>${color}</strong></div>
    <div class="summary-line summary-total"><span>Total</span><strong>${money(prices[qty])}</strong></div>
    <button class="btn btn-primary" style="width:100%" onclick="addStickerPack(${qty},'${color}',${prices[qty]})">Add Pack to Cart</button>
    <p style="color:var(--muted);font-size:.88rem">Designs are assorted. The selected colour will be the main colour used throughout the pack.</p>`;
}
function addStickerPack(qty,color,price) {
  const cart=getCart();
  cart.push({id:`custompack${qty}`,key:`pack-${Date.now()}`,name:`Paper Sticker Pack — ${qty}`,price,category:'packs',image:'images/brand/913-sharpcut-logo.png',qty:1,options:{color}});
  saveCart(cart);
  alert(`${qty}-sticker ${color} pack added to cart`);
}
function renderCart() {
  const list = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');
  if (!list || !summary) return;
  const cart=getCart();
  if (!cart.length) {
    list.innerHTML='<div class="empty-state">Your cart is empty. A devastating blow to commerce.</div>';
    summary.innerHTML='<h3>Order summary</h3><div class="summary-line summary-total"><span>Total</span><strong>$0.00</strong></div>';
    return;
  }
  list.innerHTML=cart.map(i=>`
    <div class="cart-item">
      <img src="${i.image}" alt="${i.name}">
      <div>
        <strong>${i.name}</strong>
        ${i.options?.color?`<div style="color:var(--muted)">Main colour: ${i.options.color}</div>`:''}
        <div class="price">${money(i.price)}</div>
      </div>
      <button class="btn btn-danger remove" onclick="removeFromCart('${i.key}')">Remove</button>
    </div>`).join('');
  const subtotal=cart.reduce((s,i)=>s+i.price*(i.qty||1),0);
  summary.innerHTML=`
    <h3>Order summary</h3>
    <div class="summary-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
    <div class="summary-line"><span>Shipping</span><strong>Calculated later</strong></div>
    <div class="summary-line summary-total"><span>Total</span><strong>${money(subtotal)}</strong></div>
    <a class="btn btn-primary" style="width:100%" href="checkout.html">Continue to Checkout</a>`;
}
function renderCheckout() {
  const box=document.getElementById('checkoutItems');
  const totalEl=document.getElementById('checkoutTotal');
  if(!box||!totalEl)return;
  const cart=getCart();
  box.innerHTML=cart.map(i=>`<div class="summary-line"><span>${i.name}${i.options?.color?` (${i.options.color})`:''}</span><strong>${money(i.price)}</strong></div>`).join('');
  totalEl.textContent=money(cart.reduce((s,i)=>s+i.price*(i.qty||1),0));
}
function submitCheckout(e) {
  e.preventDefault();
  const cart=getCart();
  if(!cart.length){ alert('Your cart is empty.'); return; }
  const data=new FormData(e.target);
  const orderNo='SC-'+Math.floor(100000+Math.random()*900000);
  const order={
    orderNo,date:new Date().toISOString(),name:data.get('name'),email:data.get('email'),
    phone:data.get('phone'),fulfillment:data.get('fulfillment'),address:data.get('address'),
    notes:data.get('notes'),items:cart,status:'Received'
  };
  const orders=JSON.parse(localStorage.getItem('scOrders')||'[]');
  orders.push(order); localStorage.setItem('scOrders',JSON.stringify(orders));
  localStorage.removeItem('scCart');
  location.href=`thank-you.html?order=${encodeURIComponent(orderNo)}`;
}
function showOrderNumber() {
  const el=document.getElementById('orderNumber');
  if(el) el.textContent=new URLSearchParams(location.search).get('order')||'SC-PENDING';
}
function trackOrder(e) {
  e.preventDefault();
  const number=document.getElementById('trackingNumber').value.trim().toUpperCase();
  const order=(JSON.parse(localStorage.getItem('scOrders')||'[]')).find(o=>o.orderNo===number);
  const result=document.getElementById('trackingResult');
  result.innerHTML=order
    ? `<div class="card card-body"><h3>${order.orderNo}</h3><p>Status: <strong style="color:var(--blue)">${order.status}</strong></p><p>Placed by ${order.name} on ${new Date(order.date).toLocaleDateString()}</p></div>`
    : `<div class="notice">Order not found on this device. Online tracking needs a database connection later.</div>`;
}
document.addEventListener('DOMContentLoaded',()=>{
  updateCartCount(); footerYear(); renderProducts(); renderCart(); renderCheckout(); showOrderNumber();
  if(document.getElementById('packQty')) buildStickerPack();
});
