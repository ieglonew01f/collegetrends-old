class ProfileController < ApplicationController
  def index
    @user = User.find_by_username(params[:username])
    @posts = Post.where(user_id: @user.id).order(created_at: :desc)

    <<-DOC
    @people_class = ''
    person = Person.where("for_id = ? AND by_id = ?", @user.id, current_user.id).first
    follower = Follower.where("follower_id = ? AND following_id = ?", current_user.id, @user.id).first

    if person
      if person.status == 0 #friend request sent
        @people_text = 'Friend request sent'
      elsif person.status == 1 #already friends
        @people_text = 'Friends'
      else #else either status = 2 where for_id rejected current_user request or something else
        @people_class = 'add_user'
        @people_text = 'Add friend'
      end
    else
      @people_class = 'add_user'
      @people_text = 'Add Friend'
    end

    if follower
      @follower_text = 'UnFollow'
      @follower_class = 'unfollow-user'
    else
      @follower_text = 'Follow'
      @follower_class = 'follow-user'
    end

    #todo some error handling if no username is found
    DOC
  end

  def edit
    @user = User.find_by_id(current_user.id)
  end

  def update
    user = User.find(current_user.id)

    user.first_name = params[:profile][:first_name] if !params[:profile][:first_name].blank?
    user.last_name = params[:profile][:last_name] if !params[:profile][:last_name].blank?

    user.username = params[:profile][:username] if !params[:profile][:username].blank?

    user.location = params[:profile][:location] if !params[:profile][:location].blank?
    user.home_town = params[:profile][:home_town] if !params[:profile][:home_town].blank?
    user.about = params[:profile][:about] if !params[:profile][:about].blank?

    respond_to do |format|
      if user.save
        format.json { render :json => { :status => 200, :message => 'User updated successfully' } }
      else
        format.json { render json => { :status => :unprocessable_entity, :errors => user.errors } }
      end
    end
  end
end
