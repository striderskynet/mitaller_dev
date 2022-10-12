<style>
</style>
<br>
<div class="chat-container">
    <div class="row no-gutters">
        <div class="col-md-4 border-right">
            <div class="search-box ml-5 mr-5 mt-2 mb-2">
                <div class="input-wrapper">
                    <input class="form-control" placeholder="Search here" type="text">
                </div>
            </div>
            <div id="chatUserList"></div>
        </div>
        <div class="col-md-8">
            <div class="settings-tray">
                <div class="friend-drawer">
                    <img class="profile-image" src="../../elements/uploaded/users/no_avatar.png" alt="">
                    <div class="text">
                        <h6 id='chatUserReceiver'>{chatUserReceiver}</h6>

                    </div>
                    <span class="tray-right">
                        <i class="fas fa-rotate"></i>
                        <i class="fas fa-message"></i>
                        <i class="fas fa-bars"></i>
                    </span>
                </div>
            </div>
            <div class="chat-panel">
                <div id="main_chat_text"></div>
                <div class="row">
                    <div class="col-12">
                        <div class="chat-box-tray">
                            <input class=' form-control' id="chat_text" type="text" placeholder="Type your message here...">
                            <i class="fa fa-paper-plane"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    var user_chat_receiver = 2;
    var user_chat_receiver_data = getAjaxValue("../../api/?query=" + `SELECT * FROM \`general_users\` WHERE \`id\` = ${user_chat_receiver}`, "GET");

    $("#chatUserReceiver").html(user_chat_receiver_data[0].nickname);

    const mainChatText = $("#main_chat_text");
    var lastCheckDate = null;
    var chat_msg = new Array();

    $("#chat_text").keypress(function(event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode != '13') return null;
        if ($(this).val().length == 0) return null;

        //user_session_id == 1 ? sender = 2 : sender = 1;

        sendChatText($(this).val(), user_session_id, user_chat_receiver);
        $(this).val("");
    });

    const sendChatText = (text, fromUser, toUser, important = 0) => {
        console.log(`Send text: \"${text}\" from User: ${fromUser} to User: ${toUser}`);
        send = getAjaxValue("../../api/?query=" + `INSERT INTO \`internal_chat_messages\` SET \`message\`="${text}", \`user_sender\` = ${fromUser}, \`user_receiver\` = ${toUser}, \`priority\` = ${important}`, "GET");
    }

    var firstTime = true;
    const chatInterval = (start = false) => {
        if (start) {
            chat_msg = new Array();
            mainChatText.html("");
        }

        chats = getAjaxValue("../../api/?query=" + `SELECT * FROM \`internal_chat_messages\` WHERE \`user_receiver\` in (${user_session_id},${user_chat_receiver}) AND \`user_sender\` in (${user_session_id},${user_chat_receiver}) LIMIT 20`, "GET");

        Object.keys(chats).forEach((key) => {
            if (!chat_msg[chats[key].id]) {

                chat_msg[chats[key].id] = {
                    txt: chats[key].message,
                    sender: chats[key].user_sender,
                    receiver: chats[key].user_receiver,
                    timestamp: chats[key].datetime
                }

                let send_or_receive = false;
                if (chat_msg[chats[key].id].sender == user_session_id) send_or_receive = true;

                add_msg_to_chat(chat_msg[chats[key].id].txt, send_or_receive, chat_msg[chats[key].id].sender, chat_msg[chats[key].id].timestamp);
                if (!firstTime) refreshChatUserList();
            }
        });
        firstTime = false;
    }

    const add_msg_to_chat = (text, sender, user, timestamp) => {


        let line = `<div class="row no-gutters"><div class="col-md-5" >
        <div class = "chat-bubble chat-bubble--left" >{text}</div></div></div>`;
        if (sender == true) {
            line = `<div class="row no-gutters"><div class="col-md-5 offset-md-7" >
        <div class = "chat-bubble chat-bubble--right">{text}</div></div></div>`;
        }

        line = line.replace("{text}", text);
        const newline = $(line);

        mainChatText.append(newline);
        mainChatText.scrollTop(mainChatText.prop("scrollHeight"));
    }

    const refreshChatUserList = () => {
        var chatUserList = $("#chatUserList")
        chatUserList.html("");


        users = getAjaxValue("../../api/?query=" + `SELECT * FROM \`general_users\``, "GET");

        Object.keys(users).forEach((key) => {
            var userElement = `<div onClick='changeChatReceiver(${users[key].id})' class="p-2 mb-1 friend-drawer friend-drawer--onhover">
                <img class="profile-image" src="../../elements/uploaded/users/no_avatar.png" alt="">
                <div class="text">
                    <h6>{nickname}</h6>
                    <p class="text-muted">{lastMessage}</p>
                </div>
                <span class="time text-muted small">{lastMessageDate}</span>
            </div>`;

            if (users[key].id != user_session_id) {
                lastChat = getAjaxValue("../../api/?query=" + `SELECT * FROM \`internal_chat_messages\` WHERE \`user_sender\` = ${users[key].id} AND \`user_receiver\` = ${user_session_id} ORDER BY \`id\` DESC LIMIT 1 `, "GET");

                var lastMessage, lastMessageDate;
                if (lastChat.length == 0) {
                    lastMessage = "";
                    lastMessageDate = "";
                } else {
                    lastMessage = lastChat[0].message
                    lastMessageDate = lastChat[0].datetime.split(" ")[1]
                }

                userElement = userElement.replace("{nickname}", users[key].nickname);
                userElement = userElement.replace("{lastMessage}", lastMessage);
                userElement = userElement.replace("{lastMessageDate}", lastMessageDate);

                chatUserList.append($(userElement));
            } else {
                $("#myNickname").html(users[key].nickname);
            }
        })
    }

    const changeChatReceiver = (usrID) => {

        if (usrID == user_chat_receiver) return;

        user_chat_receiver = usrID;
        chatInterval(true);

        user_chat_receiver_data = getAjaxValue("../../api/?query=" + `SELECT * FROM \`general_users\` WHERE \`id\` = ${user_chat_receiver}`, "GET");
        $("#chatUserReceiver").html(user_chat_receiver_data[0].nickname);
    }

    refreshChatUserList();
    var checkChatInterval = setInterval(chatInterval, 500); // 1 second
</script>