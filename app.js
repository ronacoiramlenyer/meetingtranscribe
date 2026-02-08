// app.js - Navigation handling with mobile fixes

document.addEventListener('DOMContentLoaded', () => {
  // Mobile viewport height fix
  function setAppHeight() {
    const appRoot = document.getElementById('app-root');
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    if (appRoot) {
      appRoot.style.height = window.innerHeight + 'px';
    }
  }

  // Set initial height
  setAppHeight();

  // Update on resize and orientation change
  window.addEventListener('resize', setAppHeight);
  window.addEventListener('orientationchange', () => {
    setTimeout(setAppHeight, 100);
  });

  // Get all screen elements
  const loginView = document.getElementById('login-view');
  const subscribeView = document.getElementById('subscribe-view');
  const lockedView = document.getElementById('locked-view');
  const appView = document.getElementById('app-view');
  
  // Get all navigation buttons/links
  const subscribeBtn = document.getElementById('subscribe-btn');
  const backBtn = document.getElementById('back-btn');
  const loginLink = document.getElementById('login-link');
  const loginBtn = document.getElementById('login-btn');
  const createAccountBtn = document.getElementById('create-account-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const manageSubscriptionBtn = document.getElementById('manage-subscription-btn');
  
  // Function to show a specific screen and hide others
  function showScreen(screenToShow) {
    // Hide all screens
    [loginView, subscribeView, lockedView, appView].forEach(screen => {
      screen.hidden = true;
    });
    
    // Show the requested screen
    screenToShow.hidden = false;
    
    // Update viewport height when switching screens
    setTimeout(setAppHeight, 50);
  }
  
  // Navigation event listeners
  
  // Login screen -> Subscribe screen
  subscribeBtn?.addEventListener('click', () => {
    showScreen(subscribeView);
  });
  
  // Subscribe screen -> Login screen (Back button)
  backBtn?.addEventListener('click', () => {
    showScreen(loginView);
  });
  
  // Subscribe screen -> Login screen (Login link)
  loginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen(loginView);
  });
  
  // Login screen -> App screen (Simulated login)
  loginBtn?.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // Store user email for display in app
    document.getElementById('user-email').textContent = email;
    showScreen(appView);
    showToast('Login successful!', 'success');
  });
  
  // Subscribe screen -> App screen (Simulated account creation)
  createAccountBtn?.addEventListener('click', () => {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    if (!email || !password || !confirmPassword) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    if (!agreeTerms) {
      showToast('Please agree to the terms and conditions', 'error');
      return;
    }
    
    // Store user email for display in app
    document.getElementById('user-email').textContent = email;
    showScreen(appView);
    showToast('Account created successfully!', 'success');
  });
  
  // App screen -> Login screen (Logout)
  logoutBtn?.addEventListener('click', () => {
    showScreen(loginView);
    showToast('Logged out successfully', 'success');
  });
  
  // Locked screen -> Subscribe screen (Manage subscription)
  manageSubscriptionBtn?.addEventListener('click', () => {
    showScreen(subscribeView);
  });
  
  // Plan selection functionality
  const planOptions = document.querySelectorAll('.plan-option');
  planOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from all options
      planOptions.forEach(opt => opt.classList.remove('selected'));
      // Add selected class to clicked option
      option.classList.add('selected');
    });
  });
  
  // Toast notification function
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type;
    toast.hidden = false;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.hidden = true;
      }, 300);
    }, 3000);
  }
  
  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Form validation and styling
  const forms = document.querySelectorAll('input');
  forms.forEach(input => {
    input.addEventListener('blur', () => {
      if (!input.checkValidity()) {
        input.style.borderColor = '#ef4444';
      } else {
        input.style.borderColor = '#e5e7eb';
      }
    });
    
    // Reset border on input
    input.addEventListener('input', () => {
      input.style.borderColor = '#e5e7eb';
    });
  });
  
  // Prevent form submission on Enter key in inputs
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  });
  
  // Initialize with login screen
  showScreen(loginView);
  
  // Prevent pull-to-refresh on mobile
  document.addEventListener('touchmove', (e) => {
    if (e.scale !== 1) {
      e.preventDefault();
    }
  }, { passive: false });
});