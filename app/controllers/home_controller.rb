class HomeController < ApplicationController
  include PostsHelper
  def index
  	get_home_posts
    if @user.sign_in_count == 1
      redirect_to '/setup/'
    end
  end
end
