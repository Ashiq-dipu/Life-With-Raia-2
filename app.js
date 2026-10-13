/**
 * Life With Raia — Multi-Page Application Logic
 * Shared Theme Persistence, Navigation highlighting, Modals, Forms & Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Global Theme Switcher (Warm Day / Dusk Twilight) ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;
  const savedTheme = localStorage.getItem('raia-theme') || 'warm';

  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'warm';
      const nextTheme = currentTheme === 'warm' ? 'dusk' : 'warm';
      setTheme(nextTheme);
      showToast(`Switched to ${nextTheme === 'warm' ? 'Warm Daylight' : 'Dusk Twilight'} theme ✨`, 'info');
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('raia-theme', theme);
    if (themeToggleBtn) {
      const label = themeToggleBtn.querySelector('.theme-label');
      if (label) {
        label.textContent = theme === 'warm' ? 'Warmth' : 'Twilight';
      }
    }
  }

  // --- 2. Mobile Navigation Toggle ---
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 3. Sticky Header ---
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
  }

  // --- 4. Interactive Personality Tags ---
  const personalityTags = document.querySelectorAll('.personality-tag');
  personalityTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const tagText = tag.getAttribute('data-tag');
      showToast(`Personality: ${tagText} ✨`, 'info');
    });
  });

  // --- 5. Videos Category Filter & Simulated Player Modal ---
  const videoFilterPills = document.querySelectorAll('#videoCategoryFilters .filter-pill');
  const videoCards = document.querySelectorAll('#videosGrid .video-card');

  if (videoFilterPills.length > 0 && videoCards.length > 0) {
    videoFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        videoFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const category = pill.getAttribute('data-category');

        videoCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  const videoModal = document.getElementById('videoModal');
  if (videoModal) {
    const closeVideoModalBtn = document.getElementById('closeVideoModalBtn');
    const videoModalTitle = document.getElementById('videoModalTitle');
    const videoModalBadge = document.getElementById('videoModalBadge');
    const videoModalThumb = document.getElementById('videoModalThumb');
    const videoModalDesc = document.getElementById('videoModalDesc');
    const simPlayToggle = document.getElementById('simPlayToggle');
    const simPlayIcon = document.getElementById('simPlayIcon');
    const simProgressBar = document.getElementById('simProgressBar');
    const simTimeDisplay = document.getElementById('simTimeDisplay');
    const copyVideoLinkBtn = document.getElementById('copyVideoLinkBtn');

    let isPlaying = false;
    let playInterval = null;
    let currentProgressPercent = 0;

    const playFeaturedBtn = document.getElementById('playFeaturedBtn');
    const watchFeaturedBtn = document.getElementById('watchFeaturedBtn');

    const openFeaturedVideo = () => {
      openVideoModal({
        title: "A Week in My Life — New Beginnings & Big Changes",
        category: "🗓️ Day In My Life",
        thumb: "assets/featured_vlog.jpg",
        duration: "18:42",
        desc: "The one where everything shifted. Behind the scenes of taking on new creative projects, moving through transitions, and finding joy in everyday moments."
      });
    };

    if (playFeaturedBtn) playFeaturedBtn.addEventListener('click', openFeaturedVideo);
    if (watchFeaturedBtn) watchFeaturedBtn.addEventListener('click', openFeaturedVideo);

    videoCards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');
        const category = card.getAttribute('data-category');
        const duration = card.getAttribute('data-duration') || '15:00';
        const thumb = card.querySelector('img').getAttribute('src');
        const desc = card.querySelector('.video-card-summary').textContent;

        openVideoModal({ title, category, thumb, duration, desc });
      });
    });

    function openVideoModal({ title, category, thumb, duration, desc }) {
      videoModalTitle.textContent = title;
      videoModalBadge.textContent = category;
      videoModalThumb.setAttribute('src', thumb);
      videoModalDesc.textContent = desc;
      simTimeDisplay.textContent = `00:00 / ${duration}`;
      currentProgressPercent = 0;
      simProgressBar.style.width = '0%';
      resetPlayerState();

      videoModal.classList.add('open');
      videoModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeVideoModal() {
      videoModal.classList.remove('open');
      videoModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      resetPlayerState();
    }

    function resetPlayerState() {
      isPlaying = false;
      if (simPlayIcon) simPlayIcon.textContent = '▶';
      if (playInterval) clearInterval(playInterval);
    }

    if (simPlayToggle) {
      simPlayToggle.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
          simPlayIcon.textContent = '⏸';
          playInterval = setInterval(() => {
            currentProgressPercent += 0.5;
            if (currentProgressPercent > 100) {
              currentProgressPercent = 0;
              resetPlayerState();
            }
            simProgressBar.style.width = `${currentProgressPercent}%`;
          }, 200);
        } else {
          resetPlayerState();
        }
      });
    }

    if (closeVideoModalBtn) closeVideoModalBtn.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });

    if (copyVideoLinkBtn) {
      copyVideoLinkBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        showToast('Video link copied to clipboard! 📋', 'success');
      });
    }
  }

  // Watch Later Toast
  const saveWatchLaterBtn = document.getElementById('saveWatchLaterBtn');
  if (saveWatchLaterBtn) {
    saveWatchLaterBtn.addEventListener('click', () => {
      showToast('Saved to your Watchlist! 🔖', 'success');
    });
  }

  // --- 6. Photo Gallery Filter & Lightbox Modal ---
  const photoFilterPills = document.querySelectorAll('#photoCategoryFilters .filter-pill');
  const galleryItems = Array.from(document.querySelectorAll('#photoGalleryGrid .gallery-item'));

  if (photoFilterPills.length > 0 && galleryItems.length > 0) {
    photoFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        photoFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const category = pill.getAttribute('data-category');

        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  const lightboxModal = document.getElementById('photoLightboxModal');
  if (lightboxModal && galleryItems.length > 0) {
    const closeLightboxBtn = document.getElementById('closeLightboxBtn');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTag = document.getElementById('lightboxTag');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const prevPhotoBtn = document.getElementById('prevPhotoBtn');
    const nextPhotoBtn = document.getElementById('nextPhotoBtn');

    let currentGalleryIndex = 0;
    let activeVisibleItems = [];

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        activeVisibleItems = galleryItems.filter(el => el.style.display !== 'none');
        currentGalleryIndex = activeVisibleItems.indexOf(item);
        if (currentGalleryIndex === -1) currentGalleryIndex = 0;
        updateLightboxContent();
        lightboxModal.classList.add('open');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    function updateLightboxContent() {
      const item = activeVisibleItems[currentGalleryIndex] || galleryItems[0];
      const src = item.getAttribute('data-src');
      const caption = item.getAttribute('data-caption');
      const category = item.getAttribute('data-category');

      lightboxImg.setAttribute('src', src);
      lightboxTag.textContent = category;
      lightboxCaption.textContent = caption;
    }

    function showNextPhoto() {
      if (!activeVisibleItems.length) return;
      currentGalleryIndex = (currentGalleryIndex + 1) % activeVisibleItems.length;
      updateLightboxContent();
    }

    function showPrevPhoto() {
      if (!activeVisibleItems.length) return;
      currentGalleryIndex = (currentGalleryIndex - 1 + activeVisibleItems.length) % activeVisibleItems.length;
      updateLightboxContent();
    }

    if (nextPhotoBtn) {
      nextPhotoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextPhoto();
      });
    }

    if (prevPhotoBtn) {
      prevPhotoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevPhoto();
      });
    }

    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    function closeLightbox() {
      lightboxModal.classList.remove('open');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // --- 7. Written Posts & Story Reader Modal ---
  const storyDatabase = {
    featured: {
      title: "Why I Started Life With Raia (And Why It Took Me So Long)",
      category: "🌟 Featured Essay",
      readTime: "6 min read",
      paragraphs: [
        "For almost three years, I had a secret folder on my desktop called 'The Brand'. Inside were color palettes, script ideas, notes on microphones, and drafts of essays that never saw daylight.",
        "Why? Because I was terrified of not being perfect. We live in an era where everyone's digital presence looks like a glossy high-budget magazine ad. Every room looks spotless, every morning routine starts with a candle lit at 5:00 AM, and nobody ever admits to feeling completely ungrounded.",
        "One night this past spring, I was sitting on my kitchen floor eating takeout after a day where literally everything had gone wrong. And it hit me: the creators and people who have actually inspired me most were the ones who didn't hide their humanity. They were the ones who showed the rough edges.",
        "Life With Raia is my antidote to the highlight reel. It is a home for the honest stories, the quiet victories, the chaotic travel days, and the spontaneous epiphanies. I'm so grateful you're here to share the journey with me."
      ]
    },
    "1": {
      title: "10 Things I Wish I Knew Before I Started Creating",
      category: "🌱 Creative Growth",
      readTime: "4 min read",
      paragraphs: [
        "1. Your first ten videos will probably make you cringe in six months — and that is the biggest sign of progress.",
        "2. Expensive cameras don't fix uninspired storytelling. Natural light and honest emotion will beat a $4,000 lens every day of the week.",
        "3. Protect your relationship with creating offline. If everything you do is for content, your well will dry up faster than you expect.",
        "4. Community isn't built through broadcasting; it is built through conversation."
      ]
    },
    "2": {
      title: "The Art of Showing Up — Even When You Don't Feel Like It",
      category: "⚡ Mindset",
      readTime: "5 min read",
      paragraphs: [
        "Waiting for motivation is a trap. Motivation arrives halfway into the work, rarely at the beginning.",
        "When I feel resistant to writing or picking up my camera, I make a deal with myself: just five minutes. I'll open the journal or shoot thirty seconds of B-roll. Nine times out of ten, momentum carries the rest."
      ]
    },
    "3": {
      title: "Places That Changed the Way I See the World",
      category: "🌍 Travel Diaries",
      readTime: "7 min read",
      paragraphs: [
        "Traveling alone taught me how to enjoy my own company without reaching for my phone every four seconds.",
        "In a tiny coastal village this summer, I watched older couples share morning bread in complete, comfortable silence. It completely reshaped how I view hustle and stillness."
      ]
    },
    "4": {
      title: "My Honest Relationship With Social Media",
      category: "💬 Real Talk",
      readTime: "5 min read",
      paragraphs: [
        "Algorithms are designed to reward speed and outrage. Storytelling requires patience and intimacy.",
        "I've learned to build boundaries: no screens for the first hour of the morning, and Sundays are spent completely analog."
      ]
    },
    "5": {
      title: "What a 'Good Day' Actually Looks Like for Me",
      category: "☀️ Daily Flow",
      readTime: "3 min read",
      paragraphs: [
        "A good day isn't when I check off 15 tasks on a to-do list. A good day is when I had time to savor my morning coffee, took a long walk with no destination, made something with my hands, and laughed out loud with someone I love."
      ]
    },
    "6": {
      title: "Lessons From the Messy Middle",
      category: "💭 Life Lessons",
      readTime: "6 min read",
      paragraphs: [
        "Starting is exciting. Finishing is triumphant. But 90% of life is the messy middle where nothing looks glamorous yet.",
        "Learning to love the process while the painting is still half-done has been my greatest lesson this year."
      ]
    },
    "7": {
      title: "Things I'm Quietly Proud Of",
      category: "✨ Reflections",
      readTime: "4 min read",
      paragraphs: [
        "Setting boundaries without over-explaining. Saying 'no' without guilt. Forgiving myself when my productivity dips.",
        "The things worth celebrating most often happen in private."
      ]
    },
    "8": {
      title: "How I'm Building Something That Feels Like Me",
      category: "🎨 Creative Process",
      readTime: "5 min read",
      paragraphs: [
        "Finding your voice isn't about inventing a brand; it is about unlearning who you thought you had to be to get approval.",
        "Life With Raia is proof that authenticity resonates far louder than imitation."
      ]
    }
  };

  const storyReaderModal = document.getElementById('storyReaderModal');
  if (storyReaderModal) {
    const closeStoryModalBtn = document.getElementById('closeStoryModalBtn');
    const closeStoryFooterBtn = document.getElementById('closeStoryFooterBtn');
    const storyModalTitle = document.getElementById('storyModalTitle');
    const storyModalCategory = document.getElementById('storyModalCategory');
    const storyModalTime = document.getElementById('storyModalTime');
    const storyModalContent = document.getElementById('storyModalContent');

    document.querySelectorAll('.open-story-btn').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const storyId = trigger.getAttribute('data-story-id') || 'featured';
        const story = storyDatabase[storyId] || storyDatabase.featured;

        storyModalTitle.textContent = story.title;
        storyModalCategory.textContent = story.category;
        storyModalTime.textContent = story.readTime;

        storyModalContent.innerHTML = story.paragraphs
          .map(p => `<p>${p}</p>`)
          .join('');

        storyReaderModal.classList.add('open');
        storyReaderModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeStoryReader() {
      storyReaderModal.classList.remove('open');
      storyReaderModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (closeStoryModalBtn) closeStoryModalBtn.addEventListener('click', closeStoryReader);
    if (closeStoryFooterBtn) closeStoryFooterBtn.addEventListener('click', closeStoryReader);
    storyReaderModal.addEventListener('click', (e) => {
      if (e.target === storyReaderModal) closeStoryReader();
    });
  }

  // Global Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal-backdrop.open');
      openModals.forEach(m => {
        m.classList.remove('open');
        m.setAttribute('aria-hidden', 'true');
      });
      document.body.style.overflow = '';
    }
  });

  // --- 8. Contact Form Handling ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');
    const submitContactBtn = document.getElementById('submitContactBtn');

    // Click inquiry card to auto-select subject
    document.querySelectorAll('.inquiry-card').forEach(card => {
      card.addEventListener('click', () => {
        const subject = card.getAttribute('data-subject');
        if (subject && subjectInput) {
          subjectInput.value = subject;
          contactForm.scrollIntoView({ behavior: 'smooth' });
          showToast(`Subject set to "${subject}" ✍️`, 'info');
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (!nameInput.value.trim()) {
        showFieldError('nameError', true);
        isValid = false;
      } else {
        showFieldError('nameError', false);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showFieldError('emailError', true);
        isValid = false;
      } else {
        showFieldError('emailError', false);
      }

      if (!subjectInput.value) {
        showFieldError('subjectError', true);
        isValid = false;
      } else {
        showFieldError('subjectError', false);
      }

      if (!messageInput.value.trim()) {
        showFieldError('messageError', true);
        isValid = false;
      } else {
        showFieldError('messageError', false);
      }

      if (!isValid) return;

      submitContactBtn.disabled = true;
      submitContactBtn.innerHTML = `<span>Sending note...</span> <span class="btn-icon">⏳</span>`;

      setTimeout(() => {
        submitContactBtn.disabled = false;
        submitContactBtn.innerHTML = `<span>Send It ✨</span> <span class="btn-icon">🚀</span>`;
        contactForm.reset();
        showToast('Thank you! Your message is on its way to Raia 💕 Response in 2-3 days.', 'success');
      }, 900);
    });

    function showFieldError(errorId, show) {
      const errorEl = document.getElementById(errorId);
      if (errorEl) {
        if (show) errorEl.classList.add('visible');
        else errorEl.classList.remove('visible');
      }
    }
  }

  // --- 9. Social Handle Quick Clicks ---
  document.querySelectorAll('.copy-handle').forEach(el => {
    el.addEventListener('click', () => {
      const text = el.textContent.trim();
      navigator.clipboard.writeText(text);
      showToast(`Copied ${text} to clipboard! 📋`, 'success');
    });
  });

  // --- 10. Newsletter Form Handling ---
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterFeedback = document.getElementById('newsletterFeedback');

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        newsletterFeedback.textContent = 'Please enter a valid email address.';
        newsletterFeedback.className = 'newsletter-feedback error';
        return;
      }

      newsletterFeedback.textContent = '✨ You are on the list! Welcome to The Raia Letter community 💕';
      newsletterFeedback.className = 'newsletter-feedback success';
      newsletterEmail.value = '';
      showToast('Subscribed to The Raia Letter! 💌', 'success');
    });
  }

  // --- 11. Toast System ---
  window.showToast = function(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✨' : '✦'}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  };

  // --- 12. Homepage Interactive Widgets (Rotation & Community) ---
  // Mini Audio Player Toggle
  const miniAudioBtn = document.getElementById('miniAudioBtn');
  if (miniAudioBtn) {
    let audioPlaying = false;
    miniAudioBtn.addEventListener('click', () => {
      audioPlaying = !audioPlaying;
      miniAudioBtn.textContent = audioPlaying ? '⏸' : '▶';
      showToast(audioPlaying ? 'Now playing: Late Night Waves 🎵' : 'Paused playlist ⏸', 'info');
    });
  }

  // Vibe of the Week Poll Chips
  const vibeChips = document.querySelectorAll('.vibe-chip');
  vibeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      vibeChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const vibe = chip.getAttribute('data-vibe');
      showToast(`Vibe logged: ${vibe}! Your energy matches this week ✨`, 'success');
    });
  });

  // Vlog Topic Suggestion Form
  const vlogPromptForm = document.getElementById('vlogPromptForm');
  if (vlogPromptForm) {
    vlogPromptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('vlogPromptInput');
      if (input && input.value.trim()) {
        const topic = input.value.trim();
        input.value = '';
        showToast(`Idea logged: "${topic}"! Adding to Raia's sticky note board 📝✨`, 'success');
      } else {
        showToast('Please type an idea first ✨', 'info');
      }
    });
  }
});

