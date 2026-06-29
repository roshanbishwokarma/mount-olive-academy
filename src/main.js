// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  
  // --- Initialize Lucide Icons ---
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Mobile Hamburger Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('show')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
      }
    });

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // --- Sticky Header Scroll Effect ---
  const navbar = document.getElementById('main-navbar');
  
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Trigger initially in case page loaded scrolled down

  // --- Scroll Spy: Update Active Nav Links ---
  const sections = document.querySelectorAll('section');
  
  function updateActiveNavLink() {
    let currentActiveSectionId = 'home';
    const scrollThreshold = window.innerHeight * 0.4; // 40% down the screen
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      // Section is active if top of section is scrolled past the threshold
      if (rect.top <= scrollThreshold && rect.bottom >= scrollThreshold) {
        currentActiveSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink();

  // --- Intersection Observer for Scroll Reveals ---
  const revealElements = document.querySelectorAll('.animate-on-scroll');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, {
      root: null,
      threshold: 0.15 // Trigger when 15% is visible
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Stats Counter Animation ---
  const statsSection = document.getElementById('achievements');
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasCountersRun = false;

  function runCounterAnimation() {
    statNumbers.forEach(stat => {
      const targetVal = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds animation
      const steps = 50;
      const stepTime = duration / steps;
      let currentVal = 0;
      const increment = targetVal / steps;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= targetVal) {
          stat.textContent = targetVal + "+";
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(currentVal) + "+";
        }
      }, stepTime);
    });
  }

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCountersRun) {
          runCounterAnimation();
          hasCountersRun = true;
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // --- Testimonials Slider Logic ---
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentSlideIndex = 0;

  function showSlide(index) {
    if (slides.length === 0) return;
    
    // Boundary handling
    if (index >= slides.length) {
      currentSlideIndex = 0;
    } else if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else {
      currentSlideIndex = index;
    }

    // Toggle slide classes
    slides.forEach((slide, idx) => {
      if (idx === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Toggle dots classes
    dots.forEach((dot, idx) => {
      if (idx === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  if (slides.length > 0) {
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(currentSlideIndex + 1);
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(currentSlideIndex - 1);
      });
    }
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
        showSlide(targetIdx);
      });
    });

    // Auto rotate slides every 6 seconds
    let slideTimer = setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, 6000);

    // Pause auto rotation on user interaction
    const sliderContainer = document.querySelector('.testimonial-slider-container');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideTimer);
      });
      sliderContainer.addEventListener('mouseleave', () => {
        slideTimer = setInterval(() => {
          showSlide(currentSlideIndex + 1);
        }, 6000);
      });
    }
  }

  // --- Photo Gallery Lightbox Popup ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-main-img');
  const lightboxCaption = document.getElementById('lightbox-caption-text');
  const lightboxClose = document.querySelector('.lightbox-close-btn');
  const prevArrow = document.querySelector('.prev-arrow');
  const nextArrow = document.querySelector('.next-arrow');
  let activeGalleryIndex = -1;

  function openLightbox(index) {
    if (galleryItems.length === 0 || index < 0 || index >= galleryItems.length) return;
    
    activeGalleryIndex = index;
    const item = galleryItems[index];
    const imageSrc = item.getAttribute('data-src');
    const imageCap = item.getAttribute('data-caption');

    lightboxImg.setAttribute('src', imageSrc);
    // If the image fails to load, fallback to Unsplash placeholder inside modal too
    lightboxImg.onerror = function() {
      const fallbackSrc = item.querySelector('.gallery-img').getAttribute('src');
      if (fallbackSrc.includes('unsplash')) {
        this.src = fallbackSrc;
      } else {
        this.src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600';
      }
      this.onerror = null;
    };
    
    lightboxCaption.textContent = imageCap;
    lightboxModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  }

  function closeLightbox() {
    lightboxModal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Re-enable scroll
    activeGalleryIndex = -1;
  }

  if (galleryItems.length > 0 && lightboxModal) {
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (nextArrow) {
      nextArrow.addEventListener('click', () => {
        let nextIdx = activeGalleryIndex + 1;
        if (nextIdx >= galleryItems.length) nextIdx = 0;
        openLightbox(nextIdx);
      });
    }

    if (prevArrow) {
      prevArrow.addEventListener('click', () => {
        let prevIdx = activeGalleryIndex - 1;
        if (prevIdx < 0) prevIdx = galleryItems.length - 1;
        openLightbox(prevIdx);
      });
    }

    // Close on overlay click outside image box
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Support keyboard escape key and arrow keys
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('show')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight' && nextArrow) {
        nextArrow.click();
      } else if (e.key === 'ArrowLeft' && prevArrow) {
        prevArrow.click();
      }
    });
  }

  // --- Admission Modal Application Form ---
  const admissionModal = document.getElementById('admission-application-modal');
  const openAdmissionBtns = document.querySelectorAll('.open-admission-modal-btn');
  const closeAdmissionBtn = document.querySelector('.admission-modal-close-btn');

  function openAdmissionModal() {
    if (admissionModal) {
      admissionModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAdmissionModal() {
    if (admissionModal) {
      admissionModal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  }

  openAdmissionBtns.forEach(btn => {
    btn.addEventListener('click', openAdmissionModal);
  });

  if (closeAdmissionBtn) {
    closeAdmissionBtn.addEventListener('click', closeAdmissionModal);
  }

  if (admissionModal) {
    admissionModal.addEventListener('click', (e) => {
      if (e.target === admissionModal) {
        closeAdmissionModal();
      }
    });
  }

  // --- Form Submissions Animations & Status Alert ---
  
  // 1. Admission Application Form
  const admissionForm = document.getElementById('admission-form');
  const admissionStatus = document.getElementById('admission-status');
  const admissionSubmitBtn = document.getElementById('admission-submit-btn');

  if (admissionForm && admissionStatus && admissionSubmitBtn) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalText = admissionSubmitBtn.innerHTML;
      
      // Submitting indicator
      admissionSubmitBtn.disabled = true;
      admissionSubmitBtn.innerHTML = `Sending Application... <i data-lucide="loader" class="btn-right-icon spinner-animation"></i>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();

      admissionStatus.textContent = '';
      admissionStatus.className = 'form-status-message';

      setTimeout(() => {
        const studentName = document.getElementById('student-name').value;
        const parentName = document.getElementById('parent-name').value;

        if (studentName && parentName) {
          admissionStatus.textContent = `🎉 Application for ${studentName} has been submitted successfully! We will contact you soon.`;
          admissionStatus.className = 'form-status-message success';
          admissionForm.reset();
          
          // Auto-close modal after 2.5 seconds
          setTimeout(closeAdmissionModal, 2500);
        } else {
          admissionStatus.textContent = `❌ Application failed. Please fill in all required fields.`;
          admissionStatus.className = 'form-status-message error';
        }

        admissionSubmitBtn.disabled = false;
        admissionSubmitBtn.innerHTML = originalText;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1800);
    });
  }

  // 2. Contact Enquiry Form
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  const contactSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm && contactStatus && contactSubmitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalText = contactSubmitBtn.innerHTML;

      // Submitting indicator
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerHTML = `Sending Message... <i data-lucide="loader" class="btn-right-icon spinner-animation"></i>`;
      if (typeof lucide !== 'undefined') lucide.createIcons();

      contactStatus.textContent = '';
      contactStatus.className = 'form-status-message';

      setTimeout(() => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        if (name && email) {
          contactStatus.textContent = `🚀 Thank you, ${name}! Your enquiry has been sent to our administration office.`;
          contactStatus.className = 'form-status-message success';
          contactForm.reset();
        } else {
          contactStatus.textContent = `❌ Failed to send enquiry. Please check your information.`;
          contactStatus.className = 'form-status-message error';
        }

        contactSubmitBtn.disabled = false;
        contactSubmitBtn.innerHTML = originalText;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1500);
    });
  }
});
