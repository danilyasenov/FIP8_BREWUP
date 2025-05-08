from rest_framework.viewsets import ModelViewSet
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated

class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
from django.http import FileResponse, Http404
from django.conf import settings
import os
from .models import Order

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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.core.files.storage import default_storage
import os
import pandas as pd
import joblib
from .ml_model import extract_features_from_svg
from django.conf import settings

class PredictSVGView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        svg_file = request.FILES.get("file")
        if not svg_file:
            return Response({"error": "No file provided"}, status=400)

        temp_path = default_storage.save(svg_file.name, svg_file)
        full_path = default_storage.path(temp_path)

        try:
            features = extract_features_from_svg(full_path)
            if not features:
                return Response({"error": "Invalid SVG"}, status=400)

            model_path = os.path.join(settings.BASE_DIR, "orders", "svg_model.pkl")
            model = joblib.load(model_path)

            df = pd.DataFrame([features])
            prediction = model.predict(df)[0]
            result = "cut" if prediction == 0 else "engrave"

            return Response({"result": result})
        finally:
            os.remove(full_path)
