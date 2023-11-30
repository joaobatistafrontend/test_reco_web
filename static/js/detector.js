/*
 meu_app/static/meu_app/js/detector.js
document.getElementById('inputImage').addEventListener('change', function (e) {
    var input = e.target;
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var image = new Image();
            image.src = e.target.result;

            image.onload = function () {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, image.width, image.height);

                // Implemente a detecção de rostos com OpenCV aqui
                // Exemplo simples: desenha um retângulo em volta do rosto
                context.beginPath();
                context.rect(50, 50, 100, 100);
                context.lineWidth = 2;
                context.strokeStyle = 'red';
                context.stroke();

                document.getElementById('outputImage').src = canvas.toDataURL('image/jpeg');
            };
        };

        reader.readAsDataURL(input.files[0]);
    }
});
*/

// meu_app/static/meu_app/js/detector.js
/*
document.addEventListener('DOMContentLoaded', function () {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (err) {
            console.log("Ocorreu um erro ao acessar a câmera: " + err);
        });

    document.getElementById('startButton').addEventListener('click', function () {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        var image = canvas.toDataURL('image/jpeg');

        // Enviar a imagem para o servidor via WebSocket
        socket.send(JSON.stringify({
            'image': image
        }));
    });
});
*/
// meu_app/static/meu_app/js/detector.js
document.addEventListener('DOMContentLoaded', function () {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var isDetecting = false;
    var captureAttempts = 0;
    var maxCaptureAttempts = 10; // Defina um número máximo de tentativas sem sucesso

    var animationFrameId;

    function startDetection() {
        isDetecting = true;
        detectFaces();
    }

    function stopDetection() {
        isDetecting = false;
        cancelAnimationFrame(animationFrameId);
    }

    function detectFaces() {
        if (isDetecting) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            var image = canvas.toDataURL('image/jpeg');

            // Enviar a imagem para o servidor via WebSocket
            socket.send(JSON.stringify({
                'image': image
            }));

            // Verificar se a tentativa de captura foi bem-sucedida
            if (image.indexOf('data:image/jpeg') !== -1) {
                captureAttempts = 0; // Reiniciar o contador se a captura for bem-sucedida
            } else {
                captureAttempts++;
                if (captureAttempts >= maxCaptureAttempts) {
                    notifyUserCaptureFailed(); // Notificar o usuário sobre falhas na captura
                    stopDetection(); // Interromper detecção após várias tentativas sem sucesso
                }
            }

            animationFrameId = requestAnimationFrame(detectFaces);
        }
    }

    function notifyUserCaptureFailed() {
        // Adicione aqui lógica para notificar o usuário sobre falhas na captura
        alert("Falha na captura de imagem. A detecção de rostos será desativada.");
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (err) {
            console.log("Ocorreu um erro ao acessar a câmera: " + err);
            notifyUserCameraDenied();
            stopDetection();
        });

    function notifyUserCameraDenied() {
        // Adicione aqui lógica para notificar o usuário sobre a negação da câmera
        alert("O acesso à câmera foi negado. A detecção de rostos será desativada.");
    }

    document.getElementById('startButton').addEventListener('click', startDetection);
    document.getElementById('stopButton').addEventListener('click', stopDetection);
});
