from django.urls import path
from . import views

app_name = 'notes'

urlpatterns = [
    path('', views.NoteListAPIView.as_view(), name='note-list'),
    path('<int:pk>/', views.NoteDetailAPIView.as_view(), name='note-detail'),
]