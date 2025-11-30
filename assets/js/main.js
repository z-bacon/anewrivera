(() => {
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
  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
  
  // This will store the guest data fetched from Google Sheets
  let guestData = [];
  let selectedGuest = null;

  // Fetch guest list from Google Sheets on page load
  const fetchGuestList = async () => {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getGuests`);
      if (response.ok) {
        guestData = await response.json();
        console.log('Guest list loaded:', guestData.length, 'guests');
      } else {
        console.error('Failed to load guest list');
        // Fallback to sample data for testing
        guestData = getSampleGuestData();
      }
    } catch (error) {
      console.error('Error fetching guest list:', error);
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

      const filteredGuests = guestData.filter(guest =>
        guest.name.toLowerCase().includes(searchTerm)
      );

      if (filteredGuests.length === 0) {
        dropdown.innerHTML = '<div class="guest-dropdown__item" style="cursor: default;">No guests found</div>';
        dropdown.classList.add('active');
        return;
      }

      dropdown.innerHTML = filteredGuests.map(guest => `
        <div class="guest-dropdown__item" data-guest-id="${guest.id}">
          <div class="guest-dropdown__item-name">${guest.name}</div>
          <div class="guest-dropdown__item-party">${guest.party.length} ${guest.party.length === 1 ? 'person' : 'people'}</div>
        </div>
      `).join('');

      dropdown.classList.add('active');

      // Add click handlers to dropdown items
      dropdown.querySelectorAll('.guest-dropdown__item[data-guest-id]').forEach(item => {
        item.addEventListener('click', () => {
          const guestId = parseInt(item.dataset.guestId);
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
    selectedGuest = guestData.find(g => g.id === guestId);
    if (!selectedGuest) return;

    const searchInput = document.getElementById('guest-search');
    const dropdown = document.getElementById('guest-dropdown');
    const guestInfo = document.getElementById('guest-info');
    const selectedGuestName = document.getElementById('selected-guest-name');
    const partyMembers = document.getElementById('party-members');

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
          id="member-${index}" 
          name="party-member" 
          value="${member}"
          checked
        />
        <label for="member-${index}">${member}</label>
      </div>
    `).join('');
  };

  // Handle form submission
  const initFormSubmission = () => {
    const form = document.getElementById('rsvp-form');
    const formStatus = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!selectedGuest) {
        showFormStatus('error', 'Please select your name from the list');
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      // Get selected party members
      const checkboxes = form.querySelectorAll('input[name="party-member"]:checked');
      const attendingMembers = Array.from(checkboxes).map(cb => cb.value);

      if (attendingMembers.length === 0) {
        showFormStatus('error', 'Please select at least one person or mark as not attending');
        return;
      }

      const message = document.getElementById('message').value;

      // Prepare submission data
      const submissionData = {
        guestId: selectedGuest.id,
        guestName: selectedGuest.name,
        totalInParty: selectedGuest.party.length,
        attendingCount: attendingMembers.length,
        attendingMembers: attendingMembers,
        notAttendingMembers: selectedGuest.party.filter(m => !attendingMembers.includes(m)),
        message: message,
        timestamp: new Date().toISOString()
      };

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
          selectedGuest = null;
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          formStatus.style.display = 'none';
        }, 5000);

      } catch (error) {
        console.error('Submission error:', error);
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

    let currentTitleText = 'BRIDAL PARTY';
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
        
        // Phase 1: BRIDAL PARTY intro (0-33%)
        if (overallProgress < 0.15) {
          // Fade in
          const fadeInProgress = overallProgress / 0.15;
          opacity = fadeInProgress;
          scale = 0.2 + (fadeInProgress * 0.8);
          blur = (1 - fadeInProgress) * 20;
          translateY = 0;
          
          if (titleText && titleText.textContent !== 'BRIDAL PARTY') {
            titleText.textContent = 'BRIDAL PARTY';
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
        rsvp: 'RSVP',
        location: 'Location',
        wedding_party: 'Wedding Party',
        faq: 'FAQ'
      },
      hero: {
        subtitle: 'Are Getting Married',
        cta: 'RSVP'
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
        title: 'Frequently Asked Questions',
        q1: {
          question: 'What should I wear?',
          answer: 'We recommend semi-formal beach attire. Think light fabrics, sundresses, and comfortable shoes for the sand.'
        },
        q2: {
          question: 'Will transportation be provided?',
          answer: 'Yes! We\'ll arrange shuttles from the main resort to all wedding events. Details will be sent via email.'
        },
        q3: {
          question: 'Can I bring a plus one?',
          answer: 'Please refer to your invitation. If you have a plus one, their name will be included on the invitation.'
        },
        q4: {
          question: 'What\'s the weather like in March?',
          answer: 'March is perfect! Expect warm, sunny days with temperatures around 80-85°F (27-29°C) and cool evenings.'
        }
      },
      rsvp: {
        title: 'RSVP & Registry',
        desc: 'Let us know if you can celebrate with us by March 1, 2026. You can also find our registry and travel checklist below.'
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
        rsvp: 'RSVP',
        location: 'Ubicación',
        wedding_party: 'Fiesta de Bodas',
        faq: 'Preguntas'
      },
      hero: {
        subtitle: 'Se Casan',
        cta: 'RSVP'
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
        q1: {
          question: '¿Qué debo usar?',
          answer: 'Recomendamos vestimenta semi-formal de playa. Piense en telas ligeras, vestidos de verano y zapatos cómodos para la arena.'
        },
        q2: {
          question: '¿Se proporcionará transporte?',
          answer: '¡Sí! Organizaremos traslados desde el resort principal a todos los eventos de la boda. Los detalles se enviarán por correo electrónico.'
        },
        q3: {
          question: '¿Puedo traer un acompañante?',
          answer: 'Por favor consulte su invitación. Si tiene un acompañante, su nombre estará incluido en la invitación.'
        },
        q4: {
          question: '¿Cómo es el clima en marzo?',
          answer: '¡Marzo es perfecto! Espere días cálidos y soleados con temperaturas alrededor de 80-85°F (27-29°C) y noches frescas.'
        }
      },
      rsvp: {
        title: 'RSVP y Registro',
        desc: 'Háganos saber si puede celebrar con nosotros antes del 1 de marzo de 2026. También puede encontrar nuestro registro y lista de verificación de viaje a continuación.'
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

  // Language switcher
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
})();

