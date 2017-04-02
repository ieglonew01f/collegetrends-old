class RegistrationsController < Devise::RegistrationsController
  after_filter :set_user_data, only: [:create]

  private

  def set_user_data
    email = params["user"]["email"]
    user = User.find_by_email(email)

    candidate_username = email.split('@')[0] + "_#{user.id}"
    user.username = candidate_username.gsub('.','_')

    user.profile_picture = '/assets/sprites/person.png'
    user.save!
  end

  def sign_up_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation, :gender)
  end

  def account_update_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation, :current_password)
  end
end
