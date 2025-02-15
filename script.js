document.addEventListener('DOMContentLoaded', function () {
  // Smooth Scroll for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
      // Close mobile nav if open
      if (document.querySelector(".nav-links").classList.contains("active")) {
        document.querySelector(".nav-links").classList.remove("active");
        document.querySelector(".nav-toggle").classList.remove("fa-times");
      }
    });
  });

  // Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksContainer = document.querySelector(".nav-links");
  navToggle.addEventListener("click", function () {
    navLinksContainer.classList.toggle("active");
    this.classList.toggle("fa-times");
  });

  // Modal Functionality for Project Cards
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      if (e.target.classList.contains("view-project")) {
        const modalId = card.getAttribute("data-modal");
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = "block";
        }
      }
    });
  });

  // Close Modals
  const closeButtons = document.querySelectorAll(".close-button");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = btn.closest(".modal");
      modal.style.display = "none";
    });
  });

  window.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none";
    }
  });

  // Back to Top Button
  const backToTop = document.querySelector(".back-to-top");
  backToTop.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Tools Slider
  let toolsSlideIndex = 0;
  const toolsSlideContainer = document.querySelector(".tools-slide-container");
  const toolSlides = document.querySelectorAll(".tool-slide");
  const totalToolSlides = toolSlides.length;

  const updateToolsSlider = () => {
    if (toolsSlideIndex >= totalToolSlides) toolsSlideIndex = 0;
    if (toolsSlideIndex < 0) toolsSlideIndex = totalToolSlides - 1;
    toolsSlideContainer.style.transform = `translateX(-${toolsSlideIndex * 100}%)`;
  };

  const nextButton = document.querySelector(".next-button");
  const prevButton = document.querySelector(".prev-button");

  nextButton.addEventListener("click", () => {
    toolsSlideIndex++;
    updateToolsSlider();
  });

  prevButton.addEventListener("click", () => {
    toolsSlideIndex--;
    updateToolsSlider();
  });

  // Auto Slide Tools
  let toolsAutoSlide = setInterval(() => {
    toolsSlideIndex++;
    updateToolsSlider();
  }, 3000);

  // Pause auto slide on hover
  const toolsSlider = document.querySelector(".tools-slider");
  toolsSlider.addEventListener("mouseenter", () => {
    clearInterval(toolsAutoSlide);
  });
  toolsSlider.addEventListener("mouseleave", () => {
    toolsAutoSlide = setInterval(() => {
      toolsSlideIndex++;
      updateToolsSlider();
    }, 3000);
  });

  // Scroll Reveal
  const revealElements = document.querySelectorAll(".reveal");
  const revealOnScroll = () => {
    revealElements.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 100) {
        el.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Trigger on load

  // Touch Support for Tools Slider
  let touchStartX = 0;
  let touchEndX = 0;

  toolsSlider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  toolsSlider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      toolsSlideIndex++;
      updateToolsSlider();
    } else if (touchEndX - touchStartX > 50) {
      toolsSlideIndex--;
      updateToolsSlider();
    }
  });
});
