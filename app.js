const PRODUCTS = [
  {id:1,name:'Pulsera Aura',category:'Pulseras',material:'Plata 925',price:699,stock:true,image:'https://images.unsplash.com/photo-1617038260897-41a31f4c6a55?auto=format&fit=crop&w=1000&q=84',description:'Una silueta limpia y luminosa pensada para acompañar todos los días sin perder presencia.',variants:['16 cm','17 cm','18 cm'],tag:'Bestseller'},
  {id:2,name:'Collar Élan',category:'Collares',material:'Acero inoxidable',price:899,stock:true,image:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=84',description:'Cadena delicada con carácter editorial. Un punto de luz discreto y decididamente elegante.',variants:['40 cm','45 cm','50 cm'],tag:'Nuevo'},
  {id:3,name:'Anillo Serein',category:'Anillos',material:'Plata 925',price:799,stock:true,image:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=84',description:'Geometría suave, acabado pulido y una presencia que funciona sola o en combinación.',variants:['6','7','8','9'],tag:'Selección GOSH'},
  {id:4,name:'Aretes Lumière',category:'Aretes',material:'Acero inoxidable',price:749,stock:true,image:'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=84',description:'Una caída ligera que enmarca el rostro con una luminosidad sobria y moderna.',variants:['Único'],tag:'Nuevo'},
  {id:5,name:'Pulsera Nocturne',category:'Pulseras',material:'Acero inoxidable',price:949,stock:true,image:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=84',description:'Más estructurada, más nocturna. Diseñada para vestir con precisión.',variants:['17 cm','18 cm','19 cm'],tag:'Limited'},
  {id:6,name:'Collar Solène',category:'Collares',material:'Plata 925',price:1099,stock:false,image:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=84',description:'Proporciones finas y una caída limpia para una firma sofisticada.',variants:['42 cm','47 cm'],tag:'Agotado'},
  {id:7,name:'Anillo Aster',category:'Anillos',material:'Plata 925',price:849,stock:true,image:'https://images.unsplash.com/photo-1601821765780-754fa98637c1?auto=format&fit=crop&w=1000&q=84',description:'Un detalle escultural que conserva la ligereza de la joyería contemporánea.',variants:['6','7','8'],tag:'Bestseller'},
  {id:8,name:'Aretes Étoile',category:'Aretes',material:'Acero inoxidable',price:679,stock:true,image:'https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&w=1000&q=84',description:'Pequeños, precisos y luminosos: el tipo de pieza que termina un look sin esfuerzo.',variants:['Único'],tag:'Selección GOSH'}
];

const state = { filter:'Todos', cart: loadCart(), quickProduct:null, quickQty:1, search:'' };
const $ = (s,root=document) => root.querySelector(s);
const $$ = (s,root=document) => [...root.querySelectorAll(s)];
const money = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(n);

function loadCart(){ try { return JSON.parse(localStorage.getItem('gosh_cart')||'[]'); } catch { return []; } }
function saveCart(){ localStorage.setItem('gosh_cart',JSON.stringify(state.cart)); }
function getProduct(id){ return PRODUCTS.find(p=>p.id===Number(id)); }
function cartCount(){ return state.cart.reduce((sum,i)=>sum+i.qty,0); }
function cartSubtotal(){ return state.cart.reduce((sum,i)=>sum+(getProduct(i.id)?.price||0)*i.qty,0); }
function shipping(){ const subtotal=cartSubtotal(); if(!subtotal) return 0; return subtotal>=1500?0:99; }

function renderProducts(){
  const grid = $('#productGrid');
  const items = state.filter==='Todos' ? PRODUCTS : PRODUCTS.filter(p=>p.category===state.filter);
  grid.innerHTML = items.map(p=>`
    <article class="product-card reveal is-visible">
      <div class="product-media">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="product-tools"><span class="product-tag">${p.tag}</span><button class="quick-btn" data-quick="${p.id}" type="button">Vista rápida</button></div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <div class="product-meta"><span>${p.material}</span><span class="stock">${p.stock?'Disponible':'Agotado'}</span></div>
        <div class="product-price">${money(p.price)}</div>
        <div class="product-actions">
          <button class="btn btn-gold" data-add="${p.id}" type="button" ${p.stock?'':'disabled'}>${p.stock?'Agregar al carrito':'No disponible'}</button>
          <button class="mini-link" data-quick="${p.id}" type="button">Vista</button>
        </div>
      </div>
    </article>`).join('');
  $$('.filter-btn').forEach(b=>b.classList.toggle('is-active',b.dataset.filter===state.filter));
}

function renderCart(){
  $('#cartCount').textContent=cartCount();
  const items=$('#cartItems');
  if(!state.cart.length){ items.innerHTML='<div class="empty-cart">Su carrito está esperando<br>una pieza GOSH.</div>'; $('#cartSummary').innerHTML=''; return; }
  items.innerHTML=state.cart.map(item=>{const p=getProduct(item.id); return `<div class="cart-line"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><p>${p.material}</p><div class="qty-row"><button class="qty-btn" data-qty="${p.id}|-1" type="button">−</button><span>${item.qty}</span><button class="qty-btn" data-qty="${p.id}|1" type="button">+</button><button class="remove-btn" data-remove="${p.id}" type="button">Eliminar</button></div></div><div class="cart-line-price">${money(p.price*item.qty)}</div></div>`}).join('');
  const sub=cartSubtotal(), ship=shipping(), total=sub+ship;
  $('#cartSummary').innerHTML=`<div class="summary-row"><span>Subtotal</span><strong>${money(sub)}</strong></div><div class="summary-row"><span>Envío</span><strong>${ship===0?'Gratis':money(ship)}</strong></div><div class="summary-row total"><span>Total</span><strong>${money(total)}</strong></div><button class="btn btn-gold checkout-btn" id="checkoutBtn" type="button">PROCEDER AL CHECKOUT</button><small style="display:block;margin-top:9px;color:#8b847b;font-size:8px;text-align:center;letter-spacing:.08em">Envío gratis desde $1,500 MXN</small>`;
}

function addToCart(id, qty=1){
  const p=getProduct(id); if(!p || !p.stock) return;
  const found=state.cart.find(i=>i.id===p.id); if(found) found.qty+=qty; else state.cart.push({id:p.id,qty});
  if(found && found.qty<=0) state.cart=state.cart.filter(i=>i.id!==p.id);
  saveCart(); renderCart(); toast(`${p.name} se agregó al carrito.`); openCart();
}
function changeQty(id,delta){ const item=state.cart.find(i=>i.id===id); if(!item)return; item.qty+=delta; if(item.qty<=0) state.cart=state.cart.filter(i=>i.id!==id); saveCart(); renderCart(); }
function removeItem(id){ state.cart=state.cart.filter(i=>i.id!==id); saveCart(); renderCart(); }

function openCart(){ $('#cartDrawer').classList.add('is-open'); $('#cartDrawer').setAttribute('aria-hidden','false'); }
function closeDrawer(id){ const el=$('#'+id); if(el){ el.classList.remove('is-open'); el.setAttribute('aria-hidden','true'); } }
function openSearch(){ $('#searchOverlay').classList.add('is-open'); $('#searchOverlay').setAttribute('aria-hidden','false'); setTimeout(()=>$('#searchInput').focus(),150); renderSearch(); }
function openQuick(id){ const p=getProduct(id); if(!p)return; state.quickProduct=p; state.quickQty=1; $('#quickContent').innerHTML=`<div class="quick-layout"><div class="quick-image"><img src="${p.image}" alt="${p.name}"></div><div class="quick-details"><span class="eyebrow">${p.category.toUpperCase()} · GOSH</span><h2 id="quickTitle">${p.name}</h2><div class="quick-price">${money(p.price)}</div><div class="quick-sub">${p.material} · ${p.stock?'Disponible':'Actualmente agotado'}</div><p class="quick-description">${p.description}</p><div class="variant-label">Seleccione variante</div><div class="variant-row">${p.variants.map((v,i)=>`<button class="variant-btn ${i===0?'is-active':''}" type="button" data-variant="${v}">${v}</button>`).join('')}</div><div class="variant-label">Cantidad</div><div class="quick-buy"><div class="quantity-control"><button type="button" id="quickMinus">−</button><output id="quickQty">1</output><button type="button" id="quickPlus">+</button></div><button class="btn btn-gold" type="button" id="quickAdd" ${p.stock?'':'disabled'}>${p.stock?'AGREGAR AL CARRITO':'AGOTADO'}</button></div></div></div>`; $('#modalBackdrop').classList.add('is-open'); $('#modalBackdrop').setAttribute('aria-hidden','false'); }
function closeModal(){ closeDrawer('modalBackdrop'); }
function toast(msg){ const el=$('#toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(window.__toast); window.__toast=setTimeout(()=>el.classList.remove('show'),2400); }
function renderSearch(){ const term=state.search.trim().toLowerCase(); const results=!term?PRODUCTS.slice(0,4):PRODUCTS.filter(p=>`${p.name} ${p.category} ${p.material}`.toLowerCase().includes(term)).slice(0,8); $('#searchResults').innerHTML=results.map(p=>`<button class="search-result" type="button" data-search-quick="${p.id}"><img src="${p.image}" alt="${p.name}"><div><div class="search-result-name">${p.name}</div><div class="search-result-meta">${p.category} · ${p.material}</div></div><div class="search-result-price">${money(p.price)}</div></button>`).join('') || '<div style="padding:20px;color:#857f77">No encontramos esa pieza. GOSH no se rinde tan fácil; pruebe otra búsqueda.</div>'; }

function setFilter(filter){ state.filter=filter; renderProducts(); document.querySelector('#colecciones')?.scrollIntoView({behavior:'smooth',block:'start'}); }

const heroSlides = $$('.hero-media');
const heroEyebrow = $('#heroEyebrow');
const heroTitle = $('#heroTitle');
const heroEmphasis = $('#heroEmphasis');
const heroCopy = $('#heroCopy');
let activeHeroSlide = 0;
function showHeroSlide(index){
  if(!heroSlides.length) return;
  activeHeroSlide=(index+heroSlides.length)%heroSlides.length;
  heroSlides.forEach((slide,i)=>slide.classList.toggle('is-active',i===activeHeroSlide));
  const slide=heroSlides[activeHeroSlide];
  heroEyebrow.textContent=slide.dataset.eyebrow||'';
  heroTitle.textContent=slide.dataset.title||'';
  heroEmphasis.textContent=slide.dataset.emphasis||'';
  heroCopy.textContent=slide.dataset.copy||'';
}
showHeroSlide(activeHeroSlide);

const editorialSlides = $$('.editorial-slide');
let activeEditorialSlide = 0;
function showEditorialSlide(index){
  if(!editorialSlides.length) return;
  activeEditorialSlide=(index+editorialSlides.length)%editorialSlides.length;
  editorialSlides.forEach((slide,i)=>slide.classList.toggle('is-active',i===activeEditorialSlide));
}
if(editorialSlides.length>1){
  window.setInterval(()=>showEditorialSlide(activeEditorialSlide+1),3000);
}

// Events
$('#productGrid').addEventListener('click',e=>{ const add=e.target.closest('[data-add]'); const quick=e.target.closest('[data-quick]'); if(add)addToCart(Number(add.dataset.add)); if(quick)openQuick(Number(quick.dataset.quick)); });
$('#cartItems').addEventListener('click',e=>{ const qty=e.target.closest('[data-qty]'); const rem=e.target.closest('[data-remove]'); if(qty){const [id,d]=qty.dataset.qty.split('|').map(Number);changeQty(id,d)} if(rem)removeItem(Number(rem.dataset.remove)); });
$('#cartBtn').addEventListener('click',openCart); $('#searchBtn').addEventListener('click',openSearch);
$('#menuBtn').addEventListener('click',()=>{ $('#mobileDrawer').classList.add('is-open'); $('#mobileDrawer').setAttribute('aria-hidden','false'); });
$('#heroPrev')?.addEventListener('click',()=>showHeroSlide(activeHeroSlide-1));
$('#heroNext')?.addEventListener('click',()=>showHeroSlide(activeHeroSlide+1));
$$('[data-close]').forEach(btn=>btn.addEventListener('click',()=>{ const id=btn.dataset.close; if(id==='modalBackdrop')closeModal(); else closeDrawer(id); }));
$('#modalBackdrop').addEventListener('click',e=>{if(e.target.id==='modalBackdrop')closeModal()});
$('#searchOverlay').addEventListener('click',e=>{if(e.target.id==='searchOverlay')closeDrawer('searchOverlay')});
$('#searchInput').addEventListener('input',e=>{state.search=e.target.value;renderSearch()});
$('#searchResults').addEventListener('click',e=>{const b=e.target.closest('[data-search-quick]'); if(b){closeDrawer('searchOverlay');openQuick(Number(b.dataset.searchQuick));}});
$$('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>setFilter(btn.dataset.filter)));
$$('.category-card').forEach(btn=>btn.addEventListener('click',()=>setFilter(btn.dataset.filter)));
$$('[data-filter-link]').forEach(a=>a.addEventListener('click',()=>setFilter(a.dataset.filterLink)));
$('#mobileAccountBtn')?.addEventListener('click',()=>toast('La cuenta del cliente queda preparada para conectar con su proveedor de identidad.'));
$('#accountBtn')?.addEventListener('click',()=>toast('La cuenta del cliente queda preparada para conectar con su proveedor de identidad.'));
$('#quickContent').addEventListener('click',e=>{if(e.target.matches('[data-variant]')){$$('[data-variant]',e.currentTarget).forEach(b=>b.classList.remove('is-active'));e.target.classList.add('is-active');} if(e.target.id==='quickMinus'){state.quickQty=Math.max(1,state.quickQty-1);$('#quickQty').textContent=state.quickQty} if(e.target.id==='quickPlus'){state.quickQty++;$('#quickQty').textContent=state.quickQty} if(e.target.id==='quickAdd'){addToCart(state.quickProduct.id,state.quickQty);closeModal();}});
$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();const email=$('#newsletterEmail').value.trim();if(!email)return;$('#newsletterForm').reset();toast('Bienvenido al mundo GOSH. Revise su correo para confirmar.');});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer('searchOverlay');closeDrawer('cartDrawer');closeDrawer('mobileDrawer');closeModal();}});
$('#year').textContent=new Date().getFullYear();

const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));
window.addEventListener('scroll',()=>$('#siteHeader').classList.toggle('scrolled',window.scrollY>15),{passive:true});
renderProducts(); renderCart(); renderSearch();
