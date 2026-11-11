from django.urls import path
from .views import job_list,apply_for_job,job_detail
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('jobs/', job_list, name='job-list'),
    path('applications/', apply_for_job, name='apply-for-job'),
    path('jobs/<int:pk>/', job_detail, name='job-detail'),
    ]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )