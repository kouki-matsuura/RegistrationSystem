from os import name
from django.urls import path
from . import views

app_name = 'persona_experiment'
urlpatterns = [
    path('', views.index, name='index'),
    path('registration/', views.registration, name="registration"),
    path('registration/ajax/', views.test_ajax_app, name="test_ajax_app"),
    path('registration/getSubjects', views.get_json, name="get_json")
]