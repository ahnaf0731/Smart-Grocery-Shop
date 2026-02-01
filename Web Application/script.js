// Shopping Cart and State Management
let cart = [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Configuration
const USE_API = true; // Set to true to use REST API, false for local storage

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Cart Functions
function addToCart(productName, price, buttonElement) {
    let quantity;
    
    // If buttonElement is passed, get quantity from sibling input
    if (typeof buttonElement === 'object' && buttonElement.parentElement) {
        const input = buttonElement.parentElement.querySelector('input[type="number"]');
        quantity = parseInt(input.value) || 1;
    } else {
        quantity = parseInt(buttonElement) || 1;
    }

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.productName === productName);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
    } else {
        cart.push({
            productName: productName,
            price: price,
            quantity: quantity,
            totalPrice: price * quantity
        });
    }
    
    updateCartDisplay();
    updateTotalAmount();
}

function updateCartDisplay() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<li class="empty-cart">🛒 Your cart is empty</li>';
        return;
    }
    
    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
            <div class="cart-item-header">
                <span class="item-name">🛍️ ${item.productName}</span>
                <button class="delete-btn" onclick="deleteFromCart(${index})" title="Remove item">×</button>
            </div>
            <div class="cart-item-details">
                <div class="price-section">
                    <span class="unit-price">Rs ${item.price.toFixed(2)}</span>
                    <span class="multiply">×</span>
                    <input type="number" 
                           min="1" 
                           value="${item.quantity}" 
                           onchange="updateQuantity(${index}, this.value)"
                           class="qty-input">
                </div>
                <div class="total-price">Rs ${item.totalPrice.toFixed(2)}</div>
            </div>
        `;
        cartItems.appendChild(li);
    });
}

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

function deleteFromCart(index) {
    if (confirm(`Remove ${cart[index].productName} from cart?`)) {
        cart.splice(index, 1);
        updateCartDisplay();
        updateTotalAmount();
    }
}

function clearCart() {
    if (cart.length === 0) {
        alert("Cart is already empty!");
        return;
    }
    
    if (confirm("Are you sure you want to clear the entire cart?")) {
        cart = [];
        updateCartDisplay();
        updateTotalAmount();
        alert("Cart cleared successfully!");
    }
}

function updateTotalAmount() {
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    document.getElementById("total-amount").textContent = total.toFixed(2);
    
    // Update cart count badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
}

async function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add some items before checkout.");
        return;
    }
    
    // Check if user is logged in
    if (!currentUser) {
        alert("Please login to complete your purchase!");
        openModal('loginModal');
        return;
    }
    
    let orderSummary = "Order Summary:\n\n";
    cart.forEach(item => {
        orderSummary += `${item.productName} x ${item.quantity} = Rs ${item.totalPrice.toFixed(2)}\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    orderSummary += `\nTotal: Rs ${total.toFixed(2)}`;
    
    const confirmed = confirm(orderSummary + "\n\nConfirm purchase?");
    
    if (confirmed) {
        // Save order to database if using API
        if (USE_API) {
            try {
                const response = await createOrderAPI(currentUser.username, cart, total);
                if (response.success) {
                    alert(`Order placed successfully!\n\nOrder ID: ${response.data.orderId}\nTotal: Rs ${total.toFixed(2)}\n\nThank you for shopping with us!`);
                    // Clear cart after successful order
                    cart = [];
                    updateCartDisplay();
                    updateTotalAmount();
                } else {
                    alert("Failed to save order: " + response.error);
                }
            } catch (error) {
                alert("Error processing order. Please try again.");
            }
        } else {
            // Local storage fallback
            alert("Order placed successfully!\n\nTotal: Rs " + total.toFixed(2) + "\n\nThank you for shopping with us!");
            cart = [];
            updateCartDisplay();
            updateTotalAmount();
        }
    }
}

// Validation Functions
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
    const inputElement = document.getElementById(inputId);
    let errorDiv = inputElement.nextElementSibling;
    
    if (!errorDiv || !errorDiv.classList.contains('error-message')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    inputElement.style.borderColor = 'red';
}

function clearError(inputId) {
    const inputElement = document.getElementById(inputId);
    const errorDiv = inputElement.nextElementSibling;
    
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.style.display = 'none';
    }
    
    inputElement.style.borderColor = '#ddd';
}

// Authentication Functions
async function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Clear previous errors
    clearError('loginUsername');
    clearError('loginPassword');
    
    let hasError = false;
    
    // Validate inputs
    if (!username) {
        showError('loginUsername', 'Username is required');
        hasError = true;
    }
    
    if (!password) {
        showError('loginPassword', 'Password is required');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Login with API or localStorage
    if (USE_API) {
        try {
            const response = await loginUserAPI(username, password);
            if (response.success) {
                currentUser = {
                    username: response.data.username,
                    email: response.data.email
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateAuthUI();
                closeModal('loginModal');
                alert(`Login successful! Welcome back, ${username}!`);
            } else {
                showError('loginPassword', response.error || 'Invalid username or password');
            }
        } catch (error) {
            showError('loginPassword', 'Login failed. Please try again.');
        }
    } else {
        // Find user in localStorage
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            currentUser = {
                username: user.username,
                email: user.email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateAuthUI();
            closeModal('loginModal');
            alert(`Login successful! Welcome back, ${username}!`);
        } else {
            showError('loginPassword', 'Invalid username or password');
        }
    }
}

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
    } else if (users.find(u => u.username === username)) {
        showError('signupUsername', 'Username already exists');
        hasError = true;
    }
    
    // Validate email
    if (!email) {
        showError('signupEmail', 'Email is required');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError('signupEmail', 'Please enter a valid email');
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
    
    // Register user
    if (USE_API) {
        try {
            const response = await registerUserAPI(username, email, password);
            if (response.success) {
                alert('Account created successfully! Please login.');
                closeModal('signupModal');
                clearSignupForm();
            } else {
                showError('signupUsername', response.message || 'Registration failed');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    } else {
        // Local storage registration
        users.push({
            username: username,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Account created successfully! Please login.');
        closeModal('signupModal');
        clearSignupForm();
    }
}

function clearSignupForm() {
    document.getElementById('signupUsername').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
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
            <span style="color: white; margin-right: 10px;">
                Welcome, ${currentUser.username}!
            </span>
            <button onclick="handleLogout()">Logout</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button onclick="openModal('loginModal')">Login</button>
            <button onclick="openModal('signupModal')">Sign Up</button>
        `;
    }
}

// Initialize on page load
window.onload = function() {
    updateAuthUI();
    updateCartDisplay();
    updateTotalAmount();
};

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.className === "modal") {
        closeModal(event.target.id);
    }
};
