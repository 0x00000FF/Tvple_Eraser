chrome.storage.sync.get(
  {
    "channel_filter": "",
    "video_name_filter": "",
    "filter_exception":"",
    "filter_version": 3
  },
  function(Data)
  {
    document.getElementById('ChannelFilter').value = Data.channel_filter;
    document.getElementById('VideoNameFilter').value = Data.video_name_filter;
    document.getElementById('ExceptionFilter').value = Data.filter_exception;
      
    if(Data.filter_version == 2) {
        document.getElementById('v2').checked = true;
    } else {
        document.getElementById('v3').checked = true;
    }
  }
);

document.getElementById('SaveButton').addEventListener('click', function() {
  var filterVersion;
    
  if (document.getElementById('v2').checked) {
      filterVersion = 2;
  } else {
      filterVersion = 3;
  }
    
  chrome.storage.sync.set(
    {
      "channel_filter" : document.getElementById('ChannelFilter').value,
      "video_name_filter": document.getElementById('VideoNameFilter').value,
      "filter_exception": document.getElementById('ExceptionFilter').value,
      "filter_version" : filterVersion
    },
    function ()
    {
      var Button = document.getElementById('SaveButton');
      Button.innerHTML = "저장이 완료되었습니다. 유튜브를 새로고침 해 주세요.";
      setTimeout(function(){
        Button.innerText = "저장"
      }, 1750);
    }
  )
});

document.getElementById('Donate').addEventListener('click', function() {
    document.getElementById("bitcoin").innerHTML = "Tvple Eraser에 도움을 주고 싶으시다면, 다음 주소로 비트코인을 보내주세요.<br>1LJ5WuAJKfiPtPjT5HmMwjkbMpAN4VrWKU";
});
