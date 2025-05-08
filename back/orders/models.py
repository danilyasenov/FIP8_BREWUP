from django.db import models
from django.conf import settings

class Order(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Ожидание'),
        ('accepted', 'Принят'),
        ('in_progress', 'В процессе'),
        ('rejected', 'Отклонён'),
         ('payment_pending', 'Ожидание оплаты'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    
    file = models.FileField(upload_to="orders/")

    mode = models.CharField(max_length=20, choices=[('cutting', 'Вырез'), ('engraving', 'Гравировка')])
    material = models.CharField(max_length=100)
    thickness = models.CharField(max_length=50)

    width = models.DecimalField(max_digits=6, decimal_places=2)
    height = models.DecimalField(max_digits=6, decimal_places=2)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')

    work = models.DecimalField(max_digits=10, decimal_places=2)
    laser_work = models.DecimalField(max_digits=10, decimal_places=2)

    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Заказ #{self.pk} — {self.user.email}"
