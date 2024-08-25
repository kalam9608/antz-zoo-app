export const sendMessage = (messageArray, messageType = "text", UserId, receiver_id, groupInfo) => {



  const msg = messageArray[0];
  const myMsg = {
    ...msg,
    user: {
      _id: UserId,
    },
    action: groupInfo ? "message" : "private",
    conversation_type: groupInfo ? "group" : "private",
    message_type: messageType ? messageType : "text",
    sender_id: UserId,
  };

  if (!groupInfo) {
    myMsg.receiver_id = receiver_id
  }

  if(groupInfo) {
    myMsg.group_id = myMsg.groupInfo.group_id,
    myMsg.group_name= myMsg.groupInfo.group_name,
    myMsg.room= `${groupInfo.group_name}-${groupInfo.group_id}`
  }

  if (messageType === "image") {
    myMsg.text = null;
    myMsg.image = myMsg.message;
    myMsg.file = { url: myMsg.message };
  }

  return myMsg;
};
