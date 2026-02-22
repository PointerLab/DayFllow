from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0005_customuser_is_approved"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="company_name",
            field=models.CharField(blank=True, default="", max_length=150),
        ),
    ]
