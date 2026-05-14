from rest_framework import serializers

from accounts.api.serializers import CustomRegisterSerializer
from ..base import BaseAccountAPITestCase


class CustomRegisterSerializerTests(BaseAccountAPITestCase):
    """
    CUSTOM REGISTER SERIALIZER TEST CHECKLIST
    ------------------
    validate_email()
    - Verify duplicate email raises ValidationError
    - Verify unique email passes validation
    """

    # =====================
    # validate_email()
    # =====================

    def test_duplicate_email_raises_validation_error(self):
        """
        Arrange: Use an email address that already exists in the database.
        Act: Validate the email using the custom register serializer.
        Assert: A ValidationError is raised because duplicate emails are not allowed.
        """
        serializer = CustomRegisterSerializer()

        with self.assertRaises(serializers.ValidationError):
            serializer.validate_email(self.user.email)

    def test_unique_email_passes_validation(self):
        """
        Arrange: Prepare a unique email address that does not exist in the database.
        Act: Validate the email using the custom register serializer.
        Assert: The validated email is returned successfully.
        """
        serializer = CustomRegisterSerializer()

        email = serializer.validate_email("newuser@example.com")

        self.assertEqual(email, "newuser@example.com")
