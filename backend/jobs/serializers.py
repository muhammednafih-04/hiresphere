from rest_framework import serializers
from .models import Job, Application

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'company',
            'location',
            'job_type',
            'salary',
            'description',
            'required_skills',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

class ApplicationSerializer(serializers.ModelSerializer):
        class Meta:
            model = Application
            fields = '__all__'

