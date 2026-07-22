import Link from "next/link";
import { CalendarDays, MapPin, Plane, ShieldCheck } from "lucide-react";
import type { Tour } from "@/lib/api";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="tour-card">
      <Link href={`/tours/${tour.slug}`} className="tour-media" aria-label={tour.title}>
        <img src={tour.cover_image_url} alt={tour.title} />
        <span className="tour-badge">{tour.category.name}</span>
      </Link>
      <div className="tour-body">
        <div className="tour-location">
          <MapPin size={15} />
          {tour.destination.country}, {tour.destination.name}
        </div>
        <h3>{tour.title}</h3>
        <p>{tour.summary}</p>
        <div className="tour-meta">
          <span>
            <CalendarDays size={15} />
            {tour.duration_days} kun
          </span>
          <span>
            <Plane size={15} />
            {tour.departure_city}
          </span>
          <span>
            <ShieldCheck size={15} />
            {tour.visa_required ? "Viza kerak" : "Viza soddaroq"}
          </span>
        </div>
        <div className="tour-footer">
          <strong>
            {Number(tour.price_from).toLocaleString("en-US")} {tour.currency} dan
          </strong>
          <Link href={`/tours/${tour.slug}`}>Batafsil</Link>
        </div>
      </div>
    </article>
  );
}
