import { Clock, MapPin, Phone } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { getHome } from "@/lib/api";

export default async function ContactPage() {
  const data = await getHome();
  const settings = data.settings;

  return (
    <main className="page">
      <section className="page-hero compact-hero">
        <p className="eyebrow">
          <Phone size={16} />
          Contact
        </p>
        <h1>Sayohatingiz bo'yicha so'rov qoldiring</h1>
        <p>Menejer yo'nalish, sana, hotel va yakuniy narx bo'yicha siz bilan bog'lanadi.</p>
      </section>

      <section className="section contact-layout">
        <div className="contact-info">
          <article>
            <MapPin size={22} />
            <div>
              <span>Office</span>
              <strong>{settings?.address}</strong>
            </div>
          </article>
          <article>
            <Clock size={22} />
            <div>
              <span>Ish vaqti</span>
              <strong>{settings?.working_hours}</strong>
            </div>
          </article>
          <article>
            <Phone size={22} />
            <div>
              <span>Telefon</span>
              <strong>{settings?.phone || "Admin panelda qo'shiladi"}</strong>
            </div>
          </article>
        </div>
        <div className="contact-form-shell">
          <h2>So'rov formasi</h2>
          <InquiryForm />
        </div>
      </section>
    </main>
  );
}
