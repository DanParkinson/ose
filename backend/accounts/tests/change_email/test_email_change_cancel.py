from rest_framework import status

from accounts.tests.change_email.base_email_change import (
    BaseEmailChangeTestCase,
)


class EmailChangeCancelTests(BaseEmailChangeTestCase):
    """
    EMAIL CHANGE CANCEL TEST CHECKLIST
    ----------------------------------

    Cancel
    - Verify authenticated user can cancel pending email change
    - Verify cancelling does not change the current email
    - Verify unauthenticated user cannot cancel pending email change
    """

    def test_authenticated_user_can_cancel_pending_email_change(self):
        """
        Arrange: Create and authenticate a user with a pending email change.

        Act: Submit an email change cancel request.

        Assert: The request succeeds and pending email is cleared.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_cancel_url(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user.refresh_from_db()

        self.assertIsNone(user.pending_email)

    def test_cancel_email_change_does_not_change_current_email(self):
        """
        Arrange: Create and authenticate a user with a pending email change.

        Act: Submit an email change cancel request.

        Assert: The user's current email remains unchanged.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_cancel_url(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user.refresh_from_db()

        self.assertEqual(user.email, self.current_email)

    def test_unauthenticated_user_cannot_cancel_pending_email_change(self):
        """
        Arrange: Create a user with a pending email change.

        Act: Submit an email change cancel request without authentication.

        Assert: The request is rejected and the pending email remains.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        response = self.client.post(
            self.get_email_change_cancel_url(),
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        user.refresh_from_db()

        self.assertEqual(
            user.pending_email,
            self.new_email,
        )
