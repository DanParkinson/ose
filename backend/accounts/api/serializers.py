from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomRegisterSerializer(RegisterSerializer):
    username = None

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "A user with this email address already exists."
            )

        return email


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "is_staff",
            "is_superuser",
        ]
