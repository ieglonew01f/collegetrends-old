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
end
