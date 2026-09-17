/* ==========================================================================
   AND CREATIVE FACTORY — main.js
   Plain JavaScript. No frameworks. Read it from top to bottom.

   CONTENTS
   1.  Page navigation (show one page at a time)
   2.  Language switching (English / Arabic + LTR / RTL)
   3.  Theme switching (light / dark)
   4.  Animated counters
   5.  Scroll reveal animation
   6.  Project filters
   7.  Project case-study popup
   8.  Brand profile popup
   9.  Image lightbox (galleries)
   10. Contact form
   11. Navbar shadow + back-to-top button
   12. Start everything
   ========================================================================== */


/* ==========================================================================
   1. PAGE NAVIGATION
   All pages live inside index.html as <section class="page" id="page-xxx">.
   We simply hide them all, then show the one that was clicked.
   ========================================================================== */

// The name of the page we are currently showing.
var currentPage = "home";

function showPage(pageName) {
  // 1. Hide every page.
  var allPages = document.querySelectorAll(".page");
  for (var i = 0; i < allPages.length; i++) {
    allPages[i].classList.remove("active");
  }

  // 2. Show the page we want. If it does not exist, show Home instead.
  var wanted = document.getElementById("page-" + pageName);
  if (!wanted) {
    wanted = document.getElementById("page-home");
    pageName = "home";
  }
  wanted.classList.add("active");
  currentPage = pageName;

  // 3. Mark the matching navbar link as active.
  var navLinks = document.querySelectorAll(".site-nav [data-page]");
  for (var j = 0; j < navLinks.length; j++) {
    if (navLinks[j].getAttribute("data-page") === pageName) {
      navLinks[j].classList.add("active");
    } else {
      navLinks[j].classList.remove("active");
    }
  }

  // 4. Remember the page in the address bar (#about, #wood ...).
  window.location.hash = pageName;

  // 5. Jump to the top and replay the animations on the new page.
  window.scrollTo(0, 0);
  closeMobileMenu();
  resetReveal();
  startCounters();
}

// Any link with data-page="..." changes the page instead of loading a file.
function setupPageLinks() {
  var links = document.querySelectorAll("[data-page]");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (event) {
      event.preventDefault();
      showPage(this.getAttribute("data-page"));
    });
  }
}

// Close the mobile menu after a link is clicked.
function closeMobileMenu() {
  var menu = document.getElementById("mainMenu");
  if (menu && menu.classList.contains("show")) {
    var collapse = bootstrap.Collapse.getInstance(menu);
    if (collapse) {
      collapse.hide();
    }
  }
}


/* ==========================================================================
   2. LANGUAGE SWITCHING
   Every text element has data-en="English text" and data-ar="Arabic text".
   Switching language just copies the right attribute into the element.
   ========================================================================== */

var currentLang = "en";

function setLanguage(lang) {
  currentLang = lang;

  // Set the page direction: Arabic is right-to-left.
  var html = document.documentElement;
  html.setAttribute("lang", lang);
  html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

  // Replace the text of every element that has both translations.
  var texts = document.querySelectorAll("[data-en]");
  for (var i = 0; i < texts.length; i++) {
    var value = texts[i].getAttribute("data-" + lang);
    if (value !== null) {
      texts[i].textContent = value;
    }
  }

  // Replace placeholders inside the contact form.
  var inputs = document.querySelectorAll("[data-en-ph]");
  for (var j = 0; j < inputs.length; j++) {
    inputs[j].setAttribute("placeholder", inputs[j].getAttribute("data-" + lang + "-ph"));
  }

  // The button shows the OTHER language.
  document.getElementById("langLabel").textContent = lang === "en" ? "ع" : "EN";

  // Remember the choice for the next visit.
  localStorage.setItem("acf-lang", lang);
}

function setupLanguageButton() {
  document.getElementById("langBtn").addEventListener("click", function () {
    setLanguage(currentLang === "en" ? "ar" : "en");
  });
}


/* ==========================================================================
   3. THEME SWITCHING (light / dark)
   The theme is one attribute on the <html> tag. CSS does the rest.
   ========================================================================== */

var currentTheme = "light";

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);

  // Sun icon in dark mode, moon icon in light mode.
  var icon = document.getElementById("themeIcon");
  icon.className = theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";

  localStorage.setItem("acf-theme", theme);
}

function setupThemeButton() {
  document.getElementById("themeBtn").addEventListener("click", function () {
    setTheme(currentTheme === "light" ? "dark" : "light");
  });
}


/* ==========================================================================
   4. ANIMATED COUNTERS
   Any <span class="counter" data-target="1250"> counts up from 0 to 1250.
   ========================================================================== */

function startCounters() {
  var counters = document.querySelectorAll(".page.active .counter");

  for (var i = 0; i < counters.length; i++) {
    countUp(counters[i]);
  }
}

function countUp(element) {
  var target = Number(element.getAttribute("data-target"));
  var current = 0;
  var steps = 60;              // how many frames the animation takes
  var increase = target / steps;

  element.textContent = "0";

  var timer = setInterval(function () {
    current = current + increase;

    if (current >= target) {
      element.textContent = target;   // finish exactly on the target
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 20);
}


/* ==========================================================================
   5. SCROLL REVEAL
   Elements with class "reveal" fade in when they enter the screen.
   ========================================================================== */

function setupReveal() {
  var watcher = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add("shown");
      }
    }
  }, { threshold: 0.12 });

  var items = document.querySelectorAll(".reveal");
  for (var j = 0; j < items.length; j++) {
    watcher.observe(items[j]);
  }
}

// When we switch pages, hide the items again so they can animate once more.
function resetReveal() {
  var items = document.querySelectorAll(".page:not(.active) .reveal");
  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove("shown");
  }

  // Items already on screen on the new page should show right away.
  var visible = document.querySelectorAll(".page.active .reveal");
  for (var j = 0; j < visible.length; j++) {
    if (visible[j].getBoundingClientRect().top < window.innerHeight) {
      visible[j].classList.add("shown");
    }
  }
}


/* ==========================================================================
   6. PROJECT FILTERS
   Each project column has data-category="wood" / "metal" / ...
   ========================================================================== */

function setupFilters() {
  var buttons = document.querySelectorAll(".filter-btn");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      // Highlight the button that was clicked.
      for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("active");
      }
      this.classList.add("active");

      filterProjects(this.getAttribute("data-filter"));
    });
  }
}

function filterProjects(category) {
  var items = document.querySelectorAll(".project-item");
  var visibleCount = 0;

  for (var i = 0; i < items.length; i++) {
    var itemCategory = items[i].getAttribute("data-category");

    if (category === "all" || category === itemCategory) {
      items[i].classList.remove("d-none");
      visibleCount = visibleCount + 1;
    } else {
      items[i].classList.add("d-none");
    }
  }

  // Show a message when nothing matches.
  var message = document.getElementById("noResults");
  if (visibleCount === 0) {
    message.classList.remove("d-none");
  } else {
    message.classList.add("d-none");
  }
}


/* ==========================================================================
   7. PROJECT CASE-STUDY POPUP
   All project details are stored on the card as data- attributes,
   so the popup only has to read them and print them on screen.
   ========================================================================== */

function setupProjectPopups() {
  var cards = document.querySelectorAll(".project-card");

  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
      openProject(this);
    });

    // Keyboard support: Enter or Space opens the popup too.
    cards[i].addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProject(this);
      }
    });
  }
}

function openProject(card) {
  // "get" reads the correct language automatically.
  function get(name) {
    return card.getAttribute("data-" + name + "-" + currentLang) || card.getAttribute("data-" + name) || "";
  }

  document.getElementById("cmImage").src = card.getAttribute("data-img");
  document.getElementById("cmImage").alt = get("title");
  document.getElementById("cmTitle").textContent = get("title");
  document.getElementById("cmBrand").textContent = card.getAttribute("data-brand");
  document.getElementById("cmYear").textContent = card.getAttribute("data-year");
  document.getElementById("cmSector").textContent = get("sector");
  document.getElementById("cmScope").textContent = get("scope");
  document.getElementById("cmMaterials").textContent = get("materials");
  document.getElementById("cmServices").textContent = get("services");
  document.getElementById("cmDesc").textContent = get("desc");

  var popup = new bootstrap.Modal(document.getElementById("projectModal"));
  popup.show();
}


/* ==========================================================================
   8. BRAND PROFILE POPUP
   Same idea as the project popup.
   ========================================================================== */

function setupBrandPopups() {
  var cards = document.querySelectorAll(".brand-card");

  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
      openBrand(this);
    });

    cards[i].addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openBrand(this);
      }
    });
  }
}

function openBrand(card) {
  function get(name) {
    return card.getAttribute("data-" + name + "-" + currentLang) || card.getAttribute("data-" + name) || "";
  }

  document.getElementById("bmName").textContent = card.getAttribute("data-name");
  document.getElementById("bmSince").textContent = card.getAttribute("data-since");
  document.getElementById("bmSector").textContent = get("sector");
  document.getElementById("bmDesc").textContent = get("desc");
  document.getElementById("bmProjects").textContent = get("projects");
  document.getElementById("bmServices").textContent = get("services");

  var popup = new bootstrap.Modal(document.getElementById("brandModal"));
  popup.show();
}


/* ==========================================================================
   9. IMAGE LIGHTBOX
   Clicking a gallery image opens it bigger.
   ========================================================================== */

function setupLightbox() {
  var images = document.querySelectorAll(".gallery-img");

  for (var i = 0; i < images.length; i++) {
    images[i].addEventListener("click", function () {
      document.getElementById("lightboxImg").src = this.src;
      document.getElementById("lightboxImg").alt = this.alt;

      var popup = new bootstrap.Modal(document.getElementById("imageModal"));
      popup.show();
    });
  }
}


/* ==========================================================================
   10. CONTACT FORM
   We check the required fields, then show a thank-you message.
   Connect it to your own email service or backend later.
   ========================================================================== */

function setupContactForm() {
  var form = document.getElementById("quoteForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();   // stop the page from reloading

    var name = document.getElementById("qName");
    var email = document.getElementById("qEmail");
    var phone = document.getElementById("qPhone");
    var message = document.getElementById("qMessage");

    var isValid = true;

    // Required fields must not be empty.
    var required = [name, email, phone, message];
    for (var i = 0; i < required.length; i++) {
      if (required[i].value.trim() === "") {
        required[i].classList.add("is-invalid");
        isValid = false;
      } else {
        required[i].classList.remove("is-invalid");
      }
    }

    // The email must contain "@" and a dot.
    if (email.value.indexOf("@") === -1 || email.value.indexOf(".") === -1) {
      email.classList.add("is-invalid");
      isValid = false;
    }

    var success = document.getElementById("formSuccess");
    var error = document.getElementById("formError");

    if (isValid) {
      success.classList.remove("d-none");
      error.classList.add("d-none");
      form.reset();
    } else {
      error.classList.remove("d-none");
      success.classList.add("d-none");
    }
  });
}


/* ==========================================================================
   11. NAVBAR SHADOW + BACK TO TOP
   ========================================================================== */

function setupScrollEffects() {
  var nav = document.getElementById("siteNav");
  var topButton = document.getElementById("toTop");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    if (window.scrollY > 500) {
      topButton.classList.add("show");
    } else {
      topButton.classList.remove("show");
    }
  });

  topButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


/* ==========================================================================
   12. START EVERYTHING
   This runs once, as soon as the page is ready.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  // Use the saved language and theme, or the defaults.
  setLanguage(localStorage.getItem("acf-lang") || "en");
  setTheme(localStorage.getItem("acf-theme") || "light");

  // Turn on every feature.
  setupPageLinks();
  setupLanguageButton();
  setupThemeButton();
  setupReveal();
  setupFilters();
  setupProjectPopups();
  setupBrandPopups();
  setupLightbox();
  setupContactForm();
  setupScrollEffects();

  // Open the page written in the address bar, for example index.html#wood
  var startPage = window.location.hash.replace("#", "");
  showPage(startPage || "home");
});
