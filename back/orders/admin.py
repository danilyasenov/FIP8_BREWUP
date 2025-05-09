from django.contrib import admin
from .models import Order

# Регистрируем модель Order в админке с кастомной конфигурацией
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # Поля, которые будут отображаться в списке заказов
    list_display = ("id", "user", "material", "thickness", "mode", "price", "status", "created_at")

    # Фильтры сбоку для удобной навигации
    list_filter = ("status", "material", "mode", "created_at")

    # Возможность искать заказы по email пользователя
    search_fields = ("user__email",)

    # Сортировка по дате создания (сначала новые)
    ordering = ("-created_at",)

    # Поля, доступные для редактирования при просмотре/редактировании заказа
    fields = (
        "user", "file", "mode", "material", "thickness",
        "width", "height", "price", "status",
        "work", "laser_work", "comment", "created_at"
    )

    # created_at только для чтения (автоматически проставляется)
    readonly_fields = ("created_at",)
