import React, { useEffect, useMemo, useState } from 'react';

function getScrollableHeight() {
  const h = document.documentElement;
  return Math.max(1, h.scrollHeight - window.innerHeight);
}

export default function ScrollRail() {
  const [topics, setTopics] = useState([]); // {id, label, top}
  const [ticks, setTicks] = useState([]);  // {id, label, topPct}
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);

  // Discover topics by [data-topic]
  useEffect(() => {
    function scan() {
      const nodes = Array.from(document.querySelectorAll('[data-topic]'));
      const items = nodes.map(n => ({ id: n.id || '', label: n.getAttribute('data-topic') || '', el: n }));
      setTopics(items);
    }
    scan();
    const ro = new MutationObserver(() => scan());
    ro.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['id','data-topic'] });
    window.addEventListener('resize', scan);
    return () => { ro.disconnect(); window.removeEventListener('resize', scan); };
  }, []);

  // Compute evenly spaced ticks based on number of topics; positions update on resize
  useEffect(() => {
    function computeEven() {
      const count = Math.max(1, topics.length);
      const next = topics.map((t, idx) => ({ id: t.id, label: t.label, topPct: ((idx + 0.5) / count) * 100 }));
      setTicks(next);
    }
    computeEven();
    window.addEventListener('resize', computeEven);
    return () => window.removeEventListener('resize', computeEven);
  }, [topics]);

  // Active detection via IntersectionObserver (uses topics list)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const vis = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { root: null, threshold: [0.2, 0.5] }
    );
    topics.forEach(t => { if (t.id) { const el = document.getElementById(t.id); if (el) observer.observe(el); } });
    return () => observer.disconnect();
  }, [topics]);

  const onTickClick = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div
        className="scroll-rail-hotzone"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        aria-hidden="true"
      />
      <nav className={`scroll-rail ${visible ? 'is-visible' : ''}`} aria-label="Page topics">
        <div className="scroll-rail__track" />
        {ticks.map(t => (
          <button
            key={t.id}
            className={`scroll-rail__tick ${active === t.id ? 'is-active' : ''}`}
            style={{ top: `${t.topPct}%` }}
            onClick={() => onTickClick(t.id)}
            aria-label={`Jump to ${t.label || t.id}`}
          >
            <span className="scroll-rail__label">
              {t.label || t.id}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
}
