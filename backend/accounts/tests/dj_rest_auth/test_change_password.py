from rest_framework import status

from accounts.tests.dj_rest_auth.base_dj_rest_auth import (
    BaseDJRestAuthTestCase,
)


class ChangePasswordTests(BaseDJRestAuthTestCase):
    """
    CHANGE PASSWORD TEST CHECKLIST
    ------------------------------
    Password Change
    - Verify authenticated user can change password
    - Verify old password no longer works
    - Verify new password works

    ------------------------------
    Validation
    - Verify unauthenticated user cannot change password
    - Verify incorrect old password fails
    - Verify mismatched new passwords fail
    """

    def get_password_change_url(self):
        return "/api/auth/password/change/"

    def get_password_change_payload(
        self,
        old_password=None,
        new_password1=None,
        new_password2=None,
    ):
        return {
            "old_password": old_password or self.password,
            "new_password1": new_password1 or "newtestpass123",
            "new_password2": new_password2 or "newtestpass123",
        }

    def test_authenticated_user_can_change_password(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit a password change request.

        Assert: The request succeeds.
        """
        user = self.create_user(email=self.email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_password_change_url(),
            self.get_password_change_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_is_changed_after_successful_request(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit a password change request.

        Assert: The user's password is updated.
        """
        user = self.create_user(email=self.email)
        self.authenticate_user(user)

        self.client.post(
            self.get_password_change_url(),
            self.get_password_change_payload(),
            format="json",
        )

        user.refresh_from_db()

        self.assertTrue(user.check_password("newtestpass123"))

    def test_unauthenticated_user_cannot_change_password(self):
        """
        Arrange: Ensure no user is authenticated.

        Act: Submit a password change request.

        Assert: The request is rejected.
        """
        self.unauthenticate()

        response = self.client.post(
            self.get_password_change_url(),
            self.get_password_change_payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_incorrect_old_password_fails(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit a password change request with the wrong old password.

        Assert: The request fails.
        """
        user = self.create_user(email=self.email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_password_change_url(),
            self.get_password_change_payload(old_password="wrongpass123"),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_mismatched_new_passwords_fail(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit a password change request with mismatched new passwords.

        Assert: The request fails.
        """
        user = self.create_user(email=self.email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_password_change_url(),
            self.get_password_change_payload(
                new_password1="newtestpass123",
                new_password2="differentpass123",
            ),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
