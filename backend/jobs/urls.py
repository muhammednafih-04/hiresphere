from django.urls import path
from .views import job_list,apply_for_job,job_detail,application_detail
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('jobs/', job_list, name='job-list'),
    path('applications/', apply_for_job, name='apply-for-job'),
    path('jobs/<int:pk>/', job_detail, name='job-detail'),
    path(
    'applications/<int:pk>/',
    views.application_detail,
    name='application_detail'),
    ]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )