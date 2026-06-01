from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class CustomAccountAdapter(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context):
        context["frontend_url"] = settings.FRONTEND_URL
        return super().send_mail(template_prefix, email, context)