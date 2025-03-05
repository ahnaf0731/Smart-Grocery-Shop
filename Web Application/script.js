
let cart = [];


function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}


function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}


function addToCart(productName, price, amount) {
  let item = cart.find((item) => item.productName === productName);
  amount = parseInt(amount);

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

  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${
      item.productName
    } - Rs ${item.totalPrice.toFixed(2)} (${item.quantity})`;
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
}


function checkout() {
  const cartItems = document.getElementById("cart-items").children;
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Proceeding to checkout...");
  }
}


window.onclick = function (event) {
  if (event.target.className === "modal") {
    closeModal(event.target.id);
  }
};