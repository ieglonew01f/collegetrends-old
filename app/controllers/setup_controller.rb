class SetupController < ApplicationController
  def index
      @user = User.find_by_id(current_user.id)
  end

  def save
      user = User.find_by_id(current_user.id)
      user.college = params[:setup][:college] if !params[:setup][:college].blank?
      user.home_town = params[:setup][:home_town] if !params[:setup][:home_town].blank?
      user.about = params[:setup][:about] if !params[:setup][:about].blank?
      user.sign_in_count = 2

      respond_to do |format|
        if user.save
          format.json { render :json => { :status => 200, :message => 'User updated successfully' } }
        else
          format.json { render json => { :status => :unprocessable_entity, :errors => user.errors } }
        end
      end
  end
end
