import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "all", label: "Tümü", icon: "◈" },
  { id: "emlak", label: "Emlak", icon: "⌂" },
  { id: "arac", label: "Araç", icon: "◎" },
  { id: "esya", label: "İkinci El", icon: "◇" },
];

const MOCK_LISTINGS = [
  {
    id: 1, category: "emlak", title: "3+1 Kadıköy Daire", price: 4200000,
    location: "Kadıköy, İstanbul", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
    seller: "Ahmet Y.", sellerScore: 98, views: 1240, date: "2 gün önce",
    aiScore: 94, aiLabel: "Güvenli", aiNote: "Fiyat bölge ortalamasıyla uyumlu. İlan tutarlı ve fotoğraflar gerçek görünüyor.",
    badges: ["Fiyat Doğrulandı", "Fotoğraf Gerçek"],
    desc: "Kadıköy merkezde, metro yürüyüş mesafesinde, 120m², balkonlu, ebeveyn banyolu temiz daire."
  },
  {
    id: 2, category: "arac", title: "2020 Honda Civic 1.6 Dizel", price: 890000,
    location: "Çankaya, Ankara", img: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&q=80",
    seller: "Murat K.", sellerScore: 72, views: 3400, date: "5 saat önce",
    aiScore: 61, aiLabel: "Dikkatli Ol", aiNote: "Fiyat piyasa değerinin %18 altında. Araç geçmişi doğrulanamadı. Mutlaka ekspertize gönderin.",
    badges: ["Fiyat Düşük ⚠️"],
    desc: "İlk sahibinden, 87.000 km, hasarsız, full paket. Acil satış."
  },
  {
    id: 3, category: "esya", title: "iPhone 14 Pro 256GB", price: 28500,
    location: "Beşiktaş, İstanbul", img: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&q=80",
    seller: "Zeynep A.", sellerScore: 95, views: 890, date: "1 gün önce",
    aiScore: 89, aiLabel: "Güvenli", aiNote: "Fiyat piyasa ortalamasıyla uyumlu. Satıcının geçmiş ilanları tutarlı.",
    badges: ["Fiyat Doğrulandı", "Güvenilir Satıcı"],
    desc: "Kutusunda, tüm aksesuarlarıyla, şarj sayısı 88, temiz kullanım."
  },
  {
    id: 4, category: "emlak", title: "Arnavutköy Sıfır Daire", price: 8750000,
    location: "Arnavutköy, İstanbul", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80",
    seller: "Yapı A.Ş.", sellerScore: 88, views: 2100, date: "3 gün önce",
    aiScore: 85, aiLabel: "Güvenli", aiNote: "Marka firma, tapusu temiz, proje belgesi doğrulandı.",
    badges: ["Kurum Onaylı", "Tapu Temiz"],
    desc: "Sıfır teslim, akıllı ev sistemleri, 2 otopark, 140m², Boğaz manzarası."
  },
  {
    id: 5, category: "arac", title: "2019 VW Passat 1.6 TDI", price: 1150000,
    location: "Nilüfer, Bursa", img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80",
    seller: "Kemal S.", sellerScore: 91, views: 1780, date: "1 gün önce",
    aiScore: 92, aiLabel: "Güvenli", aiNote: "Araç geçmişi temiz, fiyat piyasayla uyumlu, satıcı güvenilir profil.",
    badges: ["Fiyat Doğrulandı", "Geçmiş Temiz"],
    desc: "110.000 km, hasarsız, bakımlı, otomatik, Elegance paket."
  },
  {
    id: 6, category: "esya", title: "Sony PS5 + 2 Kol", price: 16800,
    location: "Bağcılar, İstanbul", img: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&q=80",
    seller: "Ali R.", sellerScore: 55, views: 4200, date: "12 saat önce",
    aiScore: 38, aiLabel: "Riskli ⚠️", aiNote: "Fiyat normalin çok altında. Satıcının hesabı yeni ve önceki ilan geçmişi yok. Ödeme yapmadan buluşun.",
    badges: ["Yeni Hesap ⚠️", "Fiyat Şüpheli ⚠️"],
    desc: "Az kullanılmış, kutusunda, disc edition, 3 oyun hediye."
  },
];

const scoreColor = (s) => s >= 80 ? "#00e5a0" : s >= 60 ? "#f5c842" : "#ff4d6d";
const scoreLabel = (s) => s >= 80 ? "Güvenli" : s >= 60 ? "Dikkatli Ol" : "Riskli";

function AIBadge({ score }) {
  const color = scoreColor(score);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: `${color}18`, border: `1px solid ${color}55`,
      borderRadius: 20, padding: "3px 10px", fontSize: 12, color,
      fontWeight: 700, letterSpacing: 0.5
    }}>
      <span style={{ fontSize: 8, background: color, borderRadius: "50%", width: 8, height: 8, display: "inline-block" }} />
      AI {scoreLabel(score)} · {score}
    </div>
  );
}

function ListingCard({ listing, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(listing)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#1a1f2e" : "#141824",
        border: `1px solid ${hovered ? "#2e3650" : "#1e2438"}`,
        borderRadius: 16, overflow: "hidden", cursor: "pointer",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 12px 40px #0008" : "0 2px 8px #0004",
      }}
    >
      <div style={{ position: "relative" }}>
        <img src={listing.img} alt={listing.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <AIBadge score={listing.aiScore} />
        </div>
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "#0009", backdropFilter: "blur(8px)",
          borderRadius: 8, padding: "2px 8px", fontSize: 11, color: "#aaa"
        }}>
          👁 {listing.views.toLocaleString()}
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#eef0f8", marginBottom: 4, lineHeight: 1.3 }}>{listing.title}</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#00e5a0", marginBottom: 8 }}>
          ₺{listing.price.toLocaleString("tr-TR")}
        </div>
        <div style={{ fontSize: 12, color: "#6b7494", marginBottom: 10 }}>📍 {listing.location} · {listing.date}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {listing.badges.map(b => (
            <span key={b} style={{
              background: "#1e2438", border: "1px solid #2e3650",
              borderRadius: 6, padding: "2px 7px", fontSize: 10, color: "#8899cc"
            }}>{b}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, color: "#6b7494" }}>
            👤 {listing.seller}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 700,
            color: listing.sellerScore >= 85 ? "#00e5a0" : listing.sellerScore >= 65 ? "#f5c842" : "#ff4d6d"
          }}>
            ★ {listing.sellerScore}/100
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ listing, onClose }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDeep, setAiDeep] = useState(null);
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const runDeepAnalysis = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Sen bir Türk ikinci el pazar güvenlik asistanısın. İlanları analiz ederek alıcıları dolandırıcılıktan korursun. Yanıtlarını Türkçe ver. JSON formatında yanıt ver, başka hiçbir şey yazma.",
          messages: [{
            role: "user",
            content: `Bu ilanı detaylı analiz et ve JSON döndür:
İlan: ${listing.title}
Fiyat: ₺${listing.price.toLocaleString("tr-TR")}
Konum: ${listing.location}
Açıklama: ${listing.desc}
Satıcı Puanı: ${listing.sellerScore}/100
Kategori: ${listing.category}

JSON formatı:
{
  "risk_seviyesi": "Düşük/Orta/Yüksek",
  "guvenskor": 0-100 arası sayı,
  "guclu_yonler": ["madde1", "madde2"],
  "dikkat_edilecekler": ["madde1", "madde2"],
  "tavsiyeler": ["madde1", "madde2"],
  "fiyat_degerlendirmesi": "kısa yorum",
  "bulusma_tavsiyesi": "kısa yorum"
}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content.map(i => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      setAiDeep(JSON.parse(clean));
    } catch (e) {
      setAiDeep({ error: "Analiz yüklenemedi." });
    }
    setAiLoading(false);
  };

  const sendQuestion = async () => {
    if (!question.trim()) return;
    const userMsg = question;
    setQuestion("");
    setChat(c => [...c, { role: "user", text: userMsg }]);
    setChatLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: `Sen güvenilir bir Türk ikinci el pazar asistanısın. Şu ilan hakkında sorulara cevap ver:
İlan: ${listing.title}, Fiyat: ₺${listing.price.toLocaleString("tr-TR")}, ${listing.desc}. Kısa ve net cevap ver.`,
          messages: [...chat.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: userMsg }]
        })
      });
      const data = await res.json();
      const text = data.content.map(i => i.text || "").join("");
      setChat(c => [...c, { role: "assistant", text }]);
    } catch {
      setChat(c => [...c, { role: "assistant", text: "Şu an yanıt veremiyorum." }]);
    }
    setChatLoading(false);
  };

  const color = scoreColor(listing.aiScore);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000c", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, backdropFilter: "blur(6px)"
    }} onClick={onClose}>
      <div style={{
        background: "#111520", border: "1px solid #1e2438",
        borderRadius: 20, maxWidth: 680, width: "100%", maxHeight: "90vh",
        overflowY: "auto", position: "relative"
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ position: "relative" }}>
          <img src={listing.img} alt="" style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: "20px 20px 0 0" }} />
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12, background: "#000a",
            border: "1px solid #333", borderRadius: "50%", width: 36, height: 36,
            color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
          }}>×</button>
        </div>

        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ color: "#eef0f8", fontSize: 22, fontWeight: 800, margin: 0 }}>{listing.title}</h2>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#00e5a0" }}>₺{listing.price.toLocaleString("tr-TR")}</div>
          </div>
          <div style={{ fontSize: 13, color: "#6b7494", marginBottom: 16 }}>📍 {listing.location} · {listing.date} · 👁 {listing.views.toLocaleString()} görüntülenme</div>
          <p style={{ color: "#8899cc", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{listing.desc}</p>

          {/* AI Skor Kutusu */}
          <div style={{
            background: `${color}0d`, border: `1px solid ${color}33`,
            borderRadius: 14, padding: 16, marginBottom: 16
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                border: `3px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 900, color
              }}>{listing.aiScore}</div>
              <div>
                <div style={{ color, fontWeight: 800, fontSize: 16 }}>AI Analizi: {scoreLabel(listing.aiScore)}</div>
                <div style={{ color: "#6b7494", fontSize: 12 }}>Otomatik ilan taraması</div>
              </div>
            </div>
            <p style={{ color: "#aab0cc", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{listing.aiNote}</p>
          </div>

          {/* Derin Analiz */}
          <button onClick={runDeepAnalysis} disabled={aiLoading} style={{
            width: "100%", padding: "12px", borderRadius: 12,
            background: "linear-gradient(135deg, #0d7a5f, #0a5fa8)",
            border: "none", color: "#fff", fontWeight: 700, fontSize: 14,
            cursor: aiLoading ? "wait" : "pointer", marginBottom: 16,
            opacity: aiLoading ? 0.7 : 1
          }}>
            {aiLoading ? "⏳ AI Analizi Yapılıyor..." : "🔍 Derin AI Güvenlik Analizi Yap"}
          </button>

          {aiDeep && !aiDeep.error && (
            <div style={{ background: "#0d1120", border: "1px solid #1e2438", borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center", flex: 1, minWidth: 80 }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: scoreColor(aiDeep.guvenskor) }}>{aiDeep.guvenskor}</div>
                  <div style={{ fontSize: 11, color: "#6b7494" }}>Güven Skoru</div>
                </div>
                <div style={{ flex: 3, minWidth: 200 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: scoreColor(aiDeep.guvenskor), marginBottom: 4 }}>
                    Risk: {aiDeep.risk_seviyesi}
                  </div>
                  <div style={{ fontSize: 12, color: "#8899cc" }}>💰 {aiDeep.fiyat_degerlendirmesi}</div>
                  <div style={{ fontSize: 12, color: "#8899cc", marginTop: 4 }}>🤝 {aiDeep.bulusma_tavsiyesi}</div>
                </div>
              </div>
              {[
                { title: "✅ Güçlü Yönler", items: aiDeep.guclu_yonler, color: "#00e5a0" },
                { title: "⚠️ Dikkat Edilecekler", items: aiDeep.dikkat_edilecekler, color: "#f5c842" },
                { title: "💡 Tavsiyeler", items: aiDeep.tavsiyeler, color: "#7eb3ff" },
              ].map(s => (
                <div key={s.title} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.title}</div>
                  {s.items?.map((item, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#8899cc", padding: "2px 0 2px 12px", borderLeft: `2px solid ${s.color}33` }}>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* AI Sohbet */}
          <div style={{ background: "#0d1120", border: "1px solid #1e2438", borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#7eb3ff", marginBottom: 10 }}>💬 Bu İlan Hakkında Soru Sor</div>
            <div style={{ maxHeight: 180, overflowY: "auto", marginBottom: 10 }}>
              {chat.length === 0 && (
                <div style={{ color: "#3a4060", fontSize: 12, textAlign: "center", padding: "20px 0" }}>
                  Örn: "Bu araç ekspertize değer mi?", "Fiyat pazarlığa açık mı?"
                </div>
              )}
              {chat.map((m, i) => (
                <div key={i} style={{
                  marginBottom: 8, textAlign: m.role === "user" ? "right" : "left"
                }}>
                  <span style={{
                    display: "inline-block", maxWidth: "85%", padding: "8px 12px",
                    borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    background: m.role === "user" ? "#1a3a6a" : "#1a2438",
                    color: "#d0d8f0", fontSize: 12, lineHeight: 1.5
                  }}>{m.text}</span>
                </div>
              ))}
              {chatLoading && <div style={{ color: "#3a5080", fontSize: 12 }}>⏳ Yanıt yazılıyor...</div>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendQuestion()}
                placeholder="Sorunuzu yazın..."
                style={{
                  flex: 1, background: "#141824", border: "1px solid #2e3650",
                  borderRadius: 10, padding: "9px 12px", color: "#d0d8f0",
                  fontSize: 13, outline: "none"
                }}
              />
              <button onClick={sendQuestion} style={{
                background: "#1a3a6a", border: "1px solid #2a5aaa",
                borderRadius: 10, padding: "9px 14px", color: "#7eb3ff",
                cursor: "pointer", fontWeight: 700, fontSize: 13
              }}>→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [showOnlySafe, setShowOnlySafe] = useState(false);

  const filtered = MOCK_LISTINGS.filter(l => {
    const catMatch = activeCat === "all" || l.category === activeCat;
    const searchMatch = l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    const safeMatch = !showOnlySafe || l.aiScore >= 80;
    return catMatch && searchMatch && safeMatch;
  }).sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "ai") return b.aiScore - a.aiScore;
    return b.id - a.id;
  });

  const stats = {
    total: MOCK_LISTINGS.length,
    safe: MOCK_LISTINGS.filter(l => l.aiScore >= 80).length,
    warn: MOCK_LISTINGS.filter(l => l.aiScore >= 60 && l.aiScore < 80).length,
    risk: MOCK_LISTINGS.filter(l => l.aiScore < 60).length,
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0b0e1a",
      fontFamily: "'Sora', 'Segoe UI', sans-serif", color: "#eef0f8"
    }}>
      {/* Top Nav */}
      <div style={{
        background: "#0d1020", borderBottom: "1px solid #1a1f35",
        padding: "0 24px", position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(12px)"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #00e5a0, #0a8fff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 900
            }}>◈</div>
            <div>
              <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: -0.5 }}>Güvenli</span>
              <span style={{ fontWeight: 900, fontSize: 17, color: "#00e5a0", letterSpacing: -0.5 }}>Pazar</span>
            </div>
            <span style={{
              background: "#00e5a015", border: "1px solid #00e5a033",
              borderRadius: 6, padding: "2px 8px", fontSize: 10,
              color: "#00e5a0", fontWeight: 700, marginLeft: 4
            }}>AI Destekli</span>
          </div>
          <div style={{ display: "flex", gap: 8, fontSize: 12, color: "#6b7494" }}>
            <span>🔒 Şeffaf</span>
            <span>🛡️ Güvenli</span>
            <span>🤖 AI Korumalı</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
        
        {/* Hero Stats */}
        <div style={{
          background: "linear-gradient(135deg, #0d1525, #0d1f35)",
          border: "1px solid #1a2840", borderRadius: 20,
          padding: "24px 28px", marginBottom: 24,
          display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between"
        }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px", letterSpacing: -0.5 }}>
              Türkiye'nin En Güvenli Pazarı
            </h1>
            <p style={{ color: "#6b7494", fontSize: 13, margin: 0 }}>
              Her ilan yapay zeka ile analiz edilir. Dolandırıcılığa sıfır tolerans.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { val: stats.total, label: "İlan", color: "#7eb3ff" },
              { val: stats.safe, label: "Güvenli", color: "#00e5a0" },
              { val: stats.warn, label: "Dikkatli", color: "#f5c842" },
              { val: stats.risk, label: "Riskli", color: "#ff4d6d" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#6b7494" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍  İlan ara..."
            style={{
              flex: 1, minWidth: 200, background: "#141824", border: "1px solid #2e3650",
              borderRadius: 12, padding: "11px 16px", color: "#eef0f8",
              fontSize: 14, outline: "none"
            }}
          />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            background: "#141824", border: "1px solid #2e3650", borderRadius: 12,
            padding: "11px 14px", color: "#8899cc", fontSize: 13, cursor: "pointer", outline: "none"
          }}>
            <option value="date">En Yeni</option>
            <option value="ai">AI Skoru</option>
            <option value="price_asc">Fiyat ↑</option>
            <option value="price_desc">Fiyat ↓</option>
          </select>
          <button
            onClick={() => setShowOnlySafe(!showOnlySafe)}
            style={{
              background: showOnlySafe ? "#00e5a015" : "#141824",
              border: `1px solid ${showOnlySafe ? "#00e5a0" : "#2e3650"}`,
              borderRadius: 12, padding: "11px 16px",
              color: showOnlySafe ? "#00e5a0" : "#6b7494",
              cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap"
            }}
          >
            🛡️ Sadece Güvenli
          </button>
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
              background: activeCat === c.id ? "#00e5a0" : "#141824",
              border: `1px solid ${activeCat === c.id ? "#00e5a0" : "#2e3650"}`,
              borderRadius: 10, padding: "8px 18px",
              color: activeCat === c.id ? "#0b0e1a" : "#8899cc",
              cursor: "pointer", fontSize: 13, fontWeight: activeCat === c.id ? 800 : 500,
              transition: "all 0.2s"
            }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16
        }}>
          {filtered.map(l => <ListingCard key={l.id} listing={l} onClick={setSelected} />)}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#3a4060", padding: 60, fontSize: 16 }}>
              Sonuç bulunamadı
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 48, textAlign: "center", color: "#2e3650", fontSize: 12,
          borderTop: "1px solid #1a1f35", paddingTop: 24
        }}>
          GüvenliPazar · Her ilan AI tarafından analiz edilir · Şeffaf · Güvenilir · 2025
        </div>
      </div>

      {selected && <DetailModal listing={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
