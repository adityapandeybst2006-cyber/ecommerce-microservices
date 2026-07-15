const API = window.location.origin;;

const user = JSON.parse(localStorage.getItem("shoppingBazarUser"));
const token = localStorage.getItem("shoppingBazarToken");

// Navbar Configuration
if (user) {
    const welcome = document.getElementById("welcomeUser");
    if (welcome) welcome.textContent = `👋 ${user.name}`;

    const login = document.getElementById("loginLink");
    const signup = document.getElementById("signupLink");
    const logout = document.getElementById("logoutLink");

    if (login) login.style.display = "none";
    if (signup) signup.style.display = "none";
    if (logout) {
        logout.style.display = "inline";
        logout.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem("shoppingBazarUser");
            localStorage.removeItem("shoppingBazarToken");
            localStorage.removeItem("shoppingBazarCart"); 
            location.reload();
        };
    }
}

const fallbackProducts = [
    {
        _id: "1",
        name: "Cotton Printed Kurti",
        category: "Apparel",
        price: 1299,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85"
    },
    {
        _id: "2",
        name: "Handwoven Jute Tote",
        category: "Accessories",
        price: 799,
        image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85"
    },
    {
        _id: "3",
        name: "Scented Soy Candle",
        category: "Home",
        price: 499,
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85"
    },
    {
        _id: "4",
        name: "Classic Cotton Shirt",
        category: "Apparel",
        price: 1499,
        image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=700&q=85"
    }
];

let products = [];

let cart = JSON.parse(localStorage.getItem("shoppingBazarCart")) || [];

const money = n =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(n));

const productArea = document.getElementById("products");

function renderProducts() {
    productArea.innerHTML = products.map(p => `
        <article class="product">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.category}</p>
            <strong>${money(p.price)}</strong>
            <br><br>
            <button class="add" data-id="${p._id}">
                Add to Cart
            </button>
        </article>
    `).join("");
}

function renderCart() {
    document.getElementById("cartCount").textContent =
        cart.reduce((a, b) => a + b.qty, 0);

    document.getElementById("total").textContent =
        money(cart.reduce((a, b) => a + b.price * b.qty, 0));

    document.getElementById("cartItems").innerHTML =
        cart.length
        ? cart.map(item => `
            <div class="cartRow">
                <img src="${item.image}">
                <div>
                    <h3>${item.name}</h3>
                    <p>${money(item.price)} × ${item.qty}</p>
                </div>
                <button data-remove="${item.id}">
                    Remove
                </button>
            </div>
        `).join("")
        : "<p>Your cart is empty.</p>";
}

function saveCart() {
    localStorage.setItem("shoppingBazarCart", JSON.stringify(cart));
}

function add(id) {
    const item = products.find(
        p => String(p._id) === String(id)
    );

    if (!item) return;

    const exists = cart.find(
        p => String(p.id) === String(item._id)
    );

    if (exists) {
        exists.qty++;
    } else {
        cart.push({
            id: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            qty: 1
        });
    }

    saveCart();
    renderCart();
    openCart();
}

function openCart() {
    document.getElementById("cart").classList.add("open");
    document.getElementById("shade").classList.add("show");
}

function closeCart() {
    document.getElementById("cart").classList.remove("open");
    document.getElementById("shade").classList.remove("show");
}

productArea.onclick = e => {
    if (e.target.dataset.id) {
        add(e.target.dataset.id);
    }
};

document.getElementById("cartItems").onclick = e => {
    if (e.target.dataset.remove) {
        cart = cart.filter(
            x => String(x.id) !== String(e.target.dataset.remove)
        );
        saveCart();
        renderCart();
    }
};

document.getElementById("cartButton").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
document.getElementById("shade").onclick = closeCart;

document.getElementById("category").onchange = async (e) => {
    const category = e.target.value;
    try {
        const url =
            category === "All"
            ? `${API}/api/products`
            : `${API}/api/products?category=${category}`;

        const res = await fetch(url);
        products = await res.json();
    } catch {
        products =
            category === "All"
            ? fallbackProducts
            : fallbackProducts.filter(x => x.category === category);
    }
    renderProducts();
};


document.getElementById("checkout").onclick = () => {
    if (!user) {
        alert("Please login first.");
        location.href = "login.html";
        return;
    }

    if (!cart.length) {
        alert("Cart is empty.");
        return;
    }

    saveCart();
    location.href = "checkout.html";
};

async function loadProducts() {
    try {
        const res = await fetch(`${API}/api/products`);
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Products:", data);
        products = data;
        renderProducts();
    } catch (err) {
        console.error("Error:", err);
        products = fallbackProducts;
        renderProducts();
    }
}

// Initial Loading
loadProducts();
renderCart();