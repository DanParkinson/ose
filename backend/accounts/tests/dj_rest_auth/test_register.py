from rest_framework import status

from accounts.tests.dj_rest_auth.base_dj_rest_auth import (
    BaseDJRestAuthTestCase,
)


class RegisterTests(BaseDJRestAuthTestCase):
    """
    REGISTER TEST CHECKLIST
    -----------------------
    Successful Registration
    - Verify user can register with email and password
    - Verify registration does not require username

    -----------------------
    Registration Validation
    - Verify missing email fails
    - Verify invalid email format fails
    - Verify missing password1 fails
    - Verify missing password2 fails
    - Verify password mismatch fails
    - Verify duplicate email fails
    """

    # =====================
    # Successful Registration
    # =====================

    def test_user_can_register_with_email_and_password(self):
        """
        Arrange: Prepare a valid registration payload.
        Act: Send a POST request to the registration endpoint.
        Assert: The user account is created successfully.
        """
        payload = self.get_registration_payload()

        response = self.client.post(
            self.get_registration_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(self.User.objects.filter(email=self.email).exists())

    def test_registration_does_not_require_username(self):
        """
        Arrange: Prepare a registration payload without a username field.
        Act: Send a POST request to the registration endpoint.
        Assert: Registration succeeds because email is used as the account identifier.
        """
        payload = self.get_registration_payload()

        response = self.client.post(
            self.get_registration_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # =====================
    # Registration Validation
    # =====================

    def test_registration_without_email_fails(self):
        """
        Arrange: Prepare a registration payload without an email.
        Act: Send a POST request to the registration endpoint.
        Assert: Registration fails because email is required.
        """
        payload = self.get_registration_payload()
        payload.pop("email")

        response = self.client.post(
            self.get_registration_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_with_invalid_email_fails(self):
        """
        Arrange: Prepare a registration payload with an invalid email format.
        Act: Send a POST request to the registration endpoint.
        Assert: Registration fails because email must be valid.
        """
        payload = self.get_registration_payload(email="not-an-email")

        response = self.client.post(
            self.get_registration_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_without_password1_fails(self):
        """
        Arrange: Prepare a registration payload without password1.
        Act: Send a POST request to the registration endpoint.
        Assert: Registration fails because password1 is required.
        """
        payload = self.get_registration_payload()
        payload.pop("password1")

        response = self.client.post(
            self.get_registration_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_without_password2_fails(self):
        """
        Arrange: Prepare a registration payload without password2.
        Act: Send a POST request to the registration endpoint.
        Assert: Registration fails because password2 is required.
        """
        payload = self.get_registration_payload()
        payload.pop("password2")

        response = self.client.post(
            self.get_registration_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_mismatch_registration_fails(self):
        """
        Arrange: Prepare a registration payload with different password values.
        Act: Send a POST request to the registration endpoint.
        Assert: Registration fails because both passwords must match.
        """
        payload = self.get_registration_payload(
            password1=self.password,
            password2="differentpass123",
        )

        response = self.client.post(
            self.get_registration_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_email_registration_fails(self):
        """
        Arrange: Create a user with an existing email address.
        Act: Attempt to register another user with the same email.
        Assert: Registration fails because email addresses must be unique.
        """
        self.create_user(email=self.email)

        payload = self.get_registration_payload()

        response = self.client.post(
            self.get_registration_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
