from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, PredictSVGView, download_order_file

router = DefaultRouter()
router.register(r"", OrderViewSet, basename="order")

urlpatterns = [
    path("predict-svg/", PredictSVGView.as_view(), name="predict-svg"),
    path("<int:pk>/download/", download_order_file, name="order-download"),
    path("", include(router.urls)),
]
