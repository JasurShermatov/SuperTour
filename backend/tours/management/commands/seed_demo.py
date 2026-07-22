from datetime import date, timedelta

from django.core.management.base import BaseCommand

from tours.models import DepartureDate, Destination, FAQ, ItineraryDay, SiteSetting, Testimonial, Tour, TourCategory


IMAGE = {
    "turkey": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=80",
    "dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
    "egypt": "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1400&q=80",
    "thailand": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1400&q=80",
    "bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80",
    "georgia": "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1400&q=80",
    "saudi": "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1400&q=80",
    "europe": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1400&q=80",
}


class Command(BaseCommand):
    help = "Seed SuperTour demo content for the test project."

    def handle(self, *args, **options):
        self.create_settings()
        categories = self.create_categories()
        destinations = self.create_destinations()
        self.create_tours(categories, destinations)
        self.create_supporting_content()
        self.stdout.write(self.style.SUCCESS("Demo content seeded."))

    def create_settings(self):
        SiteSetting.objects.update_or_create(
            id=1,
            defaults={
                "company_name": "SuperTour.uz",
                "tagline": "Sayohat rejalashtiryapsizmi? SuperTour bilan bu yanada oson, aniq va ilhomli.",
                "about": (
                    "SuperTour.uz O'zbekistonda faoliyat yurituvchi zamonaviy turizm kompaniyasi bo'lib, "
                    "mijozlarga mashhur xalqaro yo'nalishlar bo'yicha sayohat xizmatlarini taqdim etadi. "
                    "Kompaniya dam olish, oilaviy sayohatlar, honeymoon, guruhli va individual turlarni "
                    "tashkil etishga ixtisoslashgan. Har bir safarda qulay marshrut, aniq tushuntirilgan "
                    "xizmat tarkibi va safar davomida tez aloqa ustuvor ahamiyatga ega."
                ),
                "address": "Yunusobod tumani, Yangishahar ko'chasi 10, 2-qavat, 210-xona, Toshkent.",
                "working_hours": "Dushanba - Shanba, 09:00 - 18:00",
                "phone": "+998 99 810 70 90",
                "telegram_url": "https://t.me/supertouruz",
                "instagram_url": "https://www.instagram.com/supertour_uz/",
                "whatsapp_url": "https://wa.me/998998107090",
            },
        )

    def create_categories(self):
        rows = [
            ("Beach holidays", "Palma", "Plyaj va dam olish sayohatlari"),
            ("Family tours", "Users", "Oilaviy va bolalar bilan qulay turlar"),
            ("Honeymoon", "Heart", "Romantik honeymoon paketlari"),
            ("City breaks", "Building2", "Qisqa muddatli shahar sayohatlari"),
            ("Ziyorat", "Landmark", "Ziyorat va madaniy safarlar"),
            ("Premium", "Gem", "VIP va premium servisga urg'u berilgan turlar"),
            ("Adventure", "Mountain", "Faol dam olish va yangi tajriba izlovchilar uchun"),
        ]
        result = {}
        for order, (name, icon, description) in enumerate(rows, start=1):
            category, _ = TourCategory.objects.update_or_create(
                name=name,
                defaults={"icon": icon, "description": description, "sort_order": order, "is_active": True},
            )
            result[name] = category
        return result

    def create_destinations(self):
        rows = [
            ("Antalya", "Turkiya", "Dengiz, resort mehmonxonalar va oilaviy hordiq.", IMAGE["turkey"], "May - Oktyabr", False),
            ("Dubai", "BAA", "Shahar, shopping, plyaj va premium servis.", IMAGE["dubai"], "Oktyabr - Aprel", True),
            ("Sharm El Sheikh", "Misr", "Qizil dengiz, snorkeling va all-inclusive resortlar.", IMAGE["egypt"], "Yil davomida", False),
            ("Phuket", "Tailand", "Tropik orollar, dengiz va tungi bozorlar.", IMAGE["thailand"], "Noyabr - Mart", True),
            ("Bali", "Indoneziya", "Tabiat, villalar, okean va honeymoon atmosferasi.", IMAGE["bali"], "Aprel - Oktyabr", True),
            ("Tbilisi", "Gruziya", "Qisqa city break, tog'lar va gastronomiya.", IMAGE["georgia"], "Mart - Noyabr", False),
            ("Makka va Madina", "Saudiya Arabistoni", "Ziyorat dasturi va tashkiliy yordam.", IMAGE["saudi"], "Yil davomida", True),
            ("Praga - Vena - Budapesht", "Yevropa", "Shengen asosidagi klassik Yevropa marshruti.", IMAGE["europe"], "Aprel - Dekabr", True),
            ("Kuala Lumpur", "Malayziya", "Shahar ritmi, tropik dam olish va oila uchun qulay paket.", IMAGE["thailand"], "Noyabr - Aprel", True),
            ("Doha", "Qatar", "Qisqa premium city break va tranzit dam olish kombinatsiyasi.", IMAGE["dubai"], "Oktyabr - Mart", True),
            ("Ho Chi Minh", "Vetnam", "Budget-friendly Osiyo city break va dengiz kombinatsiyasi.", IMAGE["thailand"], "Noyabr - Mart", True),
            ("Baku", "Ozarbayjon", "Yaqin yo'nalish, qisqa dam olish va gastronomik safar.", IMAGE["georgia"], "Mart - Noyabr", False),
        ]
        result = {}
        for order, (name, country, short, image, season, visa_required) in enumerate(rows, start=1):
            destination, _ = Destination.objects.update_or_create(
                name=name,
                country=country,
                defaults={
                    "short_description": short,
                    "description": f"{country} yo'nalishi SuperTour mijozlari uchun mos paketlar asosida tanlanadi.",
                    "image_url": image,
                    "best_season": season,
                    "visa_note": "Viza bo'yicha maslahat kerak" if visa_required else "Odatda soddaroq kirish tartibi",
                    "is_featured": order <= 6,
                    "is_active": True,
                    "sort_order": order,
                },
            )
            result[country] = destination
        return result

    def create_tours(self, categories, destinations):
        rows = [
            ("Antalya Family Resort", destinations["Turkiya"], categories["Family tours"], 649, 7, 6, False, IMAGE["turkey"]),
            ("Dubai Urban Escape", destinations["BAA"], categories["City breaks"], 520, 5, 4, True, IMAGE["dubai"]),
            ("Sharm All Inclusive", destinations["Misr"], categories["Beach holidays"], 480, 7, 6, False, IMAGE["egypt"]),
            ("Phuket Tropical Week", destinations["Tailand"], categories["Beach holidays"], 740, 8, 7, True, IMAGE["thailand"]),
            ("Bali Honeymoon Villa", destinations["Indoneziya"], categories["Honeymoon"], 1180, 8, 7, True, IMAGE["bali"]),
            ("Georgia Weekend", destinations["Gruziya"], categories["City breaks"], 390, 4, 3, False, IMAGE["georgia"]),
            ("Umra Comfort Package", destinations["Saudiya Arabistoni"], categories["Ziyorat"], 1290, 10, 9, True, IMAGE["saudi"]),
            ("Classic Europe Trio", destinations["Yevropa"], categories["City breaks"], 1550, 8, 7, True, IMAGE["europe"]),
            ("Kuala Lumpur Discovery", destinations["Malayziya"], categories["Family tours"], 860, 7, 6, True, IMAGE["thailand"]),
            ("Doha Premium Escape", destinations["Qatar"], categories["Premium"], 970, 5, 4, True, IMAGE["dubai"]),
            ("Vietnam Explorer", destinations["Vetnam"], categories["Adventure"], 830, 8, 7, True, IMAGE["thailand"]),
            ("Baku Smart Weekend", destinations["Ozarbayjon"], categories["City breaks"], 420, 4, 3, False, IMAGE["georgia"]),
        ]
        today = date.today()
        for order, (title, destination, category, price, days, nights, visa, image) in enumerate(rows, start=1):
            tour, _ = Tour.objects.update_or_create(
                title=title,
                defaults={
                    "destination": destination,
                    "category": category,
                    "summary": f"{destination.country} bo'yicha {days} kunlik puxta rejalashtirilgan turpaket.",
                    "description": (
                        "Ushbu paket mehmonxona tanlash, avia variantlarni solishtirish, transfer va safar "
                        "oldi maslahatlarini bir joyda olishni xohlaydigan mijozlar uchun tuzilgan. "
                        "Kompaniya turlarni bronlashdan oldin marshrut, xizmat tarkibi va qulay variantlar "
                        "bo'yicha aniq tushuntirish beradi."
                    ),
                    "duration_days": days,
                    "duration_nights": nights,
                    "price_from": price,
                    "currency": "USD",
                    "departure_city": "Toshkent",
                    "group_size": "2-12 kishi",
                    "visa_required": visa,
                    "visa_note": "Viza bo'yicha hujjatlar ro'yxati menejer tomonidan tushuntiriladi." if visa else "",
                    "cover_image_url": image,
                    "gallery": [image],
                    "highlights": ["Mehmonxona tanlash", "Transfer koordinatsiyasi", "Avia maslahat", "Menejer kuzatuvi", "Mos paket tavsiyasi"],
                    "included": ["Mehmonxona", "Transfer", "Tur bo'yicha maslahat", "Bronlash yordami", "Yo'nalish bo'yicha checklist"],
                    "excluded": ["Shaxsiy xarajatlar", "Sug'urta", "Viza to'lovi", "Qo'shimcha ekskursiyalar", "Bagaj upgrade"],
                    "status": Tour.Status.PUBLISHED,
                    "is_featured": order <= 8,
                    "sort_order": order,
                },
            )
            for index in range(3):
                start = today + timedelta(days=21 + index * 18 + order)
                DepartureDate.objects.update_or_create(
                    tour=tour,
                    start_date=start,
                    defaults={
                        "end_date": start + timedelta(days=days - 1),
                        "seats_available": 8 - index,
                        "status": DepartureDate.Status.OPEN if index < 2 else DepartureDate.Status.LIMITED,
                    },
                )
            for day in range(1, min(days, 4) + 1):
                ItineraryDay.objects.update_or_create(
                    tour=tour,
                    day=day,
                    defaults={
                        "title": ["Uchish va joylashish", "Shahar bilan tanishuv", "Erkin kun", "Qaytishga tayyorgarlik"][day - 1],
                        "description": "Menejer tavsiyasi asosida kunlik reja va qulay vaqtlar kelishiladi.",
                        "meals": "Nonushta" if day > 1 else "",
                    },
                )

    def create_supporting_content(self):
        faqs = [
            ("SuperTour.uz necha yildan beri ishlaydi?", "Ochiq manbalarda tashkil topgan yil tasdiqlanmagani uchun aniq yil ko'rsatilmaydi."),
            ("Tur narxiga nimalar kiradi?", "Har bir paketda tarkib farq qiladi. Odatda mehmonxona, transfer va bronlash yordami ko'rsatiladi."),
            ("Viza bo'yicha yordam bormi?", "Viza talab qilinadigan yo'nalishlarda hujjatlar bo'yicha maslahat beriladi."),
            ("Tourni online bron qilsam bo'ladimi?", "Sayt orqali so'rov qoldirasiz, menejer siz bilan bog'lanib aniq sanalar va narxni tasdiqlaydi."),
            ("To'lovni qanday amalga oshiraman?", "Bronlash shartlari va to'lov bosqichlari menejer tomonidan paketga qarab tushuntiriladi."),
            ("Oilaviy tur tavsiya qilasizmi?", "Ha, bolalar bilan qulay hotel va uchish jadvali asosida oilaviy variantlar tavsiya qilinadi."),
            ("Individual paket bormi?", "Ha, sana, budget va servis darajasiga qarab individual paket tayyorlash mumkin."),
            ("Safar oldidan nima bo'ladi?", "Menejer kerakli hujjatlar, voucher, uchish va transfer bo'yicha qisqa yo'riqnoma beradi."),
        ]
        for order, (question, answer) in enumerate(faqs, start=1):
            FAQ.objects.update_or_create(question=question, defaults={"answer": answer, "sort_order": order, "is_active": True})

        testimonials = [
            ("Madina", "Dubai", "Menejerlar variantlarni tez solishtirib berdi, oilamizga mos hotel topildi."),
            ("Akmal", "Antalya", "Bolalar bilan qulay paket tanladik. Transfer va joylashish masalasida hammasi tushunarli bo'ldi."),
            ("Dilnoza", "Bali", "Honeymoon uchun sokin va chiroyli villa varianti tavsiya qilindi."),
            ("Javohir", "Phuket", "Safar oldidan ham, safar davomida ham javob tez bo'ldi. Paket ancha tartibli edi."),
            ("Nigina", "Europe", "Shengen hujjatlari bo'yicha yo'naltirish tushunarli bo'ldi, marshrut ham qulay tanlangan."),
            ("Aziza", "Umra", "Dastur va joylashish oldindan aniq tushuntirilgani uchun o'zimizni xotirjam his qildik."),
        ]
        for name, destination, quote in testimonials:
            Testimonial.objects.update_or_create(
                name=name,
                destination=destination,
                defaults={"quote": quote, "rating": 5, "is_active": True},
            )
