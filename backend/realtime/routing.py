from django.urls import path

from .consumers import CompanyUpdatesConsumer


websocket_urlpatterns = [
    path("ws/updates/", CompanyUpdatesConsumer.as_asgi()),
]
