import re

fp = 'index.html'
c = open(fp).read()

old_css = '''.press-bar {
      background: #0f0f0f;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      padding: 0 80px;
      display: flex;
      align-items: center;
      height: 72px;
      gap: 0;
    }

    .press-bar-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--text-muted);
      white-space: nowrap;
      padding-right: 40px;
      border-right: 1px solid var(--border);
      margin-right: 40px;
    }

    .press-logos {
      display: flex;
      align-items: center;
      gap: 48px;
      flex: 1;
    }

    .press-logo {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .press-logo-name {
      font-size: 18px;
      font-weight: 800;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: -0.5px;
      line-height: 1;
    }

    .press-logo-desc {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.3);
    }'''

new_css = '''.press-bar {
      background: #0f0f0f;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      padding: 0 80px;
      display: flex;
      align-items: center;
      height: 72px;
      gap: 0;
      overflow: hidden;
    }

    .press-bar-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--text-muted);
      white-space: nowrap;
      padding-right: 40px;
      border-right: 1px solid var(--border);
      margin-right: 40px;
      flex-shrink: 0;
    }

    .press-logos {
      display: flex;
      align-items: center;
      gap: 48px;
      flex: 1;
      overflow: hidden;
    }

    .press-logos-track {
      display: flex;
      align-items: center;
      gap: 48px;
      animation: none;
      width: max-content;
    }

    .press-logo {
      display: flex;
      flex-direction: column;
      gap: 2px;
      white-space: nowrap;
    }

    .press-logo-name {
      font-size: 18px;
      font-weight: 800;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: -0.5px;
      line-height: 1;
    }

    .press-logo-desc {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.3);
    }

    .press-logo-dot {
      color: #C8F135;
      font-size: 8px;
      opacity: 0.5;
      flex-shrink: 0;
    }

    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

    @media (max-width: 768px) {
      .press-bar {
        flex-direction: column;
        height: auto;
        padding: 16px 0;
        gap: 10px;
        align-items: flex-start;
      }
      .press-bar-label {
        padding: 0 20px;
        border-right: none;
        margin-right: 0;
      }
      .press-logos {
        width: 100%;
        flex: none;
      }
      .press-logos-track {
        animation: marquee 10s linear infinite;
        gap: 32px;
      }
    }'''

c = c.replace(old_css, new_css)

old_html = '''  <!-- ============ PRESS BAR ============ -->
  <div class="press-bar">
    <span class="press-bar-label">As seen in</span>
    <div class="press-logos">
      <div class="press-logo">
        <span class="press-logo-name">GQ</span>
        <span class="press-logo-desc">Featured In</span>
      </div>
      <div class="press-logo">
        <span class="press-logo-name">blogTO</span>
        <span class="press-logo-desc">Ranked #1 Hyrox Gym</span>
      </div>
      <div class="press-logo">
        <span class="press-logo-name">Daily Hive</span>
        <span class="press-logo-desc">Featured In</span>
      </div>
      <div class="press-logo">
        <span class="press-logo-name">Grit Daily</span>
        <span class="press-logo-desc">Featured In</span>
      </div>
    </div>
  </div>'''

new_html = '''  <!-- ============ PRESS BAR ============ -->
  <div class="press-bar">
    <span class="press-bar-label">As seen in</span>
    <div class="press-logos">
      <div class="press-logos-track">
        <div class="press-logo"><span class="press-logo-name">GQ</span><span class="press-logo-desc">Featured In</span></div>
        <span class="press-logo-dot">&#10022;</span>
        <div class="press-logo"><span class="press-logo-name">blogTO</span><span class="press-logo-desc">Ranked #1 Hyrox Gym</span></div>
        <span class="press-logo-dot">&#10022;</span>
        <div class="press-logo"><span class="press-logo-name">Daily Hive</span><span class="press-logo-desc">Featured In</span></div>
        <span class="press-logo-dot">&#10022;</span>
        <div class="press-logo"><span class="press-logo-name">Grit Daily</span><span class="press-logo-desc">Featured In</span></div>
        <span class="press-logo-dot">&#10022;</span>
        <div class="press-logo"><span class="press-logo-name">GQ</span><span class="press-logo-desc">Featured In</span></div>
        <span class="press-logo-dot">&#10022;</span>
        <div class="press-logo"><span class="press-logo-name">blogTO</span><span class="press-logo-desc">Ranked #1 Hyrox Gym</span></div>
        <span class="press-logo-dot">&#10022;</span>
        <div class="press-logo"><span class="press-logo-name">Daily Hive</span><span class="press-logo-desc">Featured In</span></div>
        <span class="press-logo-dot">&#10022;</span>
        <div class="press-logo"><span class="press-logo-name">Grit Daily</span><span class="press-logo-desc">Featured In</span></div>
        <span class="press-logo-dot">&#10022;</span>
      </div>
    </div>
  </div>'''

c = c.replace(old_html, new_html)
c = c.replace('      .press-bar { padding: 0 40px; }', '      .press-bar { padding: 16px 0; flex-direction: column; height: auto; align-items: flex-start; gap: 10px; }\n      .press-bar-label { padding: 0 20px; border-right: none; margin-right: 0; }\n      .press-logos { width: 100%; flex: none; }\n      .press-logos-track { animation: marquee 10s linear infinite; gap: 32px; }')
open(fp, 'w').write(c)
print('index.html: done' if 'press-logos-track' in open(fp).read() else 'index.html: NO MATCH')

fp2 = 'hyrox-workouts.html'
c2 = open(fp2).read()
old_css2 = '    .press-bar { background: #0f0f0f; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 0 80px; display: flex; align-items: center; height: 80px; gap: 0; }\n    .press-bar-label { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; padding-right: 40px; border-right: 1px solid var(--border); margin-right: 40px; }\n    .press-logos { display: flex; align-items: center; gap: 48px; flex: 1; }\n    .press-logo-name { font-size: 20px; font-weight: 800; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: -0.5px; }'
new_css2 = '    .press-bar { background: #0f0f0f; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 0 80px; display: flex; align-items: center; height: 80px; gap: 0; overflow: hidden; }\n    .press-bar-label { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--text-muted); white-space: nowrap; padding-right: 40px; border-right: 1px solid var(--border); margin-right: 40px; flex-shrink: 0; }\n    .press-logos { display: flex; align-items: center; gap: 48px; flex: 1; overflow: hidden; }\n    .press-logos-track { display: flex; align-items: center; gap: 48px; animation: none; width: max-content; }\n    .press-logo-name { font-size: 20px; font-weight: 800; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: -0.5px; white-space: nowrap; }\n    .press-logo-dot { color: #C8F135; font-size: 8px; opacity: 0.5; flex-shrink: 0; }\n    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }'
c2 = c2.replace(old_css2, new_css2)
c2 = c2.replace('      .nav-hamburger { display: flex !important; }\n    }', '      .nav-hamburger { display: flex !important; }\n      .press-bar { padding: 16px 0 !important; flex-direction: column; height: auto; align-items: flex-start; gap: 10px; }\n      .press-bar-label { padding: 0 20px; border-right: none; margin-right: 0; }\n      .press-logos { width: 100%; flex: none; }\n      .press-logos-track { animation: marquee 10s linear infinite; gap: 32px; }\n    }')
old_html2 = '  <div class="press-bar">\n    <span class="press-bar-label">As seen in</span>\n    <div class="press-logos">\n      <span class="press-logo-name">GQ</span>\n      <span class="press-logo-name">The Best Toronto</span>\n      <span class="press-logo-name">BlogTO</span>\n      <span class="press-logo-name">Yahoo</span>\n    </div>\n  </div>'
new_html2 = '  <div class="press-bar">\n    <span class="press-bar-label">As seen in</span>\n    <div class="press-logos">\n      <div class="press-logos-track">\n        <span class="press-logo-name">GQ</span>\n        <span class="press-logo-dot">&#10022;</span>\n        <span class="press-logo-name">The Best Toronto</span>\n        <span class="press-logo-dot">&#10022;</span>\n        <span class="press-logo-name">BlogTO</span>\n        <span class="press-logo-dot">&#10022;</span>\n        <span class="press-logo-name">Yahoo</span>\n        <span class="press-logo-dot">&#10022;</span>\n        <span class="press-logo-name">GQ</span>\n        <span class="press-logo-dot">&#10022;</span>\n        <span class="press-logo-name">The Best Toronto</span>\n        <span class="press-logo-dot">&#10022;</span>\n        <span class="press-logo-name">BlogTO</span>\n        <span class="press-logo-dot">&#10022;</span>\n        <span class="press-logo-name">Yahoo</span>\n        <span class="press-logo-dot">&#10022;</span>\n      </div>\n    </div>\n  </div>'
c2 = c2.replace(old_html2, new_html2)
open(fp2, 'w').write(c2)
print('hyrox-workouts.html: done' if 'press-logos-track' in open(fp2).read() else 'hyrox-workouts.html: NO MATCH')
