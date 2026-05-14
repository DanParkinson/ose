from django.db import IntegrityError

from ..base import BaseAccountAPITestCase


class CustomUserManagerTests(BaseAccountAPITestCase):
    """
    CUSTOM USER MANAGER TEST CHECKLIST
    ------------------
    create_user()
    - Verify a regular user can be created with an email and password
    - Verify email is required when creating a user
    - Verify email is normalized before saving
    - Verify password is hashed
    - Verify extra fields are saved correctly
    ------------------
    create_superuser()
    - Verify a superuser can be created successfully
    - Verify superuser has is_staff=True
    - Verify superuser has is_superuser=True
    - Verify superuser has is_active=True
    - Verify create_superuser raises ValueError if is_staff=False
    - Verify create_superuser raises ValueError if is_superuser=False
    ------------------
    Email Uniqueness
    - Verify duplicate email addresses cannot be used
    """

    # =================
    # create_user()
    # =================

    def test_create_user_creates_regular_user(self):
        """
        Arrange: Prepare a valid email and password.
        Act: Create a regular user using the custom user manager.
        Assert: The user is created with the expected email address.
        """
        user = self.User.objects.create_user(
            email="newuser@example.com",
            password="testpass123",
        )

        self.assertEqual(user.email, "newuser@example.com")

    def test_create_user_requires_email(self):
        """
        Arrange: Prepare an empty email value.
        Act: Attempt to create a user without an email address.
        Assert: A ValueError is raised because email is required.
        """
        with self.assertRaises(ValueError):
            self.User.objects.create_user(
                email="",
                password="testpass123",
            )

    def test_create_user_normalizes_email(self):
        """
        Arrange: Prepare an email address with an uppercase domain.
        Act: Create a regular user using the custom user manager.
        Assert: The saved email address has a normalized lowercase domain.
        """
        user = self.User.objects.create_user(
            email="newuser@EXAMPLE.COM",
            password="testpass123",
        )

        self.assertEqual(user.email, "newuser@example.com")

    def test_create_user_hashes_password(self):
        """
        Arrange: Prepare a valid email and plain text password.
        Act: Create a regular user using the custom user manager.
        Assert: The stored password is hashed and still validates correctly.
        """
        user = self.User.objects.create_user(
            email="newuser@example.com",
            password="testpass123",
        )

        self.assertNotEqual(user.password, "testpass123")
        self.assertTrue(user.check_password("testpass123"))

    def test_create_user_saves_extra_fields(self):
        """
        Arrange: Prepare a valid user payload with an extra field.
        Act: Create a regular user with is_active set to False.
        Assert: The extra field is saved on the created user.
        """
        user = self.User.objects.create_user(
            email="newuser@example.com",
            password="testpass123",
            is_active=False,
        )

        self.assertFalse(user.is_active)

    # =================
    # create_superuser()
    # =================

    def test_create_superuser_creates_superuser(self):
        """
        Arrange: Prepare a valid email and password.
        Act: Create a superuser using the custom user manager.
        Assert: The superuser is created with the expected email address.
        """
        superuser = self.User.objects.create_superuser(
            email="newadmin@example.com",
            password="testpass123",
        )

        self.assertEqual(superuser.email, "newadmin@example.com")

    def test_create_superuser_sets_is_staff_true(self):
        """
        Arrange: Prepare a valid email and password.
        Act: Create a superuser using the custom user manager.
        Assert: The created superuser has is_staff set to True.
        """
        superuser = self.User.objects.create_superuser(
            email="newadmin@example.com",
            password="testpass123",
        )

        self.assertTrue(superuser.is_staff)

    def test_create_superuser_sets_is_superuser_true(self):
        """
        Arrange: Prepare a valid email and password.
        Act: Create a superuser using the custom user manager.
        Assert: The created superuser has is_superuser set to True.
        """
        superuser = self.User.objects.create_superuser(
            email="newadmin@example.com",
            password="testpass123",
        )

        self.assertTrue(superuser.is_superuser)

    def test_create_superuser_sets_is_active_true(self):
        """
        Arrange: Prepare a valid email and password.
        Act: Create a superuser using the custom user manager.
        Assert: The created superuser has is_active set to True.
        """
        superuser = self.User.objects.create_superuser(
            email="newadmin@example.com",
            password="testpass123",
        )

        self.assertTrue(superuser.is_active)

    def test_create_superuser_requires_is_staff_true(self):
        """
        Arrange: Prepare a superuser payload with is_staff set to False.
        Act: Attempt to create a superuser using the custom user manager.
        Assert: A ValueError is raised because superusers must have staff access.
        """
        with self.assertRaises(ValueError):
            self.User.objects.create_superuser(
                email="newadmin@example.com",
                password="testpass123",
                is_staff=False,
            )

    def test_create_superuser_requires_is_superuser_true(self):
        """
        Arrange: Prepare a superuser payload with is_superuser set to False.
        Act: Attempt to create a superuser using the custom user manager.
        Assert: A ValueError is raised because superusers must have superuser access.
        """
        with self.assertRaises(ValueError):
            self.User.objects.create_superuser(
                email="newadmin@example.com",
                password="testpass123",
                is_superuser=False,
            )

    # =================
    # Email Uniqueness
    # =================

    def test_duplicate_email_raises_integrity_error(self):
        """
        Arrange: Use an email address that already exists in the test database.
        Act: Attempt to create another user with the same email address.
        Assert: An IntegrityError is raised because email addresses must be unique.
        """
        with self.assertRaises(IntegrityError):
            self.User.objects.create_user(
                email=self.user.email,
                password="testpass123",
            )
