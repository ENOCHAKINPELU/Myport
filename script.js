document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
          link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
  
          if (targetElement) {
              window.scrollTo({
              top: targetElement.offsetTop,
              behavior: 'smooth'
              });
          }
          });
      });
  
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
             card.addEventListener('click', function(e) {
                 if(e.target.classList.contains('view-project-button')){
                     e.preventDefault();
                      const modalId = card.getAttribute('data-modal');
                    const modal = document.getElementById(modalId);
                     modal.style.display = 'block';
                 }
  
            });
        });
  
         const closeButtons = document.querySelectorAll('.close-button');
        closeButtons.forEach(button =>{
           button.addEventListener('click', function(){
                 const modal = button.closest('.modal');
                 modal.style.display = "none";
             });
        });
  
      window.addEventListener('click', function(event) {
          if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
          }
      });
  
      const backToTop = document.querySelector('.back-to-top');
  
      backToTop.addEventListener('click', function (e){
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
      });
        const toolsSlider = document.querySelector('.tools-slider');
      const nextButton = document.querySelector('.next-button');
      const prevButton = document.querySelector('.prev-button');
      let toolsSlideIndex = 0;
      let toolsAutoSlideInterval;
  
         function startToolsAutoSlide() {
            toolsAutoSlideInterval = setInterval(() => {
               toolsSlideIndex++;
              updateToolSlider();
             }, 3000);  // Change slide every 3 seconds (3000ms)
          }
  
         function stopToolsAutoSlide() {
             clearInterval(toolsAutoSlideInterval);
          }
  
      nextButton.addEventListener('click', () => {
        stopToolsAutoSlide()
          toolsSlideIndex++;
        updateToolSlider();
           startToolsAutoSlide();
      });
      prevButton.addEventListener('click', () => {
        stopToolsAutoSlide()
          toolsSlideIndex--;
        updateToolSlider();
        startToolsAutoSlide()
      });
  
       function updateToolSlider(){
          const toolSlides = document.querySelectorAll('.tool-slide');
           if (toolsSlideIndex >= toolSlides.length) {
              toolsSlideIndex = 0;
          }
          if (toolsSlideIndex < 0) {
              toolsSlideIndex = toolSlides.length - 1;
          }
            toolsSlider.querySelector('.tools-slide-container').style.transform = `translateX(-${toolsSlideIndex * 100}%)`;
       }
           startToolsAutoSlide()
  
  
       const testimonialSlider = document.querySelector('.testimonial-slider');
      const nextTestimonial = document.querySelector('.next-testimonial');
      const prevTestimonial = document.querySelector('.prev-testimonial');
      let testimonialSlideIndex = 0;
       let testimonialAutoSlideInterval;
      function startTestimonialAutoSlide(){
          testimonialAutoSlideInterval = setInterval(() =>{
             testimonialSlideIndex++;
            updateTestimonialSlider();
           }, 3000);
      }
  
      function stopTestimonialAutoSlide() {
             clearInterval(testimonialAutoSlideInterval);
          }
  
      nextTestimonial.addEventListener('click', () => {
           stopTestimonialAutoSlide();
           testimonialSlideIndex++;
        updateTestimonialSlider();
          startTestimonialAutoSlide();
      });
      prevTestimonial.addEventListener('click', () => {
        stopTestimonialAutoSlide();
          testimonialSlideIndex--;
        updateTestimonialSlider();
          startTestimonialAutoSlide();
      });
  
      function updateTestimonialSlider(){
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
           if (testimonialSlideIndex >= testimonialSlides.length) {
              testimonialSlideIndex = 0;
          }
          if (testimonialSlideIndex < 0) {
              testimonialSlideIndex = testimonialSlides.length - 1;
          }
        testimonialSlider.querySelector('.testimonial-slide-container').style.transform = `translateX(-${testimonialSlideIndex * 100}%)`;
      }
      startTestimonialAutoSlide();
  
       const navToggle = document.querySelector('.nav-toggle');
       const nav = document.querySelector('nav');
  
        navToggle.addEventListener('click', function() {
          nav.classList.toggle('active');
        });
  });
  // Scroll Reveal Animation
const scrollReveal = () => {
  const reveals = document.querySelectorAll('.reveal');
  
  reveals.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 100;
      
      if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('active');
      }
  });
};
document.addEventListener('DOMContentLoaded', function() {
  // Enhanced Mobile Menu Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  
  navToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      this.classList.toggle('fa-times');
  });

  // Smooth Scroll with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
          });
      });
  });

  // Back to Top Button Logic
  const backToTop = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
          backToTop.classList.add('visible');
      } else {
          backToTop.classList.remove('visible');
      }
  });

  // Enhanced Modal Handling
  const modals = document.querySelectorAll('.modal');
  
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
          modals.forEach(modal => modal.style.display = 'none');
      }
  });

  // Improved Slider Functionality
  let toolsSlideIndex = 0;
  const toolSlides = document.querySelectorAll('.tool-slide');
  const totalToolSlides = toolSlides.length;

  function updateToolSlider() {
      if (toolsSlideIndex >= totalToolSlides) toolsSlideIndex = 0;
      if (toolsSlideIndex < 0) toolsSlideIndex = totalToolSlides - 1;
      
      document.querySelector('.tools-slide-container').style.transform = 
          `translateX(-${toolsSlideIndex * 100}%)`;
  }

  // Intersection Observer for Slider Autoplay
  const sliderObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              startToolsAutoSlide();
          } else {
              stopToolsAutoSlide();
          }
      });
  });

  sliderObserver.observe(document.querySelector('.tools-slider'));

  // Add touch support for sliders
  let touchStartX = 0;
  let touchEndX = 0;
  
  const toolsSlider = document.querySelector('.tools-slider');
  
  toolsSlider.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
  });

  toolsSlider.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
  });

  function handleSwipeGesture() {
      if (touchStartX - touchEndX > 50) {
          toolsSlideIndex++;
      } else if (touchEndX - touchStartX > 50) {
          toolsSlideIndex--;
      }
      updateToolSlider();
  }
});