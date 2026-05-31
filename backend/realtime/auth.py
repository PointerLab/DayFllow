from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import UntypedToken


@database_sync_to_async
def get_user_for_token(raw_token):
    if not raw_token:
        return AnonymousUser()

    try:
        validated_token = UntypedToken(raw_token)
        user_id = validated_token.get(api_settings.USER_ID_CLAIM)
        if user_id is None:
            return AnonymousUser()

        lookup = {api_settings.USER_ID_FIELD: user_id, "is_active": True}
        return get_user_model().objects.get(**lookup)
    except (InvalidToken, TokenError, get_user_model().DoesNotExist):
        return AnonymousUser()


class QueryStringJWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        token = parse_qs(query_string).get("token", [""])[0]
        scope["user"] = await get_user_for_token(token)
        return await self.app(scope, receive, send)
