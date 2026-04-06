#!/usr/bin/env python3
"""Run this script from your resilience-fitness-website folder to add the
hamburger menu to all pages. Then commit and push to GitHub."""

import os
import re

pages_dir = os.path.dirname(os.path.abspath(__file__))

hamburger_css = """
    /* ── Hamburger button ── */
    .nav-hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      width: 40px;
      height: 40px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      z-index: 1100;
    }
    .nav-hamburger span {
      display: block;
      width: 24px;
      height: 2px;
      background: #fff;
      border-radius: 2px;
      transition: transform 0.25s ease, opacity 0.25s ease;
      transform-origin: center;
    }
    .nav-hamburger.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-hamburger.is-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .nav-hamburger.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    /* ── Mobile menu overlay ── */
    .mobile-menu {
      display: none;
      position: fixed;
      top: 72px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(10,10,10,0.98);
      backdrop-filter: blur(16px);
      z-index: 999;
      padding: 32px 28px;
      overflow-y: auto;
      flex-direction: column;
      gap: 0;
    }
    .mobile-menu.is-open { display: flex; }
    .mobile-menu a {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      padding: 14px 0;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      display: block;
      transition: color 0.2s;
    }
    .mobile-menu a:hover { color: #C8F135; }
    .mobile-menu .mobile-sub { padding-left: 16px; }
    .mobile-menu .mobile-sub a { font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.5); }
    .mobile-menu .mobile-cta { display: flex; flex-direction: column; gap: 12px; margin-top: 32px; }
    .mobile-menu .mobile-cta a { font-size: 15px; font-weight: 700; letter-spacing: 2px; text-align: center; padding: 16px 28px; border-radius: 2px; border-bottom: none; }
    .mobile-menu .mobile-cta .btn-primary { background: #C8F135; color: #0A0A0A; }
    .mobile-menu .mobile-cta .btn-outline { border: 1.5px solid rgba(255,255,255,0.3); color: #fff; }"""

hamburger_btn = """    <button class="nav-hamburger" id="navHamburger" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>"""

mobile_menu = """
  <!-- ============ MOBILE MENU ============ -->
  <div class="mobile-menu" id="mobileMenu" role="dialog" aria-label="Mobile navigation">
    <a href="classes.html">Training</a>
    <div class="mobile-sub">
      <a href="classes.html">Classes</a>
      <a href="schedule.html">Schedule</a>
      <a href="group-training.html">Memberships</a>
    </div>
    <a href="about-us.html">About</a>
    <div class="mobile-sub">
      <a href="about-us.html">Our Story</a>
      <a href="coaches.html">Coaches</a>
    </div>
    <a href="locations-main.html">Locations</a>
    <div class="mobile-sub">
      <a href="east-york-facility.html">East York</a>
      <a href="durham-facility.html">Durham</a>
    </div>
    <a href="hyrox-workouts.html">HYROX</a>
    <a href="customer-service.html">Connect</a>
    <div class="mobile-cta">
      <a href="https://www.resilienceactivewear.com" target="_blank" class="btn-outline">Shop</a>
      <a href="group-training.html" class="btn-primary">Get Started</a>
    </div>
  </div>"""

hamburger_js = """  <script>
    (function() {
      var btn = document.getElementById('navHamburger');
      var menu = document.getElementById('mobileMenu');
      if (!btn || !menu) return;
      btn.addEventListener('click', function() {
        var isOpen = menu.classList.toggle('is-open');
        btn.classList.toggle('is-open', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
      menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          menu.classList.remove('is-open');
          btn.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    })();
  </script>"""

files = [f for f in os.listdir(pages_dir) if f.endswith('.html') and f != 'index.html']

for fname in sorted(files):
    fpath = os.path.join(pages_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'nav-hamburger' in content:
        print(f"SKIP (already done): {fname}")
        continue

    # 1. Add hamburger CSS + update mobile media query
    old_mq = re.search(
        r'(@media \(max-width: 768px\) \{[^}]*\.nav-links \{ display: none !important; \}\s*\})',
        content, re.DOTALL)
    if old_mq:
        old_block = old_mq.group(0)
        new_block = old_block.replace(
            '.nav-links { display: none !important; }',
            '.nav-links { display: none !important; }\n      .nav-cta { display: none !important; }\n      .nav-hamburger { display: flex !important; }'
        )
        content = content.replace(old_block, hamburger_css + '\n\n    ' + new_block)

    # 2. Add hamburger button inside <nav>
    content = content.replace('  </nav>', hamburger_btn + '\n  </nav>', 1)

    # 3. Add mobile menu after </nav>
    content = content.replace('  </nav>\n', '  </nav>\n' + mobile_menu + '\n', 1)

    # 4. Add JS before </body>
    content = content.replace('</body>', hamburger_js + '\n</body>', 1)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"FIXED: {fname}")

print("\nDone! Now run:")
print("  git add -A && git commit -m 'Fix mobile hamburger menu on all pages' && git push")
