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

/* ===== Ticket prices and live summary ===== */
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

function selectMatch(matchName) {
    const matchSelect = document.getElementById("match");
    if (!matchSelect) {
        return;
    }
    for (let i = 0; i < matchSelect.options.length; i++) {
        if (matchSelect.options[i].value === matchName) {
            matchSelect.selectedIndex = i;
            break;
        }
    }
    updateSummary(false);
}

document.addEventListener("DOMContentLoaded", function () {

    /* ----- Live summary listeners ----- */
    ["match", "stand", "quantity"].forEach(function (id) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("change", function () {
                updateSummary(true);
            });
        }
    });
    updateSummary(false);

    /* ----- Book buttons: smooth scroll + preselect match ----- */
    document.querySelectorAll('a[href="#booking"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const target = document.getElementById("booking");
            if (!target) {
                return;
            }
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });

            const card = link.closest(".match-card");
            if (card) {
                selectMatch(card.dataset.match);
                showToast("Match selected: " + card.dataset.match + ". Fill in the form to book.", "success");
            } else {
                showToast("Scrolling to the booking form.", "success");
            }
        });
    });

    /* ----- Team filter ----- */
    const teamFilter = document.getElementById("team-filter");
    const cards = document.querySelectorAll(".match-card");
    const noMatches = document.getElementById("no-matches");

    if (teamFilter) {
        teamFilter.addEventListener("change", function () {
            const team = teamFilter.value;
            let visibleCount = 0;

            cards.forEach(function (card) {
                const teams = card.dataset.teams.split(" ");
                const show = team === "all" || teams.indexOf(team) !== -1;
                card.classList.toggle("hidden", !show);
                if (show) {
                    visibleCount++;
                }
            });

            if (noMatches) {
                noMatches.hidden = visibleCount > 0;
            }
            showToast("Showing " + visibleCount + " match(es).", "success", 1500);
        });
    }

    /* ----- Grid / list view toggle ----- */
    const container = document.getElementById("match-container");
    const gridBtn = document.getElementById("grid-view-btn");
    const listBtn = document.getElementById("list-view-btn");

    if (container && gridBtn && listBtn) {
        gridBtn.addEventListener("click", function () {
            container.classList.remove("list-view");
            gridBtn.classList.add("active");
            listBtn.classList.remove("active");
        });

        listBtn.addEventListener("click", function () {
            container.classList.add("list-view");
            listBtn.classList.add("active");
            gridBtn.classList.remove("active");
        });
    }

    /* ----- Hamburger menu ----- */
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }
});