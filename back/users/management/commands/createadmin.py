from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Создает суперпользователя'

    def handle(self, *args, **kwargs):
        if not User.objects.filter(email="admin@example.com").exists():
            User.objects.create_superuser(
                email="admin@example.com",
                password="adminpass"
            )
            self.stdout.write(self.style.SUCCESS("✅ Суперпользователь создан!"))
        else:
            self.stdout.write("ℹ️ Суперпользователь уже существует.")
