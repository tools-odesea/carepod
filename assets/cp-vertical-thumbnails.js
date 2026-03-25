/**
 * Vertical thumbnail gallery for product pages.
 * Polls DOM until elements are ready, then applies inline styles
 * and vertical scroll behavior.
 */
(function () {
  if (window.innerWidth < 990) return;

  var done = false;

  function apply() {
    if (done) return;

    var productEl = document.querySelector('.product--thumbnail_slider');
    if (!productEl) return false;

    var mg = productEl.querySelector('media-gallery') ||
             productEl.getElementsByTagName('media-gallery')[0];
    if (!mg) return false;

    var ts = mg.querySelector('.thumbnail-slider');
    if (!ts) return false;

    var list = ts.querySelector('.thumbnail-list');
    if (!list) return false;

    var items = list.querySelectorAll('.thumbnail-list__item');
    if (!items.length) return false;

    done = true;

    var prev = ts.querySelector('.slider-button--prev');
    var next = ts.querySelector('.slider-button--next');

    // --- Force layout via inline styles ---

    // Media gallery: horizontal flex row
    mg.setAttribute('style', 'display:flex;flex-direction:row;gap:1rem');

    // Main image slider: right side
    var children = mg.children;
    for (var i = 0; i < children.length; i++) {
      var tag = children[i].tagName ? children[i].tagName.toLowerCase() : '';
      if (tag === 'slider-component' && !children[i].classList.contains('thumbnail-slider')) {
        children[i].setAttribute('style', 'flex:1 1 0%;min-width:0;order:2');
        break;
      }
    }

    // Thumbnail slider: left column, 85px wide
    ts.setAttribute('style', 'order:1;width:85px;flex-shrink:0;display:flex;flex-direction:column;align-items:center');

    // Thumbnail list: vertical scroll, override grid and horizontal scroll
    list.setAttribute('style',
      'display:flex !important;flex-direction:column;flex-wrap:nowrap;' +
      'overflow-x:hidden;overflow-y:auto;' +
      'scroll-snap-type:y mandatory;' +
      'max-height:550px;gap:0.5rem;padding:0.25rem;' +
      'scrollbar-width:none;' +
      'grid-template-columns:none'  // kill grid layout
    );

    // Each thumbnail item: explicit 85px square with position relative
    for (var j = 0; j < items.length; j++) {
      items[j].setAttribute('style',
        'width:85px;min-width:85px;height:85px;min-height:85px;' +
        'flex-shrink:0;scroll-snap-align:start;position:relative'
      );
    }

    // Style arrow buttons
    function styleBtn(btn, direction) {
      if (!btn) return;
      var base = 'width:44px;height:44px;min-height:44px;border-radius:50%;' +
        'border:2px solid #5b9bd5;background:#fff;color:#5b9bd5;' +
        'box-shadow:0 2px 8px rgba(0,0,0,.1);align-self:center;flex-shrink:0;' +
        'display:flex;justify-content:center;align-items:center;cursor:pointer;margin:0';
      if (direction === 'prev') base += ';order:-1;margin-bottom:0.5rem';
      if (direction === 'next') base += ';margin-top:0.5rem';
      btn.setAttribute('style', base);
      var icon = btn.querySelector('.icon');
      if (icon) {
        var rot = direction === 'prev' ? 'rotate(180deg)' : 'rotate(0deg)';
        icon.setAttribute('style', 'color:#5b9bd5;transform:' + rot);
      }
    }

    styleBtn(prev, 'prev');
    styleBtn(next, 'next');

    // --- Vertical scroll behavior ---
    function step() {
      return 85 + 8; // thumbnail height + gap
    }

    function updateBtns() {
      if (prev) {
        if (list.scrollTop <= 2) {
          prev.style.display = 'none';
        } else {
          prev.style.display = 'flex';
          styleBtn(prev, 'prev');
        }
      }
      if (next) {
        var max = list.scrollHeight - list.clientHeight;
        if (list.scrollTop >= max - 2) {
          next.style.display = 'none';
        } else {
          next.style.display = 'flex';
          styleBtn(next, 'next');
        }
      }
    }

    if (prev) {
      prev.addEventListener('click', function (e) {
        e.stopPropagation(); e.preventDefault();
        list.scrollBy({ top: -step() * 3, behavior: 'smooth' });
        setTimeout(updateBtns, 400);
      }, true);
    }

    if (next) {
      next.addEventListener('click', function (e) {
        e.stopPropagation(); e.preventDefault();
        list.scrollBy({ top: step() * 3, behavior: 'smooth' });
        setTimeout(updateBtns, 400);
      }, true);
    }

    list.addEventListener('scroll', updateBtns, { passive: true });
    updateBtns();

    return true;
  }

  // Poll every 250ms for up to 15 seconds
  var t = 0;
  var iv = setInterval(function () {
    t += 250;
    if (apply() || t > 15000) clearInterval(iv);
  }, 250);

  document.addEventListener('DOMContentLoaded', function () { setTimeout(apply, 100); });
  window.addEventListener('load', function () { setTimeout(apply, 500); });
})();
