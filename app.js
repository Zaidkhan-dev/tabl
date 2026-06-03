/* -------------------------------------------------------------
 * TABL SYSTEM LOGIC
 * Implements: Web Audio API, Particle Canvas, Terminal Commands,
 * Triumvirate Triangle highlighting, and Decryption Animations.
 * ----------------------------------------------------------- */

// 1. DATA STORES: MEMBER DOSSIERS
const dossiers = {
  zaid: {
    id: "MEMBER_01 // APEX",
    name: "ZAID KHAN",
    rank: "CHIEF EXECUTIVE OFFICER (CEO)",
    auth: "LEVEL OMEGA (MAXIMUM)",
    status: "ACTIVE // MONITORING",
    sector: "CENTRAL COMMAND",
    desc: "Zaid Khan operates at the apex of the TABL system. As the founder and chief executive, all operational threads, financial allocations, and tech deployments filter through his directives. Known for strict security protocols and strategic positioning, Zaid establishes the organizational vectors that maintain TABL's covert presence.",
    skills: ["STRATEGIC INTEL", "RISK MANAGEMENT", "TACTICAL OVERSEE", "CRYPTOGRAPHIC ROUTING", "RESOURCE ALLOCATION"],
    memo: "MEMO #8801: Apex command is currently tracking operations OP-099 and OP-104. Priority is to preserve system secrecy and lock down core databases until coordinates relocate. Do not initiate open-channel broadcasts."
  },
  aniket: {
    id: "MEMBER_02 // BASE-L",
    name: "ANIKET SAINI",
    rank: "CHIEF FINANCIAL OFFICER (CFO)",
    auth: "LEVEL 9 (RESTRICTED)",
    status: "ACTIVE // SYNCED",
    sector: "RESERVES & LIQUIDITY",
    desc: "Aniket Saini forms the left foundation of the Triumvirate. Controlling the cash flows, vaults, and physical assets of TABL, Aniket coordinates resource distributions to keep operations funded and undetectable. His ledger system uses decentralized cryptographic accounts to mask financial trajectories.",
    skills: ["LIQUID RESERVE TRACKING", "OFFSHORE ROUTING", "VAULT ENCRYPTION", "ASSET ACQUISITION", "BUDGET COVER-UP"],
    memo: "MEMO #4092: Reserves have been redistributed to vault grid Sigma-3. Operation Crown-Stone is fully liquidated and archived. Next phase involves funding the hardware upgrades proposed by Syed (CTO)."
  },
  syed: {
    id: "MEMBER_03 // BASE-R",
    name: "SYED M JAFRI",
    rank: "CHIEF TECHNOLOGY OFFICER (CTO)",
    auth: "LEVEL 9 (RESTRICTED)",
    status: "ACTIVE // SYNCED",
    sector: "INFRASTRUCTURE & CYBERNETICS",
    desc: "Syed M Jafri forms the right foundation of the Triumvirate. As the technology architect, Syed designs and maintains the secure communication protocols, terminal networks, and grid infrastructures of TABL. He developed the quantum-safe encryption layers shielding the society's databases.",
    skills: ["NETWORK ARCHITECTURE", "QUANTUM CRACKING", "MAINFRAME DEFENSE", "LINUX PROTOCOLS", "SOUND/FREQUENCY SYNTH"],
    memo: "MEMO #5102: System scanlines and terminal outputs are stabilized. Core database is operating on RSA-8192 protocols. Comm Terminal TTY0 is now online for terminal prompts."
  }
};

// 2. AUDIO SYNTHESIZER ENGINE (Web Audio API)
let audioCtx = null;
let ambientHumSource = null;
let ambientHumGain = null;
let isAudioMuted = false;

function initAudio() {
  if (audioCtx) return;
  // Initialize context compatible with multiple browsers
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playBeep(freq, type = 'sine', duration = 0.1, volume = 0.1) {
  if (!audioCtx || isAudioMuted) return;
  
  try {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio sweep failed to play", e);
  }
}

function playSweep(startFreq, endFreq, duration = 0.5, type = 'sine', volume = 0.15) {
  if (!audioCtx || isAudioMuted) return;
  
  try {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);
    
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio sweep failed to play", e);
  }
}

function playUnlockChime() {
  if (!audioCtx || isAudioMuted) return;
  const now = audioCtx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25]; // C major arpeggio
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playBeep(freq, 'sine', 0.4, 0.1);
    }, idx * 120);
  });
}

function playErrorBuzzer() {
  if (!audioCtx || isAudioMuted) return;
  playSweep(150, 70, 0.4, 'sawtooth', 0.2);
}

function startAmbientHum() {
  if (!audioCtx || isAudioMuted || ambientHumSource) return;
  
  try {
    // Synth low machine hum
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    ambientHumGain = audioCtx.createGain();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(110, audioCtx.currentTime); // A2 note
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, audioCtx.currentTime);
    
    // Modulation LFO for filtering effect
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.setValueAtTime(0.15, audioCtx.currentTime); // Very slow filter modulation
    lfoGain.gain.setValueAtTime(40, audioCtx.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    ambientHumGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(ambientHumGain);
    ambientHumGain.connect(audioCtx.destination);
    
    osc1.start();
    osc2.start();
    lfo.start();
    
    ambientHumSource = { osc1, osc2, lfo };
  } catch (e) {
    console.warn("Ambient hum failed to start", e);
  }
}

function stopAmbientHum() {
  if (ambientHumSource) {
    try {
      ambientHumSource.osc1.stop();
      ambientHumSource.osc2.stop();
      ambientHumSource.lfo.stop();
    } catch (e) {}
    ambientHumSource = null;
  }
}

// 3. BACKGROUND CANVAS PARTICLE GRIDS
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let maxParticles = 60;
let particleConnectionDistance = 120;
let mouse = { x: null, y: null, radius: 100 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Reduce particles on mobile for speed
  if (canvas.width < 768) {
    maxParticles = 25;
    particleConnectionDistance = 80;
  } else {
    maxParticles = 65;
    particleConnectionDistance = 130;
  }
  initParticles();
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Bounce off walls
    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    
    // Mouse interaction attraction
    if (mouse.x !== null && mouse.y !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        // Slow force towards mouse
        this.x += dx * 0.01;
        this.y += dy * 0.01;
      }
    }
  }
  
  draw() {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw glowing grid lines on high command screen
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  // Connect particles with thin lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < particleConnectionDistance) {
        let opacity = 1 - (dist / particleConnectionDistance);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});
window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

// Init Canvas
resizeCanvas();
animateParticles();

// 4. MATRIX DECRYPTION EFFECT FUNCTION
const decryptChars = "01--x--$&@#%*+=?<>[]{}";
function runDecryption(element, targetText, duration = 800) {
  let start = null;
  const length = targetText.length;
  element.innerText = "";
  
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const revealPercent = Math.min(progress / duration, 1);
    const revealLength = Math.floor(length * revealPercent);
    
    let currentText = "";
    for (let i = 0; i < length; i++) {
      if (i < revealLength) {
        currentText += targetText[i];
      } else {
        currentText += decryptChars[Math.floor(Math.random() * decryptChars.length)];
      }
    }
    
    element.innerText = currentText;
    
    if (progress < duration) {
      requestAnimationFrame(step);
    } else {
      element.innerText = targetText; // guarantee final layout is perfect
    }
  }
  
  requestAnimationFrame(step);
}

// Bind decryption triggers on document elements having [data-decrypt]
function scanAndBindDecryption() {
  document.querySelectorAll('[data-decrypt]').forEach(el => {
    const rawText = el.getAttribute('data-decrypt');
    
    // Store raw text, set initial state to random characters
    el.innerText = rawText.split('').map(() => decryptChars[Math.floor(Math.random() * decryptChars.length)]).join('');
    
    // Decrypt on hover
    el.addEventListener('mouseenter', () => {
      playBeep(880, 'sine', 0.05, 0.03);
      runDecryption(el, rawText, 600);
    });
  });
}

// 5. ENTRY SYSTEM SCANNING GATE
const entryScreen = document.getElementById('entry-screen');
const consoleScreen = document.getElementById('console-screen');
const bioScanner = document.getElementById('biometric-scanner');
const scanStatus = document.getElementById('scan-status');
const passcodeField = document.getElementById('entry-passcode');
const decryptBtn = document.getElementById('btn-submit-pass');
const bypassBtn = document.getElementById('btn-bypass');

let isScanning = false;

// Bio-scanner Trigger
bioScanner.addEventListener('click', () => {
  if (isScanning) return;
  isScanning = true;
  initAudio();
  
  bioScanner.classList.add('scanning');
  scanStatus.innerText = "AUTHENTICATING SCAN...";
  playSweep(200, 1200, 2.5, 'sine', 0.15);
  
  setTimeout(() => {
    // Success simulation
    scanStatus.innerText = "BIOMETRICS MATCHED.";
    playUnlockChime();
    
    setTimeout(() => {
      transitionToConsole();
    }, 800);
  }, 2500);
});

// Passcode Submission
decryptBtn.addEventListener('click', processPasscode);
passcodeField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') processPasscode();
});

function processPasscode() {
  initAudio();
  const val = passcodeField.value.trim().toUpperCase();
  if (val === "") {
    playErrorBuzzer();
    passcodeField.classList.add('error-shake');
    setTimeout(() => passcodeField.classList.remove('error-shake'), 400);
    return;
  }
  
  decryptBtn.innerText = "DECRYPTING...";
  playSweep(800, 300, 0.4, 'triangle', 0.1);
  
  setTimeout(() => {
    decryptBtn.innerText = "ACCESS GRANTED";
    playUnlockChime();
    setTimeout(() => {
      transitionToConsole();
    }, 600);
  }, 1000);
}

// Bypass directly (user bypass request)
bypassBtn.addEventListener('click', () => {
  initAudio();
  playUnlockChime();
  transitionToConsole();
});

function transitionToConsole() {
  entryScreen.classList.add('fade-out');
  consoleScreen.classList.remove('hidden');
  
  // Start HUD system
  setTimeout(() => {
    startAmbientHum();
    updateTime();
    setInterval(updateTime, 1000);
    
    // Trigger header glitch and load welcome screen
    const welcome = document.querySelector('.header-title');
    runDecryption(welcome, "TABL // SECURE NETWORK", 1200);
    
    // Trigger grid coordinate location finder
    fetchCoordinates();
    
    // Run decryption animations across all components
    scanAndBindDecryption();
  }, 500);
}

// 6. MAIN SYSTEM HEADER UPDATE
function updateTime() {
  const timeEl = document.getElementById('system-time');
  const now = new Date();
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  timeEl.innerText = `${hours}:${minutes}:${seconds} UTC`;
}

function fetchCoordinates() {
  const coordEl = document.getElementById('mini-coords');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        coordEl.innerText = `${lat}° N, ${lon}° W`;
      },
      () => {
        // Fallback default coordinates
        coordEl.innerText = "28.6139° N, 77.2090° E";
      }
    );
  } else {
    coordEl.innerText = "28.6139° N, 77.2090° E";
  }
}

// Toggle audio stream manually
const audioToggleBtn = document.getElementById('audio-toggle');
audioToggleBtn.addEventListener('click', () => {
  isAudioMuted = !isAudioMuted;
  
  if (isAudioMuted) {
    stopAmbientHum();
    audioToggleBtn.classList.add('muted');
    audioToggleBtn.querySelector('.audio-label').innerText = "SOUND: MUTED";
  } else {
    audioToggleBtn.classList.remove('muted');
    audioToggleBtn.querySelector('.audio-label').innerText = "SOUND: ON";
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    startAmbientHum();
  }
});

// 7. CONTENT SECTION TAB NAVIGATION
const navItems = document.querySelectorAll('.nav-list li');
const sections = document.querySelectorAll('.content-section');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const targetSection = item.getAttribute('data-section');
    
    // Play select hum
    playBeep(440, 'triangle', 0.08, 0.08);
    
    navItems.forEach(nav => nav.classList.remove('active'));
    sections.forEach(sec => sec.classList.remove('active-section'));
    
    item.classList.add('active');
    const targetEl = document.getElementById(targetSection);
    targetEl.classList.add('active-section');
    
    // Trigger decryptions within newly shown tab
    targetEl.querySelectorAll('[data-decrypt]').forEach(el => {
      runDecryption(el, el.getAttribute('data-decrypt'), 600);
    });
  });
});

// 8. TRIUMVIRATE INTERACTIVE GRAPHICS (CEO, CFO, CTO Triangle layout)
const nodes = document.querySelectorAll('.triumvirate-node');
const quickDetailsText = document.getElementById('broadcast-message');
const dossierPanel = document.getElementById('dossier-panel');
const closeDossierBtn = document.getElementById('close-dossier');

// Mapping SVG lines to hover nodes to light up triangle connections!
const conduitMappings = {
  zaid: ['line-ceo-cfo', 'line-ceo-cto'],
  aniket: ['line-ceo-cfo', 'line-cfo-cto'],
  syed: ['line-ceo-cto', 'line-cfo-cto']
};

nodes.forEach(node => {
  const memberKey = node.getAttribute('data-member');
  const details = dossiers[memberKey];
  
  node.addEventListener('mouseenter', () => {
    // Light up connecting triangle paths
    conduitMappings[memberKey].forEach(lineId => {
      document.getElementById(lineId).classList.add('glow-active');
    });
    
    // Quick status log print in panel console
    quickDetailsText.innerHTML = `<span class="text-glowing">SYNCING DOSSIER</span>: NEURAL SCAN: ACTIVE // PROFILE RECOVERY INITIALIZED...`;
    playBeep(600, 'sine', 0.05, 0.05);
  });
  
  node.addEventListener('mouseleave', () => {
    // Turn down line glows if not globally activated
    conduitMappings[memberKey].forEach(lineId => {
      // Keep glow if that node is active
      const activeNodes = document.querySelectorAll('.triumvirate-node.active-node');
      let keepGlow = false;
      activeNodes.forEach(an => {
        const ak = an.getAttribute('data-member');
        if (conduitMappings[ak].includes(lineId)) keepGlow = true;
      });
      
      if (!keepGlow) {
        document.getElementById(lineId).classList.remove('glow-active');
      }
    });
    
    // Reset quick broadcast text if no active node loaded
    const activeNode = document.querySelector('.triumvirate-node.active-node');
    if (!activeNode) {
      quickDetailsText.innerText = "SYSTEM LINK STABLE. SELECTION NECESSARY TO INTERROGATE DOSSIER LOGS.";
    } else {
      const activeKey = activeNode.getAttribute('data-member');
      quickDetailsText.innerHTML = `LOCKED PROFILE // STATUS: <span class="text-glowing">${dossiers[activeKey].status}</span>`;
    }
  });
  
  node.addEventListener('click', () => {
    // Remove active markers
    nodes.forEach(n => n.classList.remove('active-node'));
    document.querySelectorAll('.conduit-line').forEach(l => l.classList.remove('glow-active'));
    
    node.classList.add('active-node');
    conduitMappings[memberKey].forEach(lineId => {
      document.getElementById(lineId).classList.add('glow-active');
    });
    
    playSweep(400, 900, 0.35, 'triangle', 0.1);
    openDossier(details);
  });
});

// Sliding Dossier panel builder
function openDossier(data) {
  document.getElementById('dossier-id').innerText = data.id;
  document.getElementById('dossier-auth').innerText = data.auth;
  document.getElementById('dossier-status').innerText = data.status;
  document.getElementById('dossier-sector').innerText = data.sector;
  
  // Set and animate texts
  runDecryption(document.getElementById('dossier-name'), data.name, 600);
  document.getElementById('dossier-rank').innerText = data.rank;
  document.getElementById('dossier-desc').innerText = data.desc;
  
  // Render skills tags
  const skillsContainer = document.getElementById('dossier-skills');
  skillsContainer.innerHTML = '';
  data.skills.forEach(skill => {
    const span = document.createElement('span');
    span.className = 'skill-tag';
    span.innerText = skill;
    skillsContainer.appendChild(span);
  });
  
  // Decrypt Field Memo
  const memoEl = document.getElementById('dossier-memo');
  runDecryption(memoEl, data.memo, 1000);
  
  dossierPanel.classList.add('open');
  quickDetailsText.innerHTML = `LOCKED PROFILE // STATUS: <span class="text-glowing">${data.status}</span>`;
}

closeDossierBtn.addEventListener('click', () => {
  dossierPanel.classList.remove('open');
  nodes.forEach(n => n.classList.remove('active-node'));
  document.querySelectorAll('.conduit-line').forEach(l => l.classList.remove('glow-active'));
  quickDetailsText.innerText = "SYSTEM LINK STABLE. SELECTION NECESSARY TO INTERROGATE DOSSIER LOGS.";
  playBeep(300, 'sine', 0.1, 0.05);
});

// 9. COMMAND TERMINAL CLI LOGIC
const terminalCli = document.getElementById('terminal-cli');
const terminalLog = document.getElementById('terminal-log');
const terminalScreen = document.getElementById('terminal-screen');

// Focus input whenever clicking terminal screen
terminalScreen.addEventListener('click', () => {
  terminalCli.focus();
});

terminalCli.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const input = terminalCli.value.trim();
    terminalCli.value = "";
    if (input !== "") {
      processCommand(input);
    }
  }
});

function logTerminalLine(text, cssClass = '') {
  const line = document.createElement('div');
  line.className = `terminal-line ${cssClass}`;
  line.innerText = text;
  terminalLog.appendChild(line);
  
  // Auto-scroll terminal log
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

// Commands processor
function processCommand(cmdStr) {
  logTerminalLine(`TABL@OMEGA_GRID:~$ ${cmdStr}`, 'system-msg');
  
  // Parse command token
  const tokens = cmdStr.split(' ');
  const primary = tokens[0].toLowerCase();
  
  playBeep(700, 'sine', 0.06, 0.05);
  
  switch(primary) {
    case '/help':
      logTerminalLine("--- REGISTERED GRID COMMANDS ---");
      logTerminalLine("/help - Display this command registry.");
      logTerminalLine("/status - Report central processor and database health.");
      logTerminalLine("/members - View credentials of the TABL Triumvirate.");
      logTerminalLine("/hacks - Initiate network decrypt sequences.");
      logTerminalLine("/destruct - Initiate localized emergency core dump.");
      logTerminalLine("/clear - Reset the TTY terminal terminal.");
      break;
      
    case '/status':
      logTerminalLine("GRID STATUS: NOMINAL");
      logTerminalLine("SECURITY CLASSIFICATION: OMEGA RED ALERT");
      logTerminalLine("ACTIVE SENSORS: 4/4");
      logTerminalLine("CENTRAL SECTORS: DEFI VAULTS [SYNCED], FREQ ROUTERS [ACTIVE]");
      logTerminalLine("LORE INTEGRITY: 100%");
      break;
      
    case '/members':
      logTerminalLine("--- THE TRIUMVIRATE CODENAMES ---");
      logTerminalLine("1. ZAID KHAN - Position: CEO [APEX LEVEL]");
      logTerminalLine("2. ANIKET SAINI - Position: CFO [BASE-LEFT SUPPORT]");
      logTerminalLine("3. SYED M JAFRI - Position: CTO [BASE-RIGHT ENGINEERING]");
      logTerminalLine("Triangle formation is linked and currently active.");
      break;
      
    case '/hacks':
      logTerminalLine("ACCESSING MAINFRAME... INITIALIZING EXPLOIT BUFFER OVERFLOW...");
      setTimeout(() => {
        logTerminalLine("DECRYPTING LOCAL PASSWORDS... OK.");
        logTerminalLine("SYS AUTH OVERRIDE: APEX ROOT ACCESS CONFIRMED.");
        playBeep(900, 'triangle', 0.2, 0.1);
      }, 500);
      break;
      
    case '/clear':
      terminalLog.innerHTML = "";
      break;
      
    case '/destruct':
      triggerSelfDestruct();
      break;
      
    default:
      logTerminalLine(`SYS ERR: Unknown command '${primary}'. Try '/help' to list console procedures.`, 'error-msg');
      playErrorBuzzer();
  }
}

// 10. SYSTEM SELF-DESTRUCT SIMULATOR (Glitch Masterpiece)
let selfDestructTimer = null;
function triggerSelfDestruct() {
  if (selfDestructTimer) return;
  
  logTerminalLine("WARNING: SELF-DESTRUCT PROTOCOL 9-9-OMEGA INITIATED.", 'error-msg');
  logTerminalLine("CRITICAL ALARM: DATABASE CORE PURGE IN PROGRESS...", 'error-msg');
  
  document.body.classList.add('self-destruct-activated');
  
  let countdown = 10;
  playBeep(120, 'sawtooth', 0.6, 0.3);
  
  selfDestructTimer = setInterval(() => {
    if (countdown > 0) {
      logTerminalLine(`CORE DUMP IN ${countdown}...`, 'error-msg');
      
      // Play warning sweep
      playSweep(250, 100, 0.5, 'sawtooth', 0.25);
      
      // Trigger a visual shake on terminal screen
      terminalScreen.style.animation = 'none';
      setTimeout(() => {
        terminalScreen.style.animation = 'text-shake 0.3s linear';
      }, 10);
      
      countdown--;
    } else {
      clearInterval(selfDestructTimer);
      selfDestructTimer = null;
      
      // Fun plot twist: self-destruct fails
      document.body.classList.remove('self-destruct-activated');
      
      logTerminalLine("------------------------------------------------", 'system-msg');
      logTerminalLine("CORE DUMP ABORTED: EMERGENCY BYPASS ACTIVATED.", 'system-msg');
      logTerminalLine("BYPASS AGENT: ZAID KHAN [CEO]", 'system-msg');
      logTerminalLine("REASON: SYSTEM OVER-RIDE CONFIRMED.", 'system-msg');
      logTerminalLine("GRID RESTORED TO OMEGA-NOMINAL SYSTEM STATUS.", 'system-msg');
      logTerminalLine("------------------------------------------------", 'system-msg');
      
      playUnlockChime();
    }
  }, 1000);
}
