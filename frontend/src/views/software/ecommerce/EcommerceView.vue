<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ImageWithFallback from '@/components/common/ImageWithFallback.vue';
import '../../../assets/styles/software/ecommerce/ecommerce.css';

const router = useRouter();
const products = ref([]);
const selectedProduct = ref(null);
const cart = ref([]);
const isCheckoutOpen = ref(false);
const searchQuery = ref('');
const activeCategory = ref('all');
const checkoutStep = ref(1);
const checkoutForm = ref({
  fullName: '',
  email: '',
  address: '',
  city: '',
  zipCode: '',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCVV: ''
});
const orderCompleted = ref(false);

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Premium Headphones',
    category: 'electronics',
    price: 199.99,
    rating: 4.5,
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    description: 'High-quality wireless noise-cancelling headphones with superior sound quality and comfort for extended listening sessions.',
    features: [
      'Noise cancellation technology',
      '30-hour battery life',
      'Bluetooth 5.0',
      'Built-in microphone'
    ],
    stock: 15
  },
  {
    id: 2,
    name: 'Modern Coffee Table',
    category: 'furniture',
    price: 249.99,
    rating: 4.2,
    image: 'https://via.placeholder.com/300x300?text=Coffee+Table',
    description: 'Elegant modern coffee table with tempered glass top and solid wood legs. Perfect for contemporary living rooms.',
    features: [
      'Tempered glass top',
      'Solid oak legs',
      'Easy assembly',
      'Stain resistant'
    ],
    stock: 8
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    category: 'clothing',
    price: 29.99,
    rating: 4.0,
    image: 'https://via.placeholder.com/300x300?text=T-Shirt',
    description: 'Comfortable organic cotton t-shirt with a relaxed fit. Sustainably sourced and ethically produced.',
    features: [
      '100% organic cotton',
      'Sustainable production',
      'Available in multiple colors',
      'Machine washable'
    ],
    stock: 50
  },
  {
    id: 4,
    name: 'Smart Watch',
    category: 'electronics',
    price: 299.99,
    rating: 4.7,
    image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
    description: 'Feature-packed smartwatch with health monitoring, notifications, and long battery life. Compatible with iOS and Android.',
    features: [
      'Heart rate monitoring',
      'GPS tracking',
      'Water resistant',
      '7-day battery life'
    ],
    stock: 12
  },
  {
    id: 5,
    name: 'Leather Wallet',
    category: 'accessories',
    price: 49.99,
    rating: 4.8,
    image: 'https://via.placeholder.com/300x300?text=Leather+Wallet',
    description: 'Genuine leather wallet with multiple card slots and RFID protection. Slim design fits comfortably in your pocket.',
    features: [
      'Genuine leather',
      'RFID blocking',
      '8 card slots',
      'Bifold design'
    ],
    stock: 30
  },
  {
    id: 6,
    name: 'Desk Lamp',
    category: 'home',
    price: 59.99,
    rating: 4.3,
    image: 'https://via.placeholder.com/300x300?text=Desk+Lamp',
    description: 'Adjustable LED desk lamp with multiple brightness levels and color temperatures. Energy efficient and eye-friendly.',
    features: [
      'Adjustable arm',
      'Touch controls',
      '5 brightness levels',
      '3 color temperatures'
    ],
    stock: 20
  }
];

// Get unique categories
const categories = computed(() => {
  const uniqueCategories = new Set(['all']);
  products.value.forEach(product => uniqueCategories.add(product.category));
  return Array.from(uniqueCategories);
});

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // Filter by category
    if (activeCategory.value !== 'all' && product.category !== activeCategory.value) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return product.name.toLowerCase().includes(query) || 
             product.description.toLowerCase().includes(query);
    }
    
    return true;
  });
});

const cartTotal = computed(() => {
  return cart.value.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0).toFixed(2);
});

const cartItemsCount = computed(() => {
  return cart.value.reduce((count, item) => count + item.quantity, 0);
});

const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

const setCategory = (category) => {
  activeCategory.value = category;
};

const viewProduct = (product) => {
  selectedProduct.value = product;
};

const closeProductView = () => {
  selectedProduct.value = null;
};

const getStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  return {
    full: Array(fullStars).fill('★'),
    half: halfStar ? ['★'] : [],
    empty: Array(emptyStars).fill('☆')
  };
};

const addToCart = (product, quantity = 1) => {
  const existingItem = cart.value.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  }
};

const removeFromCart = (productId) => {
  cart.value = cart.value.filter(item => item.id !== productId);
};

const updateCartQuantity = (productId, quantity) => {
  const item = cart.value.find(item => item.id === productId);
  if (item) {
    if (quantity > 0) {
      item.quantity = quantity;
    } else {
      removeFromCart(productId);
    }
  }
};

const toggleCheckout = () => {
  if (cart.value.length === 0) return;
  isCheckoutOpen.value = !isCheckoutOpen.value;
  checkoutStep.value = 1;
  orderCompleted.value = false;
};

const nextCheckoutStep = () => {
  // Simple form validation
  if (checkoutStep.value === 1) {
    if (!checkoutForm.value.fullName || !checkoutForm.value.email || 
        !checkoutForm.value.address || !checkoutForm.value.city || 
        !checkoutForm.value.zipCode) {
      alert('Please fill in all required fields');
      return;
    }
  }
  
  checkoutStep.value++;
};

const previousCheckoutStep = () => {
  checkoutStep.value--;
};

const completeOrder = () => {
  // Simple form validation for payment
  if (!checkoutForm.value.cardNumber || !checkoutForm.value.cardName || 
      !checkoutForm.value.cardExpiry || !checkoutForm.value.cardCVV) {
    alert('Please fill in all payment details');
    return;
  }
  
  // Process order (simulation)
  setTimeout(() => {
    orderCompleted.value = true;
    cart.value = [];
  }, 1500);
};

const closeCheckout = () => {
  isCheckoutOpen.value = false;
};

onMounted(() => {
  // Load product data
  products.value = [...mockProducts];
});

const goBack = () => {
  router.push({ name: 'software' });
};
</script>

<template>
  <div class="app-wrapper">
    <div class="app-container">
      <div class="app-header">
        <button @click="goBack" class="btn btn-back">← Back to Software</button>
        <h1>E-commerce Platform</h1>
        <p class="app-description">Shop our selection of premium products</p>
      </div>
      
      <div class="ecommerce-app">
        <header class="store-header">
          <div class="search-bar">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search products..." 
              class="search-input"
            />
          </div>
          
          <div class="cart-button" @click="toggleCheckout">
            <span class="cart-icon">🛒</span>
            <span class="cart-count" v-if="cartItemsCount > 0">{{ cartItemsCount }}</span>
          </div>
        </header>
        
        <div class="categories-nav">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="setCategory(category)"
            class="category-btn"
            :class="{ active: activeCategory === category }"
          >
            {{ category.charAt(0).toUpperCase() + category.slice(1) }}
          </button>
        </div>
        
        <main class="products-grid" v-if="!selectedProduct">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id"
            class="product-card"
            @click="viewProduct(product)"
          >
            <div class="product-image">
              <ImageWithFallback 
                :src="product.image" 
                :alt="product.name"
                type="thumbnail"
                height="100%"
                width="100%"
              />
            </div>
            
            <div class="product-info">
              <h3 class="product-title">{{ product.name }}</h3>
              <div class="product-rating">
                <span class="star full" v-for="(star, i) in getStars(product.rating).full" :key="'full'+i">{{ star }}</span>
                <span class="star half" v-for="(star, i) in getStars(product.rating).half" :key="'half'+i">{{ star }}</span>
                <span class="star empty" v-for="(star, i) in getStars(product.rating).empty" :key="'empty'+i">{{ star }}</span>
                <span class="rating-text">{{ product.rating }}</span>
              </div>
              <div class="product-price">{{ formatPrice(product.price) }}</div>
            </div>
          </div>
          
          <div v-if="filteredProducts.length === 0" class="no-products">
            <p>No products found matching your search.</p>
          </div>
        </main>
        
        <div v-if="selectedProduct" class="product-detail">
          <button @click="closeProductView" class="btn-close">×</button>
          
          <div class="product-detail-grid">
            <div class="product-detail-image">
              <ImageWithFallback 
                :src="selectedProduct.image" 
                :alt="selectedProduct.name"
                type="thumbnail"
                height="400px"
                width="100%"
              />
            </div>
            
            <div class="product-detail-info">
              <h2>{{ selectedProduct.name }}</h2>
              
              <div class="product-rating detail">
                <span class="star full" v-for="(star, i) in getStars(selectedProduct.rating).full" :key="'full'+i">{{ star }}</span>
                <span class="star half" v-for="(star, i) in getStars(selectedProduct.rating).half" :key="'half'+i">{{ star }}</span>
                <span class="star empty" v-for="(star, i) in getStars(selectedProduct.rating).empty" :key="'empty'+i">{{ star }}</span>
                <span class="rating-text">{{ selectedProduct.rating }}</span>
              </div>
              
              <div class="product-price detail">{{ formatPrice(selectedProduct.price) }}</div>
              
              <p class="product-description">{{ selectedProduct.description }}</p>
              
              <div class="product-features">
                <h3>Features:</h3>
                <ul>
                  <li v-for="(feature, index) in selectedProduct.features" :key="index">
                    {{ feature }}
                  </li>
                </ul>
              </div>
              
              <div class="product-stock">
                <span :class="selectedProduct.stock > 0 ? 'in-stock' : 'out-of-stock'">
                  {{ selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>
              
              <div class="add-to-cart">
                <button 
                  @click="addToCart(selectedProduct)"
                  class="btn btn-primary"
                  :disabled="selectedProduct.stock === 0"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Checkout Modal -->
        <div v-if="isCheckoutOpen" class="checkout-modal">
          <div class="checkout-content">
            <div class="checkout-header">
              <h2>{{ orderCompleted ? 'Order Confirmation' : 'Shopping Cart' }}</h2>
              <button @click="closeCheckout" class="btn-close">×</button>
            </div>
            
            <!-- Order completed screen -->
            <div v-if="orderCompleted" class="order-completed">
              <div class="success-icon">✓</div>
              <h3>Thank you for your order!</h3>
              <p>Your order has been successfully placed.</p>
              <p>An email confirmation has been sent to {{ checkoutForm.email }}.</p>
              <button @click="closeCheckout" class="btn btn-primary">Continue Shopping</button>
            </div>
            
            <!-- Cart items view -->
            <div v-else-if="checkoutStep === 1">
              <div v-if="cart.length === 0" class="empty-cart">
                <p>Your cart is empty.</p>
              </div>
              
              <div v-else>
                <div class="cart-items">
                  <div v-for="item in cart" :key="item.id" class="cart-item">
                    <div class="cart-item-image">
                      <img :src="item.image" :alt="item.name" />
                    </div>
                    
                    <div class="cart-item-details">
                      <div class="cart-item-title">{{ item.name }}</div>
                      <div class="cart-item-price">{{ formatPrice(item.price) }}</div>
                    </div>
                    
                    <div class="cart-item-quantity">
                      <button 
                        @click="updateCartQuantity(item.id, item.quantity - 1)"
                        class="quantity-btn"
                      >
                        -
                      </button>
                      <span>{{ item.quantity }}</span>
                      <button 
                        @click="updateCartQuantity(item.id, item.quantity + 1)"
                        class="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    
                    <div class="cart-item-subtotal">
                      {{ formatPrice(item.price * item.quantity) }}
                    </div>
                    
                    <button @click="removeFromCart(item.id)" class="remove-item">×</button>
                  </div>
                </div>
                
                <div class="cart-total">
                  <span>Total:</span>
                  <span>{{ formatPrice(parseFloat(cartTotal)) }}</span>
                </div>
                
                <button @click="nextCheckoutStep" class="btn btn-primary checkout-btn">
                  Proceed to Checkout
                </button>
              </div>
            </div>
            
            <!-- Shipping information -->
            <div v-else-if="checkoutStep === 2" class="checkout-form">
              <h3>Shipping Information</h3>
              
              <div class="form-group">
                <label for="fullName">Full Name*</label>
                <input 
                  type="text" 
                  id="fullName" 
                  v-model="checkoutForm.fullName"
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="email">Email Address*</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="checkoutForm.email"
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="address">Shipping Address*</label>
                <input 
                  type="text" 
                  id="address" 
                  v-model="checkoutForm.address"
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="city">City*</label>
                  <input 
                    type="text" 
                    id="city" 
                    v-model="checkoutForm.city"
                    class="form-control"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="zipCode">Zip Code*</label>
                  <input 
                    type="text" 
                    id="zipCode" 
                    v-model="checkoutForm.zipCode"
                    class="form-control"
                    required
                  />
                </div>
              </div>
              
              <div class="checkout-buttons">
                <button @click="previousCheckoutStep" class="btn btn-secondary">Back</button>
                <button @click="nextCheckoutStep" class="btn btn-primary">Continue to Payment</button>
              </div>
            </div>
            
            <!-- Payment information -->
            <div v-else-if="checkoutStep === 3" class="checkout-form">
              <h3>Payment Information</h3>
              
              <div class="form-group">
                <label for="cardNumber">Card Number*</label>
                <input 
                  type="text" 
                  id="cardNumber" 
                  v-model="checkoutForm.cardNumber"
                  class="form-control"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="cardName">Name on Card*</label>
                <input 
                  type="text" 
                  id="cardName" 
                  v-model="checkoutForm.cardName"
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="cardExpiry">Expiry Date*</label>
                  <input 
                    type="text" 
                    id="cardExpiry" 
                    v-model="checkoutForm.cardExpiry"
                    class="form-control"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="cardCVV">CVV*</label>
                  <input 
                    type="text" 
                    id="cardCVV" 
                    v-model="checkoutForm.cardCVV"
                    class="form-control"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <div class="order-summary">
                <h4>Order Summary</h4>
                <div class="summary-item">
                  <span>Subtotal:</span>
                  <span>{{ formatPrice(parseFloat(cartTotal)) }}</span>
                </div>
                <div class="summary-item">
                  <span>Shipping:</span>
                  <span>$0.00</span>
                </div>
                <div class="summary-item">
                  <span>Tax:</span>
                  <span>{{ formatPrice(parseFloat(cartTotal) * 0.1) }}</span>
                </div>
                <div class="summary-total">
                  <span>Total:</span>
                  <span>{{ formatPrice(parseFloat(cartTotal) * 1.1) }}</span>
                </div>
              </div>
              
              <div class="checkout-buttons">
                <button @click="previousCheckoutStep" class="btn btn-secondary">Back</button>
                <button @click="completeOrder" class="btn btn-primary">Place Order</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
