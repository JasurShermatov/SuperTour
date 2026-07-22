import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Check, MapPin, Plane, ShieldCheck, Users } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { getTour } from "@/lib/api";

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) notFound();

  return (
    <main className="tour-detail">
      <section className="tour-hero">
        <img src={tour.cover_image_url} alt={tour.title} />
        <div className="tour-hero-overlay" />
        <div className="tour-hero-content">
          <Link href="/destinations">Yo'nalishlarga qaytish</Link>
          <p>
            <MapPin size={16} />
            {tour.destination.country}, {tour.destination.name}
          </p>
          <h1>{tour.title}</h1>
          <span>
            {Number(tour.price_from).toLocaleString("en-US")} {tour.currency} dan
          </span>
        </div>
      </section>

      <section className="section detail-layout">
        <div className="detail-main">
          <div className="quick-facts">
            <span>
              <Calendar size={18} />
              {tour.duration_days} kun / {tour.duration_nights} tun
            </span>
            <span>
              <Plane size={18} />
              {tour.departure_city}dan
            </span>
            <span>
              <Users size={18} />
              {tour.group_size || "Individual / guruh"}
            </span>
            <span>
              <ShieldCheck size={18} />
              {tour.visa_required ? "Viza maslahati kerak" : "Viza soddaroq"}
            </span>
          </div>

          <div className="content-block">
            <h2>Tur haqida</h2>
            <p>{tour.description}</p>
          </div>

          <div className="content-block">
            <h2>Asosiy qulayliklar</h2>
            <div className="pill-list">
              {tour.highlights.map((item) => (
                <span key={item}>
                  <Check size={16} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="two-column">
            <div className="content-block">
              <h2>Narxga kiradi</h2>
              <ul>
                {(tour.included || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="content-block">
              <h2>Narxga kirmaydi</h2>
              <ul>
                {(tour.excluded || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {!!tour.itinerary?.length && (
            <div className="content-block">
              <h2>Dastur</h2>
              <div className="timeline">
                {tour.itinerary.map((day) => (
                  <article key={day.id}>
                    <span>{day.day}-kun</span>
                    <div>
                      <h3>{day.title}</h3>
                      <p>{day.description}</p>
                      {day.meals && <small>{day.meals}</small>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="booking-panel">
          <h2>Bron qilish so'rovi</h2>
          <p>Menejer sana, hotel va yakuniy narxni tasdiqlab beradi.</p>
          <InquiryForm tourId={tour.id} compact />
        </aside>
      </section>
    </main>
  );
}
