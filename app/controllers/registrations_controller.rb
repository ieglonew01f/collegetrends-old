class RegistrationsController < Devise::RegistrationsController
  after_filter :set_user_data, only: [:create]

  private

  def set_user_data
    #email = params["user"]["email"]
    #user = User.find_by_email(email)

    #move this to settings in future
    #user.profile_picture = '/assets/sprites/person.png'
    #user.save!
  end

  def sign_up_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
  end

  def account_update_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation, :current_password)
  end

  protected

  def after_sign_up_path_for(resource)
    '/home'
  end
end
