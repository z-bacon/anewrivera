(() => {
  // ============================================
  // LENIS SMOOTH SCROLL INITIALIZATION
  // ============================================
  let lenis;
  
  // Check if device is mobile
  const isMobile = () => window.innerWidth <= 768;
  const isTablet = () => window.innerWidth <= 1024 && window.innerWidth > 768;
  
  const initSmoothScroll = () => {
    // Adjust settings based on device
    const duration = isMobile() ? 1.0 : 1.2;
    const wheelMultiplier = isMobile() ? 0.8 : 1;
    
    lenis = new Lenis({
      duration: duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: wheelMultiplier,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Lenis animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
    
    console.log('✨ Lenis smooth scroll initialized');
  };

  // Initialize smooth scroll if Lenis is available
  if (typeof Lenis !== 'undefined') {
    initSmoothScroll();
  }

  // ============================================
  // GSAP + SCROLLTRIGGER SETUP
  // ============================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    console.log('✨ GSAP & ScrollTrigger initialized');
  }

  // ============================================
  // SPLITTING.JS TEXT SPLITTING
  // ============================================
  if (typeof Splitting !== 'undefined') {
    Splitting();
    console.log('✨ Splitting.js initialized');
  }

  // ============================================
  // BLUR & STAGGER TEXT ANIMATIONS
  // ============================================
  const initTextAnimations = () => {
    const textElements = document.querySelectorAll('[data-splitting]');
    
    textElements.forEach((element, index) => {
      const chars = element.querySelectorAll('.char');
      if (chars.length === 0) return;

      // Set initial state
      gsap.set(chars, {
        opacity: 0,
        filter: 'blur(10px)',
        y: 20,
      });

      // Create scroll-triggered animation
      gsap.to(chars, {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: {
          each: 0.03,
          from: 'start',
        },
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom top',
          toggleActions: 'play reverse play reverse',
          // markers: true, // Debug
        },
      });
    });
    
    console.log(`✨ Text animations applied to ${textElements.length} elements`);
  };

  // ============================================
  // PARALLAX SCROLLING SYSTEM
  // ============================================
  const initParallax = () => {
    // Disable parallax on mobile for better performance
    if (isMobile()) {
      console.log('⚡ Parallax disabled on mobile for performance');
      return;
    }
    
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.speed) || 1;
      
      // Reduce parallax intensity on tablet
      const intensity = isTablet() ? 0.5 : 1;
      
      // Amplify the parallax effect
      const multiplier = 1.5; // Increase overall parallax movement
      
      gsap.to(element, {
        y: (i, target) => {
          // Calculate parallax movement based on element position
          return -(target.offsetHeight * (speed - 1) * intensity * multiplier);
        },
        ease: 'none',
        scrollTrigger: {
          trigger: element.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          // markers: true, // Debug
        },
      });
    });
    
    console.log(`✨ Parallax applied to ${parallaxElements.length} elements`);
  };

  // ============================================
  // STAGGERED CARD ANIMATIONS
  // ============================================
  const initCardAnimations = () => {
    // Disable card parallax on mobile
    if (isMobile()) {
      console.log('⚡ Card parallax disabled on mobile for performance');
      return;
    }
    
    // Reduce animation intensity on tablet
    const intensity = isTablet() ? 0.6 : 1;
    
    // FAQ Cards
    const faqCards = gsap.utils.toArray('.faq-card');
    if (faqCards.length > 0) {
      faqCards.forEach((card, index) => {
        const speed = 1 + (index % 3) * 0.15; // Varying speeds
        
        gsap.to(card, {
          y: -50 * speed * intensity,
          ease: 'none',
          scrollTrigger: {
            trigger: '.section--faq',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }

    // Wedding Party Members
    const weddingMembers = gsap.utils.toArray('.wedding-party-member');
    if (weddingMembers.length > 0) {
      weddingMembers.forEach((member, index) => {
        const speed = 1 + (index % 2) * 0.2; // Alternating speeds
        
        gsap.to(member, {
          y: -40 * speed * intensity,
          ease: 'none',
          scrollTrigger: {
            trigger: '.section--wedding-party',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }
    
    console.log('✨ Card animations initialized');
  };

  // ============================================
  // STICKY NAVIGATION SCROLL EFFECT
  // ============================================
  const initStickyNav = () => {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    let ticking = false;

    const updateNav = () => {
      const scrollY = window.pageYOffset;
      
      // Add 'scrolled' class when scrolled down more than 50px
      if (scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateNav(); // Initial call
  };

  // Initialize sticky navigation
  initStickyNav();

  // ============================================
  // HERO SECTION - FLOATING POLAROIDS WITH HOVER FOCUS
  // ============================================
  
  const initHeroAnimations = () => {
    const polaroids = document.querySelectorAll('.hero__polaroid');
    const heroTitle = document.querySelector('.hero__title');
    const heroTitleText = document.querySelector('.hero__title-text');
    const heroLocation = document.querySelector('.hero__location');
    const heroRsvpBtn = document.querySelector('.hero__rsvp-btn');
    const heroHashtag = document.querySelector('.hero__hashtag');
    
    if (!polaroids.length || !heroTitle) return;
    
    // Store original positions and properties for each polaroid
    const polaroidData = [];
    const rotations = [-15, 8, -12, 20, 3, -18, 12, -8, 15, -10];
    
    polaroids.forEach((polaroid, i) => {
      const rect = polaroid.getBoundingClientRect();
      const parentRect = polaroid.parentElement.getBoundingClientRect();
      
      // Store original data
      polaroidData.push({
        element: polaroid,
        rotation: rotations[i],
        originalOpacity: 0.2,
        originalWidth: polaroid.offsetWidth,
        isFocused: false
      });
      
      // Set initial state
      gsap.set(polaroid, {
        rotation: rotations[i],
        opacity: 0.2
      });
    });
    
    // ANIMATION 1: Continuous Floating Animation for all polaroids
    polaroids.forEach((polaroid, i) => {
      const data = polaroidData[i];
      
      // Create unique floating pattern for each polaroid
      const floatTimeline = gsap.timeline({ repeat: -1, yoyo: true });
      
      floatTimeline.to(polaroid, {
        y: `${gsap.utils.random(-30, 30)}`,
        x: `${gsap.utils.random(-20, 20)}`,
        rotation: data.rotation + gsap.utils.random(-8, 8),
        duration: gsap.utils.random(3, 5),
        ease: 'sine.inOut'
      });
      
      // Store timeline so we can pause it on hover
      data.floatTimeline = floatTimeline;
    });
    
    // ANIMATION 2: Hero title fades in
    gsap.to(heroTitle, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'power2.out',
      delay: 0.5
    });
    
    // ANIMATION 2b: Hero location fades in after title
    if (heroLocation) {
      gsap.to(heroLocation, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.8
      });
    }
    
    // ANIMATION 2c: Hero RSVP button fades in after location
    if (heroRsvpBtn) {
      gsap.to(heroRsvpBtn, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'back.out(1.4)',
        delay: 1.2
      });
    }
    
    // ANIMATION 2c: Hero hashtag split text animation
    if (heroHashtag && typeof Splitting !== 'undefined') {
      // Apply Splitting.js to split into characters
      Splitting({ target: heroHashtag, by: 'chars' });
      
      const chars = heroHashtag.querySelectorAll('.char');
      
      // Initial animation: Characters appear one by one
      gsap.set(chars, { opacity: 0, y: 20, rotationX: -90 });
      
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        delay: 0.8
      });
      
      // Glitch effect function
      const glitchEffect = () => {
        const glitchTimeline = gsap.timeline();
        
        // Random glitch effects on random characters
        chars.forEach((char, index) => {
          if (Math.random() > 0.6) { // 40% chance per character
            glitchTimeline.to(char, {
              x: gsap.utils.random(-5, 5),
              y: gsap.utils.random(-3, 3),
              scaleX: gsap.utils.random(0.8, 1.2),
              scaleY: gsap.utils.random(0.8, 1.2),
              opacity: gsap.utils.random(0.5, 1),
              duration: 0.05,
              ease: 'power4.inOut',
              yoyo: true,
              repeat: gsap.utils.random(1, 3, 1)
            }, index * 0.01);
          }
        });
        
        // Reset all characters back to normal
        glitchTimeline.to(chars, {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          duration: 0.2,
          ease: 'power2.out'
        }, '+=0.1');
      };
      
      // Start glitch effect every 4 seconds (after initial animation completes)
      setTimeout(() => {
        glitchEffect(); // First glitch
        setInterval(glitchEffect, 4000); // Repeat every 4 seconds
      }, 2000); // Wait 2 seconds after page load
    }
    
    // ANIMATION 3: Gradient follows mouse movement
    if (heroTitleText) {
      document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        gsap.to(heroTitleText, {
          backgroundPosition: `${x}% ${y}%`,
          duration: 0.3,
          ease: 'power1.out'
        });
      });
    }
    
    // ANIMATION 4: Hover to Focus - Scale in place & focus
    polaroids.forEach((polaroid, i) => {
      const data = polaroidData[i];
      
      polaroid.addEventListener('mouseenter', () => {
        if (data.isFocused) return;
        
        data.isFocused = true;
        polaroid.classList.add('is-focused');
        
        // Pause floating animation
        if (data.floatTimeline) {
          data.floatTimeline.pause();
        }
        
        // Get current animated values
        const currentX = gsap.getProperty(polaroid, 'x');
        const currentY = gsap.getProperty(polaroid, 'y');
        const currentRotation = gsap.getProperty(polaroid, 'rotation');
        
        // Scale in place, enlarge, focus
        gsap.to(polaroid, {
          scale: 2.5,
          rotation: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'power3.out',
          zIndex: 100,
          overwrite: 'auto'
        });
      });
      
      polaroid.addEventListener('mouseleave', () => {
        if (!data.isFocused) return;
        
        data.isFocused = false;
        polaroid.classList.remove('is-focused');
        
        // Return to original state
        gsap.to(polaroid, {
          scale: 1,
          rotation: data.rotation,
          opacity: 0.2,
          filter: 'blur(3px)',
          duration: 0.5,
          ease: 'power2.inOut',
          zIndex: 1,
          overwrite: 'auto',
          onComplete: () => {
            // Resume floating animation
            if (data.floatTimeline) {
              data.floatTimeline.resume();
            }
          }
        });
      });
    });
    
    // Safety net: Reset polaroids when mouse leaves hero section entirely
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mouseleave', () => {
        polaroids.forEach((polaroid, i) => {
          const data = polaroidData[i];
          if (data.isFocused) {
            // Simulate mouseleave for any still-focused polaroid
            polaroid.dispatchEvent(new Event('mouseleave'));
          }
        });
      });
    }
    
    // ANIMATION 5: Scroll parallax - polaroids move up at different speeds
    polaroids.forEach((polaroid) => {
      const speed = parseFloat(polaroid.getAttribute('data-scroll-speed')) || 0.5;
      
      gsap.to(polaroid, {
        y: () => -200 * speed,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          markers: false
        }
      });
    });
    
    // ANIMATION 6: Reset all polaroids when scrolling away from hero
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'bottom center',
      onEnter: () => resetAllPolaroids(),
      onEnterBack: () => {}, // Do nothing when scrolling back
      markers: false
    });
    
    // Function to reset all polaroids to default state
    const resetAllPolaroids = () => {
      polaroids.forEach((polaroid, i) => {
        const data = polaroidData[i];
        if (data.isFocused) {
          data.isFocused = false;
          polaroid.classList.remove('is-focused');
          
          gsap.to(polaroid, {
            scale: 1,
            rotation: data.rotation,
            opacity: 0.2,
            filter: 'blur(3px)',
            duration: 0.4,
            ease: 'power2.out',
            zIndex: 1,
            overwrite: 'auto'
          });
          
          // Resume floating animation
          if (data.floatTimeline) {
            data.floatTimeline.resume();
          }
        }
      });
    };
  };

  // ============================================
  // INITIALIZE NEW ANIMATION SYSTEMS
  // ============================================
  // Wait for libraries to load, then initialize animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Initialize after a short delay to ensure Lenis is ready
    setTimeout(() => {
      initHeroAnimations();
      initTextAnimations();
      initParallax();
      initCardAnimations();
      initDetailsAnimations();
      initWeddingPartyAnimations();
      
      // Refresh ScrollTrigger after all animations are set up
      ScrollTrigger.refresh();
    }, 100);
  }

  // ============================================
  // MOBILE HAMBURGER MENU
  // ============================================
  const initHamburgerMenu = () => {
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const siteNav = document.querySelector('.site-nav');
    const navLinks = document.querySelectorAll('.site-nav__links a');
    
    if (!hamburgerBtn || !siteNav) return;
    
    // Toggle menu on hamburger click
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('is-active');
      siteNav.classList.toggle('is-open');
      document.body.style.overflow = siteNav.classList.contains('is-open') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('is-active');
        siteNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
        hamburgerBtn.classList.remove('is-active');
        siteNav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  };
  
  initHamburgerMenu();

  // ============================================
  // WEDDING PARTY MODAL - FULL SCREEN PURPLE TAKEOVER
  // ============================================
  
  const initWeddingPartyModal = () => {
    const modal = document.getElementById('weddingPartyModal');
    if (!modal) return;
    
    const background = modal.querySelector('.wedding-party-modal__background');
    const closeBtn = modal.querySelector('.wedding-party-modal__close');
    const modalContent = modal.querySelector('.wedding-party-modal__content');
    const photoCircle = modal.querySelector('.wedding-party-modal__photo-circle');
    const modalPhoto = modal.querySelector('.wedding-party-modal__photo');
    const modalName = modal.querySelector('.wedding-party-modal__name');
    const modalRole = modal.querySelector('.wedding-party-modal__role');
    const modalStoryTitle = modal.querySelector('.wedding-party-modal__story-title');
    const modalStoryText = modal.querySelector('.wedding-party-modal__story-text');
    const cards = document.querySelectorAll('.wedding-party-card');
    
    if (!cards.length) return;
    
    // Story data for each person
    const stories = {
      alanna: "Shortly after moving into her junior year on-campus apartment, Shaira ran to get the door from hearing a ring, only to open it to Alanna, her new roommate, excitedly testing the doorbell. Four apartments together led to a lifelong friendship consisting of constantly changing conversations, all-you-can-eat restaurants, and annual joint birthday celebrations.",
      jennie: "At Intuit's new hire orientation, Shaira learned that Jennie was also a designer and randomly decided to brave her social anxiety by coming up to her to chat. She's so glad she did because they've now bonded for years over good food, cozy games and endless memes.",
      hannah: "Shaira and Hannah were introduced over boba one day through Junior's good friend and groomsman, Anthony. If you see them together, you'll probably catch them bopping at a concert or festival, coloring Bobbie Goods books, drinking matcha, or eating ice cream.",
      kimberly: "Kim and Shaira were introduced to each other by someone in Intervarsity, their college org, thinking they might bond over both growing up in the Philippines. And while their shared background did start it all, years of late night car conversations and shared life changes kept their friendship going strong to this day.",
      fabian: "One night while going to a car meet, Fabian ended up parking next to Junior, they both started talking about their cars and the stuff they had done to them. Since then they've gone on many adventures through mountains and deserts with their cars.",
      anthony: "During high school Anthony would always see Junior's car drive by, one day he saw Junior at a gas station and came up to him to say hello. After that, they bonded over cars and have been supporting each other ever since.",
      eddie: "One day while driving, Junior noticed a car behind him following him closely, he exited into an alley and the car followed him, it turns out the car was Eddie and he wanted to race for fun. The two ended up racing in the alleyway and that's how their friendship started.",
      jc: "JC met Junior at a car meet one random night, but their friendship grew over time as they bonded and tested their driving skills on the mountains, since then they have been there for each other and continue to race down mountains.",
      charlie: "Junior picked up Charlie from the back of a stranger's trunk. The moment Junior held Charlie up, was the moment he knew they would both have a bond for life. Ever since then both Charlie and Junior have traveled everywhere and have also grown up together from a small apartment to their new home with their backyard they always wanted."
    };
    
    // Open modal function
    const openModal = (person, clickedCard) => {
      const card = document.querySelector(`[data-person="${person}"]`);
      if (!card) return;
      
      // Get data from card
      const cardPhoto = card.querySelector('.wedding-party-card__photo-circle img');
      const nameEl = card.querySelector('.wedding-party-card__name');
      const roleEl = card.querySelector('.wedding-party-card__role');
      const story = stories[person] || "A wonderful friend who has been part of our journey.";
      
      // Set modal content
      if (cardPhoto) {
        modalPhoto.src = cardPhoto.src;
        modalPhoto.alt = cardPhoto.alt;
        console.log('Photo set:', modalPhoto.src);
      } else {
        console.log('No card photo found');
        modalPhoto.src = '';
        modalPhoto.alt = nameEl ? nameEl.textContent : '';
      }
      
      modalName.textContent = nameEl ? nameEl.textContent : '';
      modalRole.textContent = roleEl ? roleEl.textContent : '';
      modalStoryText.textContent = story;
      
      // Set story title based on role (bride vs groom)
      const role = roleEl ? roleEl.textContent.toLowerCase() : '';
      const isBridesmaid = role.includes('bridesmaid') || role.includes('dama');
      const isCharlie = person === 'charlie';
      
      if (isCharlie) {
        modalStoryTitle.textContent = 'How they met the groom';
      } else {
        modalStoryTitle.textContent = isBridesmaid ? 'How they met the bride' : 'How they met the groom';
      }
      
      // Apply Splitting.js to story text for word-by-word blur animation
      if (typeof Splitting !== 'undefined') {
        Splitting({ target: modalStoryText, by: 'words' });
      }
      
      // Disable Lenis smooth scroll
      if (typeof lenis !== 'undefined') {
        lenis.stop();
      }
      
      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Set initial states explicitly
      gsap.set(photoCircle, { opacity: 0, scale: 0.8 });
      gsap.set(modalName, { opacity: 0, y: 20 });
      gsap.set(modalRole, { opacity: 0, y: 20 });
      gsap.set(modalStoryTitle, { opacity: 0, y: 20 });
      gsap.set(closeBtn, { opacity: 0, scale: 0.8 });
      gsap.set(background, { opacity: 0 });
      
      // Animation Timeline
      const tl = gsap.timeline();
      
      // 1. Purple background - SIMPLE FADE IN
      tl.fromTo(background,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
      
      // 2. Photo circle fades in (modal's photo circle, not card's)
      tl.fromTo(photoCircle,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
        '-=0.3'
      );
      
      // 3. Name fades in
      tl.fromTo(modalName,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      );
      
      // 4. Role fades in
      tl.fromTo(modalRole,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );
      
      // 5. Story title fades in
      tl.fromTo(modalStoryTitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      );
      
      // 6. Close button fades in
      tl.fromTo(closeBtn,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' },
        '-=0.3'
      );
      
      // 7. Story text - WORD BY WORD BLUR ANIMATION
      // Add a callback to the timeline to ensure Splitting.js has completed
      tl.call(() => {
        const storyWords = modalStoryText.querySelectorAll('.word');
        console.log('Story words found:', storyWords.length);
        
        if (storyWords.length > 0) {
          gsap.fromTo(storyWords,
            { opacity: 0, filter: 'blur(10px)', y: 10 },
            { 
              opacity: 1, 
              filter: 'blur(0px)', 
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.03
            }
          );
        } else {
          console.log('No words found - Splitting may have failed');
        }
      });
    };
    
    // Close modal function
    const closeModal = () => {
      const allWords = modal.querySelectorAll('.word');
      
      // Animate out
      const tl = gsap.timeline({
        onComplete: () => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
          
          // Reset all words
          allWords.forEach(word => {
            gsap.set(word, { opacity: 0, filter: 'blur(10px)', y: 10 });
          });
          
          // Reset elements
          gsap.set(photoCircle, { opacity: 0, scale: 0.8 });
          gsap.set(modalName, { opacity: 0, y: 20 });
          gsap.set(modalRole, { opacity: 0, y: 20 });
          gsap.set(modalStoryTitle, { opacity: 0, y: 20 });
          gsap.set(background, { opacity: 0 });
          
          // Re-enable Lenis smooth scroll
          if (typeof lenis !== 'undefined') {
            lenis.start();
          }
        }
      });
      
      tl.to(allWords, { opacity: 0, filter: 'blur(10px)', duration: 0.2, ease: 'power2.in' })
        .to([modalName, modalRole, modalStoryTitle], { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, '-=0.1')
        .to(photoCircle, { scale: 0.8, opacity: 0, duration: 0.4, ease: 'power3.in' }, '-=0.2')
        .to(closeBtn, { opacity: 0, scale: 0.8, duration: 0.3, ease: 'power2.in' }, '-=0.3')
        .to(background, { opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.2');
    };
    
    // Event listeners
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const person = card.getAttribute('data-person');
        if (person) {
          openModal(person, card);
        }
      });
    });
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (background) background.addEventListener('click', closeModal);
    if (modalContent) modalContent.addEventListener('click', closeModal);
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  };
  
  initWeddingPartyModal();
  
  // ============================================
  // STORY OVERLAY
  // ============================================
  
  const initStoryOverlay = () => {
    const overlay = document.getElementById('storyOverlay');
    const heroHashtag = document.querySelector('.hero__hashtag');
    const background = overlay.querySelector('.story-overlay__background');
    const scrollContainer = overlay.querySelector('.story-overlay__scroll-container');
    const overlayHashtag = overlay.querySelector('.story-overlay__hashtag');
    const subtitle = overlay.querySelector('.story-overlay__subtitle');
    const paragraphs = overlay.querySelectorAll('.story-overlay__story p');
    const closeBtn = overlay.querySelector('.story-overlay__close');
    
    if (!overlay || !heroHashtag || !background) return;
    
    // Open story overlay
    const openStory = () => {
      console.log('🎬 Opening story overlay...');
      
      // Get position of hero hashtag
      const hashtagRect = heroHashtag.getBoundingClientRect();
      const centerX = hashtagRect.left + hashtagRect.width / 2;
      const centerY = hashtagRect.top + hashtagRect.height / 2;
      
      console.log('Hero hashtag position:', { centerX, centerY });
      
      // Calculate size needed to cover screen
      const maxDistance = Math.max(
        Math.hypot(centerX, centerY),
        Math.hypot(window.innerWidth - centerX, centerY),
        Math.hypot(centerX, window.innerHeight - centerY),
        Math.hypot(window.innerWidth - centerX, window.innerHeight - centerY)
      );
      const finalSize = maxDistance * 2.4;
      
      console.log('Circle final size:', finalSize);
      
      // Force reset background circle to ensure clean state
      gsap.set(background, {
        left: centerX,
        top: centerY,
        width: 0,
        height: 0,
        clearProps: 'all' // Clear any lingering properties
      });
      
      // Immediately set it back with proper values
      gsap.set(background, {
        left: centerX,
        top: centerY,
        width: 0,
        height: 0
      });
      
      // Cleanup any existing smooth scroll
      if (scrollContainer._cleanupSmoothScroll) {
        scrollContainer._cleanupSmoothScroll();
      }
      
      // Activate overlay
      overlay.classList.add('active');
      document.body.classList.add('story-active');
      
      // Reset scroll position
      scrollContainer.scrollTop = 0;
      
      // Disable Lenis smooth scroll
      if (typeof lenis !== 'undefined') {
        lenis.stop();
      }
      
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      
      // Ensure subtitle is reset (Splitting.js works with original text)
      const subtitleOriginalText = 'OUR STORY';
      if (!subtitle.hasAttribute('data-splitting-original')) {
        subtitle.setAttribute('data-splitting-original', subtitleOriginalText);
      }
      
      // Apply Splitting.js (it handles re-splitting automatically)
      if (typeof Splitting !== 'undefined') {
        Splitting({ target: subtitle, by: 'chars' });
      }
      
      // Animation timeline
      const tl = gsap.timeline();
      
      // 1. Expand background circle
      tl.to(background, {
        width: finalSize,
        height: finalSize,
        duration: 1.2,
        ease: 'power2.inOut'
      });
      
      // 2. Fade in scroll container
      tl.to(scrollContainer, {
        opacity: 1,
        duration: 0.4
      }, '-=0.4');
      
      // 3. Fade in overlay hashtag
      tl.to(overlayHashtag, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3');
      
      // 4. Animate subtitle
      tl.fromTo(subtitle.querySelectorAll('.char'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'back.out(1.7)'
        },
        '-=0.2'
      );
      
      tl.to(subtitle, {
        opacity: 1,
        duration: 0.3
      }, '<');
      
      // 5. Animate paragraphs
      paragraphs.forEach((p, index) => {
        tl.fromTo(p,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          },
          index === 0 ? '-=0.3' : '-=0.5'
        );
      });
      
      // Initialize smooth scrolling after animation completes
      tl.eventCallback('onComplete', () => {
        console.log('✅ Story overlay animation complete!');
        // Ensure hashtag stays visible
        gsap.set(overlayHashtag, { opacity: 1 });
        initSmoothScrollForOverlay();
      });
      
      console.log('📊 Timeline created with duration:', tl.duration(), 'seconds');
      console.log('✅ Story overlay opened with', paragraphs.length, 'paragraphs');
    };
    
    // Smooth scroll implementation for overlay
    let currentScroll = 0;
    let targetScroll = 0;
    let scrollRAF = null;
    
    const initSmoothScrollForOverlay = () => {
      if (!scrollContainer) return;
      
      // Reset scroll values
      currentScroll = 0;
      targetScroll = 0;
      scrollContainer.scrollTop = 0;
      
      console.log('🎯 Initializing smooth scroll for overlay');
      
      // Detect if device is touch-capable
      const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
      
      if (isTouchDevice) {
        // On touch devices, use native smooth scrolling
        console.log('📱 Touch device detected - using native scroll');
        scrollContainer.style.scrollBehavior = 'smooth';
        return; // Don't add custom scroll handlers on mobile
      }
      
      // Desktop-only custom smooth scroll
      console.log('🖥️ Desktop device - using custom smooth scroll');
      
      // Handle wheel events
      const handleWheel = (e) => {
        e.preventDefault();
        
        // Adjust target scroll position
        const delta = e.deltaY;
        targetScroll += delta;
        
        // Clamp target scroll
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
        
        // Start animation loop if not already running
        if (!scrollRAF) {
          animateScroll();
        }
      };
      
      // Smooth scroll animation loop
      const animateScroll = () => {
        // Lerp (linear interpolation) for smooth movement
        const ease = 0.1; // Adjust for smoothness (lower = smoother but slower)
        currentScroll += (targetScroll - currentScroll) * ease;
        
        // Apply scroll position
        scrollContainer.scrollTop = currentScroll;
        
        // Continue animation if not close enough to target
        if (Math.abs(targetScroll - currentScroll) > 0.5) {
          scrollRAF = requestAnimationFrame(animateScroll);
        } else {
          // Snap to target and stop animation
          scrollContainer.scrollTop = targetScroll;
          currentScroll = targetScroll;
          scrollRAF = null;
        }
      };
      
      // Handle native scroll for fallback (touch, scrollbar)
      const handleNativeScroll = () => {
        if (!scrollRAF) {
          // If user scrolls via scrollbar or touch, sync our values
          targetScroll = scrollContainer.scrollTop;
          currentScroll = scrollContainer.scrollTop;
        }
      };
      
      // Handle keyboard scrolling
      const handleKeyboard = (e) => {
        const keyScrollAmount = 100; // pixels per key press
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        
        switch(e.key) {
          case 'ArrowDown':
            e.preventDefault();
            targetScroll = Math.min(targetScroll + keyScrollAmount, maxScroll);
            if (!scrollRAF) animateScroll();
            break;
          case 'ArrowUp':
            e.preventDefault();
            targetScroll = Math.max(targetScroll - keyScrollAmount, 0);
            if (!scrollRAF) animateScroll();
            break;
          case ' ': // Space bar
            if (!e.shiftKey) {
              e.preventDefault();
              targetScroll = Math.min(targetScroll + keyScrollAmount * 3, maxScroll);
              if (!scrollRAF) animateScroll();
            }
            break;
          case 'PageDown':
            e.preventDefault();
            targetScroll = Math.min(targetScroll + scrollContainer.clientHeight * 0.9, maxScroll);
            if (!scrollRAF) animateScroll();
            break;
          case 'PageUp':
            e.preventDefault();
            targetScroll = Math.max(targetScroll - scrollContainer.clientHeight * 0.9, 0);
            if (!scrollRAF) animateScroll();
            break;
          case 'Home':
            e.preventDefault();
            targetScroll = 0;
            if (!scrollRAF) animateScroll();
            break;
          case 'End':
            e.preventDefault();
            targetScroll = maxScroll;
            if (!scrollRAF) animateScroll();
            break;
        }
      };
      
      // Add wheel listener for mouse wheel
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
      
      // Add scroll listener for scrollbar/touch
      scrollContainer.addEventListener('scroll', handleNativeScroll, { passive: true });
      
      // Add keyboard listener
      document.addEventListener('keydown', handleKeyboard);
      
      // Store cleanup function
      scrollContainer._cleanupSmoothScroll = () => {
        scrollContainer.removeEventListener('wheel', handleWheel);
        scrollContainer.removeEventListener('scroll', handleNativeScroll);
        document.removeEventListener('keydown', handleKeyboard);
        if (scrollRAF) {
          cancelAnimationFrame(scrollRAF);
          scrollRAF = null;
        }
        console.log('🧹 Smooth scroll cleaned up');
      };
      
      console.log('✅ Smooth scroll initialized for overlay');
    };
    
    // Close story overlay
    const closeStory = () => {
      // Cleanup smooth scroll
      if (scrollContainer._cleanupSmoothScroll) {
        scrollContainer._cleanupSmoothScroll();
        console.log('🧹 Cleaned up smooth scroll');
      }
      
      const tl = gsap.timeline({
        onComplete: () => {
          overlay.classList.remove('active');
          document.body.classList.remove('story-active');
          
          // Re-enable Lenis smooth scroll
          if (typeof lenis !== 'undefined') {
            lenis.start();
          }
          
          // Re-enable body scroll
          document.body.style.overflow = '';
          
          // Reset all elements to initial state
          gsap.set(background, {
            width: 0,
            height: 0,
            left: 0,
            top: 0
          });
          
          gsap.set([scrollContainer, overlayHashtag, subtitle], {
            opacity: 0
          });
          
          gsap.set(paragraphs, { 
            opacity: 0, 
            y: 30 
          });
          
          console.log('✅ Story overlay closed and reset');
        }
      });
      
      // Fade out content
      tl.to(scrollContainer, {
        opacity: 0,
        duration: 0.3
      });
      
      // Shrink background circle
      tl.to(background, {
        width: 0,
        height: 0,
        duration: 0.8,
        ease: 'power2.inOut'
      }, '-=0.2');
    };
    
    // Event listeners
    heroHashtag.addEventListener('click', openStory);
    closeBtn.addEventListener('click', closeStory);
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeStory();
      }
    });
    
  };
  
  initStoryOverlay();
  
  // ============================================
  // WEDDING PARTY POLAROID ANIMATIONS
  // ============================================
  
  // ============================================
  // DETAILS SECTION ANIMATIONS
  // ============================================
  const initDetailsAnimations = () => {
    const detailsSection = document.querySelector('.section--details');
    const detailsLabel = document.querySelector('.details__label');
    const detailsTexts = document.querySelectorAll('.details__text');
    
    if (!detailsSection || typeof gsap === 'undefined' || typeof Splitting === 'undefined') return;
    
    // Apply Splitting.js to label (characters)
    if (detailsLabel) {
      Splitting({ target: detailsLabel, by: 'chars' });
      
      requestAnimationFrame(() => {
        const chars = detailsLabel.querySelectorAll('.char');
        
        if (chars.length > 0) {
          gsap.fromTo(chars,
            { opacity: 0, filter: 'blur(10px)', y: 20 },
            {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.03,
              scrollTrigger: {
                trigger: detailsSection,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });
    }
    
    // Apply Splitting.js to text paragraphs (words)
    detailsTexts.forEach((text, index) => {
      Splitting({ target: text, by: 'words' });
      
      requestAnimationFrame(() => {
        const words = text.querySelectorAll('.word');
        
        if (words.length > 0) {
          gsap.fromTo(words,
            { opacity: 0, filter: 'blur(10px)', y: 20 },
            {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
              stagger: 0.04,
              scrollTrigger: {
                trigger: text,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });
    });
  };

  const initWeddingPartyAnimations = () => {
    const cards = document.querySelectorAll('.wedding-party-card');
    const bgText = document.querySelector('.wedding-party__bg-text');
    
    if (typeof gsap === 'undefined') return;
    
    // Animate background text with Splitting.js
    if (bgText && typeof Splitting !== 'undefined') {
      Splitting({ target: bgText, by: 'words' });
      
      requestAnimationFrame(() => {
        const words = bgText.querySelectorAll('.word');
        
        if (words.length > 0) {
          gsap.fromTo(words,
            { opacity: 0, filter: 'blur(10px)', y: 30 },
            {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              stagger: 0.05,
              scrollTrigger: {
                trigger: '.section--wedding-party',
                start: 'top 80%',
                end: 'bottom top',
                toggleActions: 'play none none reverse',
                markers: false
              }
            }
          );
        }
      });
      
      // Parallax for background text
      gsap.to(bgText, {
        y: -100,
        scrollTrigger: {
          trigger: '.section--wedding-party',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          markers: false
        }
      });
    }
    
    // Animate cards
    if (cards.length > 0) {
      cards.forEach((card, index) => {
        // Blur fade-in animation on scroll into view
        gsap.to(card, {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 60%',
            toggleActions: 'play none none none',
            markers: false
          }
        });
        
        // Continuous floating animation - only x and rotation, no y conflict
        const floatX = gsap.utils.random(-15, 15);
        const floatRotation = gsap.utils.random(-2, 2);
        const floatDuration = gsap.utils.random(4, 6);
        
        gsap.to(card, {
          x: floatX,
          rotation: floatRotation,
          repeat: -1,
          yoyo: true,
          duration: floatDuration,
          ease: 'sine.inOut',
          delay: index * 0.3
        });
        
        // Separate y-axis floating (independent timeline)
        const floatY = gsap.utils.random(20, 35);
        const floatYDuration = gsap.utils.random(5, 7);
        
        gsap.to(card, {
          y: floatY,
          repeat: -1,
          yoyo: true,
          duration: floatYDuration,
          ease: 'sine.inOut',
          delay: index * 0.2
        });
        
        // Disable parallax to prevent conflict
        // The floating animation provides enough movement
      });
    }
  };

  const parallaxElements = document.querySelectorAll('[data-parallax]');

  const updateParallax = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.speed || '0.2');
      const rect = element.getBoundingClientRect();
      const elementTop = scrollY + rect.top;
      const distance = scrollY - elementTop;

      element.style.transform = `translate3d(0, ${distance * speed}px, 0)`;
    });
  };

  if (parallaxElements.length > 0) {
    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    window.addEventListener('load', updateParallax, { once: true });
    window.addEventListener('resize', updateParallax);
    updateParallax();
  }

  const gradientTitle = document.querySelector('[data-gradient]');

  if (gradientTitle) {
    const current = { x: 50, y: 50 };
    const target = { x: 50, y: 50 };
    let rafId = null;

    const animateGradient = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;

      gradientTitle.style.setProperty('--gradient-x', `${current.x}%`);
      gradientTitle.style.setProperty('--gradient-y', `${current.y}%`);

      if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
        rafId = requestAnimationFrame(animateGradient);
      } else {
        gradientTitle.style.setProperty('--gradient-x', `${target.x}%`);
        gradientTitle.style.setProperty('--gradient-y', `${target.y}%`);
        rafId = null;
      }
    };

    const handleMouse = (event) => {
      const rect = gradientTitle.getBoundingClientRect();
      const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
      const relativeY = ((event.clientY - rect.top) / rect.height) * 100;

      target.x = Math.min(100, Math.max(0, relativeX));
      target.y = Math.min(100, Math.max(0, relativeY));

      if (rafId === null) {
        rafId = requestAnimationFrame(animateGradient);
      }
    };

    gradientTitle.addEventListener('mousemove', handleMouse);
    gradientTitle.addEventListener('mouseenter', () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(animateGradient);
      }
    });
    gradientTitle.addEventListener('mouseleave', () => {
      target.x = 50;
      target.y = 50;
      if (rafId === null) {
        rafId = requestAnimationFrame(animateGradient);
      }
    });
  }

  // ============================================
  // RSVP FORM WITH GOOGLE SHEETS INTEGRATION
  // ============================================

  // Configuration: Set your Google Apps Script Web App URL here
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyI-5vuimekZCXbVPtiL2hwSKhH-kd_VDRm53op-MTSS_qoK-M1kTCJd93wj0Iw47KZ/exec';
  
  // This will store the guest data fetched from Google Sheets
  let guestData = [];
  let selectedGuest = null;

  // Fetch guest list from Google Sheets on page load
  const fetchGuestList = async () => {
    try {
      console.log('🔍 Fetching guest list from:', GOOGLE_SCRIPT_URL);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getGuests`);
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Raw data received:', data);
        
        // Check if it's an error response
        if (data.error) {
          console.error('❌ Error from script:', data.error);
          guestData = getSampleGuestData();
        } else {
          guestData = data;
          console.log('✅ Guest list loaded:', guestData.length, 'guests');
          console.log('👥 Guest names:', guestData.map(g => g.name));
        }
      } else {
        console.error('❌ Failed to load guest list. Status:', response.status);
        // Fallback to sample data for testing
        guestData = getSampleGuestData();
      }
    } catch (error) {
      console.error('❌ Error fetching guest list:', error);
      // Fallback to sample data for testing
      guestData = getSampleGuestData();
    }
  };

  // Sample guest data structure (for testing before Google Sheets is set up)
  const getSampleGuestData = () => {
    return [
      {
        id: 1,
        name: 'John Smith',
        party: ['John Smith', 'Jane Smith', 'Tommy Smith']
      },
      {
        id: 2,
        name: 'Maria Garcia',
        party: ['Maria Garcia', 'Carlos Garcia']
      },
      {
        id: 3,
        name: 'David Lee',
        party: ['David Lee']
      }
    ];
  };

  // Initialize guest search functionality
  const initGuestSearch = () => {
    const searchInput = document.getElementById('guest-search');
    const dropdown = document.getElementById('guest-dropdown');
    const guestInfo = document.getElementById('guest-info');

    if (!searchInput || !dropdown) return;

    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();

      if (searchTerm.length < 2) {
        dropdown.classList.remove('active');
        return;
      }

      const filteredGuests = guestData.filter(guest => {
        // Search by party name
        const matchesPartyName = guest.name.toLowerCase().includes(searchTerm);
        
        // Search by individual party member names
        const matchesPartyMember = guest.party && guest.party.some(member =>
          member.toLowerCase().includes(searchTerm)
        );
        
        return matchesPartyName || matchesPartyMember;
      });

      if (filteredGuests.length === 0) {
        dropdown.innerHTML = '<div class="guest-dropdown__item" style="cursor: default;">No guests found</div>';
        dropdown.classList.add('active');
        return;
      }

      dropdown.innerHTML = filteredGuests.map(guest => {
        // Format party members list with commas and "&" before last member
        let membersList = '';
        if (guest.party && guest.party.length > 0) {
          if (guest.party.length === 1) {
            membersList = guest.party[0];
          } else if (guest.party.length === 2) {
            membersList = guest.party.join(' & ');
          } else {
            const lastMember = guest.party[guest.party.length - 1];
            const otherMembers = guest.party.slice(0, -1);
            membersList = otherMembers.join(', ') + ', & ' + lastMember;
          }
        }
        
        return `
          <div class="guest-dropdown__item" data-guest-id="${guest.id}" data-guest-name="${guest.name}">
            <div class="guest-dropdown__item-name">${guest.name}</div>
            ${membersList ? `<div class="guest-dropdown__item-members">${membersList}</div>` : ''}
          </div>
        `;
      }).join('');

      dropdown.classList.add('active');

      // Add click handlers to dropdown items
      dropdown.querySelectorAll('.guest-dropdown__item[data-guest-id]').forEach(item => {
        item.addEventListener('click', () => {
          const guestId = item.dataset.guestId;
          const guestName = item.dataset.guestName;
          console.log('🔍 Selected guest ID:', guestId, 'Name:', guestName);
          selectGuest(guestId);
        });
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  };

  // Select a guest and show their party members
  const selectGuest = (guestId) => {
    // Convert guestId to number if it's a string number, otherwise keep as is
    const searchId = isNaN(guestId) ? guestId : Number(guestId);
    
    // Find guest by matching ID (handle both string and number comparison)
    selectedGuest = guestData.find(g => g.id == searchId);
    
    if (!selectedGuest) {
      console.error('❌ Guest not found with ID:', guestId, 'Converted to:', searchId);
      console.log('📋 Available guests:', guestData.map(g => ({ id: g.id, name: g.name })));
      return;
    }

    console.log('✅ Selected guest:', selectedGuest);

    const searchInput = document.getElementById('guest-search');
    const dropdown = document.getElementById('guest-dropdown');
    const guestInfo = document.getElementById('guest-info');
    const selectedGuestName = document.getElementById('selected-guest-name');
    const partyMembers = document.getElementById('party-members');

    // Reset attendance selection
    const attendingYes = document.getElementById('attending-yes');
    const attendingNo = document.getElementById('attending-no');
    const attendingYesSection = document.getElementById('attending-yes-section');
    
    if (attendingYes) attendingYes.checked = false;
    if (attendingNo) attendingNo.checked = false;
    if (attendingYesSection) attendingYesSection.style.display = 'none';

    // Update UI
    searchInput.value = selectedGuest.name;
    dropdown.classList.remove('active');
    guestInfo.style.display = 'grid';
    selectedGuestName.textContent = selectedGuest.name;

    // Render party member checkboxes
    partyMembers.innerHTML = selectedGuest.party.map((member, index) => `
      <div class="party-member">
        <input 
          type="checkbox" 
          id="member-${selectedGuest.id}-${index}" 
          name="party-member" 
          value="${member}"
          checked
        />
        <label for="member-${selectedGuest.id}-${index}">${member}</label>
      </div>
    `).join('');
    
    // Store whether this is a single-person party
    selectedGuest.isSinglePerson = selectedGuest.party.length === 1;
    console.log(`👤 Party size: ${selectedGuest.party.length}, Single person: ${selectedGuest.isSinglePerson}`);
  };

  // Handle form submission
  const initFormSubmission = () => {
    const form = document.getElementById('rsvp-form');
    const formStatus = document.getElementById('form-status');
    const attendingYesSection = document.getElementById('attending-yes-section');
    const attendingYesRadio = document.getElementById('attending-yes');
    const attendingNoRadio = document.getElementById('attending-no');
    const messageLabel = document.getElementById('message-label');

    if (!form) return;

    // Show/hide "Who will be attending" section based on Yes/No selection
    const handleAttendanceChange = () => {
      // Check if the selected guest has a single-person party
      const isSinglePerson = selectedGuest && selectedGuest.isSinglePerson;
      
      if (attendingYesRadio && attendingYesRadio.checked) {
        // Only show the attending section if there's more than 1 person in the party
        if (!isSinglePerson) {
          attendingYesSection.style.display = 'block';
        } else {
          attendingYesSection.style.display = 'none';
          console.log('👤 Single person party - hiding "Who will be attending" section');
        }
        // Update label text for "Yes" selection
        if (messageLabel) {
          messageLabel.textContent = 'Leave a message or song request (Optional)';
        }
      } else {
        attendingYesSection.style.display = 'none';
        // Update label text for "No" selection
        if (messageLabel) {
          messageLabel.textContent = 'Leave a message (Optional)';
        }
      }
      
      // Refresh ScrollTrigger after layout change
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
    };

    attendingYesRadio?.addEventListener('change', handleAttendanceChange);
    attendingNoRadio?.addEventListener('change', handleAttendanceChange);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!selectedGuest) {
        showFormStatus('error', 'Please select your name from the list');
        return;
      }

      // Check if attendance question is answered
      const attendingValue = form.querySelector('input[name="attending"]:checked')?.value;
      if (!attendingValue) {
        showFormStatus('error', 'Please indicate if you will be attending');
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      let attendingMembers = [];
      let dietaryRestrictions = '';
      
      // If attending YES, get party members and dietary restrictions
      if (attendingValue === 'yes') {
        const checkboxes = form.querySelectorAll('input[name="party-member"]:checked');
        attendingMembers = Array.from(checkboxes).map(cb => cb.value);

        if (attendingMembers.length === 0) {
          showFormStatus('error', 'Please select at least one person attending');
          return;
        }

        dietaryRestrictions = document.getElementById('dietary-restrictions')?.value || '';
      }

      const message = document.getElementById('message')?.value || '';

      // Prepare submission data
      const submissionData = {
        guestId: selectedGuest.id,
        guestName: selectedGuest.name,
        attending: attendingValue === 'yes',
        totalInParty: selectedGuest.party.length,
        attendingCount: attendingValue === 'yes' ? attendingMembers.length : 0,
        attendingMembers: attendingValue === 'yes' ? attendingMembers : [],
        notAttendingMembers: attendingValue === 'yes' 
          ? selectedGuest.party.filter(m => !attendingMembers.includes(m))
          : selectedGuest.party,
        dietaryRestrictions: dietaryRestrictions,
        message: message,
        timestamp: new Date().toISOString()
      };

      console.log('📤 Submitting RSVP:', submissionData);

      // Disable submit button
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        });

        // Note: With no-cors mode, we can't read the response
        // We'll assume success if no error is thrown
        showFormStatus('success', '✓ Thank you! Your RSVP has been received.');
        submitButton.textContent = 'RSVP Sent!';
        
        // Reset form after delay
        setTimeout(() => {
          form.reset();
          document.getElementById('guest-info').style.display = 'none';
          attendingYesSection.style.display = 'none';
          selectedGuest = null;
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          formStatus.style.display = 'none';
        }, 5000);

      } catch (error) {
        console.error('❌ Submission error:', error);
        showFormStatus('error', 'There was an error submitting your RSVP. Please try again.');
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    });
  };

  // Show form status message
  const showFormStatus = (type, message) => {
    const formStatus = document.getElementById('form-status');
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;
    formStatus.style.display = 'block';
  };

  // Initialize RSVP functionality
  const initRSVP = async () => {
    await fetchGuestList();
    initGuestSearch();
    initFormSubmission();
  };

  // Start RSVP system
  initRSVP();


  // ============================================
  // SCROLL FADE IN/OUT ANIMATIONS
  // ============================================
  
  const initScrollFadeAnimations = () => {
    const sectionContents = document.querySelectorAll('.section__content');
    
    if (sectionContents.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        // Fade in when 20% visible, fade out when less than 10% visible
        if (entry.intersectionRatio > 0.2) {
          entry.target.classList.add('fade-in');
        } else if (entry.intersectionRatio < 0.1) {
          entry.target.classList.remove('fade-in');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionContents.forEach(content => {
      observer.observe(content);
    });
  };

  // Initialize scroll fade animations
  initScrollFadeAnimations();

  // ============================================
  // PARALLAX TRANSITION: OUR STORY -> WEDDING PARTY
  // ============================================
  
  const initSectionTransition = () => {
    const ourStorySection = document.querySelector('.section--intro');
    const weddingPartySection = document.querySelector('.section--wedding-party');
    
    if (!ourStorySection || !weddingPartySection) return;

    let ticking = false;

    const updateTransition = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      
      // Get positions
      const ourStoryRect = ourStorySection.getBoundingClientRect();
      const weddingPartyRect = weddingPartySection.getBoundingClientRect();
      
      // Calculate when wedding party enters viewport
      const weddingPartyTop = scrollY + weddingPartyRect.top;
      const transitionStart = weddingPartyTop - windowHeight;
      const transitionEnd = weddingPartyTop - (windowHeight * 0.3);
      
      // Calculate progress (0 to 1)
      let progress = (scrollY - transitionStart) / (transitionEnd - transitionStart);
      progress = Math.max(0, Math.min(1, progress));
      
      // Apply effects to Our Story section
      const ourStoryOpacity = 1 - progress;
      const ourStoryScale = 1 - (progress * 0.1); // Scale from 1 to 0.9
      
      ourStorySection.style.opacity = ourStoryOpacity;
      ourStorySection.style.transform = `scale(${ourStoryScale})`;
      
      // Wedding party section visibility is now handled by scroll animation
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTransition();
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateTransition);
    window.addEventListener('load', updateTransition);
    
    // Initial update
    updateTransition();
  };

  // Initialize section transition
  initSectionTransition();

  // ============================================
  // WEDDING PARTY SCROLL TRANSITIONS
  // ============================================
  
  const initWeddingPartyScroll = () => {
    const weddingPartySection = document.querySelector('.section--wedding-party');
    const titleElement = document.querySelector('.wedding-party-title');
    const groupElements = document.querySelectorAll('.wedding-party-group');
    
    if (!weddingPartySection) return;

    let ticking = false;
    let isScrambling = false;
    let scrambleInterval = null;

    // Scramble text effect
    const scrambleText = (element, targetText, duration = 800) => {
      if (!element || isScrambling) return;
      
      isScrambling = true;
      const startText = element.textContent;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const maxLength = Math.max(startText.length, targetText.length);
      let frame = 0;
      const totalFrames = duration / 50; // 50ms per frame
      
      clearInterval(scrambleInterval);
      
      scrambleInterval = setInterval(() => {
        let output = '';
        
        for (let i = 0; i < maxLength; i++) {
          const progress = frame / totalFrames;
          const charProgress = Math.max(0, Math.min(1, (progress * maxLength - i) / 2));
          
          if (charProgress >= 1) {
            // Letter has locked in
            output += targetText[i] || '';
          } else if (charProgress > 0) {
            // Letter is scrambling
            output += chars[Math.floor(Math.random() * chars.length)];
          } else {
            // Letter hasn't started scrambling yet
            output += startText[i] || ' ';
          }
        }
        
        element.textContent = output.trim();
        frame++;
        
        if (frame >= totalFrames) {
          element.textContent = targetText;
          clearInterval(scrambleInterval);
          isScrambling = false;
        }
      }, 50);
    };

    let currentTitleText = 'WEDDING PARTY';
    let hasChangedToGroomsmen = false;
    let hasChangedToBridesmaids = false;

    const updateMembers = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      
      const sectionRect = weddingPartySection.getBoundingClientRect();
      const sectionTop = scrollY + sectionRect.top;
      const sectionHeight = sectionRect.height;
      
      // Calculate which item should be active based on scroll
      const scrollIntoSection = scrollY - sectionTop;
      const totalItems = 1 + groupElements.length; // title + groups (groomsmen + bridesmaids)
      const itemScrollSpace = sectionHeight / totalItems;
      const overlapAmount = 0.2; // 20% overlap
      
      // Calculate overall progress through wedding party section
      const overallProgress = scrollIntoSection / sectionHeight;
      
      // Handle title animation - now handles multiple transformations
      if (titleElement) {
        const titleText = titleElement.querySelector('.wedding-party-title__text');
        let opacity, scale, blur, translateY;
        const centerToTop = -(windowHeight * 0.5 - 60);
        
        // Phase 1: WEDDING PARTY intro (0-33%)
        if (overallProgress < 0.15) {
          // Fade in
          const fadeInProgress = overallProgress / 0.15;
          opacity = fadeInProgress;
          scale = 0.2 + (fadeInProgress * 0.8);
          blur = (1 - fadeInProgress) * 20;
          translateY = 0;
          
          if (titleText && titleText.textContent !== 'WEDDING PARTY') {
            titleText.textContent = 'WEDDING PARTY';
            hasChangedToGroomsmen = false;
            hasChangedToBridesmaids = false;
          }
        } else if (overallProgress < 0.25) {
          // Hold centered
          opacity = 1;
          scale = 1;
          blur = 0;
          translateY = 0;
        } else if (overallProgress < 0.28) {
          // Scramble to GROOMSMEN
          opacity = 1;
          scale = 1;
          blur = 0;
          translateY = 0;
          
          if (!hasChangedToGroomsmen && titleText && !isScrambling) {
            hasChangedToGroomsmen = true;
            scrambleText(titleText, 'GROOMSMEN', 600);
          }
        } else if (overallProgress < 0.35) {
          // Move to top
          const moveProgress = (overallProgress - 0.28) / 0.07;
          opacity = 1;
          scale = 1 - (moveProgress * 0.85);
          blur = 0;
          translateY = centerToTop * moveProgress;
        } else if (overallProgress < 0.58) {
          // Stay at top with groomsmen group visible
          opacity = 1;
          scale = 0.15;
          blur = 0;
          translateY = centerToTop;
        } else if (overallProgress < 0.61) {
          // Move back to center
          const moveProgress = (overallProgress - 0.58) / 0.03;
          opacity = 1;
          scale = 0.15 + (moveProgress * 0.85);
          blur = 0;
          translateY = centerToTop * (1 - moveProgress);
        } else if (overallProgress < 0.64) {
          // Hold centered before scramble
          opacity = 1;
          scale = 1;
          blur = 0;
          translateY = 0;
        } else if (overallProgress < 0.67) {
          // Scramble to BRIDESMAIDS
          opacity = 1;
          scale = 1;
          blur = 0;
          translateY = 0;
          
          if (!hasChangedToBridesmaids && titleText && !isScrambling) {
            hasChangedToBridesmaids = true;
            scrambleText(titleText, 'BRIDESMAIDS', 600);
          }
        } else if (overallProgress < 0.74) {
          // Move to top again
          const moveProgress = (overallProgress - 0.67) / 0.07;
          opacity = 1;
          scale = 1 - (moveProgress * 0.85);
          blur = 0;
          translateY = centerToTop * moveProgress;
        } else if (overallProgress < 0.95) {
          // Stay at top with bridesmaids group visible
          opacity = 1;
          scale = 0.15;
          blur = 0;
          translateY = centerToTop;
        } else {
          // Fade out at end
          const fadeOutProgress = (overallProgress - 0.95) / 0.05;
          opacity = 1 - fadeOutProgress;
          scale = 0.15;
          blur = fadeOutProgress * 10;
          translateY = centerToTop;
        }
        
        titleElement.style.opacity = opacity;
        if (titleText) {
          titleText.style.transform = `translate(0, ${translateY}px) scale(${scale})`;
          titleText.style.filter = `blur(${blur}px)`;
          titleText.style.opacity = opacity;
        }
      }
      
      // Handle each group animation (groomsmen and bridesmaids)
      groupElements.forEach((groupElement, groupIndex) => {
        const baseStart = (groupIndex + 1) * itemScrollSpace;
        const groupStart = baseStart - (itemScrollSpace * overlapAmount);
        const groupEnd = baseStart + itemScrollSpace + (itemScrollSpace * overlapAmount);
        const groupProgress = (scrollIntoSection - groupStart) / (groupEnd - groupStart);
        const clampedProgress = Math.max(0, Math.min(1, groupProgress));
        
        let opacity, scale, blur;
        
        if (clampedProgress < 0.3) {
          const fadeInProgress = clampedProgress / 0.3;
          opacity = fadeInProgress;
          scale = 0.2 + (fadeInProgress * 0.8);
          blur = (1 - fadeInProgress) * 20;
        } else if (clampedProgress < 0.7) {
          opacity = 1;
          scale = 1;
          blur = 0;
        } else {
          const fadeOutProgress = (clampedProgress - 0.7) / 0.3;
          opacity = 1 - fadeOutProgress;
          scale = 1 + (fadeOutProgress * 0.5);
          blur = fadeOutProgress * 20;
        }
        
        groupElement.style.opacity = opacity;
        
        // Apply to all cards in this group
        const cards = groupElement.querySelectorAll('.wedding-party-card');
        cards.forEach(card => {
          card.style.transform = `scale(${scale})`;
          card.style.filter = `blur(${blur}px)`;
          card.style.opacity = opacity;
        });
      });
      
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateMembers();
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateMembers);
    window.addEventListener('load', updateMembers);
    
    // Initial update
    updateMembers();
  };

  // Initialize wedding party scroll
  initWeddingPartyScroll();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const targetElement = document.querySelector(href);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // Language translations
  const translations = {
    en: {
      nav: {
        home: 'HOME',
        rsvp: 'RSVP',
        wedding_party: 'WEDDING PARTY',
        accommodations: 'ACCOMMODATIONS',
        faq: 'FAQ'
      },
      logo: 'JS',
      hero: {
        title: 'JUNIOR & SHAIRA',
        subtitle: 'Are Getting Married',
        cta: 'RSVP'
      },
      wedding_party: {
        title: 'WEDDING PARTY',
        desc: 'The people that will be here to celebrate it with us',
        member1: {
          name: 'Fabian Sanchez',
          role: 'Groomsmen / Officiant'
        },
        member2: {
          name: 'Jennie Yoon',
          role: 'Bridesmaid'
        },
        member3: {
          name: 'Anthony Castro',
          role: 'Groomsmen'
        },
        member4: {
          name: 'Hannah Lindsey',
          role: 'Bridesmaid'
        },
        member5: {
          name: 'Eduardo Bazan',
          role: 'Groomsmen'
        },
        member6: {
          name: 'Alana',
          role: 'Bridesmaid'
        },
        member7: {
          name: 'Juan Carlos Avila',
          role: 'Groomsmen'
        },
        member8: {
          name: 'Kim',
          role: 'Bridesmaid'
        }
      },
      story: {
        title: 'Our Story',
        p1: 'From chance encounters in bustling Manila cafés to sunsets on island shores, Junior and Shaira have collected countless memories leading to this celebration. We can\'t wait to share our next chapter with you.',
        p2: 'Take a glimpse into the weekend itinerary and start planning for a getaway surrounded by crystal waters, lush landscapes, and the people we love most.'
      },
      wedding_party: {
        groomsman1: {
          role: 'GROOMSMAN',
          name: 'Fabian Sanchez',
          desc: "Fabian met Junior through a mutual friend on their way to a car event."
        },
        bridesmaid1: {
          role: 'BRIDESMAID',
          name: 'Sarah Chen',
          desc: "Shaira's sister and lifelong confidante."
        },
        groomsman2: {
          role: 'GROOMSMAN',
          name: 'David Thompson',
          desc: "The life of the party and Junior's college roommate."
        },
        bridesmaid2: {
          role: 'BRIDESMAID',
          name: 'Emma Martinez',
          desc: "Shaira's best friend from childhood and travel companion."
        }
      },
      events: {
        title: 'Weekend Highlights',
        event1: {
          title: 'Welcome Sunset Cruise',
          time: 'Friday · 5:30 PM',
          desc: 'Set sail across the islands as we toast the start of our wedding festivities with music, cocktails, and breathtaking views.'
        },
        event2: {
          title: 'Wedding Ceremony',
          time: 'Saturday · 3:00 PM',
          desc: 'Exchange vows at a hidden cove, followed by a beachfront dinner under the stars. Semi-formal attire encouraged.'
        },
        event3: {
          title: 'Island Adventure',
          time: 'Sunday · 9:00 AM',
          desc: 'Explore lagoons, snorkel vibrant reefs, or simply lounge by the shore as we wind down an unforgettable weekend together.'
        }
      },
      location: {
        title: 'Location',
        desc: 'We\'ve reserved rooms at our host resort and curated travel recommendations to make planning easy. Expect an email with booking details and travel tips soon.',
        cta: 'View Guide'
      },
      faq: {
        title: 'FAQ',
        desc: 'Answers to questions you may have',
        q1: {
          question: 'Is there an RSVP deadline?',
          answer: 'Please RSVP by February 14, 2026 via our website or by texting Shaira at (408) 881-4877. We unfortunately can\'t accommodate RSVPs past this date.'
        },
        q2: {
          question: 'Where will the wedding be?',
          answer: 'All wedding events will be at Arbor Terrace at Grand Tradition Estate and Gardens. Be sure to turn left and follow signs for Arbor Terrace once you enter.'
        },
        q3: {
          question: 'What time Should I Arrive',
          answer: 'Guests should arrive at 2:30 PM for welcome drinks and seating. The ceremony will begin at 3 PM sharp and we can\'t accommodate late arrivals.'
        },
        q4: {
          question: 'What should I wear?',
          answer: 'The dress code is cocktail attire. This generally means that knee-length or midi cocktail dresses, evening dresses, sundresses, jumpsuits, casual suits, slacks, button-downs, suits and sports coats with or without ties are perfect for our wedding.\n\nThe ceremony and cocktail hour will be fully outdoors, and reception will be in a partially outdoor space, so we recommend bringing a layer! It\'s typically X in Fallbrook in March.\n\nWhile we appreciate everyone\'s individual style, we kindly request that guests refrain from wearing informal clothing like shirts and jeans. And in case you were curious, the wedding party will be wearing lavender.'
        },
        q5: {
          question: 'Will there be parking at the venue?',
          answer: 'There\'s lots of parking available at the venue! If needed, you can leave your vehicle at the venue overnight, as long as it\'s picked up by noon on Sunday.'
        },
        q6: {
          question: 'Will there be transportation provided?',
          answer: 'If you choose not to drive to the venue or plan to drink (it is an open bar after all), we\'re sponsoring Uber rides to and from the venue. We\'ll send you codes the day of!'
        },
        q7: {
          question: 'Can I bring a Plus One / Date? Can (another person) come?',
          answer: 'The number of seats and names of guests in your party are listed on your invitation. Your invitation will be made out to {Your name} and Guest if a plus one has been added to your party. Unfortunately, we can\'t accommodate any additional guests.'
        },
        q8: {
          question: 'Can I bring my kids?',
          answer: 'We love your little ones, but we have decided to have our wedding be mostly child-free, with the exception of a few select family members. Unless noted on your invite, we kindly ask that only guests aged 12 and up attend.'
        }
      },
      rsvp: {
        title: 'RSVP',
        desc: 'Let us know if you\'ll be able to make it'
      },
      accommodations: {
        fly_label: 'Where to fly in to:',
        airport_title: 'Airport',
        airport_name: 'San Diego International Airport (SAN)',
        airport_address: '3225 N. Harbor Drive, San Diego, CA 92101',
        stay_title: 'Where you can stay',
        stay_desc: 'Here\'s a few places we recommend for you all to stay at, that\'s close to the venue',
        welk: {
          name: 'THE WELK RESORT',
          distance: '22 mins away',
          description: 'A family-friendly resort with a number of pools, golf courses, and a spa, among other amenities.'
        },
        pala: {
          name: 'PALA MESA RESORT',
          distance: '15 mins away',
          description: 'Resort known for its golf course. Closest to the venue but is farther from other things to do.'
        },
        springhill: {
          name: 'SPRINGHILL SUITES',
          distance: '22 mins away',
          description: 'Hotel right on the coast, steps away from the beach. Located in lively downtown Oceanside.'
        },
        airbnb: {
          name: 'AIRBNB',
          distance: 'Varies',
          description: 'There are many vacation homes for rent on AirBnb in Fallbrook for proximity to the venue.'
        }
      },
      form: {
        search_name: 'Search for Your Name',
        search_placeholder: 'Start typing your name...',
        party_label: 'Your Party:',
        attendance: 'Who will be attending?',
        message: 'Message (Optional)',
        message_placeholder: 'Leave us a note, song request, or dietary restrictions!',
        submit: 'Send RSVP'
      }
    },
    es: {
      nav: {
        home: 'INICIO',
        rsvp: 'RSVP',
        wedding_party: 'FIESTA NUPCIAL',
        accommodations: 'ALOJAMIENTO',
        faq: 'PREGUNTAS'
      },
      logo: 'JS',
      hero: {
        title: 'JUNIOR & SHAIRA',
        subtitle: 'Se Casan',
        cta: 'RSVP'
      },
      wedding_party: {
        title: 'FIESTA NUPCIAL',
        desc: 'Las personas que estarán aquí para celebrarlo con nosotros',
        member1: {
          name: 'Fabian Sanchez',
          role: 'Padrino / Oficiante'
        },
        member2: {
          name: 'Jennie Yoon',
          role: 'Dama de Honor'
        },
        member3: {
          name: 'Anthony Castro',
          role: 'Padrino'
        },
        member4: {
          name: 'Hannah Lindsey',
          role: 'Dama de Honor'
        },
        member5: {
          name: 'Eduardo Bazan',
          role: 'Padrino'
        },
        member6: {
          name: 'Alana',
          role: 'Dama de Honor'
        },
        member7: {
          name: 'Juan Carlos Avila',
          role: 'Padrino'
        },
        member8: {
          name: 'Kim',
          role: 'Dama de Honor'
        }
      },
      story: {
        title: 'Nuestra Historia',
        p1: 'Desde encuentros casuales en los bulliciosos cafés de Manila hasta atardeceres en las costas de las islas, Junior y Shaira han acumulado innumerables recuerdos que los llevan a esta celebración. No podemos esperar para compartir nuestro próximo capítulo con ustedes.',
        p2: 'Eche un vistazo al itinerario del fin de semana y comience a planificar una escapada rodeada de aguas cristalinas, paisajes exuberantes y las personas que más amamos.'
      },
      wedding_party: {
        groomsman1: {
          role: 'PADRINO',
          name: 'Fabian Sanchez',
          desc: "Fabian conoció a Junior a través de un amigo en común de camino a un evento de autos."
        },
        bridesmaid1: {
          role: 'DAMA DE HONOR',
          name: 'Sarah Chen',
          desc: "La hermana de Shaira y confidente de toda la vida."
        },
        groomsman2: {
          role: 'PADRINO',
          name: 'David Thompson',
          desc: "El alma de la fiesta y compañero de cuarto de Junior en la universidad."
        },
        bridesmaid2: {
          role: 'DAMA DE HONOR',
          name: 'Emma Martinez',
          desc: "La mejor amiga de Shaira desde la infancia y compañera de viajes."
        }
      },
      events: {
        title: 'Eventos del Fin de Semana',
        event1: {
          title: 'Crucero de Bienvenida al Atardecer',
          time: 'Viernes · 5:30 PM',
          desc: 'Navegue por las islas mientras brindamos por el comienzo de nuestras festividades de boda con música, cócteles y vistas impresionantes.'
        },
        event2: {
          title: 'Ceremonia de Boda',
          time: 'Sábado · 3:00 PM',
          desc: 'Intercambio de votos en una cala escondida, seguido de una cena frente a la playa bajo las estrellas. Se recomienda vestimenta semi-formal.'
        },
        event3: {
          title: 'Aventura en la Isla',
          time: 'Domingo · 9:00 AM',
          desc: 'Explore lagunas, bucee en arrecifes vibrantes o simplemente relájese en la orilla mientras terminamos un fin de semana inolvidable juntos.'
        }
      },
      location: {
        title: 'Ubicación',
        desc: 'Hemos reservado habitaciones en nuestro resort anfitrión y seleccionado recomendaciones de viaje para facilitar la planificación. Espere un correo electrónico con detalles de reserva y consejos de viaje pronto.',
        cta: 'Ver Guía'
      },
      faq: {
        title: 'Preguntas Frecuentes',
        desc: 'Respuestas a preguntas que puedas tener',
        q1: {
          question: '¿Hay una fecha límite para RSVP?',
          answer: 'Por favor confirme su asistencia antes del 14 de febrero de 2026 a través de nuestro sitio web o enviando un mensaje de texto a Shaira al (408) 881-4877. Desafortunadamente, no podemos aceptar confirmaciones después de esta fecha.'
        },
        q2: {
          question: '¿Dónde será la boda?',
          answer: 'Todos los eventos de la boda serán en Arbor Terrace en Grand Tradition Estate and Gardens. Asegúrese de girar a la izquierda y seguir las señales de Arbor Terrace una vez que entre.'
        },
        q3: {
          question: '¿A qué hora debo llegar?',
          answer: 'Los invitados deben llegar a las 2:30 PM para bebidas de bienvenida y tomar asiento. La ceremonia comenzará a las 3 PM en punto y no podemos acomodar llegadas tardías.'
        },
        q4: {
          question: '¿Qué debo usar?',
          answer: 'El código de vestimenta es traje de cóctel. Esto generalmente significa que vestidos de cóctel hasta la rodilla o midi, vestidos de noche, vestidos de verano, monos, trajes casuales, pantalones, camisas con botones, trajes y sacos deportivos con o sin corbata son perfectos para nuestra boda.\n\nLa ceremonia y la hora del cóctel serán completamente al aire libre, y la recepción será en un espacio parcialmente al aire libre, ¡así que recomendamos traer una capa! Típicamente hace X en Fallbrook en marzo.\n\nSi bien apreciamos el estilo individual de cada uno, solicitamos amablemente que los invitados se abstengan de usar ropa informal como camisetas y jeans. Y en caso de que tengas curiosidad, el cortejo nupcial usará lavanda.'
        },
        q5: {
          question: '¿Habrá estacionamiento en el lugar?',
          answer: '¡Hay mucho estacionamiento disponible en el lugar! Si es necesario, puede dejar su vehículo en el lugar durante la noche, siempre que lo recoja antes del mediodía del domingo.'
        },
        q6: {
          question: '¿Se proporcionará transporte?',
          answer: 'Si elige no conducir al lugar o planea beber (¡después de todo es una barra libre!), estamos patrocinando viajes de Uber hacia y desde el lugar. ¡Le enviaremos códigos el día del evento!'
        },
        q7: {
          question: '¿Puedo traer un acompañante/pareja? ¿Puede venir (otra persona)?',
          answer: 'El número de asientos y los nombres de los invitados en su grupo están listados en su invitación. Su invitación estará dirigida a {Su nombre} e Invitado si se ha agregado un acompañante a su grupo. Desafortunadamente, no podemos acomodar invitados adicionales.'
        },
        q8: {
          question: '¿Puedo traer a mis hijos?',
          answer: 'Amamos a sus pequeños, pero hemos decidido que nuestra boda sea mayormente libre de niños, con excepción de algunos miembros selectos de la familia. A menos que se indique en su invitación, solicitamos amablemente que solo asistan invitados de 12 años en adelante.'
        }
      },
      rsvp: {
        title: 'RSVP',
        desc: 'Háganos saber si podrá asistir'
      },
      accommodations: {
        fly_label: 'Dónde volar:',
        airport_title: 'Aeropuerto',
        airport_name: 'Aeropuerto Internacional de San Diego (SAN)',
        airport_address: '3225 N. Harbor Drive, San Diego, CA 92101',
        stay_title: 'Dónde hospedarse',
        stay_desc: 'Aquí hay algunos lugares que recomendamos para hospedarse, cerca del lugar',
        welk: {
          name: 'THE WELK RESORT',
          distance: '22 minutos',
          description: 'Un resort familiar con varias piscinas, campos de golf y un spa, entre otras comodidades.'
        },
        pala: {
          name: 'PALA MESA RESORT',
          distance: '15 minutos',
          description: 'Resort conocido por su campo de golf. El más cercano al lugar pero más lejos de otras atracciones.'
        },
        springhill: {
          name: 'SPRINGHILL SUITES',
          distance: '22 minutos',
          description: 'Hotel en la costa, a pasos de la playa. Ubicado en el animado centro de Oceanside.'
        },
        airbnb: {
          name: 'AIRBNB',
          distance: 'Varía',
          description: 'Hay muchas casas de vacaciones para alquilar en AirBnb en Fallbrook cerca del lugar.'
        }
      },
      form: {
        search_name: 'Busca tu Nombre',
        search_placeholder: 'Empieza a escribir tu nombre...',
        party_label: 'Tu Grupo:',
        attendance: '¿Quién asistirá?',
        message: 'Mensaje (Opcional)',
        message_placeholder: '¡Déjanos una nota, solicitud de canción o restricciones dietéticas!',
        submit: 'Enviar RSVP'
      }
    }
  };

  let currentLang = 'en';

  const getNestedTranslation = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const updateTranslations = (lang) => {
    currentLang = lang;
    
    // Update text content
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      const translation = getNestedTranslation(translations[lang], key);
      if (translation) {
        element.textContent = translation;
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = getNestedTranslation(translations[lang], key);
      if (translation) {
        element.placeholder = translation;
      }
    });

    // Update active button state
    document.querySelectorAll('.language-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Store preference
    localStorage.setItem('preferredLanguage', lang);
  };

  /* Language switcher - Disabled for now
  document.querySelectorAll('.language-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      updateTranslations(lang);
    });
  });

  // Load saved language preference or default to English
  const savedLang = localStorage.getItem('preferredLanguage') || 'en';
  if (savedLang !== 'en') {
    updateTranslations(savedLang);
  }
  */

  // ============================================
  // NAVIGATION ACTIVE STATE & SCROLL SPY
  // ============================================
  const initNavigationActiveState = () => {
    const navLinks = document.querySelectorAll('.site-nav__links a');
    const sections = document.querySelectorAll('section[id]');
    const siteHeader = document.querySelector('.site-header');
    
    if (!navLinks.length || !sections.length) return;
    
    // Sections with dark purple background
    const darkSections = document.querySelectorAll('.section--rsvp, .section--details, .section--accommodations');
    console.log('Dark sections found:', darkSections.length);
    darkSections.forEach(section => {
      console.log('- Dark section:', section.id || section.className);
    });
    
    // Function to update active state
    const updateActiveState = (targetHref) => {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetHref) {
          link.classList.add('active');
        }
      });
    };
    
    // Click handler for nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Only handle section links (not external or homepage)
        if (href && href.startsWith('#') && href !== '#') {
          e.preventDefault();
          
          // Update active state
          updateActiveState(href);
          
          // Smooth scroll to section
          const targetSection = document.querySelector(href);
          if (targetSection) {
            if (typeof lenis !== 'undefined') {
              lenis.scrollTo(targetSection, {
                offset: -100,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
              });
            } else {
              targetSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
        } else if (href === '#' || href === '') {
          e.preventDefault();
          updateActiveState('#');
          
          // Scroll to top
          if (typeof lenis !== 'undefined') {
            lenis.scrollTo(0, {
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      });
    });
    
    // Check if header is over dark sections
    const updateHeaderTheme = () => {
      if (!siteHeader) return;
      
      const headerRect = siteHeader.getBoundingClientRect();
      const headerMiddle = headerRect.top + (headerRect.height / 2);
      let isOverDarkSection = false;
      
      darkSections.forEach(section => {
        const sectionRect = section.getBoundingClientRect();
        
        // Check if header's middle point is within the dark section
        if (headerMiddle >= sectionRect.top && headerMiddle <= sectionRect.bottom) {
          isOverDarkSection = true;
          console.log('Header over dark section:', section.id || section.className);
        }
      });
      
      // Toggle inverted class
      if (isOverDarkSection) {
        if (!siteHeader.classList.contains('inverted')) {
          console.log('✨ Adding inverted class to header');
          siteHeader.classList.add('inverted');
        }
      } else {
        if (siteHeader.classList.contains('inverted')) {
          console.log('✨ Removing inverted class from header');
          siteHeader.classList.remove('inverted');
        }
      }
    };
    
    // Scroll spy - update active state based on scroll position
    const handleScrollSpy = () => {
      let currentSection = '';
      const scrollPosition = window.scrollY + 200; // Offset for better triggering
      
      // Check if we're at the very top
      if (window.scrollY < 100) {
        currentSection = '#';
      } else {
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
          }
        });
      }
      
      if (currentSection) {
        updateActiveState(currentSection);
      }
      
      // Update header theme based on dark sections
      updateHeaderTheme();
    };
    
    // Throttle scroll spy for performance
    let scrollSpyTimeout;
    const throttledScrollSpy = () => {
      if (scrollSpyTimeout) return;
      scrollSpyTimeout = setTimeout(() => {
        handleScrollSpy();
        scrollSpyTimeout = null;
      }, 100);
    };
    
    // Listen to scroll events
    window.addEventListener('scroll', throttledScrollSpy);
    
    // Initial check
    handleScrollSpy();
    updateHeaderTheme();
    
    console.log('✨ Navigation active state initialized');
  };
  
  initNavigationActiveState();
})();

