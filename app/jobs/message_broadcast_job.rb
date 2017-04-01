#app/jobs/message_broadcast_job.rb
class MessageBroadcastJob < ApplicationJob
  queue_as :default

  def perform(message)
    #here 1 should be
    #to whome the message to be sent (target user_id)
    ActionCable.server.broadcast "conversation_#{message.for_id}_channel", message: message
  end

  private

  #def render_message(message, isSelf)
    # isSelf true -> outgoing message
    #        false -> incoming message

    #if isSelf
      #ApplicationController.renderer.render(partial: "templates/outgoing_message", locals: { message: message })
    #else
      #ApplicationController.renderer.render(partial: "templates/incomming_message", locals: { message: message })
    #end
  #end
end
