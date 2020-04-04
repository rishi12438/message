$(document).ready(function(){
       // Initiating our Auth0Lock
      isAuthenticated = 1
   navigator.serviceWorker.register('sw.js');
Notification.requestPermission(function(result) {
  if (result === 'granted') {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.showNotification('Notification with ServiceWorker');
    });
  }
});
   if(!isAuthenticated && !window.location.hash){
        lock.show();
    }
    else{

        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        var pusher = new Pusher('APP_SECRET', {
            cluster: 'e.g eu',
            encrypted: false
        });

        var channel = pusher.subscribe('private-chat');
        channel.bind('message-added', onMessageAdded);
    }

    function onMessageAdded(data) {
        let template = $("#new-message").html();
        template = template.replace("{{body}}", data.message);
        template = template.replace("{{name}}", data.name);

        $(".chat").append(template);
    }
    $('#btn-chat').click(function(){
        const message = $("#message").val();
        $("#message").val("");
            //send message
        $.post( "http://localhost:5000/message", { message, name: profile.name } );
    });

    $("#logout").click((e) => {
        e.preventDefault();
        logout();
    });

    function logout(){
        localStorage.clear();
        isAuthenticated = false;
        lock.logout({
            returnTo: "http://localhost:5000"
        });
    }
    $(document).ready(function(){
        // Initiating our Auth0Lock

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
            if(profile){
                $("#username").html(profile.name);
            }

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            var pusher = new Pusher('APP_SECRET', {
                cluster: 'eu',
                encrypted: false
            });

            var channel = pusher.subscribe('private-chat');
            channel.bind('message-added', onMessageAdded);

            $('#btn-chat').click(function(){
                const message = $("#message").val();
                $("#message").val("");
                 //send message
                $.post( "http://localhost:5000/message", { message, name: profile.name } );
            });
        }
    });
