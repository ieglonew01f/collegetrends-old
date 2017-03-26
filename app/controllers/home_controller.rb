class HomeController < ApplicationController
  def index
    @posts = Post.all.order(created_at: :desc)
    @user = User.find_by_id(current_user.id)

    if @user.sign_in_count == 1
      redirect_to '/setup/'
    end
  end
end
