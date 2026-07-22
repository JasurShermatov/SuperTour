from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TourCategory(TimeStampedModel):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    icon = models.CharField(max_length=80, blank=True)
    description = models.TextField(blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "name"]
        verbose_name = "Tour category"
        verbose_name_plural = "Tour categories"

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Destination(TimeStampedModel):
    name = models.CharField(max_length=120)
    country = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    short_description = models.CharField(max_length=240)
    description = models.TextField(blank=True)
    image_url = models.URLField(max_length=600, blank=True)
    best_season = models.CharField(max_length=120, blank=True)
    visa_note = models.CharField(max_length=180, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "country", "name"]

    def __str__(self) -> str:
        return f"{self.country} - {self.name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.country}-{self.name}")
        super().save(*args, **kwargs)


class Tour(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    destination = models.ForeignKey(Destination, on_delete=models.PROTECT, related_name="tours")
    category = models.ForeignKey(TourCategory, on_delete=models.PROTECT, related_name="tours")
    summary = models.CharField(max_length=280)
    description = models.TextField()
    duration_days = models.PositiveIntegerField(default=7)
    duration_nights = models.PositiveIntegerField(default=6)
    price_from = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=8, default="USD")
    departure_city = models.CharField(max_length=80, default="Toshkent")
    group_size = models.CharField(max_length=80, blank=True)
    visa_required = models.BooleanField(default=False)
    visa_note = models.CharField(max_length=180, blank=True)
    cover_image_url = models.URLField(max_length=600)
    gallery = models.JSONField(default=list, blank=True)
    highlights = models.JSONField(default=list, blank=True)
    included = models.JSONField(default=list, blank=True)
    excluded = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    is_featured = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "-created_at"]

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class DepartureDate(TimeStampedModel):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        LIMITED = "limited", "Limited"
        SOLD_OUT = "sold_out", "Sold out"

    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="departures")
    start_date = models.DateField()
    end_date = models.DateField()
    seats_available = models.PositiveIntegerField(default=10)
    price_override = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)

    class Meta:
        ordering = ["start_date"]

    def __str__(self) -> str:
        return f"{self.tour.title} - {self.start_date:%d.%m.%Y}"


class ItineraryDay(TimeStampedModel):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name="itinerary")
    day = models.PositiveIntegerField()
    title = models.CharField(max_length=160)
    description = models.TextField()
    meals = models.CharField(max_length=120, blank=True)

    class Meta:
        ordering = ["tour", "day"]
        unique_together = ["tour", "day"]

    def __str__(self) -> str:
        return f"{self.tour.title} - day {self.day}"


class Inquiry(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        RESERVED = "reserved", "Reserved"
        CLOSED = "closed", "Closed"

    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=60)
    email = models.EmailField(blank=True)
    preferred_messenger = models.CharField(max_length=40, default="WhatsApp")
    tour = models.ForeignKey(Tour, on_delete=models.SET_NULL, null=True, blank=True, related_name="inquiries")
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Inquiries"

    def __str__(self) -> str:
        return f"{self.name} - {self.phone}"


class FAQ(TimeStampedModel):
    question = models.CharField(max_length=180)
    answer = models.TextField()
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["sort_order", "question"]

    def __str__(self) -> str:
        return self.question


class Testimonial(TimeStampedModel):
    name = models.CharField(max_length=120)
    destination = models.CharField(max_length=120, blank=True)
    quote = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name


class SiteSetting(TimeStampedModel):
    company_name = models.CharField(max_length=120, default="SuperTour.uz")
    tagline = models.CharField(max_length=180, default="Dunyo bo'ylab sayohatingizni rejalashtiring")
    about = models.TextField()
    address = models.CharField(max_length=240)
    working_hours = models.CharField(max_length=120, default="Dushanba - Shanba, 09:00 - 18:00")
    phone = models.CharField(max_length=80, blank=True)
    telegram_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    whatsapp_url = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    ai_disclaimer = models.CharField(
        max_length=220,
        default="Assistant faqat tasdiqlangan kompaniya ma'lumotlari va saytdagi turlar asosida javob beradi.",
    )

    class Meta:
        verbose_name = "Site setting"
        verbose_name_plural = "Site settings"

    def __str__(self) -> str:
        return self.company_name
