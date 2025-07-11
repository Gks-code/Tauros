 // Products data
const products = [
    {
        id: 1,
        name: "ELFBAR 600 - Morango",
        price: 45.90,
        originalPrice: 55.90,
        image: "img/elfbar600.jpg",
        category: "ELFBAR",
        rating: 4.8,
        reviews: 124,
        description: "ELFBAR 600 puffs com sabor morango intenso",
        inStock: true
    },
    {
        id: 2,
        name: "IGNITE V15 - Menta",
        price: 52.90,
        originalPrice: 62.90,
        image: "img/IGNITEV15.jpg",
        category: "IGNITE",
        rating: 4.7,
        reviews: 89,
        description: "IGNITE V15 1500 puffs sabor menta refrescante",
        inStock: true
    },
    {
        id: 3,
        name: "VUSE GO - Uva",
        price: 38.90,
        originalPrice: 48.90,
        image: "img/VUSEGO.jpg",
        category: "VUSE",
        rating: 4.6,
        reviews: 156,
        description: "VUSE GO 800 puffs com sabor uva doce",
        inStock: true
    },
    {
        id: 4,
        name: "MASKKING - Frutas Vermelhas",
        price: 49.90,
        originalPrice: 59.90,
        image: "img/MASKKING – Frutas Vermelhas.jpg",
        category: "MASKKING",
        rating: 4.9,
        reviews: 203,
        description: "MASKKING 1000 puffs sabor frutas vermelhas",
        inStock: true
    },
    {
        id: 5,
        name: "ELFBAR 2500 - Melancia",
        price: 69.90,
        originalPrice: 79.90,
        image: "img/ELFBAR 2500 – Melancia.jpg",
        category: "ELFBAR",
        rating: 4.8,
        reviews: 94,
        description: "ELFBAR 2500 puffs sabor melancia refrescante",
        inStock: true
    },
    {
        id: 6,
        name: "IGNITE V50 - Maçã Verde",
        price: 89.90,
        originalPrice: 99.90,
        image: "img/IGNITE V50 – Maçã Verde.jpg",
        category: "IGNITE",
        rating: 4.7,
        reviews: 67,
        description: "IGNITE V50 5000 puffs sabor maçã verde",
        inStock: false
    },
    {
        id: 7,
        name: "VUSE GO - Blueberry",
        price: 42.90,
        originalPrice: 52.90,
        image: "img/VUSE GO – Blueberry.jpg",
        category: "VUSE",
        rating: 4.5,
        reviews: 78,
        description: "VUSE GO 800 puffs sabor blueberry doce",
        inStock: true
    },
    {
        id: 8,
        name: "MASKKING - Manga",
        price: 47.90,
        originalPrice: 57.90,
        image: "img/MASKKING – Manga.jpg",
        category: "MASKKING",
        rating: 4.6,
        reviews: 112,
        description: "MASKKING 1000 puffs sabor manga tropical",
        inStock: true
    }
];

// Global variables
let cart = [];
let currentCategory = '';
let searchTerm = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartCount();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === '' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="no-products"><p>Nenhum produto encontrado.</p></div>';
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.originalPrice ? `
                    <div class="discount-badge">
                        -${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                ` : ''}
                ${!product.inStock ? '<div class="out-of-stock">Esgotado</div>' : ''}
            </div>
            
            <div class="product-info">
                <div class="product-header">
                    <span class="category-badge">${product.category}</span>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating} (${product.reviews})</span>
                    </div>
                </div>
                
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
                <div class="product-footer">
                    <div class="price-info">
                        <span class="current-price">R$ ${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `
                            <span class="original-price">R$ ${product.originalPrice.toFixed(2)}</span>
                        ` : ''}
                    </div>
                    
                    <button 
                        class="add-to-cart" 
                        onclick="addToCart(${product.id})"
                        ${!product.inStock ? 'disabled' : ''}
                    >
                        ${product.inStock ? 'Adicionar' : 'Esgotado'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter products by category
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    renderProducts();
    scrollToSection('produtos');
}

// Filter products by search term
function filterProducts() {
    searchTerm = document.getElementById('searchInput').value;
    renderProducts();
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    showNotification('Produto adicionado ao carrinho!');
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCartItems();
}

// Update product quantity in cart
function updateQuantity(productId, newQuantity) {
    if (newQuantity === 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartCount();
        renderCartItems();
    }
}

// Update cart count display
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cartModal');
    const isActive = modal.classList.contains('active');
    
    if (isActive) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCartItems();
    }
}

// Render cart items
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        cartEmpty.style.display = 'block';
        cartFooter.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Send cart to WhatsApp
function sendToWhatsApp() {
    if (cart.length === 0) return;
    
    const message = `Olá! Gostaria de fazer um pedido:\n\n${cart.map(item => 
        `${item.name} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')}\n\nTotal: R$ ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
    
    const whatsappUrl = `https://wa.me/5545988127886?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Open WhatsApp
function openWhatsApp() {
    const whatsappUrl = 'https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os produtos.';
    window.open(whatsappUrl, '_blank');
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        menuIcon.className = 'fas fa-times';
    } else {
        menuIcon.className = 'fas fa-bars';
    }
}

// Close mobile menu
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    
    mobileMenu.classList.remove('active');
    menuIcon.className = 'fas fa-bars';
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #059669;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        toggleCart();
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('cartModal');
        if (modal.classList.contains('active')) {
            toggleCart();
        }
    }
});

// Smooth scroll behavior for all internal links
document.addEventListener('click', function(event) {
    if (event.target.matches('a[href^="#"]')) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});