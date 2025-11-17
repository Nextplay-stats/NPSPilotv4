// Basic client logic to populate embeds tabs contrast toggle retry export and Firebase skeleton
(function(){
  const config = window.SITE_CONFIG || { embeds: {} };
  const firebaseConfig = window.FIREBASE_CONFIG || null;

  // Populate iframes from config
  function populateEmbeds(){
    document.querySelectorAll('.embed-frame').forEach(iframe=>{
      const key = iframe.dataset.embedKey;
      const url = config.embeds && config.embeds[key];
      iframe.dataset.src = url || '';
      if(url){
        iframe.src = url;
      } else {
        // show fallback if no URL
        showFallbackFor(iframe);
      }
    });
  }

  function showFallbackFor(iframe){
    const wrap = iframe.closest('.embed-wrap');
    wrap.querySelector('.embed-fallback').classList.remove('hidden');
    iframe.classList.add('hidden');
  }

  function hideFallbackFor(iframe){
    const wrap = iframe.closest('.embed-wrap');
    wrap.querySelector('.embed-fallback').classList.add('hidden');
    iframe.classList.remove('hidden');
  }

  // Retry and open handlers
  document.addEventListener('click', e=>{
    if(e.target.matches('.retry')){
      const wrap = e.target.closest('.embed-wrap');
      const iframe = wrap.querySelector('.embed-frame');
      const src = iframe.dataset.src;
      if(src){
        hideFallbackFor(iframe);
        iframe.src = src;
      }
    }
    if(e.target.matches('.open')){
      const wrap = e.target.closest('.embed-wrap');
      const iframe = wrap.querySelector('.embed-frame');
      const src = iframe.dataset.src;
      if(src) window.open(src, '_blank', 'noopener');
    }
  });

  // Tab switching
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.dataset.role;
      document.querySelectorAll('.role-panel').forEach(panel=>{
        panel.classList.toggle('hidden', panel.dataset.role !== role);
      });
    });
  });

  // Contrast toggle
  const contrastToggle = document.getElementById('contrastToggle');
  function applyContrast(pref){
    if(pref === 'high') document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');
    contrastToggle.setAttribute('aria-pressed', pref === 'high');
  }
  contrastToggle && contrastToggle.addEventListener('click', ()=>{
    const isHigh = document.body.classList.toggle('high-contrast');
    localStorage.setItem('contrast', isHigh ? 'high' : 'normal');
    contrastToggle.setAttribute('aria-pressed', isHigh);
  });
  const saved = localStorage.getItem('contrast') || 'normal';
  applyContrast(saved);

  // Simple iframe load timeout fallback
  function attachLoadTimeouts(){
    document.querySelectorAll('.embed-frame').forEach(iframe=>{
      let loaded = false;
      iframe.addEventListener('load', ()=>{ loaded = true; hideFallbackFor(iframe); });
      setTimeout(()=>{ if(!loaded) showFallbackFor(iframe); }, 8000);
    });
  }

  // Firebase Auth skeleton
  function initFirebaseAuth(){
    if(!firebaseConfig || !firebaseConfig.apiKey) return;
    // Load Firebase scripts dynamically
    const s1 = document.createElement('script');
    s1.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js";
    s1.onload = ()=>{
      const s2 = document.createElement('script');
      s2.src = "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js";
      s2.onload = ()=>{
        firebase.initializeApp(firebaseConfig);
        window.auth = firebase.auth();
        setupAuthUI();
      };
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  }

  function setupAuthUI(){
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener('click', ()=> openLogin());
    // monitor auth state
    auth.onAuthStateChanged(user=>{
      if(user) {
        document.getElementById('loginBtn').textContent = 'Logout';
        document.getElementById('loginBtn').onclick = ()=> auth.signOut();
      } else {
        document.getElementById('loginBtn').textContent = 'Login';
        document.getElementById('loginBtn').onclick = ()=> openLogin();
      }
    });
  }

  function openLogin(){
    // Minimal prompt based login for now
    const email = prompt('Email');
    const pass = prompt('Password');
    if(!email || !pass) return;
    auth.signInWithEmailAndPassword(email, pass).catch(err=>{
      if(err.code === 'auth/user-not-found'){
        if(confirm('User not found create account?')) {
          auth.createUserWithEmailAndPassword(email, pass).catch(e=>alert(e.message));
        }
      } else alert(err.message);
    });
  }

  // Init
  document.addEventListener('DOMContentLoaded', ()=>{
    populateEmbeds();
    attachLoadTimeouts();
    initFirebaseAuth();
  });

})();
