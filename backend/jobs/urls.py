
from django.urls import path
from .views import job_list,application_list

urlpatterns = [
    path('jobs/', job_list, name='job-list'),
    path('applications/', application_list, name='application-list'),
]
