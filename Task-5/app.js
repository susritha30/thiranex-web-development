import { products } from "./products.js";

import {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartCount,
    getCartTotal
} from "./cart.js";

import {
    navigate,
    startRouter
} from "./router.js";


const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

const detailsContent = document.getElementById("details-content");
const backToProducts = document.getElementById("back-to-products");

const pages = document.querySelectorAll(".page");


// Display products
function renderProducts() {

    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredProducts = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });


    productList.innerHTML = "";


    filteredProducts.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">
                <span>${product.image}</span>
            </div>

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <p class="product-price">
                ₹${product.price}
            </p>

            <div class="product-actions">

                <button
                    type="button"
                    class="view-btn"
                    data-id="${product.id}"
                >
                    View
                </button>

                <button
                    type="button"
                    class="add-btn"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>
        `;


        productList.appendChild(card);
    });
}


// Product details
function renderProductDetails(productId) {

    const product = products.find(
        product => product.id === Number(productId)
    );


    if (!product) {
        detailsContent.innerHTML = "<p>Product not found.</p>";
        return;
    }


    detailsContent.innerHTML = `

        <div class="details-card">

            <div class="product-detail-image">
                <span>${product.image}</span>
            </div>

            <div>

                <h2>${product.name}</h2>

                <p>${product.description}</p>

                <p class="product-price">
                    ₹${product.price}
                </p>

                <br>

                <button
                    type="button"
                    class="btn add-details-btn"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>

        </div>
    `;
}


// Cart
function renderCart() {

    const cart = getCart();

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.textContent = "0";
        updateCartCount();

        return;
    }


    cart.forEach(item => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div>
                <strong>${item.name}</strong>
                <p>₹${item.price} × ${item.quantity}</p>
            </div>

            <div>

                <button
                    type="button"
                    class="quantity-minus"
                    data-id="${item.id}"
                >
                    −
                </button>

                <span>${item.quantity}</span>

                <button
                    type="button"
                    class="quantity-plus"
                    data-id="${item.id}"
                >
                    +
                </button>

                <button
                    type="button"
                    class="remove-btn"
                    data-id="${item.id}"
                >
                    Remove
                </button>

            </div>
        `;


        cartItems.appendChild(cartItem);
    });


    cartTotal.textContent = getCartTotal();

    updateCartCount();
}


// Cart count
function updateCartCount() {
    cartCount.textContent = getCartCount();
}


// Routing
function renderPage(route) {

    pages.forEach(page => {
        page.hidden = true;
    });


    if (route.startsWith("product/")) {

        document.getElementById("product-details").hidden = false;

        const productId = route.split("/")[1];

        renderProductDetails(productId);

        return;
    }


    const page = document.getElementById(route);


    if (page) {
        page.hidden = false;
    } else {
        document.getElementById("home").hidden = false;
    }


    if (route === "products") {
        renderProducts();
    }


    if (route === "cart") {
        renderCart();
    }
}


// Product buttons
productList.addEventListener("click", event => {

    const productId = Number(event.target.dataset.id);


    if (event.target.classList.contains("add-btn")) {

        const product = products.find(
            product => product.id === productId
        );

        if (product) {
            addToCart(product);
            updateCartCount();
            alert("Product added to cart!");
        }
    }


    if (event.target.classList.contains("view-btn")) {
        navigate(`product/${productId}`);
    }

});


// Details Add to Cart
detailsContent.addEventListener("click", event => {

    if (!event.target.classList.contains("add-details-btn")) {
        return;
    }


    const productId = Number(event.target.dataset.id);

    const product = products.find(
        product => product.id === productId
    );


    if (product) {
        addToCart(product);
        updateCartCount();
        alert("Product added to cart!");
    }

});


// Cart buttons
cartItems.addEventListener("click", event => {

    const productId = Number(event.target.dataset.id);


    if (event.target.classList.contains("remove-btn")) {
        removeFromCart(productId);
    }


    if (event.target.classList.contains("quantity-plus")) {

        const item = getCart().find(
            item => item.id === productId
        );

        if (item) {
            updateQuantity(productId, item.quantity + 1);
        }
    }


    if (event.target.classList.contains("quantity-minus")) {

        const item = getCart().find(
            item => item.id === productId
        );

        if (item) {
            updateQuantity(productId, item.quantity - 1);
        }
    }


    renderCart();
});


// Search
searchInput.addEventListener("input", renderProducts);


// Category
categoryFilter.addEventListener(
    "change",
    renderProducts
);


// Back button
backToProducts.addEventListener("click", () => {
    navigate("products");
});


// Start app
updateCartCount();

startRouter(renderPage);