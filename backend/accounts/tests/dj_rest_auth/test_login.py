from rest_framework import status

from accounts.tests.dj_rest_auth.base_dj_rest_auth import (
    BaseDJRestAuthTestCase,
)


class LoginTests(BaseDJRestAuthTestCase):
    """
    LOGIN TEST CHECKLIST
    --------------------
    Successful Login
    - Verify user can login with valid email and password
    - Verify login does not require username

    --------------------
    Login Validation
    - Verify login without email fails
    - Verify login without password fails
    - Verify login with unknown email fails
    - Verify login with incorrect password fails
    - Verify Login without verification fails
    """

    # =====================
    # Successful Login
    # =====================

    def test_user_can_login_with_email_and_password(self):
        """
        Arrange: Create a user with a valid email and password.
        Act: Send a POST request to the login endpoint.
        Assert: Login succeeds.
        """
        user = self.create_user(email=self.email)
        self.create_verified_email(user)

        payload = self.get_login_payload()

        response = self.client.post(
            self.get_login_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_does_not_require_username(self):
        """
        Arrange: Create a user and prepare a login payload without username.
        Act: Send a POST request to the login endpoint.
        Assert: Login succeeds because email is used as the login identifier.
        """
        user = self.create_user(email=self.email)
        self.create_verified_email(user)

        payload = self.get_login_payload()

        response = self.client.post(
            self.get_login_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # =====================
    # Login Validation
    # =====================

    def test_login_without_email_fails(self):
        """
        Arrange: Prepare a login payload without an email.
        Act: Send a POST request to the login endpoint.
        Assert: Login fails because email is required.
        """
        payload = self.get_login_payload()
        payload.pop("email")

        response = self.client.post(
            self.get_login_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_without_password_fails(self):
        """
        Arrange: Prepare a login payload without a password.
        Act: Send a POST request to the login endpoint.
        Assert: Login fails because password is required.
        """
        payload = self.get_login_payload()
        payload.pop("password")

        response = self.client.post(
            self.get_login_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_unknown_email_fails(self):
        """
        Arrange: Prepare login credentials for an email that does not exist.
        Act: Send a POST request to the login endpoint.
        Assert: Login fails.
        """
        payload = self.get_login_payload(email="missing@example.com")

        response = self.client.post(
            self.get_login_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_incorrect_password_fails(self):
        """
        Arrange: Create a user with a known password.
        Act: Attempt to login using an incorrect password.
        Assert: Login fails.
        """
        self.create_user(email=self.email)

        payload = self.get_login_payload(password=self.invalid_password)

        response = self.client.post(
            self.get_login_url(),
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unverified_user_cannot_login(self):
        """
        Arrange: Create a user without a verified email address.
        Act: Attempt to login with valid credentials.
        Assert: Login fails because the email address is not verified.
        """
        self.create_user(email=self.email)

        payload = self.get_login_payload()

        response = self.client.post(
            self.get_login_url(),
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertIn(
            "verified",
            str(response.data).lower(),
        )