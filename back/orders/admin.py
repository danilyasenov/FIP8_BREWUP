from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "material", "thickness", "mode", "price", "status", "created_at")
    list_filter = ("status", "material", "mode", "created_at")
    search_fields = ("user__email",)
    ordering = ("-created_at",)

    # ✅ разрешаем редактировать все поля
    fields = (
        "user", "file", "mode", "material", "thickness",
        "width", "height", "price", "status",
        "work", "laser_work", "comment", "created_at"
    )

    readonly_fields = ("created_at",)  # ⏱️ поле только для чтения
