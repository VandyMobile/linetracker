//Data submission
function SubmitFxn(){
    $(document).trigger("clear-alerts");
    var user_input = document.getElementById("input").value;
    document.getElementById("input").value = "";
    if(!user_input){ 	//user_input is NAN
        $(document).trigger("add-alerts", [
            {
              'message': "Please enter a valid number.",
              'priority': 'danger'
            }
          ]);
    }	
    else if(user_input < 0 || user_input > 90){
      $(document).trigger("add-alerts", [
        {
          'message': "Please input a value between 0 and 90.",
          'priority': 'warning'
        }
      ]);
    }
    else{
        var waitTime = user_input;
        waitTime = waitTime * 60;    //converts time into seconds
        
        $.ajax({
            url: "http://127.0.0.1:8080/linetracker/api/line/1/submittime/"+waitTime
        });
        
        $(document).trigger("add-alerts", [
            {
              'message': "Successfully submitted!",
              'priority': 'success'
            }
          ]);
    }
}

//Display estimate and recent times
var summary;
$.getJSON('http://localhost:8080/linetracker/api/line/1/summary', function(data){
    var estimate = Math.floor(data.estimatedTime / 60);  //converts time to minutes
    $('li#estimate.list-group-item').append(estimate + ' minutes');
    var recent = "";
    for(var i in data.recentTimes){
        var timeSince = Math.floor((Math.floor((new Date()).getTime()/1000) - data.recentTimes[i].timeStamp)/60);    //calculates time in minutes since submission
        recent+='<li class="list-group-item"><span class="badge">';
        if(timeSince < 60)
            recent+= timeSince + ' minutes ago</span>';
        else if(timeSince > 1440)
            recent+= 'Over 1 day ago</span>';
        else{
            timeSince = Math.floor(timeSince/60);
            recent+= timeSince + ' hours ago</span>';
        }
        recent+= Math.floor(data.recentTimes[i].waitTime/60) + ' minutes</li>';
    }
    $('ul#recent.list-group').append(recent);
});