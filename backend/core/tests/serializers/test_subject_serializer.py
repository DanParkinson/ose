from core.api.serializers.subject_serializers import (
    SubjectSerializer,
)
from core.tests.base import BaseAPITestCase


class SubjectSerializerTests(BaseAPITestCase):
    """
    SUBJECT SERIALIZER TEST CHECKLIST
    ---------------------------------
    Serializer Fields
    - Verify subject_id field is included
    - Verify title field is included
    - Verify slug field is included
    - Verify level field is included
    - Verify language field is included
    - Verify is_published field is included
    - Verify is_protected field is included

    ---------------------------------
    Read Only Fields
    - Verify subject_id is read only
    - Verify slug is read only
    """

    # =====================
    # Serializer Fields
    # =====================

    def test_serializer_contains_expected_fields(self):
        """
        Arrange: Instantiate the subject serializer.

        Act: Read the serializer fields.

        Assert: All expected fields are present.
        """
        serializer = SubjectSerializer()

        self.assertEqual(
            set(serializer.fields.keys()),
            {
                "subject_id",
                "title",
                "slug",
                "level",
                "language",
                "is_published",
                "is_protected",
            },
        )

    # =====================
    # Read Only Fields
    # =====================

    def test_subject_id_is_read_only(self):
        """
        Arrange: Instantiate the subject serializer.

        Act: Read the subject_id field configuration.

        Assert: subject_id is read only.
        """
        serializer = SubjectSerializer()

        self.assertTrue(serializer.fields["subject_id"].read_only)

    def test_slug_is_read_only(self):
        """
        Arrange: Instantiate the subject serializer.

        Act: Read the slug field configuration.

        Assert: slug is read only.
        """
        serializer = SubjectSerializer()

        self.assertTrue(serializer.fields["slug"].read_only)
