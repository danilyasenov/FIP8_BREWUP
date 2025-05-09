from rest_framework import serializers
from .models import User

# Сериализатор для регистрации нового пользователя
class RegisterSerializer(serializers.ModelSerializer):
    # Пароль доступен только для записи и должен быть не короче 6 символов
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["email", "password"]

    def create(self, validated_data):
        # Создаём пользователя через кастомный менеджер
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user
