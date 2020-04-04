

$(document).ready(function(){

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}



       let isAuthenticated =1


       function onMessageAdded(data) {
	if(data.reciever_id == getUrlParam("user_id", -1)){ 
       		$.post( "http://54.255.159.253:5000/get_messages", { user_id : getUrlParam('user_id',1)},function(){ 
        console.log("sent");
}).done(function(data){ 
        var obj = JSON.parse(data); 
        var element = document.getElementById("lc");
	element.innerHTML = ""  
        for(var i = 0; i<obj.length;i++){ 
                var sender_id = obj[i]["sender_id"];
                var message = "<p>"+ obj[i]["text"] +"</p>" ;
            
                var sender_input = "<input type = 'hidden' id='sender_id"+i.toString() + "' value =" + sender_id.toString()+"></input>"
		var message_id = obj[i]["message_id"]
		
		var message_id1 = "<input type = 'hidden' id = 'message_id"+i.toString()+"' value ='"+message_id.toString() +"'></input>"
                var reply = "<input id = 'reply"+ i.toString()+"'></input>"
		var button ="<button id='btn-chat1' onclick = 'myFunction("+i.toString()+")'>send</button>" 
                var str1 = message+sender_input +reply+message_id1+button+""
                element.innerHTML += str1;
                console.log(obj[i]["text"])
        }
	});
	}	
}	
		
	       if(!isAuthenticated && !window.location.hash){
		   lock.show();
	       }
	       else{

 	   onMessageAdded({reciever_id:getUrlParam("user_id",-1)});
           // Enable pusher logging - don't include this in production
           Pusher.logToConsole = true;

           var pusher = new Pusher('d5be97218238cb28d452', {
               cluster: 'ap1',
               encrypted: false
           });

           var channel = pusher.subscribe('private-chat');
           channel.bind('message-added', onMessageAdded);
	   /*
	   $("#btn-chat1").click(function(){ 
	   	alert("hello");
	   })
	;*/ 
	   function myFunction(){ 

		alert("hello");
	    }
           $('#btn-chat').click(function(){
	      alert("hello12"); 
               const message = $("#message").val() +"";
               console.log(message);
               $("#message").val("");
                //send message
               $.post( "http://54.255.159.253:5000/message", { message, name: "ehd" , reciever_id:2, sender_id:1} );
           });
       }
   });
