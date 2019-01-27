(function () {
  'use strict';
  /*
  graphical checkbox
  aria-live
  add a footer in HTML with links (so that refocusing on submit is clearly seen)
  */
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const seen = document.getElementById('seen');
  const submit = document.getElementById('submit');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const close = document.getElementById('close');
  const curtain = document.getElementById('curtain');
  const ariaLive = document.querySelector('[aria-live]');
  const plays = [
    {title: "The Tempest", type: "comedy"},
    {title: "Two Gentlemen of Verona", type: "comedy"},
    {title: "The Merry Wives of Windsor", type: "comedy"},
    {title: "Measure for Measure", type: "comedy"},
    {title: "The Comedy of Errors", type: "comedy"},
    {title: "Much Ado About Nothing", type: "comedy"},
    {title: "Love's Labour's Lost", type: "comedy"},
    {title: "A Midsummer Night's Dream", type: "comedy"},
    {title: "The Merchant of Venice", type: "comedy"},
    {title: "As You Like It", type: "comedy"},
    {title: "The Taming of the Shrew", type: "comedy"},
    {title: "All's Well That Ends Well", type: "comedy"},
    {title: "Twelfth Night", type: "comedy"},
    {title: "The Winter's Tale", type: "comedy"},
    {title: "Pericles, Prince of Tyre", type: "comedy"},
    {title: "The Two Noble Kinsmen", type: "comedy"},
    {title: "King John", type: "history"},
    {title: "Richard II", type: "history"},
    {title: "Henry IV, Part 1", type: "history"},
    {title: "Henry IV, Part 2", type: "history"},
    {title: "Henry V", type: "history"},
    {title: "Henry VI, Part 1", type: "history"},
    {title: "Henry VI, Part 2", type: "history"},
    {title: "Henry VI, Part 3", type: "history"},
    {title: "Richard III", type: "history"},
    {title: "Henry VIII", type: "history"},
    {title: "Edward III", type: "history"},
    {title: "Troilus and Cressida", type: "tragedy"},
    {title: "Coriolanus", type: "tragedy"},
    {title: "Titus Andronicus", type: "tragedy"},
    {title: "Romeo and Juliet", type: "tragedy"},
    {title: "Timon of Athens", type: "tragedy"},
    {title: "Julius Caesar", type: "tragedy"},
    {title: "Macbeth", type: "tragedy"},
    {title: "Hamlet", type: "tragedy"},
    {title: "King Lear", type: "tragedy"},
    {title: "Othello", type: "tragedy"},
    {title: "Antony and Cleopatra", type: "tragedy"},
    {title: "Cymbeline", type: "tragedy"}
  ];
  /* search for all instances of particular key-value pair(s) AKA my_criteria */
  function find_in_object(my_object, my_criteria) {
    //my_object is JSON to filter through
    //my_criteria is key:value pair(s) to filter by, i.e. {key1: 'foo', key2: 'bar'}
    return my_object.filter((obj) => {
      return Object.keys(my_criteria).every((c) => {
        return obj[c] === my_criteria[c];
      });
    });
  }
  /* fix any NodeList support issues */
  if (window.NodeList && !NodeList.prototype.forEach) { // forEach NodeList polyfill for IE
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
  function listPlays() {
    let request = document.querySelector('[name="list"]:checked');
    let filtered = (request.id === 'all') ? plays : find_in_object(plays, {type: request.id});
    let ul = document.createElement('ul');
    filtered.forEach(function(obj) {
      let li = document.createElement('li');
      li.innerText = obj.title;
      ul.appendChild(li);
    });
    return ul;
  }
  function openModal() {
    let ariaHide = document.querySelectorAll('.skip-to, nav, main, footer');
    let actionables = document.querySelectorAll('a, input, select, textarea, button, [tabindex]');
    document.activeElement.setAttribute('data-focused', 'true');
    actionables.forEach((el) => {
      let parent = el;
      do {parent = parent.parentElement} while (parent.id !== 'modal' && parent.tagName !== 'BODY');
      if(parent.id !== 'modal') {
        if (el.hasAttribute('tabindex')) {
          el.setAttribute('data-tabindex', el.getAttribute('tabindex'));
        }
        el.setAttribute('tabindex', '-1');
      }
    });
    ariaHide.forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
    });
    modal.classList.add('show');
    curtain.classList.add('show');
    document.getElementById('close').focus();
  }
  function closeModal() {
    let ariaShow = document.querySelectorAll('.skip-to, nav, main, footer');
    let actionables = document.querySelectorAll('a, input, select, textarea, button, [tabindex]');
    let focus = document.querySelector('[data-focused]');
    actionables.forEach((el) => {
      if(!(el.id === "close")) {
        el.removeAttribute('tabindex');
        if (el.dataset.tabindex) {
          el.createAttribute('tabindex', el.dataset.tabindex);
          el.removeAttribute('data-tabindex');
        }
      }
    });
    ariaShow.forEach((el) => {
      el.removeAttribute('aria-hidden');
    });
    modal.classList.remove('show');
    curtain.classList.remove('show');
    focus.removeAttribute('data-focused');
    focus.focus();
  }
  /* Submit form event checks for err, generates list, and opens modal */
  submit.addEventListener('click', () => {
    let requireds = document.querySelectorAll('[aria-required="true"]');
    requireds.forEach((el) => {
      let err = el.nextElementSibling;
      err.classList.remove('show');
      el.removeAttribute('aria-invalid');
      el.setAttribute('aria-describedby','');
      if (el.value === '') {
        err.classList.add('show');
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', el.id + 'Err');
      }
    });
    let elErr = document.querySelector('[aria-invalid="true"]');
    if (elErr) {
      elErr.focus();
      return;
    }
    let ul = listPlays();
    modalContent.innerHTML = "";
    modalContent.appendChild(ul);
    openModal();
  });
  /* Close modal button event */
  close.addEventListener('click', () => {
    closeModal();
  });
  /* ESC for modal */
  window.addEventListener('keyup', (e) => {
    let key = e.key || e.keyCode;
    if ((modal.classList.contains('show')) && (key === "Escape" || key === "Esc" || key === 27)) {
      closeModal();
    }
  });
  document.querySelectorAll('bookend').forEach((el) => {
    el.addEventListener('focusin', (evt) => {
      
    });
  })
}());