(() => {
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
  // POLAROID STACK ANIMATION ON HERO
  // ============================================
  const initPolaroidAnimation = () => {
    const polaroids = document.querySelectorAll('[data-polaroid]');
    const heroTitle = document.querySelector('.hero-new__content');
    
    if (polaroids.length === 0) return;

    // Stagger delays for each polaroid (in milliseconds)
    // Increased spacing for falling effect
    const delays = [0, 150, 300, 450, 600, 750];

    // Animate polaroids in sequence
    polaroids.forEach((polaroid, index) => {
      setTimeout(() => {
        polaroid.classList.add('animate-in');
      }, delays[index]);
    });

    // After all polaroids animate in, show the title
    // Last polaroid delay + animation duration (1000ms) + small buffer
    const titleDelay = delays[delays.length - 1] + 1000 + 300;
    
    setTimeout(() => {
      if (heroTitle) {
        heroTitle.style.animation = 'fadeInScale 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
      }
    }, titleDelay);
  };

  // Initialize polaroid animation on page load
  initPolaroidAnimation();

  // ============================================
  // SCRAMBLE/ROLODEX ANIMATION FOR ACCOMMODATIONS
  // ============================================
  const initScrambleAnimation = () => {
    const accommodationsSection = document.querySelector('.section--accommodations');
    if (!accommodationsSection) return;

    let hasAnimated = false;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*().,';

    // Scramble text effect
    const scrambleText = (element, finalText, duration = 1000) => {
      return new Promise((resolve) => {
        element.classList.add('scramble-active');
        let iteration = 0;
        const textLength = finalText.length;
        const frameRate = 30; // ms per frame
        const totalFrames = duration / frameRate;

        const interval = setInterval(() => {
          element.textContent = finalText
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) {
                return finalText[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          if (iteration >= textLength) {
            clearInterval(interval);
            element.textContent = finalText;
            resolve();
          }

          iteration += textLength / totalFrames;
        }, frameRate);
      });
    };

    const scrambleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            
            // Animate the left label first
            const leftLabel = accommodationsSection.querySelector('[data-typewriter]');
            if (leftLabel) {
              const originalText = leftLabel.textContent;
              await new Promise(resolve => setTimeout(resolve, 300));
              await scrambleText(leftLabel, originalText, 600);
            }

            // Then animate the right side info sequentially
            const rightInfo = accommodationsSection.querySelector('[data-typewriter-delay]');
            if (rightInfo) {
              const paragraphs = rightInfo.querySelectorAll('p');
              
              // Small delay before starting right side
              await new Promise(resolve => setTimeout(resolve, 300));
              
              // Animate each paragraph sequentially
              for (let i = 0; i < paragraphs.length; i++) {
                const p = paragraphs[i];
                const originalText = p.getAttribute('data-i18n') 
                  ? p.textContent 
                  : p.textContent;
                
                await scrambleText(p, originalText, 800);
                
                // Small gap between lines
                if (i < paragraphs.length - 1) {
                  await new Promise(resolve => setTimeout(resolve, 150));
                }
              }
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    scrambleObserver.observe(accommodationsSection);
  };

  // Initialize scramble animation
  initScrambleAnimation();

  // ============================================
  // SEQUENTIAL FADE-IN FOR STAY CARDS
  // ============================================
  const initStayCardsFadeIn = () => {
    const staySection = document.querySelector('.section--accommodations-stay');
    if (!staySection) return;

    const stayCards = staySection.querySelectorAll('[data-stay-card]');
    if (stayCards.length === 0) return;

    let hasAnimated = false;

    const stayObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            
            // Fade in each card sequentially
            stayCards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('fade-in');
              }, index * 200); // 200ms delay between each card
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    stayObserver.observe(staySection);
  };

  // Initialize stay cards fade-in
  initStayCardsFadeIn();

  // ============================================
  // BRIDAL PARTY MODAL INTERACTIONS
  // ============================================
  const initBridalPartyModal = () => {
    const modal = document.getElementById('bridal-party-modal');
    const members = document.querySelectorAll('.bridal-party-member[data-member-name]');
    const closeBtn = modal?.querySelector('.bridal-party-modal__close');
    
    if (!modal || members.length === 0) return;
    
    // Open modal when clicking on a member
    members.forEach(member => {
      member.addEventListener('click', () => {
        const name = member.dataset.memberName;
        const role = member.dataset.memberRole;
        const quoteLabel = member.dataset.memberQuoteLabel;
        const quote = member.dataset.memberQuote;
        
        // Update modal content
        modal.querySelector('.bridal-party-modal__name').textContent = name;
        modal.querySelector('.bridal-party-modal__role').textContent = role;
        modal.querySelector('.bridal-party-modal__quote-label').textContent = quoteLabel;
        modal.querySelector('.bridal-party-modal__quote').textContent = quote;
        
        // Copy the avatar/placeholder
        const memberAvatar = member.querySelector('.bridal-party-member__placeholder');
        const modalPlaceholder = modal.querySelector('.bridal-party-modal__placeholder');
        if (memberAvatar && modalPlaceholder) {
          // Copy any background or image from the member to modal
          modalPlaceholder.style.background = window.getComputedStyle(memberAvatar).background;
          modalPlaceholder.innerHTML = memberAvatar.innerHTML;
        }
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    
    // Close modal functionality
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };
    
    // Close on button click
    closeBtn?.addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  };
  
  // Initialize bridal party modal
  initBridalPartyModal();

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

      const filteredGuests = guestData.filter(guest =>
        guest.name.toLowerCase().includes(searchTerm)
      );

      if (filteredGuests.length === 0) {
        dropdown.innerHTML = '<div class="guest-dropdown__item" style="cursor: default;">No guests found</div>';
        dropdown.classList.add('active');
        return;
      }

      dropdown.innerHTML = filteredGuests.map(guest => `
        <div class="guest-dropdown__item" data-guest-id="${guest.id}" data-guest-name="${guest.name}">
          <div class="guest-dropdown__item-name">${guest.name}</div>
          <div class="guest-dropdown__item-party">${guest.party.length} ${guest.party.length === 1 ? 'person' : 'people'}</div>
        </div>
      `).join('');

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
  };

  // Handle form submission
  const initFormSubmission = () => {
    const form = document.getElementById('rsvp-form');
    const formStatus = document.getElementById('form-status');
    const attendingYesSection = document.getElementById('attending-yes-section');
    const attendingYesRadio = document.getElementById('attending-yes');
    const attendingNoRadio = document.getElementById('attending-no');

    if (!form) return;

    // Show/hide "Who will be attending" section based on Yes/No selection
    const handleAttendanceChange = () => {
      if (attendingYesRadio && attendingYesRadio.checked) {
        attendingYesSection.style.display = 'block';
      } else {
        attendingYesSection.style.display = 'none';
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
        home: 'HOME',
        rsvp: 'RSVP',
        bridal_party: 'BRIDAL PARTY',
        accommodations: 'ACCOMMODATIONS',
        faq: 'FAQ'
      },
      logo: 'JS',
      hero: {
        title: 'JUNIOR & SHAIRA',
        subtitle: 'Are Getting Married',
        cta: 'RSVP'
      },
      bridal_party: {
        title: 'BRIDAL PARTY',
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
        label: 'Where to fly in to:',
        airport_label: 'AIRPORT',
        airport_name: 'SAN DIEGO INTERNATIONAL AIRPORT (SAN)',
        airport_address: '3225 N. HARBOR DRIVE, SAN DIEGO, CA 92101'
      },
      accommodations_stay: {
        title: 'Where you can stay:',
        desc: 'Here\'s a few places we recommend for you all to stay at, that\'s close to the venue',
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
          distance: '22 mins away',
          description: 'There are many vacation homes for rent on AirBnb in Fallbrook for proximity to the venue, which you can share with a few others.'
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
        bridal_party: 'FIESTA NUPCIAL',
        accommodations: 'ALOJAMIENTO',
        faq: 'PREGUNTAS'
      },
      logo: 'JS',
      hero: {
        title: 'JUNIOR & SHAIRA',
        subtitle: 'Se Casan',
        cta: 'RSVP'
      },
      bridal_party: {
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
        label: 'Dónde volar:',
        airport_label: 'AEROPUERTO',
        airport_name: 'AEROPUERTO INTERNACIONAL DE SAN DIEGO (SAN)',
        airport_address: '3225 N. HARBOR DRIVE, SAN DIEGO, CA 92101'
      },
      accommodations_stay: {
        title: 'Dónde pueden hospedarse:',
        desc: 'Aquí hay algunos lugares que recomendamos para hospedarse, cerca del lugar',
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
          distance: '22 minutos',
          description: 'Hay muchas casas de vacaciones para alquilar en AirBnb en Fallbrook cerca del lugar, que puedes compartir con otros.'
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

