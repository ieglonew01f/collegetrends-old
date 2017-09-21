class MessagesController < ApplicationController
  def create
    message = params[:message]
    for_id = params[:for_id]

    msg = Message.new

    msg.message = message
    msg.for_id = for_id
    msg.by_id = current_user.id

    respond_to do |format|
      if msg.save
        format.json { render :json => { :status => 200, :message => "Message saved successfully."} }
      else
        format.json { render :json => { :status => :unprocessable_entity, :errors => msg.errors } }
      end
    end
  end

  def get_messages
    for_id = params[:for_id]
    current_user_id = current_user.id

    messages = []

    mgs = Message.find_by_sql("SELECT * FROM messages WHERE by_id = #{for_id} AND for_id = #{current_user_id} UNION SELECT * FROM messages WHERE by_id = #{current_user_id} AND for_id = #{for_id} ORDER BY id ASC")

    mgs.each do |m|
      messages.push({
        "message" => m,
        "outbound" => (m.by_id == current_user.id)
      })
    end

    respond_to do |format|
      format.json { render :json => { :status => 200, :messages => messages} }
    end
  end
end
