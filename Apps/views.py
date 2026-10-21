from django.shortcuts import render,get_object_or_404

# Create your views here.
from .models import Todo
from .serializers import TodoSerializer,RegisterSerializer
from rest_framework.decorators import api_view
from rest_framework import viewsets,generics,mixins,status,permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .paginations import TodoPagination
from rest_framework.permissions import IsAuthenticated


# @api_view(['GET','POST'])
# def Task(request):
#     if request.method=="GET":
#         task = Todo.objects.all()
#         task_serializer= TodoSerializer(task,many=True)
#         return Response(task_serializer.data, status=status.HTTP_200_OK)
    
#     elif request.method=="POST":
#         serialzer=TodoSerializer(data=request.data)
#         if serialzer.is_valid(raise_exception=True):
#             serialzer.save()
#             return Response(serialzer.data,status=status.HTTP_201_CREATED)
#         else:
#          return Response(serialzer.errors,status=status.HTTP_400_BAD_REQUEST)

# @api_view(['GET','PUT','DELETE','PATCH'])
# def TaskDetail(request,id):

#     try:
#         task = get_object_or_404(Todo,id=id)
#     except Todo.DoesNotExist:
#         return Response("Task not available",status=status.HTTP_204_NO_CONTENT)

#     if request.method == "GET":
#         serializer = TodoSerializer(task)
#         return Response(serializer.data,status=status.HTTP_200_OK)
    
#     elif request.method in ("PUT","PATCH"):
#         serializer=TodoSerializer(task,data=request.data,partial= (request.method=="PATCH"))
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data,status=status.HTTP_200_OK)
#         else:
#              return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
#     elif request.method=="DELETE":
#         task.delete()
#         return Response("Task Deleted Successfully")




class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    permission_classes=[IsAuthenticated]
    pagination_class = TodoPagination
    filterset_fields = ["completed"]
    search_fields = ["title"]
    ordering_fields = ["created_at", "title"]

    def get_queryset(self):
        return Todo.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)