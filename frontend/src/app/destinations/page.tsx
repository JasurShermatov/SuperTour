import { MapPin } from "lucide-react";
import { TourCard } from "@/components/TourCard";
import { getDestinations, getTours } from "@/lib/api";

export default async function DestinationsPage() {
  const [destinations, tours] = await Promise.all([getDestinations(), getTours()]);

  return (
    <main className="page">
      <section className="page-hero compact-hero">
        <p className="eyebrow">
          <MapPin size={16} />
          Yo'nalishlar
        </p>
        <h1>Mashhur sayohat yo'nalishlari</h1>
        <p>Davlat, mavsum va tur formatiga qarab mos paketni tanlang.</p>
      </section>

      <section className="section">
        <div className="destination-grid">
          {destinations.map((destination) => (
            <article className="destination-tile static" key={destination.id}>
              <img src={destination.image_url} alt={destination.name} />
              <span>{destination.country}</span>
              <strong>{destination.name}</strong>
              <small>{destination.short_description}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow dark">Tours</p>
            <h2>Barcha faol tur paketlari</h2>
          </div>
        </div>
        <div className="tour-grid">
          {tours.map((tour) => (
            <TourCard tour={tour} key={tour.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
