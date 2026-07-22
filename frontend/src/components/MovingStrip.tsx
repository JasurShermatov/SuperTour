const items = [
  "Individual paketlar",
  "Oilaviy sayohatlar",
  "Premium yo'nalishlar",
  "Viza bo'yicha yo'l-yo'riq",
  "Hotel va transfer koordinatsiyasi",
  "Tezkor so'rovlar",
];

export function MovingStrip() {
  const repeated = [...items, ...items];

  return (
    <div className="moving-strip" aria-label="Travel highlights">
      <div className="moving-strip-track">
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
