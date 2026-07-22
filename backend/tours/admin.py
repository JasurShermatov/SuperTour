from django.contrib import admin
from django.contrib.auth.models import Group

from .models import (
    DepartureDate,
    Destination,
    FAQ,
    Inquiry,
    ItineraryDay,
    SiteSetting,
    Testimonial,
    Tour,
    TourCategory,
)


class DepartureDateInline(admin.TabularInline):
    model = DepartureDate
    extra = 1
    fields = ("start_date", "end_date", "seats_available", "price_override", "status")


class ItineraryDayInline(admin.TabularInline):
    model = ItineraryDay
    extra = 1
    fields = ("day", "title", "description", "meals")


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "destination",
        "category",
        "price_from",
        "currency",
        "status",
        "is_featured",
        "updated_at",
    )
    list_filter = ("status", "is_featured", "destination", "category", "visa_required")
    search_fields = ("title", "summary", "destination__country", "destination__name")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("status", "is_featured")
    readonly_fields = ("created_at", "updated_at")
    inlines = [DepartureDateInline, ItineraryDayInline]
    list_per_page = 20
    actions = ["make_featured", "publish_selected", "archive_selected"]
    fieldsets = (
        ("Main content", {"fields": ("title", "slug", "destination", "category", "summary", "description")}),
        ("Commercial details", {"fields": ("duration_days", "duration_nights", "price_from", "currency", "departure_city", "group_size")}),
        ("Travel notes", {"fields": ("visa_required", "visa_note", "highlights", "included", "excluded")}),
        ("Media", {"fields": ("cover_image_url", "gallery")}),
        ("Publishing", {"fields": ("status", "is_featured", "sort_order", "created_at", "updated_at")}),
    )

    @admin.action(description="Tanlangan turlarni featured qilish")
    def make_featured(self, request, queryset):
        queryset.update(is_featured=True)

    @admin.action(description="Tanlangan turlarni publish qilish")
    def publish_selected(self, request, queryset):
        queryset.update(status=Tour.Status.PUBLISHED)

    @admin.action(description="Tanlangan turlarni archive qilish")
    def archive_selected(self, request, queryset):
        queryset.update(status=Tour.Status.ARCHIVED)


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ("country", "name", "best_season", "is_featured", "is_active", "sort_order")
    list_filter = ("is_featured", "is_active")
    search_fields = ("country", "name", "short_description")
    prepopulated_fields = {"slug": ("country", "name")}
    list_editable = ("is_featured", "is_active", "sort_order")
    list_per_page = 20


@admin.register(TourCategory)
class TourCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "icon", "is_active", "sort_order")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("is_active", "sort_order")
    search_fields = ("name", "description")
    list_per_page = 20


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "preferred_messenger", "tour", "status", "created_at")
    list_filter = ("status", "preferred_messenger", "created_at")
    search_fields = ("name", "phone", "email", "message", "tour__title")
    list_editable = ("status",)
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 25
    actions = ["mark_contacted", "mark_reserved", "mark_closed"]

    @admin.action(description="Tanlangan so'rovlarni Contacted qilish")
    def mark_contacted(self, request, queryset):
        queryset.update(status=Inquiry.Status.CONTACTED)

    @admin.action(description="Tanlangan so'rovlarni Reserved qilish")
    def mark_reserved(self, request, queryset):
        queryset.update(status=Inquiry.Status.RESERVED)

    @admin.action(description="Tanlangan so'rovlarni Closed qilish")
    def mark_closed(self, request, queryset):
        queryset.update(status=Inquiry.Status.CLOSED)


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "is_active", "sort_order")
    list_editable = ("is_active", "sort_order")
    search_fields = ("question", "answer")
    list_per_page = 20


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "destination", "rating", "is_active")
    list_filter = ("rating", "is_active")
    list_editable = ("is_active",)
    search_fields = ("name", "destination", "quote")
    list_per_page = 20


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("company_name", "phone", "working_hours", "updated_at")
    fieldsets = (
        ("Brand", {"fields": ("company_name", "tagline", "about", "ai_disclaimer")}),
        ("Contacts", {"fields": ("address", "working_hours", "phone", "email")}),
        ("Social links", {"fields": ("telegram_url", "instagram_url", "whatsapp_url")}),
    )


try:
    admin.site.unregister(Group)
except admin.sites.NotRegistered:
    pass
