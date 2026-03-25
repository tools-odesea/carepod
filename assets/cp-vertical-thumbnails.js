/**
 * Vertical thumbnail gallery for product pages.
 * Waits for media-gallery custom element to be ready, then
 * applies inline styles and vertical scroll behavior.
 */
(function () {
  if (window.innerWidth < 990) return;

  var applied = false;

  function init() {
    if (applied) return;

    var mg = document.querySelector('.product--thumbnail_slider media-gallery');
    if (!mg) return;

    var ts = mg.querySelector('slider-component.thumbnail-slider');
    if (!ts) return;

    var list = ts.querySelector('.thumbnail-list');
    if (!list) return;

    var prev = ts.querySelector('.slider-button--prev');
    var next = ts.querySelector('.slider-button--next');
    var items = list.querySelectorAll('.thumbnail-list__item');
    if (!items.length) return;

    applied = true;

    // --- Layout overrides via inline styles ---
    mg.style.cssText = 'display:flex;flex-direction:row;gap:1rem';

    var mainSlider = mg.querySelector('slider-component:first-of-type');
    if (mainSlider && mainSlider !== ts) {
      mainSlider.style.cssText = 'flex:1 1 0%;min-width:0;order:2';
    }

    ts.style.cssText = 'order:1;width:85px;flex-shrink:0;display:flex;flex-direction:column;align-items:center';

    list.style.cssText = 'display:flex;flex-direction:column;flex-wrap:nowrap;overflow-x:hidden;overflow-y:auto;scroll-snap-type:y mandatory;max-height:550px;gap:0.5rem;padding:0.25rem;flex:0 1 auto;scrollbar-width:none';

    items.forEach(function (item) {
      item.style.cssText = 'width:100%;min-width:100%;flex-shrink:0;scroll-snap-align:start';
    });

    function styleBtn(btn) {
      if (!btn) return;
      btn.style.cssText = 'width:44px;height:44px;min-height:44px;border-radius:50%;border:2px solid #5b9bd5;background:#fff;color:#5b9bd5;box-shadow:0 2px 8px rgba(0,0,0,.1);align-self:center;flex-shrink:0;display:flex;justify-content:center;align-items:center;cursor:pointer;margin:0';
      var icon = btn.querySelector('.icon');
      if (icon) icon.style.color = '#5b9bd5';
    }

    if (prev) {
      prev.style.order = '-1';
      prev.style.marginBottom = '0.5rem';
      var pi = prev.querySelector('.icon');
      if (pi) pi.style.transform = 'rotate(180deg)';
      styleBtn(prev);
    }

    if (next) {
      next.style.marginTop = '0.5rem';
      var ni = next.querySelector('.icon');
      if (ni) ni.style.transform = 'rotate(0deg)';
      styleBtn(next);
    }

    // --- Vertical scroll behavior ---
    function step() {
      return items[0] ? items[0].offsetHeight + 8 : 80;
    }

    function updateBtns() {
      if (prev) prev.style.display = list.scrollTop <= 2 ? 'none' : 'flex';
      if (next) {
        var max = list.scrollHeight - list.clientHeight;
        next.style.display = list.scrollTop >= max - 2 ? 'none' : 'flex';
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
  }

  // Poll until the media-gallery element is ready (max 10 seconds)
  var attempts = 0;
  var maxAttempts = 40;
  var interval = setInterval(function () {
    attempts++;
    var mg = document.querySelector('.product--thumbnail_slider media-gallery');
    var list = mg && mg.querySelector('.thumbnail-list');
    var hasItems = list && list.querySelector('.thumbnail-list__item');
    if (hasItems) {
      clearInterval(interval);
      init();
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
    }
  }, 250);
})();
