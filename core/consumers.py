# meu_app/consumers.py
import json
import cv2
import base64
import numpy as np  
from channels.generic.websocket import AsyncWebsocketConsumer

class ReconhecimentoFacialConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        image_data = text_data_json['image']
        image = self.base64_to_image(image_data)

        # Realize a detecção de rostos usando o modelo Haarcascades
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Converta a imagem de volta para base64 para enviar via WebSocket
        image_data = self.image_to_base64(image)

        await self.send(text_data=json.dumps({
            'image': image_data
        }))

    def base64_to_image(self, base64_string):
        image_data = base64.b64decode(base64_string)
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return image

    def image_to_base64(self, image):
        _, buffer = cv2.imencode('.jpg', image)
        image_data = base64.b64encode(buffer).decode('utf-8')
        return image_data
