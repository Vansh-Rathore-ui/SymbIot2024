// Scroll to next section smoothly
function scrollToNext() {
  const nextSection = document.querySelector('.second');
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' });
    triggerAnimation(nextSection);
  }
}

// Add animation class if not already applied
function triggerAnimation(element) {
  if (element && !element.classList.contains('animate-slide')) {
    element.classList.add('animate-slide');
  }
}

// Observe section and trigger animation when in viewport
function triggerAnimationOnScroll() {
  const target = document.querySelector('.next-content');
  if (!target) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerAnimation(entry.target);
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.3
  });

  observer.observe(target);
}

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

// Show or hide "Back to Top" button based on scroll position
function handleScroll() {
  const backToTopBtn = document.getElementById("backToTop");
  if (!backToTopBtn) return;

  const shouldShow = window.scrollY > 200;
  backToTopBtn.style.display = shouldShow ? "flex" : "none";
}

// Run Python script via fetch
function runPython() {
  fetch('/run-script')
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
}

// Initialize all event listeners after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  triggerAnimationOnScroll();

  // Set up hamburger menu links to hide menu on click
  const menuItems = document.querySelectorAll('.hamburger-menu a');
  menuItems.forEach(item => item.addEventListener('click', hideMenu));

  // Back to top button click
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Initial scroll check in case page is loaded mid-scroll
  handleScroll();
});

// Handle scroll-based events
window.addEventListener('scroll', handleScroll);






document.getElementById('loginForm').onsubmit = async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  });

  const result = await response.json();
  const msg = document.getElementById('loginMessage');

  if (result.success) {
    msg.textContent = "Login successful!";
    msg.style.color = "green";
    setTimeout(() => location.reload(), 1000); // Reload or redirect
  } else {
    msg.textContent = result.message;
    msg.style.color = "red";
  }
}


