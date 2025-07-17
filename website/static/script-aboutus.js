// Toggle hamburger menu visibility
function toggleMenu() {
    const menu = document.getElementById("hamburgerMenu");
    if (menu) {
        menu.classList.toggle("active");
    }
}

// Hide the hamburger menu 
function hideMenu() {
    const menu = document.getElementById("hamburgerMenu");
    if (menu) {
        menu.classList.remove("active");
    }
}