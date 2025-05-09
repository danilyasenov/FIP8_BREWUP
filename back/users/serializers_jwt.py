from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Кастомный сериализатор для получения токена через email, а не username
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Подменяем username на email, чтобы использовать email для логина
        attrs["username"] = attrs.get("email")
        return super().validate(attrs)

    def get_token(self, user):
        # Добавляем email в payload токена
        token = super().get_token(user)
        token["email"] = user.email
        return token
