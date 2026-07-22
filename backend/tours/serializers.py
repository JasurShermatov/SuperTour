from rest_framework import serializers

from .models import DepartureDate, Destination, FAQ, Inquiry, ItineraryDay, SiteSetting, Testimonial, Tour, TourCategory


class TourCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TourCategory
        fields = ["id", "name", "slug", "icon", "description"]


class DestinationSerializer(serializers.ModelSerializer):
    tours_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Destination
        fields = [
            "id",
            "name",
            "country",
            "slug",
            "short_description",
            "description",
            "image_url",
            "best_season",
            "visa_note",
            "is_featured",
            "tours_count",
        ]


class DepartureDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartureDate
        fields = ["id", "start_date", "end_date", "seats_available", "price_override", "status"]


class ItineraryDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItineraryDay
        fields = ["id", "day", "title", "description", "meals"]


class TourListSerializer(serializers.ModelSerializer):
    destination = DestinationSerializer(read_only=True)
    category = TourCategorySerializer(read_only=True)
    next_departure = serializers.SerializerMethodField()

    class Meta:
        model = Tour
        fields = [
            "id",
            "title",
            "slug",
            "destination",
            "category",
            "summary",
            "duration_days",
            "duration_nights",
            "price_from",
            "currency",
            "departure_city",
            "group_size",
            "visa_required",
            "cover_image_url",
            "highlights",
            "is_featured",
            "next_departure",
        ]

    def get_next_departure(self, obj):
        departure = obj.departures.exclude(status="sold_out").order_by("start_date").first()
        return DepartureDateSerializer(departure).data if departure else None


class TourDetailSerializer(TourListSerializer):
    departures = DepartureDateSerializer(many=True, read_only=True)
    itinerary = ItineraryDaySerializer(many=True, read_only=True)

    class Meta(TourListSerializer.Meta):
        fields = TourListSerializer.Meta.fields + [
            "description",
            "visa_note",
            "gallery",
            "included",
            "excluded",
            "departures",
            "itinerary",
        ]


class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ["id", "name", "phone", "email", "preferred_messenger", "tour", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "name", "destination", "quote", "rating"]


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = [
            "company_name",
            "tagline",
            "about",
            "address",
            "working_hours",
            "phone",
            "telegram_url",
            "instagram_url",
            "whatsapp_url",
            "email",
            "ai_disclaimer",
        ]
