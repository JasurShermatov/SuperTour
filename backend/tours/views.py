from django.conf import settings
from django.db.models import Count, Q
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Destination, FAQ, Inquiry, SiteSetting, Testimonial, Tour, TourCategory
from .serializers import (
    DestinationSerializer,
    FAQSerializer,
    InquirySerializer,
    SiteSettingSerializer,
    TestimonialSerializer,
    TourCategorySerializer,
    TourDetailSerializer,
    TourListSerializer,
)


def published_tours():
    return (
        Tour.objects.select_related("destination", "category")
        .prefetch_related("departures", "itinerary")
        .filter(status=Tour.Status.PUBLISHED)
    )


@api_view(["GET"])
def api_root(request):
    return Response(
        {
            "name": "SuperTour API",
            "endpoints": {
                "home": "/api/home/",
                "tours": "/api/tours/",
                "destinations": "/api/destinations/",
                "categories": "/api/categories/",
                "contact": "/api/inquiries/",
                "chat": "/api/chat/",
            },
        }
    )


class HomeView(APIView):
    def get(self, request):
        settings_obj = SiteSetting.objects.order_by("-updated_at").first()
        featured_tours = list(published_tours().filter(is_featured=True)[:8])
        fallback_tours = list(published_tours()[:8])
        data = {
            "settings": SiteSettingSerializer(settings_obj).data if settings_obj else None,
            "featured_tours": TourListSerializer(featured_tours or fallback_tours, many=True).data,
            "destinations": DestinationSerializer(
                Destination.objects.annotate(tours_count=Count("tours", filter=Q(tours__status=Tour.Status.PUBLISHED)))
                .filter(is_active=True, is_featured=True)[:8],
                many=True,
            ).data,
            "categories": TourCategorySerializer(TourCategory.objects.filter(is_active=True), many=True).data,
            "faqs": FAQSerializer(FAQ.objects.filter(is_active=True)[:8], many=True).data,
            "testimonials": TestimonialSerializer(Testimonial.objects.filter(is_active=True)[:6], many=True).data,
        }
        return Response(data)


class TourListView(generics.ListAPIView):
    serializer_class = TourListSerializer

    def get_queryset(self):
        queryset = published_tours()
        destination = self.request.query_params.get("destination")
        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search")
        featured = self.request.query_params.get("featured")

        if destination:
            queryset = queryset.filter(destination__slug=destination)
        if category:
            queryset = queryset.filter(category__slug=category)
        if featured in {"1", "true", "yes"}:
            queryset = queryset.filter(is_featured=True)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(summary__icontains=search)
                | Q(destination__country__icontains=search)
                | Q(destination__name__icontains=search)
            )
        return queryset


class TourDetailView(generics.RetrieveAPIView):
    serializer_class = TourDetailSerializer
    lookup_field = "slug"
    queryset = published_tours()


class DestinationListView(generics.ListAPIView):
    serializer_class = DestinationSerializer

    def get_queryset(self):
        return Destination.objects.annotate(
            tours_count=Count("tours", filter=Q(tours__status=Tour.Status.PUBLISHED))
        ).filter(is_active=True)


class CategoryListView(generics.ListAPIView):
    serializer_class = TourCategorySerializer
    queryset = TourCategory.objects.filter(is_active=True)


class InquiryCreateView(generics.CreateAPIView):
    serializer_class = InquirySerializer
    queryset = Inquiry.objects.all()


class ChatView(APIView):
    def post(self, request):
        message = str(request.data.get("message", "")).strip()
        if not message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        context = self._build_context()
        if not settings.OPENAI_API_KEY:
            return Response(
                {
                    "reply": self._offline_reply(message, context),
                    "mode": "offline",
                }
            )

        try:
            from openai import OpenAI

            client = OpenAI(api_key=settings.OPENAI_API_KEY, timeout=12)
            response = client.responses.create(
                model=settings.OPENAI_MODEL,
                instructions=self._instructions(),
                input=f"COMPANY_CONTEXT:\n{context}\n\nUSER_MESSAGE:\n{message}",
                max_output_tokens=450,
            )
            return Response({"reply": response.output_text, "mode": "openai"})
        except Exception as exc:  # noqa: BLE001 - user-facing fallback should be resilient.
            return Response(
                {
                    "reply": self._offline_reply(message, context),
                    "mode": "fallback",
                    "detail": str(exc),
                }
            )

    def _instructions(self) -> str:
        return (
            "You are SuperTour.uz website assistant. Answer in the user's language, usually Uzbek or Russian. "
            "Use only the provided company context and tours. Be fast, concise, helpful, and sales-oriented. "
            "If a fact is not confirmed, say it is not available in verified public/company data. "
            "Never invent founding year, number of countries, licenses, guarantees, or 24/7 support. "
            "When a user asks about a tour, recommend matching published tours and invite them to leave phone or WhatsApp."
        )

    def _build_context(self) -> str:
        site = SiteSetting.objects.order_by("-updated_at").first()
        tours = published_tours()[:20]
        lines = [
            "Company: SuperTour.uz is a modern travel agency operating in Tashkent, Uzbekistan.",
            "Confirmed caution: founding year and exact years of experience are not confirmed; do not claim them.",
        ]
        if site:
            lines.extend(
                [
                    f"About: {site.about}",
                    f"Address: {site.address}",
                    f"Working hours: {site.working_hours}",
                    f"Phone: {site.phone or 'not provided'}",
                ]
            )
        lines.append("Published tours:")
        for tour in tours:
            lines.append(
                f"- {tour.title}; destination: {tour.destination.country}/{tour.destination.name}; "
                f"category: {tour.category.name}; duration: {tour.duration_days} days/{tour.duration_nights} nights; "
                f"price from {tour.price_from} {tour.currency}; visa required: {tour.visa_required}; summary: {tour.summary}"
            )
        return "\n".join(lines)

    def _offline_reply(self, message: str, context: str) -> str:
        lowered = message.lower()
        if "necha yil" in lowered or "qachon" in lowered or "founded" in lowered:
            return (
                "SuperTour.uz bo'yicha tashkil topgan yil yoki aniq necha yildan beri ishlashi tasdiqlangan "
                "ma'lumotlar ichida yo'q. Shu sababli noto'g'ri fakt aytmayman. Saytdagi mavjud turlar va "
                "xizmatlar bo'yicha yordam bera olaman."
            )
        if "narx" in lowered or "price" in lowered or "tour" in lowered or "tur" in lowered:
            tours = published_tours()[:5]
            items = [
                f"{tour.title} - {tour.price_from} {tour.currency} dan, {tour.duration_days} kun"
                for tour in tours
            ]
            return "Hozir saytda ko'rinadigan turlardan ba'zilari: " + "; ".join(items)
        return (
            "SuperTour.uz Toshkentdagi turizm agentligi sifatida xalqaro turlar, mehmonxona, avia, transfer "
            "va viza bo'yicha maslahat xizmatlari bilan yordam beradi. Savolingizni yo'nalish, sana yoki budget "
            "bo'yicha yozsangiz, mos turlarni tavsiya qilaman."
        )
