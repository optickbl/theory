/* Theory: Greek driving theory trainer (category B). Plain JS, no build step. */
(() => {
  'use strict';

  /* ---------------- storage ---------------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('theory.' + k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem('theory.' + k, JSON.stringify(v)); } catch (_) {} },
    del(k) { try { localStorage.removeItem('theory.' + k); } catch (_) {} }
  };

  /* ---------------- strings ---------------- */
  const S = {
    en: {
      app: 'Theory', sub: 'Driving theory · Category B',
      readiness: 'Exam readiness', mastered: '{n} of {t} questions mastered',
      answeredN: '{n} answered so far', mocksLabel: 'Last 5 mock exams', noMocks: 'No mock exams yet',
      passedOf: '{p} of {n} passed',
      start: 'Start mock exam', startMeta: '30 questions · 35 min',
      resume: 'Continue your mock exam', resumeLeft: '{m} min left',
      signs: 'Signs', signsSub: '{n} sign & marking questions',
      topics: 'Topics', topicsSub: '{n} topics',
      mistakes: 'Mistakes', mistakesSub: '{n} to review', mistakesNone: 'None to review',
      all: 'All questions', allSub: 'Smart practice, all {n}',
      lastMock: 'Last mock', foot: 'Questions, answers and pictures come from the Ministry of Transport’s TestDrive question bank. Some rules have changed since it was written; those questions show a “Rule update” note.',
      q: 'Question {n} of {t}', prev: 'Previous', next: 'Next', finish: 'Finish',
      finishTitle: 'Finish the exam?', finishUn: 'You have {n} unanswered. They count as mistakes.', finishAll: 'All 30 answered.',
      finishGo: 'Finish and see result', keepGoing: 'Keep going',
      quitTitle: 'Quit this exam?', quitText: 'Your answers will be lost.', quitGo: 'Quit exam',
      grid: 'Questions', answered: 'Answered', current: 'Current',
      timeUp: 'Time’s up',
      pass: 'Passed', fail: 'Failed', scoreLine: 'You need 29 of 30 to pass.',
      sMistakes: 'Mistakes', sBlank: 'Unanswered', sTime: 'Time',
      reviewWrong: 'Your mistakes', reviewAll: 'Show all 30 questions', reviewWrongOnly: 'Show mistakes only', noWrong: 'No mistakes. Clean sheet.',
      yours: 'Yours', correct: 'Correct', blank: 'No answer',
      newMock: 'New mock exam', home: 'Home',
      right: 'Correct', wrong: 'Wrong', note: 'Rule update', cont: 'Next question',
      sessionStat: '{r} of {n} right', masteredOf: '{m}/{t} mastered',
      topicsTitle: 'Practice by topic', topicsText: 'Answers are checked as you go. Questions you get wrong come back until you get them right twice.',
      signsTitle: 'Signs & markings', signsText: 'Every sign and road-marking question in the bank. About 10 of the 30 exam questions come from here.',
      cards: 'Flashcards', cardsSub: 'See the sign, recall the meaning', quiz: 'Quiz', quizSub: 'Exam-style questions',
      allSigns: 'All signs', tapReveal: 'Tap to see the answer', answer: 'Answer',
      knew: 'I knew it', didnt: 'Didn’t know',
      mistakesTitle: 'Your mistakes', mistakesText: 'Every question you’ve got wrong. Get each one right twice in a row to clear it.',
      cleared: 'All cleared', clearedText: 'No mistakes left to review.',
      allTitle: 'All questions', back: 'Back', done: 'Done',
      mins: '{m} min', kAnswered: 'Answered', kMocks: 'Mocks passed', study: 'Study', recent: 'Recent mock exams'
    },
    el: {
      app: 'Θεωρία', sub: 'Θεωρία οδήγησης · Κατηγορία Β',
      readiness: 'Ετοιμότητα', mastered: '{n} από {t} ερωτήσεις κατακτημένες',
      answeredN: '{n} απαντημένες μέχρι τώρα', mocksLabel: 'Τελευταίες 5 δοκιμαστικές', noMocks: 'Καμία δοκιμαστική ακόμα',
      passedOf: '{p} από {n} επιτυχίες',
      start: 'Δοκιμαστική εξέταση', startMeta: '30 ερωτήσεις · 35 λεπτά',
      resume: 'Συνέχεια δοκιμαστικής', resumeLeft: 'απομένουν {m} λεπτά',
      signs: 'Σήματα', signsSub: '{n} ερωτήσεις σήμανσης',
      topics: 'Ενότητες', topicsSub: '{n} ενότητες',
      mistakes: 'Λάθη', mistakesSub: '{n} για επανάληψη', mistakesNone: 'Κανένα για επανάληψη',
      all: 'Όλες οι ερωτήσεις', allSub: 'Έξυπνη εξάσκηση, και οι {n}',
      lastMock: 'Τελευταία δοκιμαστική', foot: 'Οι ερωτήσεις, οι απαντήσεις και οι εικόνες προέρχονται από την τράπεζα ερωτήσεων TestDrive του Υπουργείου Μεταφορών. Ορισμένοι κανόνες έχουν αλλάξει από τότε· αυτές οι ερωτήσεις έχουν σημείωση «Αλλαγή κανόνα».',
      q: 'Ερώτηση {n} από {t}', prev: 'Προηγούμενη', next: 'Επόμενη', finish: 'Τέλος',
      finishTitle: 'Ολοκλήρωση εξέτασης;', finishUn: 'Έχετε {n} αναπάντητες. Μετράνε ως λάθη.', finishAll: 'Απαντήσατε και τις 30.',
      finishGo: 'Ολοκλήρωση και αποτέλεσμα', keepGoing: 'Συνέχεια',
      quitTitle: 'Έξοδος από την εξέταση;', quitText: 'Οι απαντήσεις σας θα χαθούν.', quitGo: 'Έξοδος',
      grid: 'Ερωτήσεις', answered: 'Απαντημένη', current: 'Τρέχουσα',
      timeUp: 'Ο χρόνος έληξε',
      pass: 'Επιτυχία', fail: 'Αποτυχία', scoreLine: 'Χρειάζεστε 29 στις 30 για επιτυχία.',
      sMistakes: 'Λάθη', sBlank: 'Αναπάντητες', sTime: 'Χρόνος',
      reviewWrong: 'Τα λάθη σας', reviewAll: 'Όλες οι 30 ερωτήσεις', reviewWrongOnly: 'Μόνο τα λάθη', noWrong: 'Κανένα λάθος. Τέλεια.',
      yours: 'Δική σας', correct: 'Σωστή', blank: 'Χωρίς απάντηση',
      newMock: 'Νέα δοκιμαστική', home: 'Αρχική',
      right: 'Σωστό', wrong: 'Λάθος', note: 'Αλλαγή κανόνα', cont: 'Επόμενη ερώτηση',
      sessionStat: '{r} από {n} σωστές', masteredOf: '{m}/{t} κατακτημένες',
      topicsTitle: 'Εξάσκηση ανά ενότητα', topicsText: 'Η απάντηση ελέγχεται αμέσως. Όσες κάνετε λάθος επανέρχονται μέχρι να τις απαντήσετε σωστά δύο φορές.',
      signsTitle: 'Σήματα και διαγραμμίσεις', signsText: 'Όλες οι ερωτήσεις σημάτων και διαγραμμίσεων της τράπεζας. Περίπου 10 από τις 30 ερωτήσεις της εξέτασης είναι από εδώ.',
      cards: 'Κάρτες', cardsSub: 'Δείτε το σήμα, θυμηθείτε τη σημασία', quiz: 'Κουίζ', quizSub: 'Ερωτήσεις όπως στην εξέταση',
      allSigns: 'Όλα τα σήματα', tapReveal: 'Πατήστε για την απάντηση', answer: 'Απάντηση',
      knew: 'Το ήξερα', didnt: 'Δεν το ήξερα',
      mistakesTitle: 'Τα λάθη σας', mistakesText: 'Όσες ερωτήσεις έχετε κάνει λάθος. Απαντήστε σωστά δύο φορές στη σειρά για να φύγουν.',
      cleared: 'Όλα καθαρά', clearedText: 'Δεν έχουν μείνει λάθη για επανάληψη.',
      allTitle: 'Όλες οι ερωτήσεις', back: 'Πίσω', done: 'Τέλος',
      mins: '{m} λεπτά', kAnswered: 'Απαντημένες', kMocks: 'Επιτυχίες', study: 'Μελέτη', recent: 'Πρόσφατες δοκιμαστικές'
    }
  };
  let lang = store.get('lang', 'en');
  const t = (k, v) => String(S[lang][k] || S.en[k] || k).replace(/\{(\w+)\}/g, (_, x) => (v && v[x] != null ? v[x] : ''));
  const KEYS = { en: 'ABCD', el: 'ΑΒΓΔ' };

  /* ---------------- helpers ---------------- */
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const view = document.getElementById('view');
  const sheet = document.getElementById('sheet');
  const toastEl = document.getElementById('toast');
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function toast(m) { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('show'), 1700); }
  const mmss = (s) => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

  const I = {
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16.5V13l1.8-4.6A2 2 0 0 1 7.7 7h8.6a2 2 0 0 1 1.9 1.4L20 13v3.5"/><path d="M3.5 13h17"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    sign: '<svg viewBox="0 0 24 24"><path d="M12 3.5l9 15.5H3z"/><path d="M12 10v4"/><path d="M12 16.8v.1"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="4.5" cy="6.5" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="17.5" r="1"/></svg>',
    redo: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.6"/><path d="M4 4v4.5h4.5"/></svg>',
    stack: '<svg viewBox="0 0 24 24"><path d="M12 3.5l8.5 4.5L12 12.5 3.5 8z"/><path d="M3.5 12.5L12 17l8.5-4.5"/><path d="M3.5 16.5L12 21l8.5-4.5"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>'
  };

  /* ---------------- data + progress ---------------- */
  let bank = null, byId = new Map();
  const stats = () => store.get('stats', {});
  function record(id, ok) {
    const s = stats();
    const e = s[id] || { s: 0, r: 0, w: 0, k: 0, t: 0 };
    e.s++; if (ok) { e.r++; e.k++; } else { e.w++; e.k = 0; }
    e.t = Date.now();
    s[id] = e; store.set('stats', s);
  }
  const isMastered = (e) => e && e.k >= 2;
  const isMistake = (e) => e && e.w > 0 && e.k < 2;

  function priority(ids) {
    const s = stats();
    const unseen = [], weak = [], rest = [];
    ids.forEach((id) => {
      const e = s[id];
      if (!e) unseen.push(id);
      else if (e.k < 2) weak.push(id);
      else rest.push(id);
    });
    shuffle(unseen); shuffle(weak);
    rest.sort((a, b) => (s[a].k - s[b].k) || (s[a].t - s[b].t));
    return weak.concat(unseen, rest);
  }

  /* ---------------- routing ---------------- */
  let timers = [];
  const clearTimers = () => { timers.forEach(clearInterval); timers = []; };
  let session = null; // practice/flashcard session kept in memory

  function go(hash, replace) {
    if (replace) { history.replaceState(null, '', hash); route(); } else location.hash = hash;
  }
  function mount(html, anim = true) {
    view.innerHTML = html;
    if (anim) { view.classList.remove('enter'); void view.offsetWidth; view.classList.add('enter'); }
    window.scrollTo(0, 0);
  }

  function route() {
    clearTimers(); closeSheet();
    if (!bank) return;
    const p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const [a, b, c] = p;
    if (a === 'exam') return renderExam();
    if (a === 'result') return renderResult();
    if (a === 'topics') return renderTopics();
    if (a === 'practice') return startPractice(b, c);
    if (a === 'signs' && b === 'cards') return startCards(c);
    if (a === 'signs') return renderSigns();
    return renderHome();
  }

  /* ---------------- home ---------------- */
  function renderHome() {
    const s = stats();
    const total = bank.questions.length;
    const mastered = bank.questions.filter((q) => isMastered(s[q.id])).length;
    const seen = Object.keys(s).length;
    const mistakes = bank.questions.filter((q) => isMistake(s[q.id])).length;
    const signN = bank.questions.filter((q) => q.t === 0).length;
    const mocks = store.get('mocks', []);
    const last5 = mocks.slice(-5);
    const pct = total ? Math.round((mastered / total) * 100) : 0;
    const exam = store.get('exam', null);
    const left = exam ? Math.max(0, bank.exam.minutes * 60 - (Date.now() - exam.start) / 1000) : 0;
    const lastRes = store.get('lastResult', null);

    const fmtD = (d) => new Date(d).toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB', { day: 'numeric', month: 'short' });
    const passed = mocks.filter((m) => m.pass).length;
    mount(`
      <header class="top">
        <span class="eyebrow">${esc(t('sub'))}</span>
        ${langSwitch()}
      </header>
      <h1 class="title">${esc(t('app'))}</h1>

      <section class="ready">
        <div class="ready-row">
          <div class="bignum num">${pct}<span>%</span></div>
          <div class="cap">${esc(t('readiness'))}<br><span class="muted">${esc(t('mastered', { n: mastered, t: total }))}</span></div>
        </div>
        <div class="track"><i id="ringfg" style="width:0"></i></div>
        <div class="kpis">
          <div><b class="num">${seen}</b><span>${esc(t('kAnswered'))}</span></div>
          <div><b class="num">${mistakes}</b><span>${esc(t('mistakes'))}</span></div>
          <div><b class="num">${passed}<em>/${mocks.length}</em></b><span>${esc(t('kMocks'))}</span></div>
        </div>
      </section>

      ${exam && left > 0 ? `<button class="resume" id="resume"><span>${esc(t('resume'))}</span><span class="num">${mmss(left)}</span></button>` : ''}

      <button class="primary" id="start">
        <span class="pt">${esc(t('start'))}</span>
        <span class="pm">${esc(t('startMeta'))}</span>
      </button>

      <div class="sect">${esc(t('study'))}</div>
      <nav class="rows">
        <a class="row" href="#/signs"><span class="ix">01</span><span class="rt">${esc(t('signsTitle'))}</span><span class="rm num">${signN}</span>${I.chev}</a>
        <a class="row" href="#/topics"><span class="ix">02</span><span class="rt">${esc(t('topicsTitle'))}</span><span class="rm num">${bank.topics.length}</span>${I.chev}</a>
        <a class="row" href="#/practice/mistakes"><span class="ix">03</span><span class="rt">${esc(t('mistakesTitle'))}</span><span class="rm num${mistakes ? ' hot' : ''}">${mistakes}</span>${I.chev}</a>
        <a class="row" href="#/practice/all"><span class="ix">04</span><span class="rt">${esc(t('all'))}</span><span class="rm num">${total}</span>${I.chev}</a>
      </nav>

      <div class="sect">${esc(t('recent'))}</div>
      ${last5.length ? `<nav class="rows">${last5.slice().reverse().map((m, k) => `
        <a class="row" ${k === 0 && lastRes ? 'href="#/result"' : ''}>
          <span class="rt">${esc(fmtD(m.d))}</span>
          <span class="rm num">${m.score}/30</span>
          <span class="pill ${m.pass ? 'p' : 'f'}">${esc(m.pass ? t('pass') : t('fail'))}</span>
        </a>`).join('')}</nav>` : `<p class="muted small" style="margin:0">${esc(t('noMocks'))}</p>`}

      <p class="foot">${esc(t('foot'))}</p>
    `);
    bindLang();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const fg = document.getElementById('ringfg');
      if (fg) fg.style.width = pct + '%';
    }));
    document.getElementById('start').onclick = () => {
      if (exam && left > 0) {
        confirmSheet(t('quitTitle'), t('quitText'), t('start'), () => { store.del('exam'); startExam(); }, true);
      } else startExam();
    };
    const r = document.getElementById('resume');
    if (r) r.onclick = () => go('#/exam');
  }

  function langSwitch() {
    return `<div class="seg" role="group" aria-label="Language">
      <button data-lang="el" aria-pressed="${lang === 'el'}">ΕΛ</button>
      <button data-lang="en" aria-pressed="${lang === 'en'}">EN</button></div>`;
  }
  function bindLang(after) {
    view.querySelectorAll('[data-lang]').forEach((b) => {
      b.onclick = () => {
        if (lang === b.dataset.lang) return;
        lang = b.dataset.lang; store.set('lang', lang);
        document.documentElement.lang = lang;
        if (after) after(); else route();
      };
    });
  }

  /* ---------------- question rendering ---------------- */
  function figure(q) {
    if (!q.img) return '';
    return `<div class="figure${q.t === 0 ? ' sign' : ''}"><img src="img/${esc(q.img)}" alt="" loading="eager" decoding="async"></div>`;
  }
  function options(q, state) {
    // state: { chosen, reveal } ; reveal => show right/wrong
    const L = q[lang];
    return `<div class="opts">${L.a.map((a, i) => {
      let cls = '';
      if (state.reveal) {
        if (i === q.c) cls = 'right';
        else if (i === state.chosen) cls = 'wrong';
        else cls = 'dim';
      } else if (i === state.chosen) cls = 'sel';
      return `<button class="opt ${cls}" data-i="${i}" ${state.reveal ? 'disabled' : ''}><span class="k">${KEYS[lang][i]}</span><span>${esc(a)}</span></button>`;
    }).join('')}</div>`;
  }
  const noteHtml = (q) => q.note ? `<div class="note"><b>${esc(t('note'))}</b>${esc(q.note[lang])}</div>` : '';
  const topicName = (q) => bank.topics[q.t][lang];

  /* ---------------- mock exam ---------------- */
  function startExam() {
    const ids = bank.exam.groups.map((g) => pick(bank.questions.filter((q) => q.g === g)).id);
    store.set('exam', { ids, ans: ids.map(() => null), start: Date.now(), cur: 0 });
    go('#/exam');
  }

  function renderExam(anim = true) {
    const ex = store.get('exam', null);
    if (!ex) { go('#/', true); return; }
    const limit = bank.exam.minutes * 60;
    const left = limit - (Date.now() - ex.start) / 1000;
    if (left <= 0) { finishExam(true); return; }
    const i = ex.cur;
    const q = byId.get(ex.ids[i]);
    const n = ex.ids.length;
    const done = ex.ans.filter((a) => a != null).length;

    mount(`
      <div class="qtop">
        <button class="iconbtn" id="quit" aria-label="Quit">${I.close}</button>
        <div class="mid">${i + 1} / ${n}</div>
        <span class="timer${left < 300 ? ' low' : ''}" id="timer">${I.clock}<span id="tleft">${mmss(left)}</span></span>
        <button class="iconbtn" id="gridbtn" aria-label="${esc(t('grid'))}">${I.grid}</button>
      </div>
      <div class="qbar"><i style="width:${(done / n) * 100}%"></i></div>
      <section class="q">
        <div class="meta"><span class="tag">${esc(t('q', { n: i + 1, t: n }))}</span>${langSwitch()}</div>
        <h2>${esc(q[lang].q)}</h2>
        ${figure(q)}
        ${options(q, { chosen: ex.ans[i] })}
        <div class="navrow">
          <button class="btn ghost" id="prev" ${i === 0 ? 'disabled' : ''}>${I.back}${esc(t('prev'))}</button>
          ${i < n - 1
            ? `<button class="btn" id="next">${esc(t('next'))}${I.arrow}</button>`
            : `<button class="btn accent" id="fin">${esc(t('finish'))}</button>`}
        </div>
      </section>
    `, anim);
    bindLang(() => renderExam(false));

    view.querySelectorAll('.opt').forEach((b) => {
      b.onclick = () => {
        const e = store.get('exam', null); if (!e) return;
        e.ans[i] = +b.dataset.i; store.set('exam', e);
        view.querySelectorAll('.opt').forEach((x) => x.classList.toggle('sel', x === b));
        const d = e.ans.filter((a) => a != null).length;
        view.querySelector('.qbar i').style.width = (d / n) * 100 + '%';
      };
    });
    const move = (to) => { const e = store.get('exam', null); if (!e) return; e.cur = to; store.set('exam', e); renderExam(false); };
    const pv = document.getElementById('prev'); if (pv) pv.onclick = () => move(i - 1);
    const nx = document.getElementById('next'); if (nx) nx.onclick = () => move(i + 1);
    const fn = document.getElementById('fin'); if (fn) fn.onclick = () => askFinish();
    document.getElementById('gridbtn').onclick = () => examGrid();
    document.getElementById('quit').onclick = () => confirmSheet(t('quitTitle'), t('quitText'), t('quitGo'), () => { store.del('exam'); go('#/', true); }, true);

    const tick = () => {
      const cur = store.get('exam', null);
      if (!cur) { clearTimers(); return; }
      const l = limit - (Date.now() - cur.start) / 1000;
      const el = document.getElementById('tleft');
      if (el) el.textContent = mmss(l);
      const tm = document.getElementById('timer');
      if (tm) tm.classList.toggle('low', l < 300);
      if (l <= 0) { clearTimers(); finishExam(true); }
    };
    timers.push(setInterval(tick, 1000));
  }

  function examGrid() {
    const ex = store.get('exam', null); if (!ex) return;
    openSheet(`
      <h3>${esc(t('grid'))}</h3>
      <div class="legend"><span><i style="background:var(--s3)"></i>${esc(t('answered'))}</span><span><i style="border:1px solid var(--text)"></i>${esc(t('current'))}</span></div>
      <div class="qgrid">${ex.ids.map((_, k) => `<button data-k="${k}" class="${ex.ans[k] != null ? 'done' : ''} ${k === ex.cur ? 'cur' : ''}">${k + 1}</button>`).join('')}</div>
      <button class="btn accent" id="gfin" style="width:100%">${esc(t('finish'))}</button>
    `);
    sheet.querySelectorAll('[data-k]').forEach((b) => {
      b.onclick = () => { const e = store.get('exam', null); e.cur = +b.dataset.k; store.set('exam', e); closeSheet(); renderExam(false); };
    });
    document.getElementById('gfin').onclick = () => { closeSheet(); askFinish(); };
  }

  function askFinish() {
    const ex = store.get('exam', null); if (!ex) return;
    const un = ex.ans.filter((a) => a == null).length;
    confirmSheet(t('finishTitle'), un ? t('finishUn', { n: un }) : t('finishAll'), t('finishGo'), () => finishExam(false));
  }

  function finishExam(timeUp) {
    const ex = store.get('exam', null);
    if (!ex) { go('#/', true); return; }
    const secs = Math.min(bank.exam.minutes * 60, Math.round((Date.now() - ex.start) / 1000));
    let score = 0;
    ex.ids.forEach((id, k) => {
      const q = byId.get(id);
      const ok = ex.ans[k] === q.c;
      if (ok) score++;
      if (ex.ans[k] != null) record(id, ok);
    });
    const mistakes = ex.ids.length - score;
    const pass = mistakes <= bank.exam.maxMistakes;
    const res = { ids: ex.ids, ans: ex.ans, score, pass, secs, d: Date.now() };
    store.set('lastResult', res);
    const mocks = store.get('mocks', []);
    mocks.push({ d: res.d, score, pass, secs });
    store.set('mocks', mocks.slice(-200));
    store.del('exam');
    if (timeUp) toast(t('timeUp'));
    go('#/result', true);
  }

  function renderResult(showAll) {
    const r = store.get('lastResult', null);
    if (!r) { go('#/', true); return; }
    const n = r.ids.length;
    const blank = r.ans.filter((a) => a == null).length;
    const items = r.ids.map((id, k) => ({ q: byId.get(id), a: r.ans[k], k })).filter((x) => x.q);
    const shown = showAll ? items : items.filter((x) => x.a !== x.q.c);

    mount(`
      <header class="top">
        <button class="iconbtn" id="home" aria-label="${esc(t('home'))}">${I.back}</button>
        ${langSwitch()}
      </header>
      <section class="result">
        <span class="badge ${r.pass ? 'p' : 'f'}">${r.pass ? I.check : I.x}${esc(r.pass ? t('pass') : t('fail'))}</span>
        <div class="score">${r.score}<small>/${n}</small></div>
        <p>${esc(t('scoreLine'))}</p>
      </section>
      <div class="stats3">
        <div><b>${n - r.score}</b><span>${esc(t('sMistakes'))}</span></div>
        <div><b>${blank}</b><span>${esc(t('sBlank'))}</span></div>
        <div><b>${mmss(r.secs)}</b><span>${esc(t('sTime'))}</span></div>
      </div>
      <div class="navrow">
        <button class="btn accent" id="again">${esc(t('newMock'))}</button>
      </div>
      <section class="review">
        <div class="top" style="min-height:0;margin:8px 0 12px">
          <span class="eyebrow">${esc(showAll ? t('reviewAll') : t('reviewWrong'))}</span>
          <button class="small" id="toggle" style="color:var(--accent);font-weight:650">${esc(showAll ? t('reviewWrongOnly') : t('reviewAll'))}</button>
        </div>
        ${shown.length ? shown.map(({ q, a, k }) => {
          const ok = a === q.c;
          return `<div class="ritem">
            <div class="h"><span>${k + 1}. ${esc(topicName(q))}</span><span style="color:${ok ? 'var(--green)' : 'var(--red)'}">${esc(ok ? t('right') : t('wrong'))}</span></div>
            <div class="qq">${esc(q[lang].q)}</div>
            ${figure(q)}
            ${!ok ? `<div class="ans"><span class="lab w">${esc(t('yours'))}</span><span>${a == null ? `<i class="muted">${esc(t('blank'))}</i>` : esc(q[lang].a[a])}</span></div>` : ''}
            <div class="ans"><span class="lab r">${esc(t('correct'))}</span><span>${esc(q[lang].a[q.c])}</span></div>
            ${noteHtml(q)}
          </div>`;
        }).join('') : `<div class="empty"><div class="ic">${I.check}</div><h3>${esc(t('noWrong'))}</h3></div>`}
      </section>
    `);
    bindLang(() => renderResult(showAll));
    document.getElementById('home').onclick = () => go('#/', true);
    document.getElementById('again').onclick = () => startExam();
    document.getElementById('toggle').onclick = () => renderResult(!showAll);
  }

  /* ---------------- topics ---------------- */
  function renderTopics() {
    const s = stats();
    const rows = bank.topics.map((tp, i) => {
      const qs = bank.questions.filter((q) => q.t === i);
      const m = qs.filter((q) => isMastered(s[q.id])).length;
      return { i, tp, n: qs.length, m };
    });
    mount(`
      <header class="top">
        <button class="iconbtn" id="home" aria-label="${esc(t('home'))}">${I.back}</button>
        ${langSwitch()}
      </header>
      <div class="pagehead"><h2>${esc(t('topicsTitle'))}</h2><p>${esc(t('topicsText'))}</p></div>
      <div class="list">${rows.map((r) => `
        <a class="li" href="#/practice/topic/${r.tp.key}">
          <div class="main"><b>${esc(r.tp[lang])}</b><div class="bar"><i style="width:${r.n ? (r.m / r.n) * 100 : 0}%"></i></div></div>
          <span class="count">${r.m}/${r.n}</span>${I.chev}
        </a>`).join('')}
      </div>
    `);
    bindLang();
    document.getElementById('home').onclick = () => go('#/');
  }

  /* ---------------- practice (topic / signs quiz / mistakes / all) ---------------- */
  function startPractice(kind, key) {
    const s = stats();
    let pool = [], title = '', back = '#/';
    if (kind === 'topic') {
      const ti = bank.topics.findIndex((x) => x.key === key);
      if (ti < 0) return go('#/topics', true);
      pool = bank.questions.filter((q) => q.t === ti).map((q) => q.id);
      title = () => bank.topics[ti][lang]; back = '#/topics';
    } else if (kind === 'signs') {
      pool = bank.questions.filter((q) => q.t === 0).map((q) => q.id);
      title = () => t('signs'); back = '#/signs';
    } else if (kind === 'mistakes') {
      pool = bank.questions.filter((q) => isMistake(s[q.id])).map((q) => q.id);
      title = () => t('mistakesTitle');
    } else {
      pool = bank.questions.map((q) => q.id);
      title = () => t('allTitle');
    }
    const key2 = kind + ':' + (key || '');
    if (!session || session.key !== key2) {
      session = { key: key2, kind, queue: priority(pool), pool, idx: 0, chosen: null, right: 0, n: 0, title, back };
    }
    renderPractice(true);
  }

  function renderPractice(anim) {
    const ss = session;
    const s = stats();
    if (ss.kind === 'mistakes' && ss.chosen == null) {
      while (ss.idx < ss.queue.length && !isMistake(s[ss.queue[ss.idx]])) ss.idx++;
      if (ss.idx >= ss.queue.length) {
        const left = bank.questions.filter((x) => isMistake(s[x.id])).map((x) => x.id);
        ss.queue = shuffle(left); ss.idx = 0;
      }
    }
    if (!ss.queue.length) {
      mount(`
        <header class="top"><button class="iconbtn" id="home">${I.back}</button>${langSwitch()}</header>
        <div class="empty"><div class="ic">${I.check}</div><h3>${esc(t('cleared'))}</h3><p>${esc(t('clearedText'))}</p></div>
        <div class="navrow"><a class="btn" href="#/">${esc(t('home'))}</a></div>`, anim);
      bindLang(() => renderPractice(false));
      document.getElementById('home').onclick = () => go(ss.back);
      return;
    }
    if (ss.idx >= ss.queue.length) { ss.queue = priority(ss.pool); ss.idx = 0; }
    const q = byId.get(ss.queue[ss.idx]);
    const mastered = ss.pool.filter((id) => isMastered(s[id])).length;
    const reveal = ss.chosen != null;
    const ok = reveal && ss.chosen === q.c;

    mount(`
      <div class="qtop">
        <button class="iconbtn" id="back" aria-label="${esc(t('back'))}">${I.back}</button>
        <div class="mid">${esc(ss.title())}</div>
        <span class="small muted num" style="padding-right:8px;white-space:nowrap">${mastered}/${ss.pool.length}</span>
      </div>
      <section class="q">
        <div class="meta"><span class="tag">${esc(ss.n ? t('sessionStat', { r: ss.right, n: ss.n }) : t('masteredOf', { m: mastered, t: ss.pool.length }))}</span>${langSwitch()}</div>
        <h2>${esc(q[lang].q)}</h2>
        ${figure(q)}
        ${options(q, { chosen: ss.chosen, reveal })}
        ${reveal ? `<div class="verdict ${ok ? 'r' : 'w'}">${esc(ok ? t('right') : t('wrong'))}</div>${noteHtml(q)}
          <div class="navrow"><button class="btn" id="cont">${esc(t('cont'))}${I.arrow}</button></div>` : ''}
      </section>
    `, anim);
    bindLang(() => renderPractice(false));
    document.getElementById('back').onclick = () => { session = null; go(ss.back); };
    if (!reveal) {
      view.querySelectorAll('.opt').forEach((b) => {
        b.onclick = () => {
          ss.chosen = +b.dataset.i;
          const good = ss.chosen === q.c;
          record(q.id, good);
          ss.n++; if (good) ss.right++;
          if (!good) { // bring it back a few questions later
            ss.queue.splice(Math.min(ss.queue.length, ss.idx + 4), 0, q.id);
          }
          renderPractice(false);
          const v = view.querySelector('.verdict');
          if (v) v.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
      });
    } else {
      document.getElementById('cont').onclick = () => { ss.chosen = null; ss.idx++; renderPractice(true); };
    }
  }

  /* ---------------- signs ---------------- */
  function signDeck() { return bank.questions.filter((q) => q.t === 0 && q.img); }

  function renderSigns() {
    const s = stats();
    const all = bank.questions.filter((q) => q.t === 0);
    const deck = signDeck();
    const mastered = all.filter((q) => isMastered(s[q.id])).length;
    mount(`
      <header class="top">
        <button class="iconbtn" id="home" aria-label="${esc(t('home'))}">${I.back}</button>
        ${langSwitch()}
      </header>
      <div class="pagehead"><h2>${esc(t('signsTitle'))}</h2><p>${esc(t('signsText'))}</p></div>
      <div class="modes">
        <a class="mode" href="#/signs/cards"><b>${esc(t('cards'))}</b><span>${esc(t('cardsSub'))}</span></a>
        <a class="mode" href="#/practice/signs"><b>${esc(t('quiz'))}</b><span>${esc(t('quizSub'))}</span></a>
      </div>
      <div class="top" style="min-height:0;margin:4px 0 10px"><span class="eyebrow">${esc(t('allSigns'))}</span><span class="small muted num">${esc(t('masteredOf', { m: mastered, t: all.length }))}</span></div>
      <div class="gridsigns">${deck.map((q) => {
        const e = s[q.id];
        const dot = e ? (isMastered(e) ? 'ok' : (e.w && e.k === 0 ? 'bad' : '')) : '';
        return `<button data-id="${q.id}" aria-label="${esc(q[lang].a[q.c])}"><img src="img/${esc(q.img)}" alt="" loading="lazy" decoding="async">${dot ? `<span class="dot ${dot}"></span>` : ''}</button>`;
      }).join('')}</div>
    `);
    bindLang();
    document.getElementById('home').onclick = () => go('#/');
    view.querySelectorAll('.gridsigns [data-id]').forEach((b) => { b.onclick = () => go('#/signs/cards/' + b.dataset.id); });
  }

  function startCards(startId) {
    const deck = signDeck().map((q) => q.id);
    let order;
    if (startId && deck.includes(+startId)) {
      const k = deck.indexOf(+startId);
      order = deck.slice(k).concat(deck.slice(0, k));
    } else order = priority(deck);
    session = { key: 'cards', kind: 'cards', queue: order, idx: 0, revealed: false, back: '#/signs' };
    renderCard(true);
  }

  function renderCard(anim) {
    const ss = session;
    if (!ss || ss.kind !== 'cards') return go('#/signs', true);
    if (ss.idx >= ss.queue.length) { ss.queue = priority(ss.queue); ss.idx = 0; }
    const q = byId.get(ss.queue[ss.idx]);
    mount(`
      <div class="qtop">
        <button class="iconbtn" id="back" aria-label="${esc(t('back'))}">${I.back}</button>
        <div class="mid">${esc(t('cards'))}</div>
        <span class="small muted num" style="padding-right:6px">${ss.idx + 1} / ${ss.queue.length}</span>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:12px">${langSwitch()}</div>
      <button class="card" id="card">
        ${figure(q)}
        <div class="ask">${esc(q[lang].q)}</div>
        ${ss.revealed
          ? `<div class="answer"><small>${esc(t('answer'))}</small>${esc(q[lang].a[q.c])}</div>${noteHtml(q)}`
          : `<div class="reveal">${esc(t('tapReveal'))}</div>`}
      </button>
      ${ss.revealed ? `<div class="navrow">
        <button class="btn ghost" id="no">${esc(t('didnt'))}</button>
        <button class="btn" id="yes">${esc(t('knew'))}</button>
      </div>` : ''}
    `, anim);
    bindLang(() => renderCard(false));
    document.getElementById('back').onclick = () => { session = null; go('#/signs'); };
    document.getElementById('card').onclick = () => { if (!ss.revealed) { ss.revealed = true; renderCard(false); } };
    const nextCard = (ok) => { record(q.id, ok); if (!ok) ss.queue.splice(Math.min(ss.queue.length, ss.idx + 5), 0, q.id); ss.idx++; ss.revealed = false; renderCard(true); };
    const y = document.getElementById('yes'); if (y) y.onclick = () => nextCard(true);
    const n = document.getElementById('no'); if (n) n.onclick = () => nextCard(false);
  }

  /* ---------------- sheet ---------------- */
  function openSheet(html) {
    sheet.innerHTML = `<div class="panel" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
    sheet.hidden = false;
    sheet.onclick = (e) => { if (e.target === sheet) closeSheet(); };
  }
  function closeSheet() { sheet.hidden = true; sheet.innerHTML = ''; }
  function confirmSheet(title, text, goLabel, onGo, danger) {
    openSheet(`<h3>${esc(title)}</h3><p>${esc(text)}</p>
      <div class="navrow" style="margin-top:0">
        <button class="btn ghost" id="sno">${esc(t('keepGoing'))}</button>
        <button class="btn ${danger ? 'danger' : 'accent'}" id="syes">${esc(goLabel)}</button>
      </div>`);
    document.getElementById('sno').onclick = closeSheet;
    document.getElementById('syes').onclick = () => { closeSheet(); onGo(); };
  }

  /* ---------------- boot ---------------- */
  async function boot() {
    document.documentElement.lang = lang;
    view.innerHTML = '<div class="loading">…</div>';
    try {
      const res = await fetch('data/bank.json');
      bank = await res.json();
      bank.questions.forEach((q) => byId.set(q.id, q));
    } catch (_) {
      view.innerHTML = '<div class="empty"><h3>Couldn’t load the questions</h3><p>Check your connection and reopen the app.</p></div>';
      return;
    }
    route();
  }

  window.addEventListener('hashchange', route);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && location.hash.startsWith('#/exam')) route();
  });
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const had = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
      }).catch(() => {});
      let done = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !done) { done = true; location.reload(); } });
    });
  }
  boot();
})();
