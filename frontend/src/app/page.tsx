import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, Clock, MessageCircle, Search, Shield, Sparkles, Star } from "lucide-react";
import { MovingStrip } from "@/components/MovingStrip";
import { TourCard } from "@/components/TourCard";
import { getHome, getTours } from "@/lib/api";

export default async function Home() {
  const [data, allTours] = await Promise.all([getHome(), getTours()]);
  const settings = data.settings;
  const visibleTours = allTours.slice(0, 9);

  return (
    <main>
      <section className="hero">
        <img
          className="hero-bg"
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80"
          alt="Sea coast"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">
            <Sparkles size={16} />
            Toshkentdan mashhur yo'nalishlarga
          </p>
          <h1>{settings?.tagline || "Sayohat rejalashtiryapsizmi? SuperTour bilan bu yanada oson, tez va ilhomli."}</h1>
          <p className="hero-copy">
            SuperTour.uz orqali oilaviy dam olish, honeymoon, city break va guruhli turlarni bir nechta aniq variant
            ko'rinishida solishtiring, mosini tanlang va so'rov yuboring.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="#tours">
              <Search size={18} />
              Turlarni ko'rish
            </Link>
            <Link className="ghost-button" href="/contact">
              <MessageCircle size={18} />
              Maslahat olish
            </Link>
          </div>
          <div className="hero-points">
            <span>
              <CheckCircle2 size={17} />
              Paket tarkibi tushunarli
            </span>
            <span>
              <Shield size={17} />
              Viza va hujjatlar bo'yicha yo'l-yo'riq
            </span>
            <span>
              <Star size={17} />
              Family, premium va honeymoon yo'nalishlar
            </span>
          </div>
        </div>
        <div className="hero-strip">
          <span>
            <BadgeCheck size={18} />
            Admin orqali dinamik turlar
          </span>
          <span>
            <Clock size={18} />
            {settings?.working_hours || "Dushanba - Shanba"}
          </span>
          <span>
            <MessageCircle size={18} />
            AI assistant
          </span>
        </div>
      </section>
      <MovingStrip />

      <section className="section intro-grid">
        <div>
          <p className="eyebrow dark">SuperTour.uz</p>
          <h2>Safar tanlashdan so'rov yuborishgacha ko'rinishi aniq, hissi esa yengil bo'lgan tajriba.</h2>
        </div>
        <p>
          Saytda tasdiqlanmagan katta claimlar o'rniga foydalanuvchi uchun foydali bo'lgan yo'nalish, narx, davomiylik,
          paket tarkibi va aloqa nuqtalari kuchli ko'rinadi. Har bir tur admin paneldan boshqariladi: narx, sana,
          yo'nalish, itinerary, FAQ va so'rovlar.
        </p>
      </section>

      <section className="section" id="tours">
        <div className="section-head">
          <div>
            <p className="eyebrow dark">Popular tours</p>
            <h2>Yangi va tavsiya etilgan paketlar</h2>
          </div>
          <Link className="text-link" href="/destinations">
            Barcha yo'nalishlar <ArrowRight size={16} />
          </Link>
        </div>
        <div className="tour-grid">
          {visibleTours.map((tour) => (
            <TourCard tour={tour} key={tour.id} />
          ))}
        </div>
      </section>

      <section className="section muted">
        <div className="section-head">
          <div>
            <p className="eyebrow dark">Destinations</p>
            <h2>Ommabop yo'nalishlar</h2>
          </div>
        </div>
        <div className="destination-grid">
          {data.destinations.map((destination) => (
            <Link className="destination-tile" href={`/destinations?destination=${destination.slug}`} key={destination.id}>
              <img src={destination.image_url} alt={destination.name} />
              <span>{destination.country}</span>
              <strong>{destination.name}</strong>
              <small>{destination.best_season}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="section trust-band" id="trust">
        <div className="section-head">
          <div>
            <p className="eyebrow dark">Safety & trust</p>
            <h2>Sayohat oldidan xotirjamlik beradigan muhim nuqtalar</h2>
          </div>
        </div>
        <div className="safety-grid">
          <article>
            <strong>Variantlar aniq tushuntiriladi</strong>
            <p>Tur tarkibi, davomiylik va qaysi xizmatlar paketga kirishi oldindan tushuntiriladi.</p>
          </article>
          <article>
            <strong>Mijozlar qulayligi birinchi o'rinda</strong>
            <p>Budget, sana va odam soniga mos variantlar tavsiya qilinadi, ortiqcha chalkashlik kamaytiriladi.</p>
          </article>
          <article>
            <strong>Aloqa uzilmaydi</strong>
            <p>So'rov yuborgandan keyin menejer marshrut va keyingi bosqichlarni qisqa va aniq izohlaydi.</p>
          </article>
          <article>
            <strong>Faktlarda ehtiyotkorlik</strong>
            <p>Tasdiqlanmagan yillar yoki ortiqcha claimlar emas, mavjud xizmatlar va real yo'nalishlar ko'rsatiladi.</p>
          </article>
        </div>
      </section>

      <section className="section values-showcase">
        <div>
          <p className="eyebrow dark">Why choose us</p>
          <h2>Qadriyatlarimiz sayohat xizmatining ichidan ko'rinib turadi.</h2>
        </div>
        <div className="value-cards">
          <article>
            <h3>Mijozlar qulayligi</h3>
            <p>Ko'p variant orasidan adashmaslik uchun paketlar aniq, tartibli va solishtirishga qulay ko'rsatiladi.</p>
          </article>
          <article>
            <h3>Ishonchli aloqa</h3>
            <p>So'rov, tasdiq va safar oldi savollarida mijoz tez javob kutadi. Shu ritm service markazida turadi.</p>
          </article>
          <article>
            <h3>Sodiqlik va aniqlik</h3>
            <p>Qaysi ma'lumot tasdiqlangan bo'lsa o'sha ko'rsatiladi. Bu uzoq muddatli ishonchni oshiradi.</p>
          </article>
          <article>
            <h3>Moslashuvchan paketlar</h3>
            <p>Family, honeymoon, premium yoki qisqa city break bo'lsin, har biriga mos variantlar tayyorlanadi.</p>
          </article>
        </div>
      </section>

      <section className="section testimonial-wall">
        <div className="section-head">
          <div>
            <p className="eyebrow dark">Client voice</p>
            <h2>Mijozlar taassurotlari</h2>
          </div>
        </div>
        <div className="testimonial-grid">
          {data.testimonials.map((item) => (
            <article key={item.id}>
              <p>"{item.quote}"</p>
              <strong>{item.name}</strong>
              <span>{item.destination}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section faq-layout" id="faq">
        <div>
          <p className="eyebrow dark">FAQ</p>
          <h2>Ko'p so'raladigan savollar</h2>
          <p className="section-copy">
            Mijozlar odatda narx, viza, bronlash va safar oldi jarayonlari haqida so'rashadi. Shu savollarni bir joyga
            jamladik.
          </p>
        </div>
        <div className="faq-list">
          {data.faqs.map((faq) => (
            <article key={faq.id}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
