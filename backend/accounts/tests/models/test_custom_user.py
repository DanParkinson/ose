from ..base import BaseAccountAPITestCase


class CustomUserModelTests(BaseAccountAPITestCase):
    """
    CUSTOM USER MODEL TEST CHECKLIST
    ------------------
    Field Configuration
    - Verify username field is removed
    - Verify email field exists and stores the user email
    - Verify email field is unique
    - Verify deactivated_at allows null values
    ------------------
    Authentication Configuration
    - Verify USERNAME_FIELD is email
    - Verify REQUIRED_FIELDS is empty
    ------------------
    String Representation
    - Verify __str__ returns the user's email address
    """

    # =====================
    # Field Configuration
    # =====================

    def test_username_field_is_removed(self):
        """
        Arrange: Use the custom user model class.
        Act: Check whether the username field exists on the model.
        Assert: The username field is not present because authentication uses email.
        """
        field_names = [field.name for field in self.User._meta.fields]

        self.assertNotIn("username", field_names)

    def test_email_field_stores_user_email(self):
        """
        Arrange: Use the default user from the base test setup.
        Act: Read the user's email field.
        Assert: The email field stores the expected email address.
        """
        self.assertEqual(self.user.email, "user@example.com")

    def test_email_field_is_unique(self):
        """
        Arrange: Get the email field from the custom user model.
        Act: Read the field's unique configuration.
        Assert: The email field is configured as unique.
        """
        email_field = self.User._meta.get_field("email")

        self.assertTrue(email_field.unique)

    def test_deactivated_at_allows_null_values(self):
        """
        Arrange: Get the deactivated_at field from the custom user model.
        Act: Read the field's null configuration.
        Assert: The field allows null values for active users.
        """
        deactivated_at_field = self.User._meta.get_field("deactivated_at")

        self.assertTrue(deactivated_at_field.null)

    def test_deactivated_at_allows_blank_values(self):
        """
        Arrange: Get the deactivated_at field from the custom user model.
        Act: Read the field's blank configuration.
        Assert: The field allows blank values in forms and admin usage.
        """
        deactivated_at_field = self.User._meta.get_field("deactivated_at")

        self.assertTrue(deactivated_at_field.blank)

    # =============================
    # Authentication Configuration
    # =============================

    def test_username_field_is_email(self):
        """
        Arrange: Use the custom user model class.
        Act: Read the USERNAME_FIELD value.
        Assert: The model uses email as the authentication identifier.
        """
        self.assertEqual(self.User.USERNAME_FIELD, "email")

    def test_required_fields_is_empty(self):
        """
        Arrange: Use the custom user model class.
        Act: Read the REQUIRED_FIELDS value.
        Assert: No extra fields are required when creating users or superusers.
        """
        self.assertEqual(self.User.REQUIRED_FIELDS, [])

    # =====================
    # String Representation
    # =====================

    def test_string_representation_returns_email(self):
        """
        Arrange: Use the default user from the base test setup.
        Act: Convert the user object to a string.
        Assert: The string representation returns the user's email address.
        """
        self.assertEqual(str(self.user), self.user.email)
