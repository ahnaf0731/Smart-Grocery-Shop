// API Configuration
const API_URL = 'http://localhost:3000/api';

// Fetch products from API and display
async function loadProductsFromAPI() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    
    const result = await response.json();
    const products = result.data;
    
    // Store products for use in cart
    window.apiProducts = products;
    
    console.log('Products loaded from API:', products);
    return products;
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Could not connect to API server. Make sure the API is running on http://localhost:3000');
    return [];
  }
}

// Register user via API
async function registerUserAPI(username, email, password) {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Could not connect to server' };
  }
}

// Login user via API
async function loginUserAPI(username, password) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Normalize field names (API returns capital case)
      return { 
        success: true, 
        data: {
          username: result.data.Username,
          email: result.data.Email
        }
      };
    } else {
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: 'Could not connect to server' };
  }
}

// Update product stock when adding to cart (optional - to sync with database)
async function updateProductStock(productId, newStock) {
  try {
    const product = window.apiProducts.find(p => p.Id === productId);
    if (!product) return;
    
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: product.Name,
        price: product.Price,
        stock: newStock
      })
    });
    
    if (response.ok) {
      console.log('Product stock updated');
    }
  } catch (error) {
    console.error('Error updating product stock:', error);
  }
}

// Create order (save purchase to database)
async function createOrderAPI(username, items, totalAmount) {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, items, totalAmount })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Could not connect to server' };
  }
}

// Get user's order history
async function getUserOrdersAPI(username) {
  try {
    const response = await fetch(`${API_URL}/orders/${username}`);
    
    if (!response.ok) throw new Error('Failed to fetch orders');
    
    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, error: 'Could not fetch order history' };
  }
}
