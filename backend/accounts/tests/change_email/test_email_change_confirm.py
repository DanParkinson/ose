# Django
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

# Third Party
from allauth.account.models import EmailAddress
from rest_framework import status

# Local
from accounts.tests.change_email.base_email_change import (
    BaseEmailChangeTestCase,
)


class EmailChangeConfirmTests(BaseEmailChangeTestCase):
    """
    EMAIL CHANGE CONFIRM TEST CHECKLIST
    -----------------------------------
    Success
    - Verify valid uid/token updates user email
    - Verify pending email is cleared after success
    ----------------------------------
    Validation
    - Verify missing uid fails
    - Verify missing token fails
    - Verify invalid uid fails
    - Verify invalid token fails
    - Verify confirmation fails when no pending email exists
    ----------------------------------
    Businees Logic
    - Verify success creates verified primary email address
    - Verify success removes old email as primary
    - Verify confirmation cannot be used twice
    - Verify requesting again overwrites pending_email
    - Veirfy confirmation fails if pending email now belongs to another user
    """

    def test_valid_uid_and_token_updates_user_email(self):
        """
        Arrange: Create a user with a pending email change.

        Act: Submit a valid email change confirmation request.

        Assert: The user's email is updated to the pending email.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": uid,
                "token": token,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user.refresh_from_db()

        self.assertEqual(user.email, self.new_email)

    def test_successful_email_change_clears_pending_email(self):
        """
        Arrange: Create a user with a pending email change.

        Act: Submit a valid email change confirmation request.

        Assert: The user's pending email is cleared.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": uid,
                "token": token,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user.refresh_from_db()

        self.assertIsNone(user.pending_email)

    def test_validation_confirmation_without_pending_email_fails(self):
        """
        Arrange: Create a user without a pending email.

        Act: Submit a valid email change confirmation request.

        Assert: The request is rejected.
        """
        user = self.create_user(email=self.current_email)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": uid,
                "token": token,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        user.refresh_from_db()

        self.assertEqual(user.email, self.current_email)
        self.assertIsNone(user.pending_email)

    def test_validation_confirmation_without_uid_fails(self):
        """
        Arrange: Prepare a valid token but no uid.

        Act: Submit an email change confirmation request without uid.

        Assert: The request is rejected.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        token = default_token_generator.make_token(user)

        response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "token": token,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        user.refresh_from_db()

        self.assertEqual(user.email, self.current_email)
        self.assertEqual(user.pending_email, self.new_email)

    def test_validation_confirmation_without_token_fails(self):
        """
        Arrange: Create a user with a pending email change.

        Act: Submit an email change confirmation request without a token.

        Assert: The request is rejected.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        uid = urlsafe_base64_encode(force_bytes(user.pk))

        response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": uid,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        user.refresh_from_db()

        self.assertEqual(user.email, self.current_email)
        self.assertEqual(user.pending_email, self.new_email)

    def test_validation_confirmation_with_invalid_uid_fails(self):
        """
        Arrange: Prepare an invalid uid.

        Act: Submit an email change confirmation request.

        Assert: The request is rejected.
        """
        response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": "invalid-uid",
                "token": "invalid-token",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_validation_confirmation_with_invalid_token_fails(self):
        """
        Arrange: Create a user with a pending email change.

        Act: Submit an email change confirmation request with an invalid token.

        Assert: The request is rejected.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        uid = urlsafe_base64_encode(force_bytes(user.pk))

        response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": uid,
                "token": "invalid-token",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        user.refresh_from_db()

        self.assertEqual(user.email, self.current_email)

        self.assertEqual(user.pending_email, self.new_email)

    def test_successful_confirmation_creates_verified_primary_email_address(self):
        """
        Arrange: Create a user with a pending email change and an existing
        verified EmailAddress.

        Act: Submit a valid email change confirmation request.

        Assert: A verified primary EmailAddress exists for the new email.
        """
        user = self.create_user(email=self.current_email)

        EmailAddress.objects.create(
            user=user,
            email=self.current_email,
            primary=True,
            verified=True,
        )

        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": uid,
                "token": token,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        email_address = EmailAddress.objects.get(
            user=user,
            email=self.new_email,
        )

        self.assertTrue(email_address.primary)
        self.assertTrue(email_address.verified)

    def test_successful_confirmation_sets_old_email_address_not_primary(self):
        """
        Arrange: Create a user with a pending email change and an existing
        primary EmailAddress.

        Act: Submit a valid email change confirmation request.

        Assert: The old EmailAddress is no longer primary.
        """
        user = self.create_user(email=self.current_email)

        EmailAddress.objects.create(
            user=user,
            email=self.current_email,
            primary=True,
            verified=True,
        )

        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": uid,
                "token": token,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        old_email_address = EmailAddress.objects.get(
            user=user,
            email=self.current_email,
        )

        self.assertFalse(old_email_address.primary)

    def test_successful_confirmation_keeps_old_email_verified(self):
        """
        Arrange: Create a user with a pending email change and an existing
        verified EmailAddress.

        Act: Submit a valid email change confirmation request.

        Assert: The old EmailAddress remains verified.
        """
        user = self.create_user(email=self.current_email)

        EmailAddress.objects.create(
            user=user,
            email=self.current_email,
            primary=True,
            verified=True,
        )

        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": uid,
                "token": token,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        old_email = EmailAddress.objects.get(
            user=user,
            email=self.current_email,
        )

        self.assertTrue(old_email.verified)

    def test_email_change_confirmation_cannot_be_used_twice(self):
        """
        Arrange: Create a user with a pending email change.

        Act: Submit the same valid email change confirmation request twice.

        Assert: The first request succeeds and the second request is rejected.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        first_response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": uid,
                "token": token,
            },
            format="json",
        )

        second_response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": uid,
                "token": token,
            },
            format="json",
        )

        self.assertEqual(
            first_response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            second_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        user.refresh_from_db()

        self.assertEqual(
            user.email,
            self.new_email,
        )

        self.assertIsNone(user.pending_email)

    def test_new_email_change_request_overwrites_existing_pending_email(self):
        """
        Arrange: Create and authenticate a user with an existing pending email.

        Act: Submit a new email change request.

        Assert: The pending email is overwritten.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = "oldpending@example.com"
        user.save(update_fields=["pending_email"])
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.new_email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user.refresh_from_db()

        self.assertEqual(user.pending_email, self.new_email)

    def test_confirmation_fails_if_pending_email_now_belongs_to_another_user(self):
        """
        Arrange: Create a user with a pending email, then create another user
        with that pending email.

        Act: Submit a valid email change confirmation request.

        Assert: The request is rejected and the original email is unchanged.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = self.new_email
        user.save(update_fields=["pending_email"])

        self.create_user(email=self.new_email)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        response = self.client.post(
            self.get_email_change_confirm_url(),
            {
                "uid": uid,
                "token": token,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        user.refresh_from_db()

        self.assertEqual(user.email, self.current_email)
        self.assertEqual(user.pending_email, self.new_email)

    def test_new_email_change_request_sends_email_to_updated_pending_email(self):
        """
        Arrange: Create and authenticate a user with an existing pending email.

        Act: Submit a new email change request.

        Assert: The new verification email is sent to the updated pending email.
        """
        user = self.create_user(email=self.current_email)
        user.pending_email = "first@example.com"
        user.save(update_fields=["pending_email"])
        self.authenticate_user(user)

        response = self.client.post(
            self.get_email_change_request_url(),
            {"new_email": self.new_email},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(
            mail.outbox[-1].to,
            [self.new_email],
        )
