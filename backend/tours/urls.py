from django.urls import path

from .views import (
    CategoryListView,
    ChatView,
    DestinationListView,
    HomeView,
    InquiryCreateView,
    TourDetailView,
    TourListView,
    api_root,
)

urlpatterns = [
    path("", api_root),
    path("home/", HomeView.as_view()),
    path("tours/", TourListView.as_view()),
    path("tours/<slug:slug>/", TourDetailView.as_view()),
    path("destinations/", DestinationListView.as_view()),
    path("categories/", CategoryListView.as_view()),
    path("inquiries/", InquiryCreateView.as_view()),
    path("chat/", ChatView.as_view()),
]
