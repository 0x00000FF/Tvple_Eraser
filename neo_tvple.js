// Tvple Eraser v 3.00 

// Defines Main Pattern for Filters of Filter Logics
var MainPattern = /(티비|tv).*?(플|p(i|l)e)/gim;
var SubPatternChannel;
var SubPatternVideo;
var SubPatternException;

// Validate String Determines Whether Target String Contains Tvple or Not.
function ValidateString(Source)
{
  // Main Pattern Check
  if(MainPattern.test(Source))
  {
    return true;
  }

  // SubPattern(Video Name) Check
  if(SubPatternVideo !== undefined)
  {
    for(var i=0; i<SubPatternVideo.length; i++)
    {
      if (Source.includes(SubPatternVideo[i]))
      {
        return true;
      }
    }
  }

  return false;
}

// Validate Channel Names Checkes Whether Target Channel Name Identifies Blocked Name or Not.
function ValidateChannelName(Source)
{
  // Main Pattern Check
  if(MainPattern.test(Source))
  {
    return true;
  }

  // SubPattern(Channel Name) Check
  if(SubPatternChannel !== undefined)
  {
    for(var i=0; i<SubPatternChannel.length; i++)
    {
      if(Source == SubPatternChannel[i])
      {
        return true;
      }
    }
  }

  return false;
}

// Tvple Eraser v 2.54 Main Routine Script
// by P.Knowledge, 2016-
var V2Filter = function () {
    "use strict";
    
    // Total Item Counts        
    // TotalItemCount[0] for Video Playing -> Related Videos
    // TotalItemCount[1] for Searching
    // TotalItemCount[2] for Main Page -> item-section
    var TotalItemCount = [0, 0, 0];

    // Buffer for VideoName / ChannelName for Video Playing
    // StringBuffer[0] for ChannelName
    // StringBuffer[1] for VideoName
    var StringBuffer = ['', ''];

    // Flag for Duplicated URI Check
    var CurrentURI;
    var ExceptionCheckFlag = true;

    // Flag for Related Video Lists
    var FilterRelFlag = true;

    // Main Filter Logic - Tvple Eraser v2.0
    this.Filter = function () {
      //Getting Counts of item-section;
      var Sections = document.getElementsByClassName('item-section');

      if(Sections.length === 0) // When Video is Playing
      {
        if(ExceptionCheckFlag)
        {
          CurrentURI = document.URL;
          var ExceptionCount = SubPatternException.length;
          var Index = 0;

          do
          {   
              var ExceptionFlag = CurrentURI.includes(SubPatternException[Index]);
              if(ExceptionFlag && ExceptionCount !== 0)
              {
                  break;       
              }

              if(!ExceptionFlag && Index === ExceptionCount - 1 || ExceptionCount === 0)
              {
                  // Is Channel Must be Filtered?
                  var ChannelElement = document.getElementsByClassName('yt-user-info');
                  if(ChannelElement.length === 0)
                  {
                    return;
                  }

                  if(StringBuffer[0] != ChannelElement[0].innerText)
                  {
                    if(ValidateChannelName(ChannelElement[0].innerText))
                    {
                      // Replace Location to Youtube.
                      location.replace('//youtube.com');
                      return;
                    }
                    StringBuffer[0] = ChannelElement[0].innerText;
                  }

                  // Is Video Name Must be Filtered?
                  var VideoName = document.getElementById('eow-title');
                  if(VideoName === undefined)
                  {
                    return;
                  }

                  if(StringBuffer[1] != VideoName.innerText)
                  {
                    if(ValidateString(VideoName.innerText))
                    {
                      // Replace Location to Youtube.
                      location.replace('//youtube.com');
                      return;
                    }

                    StringBuffer[1] = VideoName.innerText;
                  }

                  var VideoDescription = document.getElementById('eow-description').innerText;

                  // Description has Tvple Link?
                  if(VideoDescription.includes('tvple.com'))
                  {
                    // Replace Location to Youtube.
                    location.replace('//youtube.com');
                    return;
                  }

                  ExceptionCheckFlag = false;
              }

              Index++;
          } while(Index<ExceptionCount);      
        }

        // Filter Related Videos
        var SidebarItems = document.getElementsByClassName('video-list-item');

        if(!FilterRelFlag && TotalItemCount[0] == SidebarItems.length)
        {
          return;
        }
        else if(!FilterRelFlag)
        {
          FilterRelFlag = true;
          return;
        }
        else
        {
          TotalItemCount[0] = SidebarItems.length;
        }

        try
        {
          for(var _count = 0; _count < TotalItemCount[0]; _count++)
          {
            // Is Replaced Video Contaions Blocked Keyword?
            var VideoName = SidebarItems[_count].getElementsByClassName('title');
            if(VideoName.length === 0)
            {
              return;
            }

            if(ValidateString(VideoName[0].innerText))
            {
              SidebarItems[_count].remove();
              continue;
            }

            // Is Replated Video Registered by Blocked Channel?
            var ChannelName = SidebarItems[_count].getElementsByClassName('attribution');

            if(ChannelName.length === 0)
            {
              return;
            }

            if(ValidateChannelName(ChannelName[0].innerText))
            {
              SidebarItems[_count].remove();
            }
          }

          FilterRelFlag = false;
        }
        catch(e)
        {
          return;
        }
      }
      else if (Sections.length === 1) // When Searching
      {
        var SearchItems = Sections[0].getElementsByTagName('li');

        // If Number of Search Entries same as TotalItemCount...
        if(TotalItemCount[1] === SearchItems.length)
        {
          // Ignore Filter Request
          return;
        }
        else // Or Not...
        {
          // Update TotalItemCount
          TotalItemCount[1] = SearchItems.length;
        }

        for(var _count = 0; _count < SearchItems.length; _count++)
        {
          var VideoItem = SearchItems[_count];

          try
          {
            var VideoChannel = VideoItem.getElementsByClassName('g-hovercard')[0].innerText;
            if(ValidateChannelName(VideoChannel))
            {
              VideoItem.remove();
              continue;
            }

            var VideoName = VideoItem.getElementsByClassName('yt-lockup-title ')[0].innerText;
            if(ValidateString(VideoName))
            {
              VideoItem.remove();
            }
          }
          catch(e) { }
        }
      }
      else  // When Main Page
      {
        // If TotalItemCount is same as Number of Sections
        if(TotalItemCount[2] === Sections.length)
        {
          // Ignore Filter Request
          return;
        }
        else // Or Not...
        {
          TotalItemCount[2] = Sections.length; // Update TotalItemCount
        }

        // Check If Channel is Blocked
        for(var _count = 0; _count < Sections.length; _count++)
        {
          try
          {
              var ChannelTitle = Sections[_count].getElementsByClassName('branded-page-module-title-text')[0].innerText;
              if (ValidateChannelName(ChannelTitle)) {
                  Sections[_count].remove();
                  continue;
              }

              var VideoList = Sections[_count].getElementsByClassName('yt-shelf-grid-item');
              for (var _vcount = 0; _vcount < VideoList.length; _vcount++) {
                  var VideoItem = VideoList[_vcount];

                  var VideoChannel = VideoItem.getElementsByClassName('yt-uix-sessionlink')[0].innerText;
                  if (ValidateChannelName(VideoChannel)) {
                      VideoItem.remove();
                      continue;
                  }

                  var VideoName = VideoItem.getElementsByClassName('yt-lockup-title')[0].innerText;
                  if (ValidateString(VideoName)) {
                      VideoItem.remove();
                  }
              }
          }
          catch (e) // Ignore hidden item-shelf for avoiding errors
          {
            continue;
          }
        }
      }
    }

    this.clearBuffer = function () {
          TotalItemCount = [0, 0, 0];
          StringBuffer = ['', ''];
          FilterRelFlag = true;
          ExceptionCheckFlag = true;
    }  
};


// Tvple Eraser v 3.00 Main Routine Script
// by P.Knowledge, 2016-
var V3Filter = function () {
    "use strict";
    
    function hideNode(node) {
        node.style = "display: none";
    }
    
    this.Filter = function () {

        var browse = document.getElementsByTagName("ytd-browse");
        if (browse.length > 0) {
            var jumpNext = browse[0].hasAttribute("hidden");
            
            if(!jumpNext) {
                var shelves = browse[0].getElementsByTagName("ytd-shelf-renderer");

                for (var i=0; i < shelves.length; ++i) {
                    var items = shelves[i].getElementsByTagName("ytd-grid-video-renderer");
                    for (var j=0; j < items.length; ++j) {
                        var item = items[j];
                        
                        if(item) {
                            var title = item.querySelector("#video-title").innerText;
                            if (MainPattern.test(title) || ValidateString(title)) {
                                hideNode(items[j]);
                                continue;
                            }

                            var channel = item.querySelector("#byline-container").innerText;
                            if (ValidateChannelName(channel)) {
                                hideNode(items[j]);
                            }
                        }
                    }
                }

                return;
            }
        }
        
        var search = document.getElementsByTagName("ytd-search");
        if (search.length > 0) {
            var jumpNext = search[0].hasAttribute("hidden");
            
            if (!jumpNext) {
                var results = search[0].getElementsByTagName("ytd-video-renderer");

                for (var i=0; i < results.length; ++i) {
                    var title = results[i].querySelector("#title-wrapper").innerText;
                    if (MainPattern.test(title) || ValidateString(title)) {
                        hideNode(results[i]);
                        continue;
                    }

                    var channel = results[i].querySelector("#byline-container").innerText;
                    if (ValidateChannelName(channel)) {
                        hideNode(results[i]);
                    }
                }
                
                var channels = search[0].getElementsByTagName("ytd-channel-renderer");

                for (var i=0; i < channels.length; ++i) {
                    var channelName = channels[i].querySelector("#channel-title").innerText;
                    
                    if (ValidateChannelName(channelName)) {
                        hideNode(channels[i]);
                    }
                }
                
                return;
            }
        }
        
        var video = document.getElementsByTagName("ytd-watch");
        if (video.length > 0) {
            
            var videoName = video[0].getElementsByTagName("ytd-video-primary-info-renderer")[0].innerText;
            if (MainPattern.test(videoName) || ValidateString(videoName)) {
                location.replace("https://www.youtube.com");
                return;
            }
            
            var channelName = video[0].querySelector("#top-row").innerText;
            if (ValidateChannelName(channelName)) {
                location.replace("https://www.youtube.com");
                return;                
            }
            
            var items = video[0].getElementsByTagName("ytd-compact-video-renderer");
            if (items.length > 0) {
                for (var i = 0; i < items.length; ++i) {
                    var title = items[i].querySelector("#video-title").innerText;
                    if (MainPattern.test(title) || ValidateString(title)) {
                        hideNode(items[i]);
                        continue;
                    }
                    
                    var channel = items[i].querySelector("#byline-container").innerText;
                    if (ValidateChannelName(channel)) {
                        hideNode(items[i]);
                    }
                }
            }
            
            return;
        }
    }
    
    
};


// Getting User Filter for Customized Filtering Options
chrome.storage.sync.get(
  {
    "channel_filter": "",
    "video_name_filter": "",
    "filter_exception":"",
    "filter_version": 3
  },
  function(Data){
    SubPatternChannel = SubPatternVideo = SubPatternException = [];  
    
    if(Data.channel_filter.length !== 0)
    {
      SubPatternChannel = Data.channel_filter.split(',');
    }

    if(Data.video_name_filter.length !== 0)
    {
      SubPatternVideo = Data.video_name_filter.split(',');
    }
    
    if(Data.filter_exception.length !== 0)
    {
      SubPatternException = Data.filter_exception.split(',');        
    }
    
    var FilterObject;
    
    if(Data.filter_version == 2) {
        FilterObject = new V2Filter();
        
        // Add Event Listener for Modification of Youtube Page
        // Fucking pushState
        document.getElementById('page-container').addEventListener("DOMNodeInserted", FilterObject.Filter);
        document.getElementById('page-container').addEventListener("DOMNodeRemoved", FilterObject.Filter);

        // Add EventListener for Reset Buffer
        document.addEventListener("spfdone", FilterObject.clearBuffer);
    } else {
        FilterObject = new V3Filter();
        
        document.addEventListener("yt-action", FilterObject.Filter);
    }
});
