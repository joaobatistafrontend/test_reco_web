# meu_app/routing.py
from django.urls import re_path
from .consumers import ReconhecimentoFacialConsumer

websocket_urlpatterns = [
    re_path(r'ws/reconhecimento_facial/$', ReconhecimentoFacialConsumer.as_asgi()),
]
