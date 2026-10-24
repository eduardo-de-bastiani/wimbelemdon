/**
 * WimBelemDon - Motor da Aplicação (App Engine)
 * Filosofia de Interação Emil Kowalski
 * Separação estrita de dados e regras de negócio
 */

import { WBD_DATA } from './data.js?v=2';

// --- Chaves de Persistência no LocalStorage ---
const STORAGE_KEYS = {
  VIEW_MODE: 'wbd_view_mode',
  ACCOUNTS: 'wbd_demo_accounts',
  ACTIVE_EMAIL: 'wbd_demo_active_email'
};

// --- Fábrica do Usuário Padrão (Evita compartilhamento de referência em objetos aninhados) ---
function createDefaultUser() {
  return {
    name: "Juliana Silva",
    email: "juliana.silva@exemplo.com",
    phone: "(51) 99876-5432",
    cpf: "012.345.678-99",
    isLoggedIn: true,
    planId: "plano-transformador", // Plano Recomendado
    totalDonated: 49.90,
    joinedDate: "Março 2026",
    redemptions: {}
  };
}

// --- Objeto Global de Estado Reativo Multi-Contas ---
class AppState {
  constructor() {
    this.accounts = this.loadAccounts();
    this.activeEmail = this.loadActiveEmail();
    this.user = this.getActiveUser();
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.currentRedeemingPartner = null;
    this.currentGeneratedCode = null;
    this.hasCopiedCurrentCode = false;
    this.isViewingExistingCode = false;
    this.selectedSingleDonationAmount = 20;
  }

  loadAccounts() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Erro ao carregar contas:", e);
    }
    const def = createDefaultUser();
    return {
      [def.email]: def
    };
  }

  saveAccounts() {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(this.accounts));
    } catch (e) {
      console.error("Erro ao salvar contas:", e);
    }
  }

  loadActiveEmail() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_EMAIL) || "juliana.silva@exemplo.com";
  }

  saveActiveEmail(email) {
    this.activeEmail = email;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_EMAIL, email);
  }

  getActiveUser() {
    const email = (this.activeEmail || "juliana.silva@exemplo.com").trim().toLowerCase();
    if (!this.accounts[email]) {
      const def = createDefaultUser();
      if (email === def.email) {
        this.accounts[email] = def;
      } else {
        const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        this.accounts[email] = {
          name: formattedName || "Apoiador",
          email: email,
          phone: "(51) 99876-5432",
          cpf: "000.000.000-00",
          isLoggedIn: true,
          planId: "plano-transformador",
          totalDonated: 49.90,
          joinedDate: "Outubro 2026",
          redemptions: {}
        };
      }
      this.saveAccounts();
    }
    const u = this.accounts[email];
    if (!u.redemptions) u.redemptions = {};
    return u;
  }

  get redemptions() {
    if (!this.user) return {};
    if (!this.user.redemptions) this.user.redemptions = {};
    return this.user.redemptions;
  }

  set redemptions(val) {
    if (this.user) {
      this.user.redemptions = val || {};
      this.saveUser();
    }
  }

  saveUser() {
    if (this.user && this.user.email) {
      this.accounts[this.user.email] = { ...this.user };
      this.saveAccounts();
    }
  }

  saveRedemptions() {
    this.saveUser();
  }

  loginUser(email) {
    const cleanEmail = (email || "juliana.silva@exemplo.com").trim().toLowerCase();
    this.saveActiveEmail(cleanEmail);
    if (!this.accounts[cleanEmail]) {
      const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      this.accounts[cleanEmail] = {
        name: formattedName || "Apoiador",
        email: cleanEmail,
        phone: "(51) 99876-5432",
        cpf: "000.000.000-00",
        isLoggedIn: true,
        planId: "plano-transformador",
        totalDonated: 49.90,
        joinedDate: "Outubro 2026",
        redemptions: {} // Nova conta: 0 resgates, todos cupons disponíveis
      };
      this.saveAccounts();
    }
    this.user = this.accounts[cleanEmail];
    this.user.isLoggedIn = true;
    if (!this.user.redemptions) this.user.redemptions = {};
    this.saveUser();
    return this.user;
  }

  registerUser(name, email, phone, cpf) {
    const cleanEmail = (email || "").trim().toLowerCase();
    this.saveActiveEmail(cleanEmail);
    this.accounts[cleanEmail] = {
      name: name || "Novo Apoiador",
      email: cleanEmail,
      phone: phone || "(51) 99999-9999",
      cpf: cpf || "000.000.000-00",
      isLoggedIn: true,
      planId: "plano-transformador", // Inicia com plano ativo para permitir resgatar cupons imediatamente
      totalDonated: 49.90,
      joinedDate: "Outubro 2026",
      redemptions: {} // Conta nova: TODOS os cupons 100% disponíveis
    };
    this.saveAccounts();
    this.user = this.accounts[cleanEmail];
    return this.user;
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_EMAIL);
    localStorage.removeItem('wbd_demo_accounts');
    localStorage.removeItem('wbd_demo_active_email');
    localStorage.removeItem('wbd_coupon_redemptions');
    localStorage.removeItem('wbd_user_session');

    const def = createDefaultUser();
    this.accounts = {
      [def.email]: def
    };
    this.activeEmail = def.email;
    this.user = this.accounts[def.email];
    this.user.isLoggedIn = true;
    this.user.redemptions = {};
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.currentRedeemingPartner = null;
    this.currentGeneratedCode = null;
    this.hasCopiedCurrentCode = false;
    this.isViewingExistingCode = false;

    this.saveAccounts();
    this.saveActiveEmail(this.activeEmail);
  }

  getTotalRedeemedCount() {
    return Object.values(this.redemptions).reduce((acc, curr) => acc + (curr.count || 0), 0);
  }
}

const state = new AppState();

// --- Instância do Mapa Leaflet ---
let osmLeafletMap = null;

// ==========================================================================
// UTILITÁRIOS & HELPERS
// ==========================================================================

function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

// Gera código alfanumérico no padrão varejo (ex: WBD-9K2M-7P4Q)
function generateCouponCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sem O/0/I/1 para clareza
  let part1 = '';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `WBD-${part1}-${part2}`;
}

// Retorna "1 de [próximo mês]"
function getNextMonthFirstDay() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthName = nextMonth.toLocaleDateString('pt-BR', { month: 'long' });
  return `1 de ${monthName}`;
}

// Relógio em tempo real da barra de status
function updateClock() {
  const clockEl = document.getElementById('deviceClock');
  if (!clockEl) return;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  clockEl.textContent = `${hours}:${minutes}`;
}

// Toast de Notificação Tátil
let toastTimeout = null;
function showToast(message, iconName = 'check-circle-2') {
  const toast = document.getElementById('appToast');
  const toastMessage = document.getElementById('toastMessage');
  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('active');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('active');
  }, 3200);

  refreshLucideIcons();
}

function refreshLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// ==========================================================================
// ROTEADOR DE TELAS & ABAS
// ==========================================================================

function showScreen(screenId) {
  document.querySelectorAll('.app-screen').forEach(screen => {
    screen.classList.remove('active');
  });

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }

  // Se abriu a tela principal, garante que o mapa seja redimensionado
  if (screenId === 'screenMain') {
    setTimeout(initOrRefreshMap, 300);
  }

  refreshLucideIcons();
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(tab => {
    tab.classList.remove('active');
  });

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    }
  });

  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  // Rola para o topo suavemente
  const viewport = document.getElementById('tabsViewport');
  if (viewport) viewport.scrollTop = 0;

  if (tabId === 'tabHome') {
    setTimeout(initOrRefreshMap, 200);
  }

  refreshLucideIcons();
}

// ==========================================================================
// RENDERIZAÇÃO: ABA 1 (HOME)
// ==========================================================================

function renderHomeScreen() {
  const userNameEl = document.getElementById('welcomeUserName');
  const homePlanDisplay = document.getElementById('homePlanDisplay');
  const avatarText = document.getElementById('headerAvatarText');
  const planDot = document.getElementById('headerPlanDot');

  if (userNameEl) {
    const firstName = (state.user.name || "Apoiador").split(' ')[0];
    userNameEl.textContent = firstName;
  }

  if (avatarText) {
    avatarText.textContent = (state.user.name || "W")[0].toUpperCase();
  }

  if (homePlanDisplay) {
    if (state.user.planId) {
      const plan = WBD_DATA.plans.find(p => p.id === state.user.planId);
      if (plan) {
        homePlanDisplay.textContent = plan.name;
        homePlanDisplay.style.color = "#bbf847";
        if (planDot) planDot.style.display = "block";
      } else if (state.user.planId === 'doacao-unica') {
        homePlanDisplay.textContent = "Apoiador (Doação Avulsa)";
        homePlanDisplay.style.color = "#bbf847";
        if (planDot) planDot.style.display = "block";
      }
    } else {
      homePlanDisplay.textContent = "Sem plano ativo (Explorador)";
      homePlanDisplay.style.color = "#e2e8e8";
      if (planDot) planDot.style.display = "none";
    }
  }

  // Notícias Reais
  const newsContainer = document.getElementById('newsContainer');
  if (newsContainer) {
    newsContainer.innerHTML = WBD_DATA.news.map(item => `
      <article class="news-card">
        <div class="news-meta">
          <span class="news-tag">${item.category}</span>
          <span class="news-date">${item.date} • ${item.readTime}</span>
        </div>
        <h5 class="news-title">${item.title}</h5>
        <p class="news-summary">${item.summary}</p>
      </article>
    `).join('');
  }

  // Embaixadores
  const ambContainer = document.getElementById('ambassadorsContainer');
  if (ambContainer) {
    ambContainer.innerHTML = WBD_DATA.institution.ambassadors.map(amb => `
      <div class="ambassador-item">
        <div class="ambassador-name">${amb.name}</div>
        <div class="ambassador-role">${amb.role}</div>
        <div class="ambassador-quote">"${amb.quote}"</div>
      </div>
    `).join('');
  }

  refreshLucideIcons();
}

// Inicializa o mapa com Leaflet na sede de Belém Novo
function initOrRefreshMap() {
  const mapEl = document.getElementById('osmMap');
  if (!mapEl || !window.L) return;

  const lat = WBD_DATA.institution.address.lat;
  const lng = WBD_DATA.institution.address.lng;

  if (!osmLeafletMap) {
    osmLeafletMap = window.L.map('osmMap', {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(osmLeafletMap);

    // Marcador com cor oficial da marca
    const customIcon = window.L.divIcon({
      className: 'wbd-map-pin',
      html: `<div style="
        background: #0e6872;
        border: 2px solid #82b700;
        border-radius: 50%;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(14,104,114,0.4);
        color: white;
        font-weight: bold;
        font-size: 11px;
      ">WBD</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = window.L.marker([lat, lng], { icon: customIcon }).addTo(osmLeafletMap);
    marker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px;">
        <strong style="color: #0e6872;">Sociedade WimBelemDon</strong><br>
        Av. Heitor Viêira, 68 - Belém Novo
      </div>
    `);
  } else {
    osmLeafletMap.invalidateSize();
  }
}

// ==========================================================================
// RENDERIZAÇÃO: ABA 2 (CUPONS)
// ==========================================================================

function renderCategoryChips() {
  const chipsContainer = document.getElementById('categoryChips');
  if (!chipsContainer) return;

  chipsContainer.innerHTML = WBD_DATA.categories.map(cat => {
    const isActive = cat.id === state.activeCategory ? 'active' : '';
    return `
      <button class="category-chip-btn ${isActive}" data-category="${cat.id}">
        <i data-lucide="${cat.icon}" style="width: 14px; height: 14px;"></i>
        <span>${cat.label}</span>
      </button>
    `;
  }).join('');

  chipsContainer.querySelectorAll('.category-chip-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const catId = e.currentTarget.getAttribute('data-category');
      state.activeCategory = catId;
      renderCategoryChips();
      renderCouponsList();
    });
  });

  refreshLucideIcons();
}

function renderCouponsList() {
  const container = document.getElementById('couponsList');
  if (!container) return;

  const userPlanId = state.user.planId || 'plano-amigo';
  const userPlan = WBD_DATA.plans.find(p => p.id === userPlanId) || WBD_DATA.plans[0];

  // Filtra parceiros por categoria e texto de busca
  const filtered = WBD_DATA.partners.filter(partner => {
    const matchesCategory = state.activeCategory === 'all' || partner.category === state.activeCategory;
    const query = state.searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      partner.name.toLowerCase().includes(query) || 
      partner.location.toLowerCase().includes(query) ||
      partner.tagline.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 32px 16px; color: var(--wbd-text-muted);">
        <i data-lucide="ticket-x" style="width: 36px; height: 36px; color: var(--wbd-text-subtle); margin-bottom: 8px;"></i>
        <p style="font-size: 14px; font-weight: 600;">Nenhum cupom encontrado com esse filtro.</p>
        <p style="font-size: 12px; margin-top: 4px;">Tente buscar por outro termo ou categoria.</p>
      </div>
    `;
    refreshLucideIcons();
    return;
  }

  container.innerHTML = filtered.map(partner => {
    // Cálculo de cota mensal permitida para o plano atual
    let allowedQuota = partner.discounts ? userPlan.redemptionsPerPartner : 1;
    if (userPlanId === 'plano-padrinho' && partner.supportsDoubleInTopPlan) {
      allowedQuota = 2;
    }

    // Histórico de resgate do parceiro
    const partnerRedemption = state.redemptions[partner.id] || { count: 0, codes: [] };
    const currentRedeemed = partnerRedemption.count || 0;
    const remainingQuota = Math.max(0, allowedQuota - currentRedeemed);
    const isDepleted = remainingQuota === 0;

    // Percentual de desconto a exibir
    const discountText = partner.discounts[userPlanId] || partner.discounts['plano-amigo'] || '10% OFF';
    const discountNum = partner.discountPercent[userPlanId] || 10;

    return `
      <article class="voucher-card ${isDepleted ? 'depleted' : ''}">
        <!-- Parte Superior do Voucher -->
        <div class="voucher-main">
          <div class="voucher-discount-badge">
            <span class="voucher-discount-num">${discountNum}%</span>
            <span class="voucher-discount-off">${isDepleted ? 'USADO' : 'OFF'}</span>
          </div>

          <div class="voucher-info">
            <div class="voucher-category-row">
              <span class="voucher-category-name">${partner.category}</span>
              <span class="voucher-quota-badge ${isDepleted ? 'depleted-badge' : 'available'}">
                ${isDepleted ? '✓ Resgatado este mês' : `${remainingQuota} resgate${remainingQuota > 1 ? 's' : ''} disponível`}
              </span>
            </div>
            <h5 class="voucher-partner-name">${partner.name}</h5>
            <p class="voucher-tagline">${partner.tagline}</p>
          </div>
        </div>

        <!-- Divisória Picotada Estilo Ticket -->
        <div class="voucher-divider-row" aria-hidden="true">
          <div class="voucher-cutout-left"></div>
          <div class="voucher-dashed-line"></div>
          <div class="voucher-cutout-right"></div>
        </div>

        <!-- Rodapé com Ação -->
        <div class="voucher-footer">
          <div class="voucher-location">
            <i data-lucide="map-pin" style="width: 13px; height: 13px;"></i>
            <span>${partner.location}</span>
          </div>

          <div>
            ${isDepleted ? `
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                <span class="voucher-next-available">
                  <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
                  <span>Disponível em ${getNextMonthFirstDay()}</span>
                </span>
                <button class="btn-view-code" data-view-code="${partner.id}">
                  <i data-lucide="eye" style="width: 13px; height: 13px;"></i>
                  <span>Ver Código Gerado</span>
                </button>
              </div>
            ` : `
              <button class="btn-redeem-coupon" data-redeem-partner="${partner.id}">
                <i data-lucide="ticket" style="width: 14px; height: 14px;"></i>
                <span>Resgatar Cupom</span>
              </button>
            `}
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Event Listeners dos botões de resgate
  container.querySelectorAll('[data-redeem-partner]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const partnerId = e.currentTarget.getAttribute('data-redeem-partner');
      handleRedeemCouponClick(partnerId);
    });
  });

  // Event Listeners dos botões de visualizar código já gerado
  container.querySelectorAll('[data-view-code]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const partnerId = e.currentTarget.getAttribute('data-view-code');
      handleViewExistingCodeClick(partnerId);
    });
  });

  refreshLucideIcons();
}

// ==========================================================================
// RENDERIZAÇÃO: ABA 3 (PLANOS & DOAÇÃO ÚNICA)
// ==========================================================================

function renderPlansScreen() {
  const carousel = document.getElementById('plansCarousel');
  if (!carousel) return;

  carousel.innerHTML = WBD_DATA.plans.map(plan => {
    const isCurrent = state.user.planId === plan.id;
    return `
      <div class="plan-card ${plan.isRecommended ? 'recommended' : ''}" data-plan-id="${plan.id}">
        ${plan.highlightBadge ? `<div class="plan-badge-top">${plan.highlightBadge}</div>` : ''}
        
        <h4 class="plan-name">${plan.name}</h4>
        
        <div class="plan-price-row">
          <span class="plan-currency">R$</span>
          <span class="plan-price">${plan.monthlyFee.toFixed(2).replace('.', ',')}</span>
          <span class="plan-period">/mês</span>
        </div>

        <div class="plan-discount-highlight">
          <i data-lucide="percent" style="width: 13px; height: 13px;"></i>
          <span>${plan.discountRange}</span>
        </div>

        <div class="plan-quota-badge">
          <i data-lucide="calendar"></i>
          <span>${plan.quotaRule}</span>
        </div>

        <p class="plan-desc">${plan.description}</p>

        <div class="plan-section-label">Descontos nos Parceiros:</div>
        <div class="plan-partners-list">
          ${WBD_DATA.partners.map(partner => {
            const discount = partner.discounts[plan.id] || "5% OFF";
            const isDouble = plan.id === 'plano-padrinho' && partner.supportsDoubleInTopPlan;
            return `
              <div class="plan-partner-row">
                <div class="plan-partner-name-wrapper">
                  <span class="plan-partner-name">${partner.name}</span>
                  ${isDouble ? `<span class="plan-partner-extra">★ Permite 2 resgates/mês</span>` : ''}
                </div>
                <span class="plan-partner-badge">${discount}</span>
              </div>
            `;
          }).join('')}
        </div>

        <button class="btn-select-plan ${isCurrent ? 'current-plan' : ''}" data-select-plan="${plan.id}">
          ${isCurrent ? '✓ Seu Plano Atual' : 'Escolher este Plano'}
        </button>
      </div>
    `;
  }).join('');

  // Atualiza indicadores de bolinha ao rolar
  carousel.addEventListener('scroll', () => {
    const scrollLeft = carousel.scrollLeft;
    const cardWidth = 316; // 300 + 16 gap
    const activeIndex = Math.min(2, Math.max(0, Math.round(scrollLeft / cardWidth)));
    
    document.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  });

  // Ação de seleção de plano
  carousel.querySelectorAll('[data-select-plan]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const planId = e.currentTarget.getAttribute('data-select-plan');
      selectUserPlan(planId);
    });
  });

  // Predefinições da Doação Única
  const presetContainer = document.getElementById('donationPresets');
  const customInput = document.getElementById('customDonationInput');

  if (presetContainer && customInput) {
    presetContainer.querySelectorAll('.preset-amount-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = parseFloat(e.currentTarget.getAttribute('data-amount'));
        state.selectedSingleDonationAmount = val;
        customInput.value = val;

        presetContainer.querySelectorAll('.preset-amount-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    customInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) || 0;
      state.selectedSingleDonationAmount = val;

      presetContainer.querySelectorAll('.preset-amount-btn').forEach(b => {
        const btnVal = parseFloat(b.getAttribute('data-amount'));
        b.classList.toggle('active', btnVal === val);
      });
    });
  }

  refreshLucideIcons();
}

function selectUserPlan(planId) {
  const plan = WBD_DATA.plans.find(p => p.id === planId);
  if (!plan) return;

  state.user.planId = planId;
  // Adiciona a primeira mensalidade ao total doado se alterou de plano
  state.user.totalDonated = (state.user.totalDonated || 0) + plan.monthlyFee;
  state.saveUser();

  renderHomeScreen();
  renderPlansScreen();
  renderCouponsList();
  updateProfileDrawerUI();

  showToast(`Plano alterado para ${plan.name}! Benefícios ativados.`);
}

function handleConfirmSingleDonation() {
  const amount = state.selectedSingleDonationAmount;
  if (!amount || amount < 1) {
    showToast("Por favor, insira um valor a partir de R$ 1,00.", "alert-circle");
    return;
  }

  state.user.totalDonated = (state.user.totalDonated || 0) + amount;
  if (!state.user.planId) {
    state.user.planId = 'doacao-unica';
  }
  state.saveUser();

  renderHomeScreen();
  renderPlansScreen();
  renderCouponsList();
  updateProfileDrawerUI();

  showToast(`Doação de ${formatCurrency(amount)} confirmada! Muito obrigado por apoiar a WimBelemDon.`);
}

// ==========================================================================
// RESGATE DE CUPOM & POP-UP COM CÓDIGO
// ==========================================================================

function handleRedeemCouponClick(partnerId) {
  // Intent-Gate: se o usuário não tiver nenhum plano ativo
  if (!state.user.planId) {
    openWelcomeSheet();
    showToast("Escolha um plano de apoio para liberar o resgate de cupons.", "info");
    return;
  }

  const partner = WBD_DATA.partners.find(p => p.id === partnerId);
  if (!partner) return;

  state.currentRedeemingPartner = partner;
  state.currentGeneratedCode = generateCouponCode();
  state.hasCopiedCurrentCode = false;

  const modalOverlay = document.getElementById('couponModalOverlay');
  const modalTitle = document.getElementById('modalCouponTitle');
  const modalDesc = document.getElementById('modalCouponPartner');
  const modalCode = document.getElementById('modalCouponCode');
  const copyBtn = document.getElementById('btnCopyCouponCode');
  const copyLabel = document.getElementById('copyBtnLabel');
  const closeBtn = document.getElementById('btnCloseCouponModal');
  const copyHint = document.getElementById('copyHintText');

  if (modalTitle) modalTitle.textContent = "Cupom Pronto para Uso!";
  if (modalDesc) {
    modalDesc.innerHTML = `Apresente este código no caixa do <strong>${partner.name}</strong> (${partner.location}) para ativar seu desconto.`;
  }
  if (modalCode) modalCode.textContent = state.currentGeneratedCode;

  // Estado inicial do botão de fechar: bloqueado até copiar
  if (closeBtn) {
    closeBtn.classList.remove('unlocked');
  }
  if (copyHint) {
    copyHint.style.display = 'block';
  }
  if (copyBtn) {
    copyBtn.classList.remove('copied');
  }
  if (copyLabel) {
    copyLabel.textContent = "Copiar Código de Desconto";
  }

  if (modalOverlay) {
    modalOverlay.classList.add('active');
  }

  refreshLucideIcons();
}

function handleViewExistingCodeClick(partnerId) {
  const partner = WBD_DATA.partners.find(p => p.id === partnerId);
  const redemption = state.redemptions[partnerId];
  if (!partner || !redemption || !redemption.codes.length) return;

  const lastCode = redemption.codes[redemption.codes.length - 1];

  // Configura estado para permitir cópia e feedback sem re-incrementar cota
  state.currentRedeemingPartner = partner;
  state.currentGeneratedCode = lastCode;
  state.isViewingExistingCode = true;
  state.hasCopiedCurrentCode = false;

  const modalOverlay = document.getElementById('couponModalOverlay');
  const modalTitle = document.getElementById('modalCouponTitle');
  const modalDesc = document.getElementById('modalCouponPartner');
  const modalCode = document.getElementById('modalCouponCode');
  const copyBtn = document.getElementById('btnCopyCouponCode');
  const copyLabel = document.getElementById('copyBtnLabel');
  const closeBtn = document.getElementById('btnCloseCouponModal');
  const copyHint = document.getElementById('copyHintText');

  if (modalTitle) modalTitle.textContent = "Seu Código Ativo";
  if (modalDesc) {
    modalDesc.innerHTML = `Código já resgatado este mês para uso no <strong>${partner.name}</strong>:`;
  }
  if (modalCode) modalCode.textContent = lastCode;

  // Reseta visual do botão de cópia
  if (copyBtn) copyBtn.classList.remove('copied');
  if (copyLabel) copyLabel.textContent = "Copiar Código de Desconto";

  // Como é visualização de código anterior, permite fechar ou copiar
  if (closeBtn) closeBtn.classList.add('unlocked');
  if (copyHint) copyHint.style.display = 'none';

  if (modalOverlay) modalOverlay.classList.add('active');

  refreshLucideIcons();
}

function handleCopyCouponCode() {
  if (!state.currentGeneratedCode) return;

  // Copia para a área de transferência
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(state.currentGeneratedCode).catch(e => console.warn(e));
  }

  state.hasCopiedCurrentCode = true;

  // Micro-interação de feedback Emil Kowalski
  const copyBtn = document.getElementById('btnCopyCouponCode');
  const copyLabel = document.getElementById('copyBtnLabel');
  const closeBtn = document.getElementById('btnCloseCouponModal');
  const copyHint = document.getElementById('copyHintText');

  if (copyBtn) copyBtn.classList.add('copied');
  if (copyLabel) copyLabel.textContent = "✓ Código Copiado!";

  // Desbloqueia o botão de fechar imediatamente com transição suave
  if (closeBtn) {
    closeBtn.classList.add('unlocked');
  }
  if (copyHint) {
    copyHint.textContent = "✓ Código pronto na área de transferência. Você já pode fechar.";
    copyHint.style.color = "var(--wbd-teal)";
    copyHint.style.display = 'block';
  }

  // Registra o resgate no estado APENAS se for um resgate novo (não na visualização)
  if (state.currentRedeemingPartner && !state.isViewingExistingCode) {
    const pId = state.currentRedeemingPartner.id;
    if (!state.redemptions[pId]) {
      state.redemptions[pId] = { count: 0, codes: [] };
    }
    state.redemptions[pId].count += 1;
    state.redemptions[pId].codes.push(state.currentGeneratedCode);
    state.saveRedemptions();

    renderCouponsList();
    updateProfileDrawerUI();
  }

  // SEMPRE dispara o toast de feedback tátil
  showToast("Código copiado! Cole ou mostre no estabelecimento.");
  refreshLucideIcons();
}

function closeCouponModal() {
  const modalOverlay = document.getElementById('couponModalOverlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
  state.currentRedeemingPartner = null;
  state.currentGeneratedCode = null;
  state.isViewingExistingCode = false;
}

// ==========================================================================
// SCROLL POR ARRASTE DO MOUSE (DRAG-TO-SCROLL & WHEEL) NO DESKTOP
// ==========================================================================

function enableHorizontalDragAndWheelScroll(container) {
  if (!container) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let isDragging = false;

  container.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDown = true;
    isDragging = false;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    container.classList.remove('is-dragging');
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 4) {
      isDragging = true;
      container.classList.add('is-dragging');
    }
    if (isDragging) {
      e.preventDefault();
      container.scrollLeft = scrollLeft - walk;
    }
  });

  // Previne cliques acidentais em cards/botões durante o arraste
  container.addEventListener('click', (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      isDragging = false;
    }
  }, true);

  // Roda do mouse convencional sobre o carrossel/chips scrolla na horizontal
  container.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      container.scrollLeft += e.deltaY * 0.9;
    }
  }, { passive: false });
}

function initScrollGestures() {
  enableHorizontalDragAndWheelScroll(document.getElementById('plansCarousel'));
  enableHorizontalDragAndWheelScroll(document.getElementById('categoryChips'));
  enableHorizontalDragAndWheelScroll(document.getElementById('ambassadorsContainer'));
}

// ==========================================================================
// ABA LATERAL DE PERFIL (DRAWER)
// ==========================================================================

function openProfileDrawer() {
  updateProfileDrawerUI();
  const drawer = document.getElementById('profileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.add('active');
  if (backdrop) backdrop.classList.add('active');
  refreshLucideIcons();
}

function closeProfileDrawer() {
  const drawer = document.getElementById('profileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
}

function updateProfileDrawerUI() {
  const drawerName = document.getElementById('drawerUserName');
  const drawerEmail = document.getElementById('drawerUserEmail');
  const drawerAvatar = document.getElementById('drawerAvatar');
  const drawerPlan = document.getElementById('drawerUserPlan');
  const totalDonated = document.getElementById('profileTotalDonated');
  const couponsUsed = document.getElementById('profileCouponsUsed');

  if (drawerName) drawerName.textContent = state.user.name || "Apoiador";
  if (drawerEmail) drawerEmail.textContent = state.user.email || "contato@wimbelemdon.com.br";
  if (drawerAvatar) drawerAvatar.textContent = (state.user.name || "W")[0].toUpperCase();

  if (drawerPlan) {
    if (state.user.planId) {
      const plan = WBD_DATA.plans.find(p => p.id === state.user.planId);
      drawerPlan.textContent = plan ? plan.name : "Doação Avulsa";
      drawerPlan.style.background = "var(--wbd-lime-light)";
      drawerPlan.style.color = "var(--wbd-lime-dark)";
    } else {
      drawerPlan.textContent = "Sem Plano Ativo";
      drawerPlan.style.background = "#f0f3f3";
      drawerPlan.style.color = "var(--wbd-text-muted)";
    }
  }

  if (totalDonated) {
    totalDonated.textContent = formatCurrency(state.user.totalDonated || 0);
  }

  if (couponsUsed) {
    couponsUsed.textContent = state.getTotalRedeemedCount();
  }
}

// Modal de Edição de Informações
function openEditProfileModal() {
  const modal = document.getElementById('editProfileModalOverlay');
  const nameInput = document.getElementById('editName');
  const emailInput = document.getElementById('editEmail');
  const phoneInput = document.getElementById('editPhone');
  const cpfInput = document.getElementById('editCpf');

  if (nameInput) nameInput.value = state.user.name || '';
  if (emailInput) emailInput.value = state.user.email || '';
  if (phoneInput) phoneInput.value = state.user.phone || '';
  if (cpfInput) cpfInput.value = state.user.cpf || '';

  if (modal) modal.classList.add('active');
}

function closeEditProfileModal() {
  const modal = document.getElementById('editProfileModalOverlay');
  if (modal) modal.classList.remove('active');
}

function handleSaveProfileEdit(e) {
  e.preventDefault();
  const oldEmail = state.user.email;
  const newEmail = (document.getElementById('editEmail').value || '').trim().toLowerCase();

  state.user.name = document.getElementById('editName').value.trim();
  state.user.email = newEmail;
  state.user.phone = document.getElementById('editPhone').value.trim();
  state.user.cpf = document.getElementById('editCpf').value.trim();

  if (oldEmail && oldEmail !== newEmail) {
    delete state.accounts[oldEmail];
    state.saveActiveEmail(newEmail);
  }
  state.saveUser();

  updateProfileDrawerUI();
  renderHomeScreen();
  closeEditProfileModal();
  showToast("Informações do perfil atualizadas com sucesso!");
}

// ==========================================================================
// SOFT PAYWALL / BOTTOM SHEET DE BOAS-VINDAS
// ==========================================================================

function openWelcomeSheet() {
  const sheet = document.getElementById('welcomeSheetOverlay');
  if (sheet) sheet.classList.add('active');
  refreshLucideIcons();
}

function closeWelcomeSheet() {
  const sheet = document.getElementById('welcomeSheetOverlay');
  if (sheet) sheet.classList.remove('active');
}

// ==========================================================================
// MODO DE VISUALIZAÇÃO (DESKTOP MOCKUP VS FULLSCREEN)
// ==========================================================================

function initViewModeToggle() {
  const btn = document.getElementById('viewModeToggle');
  const label = document.getElementById('viewModeLabel');
  if (!btn || !label) return;

  const savedMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
  if (savedMode === 'fullscreen') {
    document.body.classList.add('fullscreen-mode');
    label.textContent = "Modo Janela";
  }

  btn.addEventListener('click', () => {
    const isFullscreen = document.body.classList.toggle('fullscreen-mode');
    label.textContent = isFullscreen ? "Modo Janela" : "Modo Celular";
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, isFullscreen ? 'fullscreen' : 'frame');
    setTimeout(initOrRefreshMap, 200);
  });
}

// ==========================================================================
// INICIALIZAÇÃO GERAL E EVENT LISTENERS
// ==========================================================================

function setupEventListeners() {
  // Splash Screen: toque avança de imediato
  const splash = document.getElementById('screenSplash');
  if (splash) {
    splash.addEventListener('click', () => {
      advanceFromSplash();
    });
  }

  // Auto-avanço da Splash após 1.8 segundos
  setTimeout(() => {
    advanceFromSplash();
  }, 1800);

  function advanceFromSplash() {
    if (!splash || !splash.classList.contains('active')) return;
    if (state.user.isLoggedIn) {
      showScreen('screenMain');
    } else {
      showScreen('screenAuth');
    }
  }

  // Tabs do Controle Segmentado de Autenticação (Login / Cadastro)
  const btnLoginTab = document.getElementById('segBtnLogin');
  const btnRegisterTab = document.getElementById('segBtnRegister');
  const formLogin = document.getElementById('formLogin');
  const formRegister = document.getElementById('formRegister');

  if (btnLoginTab && btnRegisterTab) {
    btnLoginTab.addEventListener('click', () => {
      btnLoginTab.classList.add('active');
      btnRegisterTab.classList.remove('active');
      formLogin.classList.add('active');
      formRegister.classList.remove('active');
    });

    btnRegisterTab.addEventListener('click', () => {
      btnRegisterTab.classList.add('active');
      btnLoginTab.classList.remove('active');
      formRegister.classList.add('active');
      formLogin.classList.remove('active');
    });
  }

  // Preenchimento Rápido para Apresentação
  const btnQuick = document.getElementById('btnQuickDemoLogin');
  if (btnQuick) {
    btnQuick.addEventListener('click', () => {
      document.getElementById('loginEmail').value = "juliana.silva@exemplo.com";
      document.getElementById('loginPassword').value = "wimbelemdon2026";
      showToast("Credenciais de demonstração preenchidas!");
    });
  }

  // Submissão do Login
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('loginEmail');
      const email = emailInput ? emailInput.value.trim() : '';

      state.loginUser(email);

      renderHomeScreen();
      renderCouponsList();
      renderPlansScreen();
      updateProfileDrawerUI();

      showScreen('screenMain');
      showToast(`Bem-vindo(a), ${state.user.name}!`);
    });
  }

  // Submissão do Cadastro
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim() || "Apoiador";
      const email = document.getElementById('regEmail').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const cpf = document.getElementById('regCpf').value.trim();

      state.registerUser(name, email, phone, cpf);

      renderHomeScreen();
      renderCouponsList();
      renderPlansScreen();
      updateProfileDrawerUI();

      showScreen('screenMain');
      showToast(`Conta criada com sucesso! Bem-vindo(a), ${state.user.name}.`);

      // Abre o BottomSheet de Boas-Vindas dispensável
      setTimeout(openWelcomeSheet, 400);
    });
  }

  // Barra de Navegação Inferior (Abas)
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabId = e.currentTarget.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Botão Home "Ver Planos"
  const btnHomeManagePlan = document.getElementById('btnHomeManagePlan');
  if (btnHomeManagePlan) {
    btnHomeManagePlan.addEventListener('click', () => {
      switchTab('tabPlanos');
    });
  }

  // Busca de Cupons com debounce
  const searchInput = document.getElementById('couponSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderCouponsList();
    });
  }

  // Botão de Doação Única
  const btnSingleDonation = document.getElementById('btnConfirmSingleDonation');
  if (btnSingleDonation) {
    btnSingleDonation.addEventListener('click', handleConfirmSingleDonation);
  }

  // Abertura e Fechamento do Drawer de Perfil
  const btnOpenProfile = document.getElementById('btnOpenProfile');
  const btnCloseDrawer = document.getElementById('btnCloseDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');

  if (btnOpenProfile) btnOpenProfile.addEventListener('click', openProfileDrawer);
  if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeProfileDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeProfileDrawer);

  // Ações do Perfil
  const btnEditProfile = document.getElementById('btnEditProfile');
  if (btnEditProfile) btnEditProfile.addEventListener('click', openEditProfileModal);

  const formEdit = document.getElementById('formEditProfile');
  if (formEdit) formEdit.addEventListener('submit', handleSaveProfileEdit);

  const btnCancelEdit = document.getElementById('btnCancelEditProfile');
  if (btnCancelEdit) btnCancelEdit.addEventListener('click', closeEditProfileModal);

  // Logout / Trocar de Conta
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      closeProfileDrawer();
      if (state.user) {
        state.user.isLoggedIn = false;
        state.saveUser();
      }

      // Limpa os formulários para facilitar novo login com outro usuário ou novo cadastro
      const loginEmail = document.getElementById('loginEmail');
      const loginPassword = document.getElementById('loginPassword');
      const regName = document.getElementById('regName');
      const regEmail = document.getElementById('regEmail');
      const regPhone = document.getElementById('regPhone');
      const regCpf = document.getElementById('regCpf');
      const regPassword = document.getElementById('regPassword');

      if (loginEmail) loginEmail.value = '';
      if (loginPassword) loginPassword.value = '';
      if (regName) regName.value = '';
      if (regEmail) regEmail.value = '';
      if (regPhone) regPhone.value = '';
      if (regCpf) regCpf.value = '';
      if (regPassword) regPassword.value = '';

      showScreen('screenAuth');
      showToast("Sessão encerrada. Entre ou crie uma nova conta.");
    });
  }

  // Reset da Demonstração
  const btnReset = document.getElementById('btnResetDemo');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      state.resetAllData();
      closeProfileDrawer();
      renderHomeScreen();
      renderPlansScreen();
      renderCouponsList();
      updateProfileDrawerUI();
      showScreen('screenMain');
      showToast("Demonstração reiniciada! Todos os cupons e cotas foram restaurados.");
    });
  }

  // Modal de Cupom: Copiar e Fechar
  const btnCopyCode = document.getElementById('btnCopyCouponCode');
  if (btnCopyCode) btnCopyCode.addEventListener('click', handleCopyCouponCode);

  const btnCloseCouponModal = document.getElementById('btnCloseCouponModal');
  if (btnCloseCouponModal) {
    btnCloseCouponModal.addEventListener('click', () => {
      if (state.hasCopiedCurrentCode || btnCloseCouponModal.classList.contains('unlocked')) {
        closeCouponModal();
      }
    });
  }

  // Soft Paywall / Sheet
  const btnCloseSheet = document.getElementById('btnCloseWelcomeSheet');
  const btnSheetExplore = document.getElementById('btnSheetExplore');
  const btnSheetGoPlans = document.getElementById('btnSheetGoPlans');

  if (btnCloseSheet) btnCloseSheet.addEventListener('click', closeWelcomeSheet);
  if (btnSheetExplore) btnSheetExplore.addEventListener('click', closeWelcomeSheet);
  if (btnSheetGoPlans) {
    btnSheetGoPlans.addEventListener('click', () => {
      closeWelcomeSheet();
      switchTab('tabPlanos');
    });
  }
}

// Inicialização Principal
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 30000);

  initViewModeToggle();
  renderHomeScreen();
  renderCategoryChips();
  renderCouponsList();
  renderPlansScreen();
  setupEventListeners();
  initScrollGestures();

  refreshLucideIcons();
});
