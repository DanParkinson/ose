from rest_framework import serializers
from ... import models


class VariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Variation
        fields = [
            "variation_id",
            "title",
            "slug",
            "is_protected",
        ]
        read_only_fields = ["variation_id", "slug"]
