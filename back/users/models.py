from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


# Менеджер пользователей — управляет созданием обычных и суперпользователей
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email обязателен")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Шифруем пароль
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # Устанавливаем флаги администратора по умолчанию
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


# Кастомная модель пользователя, использующая email вместо username
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)  # Уникальный email — идентификатор пользователя
    is_active = models.BooleanField(default=True)  # Можно ли авторизоваться
    is_staff = models.BooleanField(default=False)  # Есть ли доступ в админку

    USERNAME_FIELD = 'email'  # Используется для логина (по умолчанию username)
    REQUIRED_FIELDS = []  # Поля, обязательные при создании суперпользователя через createsuperuser

    objects = UserManager()  # Подключаем кастомный менеджер

    def __str__(self):
        return self.email  # Удобное представление в админке и shell
