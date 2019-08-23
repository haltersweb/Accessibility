console.log('test');

var keyboard = {
      enter: 13,
      left: 37,
      up: 38,
      right: 39,
      down: 40
    },
    ariaRoles = {
      'BUTTON': 'button',
      'A': 'link',
      'TD': 'cell',
      'DIV': ''
    },
    stringView = document.getElementById('stringView'),
    focusables = document.querySelectorAll('a, button, [tabindex="0"]');
function flagA11yHidden(container) {
  let elems = container.getElementsByTagName('*');
  for (let i = 0; i < elems.length; i += 1) {
    if (window.getComputedStyle(elems[i])['display'] === 'none' || window.getComputedStyle(elems[i])['visibility'] === 'hidden' || elems[i].getAttribute('aria-hidden') === 'true') {
      elems[i].setAttribute('data-a11y-hidden', 'true');
    }
  }
}
function clearA11yHiddenFlag(container) {
  let elems = container.querySelectorAll('[data-a11y-hidden]');
  for (let i = 0; i < elems.length; i += 1) {
    elems[i].removeAttribute('data-a11y-hidden');
  }
}
function getAccessibleTextContent(elem) {
  let clone = document.createElement('div');
  flagA11yHidden(elem);
  clone.innerHTML = elem.innerHTML;
  clearA11yHiddenFlag(elem);
  while (clone.querySelector('[data-a11y-hidden]')) {
    hiddenElem = clone.querySelector('[data-a11y-hidden]');
    hiddenElem.parentNode.removeChild(hiddenElem);
  }
  return clone.innerText.trim();
}
function getRole(elem) {
  var role = null;
  role = elem.getAttribute('role');
  if (!role) {
    role = ariaRoles[elem.nodeName];
  }
  if (!role) {
    role = '';
  }
  return role;
}
function getElemTitle(elem) {
  var ariaLabelledbyId = elem.getAttribute('aria-labelledby'),
      ariaLabel = elem.getAttribute('aria-label');
  if (ariaLabelledbyId) {
    return (document.getElementById(ariaLabelledbyId).textContent + '. ');
  }
  if (ariaLabel) {
    return (ariaLabel + '. ');
  }
  if (elem.textContent) {
    return (getAccessibleTextContent(elem) + '. ');
  }
  return '';
}
function getPageHeading() {
  if (document.querySelector('[data-page-heading-read]')) {
    //page heading has already been read
    return '';
  }
  var pageHeading = document.querySelector('h1, [role="heading"][aria-level="1"]');
  if (pageHeading) {
    pageHeading.setAttribute('data-page-heading-read', 'true');
    return (getAccessibleTextContent(pageHeading) + '. ');
  }
  // no page heading existed
  return '';
}
function getDescriptor(elem) {
  //TO DO: ARIA-DESCRIBEDBY (incl MULTI) FOR I.E. ENTITY PAGES
}
function getSectionHeading(elem) {
  var sectionHeading = '';
  const nodeArray = Array.from(document.querySelectorAll(':focus, h2, h3, h4, h5, h6, caption, [role="row"][aria-labelledby], [role="row"][aria-label], [role="heading"][aria-level]:not([aria-level="1"])'));
  const selectedIndex = nodeArray.findIndex(
    function(elem) {
	    return elem == document.activeElement;
    }
  );
  if (selectedIndex === 0) {
    // there is no subheading
    return '';
  }
  sectionHeading = nodeArray[selectedIndex - 1];
  if (sectionHeading.hasAttribute('data-announced')) {
    //this elements subheading was already announced
    return '';
  }
  const priorSubhead = document.querySelector('[data-announced]');
  if (priorSubhead) {
    //remove announced flag on prior subheading
    priorSubhead.removeAttribute('data-announced');
  }
  //add announced flag on current elements subheading so it doesn't announce again
  sectionHeading.setAttribute('data-announced', 'true');
  if (sectionHeading.nodeName === 'CAPTION') {
    //pick caption over aria-labelledby or aria-label
    return (getAccessibleTextContent(sectionHeading) + '. ');
  }
  if (sectionHeading.hasAttribute('aria-labelledby')) {
    //using aria-labelledby
    let id = sectionHeading.getAttribute('aria-labelledby');
    return (getAccessibleTextContent(document.getElementById(id)) + '. ');
  }
  if (sectionHeading.hasAttribute('aria-label')) {
    //using aria-label
    return (sectionHeading.getAttribute('aria-label') + '. ');
  }
  return (getAccessibleTextContent(sectionHeading) + '. ');
}
function buildMap(elem) {
  var map = {};
  map.page = getPageHeading();
  map.section = getSectionHeading(elem);
  map.role = getRole(elem);
  map.title = getElemTitle(elem);
  return map;
}
function genString(map) {
  map.role = (map.role === 'cell' || map.role === 'gridcell') ? '' : map.role + '. ';
  var string = '"' + map.page + map.section + map.title + map.role + '"';
  return string;
}
function sendString(string, target) {
  target.textContent = string;
}
function findThisSection(elem) {
  while (!elem.dataset.section && elem.nodeName !== 'BODY') {
    elem = elem.parentElement;
  }
  if (elem.dataset.section) {
    return elem;
  }
  return null;
}
for (var i = 0; i < focusables.length; i += 1) {
  focusables[i].addEventListener('focus', function (evt) {
    document.querySelector('.focus').classList.toggle('focus');
    this.classList.toggle('focus');
    var map = {};
    var string;
    map = buildMap(this);
    string = genString(map);
    //sendString(string, stringView);
  });
  focusables[i].addEventListener('keydown', function (evt) {
    if (evt.keyCode === keyboard.right ||
        evt.keyCode === keyboard.left ||
        evt.keyCode === keyboard.up ||
        evt.keyCode === keyboard.down) {
        var thisSection = findThisSection(this),
            newSection = null;
          switch (evt.keyCode) {
            case (keyboard.left):
              if (this.previousElementSibling) {
                this.previousElementSibling.focus();
              }
              break;
            case (keyboard.right):
              if (this.nextElementSibling) {
                this.nextElementSibling.focus();
              }
              break;
            case (keyboard.up):
                newSection = document.querySelector('[data-section="' + (parseInt(thisSection.dataset.section) - 1) + '"]');
              if (newSection) {
                newSection.querySelector('button, [tabindex="0"]').focus();
              }
              break;
            case (keyboard.down):
                newSection = document.querySelector('[data-section="' + (parseInt(thisSection.dataset.section) + 1) + '"]');
              if (newSection) {
                newSection.querySelector('button, [tabindex="0"]').focus();
              }
              break;
            default:
              return false;
          }
       }
  });
}
function initialize() {
  document.querySelector('.focus').focus();
}
initialize();
