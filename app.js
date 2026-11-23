/* ===== Reusable toast notification ===== */
function showToast(message, type = "success", duration = 3000) {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function () {
        toast.classList.add("show");
    }, 10);

    setTimeout(function () {
        toast.classList.remove("show");
        setTimeout(function () {
            toast.remove();
        }, 300);
    }, duration);
}

/* ===== Smooth scroll from Book buttons to the booking form ===== */
document.addEventListener("DOMContentLoaded", function () {
    const bookLinks = document.querySelectorAll('a[href="#booking"]');

    bookLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const target = document.getElementById("booking");
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });

            const row = link.closest("tr");
            if (row) {
                const teams = row.cells[1].textContent.trim();
                showToast("Match selected: " + teams + ". Fill in the form to book.", "success");

                const matchSelect = document.getElementById("match");
                if (matchSelect) {
                    for (let i = 0; i < matchSelect.options.length; i++) {
                        if (matchSelect.options[i].text.indexOf(teams) !== -1) {
                            matchSelect.selectedIndex = i;
                            break;
                        }
                    }updateSummary(false);
                }
            } else {
                showToast("Scrolling to the booking form.", "success");
            }
        });
    });
});

/* ===== Live booking summary ===== */
const ticketPrices = {
    "CSK vs RCB":  { General: 1000, Premium: 2500, VIP: 5000 },
    "MI vs KKR":   { General: 1200, Premium: 3000, VIP: 6000 },
    "SRH vs RR":   { General: 900,  Premium: 2000, VIP: 4500 },
    "GT vs DC":    { General: 1000, Premium: 2500, VIP: 5000 },
    "PBKS vs LSG": { General: 800,  Premium: 2000, VIP: 4000 }
};

function updateSummary(announce) {
    const matchEl = document.getElementById("match");
    const standEl = document.getElementById("stand");
    const qtyEl = document.getElementById("quantity");
    if (!matchEl || !standEl || !qtyEl) {
        return;
    }

    const match = matchEl.value;
    const stand = standEl.value;
    let qty = parseInt(qtyEl.value, 10);
    if (isNaN(qty) || qty < 1) {
        qty = 0;
    }

    const price = (ticketPrices[match] && ticketPrices[match][stand]) || 0;
    const total = price * qty;

    document.getElementById("summary-match").textContent = match;
    document.getElementById("summary-stand").textContent = stand;
    document.getElementById("summary-price").textContent = "₹" + price.toLocaleString("en-IN");
    document.getElementById("summary-qty").textContent = qty;
    document.getElementById("summary-total").textContent = "₹" + total.toLocaleString("en-IN");

    if (announce) {
        showToast("Summary updated. Total: ₹" + total.toLocaleString("en-IN"), "success", 2000);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    ["match", "stand", "quantity"].forEach(function (id) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("change", function () {
                updateSummary(true);
            });
        }
    });

    updateSummary(false);
});