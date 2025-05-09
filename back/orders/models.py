from django.db import models
from django.conf import settings

class Order(models.Model):
    # Возможные статусы заказа
    STATUS_CHOICES = [
        ('waiting', 'Ожидание'),
        ('accepted', 'Принят'),
        ('in_progress', 'В процессе'),
        ('rejected', 'Отклонён'),
        ('payment_pending', 'Ожидание оплаты'),
    ]

    # Заказ привязан к пользователю. При удалении пользователя удалятся все его заказы.
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="orders"  # Позволяет обращаться к заказам пользователя через user.orders.all()
    )

    # Загруженный пользователем SVG-файл
    file = models.FileField(upload_to="orders/")

    # Тип обработки: вырезка или гравировка
    mode = models.CharField(
        max_length=20, 
        choices=[('cutting', 'Вырез'), ('engraving', 'Гравировка')]
    )

    # Материал и его толщина (например, фанера 3мм)
    material = models.CharField(max_length=100)
    thickness = models.CharField(max_length=50)

    # Размеры макета в сантиметрах
    width = models.DecimalField(max_digits=6, decimal_places=2)
    height = models.DecimalField(max_digits=6, decimal_places=2)

    # Общая стоимость
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # Текущий статус заказа
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='waiting'
    )

    #Работа 
    work = models.DecimalField(max_digits=10, decimal_places=2)

    # Стоимость лазерной обработки
    laser_work = models.DecimalField(max_digits=10, decimal_places=2)

    # Комментарий от клиента или оператора
    comment = models.TextField(blank=True, null=True)

    # Дата и время создания заказа (устанавливается автоматически)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Удобное текстовое представление объекта в админке и shell
        return f"Заказ #{self.pk} — {self.user.email}"
