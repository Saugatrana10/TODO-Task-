from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet, RegisterView

router = DefaultRouter()
router.register("todos", TodoViewSet, basename="task")

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("", include(router.urls)),
]