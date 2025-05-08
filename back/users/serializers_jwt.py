from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # заменяем "username" на "email"
        attrs["username"] = attrs.get("email")
        return super().validate(attrs)

    def get_token(self, user):
        token = super().get_token(user)
        token["email"] = user.email
        return token
