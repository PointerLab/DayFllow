from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0007_companyconfig"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="salary",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True),
        ),
    ]
