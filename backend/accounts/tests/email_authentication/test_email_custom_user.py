from accounts.tests.email_authentication.base_email_authentication import (
    BaseEmailAuthenticationTestCase,
)


class EmailCustomUserTests(BaseEmailAuthenticationTestCase):
    """
    EMAIL AUTHENTICATION USER MODEL TEST CHECKLIST
    ----------------------------------------------
    Field Configuration
    - Verify username field is removed
    - Verify email field exists
    - Verify email field is unique

    ----------------------------------------------
    Authentication Configuration
    - Verify USERNAME_FIELD is email
    - Verify REQUIRED_FIELDS is empty

    ----------------------------------------------
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

    def test_email_field_exists(self):
        """
        Arrange: Use the custom user model class.
        Act: Check whether the email field exists on the model.
        Assert: The email field is present.
        """
        field_names = [field.name for field in self.User._meta.fields]

        self.assertIn("email", field_names)

    def test_email_field_is_unique(self):
        """
        Arrange: Get the email field from the custom user model.
        Act: Read the field's unique configuration.
        Assert: The email field is configured as unique.
        """
        email_field = self.User._meta.get_field("email")

        self.assertTrue(email_field.unique)

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
        Assert: No additional fields are required when creating users.
        """
        self.assertEqual(self.User.REQUIRED_FIELDS, [])

    # =====================
    # String Representation
    # =====================

    def test_string_representation_returns_email(self):
        """
        Arrange: Create a user with an email address.
        Act: Convert the user object to a string.
        Assert: The string representation returns the user's email address.
        """
        user = self.create_user(email=self.email)

        self.assertEqual(str(user), self.email)
