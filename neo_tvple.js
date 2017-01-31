// Tvple Eraser v 2.0 Main Routine Script
// neo_tvple.js
// by PatchouliDev, 2016-

// Defines Main Pattern for Filters of Filter Logics
var MainPattern = /(티비|tv).{0,}(플|p(i|l)e)/gim;
var DescriptionURLPattern = /tvple\.com/gim;
var MinecraftFlag
var SubPatternChannel;
var SubPatternVideo;

// Getting User Filter for Customized Filtering Options
chrome.storage.sync.get(
  {
    "channel_filter": "",
    "video_name_filter": "",
    "block_minecraft": 1
  },
  function(Data){
    if(Data.channel_filter.length != 0)
    {
      SubPatternChannel = Data.channel_filter.split(',');
    }

    if(Data.video_name_filter.length != 0)
    {
      SubPatternVideo = Data.video_name_filter.split(',');
    }

    MinecraftFlag = Data.block_minecraft;
});

// Validate String Determines Whether Target String Contains Tvple or Not.
function ValidateString(Source)
{
  // Main Pattern Check
  if(MainPattern.test(Source))
  {
    return true;
  }

  // SubPattern(Video Name) Check
  if(SubPatternVideo != null)
  {
    for(var i=0; i<SubPatternVideo.length; i++)
    {
      if(Source.includes(SubPatternVideo[i]))
      {
        return true;
      }
    }
  }

  // Minecraft?
  if(MinecraftFlag == 1)
  {
    if(/(마인|mine).{0,}(크(래|레)프트|cr(a|e)(f|p)t)|마인크/gim.test(Source))
    {
      return true;
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
  if(SubPatternChannel != null)
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

// Total Item Counts
// TotalItemCount[0] for Video Playing -> Related Videos
// TotalItemCount[1] for Searching
// TotalItemCount[2] for Main Page -> item-section
var TotalItemCount = [0, 0, 0];

// Buffer for VideoName / ChannelName for Video Playing
// StringBuffer[0] for ChannelName
// StringBuffer[1] for VideoName
var StringBuffer = ['', ''];

// Flag for Related Video Lists
var FilterRelFlag = true;

// Main Filter Logic
function Filter()
{
  //Getting Counts of item-section;
  var Sections = document.getElementsByClassName('item-section');

  if(Sections.length == 0) // When Video is Playing
  {
    // Is Channel Must be Filtered?
    var ChannelElement = document.getElementsByClassName('yt-user-info');
    if(ChannelElement.length == 0)
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
    if(VideoName == undefined)
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

    var VideoDescription = document.getElementById('eow-description');

    // Description has Tvple Link?
    if(DescriptionURLPattern.test(VideoDescription))
    {
      // Replace Location to Youtube.
      location.replace('//youtube.com');
      return;
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
      for(_count = 0; _count < TotalItemCount[0]; _count++)
      {
        // Is Replaced Video Contaions Blocked Keyword?
        var VideoName = SidebarItems[_count].getElementsByClassName('title');
        if(VideoName.length == 0)
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

        if(ChannelName.length == 0)
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
  else if (Sections.length == 1) // When Searching
  {
    var SearchItems = Sections[0].getElementsByTagName('li');

    // If Number of Search Entries same as TotalItemCount...
    if(TotalItemCount[1] == SearchItems.length)
    {
      // Ignore Filter Request
      return;
    }
    else // Or Not...
    {
      // Update TotalItemCount
      TotalItemCount[1] = SearchItems.length;
    }

    for(_count = 0; _count < SearchItems.length; _count++)
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
    if(TotalItemCount[2] == Sections.length)
    {
      // Ignore Filter Request
      return;
    }
    else // Or Not...
    {
      TotalItemCount[2] = Sections.length; // Update TotalItemCount
    }

    // Check If Channel is Blocked
    for(_count = 0; _count < Sections.length; _count++)
    {
      var ChannelTitle = Sections[_count].getElementsByClassName('branded-page-module-title-text')[0].innerText;
      if(ValidateChannelName(ChannelTitle))
      {
        Sections[_count].remove();
        continue;
      }

      var VideoList = Sections[_count].getElementsByClassName('yt-shelf-grid-item');
      for(_vcount = 0; _vcount < VideoList.length; _vcount++)
      {
        var VideoItem = VideoList[_vcount];

        var VideoChannel = VideoItem.getElementsByClassName('yt-uix-sessionlink')[0].innerText;
        if(ValidateChannelName(VideoChannel))
        {
          VideoItem.remove();
          continue;
        }

        var VideoName = VideoItem.getElementsByClassName('yt-lockup-title')[0].innerText;
        if(ValidateString(VideoName))
        {
          VideoItem.remove();
        }
      }
    }
  }
}

// Add Event Listener for Youtube Initialized
// $(document).on("DOMContentLoaded", Filter);

// Add Event Listener for Modification of Youtube Page
// Fucking pushState
document.addEventListener("DOMNodeInserted", Filter);
document.addEventListener("DOMNodeRemoved", Filter);

// Add EventListener for Reset Buffer
document.addEventListener("spfdone", function() {
  TotalItemCount = [0, 0, 0];
  StringBuffer = ['', ''];
  FilterRelFlag = true;
});

// Ajax Detection
//$(document).ajaxComplete({
//  complete: function() {
//    Filter();
//  }
//})
