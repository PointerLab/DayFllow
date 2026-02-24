from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0006_customuser_company_name"),
    ]

    operations = [
        migrations.CreateModel(
            name="CompanyConfig",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("company_name", models.CharField(db_index=True, max_length=150, unique=True)),
                ("departments", models.JSONField(blank=True, default=list)),
                ("roles", models.JSONField(blank=True, default=list)),
                ("employment_types", models.JSONField(blank=True, default=list)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "created_by",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="company_configs_created",
                        to="accounts.customuser",
                    ),
                ),
                (
                    "updated_by",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="company_configs_updated",
                        to="accounts.customuser",
                    ),
                ),
            ],
        ),
    ]
