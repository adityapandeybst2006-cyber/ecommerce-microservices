const API = "http://localhost:5000";

const user = JSON.parse(localStorage.getItem("shoppingBazarUser"));
const token = localStorage.getItem("shoppingBazarToken");
let cart = JSON.parse(localStorage.getItem("shoppingBazarCart")) || [];

// अगर कोई लॉग-इन नहीं है या कार्ट खाली है, तो वापस भेजें
if (!user) {
    alert("Please login first.");
    location.href = "login.html";
} else if (cart.length === 0) {
    alert("Your cart is empty.");
    location.href = "index.html";
}

const money = n =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(n));

// 1. कार्ट समरी को स्क्रीन पर रेंडर करना
function renderSummary() {
    const summaryDiv = document.getElementById("checkoutSummary");
    const totalDiv = document.getElementById("checkoutTotal");

    summaryDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${money(item.price)} × ${item.qty}</p>
            </div>
            <strong>${money(item.price * item.qty)}</strong>
        </div>
    `).join("");

    const totalVal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    totalDiv.textContent = money(totalVal);
}

// 2. पेमेंट ऑप्शंस पर क्लिक करने पर एक्टिव क्लास बदलना
const payOptions = document.querySelectorAll(".pay-opt");
payOptions.forEach(opt => {
    opt.onclick = () => {
        payOptions.forEach(o => o.classList.remove("active"));
        opt.classList.add("active");
        opt.querySelector("input").checked = true;
    };
});

// 3. ऑर्डर प्लेस करने का लॉजिक (Fake Payment सिमुलेटर के साथ)
document.getElementById("placeOrderBtn").onclick = () => {
    // फॉर्म फील्ड्स की जांच
    const phone = document.getElementById("phone").value.trim();
    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    if (!phone || !street || !city || !state || !pincode) {
        alert("Please fill in all shipping details.");
        return;
    }

    const shippingAddress = { phone, street, city, state, pincode };

    if (paymentMethod === "COD") {
        // COD के लिए सीधे ऑर्डर प्लेस करें
        sendOrderToBackend(shippingAddress, "COD");
    } else {
        // ऑनलाइन पेमेंट (UPI/Card) के लिए फेक पेमेंट पॉपअप दिखाएँ
        openPaymentModal(shippingAddress, paymentMethod);
    }
};

// 4. फेक पेमेंट मॉडल संभालना
function openPaymentModal(shippingAddress, method) {
    const modal = document.getElementById("paymentModal");
    const title = document.getElementById("modalTitle");
    const body = document.getElementById("modalBody");
    const totalVal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    modal.style.display = "flex";

    if (method === "UPI") {
        title.innerHTML = "📱 Scan UPI QR Code";
        body.innerHTML = `
            <p>Scan and pay <strong>${money(totalVal)}</strong></p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=fake@upi&pn=ShoppingBazar&am=${totalVal}" alt="QR Code" style="margin:10px auto; display:block;">
            <p style="font-size: 12px; color: #888;">This is a test simulation QR.</p>
        `;
    } else if (method === "Card") {
        title.innerHTML = "💳 Card Payment Simulation";
        body.innerHTML = `
            <p>Payable Amount: <strong>${money(totalVal)}</strong></p>
            <div style="display: flex; flex-direction: column; gap: 10px; max-width: 250px; margin: 0 auto; text-align: left;">
                <input type="text" placeholder="Card Number" value="4111 2222 3333 4444" disabled style="padding: 8px;">
                <div style="display: flex; gap: 10px;">
                    <input type="text" placeholder="MM/YY" value="12/29" disabled style="padding: 8px; width: 60px;">
                    <input type="password" placeholder="CVV" value="123" disabled style="padding: 8px; width: 60px;">
                </div>
            </div>
        `;
    }

    // पेमेंट बटन क्लिक करने पर
    document.getElementById("simulatePayBtn").onclick = () => {
        modal.style.display = "none";
        sendOrderToBackend(shippingAddress, method);
    };
}

// 5. Backend को फाइनल आर्डर भेजना
async function sendOrderToBackend(shippingAddress, paymentMethod) {
    const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image
    }));

    try {
        const orderRes = await fetch(`${API}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: user._id,
                items: orderItems,
                shippingAddress,
                paymentMethod
            })
        });

        const order = await orderRes.json();

        if (!orderRes.ok) {
            throw new Error(order.error || "Order generation failed.");
        }

        alert("🎉 Order Placed Successfully!");
        localStorage.removeItem("shoppingBazarCart"); // कार्ट खाली करें
        location.href = "index.html"; // होमपेज पर भेजें (या success.html बाद में बना सकते हैं)

    } catch (err) {
        alert(err.message);
    }
}

// Initial Setup
renderSummary();