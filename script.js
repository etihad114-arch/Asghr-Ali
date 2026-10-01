document.getElementById("year").textContent = new Date().getFullYear();

document.querySelector(".menu").addEventListener("click", () => {
  const nav = document.querySelector(".nav nav");
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
  nav.style.flexDirection = "column";
  nav.style.position = "absolute";
  nav.style.top = "72px";
  nav.style.right = "4%";
  nav.style.background = "white";
  nav.style.padding = "18px";
  nav.style.borderRadius = "10px";
  nav.style.boxShadow = "0 10px 30px rgba(0,0,0,.12)";
});

function sendMessage(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  const subject = encodeURIComponent("Website project enquiry");
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject / Service:\n${message}`);
  const businessEmail = (window.GS_SITE_CONFIG && window.GS_SITE_CONFIG.email) || 'etihad114@gmail.com';
  window.location.href = `mailto:${businessEmail}?subject=${subject}&body=${body}`;
  document.getElementById("form-status").textContent =
    "Your email application should open with the project enquiry prepared.";
}


// V9: keep mobile navigation accessible when new sections are added.
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
  });
});


// V10: Project portfolio filtering
(() => {
  const buttons = document.querySelectorAll('.project-filter-btn');
  const cards = document.querySelectorAll('.project-detail-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });
})();


// V11: smooth profile navigation enhancement
document.querySelectorAll('a[href="#engineer-profile"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.querySelector('#engineer-profile');
    if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});


// V12: online package links can preselect the enquiry service when a service field exists.
document.querySelectorAll('.package-link').forEach(link => {
  link.addEventListener('click', () => {
    setTimeout(() => {
      const service = document.querySelector('#service');
      if (service) service.focus();
    }, 250);
  });
});


// V14: back-to-top control and accessibility-friendly behavior.
(() => {
  const top = document.getElementById('backToTop');
  if (!top) return;
  top.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();


// V15: safe internal navigation for hash links.
(() => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.setAttribute('tabindex', '-1');
    });
  });
})();


// V16 — centralized contact/domain configuration.
// The page keeps safe placeholders until the owner replaces site-config.js values.
(() => {
  const c = window.GS_SITE_CONFIG || {};
  const isPlaceholder = value =>
    !value || /YOUR-EMAIL|XXX|XXXXXXXX|yourdomain\.com/i.test(value);

  document.querySelectorAll('[data-gs-email]').forEach(el => {
    if (!isPlaceholder(c.email)) {
      el.textContent = c.email;
      if (el.tagName === 'A') el.href = 'mailto:' + c.email;
    }
  });

  document.querySelectorAll('[data-gs-phone]').forEach(el => {
    if (!isPlaceholder(c.phone)) {
      el.textContent = c.phone;
      if (el.tagName === 'A') el.href = 'tel:' + c.phone.replace(/[^\d+]/g, '');
    }
  });

  document.querySelectorAll('[data-gs-whatsapp]').forEach(el => {
    if (!isPlaceholder(c.whatsapp)) {
      el.href = 'https://wa.me/' + c.whatsapp.replace(/\D/g, '');
    }
  });

  document.querySelectorAll('[data-gs-domain]').forEach(el => {
    if (!isPlaceholder(c.domain)) el.href = c.domain;
  });
})();


// V17 — structured project enquiry summary generator.
(() => {
  const form = document.getElementById('quoteBuilder');
  const result = document.getElementById('quoteResult');
  const summary = document.getElementById('quoteSummary');
  const copy = document.getElementById('copyQuote');
  if (!form || !result || !summary) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const labels = [
      ['client_name','Client / Company'],
      ['client_email','Email'],
      ['client_phone','Phone / WhatsApp'],
      ['project_location','Project Location'],
      ['service','Required Service'],
      ['delivery','Preferred Delivery'],
      ['budget','Estimated Budget'],
      ['output','Preferred Output'],
      ['requirements','Project Requirements']
    ];

    const lines = [
      'GS CIVIL ENGINEERING & SURVEYING SOLUTIONS',
      'PROJECT ENQUIRY',
      '----------------------------------------'
    ];
    labels.forEach(([key,label]) => {
      const value = String(data.get(key) || '').trim();
      if (value) lines.push(label + ': ' + value);
    });
    lines.push('----------------------------------------');
    lines.push('Please review scope, drawings/data availability, deliverables and quotation before work begins.');

    summary.textContent = lines.join('\n');
    result.hidden = false;
    result.scrollIntoView({behavior:'smooth', block:'nearest'});
  });

  if (copy) {
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(summary.textContent);
        copy.textContent = 'Copied';
        setTimeout(() => copy.textContent = 'Copy Summary', 1800);
      } catch {
        copy.textContent = 'Select and copy the summary';
      }
    });
  }
})();


// V18 — case-study filtering.
(() => {
  const cards = [...document.querySelectorAll('.case-card')];
  if (!cards.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'case-filters';
  wrap.setAttribute('aria-label', 'Filter case studies');

  const categories = ['All', ...new Set(cards.map(c => c.dataset.category).filter(Boolean))];
  categories.forEach(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = category;
    button.className = category === 'All' ? 'active' : '';
    button.addEventListener('click', () => {
      wrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      cards.forEach(card => {
        card.hidden = category !== 'All' && card.dataset.category !== category;
      });
    });
    wrap.appendChild(button);
  });

  const grid = document.querySelector('.case-grid');
  if (grid) grid.parentNode.insertBefore(wrap, grid);
})();


// V19 — portfolio gallery lightbox.
(() => {
  const cards = [...document.querySelectorAll('.gallery-card')];
  const modal = document.getElementById('galleryModal');
  const close = document.getElementById('galleryClose');
  const title = document.getElementById('galleryModalTitle');
  const description = document.getElementById('galleryModalDescription');
  const visual = document.getElementById('modalVisual');
  if (!cards.length || !modal) return;

  const open = card => {
    title.textContent = card.dataset.title || '';
    description.textContent = card.dataset.description || '';
    visual.className = 'modal-visual ' + (card.querySelector('.gallery-visual')?.className.replace('gallery-visual','').trim() || '');
    modal.hidden = false;
    document.body.classList.add('modal-open');
    close?.focus();
  };

  const shut = () => {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
  };

  cards.forEach(card => card.addEventListener('click', () => open(card)));
  close?.addEventListener('click', shut);
  modal.querySelectorAll('[data-close-gallery]').forEach(el => el.addEventListener('click', shut));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) shut();
  });
})();
