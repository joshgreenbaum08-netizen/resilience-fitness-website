(function () {
  function addChatNudge() {
    var bubble = document.getElementById('rf-chat-bubble');
    var widget = document.getElementById('rf-chat-widget');
    if (!bubble || !widget) return;

    /* ── Force the widget to stay fixed in the bottom-right on all pages ── */
    widget.style.cssText += [
      'position: fixed !important',
      'bottom: 24px !important',
      'right: 24px !important',
      'z-index: 99998 !important',
      'width: auto !important',
      'height: auto !important'
    ].join(';');

    /* ── Bounce animation on the bubble itself ── */
    var style = document.createElement('style');
    style.textContent = [
      '@keyframes chat-bounce {',
      '  0%   { transform: translateY(0)    scale(1);    }',
      '  20%  { transform: translateY(-11px) scale(1.09); }',
      '  40%  { transform: translateY(0)    scale(1);    }',
      '  55%  { transform: translateY(-5px)  scale(1.04); }',
      '  70%  { transform: translateY(0)    scale(1);    }',
      '  100% { transform: translateY(0)    scale(1);    }',
      '}',
      '.rf-chat-bounce {',
      '  animation: chat-bounce 0.85s ease !important;',
      '}'
    ].join('\n');
    document.head.appendChild(style);

    /* ── Pulse rings as real fixed DOM elements ── */
    function makeRing(delay) {
      var ring = document.createElement('div');
      ring.style.cssText = [
        'position: fixed',
        'border-radius: 50%',
        'border: 2.5px solid #C8F135',
        'pointer-events: none',
        'z-index: 99997',
        'opacity: 0',
        'animation: ring-pulse 2.8s ease-out ' + delay + 's infinite'
      ].join(';');
      document.body.appendChild(ring);
      return ring;
    }

    var ring1 = makeRing(0);
    var ring2 = makeRing(0.7);

    var ringStyle = document.createElement('style');
    ringStyle.textContent = '@keyframes ring-pulse { 0% { opacity: 0.7; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }';
    document.head.appendChild(ringStyle);

    /* position rings on top of the bubble */
    function positionRings() {
      var r = bubble.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top  + r.height / 2;
      var size = r.width;
      [ring1, ring2].forEach(function (ring) {
        ring.style.width  = size + 'px';
        ring.style.height = size + 'px';
        ring.style.left   = (cx - size / 2) + 'px';
        ring.style.top    = (cy - size / 2) + 'px';
      });
    }

    positionRings();
    window.addEventListener('resize', positionRings);
    /* re-position on scroll since fixed rings track fixed widget */
    window.addEventListener('scroll', positionRings);

    /* ── Bounce every 7s ── */
    function doBounce() {
      bubble.classList.remove('rf-chat-bounce');
      void bubble.offsetWidth;
      bubble.classList.add('rf-chat-bounce');
      /* reposition rings while bouncing */
      var frames = 0;
      var raf = function () {
        positionRings();
        if (++frames < 60) requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    bubble.addEventListener('animationend', function (e) {
      if (e.animationName === 'chat-bounce') bubble.classList.remove('rf-chat-bounce');
    });

    setTimeout(function () {
      doBounce();
      setInterval(doBounce, 7000);
    }, 2000);
  }

  if (document.getElementById('rf-chat-bubble')) {
    addChatNudge();
  } else {
    var obs = new MutationObserver(function (_, o) {
      if (document.getElementById('rf-chat-bubble')) {
        o.disconnect();
        addChatNudge();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }
})();
