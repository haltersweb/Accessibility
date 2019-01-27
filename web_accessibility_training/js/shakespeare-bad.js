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
    modal.classList.add('show');
    curtain.classList.add('show');
  }
  function closeModal() {
    modal.classList.remove('show');
    curtain.classList.remove('show');
  }
  /* Submit form event checks for err, generates list, and opens modal */
  submit.addEventListener('click', () => {
    let requireds = document.querySelectorAll('[aria-required="true"]');
    requireds.forEach((el) => {
      let err = el.nextElementSibling;
      err.classList.remove('show');
      if (el.value === '') {
        err.classList.add('show');
      }
    });
    if (document.querySelector('.err.show')) {
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
}());