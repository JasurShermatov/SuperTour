import { BadgeCheck, Building2, HeartHandshake, Plane, ShieldCheck } from "lucide-react";
import { getHome } from "@/lib/api";

export default async function AboutPage() {
  const data = await getHome();
  const settings = data.settings;

  return (
    <main className="page">
      <section className="page-hero about-hero">
        <p className="eyebrow">
          <Building2 size={16} />
          About SuperTour
        </p>
        <h1>Sayohat qarorini osonlashtiradigan zamonaviy turizm xizmati.</h1>
        <p>{settings?.about}</p>
      </section>

      <section className="section about-story">
        <div>
          <p className="eyebrow dark">Biz haqimizda</p>
          <h2>Sayohat agentligi faqat paket sotmaydi, u qaror qabul qilishni ham osonlashtiradi.</h2>
        </div>
        <p>
          Yaxshi tur sayti foydalanuvchiga faqat chiroyli rasm emas, balki ishonch ham berishi kerak. Shu sababli
          SuperTour sahifalarida yo'nalish, davomiylik, price-from, aloqa va FAQ bloklari bir-birini to'ldiradi.
        </p>
      </section>

      <section className="section values-grid">
        <article>
          <Plane size={24} />
          <h2>Tur paketlar</h2>
          <p>Xalqaro yo'nalishlar bo'yicha avia, hotel, transfer va maslahatni bir jarayonda jamlaymiz.</p>
        </article>
        <article>
          <ShieldCheck size={24} />
          <h2>Faktlarda ehtiyotkorlik</h2>
          <p>Tasdiqlanmagan yillar, raqamlar yoki reklama claimlari o'rniga aniq xizmat va real turlar ko'rsatiladi.</p>
        </article>
        <article>
          <BadgeCheck size={24} />
          <h2>Admin’dan boshqaruv</h2>
          <p>Yo'nalish, narx, sana, itinerary, FAQ va mijoz so'rovlari Django admin orqali tartibli boshqariladi.</p>
        </article>
        <article>
          <HeartHandshake size={24} />
          <h2>Sodiqlik</h2>
          <p>Mijozlar qulayligi, aniq maslahat va ortiqcha va'dalardan qochish xizmat madaniyatining markazida turadi.</p>
        </article>
      </section>
    </main>
  );
}
