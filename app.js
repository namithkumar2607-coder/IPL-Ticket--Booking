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
                    }
                }
            } else {
                showToast("Scrolling to the booking form.", "success");
            }
        });
    });
});