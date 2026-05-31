import hashlib

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import transaction
from django.utils import timezone


def company_group_name(company_name):
    digest = hashlib.sha256(company_name.encode("utf-8")).hexdigest()[:32]
    return f"company_updates_{digest}"


def get_instance_company_name(instance):
    if hasattr(instance, "company_name"):
        return instance.company_name

    user = getattr(instance, "user", None)
    if user is not None:
        return getattr(user, "company_name", "")

    employee = getattr(instance, "employee", None)
    if employee is not None:
        return getattr(employee, "company_name", "")

    return ""


def broadcast_data_change(instance, action):
    company_name = get_instance_company_name(instance)
    if not company_name:
        return

    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    payload = {
        "type": "data_changed",
        "model": instance._meta.label,
        "action": action,
        "record_id": instance.pk,
        "timestamp": timezone.now().isoformat(),
    }

    def send_update():
        async_to_sync(channel_layer.group_send)(
            company_group_name(company_name),
            {
                "type": "database.change",
                "payload": payload,
            },
        )

    transaction.on_commit(send_update)
