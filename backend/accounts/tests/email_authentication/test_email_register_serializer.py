from rest_framework.exceptions import ValidationError

from accounts.api.serializers import CustomRegisterSerializer
from accounts.tests.email_authentication.base_email_authentication import (
    BaseEmailAuthenticationTestCase,
)


class CustomRegisterSerializerTests(BaseEmailAuthenticationTestCase):
    """
    CUSTOM REGISTER SERIALIZER TEST CHECKLIST
    -----------------------------------------
    Serializer Configuration
    - Verify username field is removed

    -----------------------------------------
    Email Validation
    - Verify unique email passes validation
    - Verify duplicate email raises validation error
    - Verify duplicate email returns correct error message
    """

    # =====================
    # Serializer Configuration
    # =====================

    def test_username_field_is_removed(self):
        """
        Arrange: Instantiate the custom registration serializer.

        Act: Read the username attribute.

        Assert: The serializer does not use a username field.
        """
        serializer = CustomRegisterSerializer()

        self.assertIsNone(serializer.username)

    # =====================
    # Email Validation
    # =====================

    def test_unique_email_passes_validation(self):
        """
        Arrange: Instantiate the custom registration serializer.

        Act: Validate an email address that does not already exist.

        Assert: The email address is returned unchanged.
        """
        serializer = CustomRegisterSerializer()

        validated_email = serializer.validate_email(self.email)

        self.assertEqual(
            validated_email,
            self.email,
        )

    def test_duplicate_email_raises_validation_error(self):
        """
        Arrange: Create a user with an existing email address.

        Act: Attempt to validate the same email address.

        Assert: A validation error is raised.
        """
        self.create_user(email=self.email)

        serializer = CustomRegisterSerializer()

        with self.assertRaises(ValidationError):
            serializer.validate_email(self.email)

    def test_duplicate_email_returns_correct_error_message(self):
        """
        Arrange: Create a user with an existing email address.

        Act: Attempt to validate the same email address.

        Assert: The expected error message is returned.
        """
        self.create_user(email=self.email)

        serializer = CustomRegisterSerializer()

        try:
            serializer.validate_email(self.email)
        except ValidationError as error:
            self.assertIn(
                self.duplicate_email_error,
                error.detail,
            )
