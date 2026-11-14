/* =====================================
   SETTINGS – change these
===================================== */

// The contact form is sent through Netlify Forms, so no email address appears on the site.
// Messages arrive in your Netlify dashboard (Site > Forms > contact), with email notifications.


/* =====================================
   PROJECT VIDEOS
   Desktop: play on hover. Phone: tap to play/pause.
===================================== */
const isTouch = window.matchMedia("(hover: none)").matches;

document.querySelectorAll(".project-video").forEach(function (video) {
    const box = video.parentElement;
    if (!box) return;
    const hoverSign = box.querySelector(".hover-sign");

    function play() {
        const attempt = video.play();
        if (attempt && attempt.catch) attempt.catch(function () {});
        if (hoverSign) hoverSign.classList.add("active");
    }
    function pause() {
        video.pause();
        if (hoverSign) hoverSign.classList.remove("active");
    }

    if (isTouch) {
        box.addEventListener("click", function () {
            video.paused ? play() : pause();
        });
    } else {
        box.addEventListener("mouseenter", play);
        box.addEventListener("mouseleave", pause);
    }
});


/* =====================================
   HERO SPHERE TILT (desktop only)
===================================== */
const wrapper = document.querySelector(".sphere-wrapper");
const heroVisual = document.querySelector(".hero-visual");

if (wrapper && heroVisual && !isTouch) {
    heroVisual.addEventListener("mousemove", function (e) {
        const rect = heroVisual.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 16;
        const rotateX = ((y / rect.height) - 0.5) * -16;
        wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroVisual.addEventListener("mouseleave", function () {
        wrapper.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
}


/* =====================================
   PHONE SIDEBAR MENU
   Opens with the ☰ button. Closes with ✕, a link, a tap outside or Escape.
===================================== */
const sideBar = document.querySelector(".sidebar");
const menuButton = document.querySelector(".menu-icon");
const closeButton = document.querySelector(".close-icon");

function isSidebarOpen() {
    return !!sideBar && sideBar.classList.contains("open-sidebar");
}

function openSidebar() {
    if (!sideBar) return;
    sideBar.classList.remove("close-sidebar");
    sideBar.classList.add("open-sidebar");
    sideBar.removeAttribute("inert");
    sideBar.setAttribute("aria-hidden", "false");
    if (menuButton) menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    if (closeButton) closeButton.focus();
}

function closeSidebar(returnFocus) {
    if (!isSidebarOpen()) return;
    sideBar.classList.remove("open-sidebar");
    sideBar.classList.add("close-sidebar");
    sideBar.setAttribute("inert", "");
    sideBar.setAttribute("aria-hidden", "true");
    if (menuButton) menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    if (returnFocus && menuButton) menuButton.focus();
}

if (sideBar && menuButton) {
    menuButton.addEventListener("click", function (e) {
        e.stopPropagation();
        openSidebar();
    });
    if (closeButton) {
        closeButton.addEventListener("click", function () { closeSidebar(true); });
    }
    // Close the menu after choosing a link (the page then scrolls to that section)
    sideBar.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () { closeSidebar(false); });
    });
    // A tap anywhere outside the open menu closes it
    document.addEventListener("click", function (e) {
        if (isSidebarOpen() && !sideBar.contains(e.target)) closeSidebar(true);
    });
    // If the screen is widened past the phone layout, make sure the menu is closed
    window.addEventListener("resize", function () {
        if (window.innerWidth > 1200) closeSidebar(false);
    });
}


/* =====================================
   SCROLL REVEAL ANIMATION
   Elements with class "reveal" fade in when they scroll into view.
===================================== */
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealItems.forEach(function (item) { observer.observe(item); });
} else {
    revealItems.forEach(function (item) { item.classList.add("visible"); });
}


/* =====================================
   ART LIGHTBOX
   Click an artwork to open it. Close with ✕, a click outside the image, or Escape.
===================================== */
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
let lightboxOpener = null;

function isLightboxOpen() {
    return !!lightbox && lightbox.classList.contains("open");
}

function openLightbox(img, opener) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightboxOpener = opener || null;
    lightbox.removeAttribute("inert");
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    if (lightboxClose) lightboxClose.focus();
}

function closeLightbox() {
    if (!isLightboxOpen()) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("inert", "");
    document.body.classList.remove("no-scroll");
    if (lightboxOpener) lightboxOpener.focus();
}

if (lightbox && lightboxImg) {
    document.querySelectorAll(".gallery-item, .zoomable").forEach(function (button) {
        const img = button.querySelector("img");
        if (!img) return;
        button.addEventListener("click", function () { openLightbox(img, button); });
    });
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    // Clicking anywhere except the image itself closes the viewer
    lightbox.addEventListener("click", function (e) {
        if (e.target !== lightboxImg && !(lightboxClose && lightboxClose.contains(e.target))) {
            closeLightbox();
        }
    });
    // Keep keyboard focus inside the viewer while it is open (only the close button is focusable)
    lightbox.addEventListener("keydown", function (e) {
        if (e.key === "Tab" && lightboxClose) {
            e.preventDefault();
            lightboxClose.focus();
        }
    });
}

// Escape closes whichever is open
document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (isLightboxOpen()) closeLightbox();
    else if (isSidebarOpen()) closeSidebar(true);
});


/* =====================================
   CONTACT FORM
   Opens the visitor's email app with the message filled in.
===================================== */
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const nameField = document.getElementById("cf-name");
const emailField = document.getElementById("cf-email");
const messageField = document.getElementById("cf-message");

function showNote(text) {
    if (formNote) formNote.textContent = text;
}

if (form && nameField && emailField && messageField) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();   // never reload the page

        // Netlify Forms only works on the published site, not when the file is opened from the computer.
        if (location.protocol === "file:") {
            showNote("The form works once the site is published on Netlify. Please reach out on LinkedIn or Instagram for now.");
            return;
        }

        const button = form.querySelector('button[type="submit"]');
        if (button) button.disabled = true;
        showNote("Sending your message…");

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(new FormData(form)).toString()
        })
            .then(function (res) {
                if (!res.ok) throw new Error("status " + res.status);
                form.reset();
                showNote("Thank you! Your message has been sent. I'll get back to you soon.");
            })
            .catch(function () {
                showNote("Sorry, your message could not be sent. Please try again, or reach out on LinkedIn or Instagram.");
            })
            .finally(function () {
                if (button) button.disabled = false;
            });
    });
}


/* =====================================
   FOOTER YEAR
===================================== */
const yearSpan = document.getElementById("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();


/* =====================================
   OPTIONAL MEDIA
   If a video or photo file is missing, show the placeholder instead.
   (Just copy the file into the folder with the right name and it appears.)
===================================== */
document.querySelectorAll(".media-optional").forEach(function (media) {
    const holder = media.parentElement;
    if (!holder) return;
    function markMissing() { holder.classList.add("missing"); }

    if (media.tagName === "IMG") {
        if (media.complete && media.naturalWidth === 0) markMissing();
        media.addEventListener("error", markMissing);
    } else {
        if (media.error || media.networkState === 3) markMissing();
        media.addEventListener("error", markMissing);
    }
});
