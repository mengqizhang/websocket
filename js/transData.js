var oBtn = document.getElementById('videoBtn');
var oIframe = document.getElementById('ifr');
oBtn.onclick = function(){
  oIframe.contentWindow.postMessage('photo','https://mengqizhang.github.io/')
}
window.onmessage = function(ev){
  sockets(ev.data)
}
function sockets(data){      
      var socket = null;
      socket = io.connect('http://localhost:8881');
      socket.on('hello',function(data){
          alert(data)
      })
      socket.emit('showImg',data);
}
