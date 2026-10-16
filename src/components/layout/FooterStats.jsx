'use client';

export default function FooterStats() {
  const stats = [
    { number: '1,00,000+', label: 'Happy Devotees (Yajmans)', icon: '🙏' },
    { number: '500+', label: 'Gurukul Certified Pandits', icon: '🕉️' },
    { number: '2,000+', label: 'Sacred Pujas & Havans', icon: '🔥' },
    { number: '108+', label: 'Cities with Active Pandits', icon: '📍' },
  ];

  return (
    <section className="milestones-bar">
      <div className="milestones-grid">
        {stats.map((s, idx) => (
          <div key={idx} className="milestone-box">
            <span className="milestone-icon">{s.icon}</span>
            <strong className="milestone-number">{s.number}</strong>
            <span className="milestone-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
