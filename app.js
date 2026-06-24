const STORAGE_KEY = "al_hashem_market_pos_state_v1";
const CONFIG_KEY = "al_hashem_market_pos_config_v1";

const pages = [
  ["dashboard", "Overview", "📊"],
  ["pos", "POS Cashier", "🧾"],
  ["storefront", "Online Store", "🛒"],
  ["orders", "Orders", "📦"],
  ["delivery", "Delivery", "🛵"],
  ["inventory", "Inventory", "🏷️"],
  ["suppliers", "Suppliers", "🚚"],
  ["customers", "Customers", "👥"],
  ["closing", "Cashier Closing", "💵"],
  ["reports", "Reports", "📈"],
  ["settings", "Supabase Setup", "⚙️"],
];

const demoState = {
  store: {
    name: "Al Hashem Market",
    branch: "Main Branch",
    currency: "USD",
    taxRate: 0,
    deliveryFee: 2.5,
    minimumDeliveryOrder: 8,
  },
  categories: ["Beverages", "Snacks", "Dairy", "Bakery", "Household", "Frozen", "Personal Care"],
  suppliers: [
    { id: "sup-1", name: "Fresh Distribution", contact: "Rami", phone: "+961 70 000 111", balance: 220 },
    { id: "sup-2", name: "Daily Goods Co.", contact: "Maya", phone: "+961 71 000 222", balance: 0 },
  ],
  products: [
    { id: "p-1", sku: "BAR-1001", name: "Water 1.5L", category: "Beverages", price: 0.75, cost: 0.38, stock: 84, lowStock: 20, supplierId: "sup-1", emoji: "💧", active: true },
    { id: "p-2", sku: "BAR-1002", name: "Cola Can", category: "Beverages", price: 1.25, cost: 0.62, stock: 44, lowStock: 12, supplierId: "sup-1", emoji: "🥤", active: true },
    { id: "p-3", sku: "SNK-2001", name: "Potato Chips", category: "Snacks", price: 1.1, cost: 0.52, stock: 29, lowStock: 10, supplierId: "sup-2", emoji: "🍟", active: true },
    { id: "p-4", sku: "DRY-3001", name: "Milk 1L", category: "Dairy", price: 1.65, cost: 0.98, stock: 18, lowStock: 8, supplierId: "sup-1", emoji: "🥛", active: true },
    { id: "p-5", sku: "BAK-4001", name: "Arabic Bread Pack", category: "Bakery", price: 0.9, cost: 0.45, stock: 34, lowStock: 14, supplierId: "sup-2", emoji: "🥖", active: true },
    { id: "p-6", sku: "HOM-5001", name: "Dish Soap", category: "Household", price: 2.4, cost: 1.35, stock: 11, lowStock: 8, supplierId: "sup-2", emoji: "🧼", active: true },
    { id: "p-7", sku: "FRZ-6001", name: "Frozen Fries", category: "Frozen", price: 3.25, cost: 2.05, stock: 9, lowStock: 10, supplierId: "sup-1", emoji: "❄️", active: true },
    { id: "p-8", sku: "PER-7001", name: "Shampoo", category: "Personal Care", price: 4.5, cost: 2.65, stock: 16, lowStock: 6, supplierId: "sup-2", emoji: "🧴", active: true },
  ],
  customers: [
    { id: "c-1", name: "Walk-in Customer", phone: "", address: "", notes: "Default POS customer" },
    { id: "c-2", name: "Nour Haddad", phone: "+961 70 123 456", address: "Hamra, Beirut", notes: "Prefers delivery after 6 PM" },
    { id: "c-3", name: "Karim Youssef", phone: "+961 71 333 444", address: "Verdun, Beirut", notes: "Regular customer" },
  ],
  drivers: [
    { id: "d-1", name: "Ali", phone: "+961 76 111 222", active: true },
    { id: "d-2", name: "Hassan", phone: "+961 78 333 444", active: true },
  ],
  sales: [],
  onlineOrders: [
    { id: "ON-1001", channel: "Online", customerName: "Nour Haddad", phone: "+961 70 123 456", address: "Hamra, Beirut", type: "Delivery", status: "Preparing", driverId: "d-1", paymentMethod: "Cash on Delivery", createdAt: new Date().toISOString(), items: [{ productId: "p-1", name: "Water 1.5L", qty: 4, price: 0.75 }, { productId: "p-3", name: "Potato Chips", qty: 2, price: 1.1 }], subtotal: 5.2, deliveryFee: 2.5, total: 7.7 },
  ],
  stockMovements: [],
  purchaseOrders: [],
  returns: [],
  cashierSession: { id: "SHIFT-001", cashier: "Cashier 1", status: "Open", openingCash: 100, openedAt: new Date().toISOString(), closedAt: null, actualCash: null },
};

let state = loadState();
let activePage = "dashboard";
let cart = [];
let onlineCart = [];
let filters = { productSearch: "", category: "All" };

const view = document.querySelector("#view");
const pageTitle = document.querySelector("#pageTitle");
const toastEl = document.querySelector("#toast");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(demoState);
  } catch {
    return structuredClone(demoState);
  }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadConfig() {
  try { return JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}"); } catch { return {}; }
}
function saveConfig(config) { localStorage.setItem(CONFIG_KEY, JSON.stringify(config)); updateDataMode(); }
function money(value) { return `${state.store.currency} ${Number(value || 0).toFixed(2)}`; }
function uid(prefix) { return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; }
function todayKey(date = new Date()) { return date.toISOString().slice(0, 10); }
function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[ch])); }
function getProduct(id) { return state.products.find(p => p.id === id); }
function getSupplier(id) { return state.suppliers.find(s => s.id === id); }
function orderTotal(items, deliveryFee = 0) { return items.reduce((s, item) => s + item.qty * item.price, 0) + Number(deliveryFee || 0); }
function cartSubtotal(target = cart) { return target.reduce((s, item) => s + item.qty * item.price, 0); }
function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
}
function openModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modalBackdrop.hidden = false;
}
function closeModal() { modalBackdrop.hidden = true; }

document.querySelector("#modalClose").addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", event => { if (event.target === modalBackdrop) closeModal(); });
document.querySelector("#exportBtn").addEventListener("click", exportData);
document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) navigate(pageButton.dataset.page);
});

function initNav() {
  document.querySelector("#mainNav").innerHTML = pages.map(([id, label, icon]) => `
    <button class="nav-btn ${id === activePage ? "active" : ""}" data-page="${id}">
      <span class="nav-icon">${icon}</span><span>${label}</span>
    </button>
  `).join("");
}
function navigate(page) {
  activePage = page;
  initNav();
  pageTitle.textContent = pages.find(p => p[0] === page)?.[1] || "Dashboard";
  render();
}
function render() {
  const map = {
    dashboard: renderDashboard,
    pos: renderPOS,
    storefront: renderStorefront,
    orders: renderOrders,
    delivery: renderDelivery,
    inventory: renderInventory,
    suppliers: renderSuppliers,
    customers: renderCustomers,
    closing: renderClosing,
    reports: renderReports,
    settings: renderSettings,
  };
  map[activePage]();
}

function renderDashboard() {
  const today = todayKey();
  const todaySales = state.sales.filter(s => s.createdAt?.startsWith(today));
  const onlineOpen = state.onlineOrders.filter(o => !["Completed", "Cancelled"].includes(o.status));
  const revenue = todaySales.reduce((s, sale) => s + sale.total, 0);
  const stockValue = state.products.reduce((s, p) => s + p.stock * p.cost, 0);
  const lowStock = state.products.filter(p => p.stock <= p.lowStock);
  const grossProfit = todaySales.reduce((sum, sale) => sum + sale.items.reduce((iSum, item) => {
    const product = getProduct(item.productId);
    return iSum + ((item.price - (product?.cost || 0)) * item.qty);
  }, 0), 0);

  view.innerHTML = `
    <div class="grid cols-4">
      ${metricCard("Today Sales", money(revenue), `${todaySales.length} completed sales`, "Live")}
      ${metricCard("Open Orders", onlineOpen.length, "Online and delivery queue", "Action")}
      ${metricCard("Low Stock", lowStock.length, "Products need reorder", lowStock.length ? "Alert" : "Good")}
      ${metricCard("Stock Value", money(stockValue), "Estimated cost value", "Inventory")}
    </div>
    <div class="grid cols-2">
      <div class="card">
        <div class="toolbar"><h3>Open Online / Delivery Orders</h3><button class="ghost-btn" data-page="orders">View All</button></div>
        <div class="grid">${onlineOpen.slice(0, 4).map(orderCard).join("") || emptyState("No open orders")}</div>
      </div>
      <div class="card">
        <div class="toolbar"><h3>Low Stock Alerts</h3><button class="ghost-btn" data-page="inventory">Inventory</button></div>
        <div class="table-wrap"><table><thead><tr><th>Product</th><th>Stock</th><th>Minimum</th><th>Supplier</th></tr></thead><tbody>
          ${lowStock.map(p => `<tr><td>${p.emoji} ${p.name}<br><small class="muted">${p.sku}</small></td><td><span class="pill danger">${p.stock}</span></td><td>${p.lowStock}</td><td>${getSupplier(p.supplierId)?.name || "-"}</td></tr>`).join("") || `<tr><td colspan="4">All products are above minimum stock.</td></tr>`}
        </tbody></table></div>
      </div>
    </div>
    <div class="grid cols-2">
      <div class="card">${renderBestSellerBars()}</div>
      <div class="card">
        <h3>Today Profit Estimate</h3>
        <p class="muted" style="margin-top:8px">Based on selling price minus product cost.</p>
        <div class="metric" style="margin-top:18px"><div><small>Estimated gross profit</small><strong>${money(grossProfit)}</strong></div><span class="metric-badge">MVP</span></div>
      </div>
    </div>
  `;
}
function metricCard(label, value, subtitle, badge) {
  return `<div class="card metric"><div><small>${label}</small><strong>${value}</strong><small>${subtitle}</small></div><span class="metric-badge">${badge}</span></div>`;
}
function emptyState(message) { return `<div class="card soft"><p class="muted">${message}</p></div>`; }

function renderPOS() {
  const categories = ["All", ...state.categories];
  const products = filteredProducts();
  const subtotal = cartSubtotal();
  const discount = Number(document.querySelector("#discountInput")?.value || 0);
  const tax = (subtotal - discount) * (state.store.taxRate / 100);
  const total = Math.max(0, subtotal - discount + tax);

  view.innerHTML = `
    <div class="pos-layout">
      <div class="card">
        <div class="toolbar">
          <div class="toolbar-left">
            <input class="input" id="productSearch" value="${escapeHtml(filters.productSearch)}" placeholder="Search product name or scan barcode / SKU" style="min-width:280px" />
            <select id="categoryFilter">${categories.map(c => `<option ${filters.category === c ? "selected" : ""}>${c}</option>`).join("")}</select>
          </div>
          <button class="ghost-btn" id="clearCartBtn">Clear Cart</button>
        </div>
        <div class="product-grid">
          ${products.map(product => `
            <button class="product-card ${product.stock <= 0 ? "disabled" : ""}" data-add-product="${product.id}" ${product.stock <= 0 ? "disabled" : ""}>
              <div class="product-image">${product.emoji}</div>
              <div class="product-title">${product.name}</div>
              <div class="product-meta"><span>${product.sku}</span><span>${money(product.price)}</span></div>
              <div class="product-meta"><span>${product.category}</span><span class="${product.stock <= product.lowStock ? "pill danger" : "pill success"}">Stock ${product.stock}</span></div>
            </button>
          `).join("")}
        </div>
      </div>
      <div class="card">
        <div class="toolbar"><h3>Current Cart</h3><span class="pill">${cart.length} lines</span></div>
        <div class="cart-list">${cart.map(cartItem).join("") || emptyState("Add products to begin a sale.")}</div>
        <div class="totals">
          <div class="field"><label>Discount</label><input class="input" id="discountInput" type="number" min="0" step="0.01" value="0" /></div>
          <div class="field"><label>Payment Method</label><select id="paymentMethod"><option>Cash</option><option>Card</option><option>Mixed</option></select></div>
          <div class="total-line"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
          <div class="total-line"><span>Tax ${state.store.taxRate}%</span><strong>${money(tax)}</strong></div>
          <div class="total-line grand"><span>Total</span><strong id="cartTotal">${money(total)}</strong></div>
          <button class="primary-btn" id="completeSaleBtn" ${cart.length ? "" : "disabled"}>Complete Sale</button>
        </div>
      </div>
    </div>
  `;

  document.querySelector("#productSearch").addEventListener("input", e => { filters.productSearch = e.target.value; renderPOS(); });
  document.querySelector("#categoryFilter").addEventListener("change", e => { filters.category = e.target.value; renderPOS(); });
  document.querySelectorAll("[data-add-product]").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.addProduct)));
  document.querySelector("#clearCartBtn").addEventListener("click", () => { cart = []; renderPOS(); });
  document.querySelector("#discountInput").addEventListener("input", updatePOSTotal);
  document.querySelector("#completeSaleBtn").addEventListener("click", completeSale);
  document.querySelectorAll("[data-cart-action]").forEach(btn => btn.addEventListener("click", () => updateCart(btn.dataset.cartAction, btn.dataset.productId)));
}
function filteredProducts() {
  const q = filters.productSearch.trim().toLowerCase();
  return state.products.filter(p => p.active && (filters.category === "All" || p.category === filters.category) && (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)));
}
function addToCart(productId, target = cart) {
  const product = getProduct(productId);
  if (!product || product.stock <= 0) return toast("Product is out of stock");
  const existing = target.find(i => i.productId === productId);
  const currentQty = existing?.qty || 0;
  if (currentQty + 1 > product.stock) return toast("Not enough stock available");
  if (existing) existing.qty += 1;
  else target.push({ productId, name: product.name, sku: product.sku, qty: 1, price: product.price });
  render();
}
function cartItem(item) {
  return `<div class="cart-item"><div class="cart-row"><strong>${item.name}</strong><span>${money(item.price * item.qty)}</span></div><div class="cart-row"><small class="muted">${item.sku}</small><div class="qty-actions"><button data-cart-action="minus" data-product-id="${item.productId}">−</button><strong>${item.qty}</strong><button data-cart-action="plus" data-product-id="${item.productId}">+</button><button data-cart-action="remove" data-product-id="${item.productId}">×</button></div></div></div>`;
}
function updateCart(action, productId) {
  const item = cart.find(i => i.productId === productId);
  if (!item) return;
  if (action === "plus") addToCart(productId, cart);
  if (action === "minus") item.qty = Math.max(1, item.qty - 1);
  if (action === "remove") cart = cart.filter(i => i.productId !== productId);
  renderPOS();
}
function updatePOSTotal() {
  const subtotal = cartSubtotal();
  const discount = Number(document.querySelector("#discountInput")?.value || 0);
  const tax = Math.max(0, subtotal - discount) * (state.store.taxRate / 100);
  document.querySelector("#cartTotal").textContent = money(Math.max(0, subtotal - discount + tax));
}
function completeSale() {
  if (!cart.length) return;
  const discount = Number(document.querySelector("#discountInput")?.value || 0);
  const paymentMethod = document.querySelector("#paymentMethod").value;
  const subtotal = cartSubtotal();
  const tax = Math.max(0, subtotal - discount) * (state.store.taxRate / 100);
  const total = Math.max(0, subtotal - discount + tax);
  const sale = { id: uid("SALE"), channel: "POS", customerName: "Walk-in Customer", createdAt: new Date().toISOString(), items: structuredClone(cart), subtotal, discount, tax, total, paymentMethod, cashierSessionId: state.cashierSession.id };
  for (const item of cart) {
    const product = getProduct(item.productId);
    product.stock -= item.qty;
    state.stockMovements.push({ id: uid("STK"), productId: item.productId, type: "Sale", qty: -item.qty, note: sale.id, createdAt: sale.createdAt });
  }
  state.sales.unshift(sale);
  cart = [];
  saveState();
  syncSaleToSupabase(sale);
  toast(`Sale completed: ${money(total)}`);
  renderPOS();
}

function renderStorefront() {
  const products = state.products.filter(p => p.active && p.stock > 0);
  view.innerHTML = `
    <div class="storefront-layout">
      <div class="grid">
        <div class="store-banner"><p class="eyebrow">Online ordering website</p><h3>${state.store.name}</h3><p>Customer-facing order page for pickup and delivery. No QR menu.</p></div>
        <div class="product-grid">${products.map(p => `<button class="product-card" data-online-add="${p.id}"><div class="product-image">${p.emoji}</div><div class="product-title">${p.name}</div><div class="product-meta"><span>${p.category}</span><span>${money(p.price)}</span></div><div class="product-meta"><span>${p.sku}</span><span>Stock ${p.stock}</span></div></button>`).join("")}</div>
      </div>
      <div class="card">
        <div class="toolbar"><h3>Customer Cart</h3><span class="pill">${onlineCart.length} lines</span></div>
        <div class="cart-list">${onlineCart.map(item => `<div class="cart-item"><div class="cart-row"><strong>${item.name}</strong><span>${money(item.qty * item.price)}</span></div><small class="muted">Qty ${item.qty}</small></div>`).join("") || emptyState("Customer cart is empty.")}</div>
        <div class="totals">
          <div class="field"><label>Order Type</label><select id="onlineType"><option>Delivery</option><option>Pickup</option></select></div>
          <div class="field"><label>Customer Name</label><input class="input" id="onlineCustomer" placeholder="Customer name" /></div>
          <div class="field"><label>Phone</label><input class="input" id="onlinePhone" placeholder="Phone number" /></div>
          <div class="field"><label>Address</label><textarea class="input" id="onlineAddress" rows="3" placeholder="Delivery address"></textarea></div>
          <div class="total-line"><span>Subtotal</span><strong>${money(cartSubtotal(onlineCart))}</strong></div>
          <div class="total-line"><span>Delivery Fee</span><strong>${money(state.store.deliveryFee)}</strong></div>
          <div class="total-line grand"><span>Total</span><strong>${money(cartSubtotal(onlineCart) + state.store.deliveryFee)}</strong></div>
          <button class="primary-btn" id="placeOnlineOrderBtn" ${onlineCart.length ? "" : "disabled"}>Place Online Order</button>
          <button class="ghost-btn" id="clearOnlineCartBtn">Clear Cart</button>
        </div>
      </div>
    </div>
  `;
  document.querySelectorAll("[data-online-add]").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.onlineAdd, onlineCart)));
  document.querySelector("#clearOnlineCartBtn").addEventListener("click", () => { onlineCart = []; renderStorefront(); });
  document.querySelector("#placeOnlineOrderBtn").addEventListener("click", placeOnlineOrder);
}
function placeOnlineOrder() {
  const type = document.querySelector("#onlineType").value;
  const customerName = document.querySelector("#onlineCustomer").value.trim() || "Online Customer";
  const phone = document.querySelector("#onlinePhone").value.trim();
  const address = document.querySelector("#onlineAddress").value.trim();
  if (type === "Delivery" && !address) return toast("Delivery address is required");
  const subtotal = cartSubtotal(onlineCart);
  const deliveryFee = type === "Delivery" ? Number(state.store.deliveryFee) : 0;
  const order = { id: uid("ON"), channel: "Online", customerName, phone, address, type, status: "New", driverId: "", paymentMethod: type === "Delivery" ? "Cash on Delivery" : "Pay at Pickup", createdAt: new Date().toISOString(), items: structuredClone(onlineCart), subtotal, deliveryFee, total: subtotal + deliveryFee };
  state.onlineOrders.unshift(order);
  onlineCart = [];
  saveState();
  syncOrderToSupabase(order);
  toast("Online order created");
  navigate("orders");
}

function renderOrders() {
  view.innerHTML = `<div class="card"><div class="toolbar"><h3>Order Management</h3><button class="ghost-btn" data-page="storefront">Create Online Order</button></div><div class="grid">${state.onlineOrders.map(orderCard).join("") || emptyState("No online orders yet")}</div></div>`;
  document.querySelectorAll("[data-order-status]").forEach(btn => btn.addEventListener("click", () => updateOrderStatus(btn.dataset.orderId, btn.dataset.orderStatus)));
}
function orderCard(order) {
  const steps = order.type === "Delivery" ? ["New", "Accepted", "Preparing", "Ready", "Out for Delivery", "Completed"] : ["New", "Accepted", "Preparing", "Ready", "Completed"];
  const next = nextStatus(order.status, order.type);
  return `<div class="order-card"><div class="order-head"><div><strong>${order.id} · ${order.customerName}</strong><p class="muted">${order.type} · ${order.phone || "No phone"} · ${new Date(order.createdAt).toLocaleString()}</p></div><span class="pill ${order.status === "Completed" ? "success" : order.status === "Cancelled" ? "danger" : "warning"}">${order.status}</span></div><p class="order-items">${order.items.map(i => `${i.qty}× ${i.name}`).join(", ")}</p><div class="timeline">${steps.map(step => `<span class="step ${steps.indexOf(step) <= steps.indexOf(order.status) ? "active" : ""}">${step}</span>`).join("")}</div><div class="cart-row"><strong>${money(order.total)}</strong><div class="action-row">${next ? `<button class="success-btn" data-order-id="${order.id}" data-order-status="${next}">Mark ${next}</button>` : ""}<button class="danger-btn" data-order-id="${order.id}" data-order-status="Cancelled">Cancel</button></div></div></div>`;
}
function nextStatus(status, type) {
  const flow = type === "Delivery" ? ["New", "Accepted", "Preparing", "Ready", "Out for Delivery", "Completed"] : ["New", "Accepted", "Preparing", "Ready", "Completed"];
  const index = flow.indexOf(status);
  return index >= 0 && index < flow.length - 1 ? flow[index + 1] : null;
}
function updateOrderStatus(id, status) {
  const order = state.onlineOrders.find(o => o.id === id);
  if (!order) return;
  order.status = status;
  if (status === "Accepted") {
    for (const item of order.items) {
      const product = getProduct(item.productId);
      if (product) {
        product.stock -= item.qty;
        state.stockMovements.push({ id: uid("STK"), productId: item.productId, type: "Online Order", qty: -item.qty, note: order.id, createdAt: new Date().toISOString() });
      }
    }
  }
  if (status === "Completed") {
    state.sales.unshift({ ...order, channel: "Online", discount: 0, tax: 0, cashierSessionId: state.cashierSession.id });
  }
  saveState();
  syncOrderToSupabase(order);
  toast(`Order ${id} marked ${status}`);
  renderOrders();
}

function renderDelivery() {
  const deliveryOrders = state.onlineOrders.filter(o => o.type === "Delivery");
  view.innerHTML = `<div class="grid cols-2"><div class="card"><h3>Delivery Queue</h3><div class="grid" style="margin-top:14px">${deliveryOrders.map(order => `<div class="order-card"><div class="order-head"><div><strong>${order.id}</strong><p class="muted">${order.customerName} · ${order.address}</p></div><span class="pill warning">${order.status}</span></div><div class="field"><label>Assign Driver</label><select data-driver-select="${order.id}"><option value="">Not assigned</option>${state.drivers.map(d => `<option value="${d.id}" ${order.driverId === d.id ? "selected" : ""}>${d.name}</option>`).join("")}</select></div><div class="cart-row"><span>${money(order.total)}</span><button class="success-btn" data-order-id="${order.id}" data-order-status="Out for Delivery">Send Driver</button></div></div>`).join("") || emptyState("No delivery orders")}</div></div><div class="card"><h3>Drivers</h3><div class="table-wrap" style="margin-top:14px"><table><thead><tr><th>Name</th><th>Phone</th><th>Active Orders</th></tr></thead><tbody>${state.drivers.map(d => `<tr><td>${d.name}</td><td>${d.phone}</td><td>${deliveryOrders.filter(o => o.driverId === d.id && !["Completed", "Cancelled"].includes(o.status)).length}</td></tr>`).join("")}</tbody></table></div></div></div>`;
  document.querySelectorAll("[data-driver-select]").forEach(sel => sel.addEventListener("change", () => { const order = state.onlineOrders.find(o => o.id === sel.dataset.driverSelect); order.driverId = sel.value; saveState(); toast("Driver assigned"); }));
  document.querySelectorAll("[data-order-status]").forEach(btn => btn.addEventListener("click", () => updateOrderStatus(btn.dataset.orderId, btn.dataset.orderStatus)));
}

function renderInventory() {
  view.innerHTML = `<div class="card"><div class="toolbar"><h3>Inventory</h3><button class="primary-btn" id="addProductBtn">Add Product</button></div><div class="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>SKU</th><th>Price</th><th>Cost</th><th>Stock</th><th>Supplier</th><th>Actions</th></tr></thead><tbody>${state.products.map(productRow).join("")}</tbody></table></div></div>`;
  document.querySelector("#addProductBtn").addEventListener("click", openProductModal);
  document.querySelectorAll("[data-adjust-stock]").forEach(btn => btn.addEventListener("click", () => openStockModal(btn.dataset.adjustStock)));
}
function productRow(p) { return `<tr><td>${p.emoji} <strong>${p.name}</strong></td><td>${p.category}</td><td>${p.sku}</td><td>${money(p.price)}</td><td>${money(p.cost)}</td><td><span class="pill ${p.stock <= p.lowStock ? "danger" : "success"}">${p.stock}</span></td><td>${getSupplier(p.supplierId)?.name || "-"}</td><td><button class="ghost-btn" data-adjust-stock="${p.id}">Adjust Stock</button></td></tr>`; }
function openProductModal() {
  openModal("Add Product", `<form id="productForm" class="form-grid"><div class="field"><label>Name</label><input class="input" name="name" required /></div><div class="field"><label>SKU / Barcode</label><input class="input" name="sku" required /></div><div class="field"><label>Category</label><select name="category">${state.categories.map(c => `<option>${c}</option>`).join("")}</select></div><div class="field"><label>Emoji / Icon</label><input class="input" name="emoji" value="🛍️" /></div><div class="field"><label>Selling Price</label><input class="input" name="price" type="number" step="0.01" required /></div><div class="field"><label>Cost</label><input class="input" name="cost" type="number" step="0.01" required /></div><div class="field"><label>Opening Stock</label><input class="input" name="stock" type="number" required /></div><div class="field"><label>Low Stock Alert</label><input class="input" name="lowStock" type="number" value="5" /></div><div class="field full"><label>Supplier</label><select name="supplierId">${state.suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join("")}</select></div><button class="primary-btn full">Save Product</button></form>`);
  document.querySelector("#productForm").addEventListener("submit", e => { e.preventDefault(); const fd = new FormData(e.target); state.products.unshift({ id: uid("P"), active: true, name: fd.get("name"), sku: fd.get("sku"), category: fd.get("category"), emoji: fd.get("emoji") || "🛍️", price: Number(fd.get("price")), cost: Number(fd.get("cost")), stock: Number(fd.get("stock")), lowStock: Number(fd.get("lowStock")), supplierId: fd.get("supplierId") }); saveState(); closeModal(); toast("Product added"); renderInventory(); });
}
function openStockModal(productId) {
  const product = getProduct(productId);
  openModal("Adjust Stock", `<form id="stockForm" class="form-grid"><p class="full muted">${product.name} current stock: ${product.stock}</p><div class="field"><label>Quantity Change</label><input class="input" name="qty" type="number" placeholder="Example: 10 or -2" required /></div><div class="field"><label>Reason</label><select name="type"><option>Manual Adjustment</option><option>Purchase Receive</option><option>Damaged</option><option>Expired</option><option>Return</option></select></div><div class="field full"><label>Note</label><input class="input" name="note" /></div><button class="primary-btn full">Apply Adjustment</button></form>`);
  document.querySelector("#stockForm").addEventListener("submit", e => { e.preventDefault(); const fd = new FormData(e.target); const qty = Number(fd.get("qty")); product.stock += qty; state.stockMovements.unshift({ id: uid("STK"), productId, type: fd.get("type"), qty, note: fd.get("note"), createdAt: new Date().toISOString() }); saveState(); closeModal(); toast("Stock updated"); renderInventory(); });
}

function renderSuppliers() {
  view.innerHTML = `<div class="grid cols-2"><div class="card"><h3>Add Supplier</h3><form id="supplierForm" class="form-grid" style="margin-top:14px"><div class="field"><label>Name</label><input class="input" name="name" required /></div><div class="field"><label>Contact</label><input class="input" name="contact" /></div><div class="field"><label>Phone</label><input class="input" name="phone" /></div><div class="field"><label>Opening Balance</label><input class="input" name="balance" type="number" step="0.01" value="0" /></div><button class="primary-btn full">Save Supplier</button></form></div><div class="card"><h3>Supplier List</h3><div class="table-wrap" style="margin-top:14px"><table><thead><tr><th>Name</th><th>Contact</th><th>Phone</th><th>Balance</th></tr></thead><tbody>${state.suppliers.map(s => `<tr><td>${s.name}</td><td>${s.contact}</td><td>${s.phone}</td><td>${money(s.balance)}</td></tr>`).join("")}</tbody></table></div></div></div>`;
  document.querySelector("#supplierForm").addEventListener("submit", e => { e.preventDefault(); const fd = new FormData(e.target); state.suppliers.unshift({ id: uid("SUP"), name: fd.get("name"), contact: fd.get("contact"), phone: fd.get("phone"), balance: Number(fd.get("balance")) }); saveState(); toast("Supplier saved"); renderSuppliers(); });
}
function renderCustomers() {
  view.innerHTML = `<div class="grid cols-2"><div class="card"><h3>Add Customer</h3><form id="customerForm" class="form-grid" style="margin-top:14px"><div class="field"><label>Name</label><input class="input" name="name" required /></div><div class="field"><label>Phone</label><input class="input" name="phone" /></div><div class="field full"><label>Address</label><textarea class="input" name="address" rows="3"></textarea></div><div class="field full"><label>Notes</label><input class="input" name="notes" /></div><button class="primary-btn full">Save Customer</button></form></div><div class="card"><h3>Customers</h3><div class="table-wrap" style="margin-top:14px"><table><thead><tr><th>Name</th><th>Phone</th><th>Address</th><th>Notes</th></tr></thead><tbody>${state.customers.map(c => `<tr><td>${c.name}</td><td>${c.phone || "-"}</td><td>${c.address || "-"}</td><td>${c.notes || "-"}</td></tr>`).join("")}</tbody></table></div></div></div>`;
  document.querySelector("#customerForm").addEventListener("submit", e => { e.preventDefault(); const fd = new FormData(e.target); state.customers.unshift({ id: uid("C"), name: fd.get("name"), phone: fd.get("phone"), address: fd.get("address"), notes: fd.get("notes") }); saveState(); toast("Customer saved"); renderCustomers(); });
}
function renderClosing() {
  const session = state.cashierSession;
  const sessionSales = state.sales.filter(s => s.cashierSessionId === session.id);
  const cash = sessionSales.filter(s => ["Cash", "Cash on Delivery", "Pay at Pickup"].includes(s.paymentMethod)).reduce((s, sale) => s + sale.total, 0);
  const card = sessionSales.filter(s => s.paymentMethod === "Card").reduce((s, sale) => s + sale.total, 0);
  const expected = Number(session.openingCash || 0) + cash;
  view.innerHTML = `<div class="grid cols-2"><div class="card"><h3>Current Cashier Session</h3><div class="grid cols-2" style="margin-top:14px">${metricCard("Status", session.status, session.cashier, session.id)}${metricCard("Opening Cash", money(session.openingCash), "Started cash", "Cash")}${metricCard("Cash Sales", money(cash), "Expected in drawer", "Cash")}${metricCard("Card Sales", money(card), "Terminal total", "Card")}${metricCard("Expected Cash", money(expected), "Opening + cash sales", "Closing")}${metricCard("Sales Count", sessionSales.length, "This shift", "POS")}</div></div><div class="card"><h3>Close Shift</h3><form id="closeShiftForm" class="form-grid" style="margin-top:14px"><div class="field"><label>Actual Cash</label><input class="input" name="actualCash" type="number" step="0.01" value="${expected.toFixed(2)}" /></div><div class="field"><label>Next Opening Cash</label><input class="input" name="nextOpening" type="number" step="0.01" value="100" /></div><button class="primary-btn full">Close and Open New Shift</button></form></div></div>`;
  document.querySelector("#closeShiftForm").addEventListener("submit", e => { e.preventDefault(); const fd = new FormData(e.target); const actualCash = Number(fd.get("actualCash")); const difference = actualCash - expected; state.cashierSession.status = "Closed"; state.cashierSession.closedAt = new Date().toISOString(); state.cashierSession.actualCash = actualCash; state.cashierSession.difference = difference; state.cashierSession = { id: uid("SHIFT"), cashier: "Cashier 1", status: "Open", openingCash: Number(fd.get("nextOpening")), openedAt: new Date().toISOString(), closedAt: null, actualCash: null }; saveState(); toast(`Shift closed. Difference: ${money(difference)}`); renderClosing(); });
}
function renderReports() {
  const totalSales = state.sales.reduce((s, sale) => s + sale.total, 0);
  const onlineSales = state.sales.filter(s => s.channel === "Online").reduce((s, sale) => s + sale.total, 0);
  const posSales = state.sales.filter(s => s.channel === "POS").reduce((s, sale) => s + sale.total, 0);
  const profit = state.sales.reduce((sum, sale) => sum + sale.items.reduce((iSum, item) => { const product = getProduct(item.productId); return iSum + ((item.price - (product?.cost || 0)) * item.qty); }, 0), 0);
  view.innerHTML = `<div class="grid cols-4">${metricCard("Total Sales", money(totalSales), "All channels", "Sales")}${metricCard("POS Sales", money(posSales), "Cashier", "POS")}${metricCard("Online Sales", money(onlineSales), "Website orders", "Online")}${metricCard("Gross Profit", money(profit), "Estimate", "Profit")}</div><div class="grid cols-2"><div class="card">${renderBestSellerBars()}</div><div class="card"><h3>Payment Summary</h3><div class="bar-list" style="margin-top:14px">${paymentBars()}</div></div></div><div class="card"><h3>Recent Stock Movements</h3><div class="table-wrap" style="margin-top:14px"><table><thead><tr><th>Date</th><th>Product</th><th>Type</th><th>Qty</th><th>Note</th></tr></thead><tbody>${state.stockMovements.slice(0, 20).map(m => `<tr><td>${new Date(m.createdAt).toLocaleString()}</td><td>${getProduct(m.productId)?.name || m.productId}</td><td>${m.type}</td><td>${m.qty}</td><td>${m.note || "-"}</td></tr>`).join("") || `<tr><td colspan="5">No stock movements yet.</td></tr>`}</tbody></table></div></div>`;
}
function renderBestSellerBars() {
  const counts = {};
  for (const sale of state.sales) for (const item of sale.items) counts[item.name] = (counts[item.name] || 0) + item.qty;
  const rows = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, 6);
  const max = Math.max(...rows.map(r => r[1]), 1);
  return `<h3>Best Selling Products</h3><div class="bar-list" style="margin-top:14px">${rows.map(([name, qty]) => `<div class="bar-row"><div class="bar-label"><span>${name}</span><strong>${qty}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${(qty/max)*100}%"></div></div></div>`).join("") || `<p class="muted">No sales yet. Use POS to create the first sale.</p>`}</div>`;
}
function paymentBars() {
  const totals = {};
  for (const sale of state.sales) totals[sale.paymentMethod] = (totals[sale.paymentMethod] || 0) + sale.total;
  const rows = Object.entries(totals);
  const max = Math.max(...rows.map(r => r[1]), 1);
  return rows.map(([method, total]) => `<div class="bar-row"><div class="bar-label"><span>${method}</span><strong>${money(total)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${(total/max)*100}%"></div></div></div>`).join("") || `<p class="muted">No payments yet.</p>`;
}

function renderSettings() {
  const config = loadConfig();
  view.innerHTML = `<div class="grid cols-2"><div class="card"><h3>Supabase Connection</h3><p class="muted" style="margin-top:8px">Static app works without Supabase. Add URL and anon key to enable database sync.</p><form id="configForm" class="form-grid" style="margin-top:14px"><div class="field full"><label>Supabase URL</label><input class="input" name="url" value="${escapeHtml(config.url || "")}" placeholder="https://your-project.supabase.co" /></div><div class="field full"><label>Supabase Anon Key</label><input class="input" name="anonKey" value="${escapeHtml(config.anonKey || "")}" placeholder="eyJ..." /></div><button class="primary-btn">Save Config</button><button class="ghost-btn" type="button" id="testSupabaseBtn">Test Connection</button></form></div><div class="card"><h3>Store Settings</h3><form id="storeForm" class="form-grid" style="margin-top:14px"><div class="field"><label>Store Name</label><input class="input" name="name" value="${escapeHtml(state.store.name)}" /></div><div class="field"><label>Branch</label><input class="input" name="branch" value="${escapeHtml(state.store.branch)}" /></div><div class="field"><label>Currency</label><input class="input" name="currency" value="${escapeHtml(state.store.currency)}" /></div><div class="field"><label>Tax Rate %</label><input class="input" type="number" step="0.01" name="taxRate" value="${state.store.taxRate}" /></div><div class="field"><label>Delivery Fee</label><input class="input" type="number" step="0.01" name="deliveryFee" value="${state.store.deliveryFee}" /></div><div class="field"><label>Minimum Delivery Order</label><input class="input" type="number" step="0.01" name="minimumDeliveryOrder" value="${state.store.minimumDeliveryOrder}" /></div><button class="primary-btn full">Save Store Settings</button></form></div></div><div class="card"><h3>Data Tools</h3><div class="action-row" style="margin-top:14px"><button class="ghost-btn" id="importBtn">Import JSON</button><button class="danger-btn" id="resetBtn">Reset Demo Data</button></div><p class="muted" style="margin-top:10px">Use supabase-schema.sql to create database tables later.</p></div>`;
  document.querySelector("#configForm").addEventListener("submit", e => { e.preventDefault(); const fd = new FormData(e.target); saveConfig({ url: fd.get("url"), anonKey: fd.get("anonKey") }); toast("Supabase config saved"); });
  document.querySelector("#storeForm").addEventListener("submit", e => { e.preventDefault(); const fd = new FormData(e.target); state.store = { ...state.store, name: fd.get("name"), branch: fd.get("branch"), currency: fd.get("currency"), taxRate: Number(fd.get("taxRate")), deliveryFee: Number(fd.get("deliveryFee")), minimumDeliveryOrder: Number(fd.get("minimumDeliveryOrder")) }; saveState(); toast("Store settings saved"); renderSettings(); });
  document.querySelector("#testSupabaseBtn").addEventListener("click", testSupabaseConnection);
  document.querySelector("#resetBtn").addEventListener("click", () => { if (confirm("Reset all local demo data?")) { state = structuredClone(demoState); cart = []; onlineCart = []; saveState(); toast("Demo data reset"); renderSettings(); } });
  document.querySelector("#importBtn").addEventListener("click", importData);
}
async function getSupabaseClient() {
  const config = loadConfig();
  if (!config.url || !config.anonKey) return null;
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  return createClient(config.url, config.anonKey);
}
async function testSupabaseConnection() {
  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return toast("Add Supabase URL and anon key first");
    const { error } = await supabase.from("products").select("id", { count: "exact", head: true });
    if (error) throw error;
    toast("Supabase connection works");
    updateDataMode();
  } catch (error) { toast(`Supabase test failed: ${error.message}`); }
}
async function syncSaleToSupabase(sale) {
  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return;
    await supabase.from("orders").upsert({ id: sale.id, channel: sale.channel, customer_name: sale.customerName, status: "Completed", subtotal: sale.subtotal, discount: sale.discount || 0, tax: sale.tax || 0, delivery_fee: sale.deliveryFee || 0, total: sale.total, payment_method: sale.paymentMethod, cashier_session_id: sale.cashierSessionId, created_at: sale.createdAt });
    await supabase.from("order_items").upsert(sale.items.map(item => ({ id: `${sale.id}-${item.productId}`, order_id: sale.id, product_id: item.productId, product_name: item.name, qty: item.qty, unit_price: item.price, line_total: item.qty * item.price })));
  } catch (error) { console.warn("Supabase sale sync skipped", error); }
}
async function syncOrderToSupabase(order) {
  try {
    const supabase = await getSupabaseClient();
    if (!supabase) return;
    await supabase.from("orders").upsert({ id: order.id, channel: order.channel, customer_name: order.customerName, phone: order.phone, address: order.address, order_type: order.type, status: order.status, subtotal: order.subtotal, delivery_fee: order.deliveryFee, total: order.total, payment_method: order.paymentMethod, driver_id: order.driverId || null, created_at: order.createdAt });
    await supabase.from("order_items").upsert(order.items.map(item => ({ id: `${order.id}-${item.productId}`, order_id: order.id, product_id: item.productId, product_name: item.name, qty: item.qty, unit_price: item.price, line_total: item.qty * item.price })));
  } catch (error) { console.warn("Supabase order sync skipped", error); }
}
function updateDataMode() {
  const config = loadConfig();
  const label = document.querySelector("#dataModeLabel");
  if (label) label.textContent = config.url && config.anonKey ? "Supabase configured" : "Demo mode";
}
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `al-hashem-market-pos-${todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { state = JSON.parse(reader.result); saveState(); toast("Data imported"); render(); }
      catch { toast("Invalid JSON file"); }
    };
    reader.readAsText(file);
  };
  input.click();
}

initNav();
updateDataMode();
render();
