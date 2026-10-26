from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Job
from .serializers import JobSerializer
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from rest_framework import status
from .models import JobApplication


#----job list-----#
#-----------------#
@api_view(['GET','POST'])
def job_list(request):
    if request.method == 'GET':
        jobs = Job.objects.all().order_by('-created_at')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    serializer = JobSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
 
 #----application list-----#
#-----------------#
@api_view(['GET', 'POST'])
def application_list(request):
    if request.method == 'GET':
        applications = Application.objects.all().order_by('-applied_at')
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    serializer = ApplicationSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

#----job apply-----#
#-----------------#
@api_view(['POST'])
def apply_for_job(request):
    serializer = JobApplicationSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
