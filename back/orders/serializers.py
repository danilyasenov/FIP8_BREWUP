from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)  # Добавляем email
    class Meta:
        model = Order
        fields = "__all__"
        read_only_fields = ["user", "created_at"]
