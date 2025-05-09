from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, PredictSVGView, download_order_file

router = DefaultRouter()
router.register(r"", OrderViewSet, basename="order")

urlpatterns = [
    # Эндпоинт для ML-предсказания типа SVG-файла (вырезка/гравировка)
    path("predict-svg/", PredictSVGView.as_view(), name="predict-svg"),

    # Эндпоинт для скачивания файла заказа по ID
    path("<int:pk>/download/", download_order_file, name="order-download"),

    # Подключаем все маршруты, автоматически сгенерированные для OrderViewSet
    path("", include(router.urls)),
]
