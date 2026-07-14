const API = "http://localhost:5000";

const form = document.querySelector("form");
const message = document.querySelector("#message");

const isSignup = form.id === "signupForm";

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    message.textContent = "Please wait...";

    const body = isSignup
        ? {
              name: document.querySelector("#name").value.trim(),
              email: document.querySelector("#email").value.trim(),
              password: document.querySelector("#password").value
          }
        : {
              email: document.querySelector("#email").value.trim(),
              password: document.querySelector("#password").value
          };

    try {

        const response = await fetch(
            `${API}/api/auth/${isSignup ? "register" : "login"}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        localStorage.setItem(
            "shoppingBazarUser",
            JSON.stringify(data.user)
        );

        localStorage.setItem(
            "shoppingBazarToken",
            data.token
        );

        message.textContent = "Login Successful";

        setTimeout(() => {
            location.href = "index.html";
        }, 1000);

    } catch (err) {

        message.textContent = err.message;

    }

});