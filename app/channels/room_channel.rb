class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from "conversation_#{params['conversation_id']}_channel" #conversation_id comes from room.coffee App.cable.subscriptions.create
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak(data)
    Message.create! message: data['message'], for_id: data['for_id'], by_id: data['by_id']
  end
end
