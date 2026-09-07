/**
 * EXAMORA — Core Application Engine & State Controller
 * Features:
 * - Single-Page Architecture with instant view transitions
 * - Distraction-free examination arena & keyboard navigation
 * - Real-time countdown timer with dynamic color shifting
 * - LocalStorage state preservation & auto-save
 * - High-DPI Canvas-based data visualizers
 * - Role-based preview switcher (Student / Admin)
 * - Result evaluation with animated SVG gauge & question breakdown
 * - Question & Exam builders with instant state update
 */

// Global Application State
const state = {
  currentView: 'landing',
  currentRole: 'student',
  theme: 'dark',
  activeExam: null,
  currentQuestionIndex: 0,
  userAnswers: {},       // { [qIndex]: optionIndex }
  markedQuestions: new Set(),
  timerSeconds: 45 * 60,
  timerInterval: null,
  examStartTime: null,
  lastResult: null,
  leaderboardTimeframe: 'weekly',
  categoryFilter: 'all',
  reviewFilter: 'all'
};

// ==========================================================================
// 1. INITIALIZATION & LIFECYCLE
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRouter();
  initDiscoveryCatalog();
  initStudentDashboard();
  initLeaderboard();
  initAdminCenter();
  initKeyboardListeners();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('examora_theme') || 'dark';
  applyTheme(savedTheme);
}

function toggleTheme() {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('examora_theme', theme);

  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  if (sunIcon && moonIcon) {
    if (theme === 'light') {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    } else {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    }
  }

  // Redraw active charts to match theme if on analytics view
  if (state.currentView === 'analytics') {
    renderAnalyticsCharts();
  }
}

// Router & View Switcher
function initRouter() {
  navigateTo('landing');
}

function navigateTo(viewName) {
  state.currentView = viewName;

  // Hide all view containers
  document.querySelectorAll('.app-view').forEach(view => {
    view.style.display = 'none';
  });

  // Display target view
  const target = document.getElementById('view-' + viewName);
  if (target) {
    target.style.display = 'block';
  }

  // Update active navbar item
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-nav') === viewName) {
      link.classList.add('active');
    }
  });

  // View-specific render hooks
  if (viewName === 'discovery') {
    filterExams();
  } else if (viewName === 'student') {
    renderStudentResultsTable();
    renderSubjectMasteryBars();
  } else if (viewName === 'analytics') {
    setTimeout(renderAnalyticsCharts, 50);
  } else if (viewName === 'leaderboard') {
    renderLeaderboard(state.leaderboardTimeframe);
  } else if (viewName === 'admin') {
    renderAdminExamsTable();
    renderAdminStudentsTable();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(id) {
  if (state.currentView !== 'landing') {
    navigateTo('landing');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

function toggleMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.toggle('open');
    overlay.classList.toggle('active');
  }
}

// Role Switching Controller
function switchRole(role) {
  state.currentRole = role;
  const pillStudent = document.getElementById('pill-student');
  const pillAdmin = document.getElementById('pill-admin');

  if (role === 'admin') {
    pillAdmin.classList.add('active');
    pillStudent.classList.remove('active');
    navigateTo('admin');
    showToast('Admin mode enabled • Logged in as Dr. Evelyn Vance', 'info');
  } else {
    pillStudent.classList.add('active');
    pillAdmin.classList.remove('active');
    navigateTo('student');
    showToast('Student mode enabled • Logged in as Alex Morgan', 'info');
  }
}

// ==========================================================================
// 2. EXAM DISCOVERY CATALOG & FILTERING
// ==========================================================================
function initDiscoveryCatalog() {
  renderExamsGrid(EXAMORA_DATA.exams);
}

function setCategoryFilter(category) {
  state.categoryFilter = category;
  document.querySelectorAll('#category-pills .filter-pill').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.trim().toLowerCase().includes(category.toLowerCase()) || 
       (category === 'all' && btn.textContent.includes('All'))) {
      btn.classList.add('active');
    }
  });
  filterExams();
}

function filterExams() {
  const searchInput = document.getElementById('exam-search-input');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  const filtered = EXAMORA_DATA.exams.filter(exam => {
    const matchCat = state.categoryFilter === 'all' || exam.category.toLowerCase() === state.categoryFilter.toLowerCase();
    const matchSearch = exam.title.toLowerCase().includes(query) || 
                        exam.description.toLowerCase().includes(query) ||
                        exam.tags.some(t => t.toLowerCase().includes(query));
    return matchCat && matchSearch;
  });

  renderExamsGrid(filtered);
}

function renderExamsGrid(examsList) {
  const container = document.getElementById('exams-container');
  if (!container) return;

  if (examsList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem; font-weight: 600;">No examinations match your criteria.</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Try clearing your search query or selecting "All Domains".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = examsList.map(exam => `
    <div class="exam-card">
      <div class="exam-card-top">
        <div class="exam-card-icon">${exam.icon}</div>
        <span class="badge ${exam.badgeClass}">${exam.difficulty}</span>
      </div>
      <h3 class="exam-card-title">${exam.title}</h3>
      <p class="exam-card-desc">${exam.description}</p>
      
      <div class="exam-card-meta">
        <div class="meta-col">
          <div class="val">${exam.questionsCount}</div>
          <div class="lbl">Questions</div>
        </div>
        <div class="meta-col">
          <div class="val">${exam.durationMins}m</div>
          <div class="lbl">Duration</div>
        </div>
        <div class="meta-col">
          <div class="val">${exam.passPercentage}%</div>
          <div class="lbl">Pass Mark</div>
        </div>
      </div>

      <div class="exam-card-footer">
        <div class="exam-card-tags">
          ${exam.tags.slice(0, 2).map(t => `<span class="tag-badge">${t}</span>`).join('')}
        </div>
        <button class="btn btn-primary btn-sm" onclick="startExam('${exam.id}')">
          <span>Start Exam</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

// Quick launch flagship exam
function startFlagshipExam() {
  startExam('cs-301');
}

// ==========================================================================
// 3. DISTRACTION-FREE EXAMINATION ENGINE
// ==========================================================================
function startExam(examId) {
  const exam = EXAMORA_DATA.exams.find(e => e.id === examId) || EXAMORA_DATA.exams[0];
  state.activeExam = exam;
  state.currentQuestionIndex = 0;
  state.markedQuestions = new Set();
  state.userAnswers = {};

  // Check if we have an auto-saved draft in localStorage for this exam
  const savedDraft = localStorage.getItem(`examora_draft_${exam.id}`);
  if (savedDraft) {
    try {
      const parsed = JSON.parse(savedDraft);
      state.userAnswers = parsed.answers || {};
      state.markedQuestions = new Set(parsed.marked || []);
      state.timerSeconds = parsed.remainingSeconds || exam.durationMins * 60;
      showToast('Restored previous exam progress from local storage ✓', 'info');
    } catch (e) {
      state.timerSeconds = exam.durationMins * 60;
    }
  } else {
    state.timerSeconds = exam.durationMins * 60;
  }

  state.examStartTime = Date.now();

  // Set top bar title
  const titleEl = document.getElementById('arena-exam-title');
  if (titleEl) titleEl.textContent = exam.title;

  // Initialize UI components
  renderPaletteMatrix();
  renderCurrentQuestion();
  updateQuickTally();
  startTimer();

  // Navigate to exam view
  navigateTo('exam');
  showToast(`Exam Started: ${exam.title}`, 'success');
}

function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);

  updateTimerDisplay();

  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    updateTimerDisplay();

    // Auto-save periodically every 10 seconds
    if (state.timerSeconds % 10 === 0) {
      persistExamDraft();
    }

    // Time's up -> auto submit
    if (state.timerSeconds <= 0) {
      clearInterval(state.timerInterval);
      showToast('Time expired! Submitting examination automatically...', 'warning');
      confirmSubmitExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerBox = document.getElementById('arena-timer-box');
  const timerDisplay = document.getElementById('arena-timer-display');
  if (!timerDisplay || !timerBox) return;

  const mins = Math.floor(state.timerSeconds / 60);
  const secs = state.timerSeconds % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  timerDisplay.textContent = formatted;

  // Visual thresholds: Amber (< 5m), Critical Rose (< 1m)
  if (state.timerSeconds <= 60) {
    timerBox.className = 'arena-timer-box critical';
  } else if (state.timerSeconds <= 300) {
    timerBox.className = 'arena-timer-box warning';
  } else {
    timerBox.className = 'arena-timer-box';
  }
}

function renderCurrentQuestion() {
  const qList = EXAMORA_DATA.questionBank;
  const total = qList.length;
  const q = qList[state.currentQuestionIndex];
  if (!q) return;

  // Header & Counters
  const progressBadge = document.getElementById('arena-progress-badge');
  const headerPill = document.getElementById('question-header-pill');
  const catBadge = document.getElementById('question-category-badge');
  const marksBadge = document.getElementById('question-marks-badge');

  if (progressBadge) progressBadge.textContent = `Question ${state.currentQuestionIndex + 1} / ${total}`;
  if (headerPill) headerPill.textContent = `QUESTION ${String(state.currentQuestionIndex + 1).padStart(2, '0')} OF ${String(total).padStart(2, '0')}`;
  if (catBadge) catBadge.textContent = q.category;
  if (marksBadge) marksBadge.textContent = `+${q.marks} Mark`;

  // Question Text
  const textEl = document.getElementById('question-text');
  if (textEl) textEl.textContent = q.question;

  // Code Snippet (if available)
  const codeEl = document.getElementById('question-code-snippet');
  if (codeEl) {
    if (q.codeSnippet) {
      codeEl.style.display = 'block';
      codeEl.textContent = q.codeSnippet;
    } else {
      codeEl.style.display = 'none';
    }
  }

  // Render 4 Options
  const optionsContainer = document.getElementById('options-container');
  const letters = ['A', 'B', 'C', 'D'];
  const currentSelection = state.userAnswers[state.currentQuestionIndex];

  if (optionsContainer) {
    optionsContainer.innerHTML = q.options.map((opt, idx) => `
      <div class="option-item ${currentSelection === idx ? 'selected' : ''}" onclick="selectOption(${idx})">
        <div class="option-key-badge">${letters[idx]}</div>
        <div class="option-text">${opt}</div>
        <span style="font-size:0.75rem; color:var(--text-muted); font-family:'JetBrains Mono',monospace;">[Key ${idx + 1}]</span>
      </div>
    `).join('');
  }

  // Navigation Buttons State
  const prevBtn = document.getElementById('btn-prev-q');
  const nextBtn = document.getElementById('btn-next-q');
  if (prevBtn) prevBtn.disabled = state.currentQuestionIndex === 0;
  if (nextBtn) {
    if (state.currentQuestionIndex === total - 1) {
      nextBtn.innerHTML = `<span>Submit Exam</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
      nextBtn.innerHTML = `<span>Next Question →</span>`;
    }
  }

  // Mark for Review Button State
  const markBtn = document.getElementById('btn-mark-review');
  const markLabel = document.getElementById('mark-btn-label');
  const isMarked = state.markedQuestions.has(state.currentQuestionIndex);
  if (markBtn && markLabel) {
    if (isMarked) {
      markBtn.classList.add('marked');
      markLabel.textContent = 'Marked for Review ✓';
    } else {
      markBtn.classList.remove('marked');
      markLabel.textContent = 'Mark for Review';
    }
  }

  // Update palette active highlight
  updatePaletteStates();
}

function selectOption(optIndex) {
  state.userAnswers[state.currentQuestionIndex] = optIndex;
  renderCurrentQuestion();
  triggerAutoSaveNotice();
  persistExamDraft();
  updateQuickTally();
}

function clearCurrentChoice() {
  delete state.userAnswers[state.currentQuestionIndex];
  renderCurrentQuestion();
  triggerAutoSaveNotice();
  persistExamDraft();
  updateQuickTally();
}

function toggleMarkForReview() {
  const qIdx = state.currentQuestionIndex;
  if (state.markedQuestions.has(qIdx)) {
    state.markedQuestions.delete(qIdx);
  } else {
    state.markedQuestions.add(qIdx);
  }
  renderCurrentQuestion();
  persistExamDraft();
  updateQuickTally();
}

function navigateQuestion(delta) {
  const total = EXAMORA_DATA.questionBank.length;
  const nextIdx = state.currentQuestionIndex + delta;

  if (delta > 0 && state.currentQuestionIndex === total - 1) {
    openSubmitModal();
    return;
  }

  if (nextIdx >= 0 && nextIdx < total) {
    state.currentQuestionIndex = nextIdx;
    renderCurrentQuestion();
  }
}

function jumpToQuestion(idx) {
  const total = EXAMORA_DATA.questionBank.length;
  if (idx >= 0 && idx < total) {
    state.currentQuestionIndex = idx;
    renderCurrentQuestion();
  }
}

// Question Palette Rendering
function renderPaletteMatrix() {
  const matrix = document.getElementById('palette-matrix');
  if (!matrix) return;

  const total = EXAMORA_DATA.questionBank.length;
  let html = '';

  for (let i = 0; i < total; i++) {
    const num = String(i + 1).padStart(2, '0');
    html += `<button class="palette-btn" id="pal-btn-${i}" onclick="jumpToQuestion(${i})">${num}</button>`;
  }

  matrix.innerHTML = html;
  updatePaletteStates();
}

function updatePaletteStates() {
  const total = EXAMORA_DATA.questionBank.length;

  for (let i = 0; i < total; i++) {
    const btn = document.getElementById(`pal-btn-${i}`);
    if (!btn) continue;

    btn.className = 'palette-btn';

    const isAnswered = state.userAnswers.hasOwnProperty(i);
    const isMarked = state.markedQuestions.has(i);
    const isCurrent = i === state.currentQuestionIndex;

    if (isAnswered) btn.classList.add('completed');
    if (isMarked) btn.classList.add('marked');
    if (isCurrent) btn.classList.add('current');
  }
}

function updateQuickTally() {
  const total = EXAMORA_DATA.questionBank.length;
  const answered = Object.keys(state.userAnswers).length;
  const marked = state.markedQuestions.size;
  const unanswered = total - answered;

  const elA = document.getElementById('quick-answered');
  const elM = document.getElementById('quick-marked');
  const elU = document.getElementById('quick-remaining');

  const tallyA = document.getElementById('tally-answered-count');
  const tallyM = document.getElementById('tally-marked-count');
  const tallyU = document.getElementById('tally-unanswered-count');

  if (elA) elA.textContent = answered;
  if (elM) elM.textContent = marked;
  if (elU) elU.textContent = unanswered;

  if (tallyA) tallyA.textContent = answered;
  if (tallyM) tallyM.textContent = marked;
  if (tallyU) tallyU.textContent = unanswered;
}

// Auto-Save System
function triggerAutoSaveNotice() {
  const indicator = document.getElementById('autosave-indicator');
  const text = document.getElementById('autosave-text');
  if (!indicator || !text) return;

  indicator.classList.add('saving');
  text.textContent = 'Saving...';

  setTimeout(() => {
    indicator.classList.remove('saving');
    text.textContent = 'Saved ✓';
  }, 400);
}

function persistExamDraft() {
  if (!state.activeExam) return;
  const payload = {
    examId: state.activeExam.id,
    answers: state.userAnswers,
    marked: Array.from(state.markedQuestions),
    remainingSeconds: state.timerSeconds,
    timestamp: Date.now()
  };
  localStorage.setItem(`examora_draft_${state.activeExam.id}`, JSON.stringify(payload));
}

// Keyboard Navigation Support
function initKeyboardListeners() {
  document.addEventListener('keydown', (e) => {
    // Only capture when on exam view and not typing in an input
    if (state.currentView !== 'exam') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Numbers 1, 2, 3, 4 for options
    if (e.key >= '1' && e.key <= '4') {
      const optIdx = parseInt(e.key) - 1;
      selectOption(optIdx);
    }
    // Key 'a', 'b', 'c', 'd'
    const char = e.key.toLowerCase();
    if (['a', 'b', 'c', 'd'].includes(char)) {
      const map = { a: 0, b: 1, c: 2, d: 3 };
      selectOption(map[char]);
    }
    // 'm' for mark for review
    if (char === 'm') {
      toggleMarkForReview();
    }
    // Arrow Left / Right
    if (e.key === 'ArrowRight') {
      navigateQuestion(1);
    } else if (e.key === 'ArrowLeft') {
      navigateQuestion(-1);
    }
  });
}

// ==========================================================================
// 4. SUBMISSION CONFIRMATION & EVALUATION
// ==========================================================================
function openSubmitModal() {
  const total = EXAMORA_DATA.questionBank.length;
  const answered = Object.keys(state.userAnswers).length;
  const marked = state.markedQuestions.size;
  const unanswered = total - answered;

  const modalA = document.getElementById('modal-answered-val');
  const modalU = document.getElementById('modal-unanswered-val');
  const modalM = document.getElementById('modal-marked-val');

  if (modalA) modalA.textContent = answered;
  if (modalU) modalU.textContent = unanswered;
  if (modalM) modalM.textContent = marked;

  const modal = document.getElementById('submit-confirm-modal');
  if (modal) modal.classList.add('active');
}

function closeSubmitModal() {
  const modal = document.getElementById('submit-confirm-modal');
  if (modal) modal.classList.remove('active');
}

function confirmSubmitExam() {
  closeSubmitModal();
  if (state.timerInterval) clearInterval(state.timerInterval);

  // Clear draft persistence
  if (state.activeExam) {
    localStorage.removeItem(`examora_draft_${state.activeExam.id}`);
  }

  // Calculate Evaluation Results
  const bank = EXAMORA_DATA.questionBank;
  const total = bank.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let earnedMarks = 0;

  bank.forEach((q, idx) => {
    if (state.userAnswers.hasOwnProperty(idx)) {
      if (state.userAnswers[idx] === q.correct) {
        correctCount++;
        earnedMarks += q.marks;
      } else {
        incorrectCount++;
      }
    } else {
      unansweredCount++;
    }
  });

  const scorePct = Math.round((earnedMarks / total) * 100);
  const timeElapsedSec = (state.activeExam.durationMins * 60) - state.timerSeconds;
  const elapsedMins = Math.floor(Math.max(timeElapsedSec, 0) / 60);
  const elapsedSecs = Math.max(timeElapsedSec, 0) % 60;
  const timeString = `${elapsedMins}m ${String(elapsedSecs).padStart(2, '0')}s`;

  state.lastResult = {
    examTitle: state.activeExam.title,
    scorePercent: scorePct,
    correct: correctCount,
    incorrect: incorrectCount,
    unanswered: unansweredCount,
    earnedMarks: earnedMarks,
    totalMarks: total,
    timeSpent: timeString,
    passed: scorePct >= state.activeExam.passPercentage
  };

  // Switch to result screen
  navigateTo('result');
  renderResultScreen();
  showToast('✓ Examination submitted and scored successfully!', 'success');
}

// ==========================================================================
// 5. RESULT & EXPLANATION EXPERIENCE
// ==========================================================================
function renderResultScreen() {
  const res = state.lastResult;
  if (!res) return;

  // Title & Status Badge
  const titleEl = document.getElementById('result-exam-title');
  const badgeEl = document.getElementById('result-status-badge');
  if (titleEl) titleEl.textContent = res.examTitle;

  if (badgeEl) {
    if (res.scorePercent >= 90) {
      badgeEl.textContent = 'EXCELLENT PERFORMANCE';
      badgeEl.style.background = 'rgba(16, 185, 129, 0.15)';
      badgeEl.style.color = '#34D399';
      badgeEl.style.borderColor = 'rgba(16, 185, 129, 0.35)';
    } else if (res.scorePercent >= 70) {
      badgeEl.textContent = 'QUALIFIED — STRONG PASS';
      badgeEl.style.background = 'rgba(99, 102, 241, 0.15)';
      badgeEl.style.color = '#818CF8';
      badgeEl.style.borderColor = 'rgba(99, 102, 241, 0.35)';
    } else {
      badgeEl.textContent = 'NEEDS IMPROVEMENT';
      badgeEl.style.background = 'rgba(244, 63, 94, 0.15)';
      badgeEl.style.color = '#FB7185';
      badgeEl.style.borderColor = 'rgba(244, 63, 94, 0.35)';
    }
  }

  // Animated Circular SVG Score Gauge
  const scoreNum = document.getElementById('result-score-percent');
  const circle = document.getElementById('result-gauge-circle');
  if (scoreNum) scoreNum.textContent = `${res.scorePercent}%`;

  if (circle) {
    const circumference = 440; // 2 * PI * 70
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    setTimeout(() => {
      const offset = circumference - (circumference * res.scorePercent) / 100;
      circle.style.strokeDashoffset = offset;
    }, 150);
  }

  // Metric Stat Cards
  const cEl = document.getElementById('res-stat-correct');
  const iEl = document.getElementById('res-stat-incorrect');
  const uEl = document.getElementById('res-stat-unanswered');
  const mEl = document.getElementById('res-stat-marks');
  const tEl = document.getElementById('res-stat-time');

  if (cEl) cEl.textContent = res.correct;
  if (iEl) iEl.textContent = res.incorrect;
  if (uEl) uEl.textContent = res.unanswered;
  if (mEl) mEl.textContent = `${res.earnedMarks} / ${res.totalMarks}`;
  if (tEl) tEl.textContent = res.timeSpent;

  // Render Detailed Review Items
  renderReviewItemsList('all');
}

function filterReviewList(filter) {
  state.reviewFilter = filter;
  document.querySelectorAll('#review-filter-pills .filter-pill').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(filter)) {
      btn.classList.add('active');
    }
  });
  renderReviewItemsList(filter);
}

function renderReviewItemsList(filter) {
  const container = document.getElementById('review-items-list');
  if (!container) return;

  const bank = EXAMORA_DATA.questionBank;
  const letters = ['A', 'B', 'C', 'D'];

  const filteredItems = bank.map((q, idx) => {
    const userChoice = state.userAnswers[idx];
    const isAnswered = userChoice !== undefined;
    const isCorrect = isAnswered && userChoice === q.correct;
    return { q, idx, userChoice, isAnswered, isCorrect };
  }).filter(item => {
    if (filter === 'correct') return item.isCorrect;
    if (filter === 'incorrect') return item.isAnswered && !item.isCorrect;
    return true; // 'all'
  });

  if (filteredItems.length === 0) {
    container.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-muted);">No questions match this filter.</div>`;
    return;
  }

  container.innerHTML = filteredItems.map(item => {
    const { q, idx, userChoice, isAnswered, isCorrect } = item;
    const statusClass = !isAnswered ? 'unanswered' : (isCorrect ? 'correct' : 'incorrect');
    const statusLabel = !isAnswered ? 'Unanswered' : (isCorrect ? 'Correct ✓' : 'Incorrect ✕');
    const statusBadgeClass = !isAnswered ? 'badge-warning' : (isCorrect ? 'badge-success' : 'badge-danger');

    return `
      <div class="review-item ${statusClass}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <span style="font-weight:700; font-size:0.9rem; color:var(--text-secondary);">QUESTION ${idx + 1} OF ${bank.length}</span>
          <span class="badge ${statusBadgeClass}">${statusLabel}</span>
        </div>
        <h4 style="font-size:1.15rem; margin-bottom:1rem;">${q.question}</h4>
        ${q.codeSnippet ? `<pre class="question-code-block">${q.codeSnippet}</pre>` : ''}

        <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem;">
          ${q.options.map((opt, optIdx) => {
            const isUserSelection = userChoice === optIdx;
            const isTrueCorrect = q.correct === optIdx;
            let optStyle = 'background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle);';
            let labelTag = '';

            if (isTrueCorrect) {
              optStyle = 'background:rgba(16,185,129,0.12); border:1px solid #10B981; color:#34D399;';
              labelTag = `<span class="badge badge-success" style="margin-left:auto;">Correct Answer</span>`;
            } else if (isUserSelection && !isCorrect) {
              optStyle = 'background:rgba(244,63,94,0.12); border:1px solid #F43F5E; color:#FB7185;';
              labelTag = `<span class="badge badge-danger" style="margin-left:auto;">Your Selection</span>`;
            }

            return `
              <div style="padding:0.75rem 1rem; border-radius:var(--radius-xs); display:flex; align-items:center; gap:0.75rem; ${optStyle}">
                <span style="font-weight:700; font-family:'JetBrains Mono',monospace;">${letters[optIdx]}.</span>
                <span>${opt}</span>
                ${labelTag}
              </div>
            `;
          }).join('')}
        </div>

        <div class="review-explanation">
          <strong style="color:#A5B4FC; display:block; margin-bottom:0.25rem;">Academic Explanation:</strong>
          <span>${q.explanation}</span>
        </div>
      </div>
    `;
  }).join('');
}

function scrollToReview() {
  const el = document.getElementById('review-container-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================================================
// 6. STUDENT DASHBOARD & PERFORMANCE DATA
// ==========================================================================
function initStudentDashboard() {
  renderStudentResultsTable();
  renderSubjectMasteryBars();
}

function renderStudentResultsTable() {
  const tableBody = document.querySelector('#student-results-table tbody');
  if (!tableBody) return;

  const results = EXAMORA_DATA.users.student.recentResults;
  tableBody.innerHTML = results.map(r => `
    <tr>
      <td style="font-weight:600;">${r.title}</td>
      <td><span style="font-weight:700; color:#818CF8;">${r.score}%</span></td>
      <td>${r.marks}</td>
      <td><span class="badge badge-success">${r.status}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="startExam('${r.examId}')">Retake</button>
      </td>
    </tr>
  `).join('');
}

function renderSubjectMasteryBars() {
  const container = document.getElementById('subject-mastery-container');
  if (!container) return;

  const list = EXAMORA_DATA.users.student.subjectMastery;
  container.innerHTML = list.map(item => `
    <div class="mastery-row">
      <div class="mastery-meta">
        <span>${item.subject}</span>
        <span style="color:${item.color};">${item.percentage}%</span>
      </div>
      <div class="mastery-track">
        <div class="mastery-fill" style="width:${item.percentage}%; background:${item.color};"></div>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// 7. ADVANCED ANALYTICS CHARTS (PURE HIGH-DPI HTML5 CANVAS)
// ==========================================================================
function renderAnalyticsCharts() {
  drawScoreTrendChart();
  drawAccuracyDonutChart();
  drawWeeklyActivityChart();
}

function drawScoreTrendChart() {
  const canvas = document.getElementById('trendChartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  const data = EXAMORA_DATA.analyticsData.monthlyTrend;
  const padding = { top: 30, right: 30, bottom: 40, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  // Grid Lines & Y-labels
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'right';

  for (let yVal = 70; yVal <= 100; yVal += 10) {
    const y = padding.top + graphHeight - ((yVal - 70) / 30) * graphHeight;
    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(`${yVal}%`, padding.left - 8, y + 4);
  }

  // Points coords
  const points = data.map((d, idx) => {
    const x = padding.left + (idx / (data.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - ((d.score - 70) / 30) * graphHeight;
    return { x, y, score: d.score, label: d.month };
  });

  // Area Fill under line
  const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + graphHeight);
  grad.addColorStop(0, 'rgba(99, 102, 241, 0.35)');
  grad.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = (prev.x + curr.x) / 2;
    ctx.bezierCurveTo(cpX, prev.y, cpX, curr.y, curr.x, curr.y);
  }
  ctx.lineTo(points[points.length - 1].x, padding.top + graphHeight);
  ctx.lineTo(points[0].x, padding.top + graphHeight);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw Smooth Trend Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = (prev.x + curr.x) / 2;
    ctx.bezierCurveTo(cpX, prev.y, cpX, curr.y, curr.x, curr.y);
  }
  ctx.strokeStyle = '#6366F1';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Draw Dots & X Labels
  points.forEach(pt => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = textColor;
    ctx.fillText(pt.label, pt.x, height - 12);
  });
}

function drawAccuracyDonutChart() {
  const canvas = document.getElementById('donutChartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  const data = EXAMORA_DATA.analyticsData.scoreDistribution;
  const total = data.reduce((acc, cur) => acc + cur.count, 0);

  const centerX = width * 0.38;
  const centerY = height / 2;
  const outerRadius = Math.min(centerX, centerY) - 15;
  const innerRadius = outerRadius * 0.65;

  let startAngle = -Math.PI / 2;

  data.forEach(slice => {
    const sliceAngle = (slice.count / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    startAngle += sliceAngle;
  });

  // Center Score Label
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 20px "Outfit", sans-serif';
  ctx.fillStyle = state.theme === 'dark' ? '#F8FAFC' : '#0F172A';
  ctx.fillText('94%', centerX, centerY - 8);

  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('Avg Mastery', centerX, centerY + 12);

  // Legend on Right
  const legendX = width * 0.68;
  let legendY = 40;

  ctx.textAlign = 'left';
  ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';

  data.forEach(item => {
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(legendX, legendY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = state.theme === 'dark' ? '#F8FAFC' : '#0F172A';
    ctx.fillText(`${item.label}`, legendX + 12, legendY + 4);
    legendY += 24;
  });
}

function drawWeeklyActivityChart() {
  const canvas = document.getElementById('activityChartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  const data = EXAMORA_DATA.analyticsData.weeklyActivity;
  const padding = { top: 20, right: 20, bottom: 30, left: 30 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;
  const colWidth = (graphWidth / data.length) * 0.45;

  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94A3B8' : '#64748B';

  data.forEach((d, idx) => {
    const x = padding.left + (idx + 0.5) * (graphWidth / data.length) - colWidth / 2;
    const barH = (d.count / 10) * graphHeight;
    const y = padding.top + graphHeight - barH;

    // Gradient bar
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, '#06B6D4');
    grad.addColorStop(1, '#6366F1');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, colWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Day Label
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(d.day, x + colWidth / 2, height - 10);
  });
}

// ==========================================================================
// 8. ELITE LEADERBOARD
// ==========================================================================
function initLeaderboard() {
  renderLeaderboard('weekly');
}

function setLeaderboardFilter(timeframe) {
  state.leaderboardTimeframe = timeframe;
  document.querySelectorAll('#leaderboard-filter-pills .filter-pill').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(timeframe.toLowerCase())) {
      btn.classList.add('active');
    }
  });
  renderLeaderboard(timeframe);
}

function renderLeaderboard(timeframe) {
  const list = EXAMORA_DATA.leaderboard[timeframe] || EXAMORA_DATA.leaderboard.weekly;
  renderPodium(list.slice(0, 3));
  renderLeaderboardTable(list.slice(3));
}

function renderPodium(top3) {
  const container = document.getElementById('podium-container');
  if (!container || top3.length < 3) return;

  // Ordering for physical podium: 2nd place on left, 1st place center, 3rd place right
  const [first, second, third] = top3;

  container.innerHTML = `
    <!-- Rank 2 (Silver) -->
    <div class="podium-card rank-2">
      <div class="podium-badge">2</div>
      <div class="podium-avatar" style="background:${second.avatarColor};">${second.avatar}</div>
      <h3 class="podium-name">${second.name}</h3>
      <div class="podium-institution">${second.institution}</div>
      <div class="podium-score text-gradient">${second.score}%</div>
      <div class="podium-points">${second.points.toLocaleString()} Points • 🔥 ${second.streak}d</div>
    </div>

    <!-- Rank 1 (Gold, Center Elevated) -->
    <div class="podium-card rank-1">
      <div class="podium-badge">👑 1</div>
      <div class="podium-avatar" style="background:${first.avatarColor}; width:86px; height:86px; font-size:1.8rem;">${first.avatar}</div>
      <h3 class="podium-name" style="font-size:1.4rem;">${first.name}</h3>
      <div class="podium-institution">${first.institution}</div>
      <div class="podium-score" style="color:#F59E0B;">${first.score}%</div>
      <div class="podium-points">${first.points.toLocaleString()} Points • 🔥 ${first.streak}d streak</div>
    </div>

    <!-- Rank 3 (Bronze) -->
    <div class="podium-card rank-3">
      <div class="podium-badge">3</div>
      <div class="podium-avatar" style="background:${third.avatarColor};">${third.avatar}</div>
      <h3 class="podium-name">${third.name}</h3>
      <div class="podium-institution">${third.institution}</div>
      <div class="podium-score text-gradient-cyan">${third.score}%</div>
      <div class="podium-points">${third.points.toLocaleString()} Points • 🔥 ${third.streak}d</div>
    </div>
  `;
}

function renderLeaderboardTable(restList) {
  const tbody = document.querySelector('#leaderboard-table tbody');
  if (!tbody) return;

  if (restList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No additional candidates listed in this tier.</td></tr>`;
    return;
  }

  tbody.innerHTML = restList.map(item => `
    <tr>
      <td style="font-weight:700; font-family:'JetBrains Mono',monospace;">#${item.rank}</td>
      <td style="font-weight:600;">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <div style="width:32px; height:32px; border-radius:50%; background:${item.avatarColor}; display:flex; align-items:center; justify-content:center; color:#FFF; font-weight:700; font-size:0.8rem;">
            ${item.avatar}
          </div>
          <span>${item.name}</span>
          <span class="badge badge-primary" style="font-size:0.65rem;">${item.badge}</span>
        </div>
      </td>
      <td style="color:var(--text-secondary);">${item.institution}</td>
      <td><span style="font-weight:700; color:var(--success);">${item.score}%</span></td>
      <td>${item.points.toLocaleString()}</td>
      <td>🔥 ${item.streak} days</td>
    </tr>
  `).join('');
}

// ==========================================================================
// 9. ADMIN COMMAND CENTER & CRUD
// ==========================================================================
function initAdminCenter() {
  renderAdminExamsTable();
  renderAdminStudentsTable();
}

function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');

  const btn = document.getElementById(`tab-btn-${tabName}`);
  const content = document.getElementById(`admin-tab-${tabName}`);
  if (btn) btn.classList.add('active');
  if (content) content.style.display = 'block';
}

function renderAdminExamsTable() {
  const tbody = document.querySelector('#admin-exams-table tbody');
  const countEl = document.getElementById('admin-exams-count');
  if (countEl) countEl.textContent = EXAMORA_DATA.exams.length;
  if (!tbody) return;

  tbody.innerHTML = EXAMORA_DATA.exams.map(e => `
    <tr>
      <td style="font-weight:600;">${e.title}</td>
      <td>${e.category}</td>
      <td>${e.durationMins} mins</td>
      <td>${e.questionsCount}</td>
      <td><span class="badge badge-success">Published</span></td>
    </tr>
  `).join('');
}

function handleCreateExam(e) {
  e.preventDefault();
  const title = document.getElementById('new-exam-title').value.trim();
  const category = document.getElementById('new-exam-category').value;
  const difficulty = document.getElementById('new-exam-difficulty').value;
  const durationMins = parseInt(document.getElementById('new-exam-duration').value);
  const passPercentage = parseInt(document.getElementById('new-exam-pass').value);
  const description = document.getElementById('new-exam-desc').value.trim();

  const newExam = {
    id: `exam-${Date.now()}`,
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-'),
    category,
    difficulty,
    badgeClass: difficulty === 'Hard' ? 'badge-hard' : 'badge-intermediate',
    durationMins,
    questionsCount: 20,
    totalMarks: 20,
    passPercentage,
    rating: 5.0,
    attempts: 0,
    featured: false,
    description,
    tags: [category, difficulty],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`
  };

  EXAMORA_DATA.exams.unshift(newExam);
  renderAdminExamsTable();
  renderExamsGrid(EXAMORA_DATA.exams);
  e.target.reset();
  showToast(`✓ Examination "${title}" published to catalog!`, 'success');
}

function handleCreateQuestion(e) {
  e.preventDefault();
  const text = document.getElementById('new-q-text').value.trim();
  const opt0 = document.getElementById('new-q-opt-0').value.trim();
  const opt1 = document.getElementById('new-q-opt-1').value.trim();
  const opt2 = document.getElementById('new-q-opt-2').value.trim();
  const opt3 = document.getElementById('new-q-opt-3').value.trim();
  const correct = parseInt(document.getElementById('new-q-correct').value);
  const difficulty = document.getElementById('new-q-difficulty').value;
  const explanation = document.getElementById('new-q-explanation').value.trim();

  const newQ = {
    id: EXAMORA_DATA.questionBank.length + 1,
    question: text,
    codeSnippet: null,
    options: [opt0, opt1, opt2, opt3],
    correct: correct,
    explanation: explanation,
    category: "Computer Science",
    difficulty: difficulty,
    marks: 1
  };

  EXAMORA_DATA.questionBank.push(newQ);
  const qCount = document.getElementById('admin-questions-count');
  if (qCount) qCount.textContent = EXAMORA_DATA.questionBank.length;

  e.target.reset();
  showToast('✓ MCQ question registered into master question bank!', 'success');
}

function renderAdminStudentsTable(filterQuery = '') {
  const tbody = document.querySelector('#admin-students-table tbody');
  if (!tbody) return;

  const students = EXAMORA_DATA.students.filter(s => {
    return s.name.toLowerCase().includes(filterQuery) || s.email.toLowerCase().includes(filterQuery);
  });

  tbody.innerHTML = students.map(s => `
    <tr>
      <td style="font-weight:600;">${s.name}</td>
      <td style="color:var(--text-secondary);">${s.email}</td>
      <td>${s.registered}</td>
      <td>${s.examsTaken}</td>
      <td><span style="font-weight:700; color:var(--success);">${s.avgScore}%</span></td>
      <td>
        <span class="badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}">${s.status}</span>
      </td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="toggleStudentStatus('${s.id}')">
          ${s.status === 'Active' ? 'Suspend' : 'Activate'}
        </button>
      </td>
    </tr>
  `).join('');
}

function filterAdminStudents() {
  const q = document.getElementById('admin-student-search').value.toLowerCase().trim();
  renderAdminStudentsTable(q);
}

function toggleStudentStatus(studentId) {
  const student = EXAMORA_DATA.students.find(s => s.id === studentId);
  if (student) {
    student.status = student.status === 'Active' ? 'Suspended' : 'Active';
    renderAdminStudentsTable();
    showToast(`Student status updated for ${student.name}`, 'info');
  }
}

// ==========================================================================
// 10. TOAST NOTIFICATION SYSTEM
// ==========================================================================
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✓';
  if (type === 'warning') icon = '⚠️';
  if (type === 'danger') icon = '✕';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}
