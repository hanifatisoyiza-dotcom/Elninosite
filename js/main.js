/**
 * NAIJA CLIMATEWATCH: EL NIÑO AWARENESS & INFORMATION SYSTEM (NAAS)
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initRegionalTabs();
  initReadinessChecklist();
  initStateEmergencyFinder();
  initQuiz();
  initRiskCalculator();
  initIncidentForm();
});

/* ==========================================================================
   1. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking outside or clicking a nav link
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      }
    });
  }
}

/* ==========================================================================
   2. REGIONAL IMPACT EXPLORER (PAGE 1)
   ========================================================================== */
const regionalData = {
  north: {
    title: "Northern Savannah & Sahel Zone",
    badge: "☀️ Extreme Heat & Severe Drought",
    riskPct: 92,
    riskColor: "#ef4444",
    states: ["Kano", "Borno", "Sokoto", "Katsina", "Jigawa", "Yobe", "Kebbi", "Zamfara"],
    summary: "During El Niño, Northern Nigeria faces severe reduction in annual rainfall, prolonged dry spells, heatwaves reaching 43°C, and accelerated desert encroachment.",
    threats: [
      { title: "Crop Failure & Livestock Mortality", desc: "Millet, Sorghum, and Cowpea yields plunge. Drying pastures trigger severe livestock dehydration and farmer-herder strain." },
      { title: "Water Table Depletion", desc: "Shallow wells and seasonal dams dry up prematurely, causing widespread rural and peri-urban water distress." },
      { title: "Meningitis & Heat Exhaustion", desc: "Dry, dusty, superheated air significantly elevates Cerebrospinal Meningitis (CSM) outbreaks." },
      { title: "Wildfires & Dust Storms", desc: "Harmattan dust blends with intense heat, triggering sudden grassfires and respiratory ailments." }
    ],
    advice: "Prioritize drought-hardy early seeds, construct covered community water storage, protect livestock under shade shelters, and avoid midday manual labor."
  },
  middlebelt: {
    title: "Middle Belt & Guinea Savannah",
    badge: "⚡ Erratic Rains & Delayed Planting",
    riskPct: 78,
    riskColor: "#f59e0b",
    states: ["Benue", "Plateau", "Niger", "Kogi", "Kwara", "Nasarawa", "FCT Abuja"],
    summary: "Nigeria's food basket experiences erratic rainfall onset. False starts of rain trick farmers into premature sowing, followed by 3-5 week scorching dry spells.",
    threats: [
      { title: "Yam, Maize & Rice Planting Traps", desc: "Seedlings burn up in scorching topsoil due to unexpected rain pauses after early showers." },
      { title: "Hydropower Reservoir Depletion", desc: "Low tributary inflows into Kainji, Jebba, and Shiroro hydroelectric dams reduce national grid power generation." },
      { title: "River Basin Shrinkage", desc: "The River Benue and River Niger experience historic low water lines, disrupting riverine transport and irrigation." },
      { title: "Sudden Cloudbursts", desc: "When rains finally arrive, they come as violent thunderstorms causing rapid soil erosion and gully widening." }
    ],
    advice: "Do not plant with the very first isolated shower; consult NIMET agro-bulletins. Utilize heavy mulching to conserve root moisture."
  },
  southwest: {
    title: "South-West Rainforest & Urban Metros",
    badge: "🌡️ Heat Island Stress & Dry Spells",
    riskPct: 72,
    riskColor: "#f59e0b",
    states: ["Lagos", "Oyo", "Ogun", "Ondo", "Osun", "Ekiti"],
    summary: "High population densities and urban concrete in cities like Lagos and Ibadan amplify the heat index. Disrupted 'August Break' patterns and sporadic severe downpours.",
    threats: [
      { title: "Urban Heat Island Effect", desc: "Nighttime ambient temperatures stay high (>31°C). Power outages worsen sleep deprivation and cardiovascular stress." },
      { title: "Municipal Water Crisis", desc: "Public water plants face low dam reserves, while private boreholes suffer increased pumping drawdown." },
      { title: "Cocoa & Cassava Stress", desc: "Extended dry periods stunt early cocoa pods and reduce cassava tuber starch content." },
      { title: "Flash Storm Gutters Overload", desc: "Sporadic violent downpours overwhelm blocked urban drainages, causing flash floods in low-lying estates." }
    ],
    advice: "Maintain hydration with ORS and clean water, clear street gutters of plastic bottles before storms, and unplug delicate appliances during power surges."
  },
  southsouth: {
    title: "South-South & South-East Coastal Riverine",
    badge: "🌊 Storm Surges, Flash Floods & Erosion",
    riskPct: 88,
    riskColor: "#ef4444",
    states: ["Rivers", "Delta", "Bayelsa", "Akwa Ibom", "Cross River", "Anambra", "Imo", "Abia", "Enugu", "Ebonyi"],
    summary: "Contrary to common belief, El Niño's altered atmospheric wind shears often funnel erratic, super-charged convective storm systems into Nigeria's Atlantic coastline.",
    threats: [
      { title: "Catastrophic Flash Flooding", desc: "Torrential downpours cause rivers and canals to spill into coastal communities, displacing fishing villages." },
      { title: "Severe Gully Erosion", desc: "Fragile sandstone soils in Anambra and Abia suffer accelerated gully landslides that swallow roads and homes." },
      { title: "Waterborne Epidemics (Cholera)", desc: "Floods inundate pit latrines and soakaways, contaminating boreholes and triggering severe cholera outbreaks." },
      { title: "Fishery Disruption", desc: "Higher water temperatures and erratic salinity levels alter fish migration patterns in coastal creeks." }
    ],
    advice: "Elevate critical home valuables, strictly boil or chlorinate all drinking water with WaterGuard, and do not build on flood plains or drainage corridors."
  }
};

function initRegionalTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn[data-region]');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const regionKey = btn.getAttribute('data-region');
      const data = regionalData[regionKey];
      if (!data) return;

      const titleEl = document.getElementById('regionTitle');
      const badgeEl = document.getElementById('regionBadge');
      const riskPctEl = document.getElementById('regionRiskPct');
      const riskFillEl = document.getElementById('regionRiskFill');
      const statesEl = document.getElementById('regionStatesList');
      const summaryEl = document.getElementById('regionSummary');
      const threatsEl = document.getElementById('regionThreats');
      const adviceEl = document.getElementById('regionAdvice');

      if (titleEl) titleEl.textContent = data.title;
      if (badgeEl) badgeEl.textContent = data.badge;
      if (riskPctEl) riskPctEl.textContent = `${data.riskPct}% Vulnerability`;
      if (riskFillEl) {
        riskFillEl.style.width = `${data.riskPct}%`;
        riskFillEl.style.backgroundColor = data.riskColor;
      }
      if (summaryEl) summaryEl.textContent = data.summary;
      if (adviceEl) adviceEl.textContent = data.advice;

      if (statesEl) {
        statesEl.innerHTML = data.states
          .map(state => `<span class="state-chip">${state}</span>`)
          .join('');
      }

      if (threatsEl) {
        threatsEl.innerHTML = data.threats
          .map(t => `
            <div class="threat-box">
              <div class="threat-title">⚠️ ${t.title}</div>
              <p class="threat-desc">${t.desc}</p>
            </div>
          `).join('');
      }
    });
  });
}

/* ==========================================================================
   3. HOUSEHOLD READINESS CHECKLIST (PAGE 2)
   ========================================================================== */
function initReadinessChecklist() {
  const checkboxes = document.querySelectorAll('.checklist-checkbox');
  const meterPct = document.getElementById('readinessPct');
  const meterFill = document.getElementById('readinessFill');
  const countText = document.getElementById('readinessCount');
  const resetBtn = document.getElementById('resetChecklistBtn');
  const printBtn = document.getElementById('printChecklistBtn');

  if (!checkboxes.length) return;

  const storageKey = 'naija_elnino_checklist_state';

  // Load saved state
  let savedState = {};
  try {
    savedState = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (e) {
    savedState = {};
  }

  checkboxes.forEach((cb, index) => {
    if (savedState[index]) {
      cb.checked = true;
      cb.closest('.checklist-item')?.classList.add('completed');
    }

    cb.addEventListener('change', () => {
      const item = cb.closest('.checklist-item');
      if (cb.checked) {
        item?.classList.add('completed');
      } else {
        item?.classList.remove('completed');
      }
      updateReadinessScore();
    });
  });

  function updateReadinessScore() {
    let completedCount = 0;
    const currentState = {};

    checkboxes.forEach((cb, idx) => {
      if (cb.checked) {
        completedCount++;
        currentState[idx] = true;
      }
    });

    try {
      localStorage.setItem(storageKey, JSON.stringify(currentState));
    } catch (e) {
      // LocalStorage fallback
    }

    const total = checkboxes.length;
    const percentage = Math.round((completedCount / total) * 100);

    if (meterPct) meterPct.textContent = `${percentage}%`;
    if (meterFill) meterFill.style.width = `${percentage}%`;
    if (countText) countText.textContent = `${completedCount} of ${total} Critical Actions Completed`;

    // Status message
    const statusMsg = document.getElementById('readinessStatusMsg');
    if (statusMsg) {
      if (percentage === 100) {
        statusMsg.innerHTML = '🌟 <strong>Outstanding!</strong> Your household is comprehensively prepared for El Niño hazards.';
        statusMsg.style.color = '#34d399';
      } else if (percentage >= 60) {
        statusMsg.innerHTML = '👍 <strong>Good Progress!</strong> Complete the remaining safety measures to ensure maximum resilience.';
        statusMsg.style.color = '#fbbf24';
      } else {
        statusMsg.innerHTML = '⚠️ <strong>High Exposure:</strong> Please review and implement the unticked safety actions above.';
        statusMsg.style.color = '#fca5a5';
      }
    }
  }

  // Initial calculation
  updateReadinessScore();

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset your preparedness checklist progress?')) {
        checkboxes.forEach(cb => {
          cb.checked = false;
          cb.closest('.checklist-item')?.classList.remove('completed');
        });
        localStorage.removeItem(storageKey);
        updateReadinessScore();
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   4. STATE EMERGENCY & SEMA FINDER (PAGE 3)
   ========================================================================== */
const nigerianStateData = {
  "lagos": {
    name: "Lagos State",
    zone: "South-West",
    capital: "Ikeja",
    semaName: "LASEMA (Lagos State Emergency Management Agency)",
    hotlines: ["112 (Toll Free)", "767 (Toll Free)", "08060907777"],
    riskProfile: "High Urban Heat Island & Lowland Coastal Flash Flooding",
    priorityActions: "Unclog neighborhood gutters in Bariga, Lekki, and Agege; keep children hydrated; do not wade through floodwaters across Apapa or Marina."
  },
  "kano": {
    name: "Kano State",
    zone: "North-West",
    capital: "Kano City",
    semaName: "Kano SEMA & State Fire Service",
    hotlines: ["112", "08036070001", "08034015682"],
    riskProfile: "Severe Heatwaves (42°C+), Prolonged Crop Drought, Borehole Depletion",
    priorityActions: "Avoid afternoon farm labor during heat peaks; protect water reservoirs; vaccinate children against cerebrospinal meningitis (CSM)."
  },
  "rivers": {
    name: "Rivers State",
    zone: "South-South",
    capital: "Port Harcourt",
    semaName: "Rivers SEMA & Marine Emergency Unit",
    hotlines: ["112", "08033100099", "084-230000"],
    riskProfile: "Coastal Inundation, Storm Surges, Flash Flooding & Cholera Risks",
    priorityActions: "Elevate home electrical wiring; boil all water from shallow wells; evacuate waterfront settlements during high-tide rainfall alerts."
  },
  "fct": {
    name: "Federal Capital Territory (Abuja)",
    zone: "North-Central",
    capital: "Abuja",
    semaName: "FEMA (FCT Emergency Management Agency)",
    hotlines: ["112", "0800-CALL-FEMA", "08181895554"],
    riskProfile: "Erratic Heat Spikes, Lokogoma/Trademore Flash Floods, River Usuma Low Levels",
    priorityActions: "Stay off Trademore/Lugbe flood bridges during torrential rain; conserve tap water during low reservoir storage."
  },
  "kogi": {
    name: "Kogi State",
    zone: "North-Central",
    capital: "Lokoja",
    semaName: "Kogi SEMA (Confluence Emergency Office)",
    hotlines: ["112", "08035987112", "08032890123"],
    riskProfile: "Niger-Benue Confluence Surge Flooding & Agricultural Crop Desiccation",
    priorityActions: "Prepare relocation bags for low-lying Lokoja, Ibaji, and Ajaokuta communities; adopt fast-maturing cassava and yam varieties."
  },
  "benue": {
    name: "Benue State",
    zone: "Middle Belt",
    capital: "Makurdi",
    semaName: "Benue State Emergency Management Agency (BSEMA)",
    hotlines: ["112", "08036122345", "08038899011"],
    riskProfile: "Extreme Food Basket Crop Stress, River Benue Overflow & False Rainfall Onset",
    priorityActions: "Do not plant maize with premature first rain; practice deep mulching; follow BSEMA flood alerts along River Benue banks."
  },
  "oyo": {
    name: "Oyo State",
    zone: "South-West",
    capital: "Ibadan",
    semaName: "Oyo SEMA & State Fire Service",
    hotlines: ["615 (Oyo Toll-Free)", "112", "08033789012"],
    riskProfile: "Ona River Basin Flash Floods, Urban Heat Waves & Agricultural Dry Spells",
    priorityActions: "Clear Ogunpa river tributaries; avoid outdoor burning during hot afternoons; ensure adequate hydration in classrooms and markets."
  },
  "anambra": {
    name: "Anambra State",
    zone: "South-East",
    capital: "Awka",
    semaName: "Anambra SEMA (SEMA Awka)",
    hotlines: ["112", "08034567890", "08037123456"],
    riskProfile: "Severe Gully Erosion, River Niger Overflows in Ogbaru, Flash Floods in Onitsha",
    priorityActions: "Never channel roof rainwater directly onto bare soil in erosion corridors; reinforce retaining walls; avoid Onitsha market drainage paths."
  },
  "borno": {
    name: "Borno State",
    zone: "North-East",
    capital: "Maiduguri",
    semaName: "Borno SEMA & Humanitarian Disaster Desk",
    hotlines: ["112", "08023456789", "08031122334"],
    riskProfile: "Extreme Aridity, Drying of Lake Chad Basin Tributaries, Severe Dust Storms",
    priorityActions: "Cover open water tanks to prevent dust and mosquito breeding; practice sandstorm face shielding; prioritize community drought shelters."
  },
  "enugu": {
    name: "Enugu State",
    zone: "South-East",
    capital: "Enugu",
    semaName: "Enugu SEMA & Coal City Fire Services",
    hotlines: ["112", "08033324567", "08038889900"],
    riskProfile: "Dry Season Water Shortages, Urban Hillside Erosion & Bush Fire Hazards",
    priorityActions: "Stockpile household water safely; clear dry bushes around residential properties; install drip-irrigation for backyard gardens."
  },
  "kaduna": {
    name: "Kaduna State",
    zone: "North-West",
    capital: "Kaduna",
    semaName: "KADSEMA (Kaduna State Emergency Management Agency)",
    hotlines: ["112", "08033311223", "08037000999"],
    riskProfile: "River Kaduna Flash Inundations & Savanna Drought Disruptions",
    priorityActions: "Heed river gauge warnings along Barnawa and Kigo Road; protect livestock feeds; report early signs of waterborne sickness."
  },
  "delta": {
    name: "Delta State",
    zone: "South-South",
    capital: "Asaba",
    semaName: "Delta SEMA",
    hotlines: ["112", "08034455667", "08039988776"],
    riskProfile: "Creek Flooding, River Inundation in Asaba/Warri, Rainstorm Roof Damages",
    priorityActions: "Reinforce roof zinc nails before intense storm gusts; maintain personal flotation gear in riverine communities; boil drinking water."
  }
};

function initStateEmergencyFinder() {
  const stateSelect = document.getElementById('stateSelectInput');
  const searchInput = document.getElementById('stateSearchInput');
  const resultContainer = document.getElementById('stateResultContainer');

  if (!stateSelect && !searchInput) return;

  function renderStateCard(stateKey) {
    const data = nigerianStateData[stateKey];
    if (!data || !resultContainer) return;

    resultContainer.innerHTML = `
      <div class="state-result-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <span class="badge badge-green" style="margin-bottom: 0.4rem;">${data.zone} Geo-Political Zone</span>
            <h3 style="color: #fff; font-size: 1.5rem; margin-top: 0.2rem;">${data.name}</h3>
            <p style="color: #94a3b8; font-size: 0.88rem;">Capital City: <strong>${data.capital}</strong></p>
          </div>
          <div style="text-align: right;">
            <span class="badge badge-amber">Active Advisory Profile</span>
            <p style="color: #fca5a5; font-size: 0.85rem; font-weight: 700; margin-top: 0.35rem;">${data.riskProfile}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 1.5rem;">
          <div>
            <h4 style="color: #34d399; font-size: 0.95rem; margin-bottom: 0.5rem;">🏢 Primary Agency:</h4>
            <p style="color: #f1f5f9; font-weight: 600; font-size: 0.95rem;">${data.semaName}</p>
            <div style="margin-top: 0.75rem;">
              <span style="font-size: 0.8rem; color: #94a3b8;">Emergency Hotlines:</span>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.35rem;">
                ${data.hotlines.map(h => `<a href="tel:${h.replace(/[^0-9]/g, '')}" class="badge badge-red" style="font-size: 0.85rem; padding: 0.4rem 0.8rem; text-decoration: none;">📞 ${h}</a>`).join('')}
              </div>
            </div>
          </div>

          <div>
            <h4 style="color: #fbbf24; font-size: 0.95rem; margin-bottom: 0.5rem;">🛡️ Essential Local Protocol:</h4>
            <p style="color: #cbd5e1; font-size: 0.88rem; line-height: 1.55;">${data.priorityActions}</p>
          </div>
        </div>
      </div>
    `;
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (stateSelect) {
    stateSelect.addEventListener('change', () => {
      const val = stateSelect.value;
      if (val) renderStateCard(val);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) return;

      const matchedKey = Object.keys(nigerianStateData).find(key => {
        const item = nigerianStateData[key];
        return item.name.toLowerCase().includes(query) ||
               item.capital.toLowerCase().includes(query) ||
               item.zone.toLowerCase().includes(query);
      });

      if (matchedKey) {
        renderStateCard(matchedKey);
        if (stateSelect) stateSelect.value = matchedKey;
      }
    });
  }
}

/* ==========================================================================
   5. ARE YOU EL NIÑO SMART? INTERACTIVE QUIZ (PAGE 4)
   ========================================================================== */
const quizQuestions = [
  {
    question: "1. What is the fundamental scientific cause of the El Niño climate phenomenon?",
    options: [
      { text: "Seasonal wind changes originating solely from the Sahara Desert", correct: false },
      { text: "Unusual warming of surface sea waters in the central and eastern tropical Pacific Ocean", correct: true },
      { text: "A rare spiritual warning to African nations during election years", correct: false },
      { text: "Industrial carbon emissions produced exclusively by oil refineries in Port Harcourt", correct: false }
    ],
    explanation: "El Niño is caused by the periodic warming of equatorial Pacific Ocean sea surface temperatures, which alters global jet streams and atmospheric circulation around the globe, including West Africa."
  },
  {
    question: "2. How does El Niño affect different parts of Nigeria differently?",
    options: [
      { text: "Every Nigerian state experiences freezing snowfall", correct: false },
      { text: "It only causes prolonged heatwaves in the North, while the South is completely immune", correct: false },
      { text: "The North & Middle Belt typically face severe droughts and delayed rains, while Southern coasts can experience erratic, intense flash floods", correct: true },
      { text: "It stops all ocean tides from flowing into the Gulf of Guinea", correct: false }
    ],
    explanation: "El Niño produces a dual impact in Nigeria: reduced precipitation and extreme heat in Northern/Savannah states, juxtaposed with violent erratic thunderstorms and coastal storm surges in the South."
  },
  {
    question: "3. What is the danger of drinking cold sugary drinks or alcohol during an extreme Nigerian heatwave?",
    options: [
      { text: "Alcohol and high sugar drinks act as diuretics, worsening internal dehydration and heat exhaustion", correct: true },
      { text: "Sugary drinks protect your stomach lining from sunburn", correct: false },
      { text: "Chilled soda replaces all vital bodily electrolytes faster than water", correct: false },
      { text: "There is no danger; soda is medically superior to clean water", correct: false }
    ],
    explanation: "Alcohol and heavy sugar beverages accelerate fluid loss through urination. Hydration during heatwaves requires clean water, homemade salt-sugar ORS, or coconut water."
  },
  {
    question: "4. Which critical Nigerian government agency is responsible for issuing official seasonal weather forecasts and early warning climate bulletins?",
    options: [
      { text: "FRSC (Federal Road Safety Corps)", correct: false },
      { text: "NIMET (Nigerian Meteorological Agency)", correct: true },
      { text: "NNPC (Nigerian National Petroleum Corporation)", correct: false },
      { text: "EFCC (Economic and Financial Crimes Commission)", correct: false }
    ],
    explanation: "NIMET is the apex statutory meteorological agency in Nigeria that monitors weather radars, climate models, and releases the annual Seasonal Climate Prediction (SCP)."
  },
  {
    question: "5. Why is burning dry grass and farm refuse strictly discouraged during El Niño periods?",
    options: [
      { text: "Smoke attracts more rainy clouds prematurely", correct: false },
      { text: "Extreme ambient dryness and strong winds cause small sparks to rapidly erupt into uncontrollable bushfires destroying whole villages", correct: true },
      { text: "Smoke neutralizes chemical fertilizers in the soil", correct: false },
      { text: "It is an ancient Nigerian cultural superstition without physical danger", correct: false }
    ],
    explanation: "During El Niño droughts, vegetation is dry as tinder. High winds and scorching temperatures turn modest brush burnings into devastating wildland infernos."
  }
];

function initQuiz() {
  const quizBox = document.getElementById('quizContainer');
  if (!quizBox) return;

  let currentQuestionIndex = 0;
  let userScore = 0;
  let answered = false;

  const countEl = document.getElementById('quizCounter');
  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  const feedbackEl = document.getElementById('quizFeedback');
  const nextBtn = document.getElementById('quizNextBtn');

  function renderQuestion() {
    answered = false;
    const q = quizQuestions[currentQuestionIndex];
    if (!q) {
      showResults();
      return;
    }

    if (countEl) countEl.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    if (questionEl) questionEl.textContent = q.question;

    if (feedbackEl) {
      feedbackEl.className = 'quiz-feedback-box';
      feedbackEl.innerHTML = '';
      feedbackEl.style.display = 'none';
    }

    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.textContent = currentQuestionIndex === quizQuestions.length - 1 ? 'View Final Results 🏆' : 'Next Question ➜';
    }

    if (optionsEl) {
      optionsEl.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `<span class="quiz-opt-letter">${letters[idx]}</span> <span>${opt.text}</span>`;
        btn.addEventListener('click', () => selectAnswer(btn, opt, q));
        optionsEl.appendChild(btn);
      });
    }
  }

  function selectAnswer(button, option, question) {
    if (answered) return;
    answered = true;

    const allButtons = optionsEl.querySelectorAll('.quiz-option-btn');
    allButtons.forEach(b => b.style.pointerEvents = 'none');

    if (option.correct) {
      button.classList.add('selected-correct');
      userScore++;
      feedbackEl.className = 'quiz-feedback-box show correct';
      feedbackEl.innerHTML = `<strong>✅ Correct!</strong> ${question.explanation}`;
    } else {
      button.classList.add('selected-wrong');
      // Highlight correct one
      question.options.forEach((opt, idx) => {
        if (opt.correct) {
          allButtons[idx]?.classList.add('selected-correct');
        }
      });
      feedbackEl.className = 'quiz-feedback-box show wrong';
      feedbackEl.innerHTML = `<strong>❌ Incorrect.</strong> ${question.explanation}`;
    }

    feedbackEl.style.display = 'block';
    if (nextBtn) nextBtn.style.display = 'inline-flex';
  }

  function showResults() {
    const pct = Math.round((userScore / quizQuestions.length) * 100);
    let title = "";
    let desc = "";
    let badge = "🌱";

    if (pct === 100) {
      badge = "🏆";
      title = "El Niño Climate Master";
      desc = "Flawless score! You are fully equipped to protect your family, educate neighbors, and debunk climate myths across Nigeria.";
    } else if (pct >= 60) {
      badge = "🛡️";
      title = "Certified Climate Champion";
      desc = "Great job! You have a solid grasp of El Niño impacts in Nigeria. Review the few missed topics to sharpen your preparedness.";
    } else {
      badge = "📘";
      title = "Informed Learner";
      desc = "Good effort! Take time to explore our Myths vs Facts and Preparedness pages to ensure you are ready for climate shifts.";
    }

    quizBox.innerHTML = `
      <div class="quiz-result-card">
        <div class="quiz-badge-icon">${badge}</div>
        <span class="badge badge-green" style="font-size: 0.85rem; padding: 0.4rem 0.9rem; margin-bottom: 0.75rem;">Your Knowledge Score</span>
        <h3 style="font-size: 2.2rem; color: #0f172a; margin-bottom: 0.5rem;">${userScore} / ${quizQuestions.length} (${pct}%)</h3>
        <h4 style="color: #008751; font-size: 1.3rem; margin-bottom: 1rem;">${title}</h4>
        <p style="color: #475569; max-width: 580px; margin: 0 auto 2rem; line-height: 1.6;">${desc}</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary" id="retakeQuizBtn">🔄 Retake Quiz</button>
          <a href="prepare-and-survive.html" class="btn btn-secondary">📋 View Preparedness Guide</a>
        </div>
      </div>
    `;

    document.getElementById('retakeQuizBtn')?.addEventListener('click', () => {
      currentQuestionIndex = 0;
      userScore = 0;
      // Re-render full template
      location.reload();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentQuestionIndex++;
      renderQuestion();
    });
  }

  renderQuestion();
}

/* ==========================================================================
   6. PERSONALIZED CLIMATE RISK CALCULATOR (PAGE 1)
   ========================================================================== */
function initRiskCalculator() {
  const calcForm = document.getElementById('riskCalcForm');
  const resultCard = document.getElementById('riskCalcResult');

  if (!calcForm || !resultCard) return;

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const zone = document.getElementById('calcZone')?.value;
    const occ = document.getElementById('calcOccupation')?.value;
    const water = document.getElementById('calcWaterSource')?.value;

    let score = 0;

    // Zone factor
    if (zone === 'north') score += 35;
    else if (zone === 'southsouth') score += 30;
    else if (zone === 'middlebelt') score += 25;
    else score += 20;

    // Occupation factor
    if (occ === 'farmer') score += 40;
    else if (occ === 'trader') score += 25;
    else if (occ === 'outdoor') score += 35;
    else score += 15;

    // Water factor
    if (water === 'well') score += 25;
    else if (water === 'vendor') score += 30;
    else if (water === 'tap') score += 15;
    else score += 10;

    let riskLevel = "Moderate";
    let badgeClass = "badge-amber";
    let color = "#f59e0b";
    let adviceText = "";

    if (score >= 70) {
      riskLevel = "Very High Vulnerability";
      badgeClass = "badge-red";
      color = "#ef4444";
      adviceText = "Your livelihood and water dependency place you at high climate risk. Immediate priority: install rainwater storage, secure drought-tolerant crops or backup stock, and join your local community SEMA notification group.";
    } else if (score >= 45) {
      riskLevel = "Moderate Vulnerability";
      badgeClass = "badge-amber";
      color = "#f59e0b";
      adviceText = "You face noticeable exposure to food inflation, heat stress, and seasonal water cuts. Prioritize keeping oral rehydration salts at home and insulating rooms against afternoon sun.";
    } else {
      riskLevel = "Managed / Low Vulnerability";
      badgeClass = "badge-green";
      color = "#10b981";
      adviceText = "While direct bodily danger is mitigated, you remain vulnerable to national electricity grid fluctuations and market food price hikes caused by crop shortages.";
    }

    resultCard.innerHTML = `
      <div style="background: #ffffff; border: 2px solid ${color}; border-radius: var(--radius-lg); padding: 1.75rem; box-shadow: var(--shadow-md); animation: fadeIn 0.4s ease;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <span class="badge ${badgeClass}">${riskLevel}</span>
          <span style="font-size: 1.4rem; font-weight: 800; color: ${color}; font-family: var(--font-heading);">${score}/100 Risk Index</span>
        </div>
        <h4 style="font-size: 1.15rem; color: #0f172a; margin-bottom: 0.6rem;">Tailored Preparedness Assessment</h4>
        <p style="font-size: 0.92rem; color: #475569; line-height: 1.6; margin-bottom: 1.25rem;">${adviceText}</p>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a href="prepare-and-survive.html" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.6rem 1.1rem;">Get Full Action Checklist</a>
          <a href="agencies-and-help.html" class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.6rem 1.1rem;">Find State Hotlines</a>
        </div>
      </div>
    `;
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* ==========================================================================
   7. INCIDENT REPORTING SIMULATION (PAGE 3)
   ========================================================================== */
function initIncidentForm() {
  const form = document.getElementById('incidentReportForm');
  const alertContainer = document.getElementById('incidentFormAlert');

  if (!form || !alertContainer) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const state = document.getElementById('incidentState')?.value;
    const lga = document.getElementById('incidentLga')?.value;
    const type = document.getElementById('incidentType')?.value;
    const details = document.getElementById('incidentDetails')?.value;

    const ticketId = `NEMA-NGR-${Math.floor(100000 + Math.random() * 900000)}`;

    alertContainer.innerHTML = `
      <div style="background: #ecfdf5; border: 1.5px solid #059669; border-radius: var(--radius-md); padding: 1.5rem; margin-top: 1.5rem; animation: fadeIn 0.4s ease;">
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #065f46; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">
          <span>✅ Incident Dispatched Successfully</span>
        </div>
        <p style="color: #064e3b; font-size: 0.9rem; line-height: 1.55; margin-bottom: 0.75rem;">
          Your climate hazard report for <strong>${lga}, ${state}</strong> (${type}) has been logged in the Nigerian Emergency Response Simulator with Reference Ticket:
          <span style="background: #047857; color: #fff; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; font-weight: 700;">${ticketId}</span>
        </p>
        <p style="color: #065f46; font-size: 0.82rem;">
          Simulated alerts have been forwarded to the <strong>${state} SEMA Disaster Monitoring Desk</strong> and <strong>NEMA Zonal Command</strong> for rapid field assessment.
        </p>
      </div>
    `;

    form.reset();
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
