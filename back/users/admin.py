from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    model = User

    # Какие поля отображаются в списке пользователей
    list_display = ("email", "is_staff", "is_active")

    # Фильтры сбоку
    list_filter = ("is_staff", "is_active")

    # Сортировка и поиск
    ordering = ("email",)
    search_fields = ("email",)

    # Разметка полей при просмотре и редактировании пользователя
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {
            "fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")
        }),
    )

    # Разметка полей при создании нового пользователя через админку
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2", "is_staff", "is_active")
        }),
    )

# Регистрируем модель с кастомной админкой
admin.site.register(User, UserAdmin)
