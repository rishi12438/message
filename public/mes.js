

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
		
        let template = $("#new-message").html();
        template = template.replace("{{body}}", data.message);
        template = template.replace("{{name}}", data.name);

        $(".chat").append(template);

		}	
		
	       if(!isAuthenticated && !window.location.hash){
		   lock.show();
	       }
	       else{

 	   onMessageAdded("j");
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
