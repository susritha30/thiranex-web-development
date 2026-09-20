const CART_KEY = "shopease-cart";

let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

export function getCart() {
    return cart;
}

export function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
}

export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

export function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    item.quantity = quantity;
    saveCart();
}

export function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal() {
    return cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
