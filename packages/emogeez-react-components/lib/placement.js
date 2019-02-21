/* eslint-disable no-param-reassign,no-cond-assign */

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
  let $parent = isFromWindow ? window : findParents(toggler, parentClass);
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

  const togglerCenterX = togglerBox.left + (togglerBox.width / 2);
  const togglerCenterY = togglerBox.top + (togglerBox.height / 2);
  const parentCenterX = parentBox.left + (parentBox.width / 2);
  const parentCenterY = parentBox.top + (parentBox.height / 2);

  let nextTop = popupBox.top;
  let nextLeft = popupBox.left;

  // if we are closer to the left
  if (togglerCenterX < parentCenterX) {
    nextLeft = (togglerCenterX - (popupBox.width / 2));
    const outLeft = nextLeft - parentBox.left;
    if (outLeft < 0) {
      nextLeft += Math.abs(outLeft);
    }
    nextLeft += offset;
  } else {
    nextLeft = (togglerCenterX - (popupBox.width / 2));
    const outRight = (parentBox.left + parentBox.width) - (nextLeft + popupBox.width);
    if (outRight < 0) {
      nextLeft -= Math.abs(outRight);
    }
    nextLeft -= offset;
  }

  if (togglerCenterY < parentCenterY) {
    nextTop = togglerBox.top + togglerBox.height + offset;
  } else {
    nextTop = togglerBox.top - popupBox.height - offset;
  }

  popup.style.setProperty('top', `${nextTop}px`);
  popup.style.setProperty('left', `${nextLeft}px`);
  popup.style.setProperty('right', 'auto');
  popup.style.setProperty('bottom', 'auto');
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

  popup.style.setProperty('top', `${togglerBox.top + togglerBox.height + offset}px`);
  popup.style.setProperty('left', `${togglerBox.left + (togglerBox.width / 2) - (popupBox.width / 2)}px`);
  popup.style.setProperty('right', 'auto');
  popup.style.setProperty('bottom', 'auto');

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
