class IndexController < ApplicationController
  def index
    if user_signed_in?
      redirect_to '/home'
    else
      @user = User.new
    end
  end
end
