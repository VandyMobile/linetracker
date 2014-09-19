//Data submission
function SubmitFxn(){
    $('.alert').alert('close');
    var user_input = document.getElementById("input").value;
    document.getElementById("input").value = "";
    if(checkCookie()){
        $(document).trigger("add-alerts", [
                {
                  'message': "You can only submit data every 30 minutes.",
                  'priority': 'danger'
                }
            ]);
    }else{
        if(!user_input){ 	//user_input is NaN
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
            
            var time = new Date();
            time.setTime(time.getTime() + 1000*1800);   //adds 30 minutes to current time
            var expires = time.toGMTString();
            document.cookie="submitted=1; expires=" + expires;
            
            $.ajax({
                type: "POST",
                url: "insert.php",
                data: {'waittime': waitTime},
            }); 
            
            $(document).trigger("add-alerts", [
                {
                  'message': "Successfully submitted!",
                  'priority': 'success'
                }
            ]);
        }
    }
};

function checkCookie(){
    var cookieArray = document.cookie.split(';');
    for(var i=0; i<cookieArray.length; i++){
        var cook = cookieArray[i];
        if(cook.indexOf('submitted=') != -1) return true;
    }
    return false;
};

  //Display recently submitted times
$.getJSON('retrieve.php', function(data){
    if($.isEmptyObject(data))
    {
        $('h4#empty').append("No recent data");
        $('h4#avg').append("No recent data");
    }else{
        if(data[0] === null)
        {
            $('h4#avg').append("No recent data");
            $('h4#empty').append("No recent data");
        }else{
            var roundedAvg = Math.ceil(data[0]/60);
            $('h4#avg').append(roundedAvg + ' minutes');
        }
        var recent = "";
        for(i = 1; i < data.length; i++){
            var timeSince = Math.ceil(((new Date()).getTime()/1000 - data[i].UnixTime)/60);    //calculates time in minutes since submission
            recent+='<li class="list-group-item"><span class="badge">';
            if(timeSince === 1)
                recent+= '1 minute ago</span>';
            else if(timeSince < 60)
                recent+= timeSince + ' minutes ago</span>';
            else if(timeSince > 1440)
                recent+= 'Over 1 day ago</span>';
            else{
                timeSince = Math.floor(timeSince/60);
                recent+= timeSince + ' hours ago</span>';
            }
            recent+= Math.floor(data[i].WaitTime/60) + ' minutes</li>';
        }
        $('ul#recent.list-group').append(recent);
    }
});  