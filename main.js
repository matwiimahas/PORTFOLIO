const themeButton = document.getElementById("themeButton");
const projectButton = document.getElementById("projectButton");

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeButton.textContent = "🌙";
    } else {
        themeButton.textContent = "☀️";
    }
});

projectButton.addEventListener("click", () => {
    alert("🚧 Проєкти будуть додані сюди пізніше!");
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const target = document.querySelector(link.getAttribute("href"));

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});