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

  const rsvpForm = document.querySelector('.form');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const submitButton = rsvpForm.querySelector('button[type="submit"]');
      if (!submitButton) {
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Message Sent';

      rsvpForm.classList.add('form--submitted');
    });
  }

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
        name: 'Name',
        name_placeholder: 'Full name',
        email: 'Email',
        email_placeholder: 'Email',
        attendance: 'Attendance',
        select_option: 'Select an option',
        accept: 'Joyfully Accept',
        decline: 'Respectfully Decline',
        message: 'Message',
        message_placeholder: 'Leave us a note, song request, or travel question!',
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
        name: 'Nombre',
        name_placeholder: 'Nombre completo',
        email: 'Correo Electrónico',
        email_placeholder: 'Correo electrónico',
        attendance: 'Asistencia',
        select_option: 'Seleccione una opción',
        accept: 'Acepto con Alegría',
        decline: 'Declino Respetuosamente',
        message: 'Mensaje',
        message_placeholder: '¡Déjanos una nota, solicitud de canción o pregunta de viaje!',
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

