from allauth.account.models import EmailAddress

from accounts.tests.user_creation.base_user_creation import (
    BaseUserCreationTestCase,
)


class CustomUserManagerTests(BaseUserCreationTestCase):
    """
    CUSTOM USER MANAGER TEST CHECKLIST
    ----------------------------------
    User Creation
    - Verify create_user creates a regular user
    - Verify create_user requires an email
    - Verify create_user normalises the email
    - Verify create_user hashes the password
    - Verify create_user is not staff by default
    - Verify create_user is not superuser by default
    - Verify create_user is active by default

    ----------------------------------
    Superuser Creation
    - Verify create_superuser creates a superuser
    - Verify create_superuser sets is_staff=True
    - Verify create_superuser sets is_superuser=True
    - Verify create_superuser sets is_active=True
    - Verify create_superuser creates an EmailAddress record
    - Verify create_superuser marks email address as verified
    - Verify create_superuser marks email address as primary


    ----------------------------------
    Superuser Validation
    - Verify create_superuser with is_staff=False raises ValueError
    - Verify create_superuser with is_superuser=False raises ValueError
    """

    # =====================
    # User Creation
    # =====================

    def test_create_user_creates_regular_user(self):
        """
        Arrange: Prepare a valid email and password.
        Act: Create a user through the custom user manager.
        Assert: A regular user is created with the expected email.
        """
        user = self.create_user(email=self.email)

        self.assertEqual(user.email, self.email)

    def test_create_user_requires_email(self):
        """
        Arrange: Prepare an empty email value.
        Act: Attempt to create a user without an email.
        Assert: A ValueError is raised because email is required.
        """
        with self.assertRaises(ValueError):
            self.User.objects.create_user(
                email="",
                password=self.password,
            )

    def test_create_user_normalises_email(self):
        """
        Arrange: Prepare an email address with uppercase domain characters.
        Act: Create a user using the custom user manager.
        Assert: The email is normalised before being saved.
        """
        user = self.create_user(email=self.uppercase_email)

        self.assertEqual(user.email, self.normalised_email)

    def test_create_user_hashes_password(self):
        """
        Arrange: Create a user with a known password.
        Act: Compare the raw password with the stored password value.
        Assert: The password is hashed and not stored as plain text.
        """
        user = self.create_user(email=self.email)

        self.assertNotEqual(user.password, self.password)

    def test_create_user_password_can_be_validated(self):
        """
        Arrange: Create a user with a known password.
        Act: Check the password using Django's check_password method.
        Assert: The stored password hash validates against the original password.
        """
        user = self.create_user(email=self.email)

        self.assertTrue(user.check_password(self.password))

    def test_create_user_is_not_staff_by_default(self):
        """
        Arrange: Create a regular user.
        Act: Read the is_staff attribute.
        Assert: Regular users are not staff by default.
        """
        user = self.create_user(email=self.email)

        self.assertFalse(user.is_staff)

    def test_create_user_is_not_superuser_by_default(self):
        """
        Arrange: Create a regular user.
        Act: Read the is_superuser attribute.
        Assert: Regular users are not superusers by default.
        """
        user = self.create_user(email=self.email)

        self.assertFalse(user.is_superuser)

    def test_create_user_is_active_by_default(self):
        """
        Arrange: Create a regular user.
        Act: Read the is_active attribute.
        Assert: Regular users are active by default.
        """
        user = self.create_user(email=self.email)

        self.assertTrue(user.is_active)

    # =====================
    # Superuser Creation
    # =====================

    def test_create_superuser_creates_superuser(self):
        """
        Arrange: Prepare a valid admin email and password.
        Act: Create a superuser through the custom user manager.
        Assert: A superuser is created with the expected email.
        """
        superuser = self.create_superuser(email=self.admin_email)

        self.assertEqual(superuser.email, self.admin_email)

    def test_create_superuser_sets_is_staff_true(self):
        """
        Arrange: Create a superuser.
        Act: Read the is_staff attribute.
        Assert: Superusers are staff users.
        """
        superuser = self.create_superuser(email=self.admin_email)

        self.assertTrue(superuser.is_staff)

    def test_create_superuser_sets_is_superuser_true(self):
        """
        Arrange: Create a superuser.
        Act: Read the is_superuser attribute.
        Assert: Superusers have superuser permissions.
        """
        superuser = self.create_superuser(email=self.admin_email)

        self.assertTrue(superuser.is_superuser)

    def test_create_superuser_sets_is_active_true(self):
        """
        Arrange: Create a superuser.
        Act: Read the is_active attribute.
        Assert: Superusers are active by default.
        """
        superuser = self.create_superuser(email=self.admin_email)

        self.assertTrue(superuser.is_active)

    def test_create_superuser_creates_email_address_record(self):
        """
        Arrange: Create a superuser.
        Act: Check whether an EmailAddress record exists for the superuser.
        Assert: The superuser has a related EmailAddress record.
        """
        superuser = self.create_superuser(email=self.admin_email)

        exists = EmailAddress.objects.filter(
            user=superuser,
            email=self.admin_email,
        ).exists()

        self.assertTrue(exists)

    def test_create_superuser_marks_email_address_verified(self):
        """
        Arrange: Create a superuser.
        Act: Retrieve the related EmailAddress record.
        Assert: The superuser email address is marked as verified.
        """
        superuser = self.create_superuser(email=self.admin_email)

        email_address = EmailAddress.objects.get(
            user=superuser,
            email=self.admin_email,
        )

        self.assertTrue(email_address.verified)

    def test_create_superuser_marks_email_address_primary(self):
        """
        Arrange: Create a superuser.
        Act: Retrieve the related EmailAddress record.
        Assert: The superuser email address is marked as primary.
        """
        superuser = self.create_superuser(email=self.admin_email)

        email_address = EmailAddress.objects.get(
            user=superuser,
            email=self.admin_email,
        )

        self.assertTrue(email_address.primary)

    # =====================
    # Superuser Validation
    # =====================

    def test_create_superuser_with_is_staff_false_raises_value_error(self):
        """
        Arrange: Prepare superuser creation with is_staff=False.
        Act: Attempt to create the superuser.
        Assert: A ValueError is raised because superusers must be staff.
        """
        with self.assertRaises(ValueError):
            self.create_superuser(
                email=self.admin_email,
                is_staff=False,
            )

    def test_create_superuser_with_is_superuser_false_raises_value_error(self):
        """
        Arrange: Prepare superuser creation with is_superuser=False.
        Act: Attempt to create the superuser.
        Assert: A ValueError is raised because superusers must have superuser permissions.
        """
        with self.assertRaises(ValueError):
            self.create_superuser(
                email=self.admin_email,
                is_superuser=False,
            )
