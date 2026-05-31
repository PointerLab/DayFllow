from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .notifications import company_group_name


class CompanyUpdatesConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if not getattr(user, "is_authenticated", False):
            await self.close(code=4401)
            return

        company_name = getattr(user, "company_name", "")
        if not company_name:
            await self.close(code=4403)
            return

        self.group_name = company_group_name(company_name)
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_json({"type": "connected"})

    async def disconnect(self, close_code):
        group_name = getattr(self, "group_name", None)
        if group_name:
            await self.channel_layer.group_discard(group_name, self.channel_name)

    async def database_change(self, event):
        await self.send_json(event["payload"])
