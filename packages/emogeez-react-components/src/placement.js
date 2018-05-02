/**
 * find parents by class
 * @param {HTMLElement} element
 * @param {string} classNames
 * @returns {HTMLElement}
 */
const findParents = (element, classNames) => {
  while ((element = element.parentElement) && !element.classList.contains(classNames)) ;
  return element;
};

/**
 * it computes the popup position relative to his parent
 * @param {HTMLElement} popup
 * @param {HTMLElement} toggler
 * @param {number} offset
 * @param {string} parentClass
 */
const placePopup = (popup, toggler, offset, parentClass = null) => {
  const isFromWindow = parentClass === null;
  let parentNotFound = false;
  let $parent = isFromWindow ? window : findParents(popup, parentClass);
  if (!$parent) {
    parentNotFound = true;
    $parent = window;
  }

  const parentBox = isFromWindow || parentNotFound ? {
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
  } : $parent.getBoundingClientRect();
  const popupBox = popup.getBoundingClientRect();
  const togglerBox = toggler.getBoundingClientRect();

  // /!\ placement computing here is relative to the parent
  const newPlacement = {
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
  };
  const togglerCenter = togglerBox.left + (togglerBox.width / 2);
  const parentCenter = parentBox.left + (parentBox.width / 2);

  // if we are closer to the left
  if (togglerCenter < parentCenter) {
    let nextLeft = (togglerCenter - (popupBox.width / 2)) + offset;
    const outLeft = nextLeft - parentBox.left;
    if (outLeft < 0) {
      nextLeft += Math.abs(outLeft);
    }
    newPlacement.left = nextLeft - togglerBox.left;
  } else {
    let nextLeft = (togglerCenter - (popupBox.width / 2)) + offset;
    const outRight = (parentBox.left + parentBox.width) - (nextLeft + popupBox.width);
    if (outRight < 0) {
      nextLeft -= Math.abs(outRight);
    }
    newPlacement.left = nextLeft - togglerBox.left;
  }

  if ((togglerBox.top + (togglerBox.height / 2)) < parentBox.height / 2) {
    newPlacement.top = togglerBox.height + offset;
    if (popupBox.top <= 0) { // if popup is out of parent on top side
      newPlacement.top += (-popupBox.top + offset); // we add to popup propertie the difference
    }
  }
  const outBottom = parentBox.bottom - popupBox.bottom;
  if (outBottom <= 0) {
    newPlacement.bottom = togglerBox.height + offset;
  }

  popup.style.top = newPlacement.top === 'auto' ? 'auto' : `${newPlacement.top}px`;
  popup.style.left = newPlacement.left === 'auto' ? 'auto' : `${newPlacement.left}px`;
  popup.style.right = newPlacement.right === 'auto' ? 'auto' : `${newPlacement.right}px`;
  popup.style.bottom = newPlacement.bottom === 'auto' ? 'auto' : `${newPlacement.bottom}px`;
};

/**
 * place the popup's arrow
 * @param {HTMLElement} popup
 * @param {HTMLElement} toggler
 * @param {HTMLElement} arrow
 */
const placeArrow = (popup, toggler, arrow) => {
  const popupBox = popup.getBoundingClientRect();
  const togglerBox = toggler.getBoundingClientRect();
  const arrowBox = arrow.getBoundingClientRect();
  let popupBorderWidth = Math.ceil(parseFloat(getComputedStyle(popup).borderWidth));
  popupBorderWidth = popupBorderWidth === 0 ? 2 : popupBorderWidth + 1;

  arrow.style.setProperty('top', 'auto');
  arrow.style.setProperty('left', `${togglerBox.left - popupBox.left + (togglerBox.width / 2) - (arrowBox.width / 2) + popupBorderWidth}px`);
  arrow.style.setProperty('right', 'auto');
  arrow.style.setProperty('bottom', 'auto');

  if (togglerBox.top < popupBox.top) { // bottom of toggler
    arrow.style.setProperty('top', `-${(arrowBox.width / 2) - popupBorderWidth}px`);
  } else { // top of toggler
    arrow.style.setProperty('bottom', `-${(arrowBox.width / 2) - popupBorderWidth}px`);
  }
};

/**
 * initialize the popup placement process
 * @param {HTMLElement} popup
 * @param {HTMLElement} toggler
 * @param {number} offset
 * @param {HTMLElement|null} arrow
 * @param {string|null} parentClass
 */
export const placeEmojiPopup = (popup, toggler, offset, arrow, parentClass = null) => {
  const popupBox = popup.getBoundingClientRect();
  const togglerBox = toggler.getBoundingClientRect();
  const style = popup.style;

  style.top = `${togglerBox.height + offset}px`;
  style.left = `${togglerBox.width / 2}px`;
  style.right = 'auto';
  style.bottom = 'auto';
  style.marginLeft = `${-popupBox.width / 2}px`;

  popup.style = style;
  placePopup(popup, toggler, offset, parentClass);
  placeArrow(popup, toggler, arrow);
};

/**
 *
 * @param {HTMLElement} popup
 * @param {HTMLElement} toggler
 * @param {HTMLElement} parent
 */
export const placeModifiersPopup = (popup, toggler, parent) => {
  const popupBox = popup.getBoundingClientRect();
  const togglerBox = toggler.getBoundingClientRect();
  const parentBox = parent.getBoundingClientRect();

  const togglerCenter = togglerBox.left + (togglerBox.width / 2);
  const parentCenter = parentBox.left + (parentBox.width / 2);
  let popupLeft = 'auto';


  // if we are closer to the left
  if (togglerCenter < parentCenter) {
    let nextLeft = togglerCenter - popupBox.width / 2;
    const outLeft = nextLeft - parentBox.left;
    if (outLeft < 0) {
      nextLeft += Math.abs(outLeft);
    }
    popupLeft = nextLeft - togglerBox.left;
  } else {
    let nextLeft = togglerCenter - popupBox.width / 2;
    const outRight = (parentBox.left + parentBox.width) - (nextLeft + popupBox.width);
    if (outRight < 0) {
      nextLeft -= Math.abs(outRight);
    }
    popupLeft = nextLeft - togglerBox.left;
  }

  popup.style.top = '-5px';
  popup.style.left = `${popupLeft}px`;
};
