import Link from "next/link";
import { Clock3, MapPin, MessageSquareText, PhoneCall, ShieldCheck } from "lucide-react";
import { getHome } from "@/lib/api";

export async function Footer() {
  const data = await getHome();
  const settings = data.settings;

  return (
    <footer className="site-footer">
      <section className="footer-top">
        <div className="footer-brand">
          <img className="footer-logo" src="/supertour-logo.jpg" alt="SuperTour logo" />
          <div>
            <h2>SuperTour.uz</h2>
            <p>
              Sayohatni tushunarli rejalashtirish, qulay paketni tez tanlash va safar oldi savollariga aniq javob
              olish uchun yaratilgan tour platforma.
            </p>
          </div>
        </div>

        <div className="footer-trust">
          <span>
            <ShieldCheck size={18} />
            Tasdiqlangan xizmat tarkibi
          </span>
          <span>
            <MessageSquareText size={18} />
            Tezkor menejer aloqasi
          </span>
          <span>
            <Clock3 size={18} />
            {settings?.working_hours || "Dushanba - Shanba"}
          </span>
        </div>
      </section>

      <section className="footer-grid">
        <div>
          <h3>Navigatsiya</h3>
          <nav className="footer-links">
            <Link href="/">Bosh sahifa</Link>
            <Link href="/destinations">Yo'nalishlar</Link>
            <Link href="/about">Biz haqimizda</Link>
            <Link href="/contact">Kontakt</Link>
          </nav>
        </div>

        <div>
          <h3>Xizmatlar</h3>
          <ul className="footer-list">
            <li>Xalqaro tur paketlari</li>
            <li>Oilaviy va honeymoon turlar</li>
            <li>Hotel va transfer koordinatsiyasi</li>
            <li>Viza bo'yicha maslahat</li>
          </ul>
        </div>

        <div>
          <h3>Kontakt</h3>
          <ul className="footer-list contact">
            <li>
              <MapPin size={16} />
              {settings?.address}
            </li>
            <li>
              <PhoneCall size={16} />
              {settings?.phone || "+998 99 810 70 90"}
            </li>
            <li>
              <Clock3 size={16} />
              {settings?.working_hours}
            </li>
          </ul>
        </div>
      </section>

      <section className="footer-bottom">
        <span>Admin orqali dinamik boshqaruv, frontend orqali tez ko'rinish</span>
      </section>
    </footer>
  );
}
