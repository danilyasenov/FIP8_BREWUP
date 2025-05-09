from django.urls import path
from .views import RegisterView, EmailTokenObtainPairView

urlpatterns = [
    # Эндпоинт для регистрации нового пользователя
    path("register/", RegisterView.as_view(), name="register"),

    # Эндпоинт для получения JWT токена по email и паролю
    path("token/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
]
