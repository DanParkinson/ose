from accounts.api.serializers import CustomUserDetailsSerializer
from accounts.tests.user_details.base_user_details import (
    BaseUserDetailsTestCase,
)

class UserDetailsSerializerTests(BaseUserDetailsTestCase):
    """
    USER DETAILS SERIALIZER TEST CHECKLIST
    --------------------------------------
    Field Exposure
    - Verify id field is returned
    - Verify email field is returned
    - Verify is_staff field is returned
    - Verify is_superuser field is returned

    --------------------------------------
    Field Exclusion
    - Verify password field is not returned
    - Verify username field is not returned
    """

    # =====================
    # Field Exposure
    # =====================

    def test_id_field_is_returned(self):
        """
        Arrange: Create a user and serialize it.
        Act: Read the serializer data.
        Assert: The id field is returned.
        """
        user = self.create_user(email=self.email)

        serializer = CustomUserDetailsSerializer(user)

        self.assertIn("id", serializer.data)

    def test_email_field_is_returned(self):
        """
        Arrange: Create a user and serialize it.
        Act: Read the serializer data.
        Assert: The email field is returned.
        """
        user = self.create_user(email=self.email)

        serializer = CustomUserDetailsSerializer(user)

        self.assertEqual(serializer.data["email"], self.email)

    def test_is_staff_field_is_returned(self):
        """
        Arrange: Create a user and serialize it.
        Act: Read the serializer data.
        Assert: The is_staff field is returned.
        """
        user = self.create_user(email=self.email)

        serializer = CustomUserDetailsSerializer(user)

        self.assertIn("is_staff", serializer.data)

    def test_is_superuser_field_is_returned(self):
        """
        Arrange: Create a user and serialize it.
        Act: Read the serializer data.
        Assert: The is_superuser field is returned.
        """
        user = self.create_user(email=self.email)

        serializer = CustomUserDetailsSerializer(user)

        self.assertIn("is_superuser", serializer.data)

    # =====================
    # Field Exclusion
    # =====================

    def test_password_field_is_not_returned(self):
        """
        Arrange: Create a user and serialize it.
        Act: Read the serializer data.
        Assert: The password field is not exposed.
        """
        user = self.create_user(email=self.email)

        serializer = CustomUserDetailsSerializer(user)

        self.assertNotIn("password", serializer.data)

    def test_username_field_is_not_returned(self):
        """
        Arrange: Create a user and serialize it.
        Act: Read the serializer data.
        Assert: The username field is not exposed.
        """
        user = self.create_user(email=self.email)

        serializer = CustomUserDetailsSerializer(user)

        self.assertNotIn("username", serializer.data)