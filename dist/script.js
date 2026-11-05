'use strict';
(() => {
  const lang = document.documentElement.lang;
  const messages = {
    'zh-Hant': {
      openMenu:'開啟選單',closeMenu:'關閉選單', title:'Cohesol 項目採購需求簡報', category:'採購方向',location:'項目所在地',goal:'項目目標',load:'規模／尺寸／用電情況',timing:'時程',notes:'其他資料',name:'姓名／公司',email:'聯絡電郵',unknown:'未提供',subject:'Cohesol 採購服務需求',downloaded:'已準備簡報下載，可附在電郵中分享。',draft:'已嘗試開啟你的電郵程式；請檢查草稿並確認寄出。如未開啟，請下載簡報後寄往 davidlu2006@gmail.com。',long:'簡報內容較長，請下載完整簡報並附在電郵中寄往 davidlu2006@gmail.com。',whitespace:'請填寫實際內容。',download:'下載簡報',selected:'已選擇採購方向。',categories:{solar:'酒店與廚房設備',storage:'新能源應用',offgrid:'模組化結構',exploring:'尚在探索'},timings:{exploring:'目前在了解可行性','three-months':'希望在 3 個月內推進','six-months':'計劃在 3–6 個月內推進',undecided:'尚未確定'}
    },
    en: {
      openMenu:'Open menu',closeMenu:'Close menu', title:'Cohesol project sourcing brief',category:'Sourcing area',location:'Project location',goal:'Project objective',load:'Scale / dimensions / electricity use',timing:'Timing',notes:'Additional information',name:'Name / company',email:'Contact email',unknown:'Not provided',subject:'Cohesol sourcing enquiry',downloaded:'Your brief is ready to download. You can attach it to an email.',draft:'We have tried to open your email app. Review the draft and send it yourself. If it did not open, download your brief and email it to davidlu2006@gmail.com.',long:'This brief is long. Download the complete brief and attach it to an email to davidlu2006@gmail.com.',whitespace:'Please enter some text.',download:'Download brief',selected:'Sourcing area selected.',categories:{solar:'Hospitality & kitchen',storage:'Energy applications',offgrid:'Modular structures',exploring:'Still exploring'},timings:{exploring:'Exploring feasibility','three-months':'Within 3 months','six-months':'In 3–6 months',undecided:'Not decided yet'}
    },
    fr: {
      openMenu:'Ouvrir le menu',closeMenu:'Fermer le menu',title:'Cohesol — Fiche de besoin d’approvisionnement',category:'Domaine',location:'Lieu du projet',goal:'Objectif du projet',load:'Échelle / dimensions / consommation',timing:'Calendrier',notes:'Informations complémentaires',name:'Nom / entreprise',email:'Adresse e-mail',unknown:'Non renseigné',subject:'Demande d’approvisionnement Cohesol',downloaded:'Votre fiche est prête à être téléchargée. Vous pouvez la joindre à un e-mail.',draft:'Nous avons tenté d’ouvrir votre messagerie. Vérifiez le brouillon et envoyez-le vous-même. Si rien ne s’ouvre, téléchargez la fiche et envoyez-la à davidlu2006@gmail.com.',long:'Cette fiche est longue. Téléchargez-la et joignez-la à un e-mail adressé à davidlu2006@gmail.com.',whitespace:'Veuillez saisir du texte.',download:'Télécharger la fiche',selected:'Domaine sélectionné.',categories:{solar:'Hôtellerie & cuisines',storage:'Applications énergétiques',offgrid:'Structures modulaires',exploring:'À définir ensemble'},timings:{exploring:'Étude de faisabilité','three-months':'D’ici 3 mois','six-months':'Dans 3 à 6 mois',undecided:'Pas encore défini'}
    }
  };
  const t = messages[lang] || messages.en;
  const menu = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const setMenu = open => {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? t.closeMenu : t.openMenu);
    mobileNav.hidden = !open;
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
      const languages = document.querySelector('.languages');
      if (languages.open) { languages.open = false; languages.querySelector('summary').focus(); }
    }
  });
  document.addEventListener('click', e => {
    const languages = document.querySelector('.languages');
    if (!languages.contains(e.target)) languages.open = false;
  });

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', e => {
      let index;
      if (e.key === 'ArrowRight') index = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') index = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') index = 0;
      if (e.key === 'End') index = tabs.length - 1;
      if (index !== undefined) { e.preventDefault(); selectTab(tabs[index], true); }
    });
  });

  const form = document.getElementById('brief-form');
  const steps = [...form.querySelectorAll('.form-step')];
  const next = document.getElementById('next-step');
  const previous = document.getElementById('previous-step');
  const status = document.getElementById('form-status');
  let currentStep = 1;
  function validateCurrentStep() {
    const fields = steps[currentStep - 1].querySelectorAll('input, textarea, select');
    for (const field of fields) {
      field.setCustomValidity(field.required && !field.value.trim() ? t.whitespace : '');
      if (!field.reportValidity()) return false;
    }
    return true;
  }
  function briefValues() {
    const values = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(values)) values[key] = String(values[key]).trim();
    return values;
  }
  function briefText() {
    const v = briefValues();
    const items = [t.title, '', `${t.category}: ${t.categories[v.category]}`, `${t.location}: ${v.location || t.unknown}`, `${t.goal}: ${v.goal || t.unknown}`, `${t.load}: ${v.load || t.unknown}`, `${t.timing}: ${t.timings[v.timing]}`, `${t.notes}: ${v.notes || t.unknown}`, '', `${t.name}: ${v.name || t.unknown}`, `${t.email}: ${v.email || t.unknown}`];
    return items.join('\n');
  }
  function updateSummary() { document.getElementById('brief-summary').textContent = briefText(); }
  function showStep(step, focus = true) {
    currentStep = step;
    steps.forEach((item, i) => { item.hidden = i !== step - 1; });
    next.hidden = step === 3;
    previous.hidden = step === 1;
    document.getElementById('step-count').textContent = `0${step} / 03`;
    document.getElementById('progress-bar').style.width = `${step / 3 * 100}%`;
    status.textContent = '';
    if (step === 3) updateSummary();
    if (focus) {
      const target = steps[step - 1].querySelector('input:not([type=radio]), textarea, select');
      target.focus();
    }
  }
  next.addEventListener('click', () => { if (validateCurrentStep()) showStep(currentStep + 1); });
  previous.addEventListener('click', () => showStep(currentStep - 1));
  form.addEventListener('submit', e => { e.preventDefault(); if (currentStep < 3 && validateCurrentStep()) showStep(currentStep + 1); });
  form.addEventListener('input', e => {
    if (typeof e.target.setCustomValidity === 'function') e.target.setCustomValidity('');
    if (currentStep === 3) updateSummary();
    status.textContent = '';
  });
  document.querySelectorAll('[data-select]').forEach(link => link.addEventListener('click', () => {
    const value = link.dataset.select;
    const radio = [...form.elements.category].find(input => input.value === value);
    if (radio) radio.checked = true;
    showStep(1, false);
  }));
  document.getElementById('download-brief').addEventListener('click', () => {
    if (!validateCurrentStep()) return;
    const blob = new Blob(['\uFEFF' + briefText()], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `cohesol-project-brief-${lang}.txt`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    status.textContent = t.downloaded;
  });
  document.getElementById('email-brief').addEventListener('click', () => {
    if (!validateCurrentStep()) return;
    const v = briefValues();
    const subject = `${t.subject} — ${t.categories[v.category]}`;
    const href = `mailto:davidlu2006@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(briefText())}`;
    if (href.length > 7000) { status.textContent = t.long; return; }
    status.textContent = t.draft;
    const a = document.createElement('a');
    a.href = href; document.body.appendChild(a); a.click(); a.remove();
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
