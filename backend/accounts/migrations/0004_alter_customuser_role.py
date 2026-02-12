from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_customuser_department_customuser_employment_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="role",
            field=models.CharField(
                choices=[
                    ("ADMIN", "Admin"),
                    ("HR", "HR"),
                    ("EMP", "Employee"),
                    ("INT", "Intern"),
                ],
                default="EMP",
                max_length=10,
            ),
        ),
    ]
