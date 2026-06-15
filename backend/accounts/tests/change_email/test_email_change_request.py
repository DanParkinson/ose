# Django
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

# Third Party
from rest_framework import status

# Local
from accounts.tests.change_email.base_email_change import BaseEmailChangeTestCase


class EmailChangeRequestModelTests(BaseEmailChangeTestCase):
    """
    EMAIL CHANGE REQUEST TEST CHECKLIST
    -----------------------------------------
    Model Fields
    - Verify user can store a pending email
    -----------------------------------------
    Permissions
    - Verify authenticated user can request an email change
    - Verify unauthenticated user cannout request an email change
    -----------------------------------------
    Validation
    - Verify User cannot submit an empty email
    - Verify user cannot submit their current email
    - Verify User cannot submit invalid email
    - Verify User cannot submit existing email
    - Verify request does not change current email
    -----------------------------------------
    Pending Email
    - Verify Valid request stores pending_email
    - Verify Valid request does not update user.email
    -----------------------------------------
    Email Sending
    - Verify Valid request sends one email
    - Verify Email is sent to pending_email
    - Verify Email subject is correct
    - Verify Email body contains frontend confirm URL
    - Verify Email body contains uid
    - Verify Email body contains token
    """

    def test_model_user_can_store_pending_email(self):
        """
        Arrange: Create a user.

        Act: Set a pending email.

        Assert: The pending email is stored on the user.
        """
        user = self.create_user(email=self.current_email)

        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        user.refresh_from_db()

        self.assertEqual(user.pending_email, self.new_email)

    def test_request_authenticated_user_can_request_an_email_change(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit an email change request.

        Assert: The request succeeds and stores the pending email.
        """
        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.new_email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user.refresh_from_db()

        self.assertEqual(user.pending_email, self.new_email)

    def test_request_unauthenticated_user_cannot_request_an_email_change(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit an email change request.

        Assert: The request succeeds and stores the pending email.
        """

        self.unauthenticate()

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.new_email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_validation_user_cannot_submit_an_empty_email(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit an email change request without a new email.

        Assert: The request is rejected.
        """

        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(), {}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        user.refresh_from_db()

        self.assertIsNone(user.pending_email)

    def test_validation_user_cannot_submit_their_current_email(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit the user's current email as the new email.

        Assert: The request is rejected.
        """

        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.current_email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        user.refresh_from_db()

        self.assertIsNone(user.pending_email)

    def test_validation_user_cannot_submit_an_invalid_email(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit an invalid email address.

        Assert: The request is rejected.
        """

        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": "not-an-email"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        user.refresh_from_db()

        self.assertIsNone(user.pending_email)

    def test_validation_user_cannot_submit_existing_email_address(self):
        """
        Arrange: Create and authenticate a user, then create another user.

        Act: Submit the other user's email as the new email.

        Assert: The request is rejected.
        """
        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)
        self.create_user(email="existing@example.com")

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": "existing@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        user.refresh_from_db()

        self.assertIsNone(user.pending_email)

    def test_validation_email_change_request_does_not_update_current_email(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit a valid email change request.

        Assert: The user's current email is unchanged.
        """
        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.new_email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user.refresh_from_db()

        self.assertEqual(user.email, self.current_email)
        self.assertEqual(user.pending_email, self.new_email)

    def test_email_succesful_request_sends_an_email(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit a valid email change request.

        Assert: A verification email is sent to the new email address.
        """
        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.new_email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(mail.outbox), 1)

    def test_email_succesful_request_sends_email_to_pending_email(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit a valid email change request.

        Assert: The verification email is sent to the pending email address.
        """
        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.new_email},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            mail.outbox[0].to,
            [self.new_email],
        )

    def test_email_change_request_email_has_correct_subject(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit a valid email change request.

        Assert: The verification email has the correct subject.
        """
        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.new_email},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            mail.outbox[0].subject,
            "OSE: Verify your new email address",
        )

    def test_email_change_request_email_contains_frontend_url(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit a valid email change request.

        Assert: The verification email contains the frontend URL.
        """
        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.new_email},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertIn(
            settings.FRONTEND_URL,
            mail.outbox[0].body,
        )

    def test_email_change_request_email_contains_uid(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit a valid email change request.

        Assert: The verification email contains the encoded user id.
        """
        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.new_email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        uid = urlsafe_base64_encode(force_bytes(user.pk))

        self.assertIn(uid, mail.outbox[0].body)

    def test_email_change_request_email_contains_token(self):
        """
        Arrange: Create and authenticate a user.

        Act: Submit a valid email change request.

        Assert: The verification email contains the email change token.
        """
        user = self.create_user(email=self.current_email)
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.new_email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        token = default_token_generator.make_token(user)

        self.assertIn(token, mail.outbox[0].body)
