from django.db import models
from accounts.models import CustomUser

class Attendance(models.Model):
    STATUS_CHOICES = (
        ("PRESENT", "Present"),
        ("HALF_DAY", "Half Day"),
        ("ABSENT", "Absent"),
        ("LEAVE", "Leave"),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    total_hours = models.FloatField(default=0.0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "date")

    def __str__(self):
        return f"{self.user.login_id} - {self.date}"
