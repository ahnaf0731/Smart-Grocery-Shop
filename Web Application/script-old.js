
let cart = [];


function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}


function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}


function addToCart(productName, price, buttonElement) {
  // Get the amount from the input field in the same product container
  let amount;
  
  if (typeof buttonElement === 'object' && buttonElement.parentElement) {
    // If buttonElement is passed (new way), find the input in the same product div
    const inputField = buttonElement.parentElement.querySelector('input[type="number"]');
    amount = parseInt(inputField.value);
  } else {
    // Fallback for old way (if amount is passed directly as third parameter)
    amount = parseInt(buttonElement);
  }
  
  let item = cart.find((item) => item.productName === productName);

  if (item) {
   
    item.quantity += amount;
    item.totalPrice = item.quantity * item.price;
  } else {

    cart.push({
      productName,
      price,
      quantity: amount,
      totalPrice: price * amount,
    });
  }

  updateCartDisplay();
  updateTotalAmount();
}


function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<li class="empty-cart">🛒 Your cart is empty<br><small>Add items to get started!</small></li>';
    return;
  }

  cart.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.className = "cart-item";
    
    listItem.innerHTML = `
      <div class="cart-item-header">
        <span class="item-name">🛍️ ${item.productName}</span>
        <button class="delete-btn" onclick="deleteFromCart(${index})" title="Remove item">×</button>
      </div>
      <div class="cart-item-details">
        <div class="price-section">
          <span class="unit-price">Rs ${item.price.toFixed(2)}</span>
          <span class="multiply">×</span>
          <input type="number" min="1" value="${item.quantity}" 
                 onchange="updateQuantity(${index}, this.value)" 
                 class="qty-input">
        </div>
        <div class="total-price">Rs ${item.totalPrice.toFixed(2)}</div>
      </div>
    `;
    
    cartItems.appendChild(listItem);
  });
}


function updateTotalAmount() {
  const totalAmount = cart.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  document.getElementById("total-amount").textContent =
    totalAmount.toFixed(2);
  
  // Update cart count badge
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalItems;
}


// UPDATE: Modify quantity of existing item
function updateQuantity(index, newQuantity) {
  newQuantity = parseInt(newQuantity);
  
  if (newQuantity <= 0) {
    deleteFromCart(index);
    return;
  }
  
  cart[index].quantity = newQuantity;
  cart[index].totalPrice = cart[index].price * newQuantity;
  
  updateCartDisplay();
  updateTotalAmount();
}

// DELETE: Remove item from cart
function deleteFromCart(index) {
  if (confirm(`Remove ${cart[index].productName} from cart?`)) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateTotalAmount();
  }
}

// Clear entire cart
function clearCart() {
  if (cart.length === 0) {
    alert("Your cart is already empty!");
    return;
  }
  
  if (confirm("Are you sure you want to clear your entire cart?")) {
    cart = [];
    updateCartDisplay();
    updateTotalAmount();
    alert("Cart cleared successfully!");
  }
}

function checkout() {
  const cartItems = document.getElementById("cart-items").children;
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
  } else {
    let orderSummary = "Order Summary:\n\n";
    cart.forEach(item => {
      orderSummary += `${item.productName} x ${item.quantity} = Rs ${item.totalPrice.toFixed(2)}\n`;
    });
    orderSummary += `\nTotal: Rs ${cart.reduce((total, item) => total + item.totalPrice, 0).toFixed(2)}`;
    
    alert(orderSummary + "\n\nProceeding to checkout...");
  }
}

// User Management
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Use API for user management
const USE_API = true; // Set to false to use localStorage only

// Form Validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateUsername(username) {
  return username.length >= 3;
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorDiv = input.nextElementSibling;
  if (errorDiv && errorDiv.classList.contains('error-message')) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  } else {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.color = 'red';
    error.style.fontSize = '12px';
    error.style.marginTop = '5px';
    input.parentNode.insertBefore(error, input.nextSibling);
  }
  input.style.borderColor = 'red';
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  const errorDiv = input.nextElementSibling;
  if (errorDiv && errorDiv.classList.contains('error-message')) {
    errorDiv.style.display = 'none';
  }
  input.style.borderColor = '#ddd';
}

async function handleLogin() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  // Clear previous errors
  clearError('loginUsername');
  clearError('loginPassword');
  
  let hasError = false;
  
  if (!username) {
    showError('loginUsername', 'Username is required');
    hasError = true;
  }
  
  if (!password) {
    showError('loginPassword', 'Password is required');
    hasError = true;
  }
  
  if (hasError) return;
  
  if (USE_API) {
    // Login via API
    const result = await loginUserAPI(username, password);
    
    if (result.success) {
      currentUser = { username: result.data.Username, email: result.data.Email };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      updateAuthUI();
      closeModal('loginModal');
      alert('Login successful! Welcome ' + username);
    } else {
      showError('loginPassword', result.error || 'Invalid username or password');
    }
  } else {
async function handleSignup() {
  const username = document.getElementById('signupUsername').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  
  // Clear previous errors
  clearError('signupUsername');
  clearError('signupEmail');
  clearError('signupPassword');
  clearError('signupConfirmPassword');
  
  let hasError = false;
  
  // Validate username
  if (!username) {
    showError('signupUsername', 'Username is required');
    hasError = true;
  } else if (!validateUsername(username)) {
    showError('signupUsername', 'Username must be at least 3 characters');
    hasError = true;
  } else if (!USE_API && users.find(u => u.username === username)) {
    showError('signupUsername', 'Username already exists');
    hasError = true;
  }
  
  // Validate email
  if (!email) {
    showError('signupEmail', 'Email is required');
    hasError = true;
  } else if (!validateEmail(email)) {
    showError('signupEmail', 'Please enter a valid email address');
    hasError = true;
  }
  
  // Validate password
  if (!password) {
    showError('signupPassword', 'Password is required');
    hasError = true;
  } else if (!validatePassword(password)) {
    showError('signupPassword', 'Password must be at least 6 characters');
    hasError = true;
  }
  
  // Validate confirm password
  if (!confirmPassword) {
    showError('signupConfirmPassword', 'Please confirm your password');
    hasError = true;
  } else if (password !== confirmPassword) {
    showError('signupConfirmPassword', 'Passwords do not match');
    hasError = true;
  }
  
  if (hasError) return;
  
  if (USE_API) {
    // Register via API
    const result = await registerUserAPI(username, email, password);
    
    if (result.success) {
      alert('Account created successfully! Please login.');
      closeModal('signupModal');
      
      // Clear form
      document.getElementById('signupUsername').value = '';
      document.getElementById('signupEmail').value = '';
      document.getElementById('signupPassword').value = '';
      document.getElementById('signupConfirmPassword').value = '';
    } else {
      if (result.error.includes('already exists')) {
        showError('signupUsername', result.error);
      } else {
        alert('Error: ' + result.error);
      }
    }
  } else {
    // Create new user locally
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Account created successfully! Please login.');
    closeModal('signupModal');
    
    // Clear form
    document.getElementById('signupUsername').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateAuthUI();
  alert('Logged out successfully!');
}

function updateAuthUI() {
  const authButtons = document.querySelector('.auth-buttons');
  if (currentUser) {
    authButtons.innerHTML = `
      <span style="color: white; margin-right: 10px;">Welcome, ${currentUser.username}!</span>
      <button onclick="handleLogout()">Logout</button>
    `;
  } else {
    authButtons.innerHTML = `
      <button onclick="openModal('loginModal')">Login</button>
      <button onclick="openModal('signupModal')">Sign Up</button>
    `;
  }
}

window.onload = function() {
  updateAuthUI();
};

window.onclick = function (event) {
  if (event.target.className === "modal") {
    closeModal(event.target.id);
  }
};