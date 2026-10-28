
from django.urls import path
from .views import job_list,apply_for_job
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('jobs/', job_list, name='job-list'),
    path('applications/', apply_for_job, name='apply-for-job'),
    ]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )