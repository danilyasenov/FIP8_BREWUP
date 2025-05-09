# === Сторонние библиотеки ===
import os
import pandas as pd
import joblib

# === Django ===
from django.http import FileResponse, Http404
from django.core.files.storage import default_storage
from django.conf import settings

# === Django REST Framework ===
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated

# === Внутренние импорты ===
from .models import Order
from .serializers import OrderSerializer
from .ml_model import extract_features_from_svg


# --- ViewSet для заказов ---
class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Возвращаем только заказы текущего пользователя, отсортированные по дате
        return Order.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        # Автоматически присваиваем пользователя при создании заказа
        serializer.save(user=self.request.user)


# --- Скачивание файла, прикреплённого к заказу ---
def download_order_file(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        file_path = order.file.path

        if not os.path.exists(file_path):
            raise Http404("Файл не найден")

        return FileResponse(
            open(file_path, 'rb'),
            as_attachment=True,
            filename=os.path.basename(file_path)
        )

    except Order.DoesNotExist:
        raise Http404("Заказ не найден")


# --- Предсказание: вырезка или гравировка (на основе SVG) ---
class PredictSVGView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        svg_file = request.FILES.get("file")
        if not svg_file:
            return Response({"error": "No file provided"}, status=400)

        # Сохраняем SVG временно
        temp_path = default_storage.save(svg_file.name, svg_file)
        full_path = default_storage.path(temp_path)

        try:
            features = extract_features_from_svg(full_path)
            if not features:
                return Response({"error": "Invalid SVG"}, status=400)

            # Загружаем обученную модель
            model_path = os.path.join(settings.BASE_DIR, "orders", "svg_model.pkl")
            model = joblib.load(model_path)

            df = pd.DataFrame([features])
            prediction = model.predict(df)[0]
            result = "cut" if prediction == 0 else "engrave"

            return Response({"result": result})
        finally:
            os.remove(full_path)
