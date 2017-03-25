class HomeController < ApplicationController
  def index
    @posts = Post.where('user_id = ?', current_user.id).order(created_at: :desc)
    @user = User.find_by_id(current_user.id)
  end
end
