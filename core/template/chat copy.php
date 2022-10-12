<style>
</style>
<br>
<div id='main_chat_wrapper'>
    <div id='main_chat_text' class='main_chat_text'></div>
    <div id='main_chat_sidebar' class='main_chat_sidebar'>asd</div>

</div>
<input type="chat" id="chat_text">

<script>
    const user_session_id = <?php echo $_SESSION['ID'] ?>;
    const user_session_name = '<?php echo $_SESSION['USERNICK'] ?>';

    const user_chat_receiver = 2;
    const user_chat_receiver_data = getAjaxValue("../../api/?query=" + `SELECT * FROM \`general_users\` WHERE \`id\` = ${user_chat_receiver}`, "GET");

    $("#chat_text").keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode != '13') return null;
        if ($(this).val().length == 0) return null;

        user_session_id == 1 ? sender = 2 : sender = 1;

        sendChatText($(this).val(), user_session_id, sender);
        $(this).val("");
    });

    $("#check_chat").click(function() {
        chatInterval();
    });


    const sendChatText = (text, fromUser, toUser, important = 0) => {
        console.log(`Send text: \"${text}\" from User: ${fromUser} to User: ${toUser}`);
        send = getAjaxValue("../../api/?query=" + `INSERT INTO \`internal_chat_messages\` SET \`message\`="${text}", \`user_sender\` = ${fromUser}, \`user_receiver\` = ${toUser}, \`priority\` = ${important}`, "GET");
    }

    var lastCheckDate = null;
    var chat_msg = new Array();

    const chatInterval = () => {
        //const now = new Date().toJSON().replace("T", " ").replace("Z", "");
        //console.log("🚀 ~ file: chat.php ~ line 37 ~ chatInterval ~ now", lastCheckDate)

        chats = getAjaxValue("../../api/?query=" + `SELECT * FROM \`internal_chat_messages\` WHERE \`user_receiver\` = ${user_session_id} or \`user_sender\` = ${user_session_id}`, "GET");
        // console.log("🚀 ~ file: chat.php ~ line 37 ~ chatInterval ~ chats", chats)

        Object.keys(chats).forEach((key) => {
            // console.log(chats[key]);
            if (!chat_msg[chats[key].id]) {

                chat_msg[chats[key].id] = {
                    txt: chats[key].message,
                    sender: chats[key].user_sender,
                    receiver: chats[key].user_receiver,
                    timestamp: chats[key].datetime

                }

                let send_or_receive = "receive";
                if (chat_msg[chats[key].id].sender == user_session_id) send_or_receive = "sender";

                add_msg_to_chat(chat_msg[chats[key].id].txt, send_or_receive, chat_msg[chats[key].id].sender, chat_msg[chats[key].id].timestamp);

            }
        });
        //reload_chat();
        // lastCheckDate = now;
    }

    /*const reload_chat = () => {

        const mainChatText = $("#main_chat_text");
        mainChatText.html("");

        //console.log(chat_msg);

        Object.keys(chat_msg).forEach((key) => {

            let send_or_receive = "receive";
            if (chat_msg[key].sender == user_session_id) send_or_receive = "sender";

            add_msg_to_chat(chat_msg[key].txt, send_or_receive, chat_msg[key].timestamp);
        })

    }*/

    const add_msg_to_chat = (text, send_or_receive, user, timestamp) => {
        const mainChatText = $("#main_chat_text");

        send_or_receive == "sender" ? send_or_receive = "chat-sender" : send_or_receive = "chat-receiver";


        const newline = $("<div></div>");
        const message = $("<span id='message'></span>");
        const time = $("<span id='time'></span>");
        const text1 = $("<span></span>");
        const client_initials = $("<div class='data-initials'></div>")

        text1.addClass(send_or_receive);
        newline.addClass(send_or_receive);

        time.html(timestamp);
        text1.html(text);

        message.prop('title', timestamp);

        if (send_or_receive.match("receiver")) {
            client_initials.html(user_chat_receiver_data[0].nickname.match(/(\b[aA-zZ])?/g).join("").toUpperCase());
            client_initials.addClass("ms-2 bg-primary")
            message.append(client_initials);

            text1.addClass("ms-0")
            message.append(text1);
            message.append(time);
        } else {
            message.append(time);
            message.append(text1);

            client_initials.addClass("bg-success")
            client_initials.html(user_session_name.match(/(\b[aA-zZ])?/g).join("").toUpperCase());
            message.append(client_initials);
        }

        newline.append(message);
        mainChatText.append(newline);

        mainChatText.scrollTop(mainChatText.prop("scrollHeight"));

        message.hover(function() {
            message.children("#time").fadeIn();
        });
        message.mouseleave(function() {
            message.children("#time").fadeOut();
        });
    }


    var checkChatInterval = setInterval(chatInterval, 500); // 1 second
</script>