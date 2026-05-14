from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

User = get_user_model()


class AccountDeactivateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.is_active = False
        user.deactivated_at = timezone.now()
        user.save(update_fields=["is_active", "deactivated_at"])

        response = Response(
            {"detail": "Account deactivated successfully."},
            status=status.HTTP_200_OK,
        )

        response.delete_cookie("access")
        response.delete_cookie("refresh")

        return response


class ReactivationRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if email:
            try:
                user = User.objects.get(email=email, is_active=False)

                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)

                reactivation_url = (
                    f"http://localhost:5173/reactivate-account/{uid}/{token}/"
                )

                send_mail(
                    subject="Reactivate your account",
                    message=f"""Hello,

You requested to reactivate your account.

Click the link below to reactivate your account:

{reactivation_url}

If you did not request this, you can ignore this email.

Thanks,
OSE
""",
                    from_email="webmaster@localhost",
                    recipient_list=[user.email],
                )

            except User.DoesNotExist:
                pass

        return Response(
            {
                "detail": "If a deactivated account exists with that email, a reactivation link has been sent."
            },
            status=status.HTTP_200_OK,
        )


class ReactivationConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id, is_active=False)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response(
                {"detail": "Invalid reactivation link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"detail": "Invalid or expired reactivation link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = True
        user.deactivated_at = None
        user.save(update_fields=["is_active", "deactivated_at"])

        return Response(
            {"detail": "Account reactivated successfully."},
            status=status.HTTP_200_OK,
        )
