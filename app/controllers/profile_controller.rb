class ProfileController < ApplicationController
  def index
    @user = User.find_by_username(params[:username])
    @posts = Post.where(user_id: @user.id).order(created_at: :desc)

    @isCurrentUserFollowingProfileId = Follower.where('follower_id = ? AND following_id = ?', current_user.id, @user.id).empty?
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
