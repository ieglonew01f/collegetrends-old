class HomeController < ApplicationController
  include PostsHelper
  include ActivityHelper

  def index
  	get_home_posts
  	@activities = get_activities()

    if @user.sign_in_count == 1
      redirect_to '/setup/'
    end
  end
end
