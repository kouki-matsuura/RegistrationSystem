from django.http.response import JsonResponse
from django.shortcuts import render
from .application import one_hot_encode
import json

# Create your views here.
def index(req):
    return render(req, 'persona_questionnaire.html')

def registration(req):
    return render(req, 'registration.html')

def test_ajax_app(req):
    #data = one_hot_encode.main()
    data =json.load(open('/Users/kouki/desktop/卒業論文_K平均法/dataEdit/persona_experiment/application/satisfy.json', 'r'))
    return JsonResponse(data, safe=False)

def get_json(req):
    data = json.load(open('/Users/kouki/desktop/卒業論文_K平均法/dataEdit/persona_experiment/subjects.json', 'r'))
    return JsonResponse(data, safe=False)



