// ==UserScript==
// @name         HN QoL
// @description  Typography, collapsible comments, direct links, highlight new comments
// @match        https://news.ycombinator.com/*
// @grant        none
// @version      1.0
// ==/UserScript==

(function() {
  'use strict';

  // ── A: Typography ───────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    table#hnmain {
      zoom: 125%;
      margin: 10px auto !important;
      padding: 10px !important;
      max-width: 960px !important;
      background: #f6f6ef !important;
      border-radius: 4px !important;
      line-height: 1.6 !important;
    }
    .commtext {
      line-height: 1.6 !important;
    }

    /* ── G: Highlight new comments ──────────────────────────────── */
    .comtr:has(.age[title]) .new-count,
    a.togg + span .new-comment-marker { }

    span.age a[href*="item"] ~ span:contains("new") { }

    .comment-tree .comtr .votelinks + .default .comhead .age + span {
      color: #828282;
    }

    /* target the (N minutes ago) [new] marker */
    .hnew {
      background: #fffbe6;
      border-left: 3px solid #f0a500;
      padding-left: 6px;
    }
  `;
  document.head.appendChild(style);

  // ──  Mark new comments ────────────────────────────────────────
  // HN marks new comments with class 'ctime' on the age span when
  // the comment is newer than your last visit
  document.querySelectorAll('.comtr').forEach(row => {
    const age = row.querySelector('.age');
    if (age && age.nextSibling) {
      const text = age.parentElement.textContent;
      if (text.includes('new')) {
        const comment = row.querySelector('.comment');
        if (comment) comment.classList.add('hnew');
      }
    }
  });

  // ──  Collapse comments on click ───────────────────────────────
  // HN already has collapse via the [-] toggle; this makes clicking
  // the username/header line also toggle
  document.querySelectorAll('.comhead').forEach(head => {
    head.style.cursor = 'pointer';
    head.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') return; // don't intercept actual links
      const toggler = head.closest('.comtr')?.querySelector('.togg');
      if (toggler) toggler.click();
    });
  });

  // ──  Direct links (skip HN redirect) ──────────────────────────
  document.querySelectorAll('.titleline > a').forEach(a => {
    const href = a.getAttribute('href');
    // HN uses relative URLs for internal links; external links are direct already
    // but 'news.ycombinator.com/l?...' redirects do appear sometimes
    if (href && href.startsWith('//')) {
      a.href = 'https:' + href;
    }
    if (href && href.includes('ycombinator.com/l?')) {
      try {
        const url = new URL(href);
        const real = url.searchParams.get('u');
        if (real) a.href = decodeURIComponent(real);
      } catch(e) {}
    }
  });

})();
