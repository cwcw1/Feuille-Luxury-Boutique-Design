/* =============================================
   FEUILLE - Main JavaScript
   Handles all animations, interactions, and GSAP
   ============================================= */

const gsap = window.gsap
const ScrollTrigger = window.ScrollTrigger

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger)

  // Initialize all modules
  initPageTransitions()
  initHeader()
  initMobileMenu()
  initRevealAnimations()
  initParallax()
  initInfiniteCarousel()
  initModal()
  initFilterInteractions()
})

/* -----------------------------------------
   PAGE TRANSITIONS
   Smooth animated transitions between pages
   ----------------------------------------- */
function initPageTransitions() {
  const transitionLayer = document.querySelector(".transition-layer")
  const links = document.querySelectorAll("a[data-link]")

  // Animate in on page load
  gsap.fromTo(transitionLayer, { y: "0%" }, { y: "-100%", duration: 0.7, ease: "power3.inOut", delay: 0.3 })

  // Handle link clicks
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href")
      if (href && href !== "#" && !href.startsWith("http")) {
        e.preventDefault()

        // Animate out
        gsap.to(transitionLayer, {
          y: "0%",
          duration: 0.6,
          ease: "power3.inOut",
          onComplete: () => {
            window.location.href = href
          },
        })
      }
    })
  })
}

/* -----------------------------------------
   HEADER
   Scroll-based header styling changes
   ----------------------------------------- */
function initHeader() {
  const header = document.querySelector(".header")
  const isShopPage = document.querySelector(".shop-page")
  let lastScroll = 0

  // Skip scroll behavior on shop page
  if (isShopPage) return

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset

    // Add scrolled class after 950px
    if (currentScroll > 950) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }

    lastScroll = currentScroll
  })
}

/* -----------------------------------------
   MOBILE MENU
   Toggle mobile navigation
   ----------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn")
  const mobileNav = document.querySelector(".mobile-nav")

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      menuBtn.classList.toggle("active")
      mobileNav.classList.toggle("active")
      document.body.style.overflow = mobileNav.classList.contains("active") ? "hidden" : ""
    })

    // Close menu when clicking a link
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.classList.remove("active")
        mobileNav.classList.remove("active")
        document.body.style.overflow = ""
      })
    })
  }
}

/* -----------------------------------------
   REVEAL ANIMATIONS
   ScrollTrigger-based element reveals
   ----------------------------------------- */
function initRevealAnimations() {
  const reveals = document.querySelectorAll(".reveal")

  reveals.forEach((el, index) => {
    // Stagger reveals that are in the same section
    const delay = el.closest(".products-grid, .shop-grid, .services-grid") ? index * 0.1 : 0

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: delay % 0.4, // Reset stagger for each row
          ease: "power3.out",
        })
        el.classList.add("active")
      },
    })
  })
}

/* -----------------------------------------
   PARALLAX EFFECTS
   Smooth parallax scrolling for images
   ----------------------------------------- */
function initParallax() {
  // Hero parallax
  const heroImg = document.querySelector(".hero-img")
  if (heroImg) {
    gsap.to(heroImg, {
      y: "20%",
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    })
  }

  // Banner parallax
  const parallaxImg = document.querySelector(".parallax-img")
  if (parallaxImg) {
    gsap.to(parallaxImg, {
      y: "30%",
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-banner",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })
  }
}

/* -----------------------------------------
   INFINITE CAROUSEL
   GSAP-powered seamless infinite scroll
   ----------------------------------------- */
function initInfiniteCarousel() {
  const track = document.querySelector(".carousel-track")
  if (!track) return

  const items = track.querySelectorAll(".carousel-item")
  if (items.length === 0) return

  // Clone items for seamless loop
  items.forEach((item) => {
    const clone = item.cloneNode(true)
    track.appendChild(clone)
  })

  // Calculate total width
  const itemWidth = items[0].offsetWidth + 20 // width + gap
  const totalWidth = itemWidth * items.length

  // Create infinite scroll animation
  const tl = gsap.to(track, {
    x: -totalWidth,
    duration: 30,
    ease: "none",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((x) => Number.parseFloat(x) % totalWidth),
    },
  })

  // Pause on hover
  track.addEventListener("mouseenter", () => tl.pause())
  track.addEventListener("mouseleave", () => tl.play())

  // Handle click to open modal
  track.querySelectorAll(".carousel-item").forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img")
      openModal(img.src)
    })
  })
}

/* -----------------------------------------
   MODAL
   Instagram-style image modal
   ----------------------------------------- */
function initModal() {
  const modal = document.getElementById("modal")
  const closeBtn = modal?.querySelector(".modal-close")

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal)
  }

  // Close on background click
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal()
    }
  })
}

function openModal(imgSrc) {
  const modal = document.getElementById("modal")
  const modalImg = document.getElementById("modalImg")

  if (modal && modalImg) {
    modalImg.src = imgSrc
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }
}

function closeModal() {
  const modal = document.getElementById("modal")
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = ""
  }
}

/* -----------------------------------------
   FILTER INTERACTIONS
   Shop page filter functionality
   ----------------------------------------- */
function initFilterInteractions() {
  // Category/Designer filter links
  const filterLinks = document.querySelectorAll(".filter-link")
  filterLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      // Remove active from siblings
      const siblings = link.closest(".filter-list")?.querySelectorAll(".filter-link")
      siblings?.forEach((s) => s.classList.remove("active"))

      // Add active to clicked
      link.classList.add("active")

      // Animate products (visual feedback)
      animateProductsOnFilter()
    })
  })

  // Size buttons
  const sizeBtns = document.querySelectorAll(".size-btn")
  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      animateProductsOnFilter()
    })
  })

  // Sort select
  const sortSelect = document.querySelector(".sort-select")
  sortSelect?.addEventListener("change", animateProductsOnFilter)

  // Clear filters
  const clearBtn = document.querySelector(".btn-outline")
  clearBtn?.addEventListener("click", () => {
    filterLinks.forEach((link) => link.classList.remove("active"))
    filterLinks[0]?.classList.add("active") // Reset to "All"
    sizeBtns.forEach((btn) => btn.classList.remove("active"))
    animateProductsOnFilter()
  })
}

function animateProductsOnFilter() {
  const products = document.querySelectorAll(".shop-grid .product-card")

  gsap.fromTo(
    products,
    { opacity: 0.5, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.out",
    },
  )
}

/* -----------------------------------------
   NEWSLETTER FORM
   Form submission handling
   ----------------------------------------- */
const newsletterForm = document.querySelector(".newsletter-form")
newsletterForm?.addEventListener("submit", (e) => {
  e.preventDefault()
  const input = newsletterForm.querySelector("input")

  if (input.value) {
    // Visual feedback
    gsap.to(newsletterForm, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        input.value = ""
        input.placeholder = "Thank you!"
        setTimeout(() => {
          input.placeholder = "Your email"
        }, 2000)
      },
    })
  }
})
