from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

#----job list-----#
#-----------------#
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
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


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def job_detail(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response(
            {"error": "Job not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = JobSerializer(job)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = JobSerializer(
            job,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    elif request.method == 'DELETE':
        job.delete()
        return Response(
            {"message": "Job deleted successfully"},
            status=status.HTTP_200_OK
        )

 
 #----application list-----#
#-----------------#
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
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
@api_view(['GET', 'POST'])
def apply_for_job(request):

    # GET: Display all applications
    if request.method == 'GET':
        applications = Application.objects.select_related(
            'job'
        ).order_by('-applied_at')

        serializer = ApplicationSerializer(
            applications,
            many=True
        )

        return Response(serializer.data)

    # POST: Submit a new application
    serializer = ApplicationSerializer(data=request.data)

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
