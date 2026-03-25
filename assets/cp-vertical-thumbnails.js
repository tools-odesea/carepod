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

    // Find elements using multiple strategies
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

    // Check items have rendered (have height)
    if (items[0].offsetHeight < 5) return false;

    done = true;

    var prev = ts.querySelector('.slider-button--prev');
    var next = ts.querySelector('.slider-button--next');

    // --- Force layout via inline styles ---
    mg.setAttribute('style', 'display:flex;flex-direction:row;gap:1rem');

    // Main image slider = first slider-component child (GalleryViewer)
    var children = mg.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].tagName && children[i].tagName.toLowerCase() === 'slider-component') {
        if (!children[i].classList.contains('thumbnail-slider')) {
          children[i].setAttribute('style', 'flex:1 1 0%;min-width:0;order:2');
        }
        break;
      }
    }

    ts.setAttribute('style', 'order:1;width:85px;flex-shrink:0;display:flex;flex-direction:column;align-items:center');
    list.setAttribute('style', 'display:flex;flex-direction:column;flex-wrap:nowrap;overflow-x:hidden;overflow-y:auto;scroll-snap-type:y mandatory;max-height:550px;gap:0.5rem;padding:0.25rem;flex:0 1 auto;scrollbar-width:none');

    for (var j = 0; j < items.length; j++) {
      items[j].setAttribute('style', 'width:100%;min-width:100%;flex-shrink:0;scroll-snap-align:start');
    }

    // Style buttons
    function styleBtn(btn) {
      if (!btn) return;
      btn.setAttribute('style', 'width:44px;height:44px;min-height:44px;border-radius:50%;border:2px solid #5b9bd5;background:#fff;color:#5b9bd5;box-shadow:0 2px 8px rgba(0,0,0,.1);align-self:center;flex-shrink:0;display:flex;justify-content:center;align-items:center;cursor:pointer;margin:0');
      var icon = btn.querySelector('.icon');
      if (icon) icon.setAttribute('style', 'color:#5b9bd5');
    }

    if (prev) {
      prev.setAttribute('style', 'order:-1;margin-bottom:0.5rem');
      styleBtn(prev);
      var pi = prev.querySelector('.icon');
      if (pi) pi.setAttribute('style', 'color:#5b9bd5;transform:rotate(180deg)');
    }

    if (next) {
      next.setAttribute('style', 'margin-top:0.5rem');
      styleBtn(next);
      var ni = next.querySelector('.icon');
      if (ni) ni.setAttribute('style', 'color:#5b9bd5;transform:rotate(0deg)');
    }

    // --- Vertical scroll ---
    function step() {
      return items[0] ? items[0].offsetHeight + 8 : 80;
    }

    function updateBtns() {
      if (prev) prev.setAttribute('style', prev.getAttribute('style').replace(/display:[^;]+;?/, '') + ';display:' + (list.scrollTop <= 2 ? 'none' : 'flex'));
      if (next) {
        var max = list.scrollHeight - list.clientHeight;
        next.setAttribute('style', next.getAttribute('style').replace(/display:[^;]+;?/, '') + ';display:' + (list.scrollTop >= max - 2 ? 'none' : 'flex'));
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

  // Also try on various load events
  document.addEventListener('DOMContentLoaded', function () { setTimeout(apply, 100); });
  window.addEventListener('load', function () { setTimeout(apply, 300); });
})();
