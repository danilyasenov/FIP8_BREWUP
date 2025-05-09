from django.contrib import admin  # Импорт административной панели Django
from django.urls import path, include  # path — для маршрутов, include — для подключения других файлов urls.py
from django.conf import settings  # Настройки проекта
from django.conf.urls.static import static  # Для обслуживания статических/медийных файлов в режиме разработки

urlpatterns = [
    path("admin/", admin.site.urls),  # URL для доступа к админке Django
    path("api/", include("users.urls")),  # Подключение маршрутов из приложения users
    path("api/orders/", include("orders.urls")),  # Подключение маршрутов из приложения orders (ключевая часть API)
]

# В режиме отладки добавляем возможность обслуживать медиафайлы (например, загруженные изображения)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
