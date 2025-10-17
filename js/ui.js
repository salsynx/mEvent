// DOM Elements
const userDropdowns = document.querySelectorAll(".user");

// Handle user dropdown click
userDropdowns.forEach(drop => {
    drop.addEventListener("click", () => {
        const menu = drop.nextElementSibling;
        if (menu) {
            menu.classList.toggle("show");
        }
    });
});

// Close dropdown if clicked outside
window.addEventListener("click", (e) => {
    userDropdowns.forEach(drop => {
        const menu = drop.nextElementSibling;
        if (menu && !drop.contains(e.target)) {
            menu.classList.remove("show");
        }
    });
});

// Simple alert notification function
export function showAlert(message, type = "success") {
    const alertBox = document.createElement("div");
    alertBox.className = alert-box ${type};
    alertBox.innerText = message;
    alertBox.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#00aa33" : "#ff3300"};
        color: #fff;
        padding: 12px 20px;
        border-radius: 10px;
        box-shadow: 0 6px 15px rgba(0,0,0,0.2);
        z-index: 1000;
    `;
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 3000);
}