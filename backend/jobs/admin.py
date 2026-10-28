from django.contrib import admin
from .models import Job
from .models import Application


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'company',
        'location',
        'job_type',
        'salary',
        'created_at',
    )

    search_fields = ('title', 'company', 'location')
    list_filter = ('job_type', 'location')

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'applicant_name',
        'applicant_email',
        'job',
        'applied_at',
    )
    search_fields = (
        'applicant_name',
        'applicant_email',
        'job__title',
    )
    list_filter = ('applied_at',)



