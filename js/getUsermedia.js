window.onmessage = function(ev){
  if(ev.data == 'photo'){
    alert(1)
     openVideo();
  }else if(ev.data == 'startRecording'){
    alert(2)
    startRecording()
  }else if(ev.data == 'stopRecording'){
    alert(3)
    stopRecording()
  }
}
var video = document.querySelector('video');
function openVideo(){
      var canvas = window.canvas = document.querySelector('canvas');
      var imgdata= document.getElementById("imgdata");
      var button = document.querySelector('button');
      var oDownload = document.getElementById("download");
      var imgStr = '';
      var recordVideo = ''
      canvas.width = 480;
      canvas.height = 360;

      var constraints = {
        audio: true,
        video: true
      };

      function successCallback(stream) {
        window.stream = stream; 
        video.srcObject = stream;
        recordVideo = RecordRTC(stream, {
            type: 'video'
        });
      }

      function errorCallback(error) {
        console.log('navigator.getUserMedia error: ', error);
      }
      navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
      navigator.getUserMedia(constraints, successCallback, errorCallback);


      function convertCanvasToImage(oCanvas) {
        imgdata.value=oCanvas.toDataURL();

      }
      function iClick() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        convertCanvasToImage(canvas);
        parent.window.postMessage(imgdata.value,'http://localhost:8881/main.html')
      };
      var timer = setInterval(function(){
        iClick()
      },5000)
      
}

var recordVideo;
function startRecording() {
    navigator.getUserMedia({
            audio: true,
            video: true
        }, function(stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
            recordVideo = RecordRTC(stream, {
                type: 'video'
            });
            console.log(recordVideo,12345)
        }, function(error) {
            alert(JSON.stringify(error));
        });
};


function stopRecording() {
  var blob = recordRTC.blob;
  var buffer = recordRTC.buffer;
  var sampleRate = recordRTC.sampleRate;
  console.log(blob,buffer,sampleRate)
   recordVideo.stopRecording();
};
