class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "conversation_master_channel"
    stream_from "conversation_#{params['conversation_id']}_channel" #conversation_id comes from room.coffee App.cable.subscriptions.create
  end

  def connected(data)
    logger.info("============== CONNECTED =================")
    logger.info(data)

    ActionCable.server.broadcast "conversation_master_channel", data: data

    #set the user online
    user = User.find(data["user_id"])
    user.online = 1
    user.save
  end

  def unsubscribed

  end

  def disconnected(data)
    # Any cleanup needed when channel is unsubscribed
    logger.info("============== DISCONNECTED =================")

    ActionCable.server.broadcast "conversation_master_channel", data: data

    #set the user online
    user = User.find(data["user_id"])
    user.online = 0
    user.save
  end

  def is_typing(data)
    ActionCable.server.broadcast "conversation_#{data["for_id"]}_channel", data: data
  end

  def speak(data)
    Message.create! message: data['message'], for_id: data['for_id'], by_id: data['by_id']
  end
end
