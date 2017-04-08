class SearchController < ApplicationController
  def people
    token = params[:token]
    people = User.select('first_name', 'last_name', 'username', 'college', 'profile_picture').where("first_name LIKE ? OR last_name LIKE ?", "%#{token}%", "%#{token}%")

    respond_to do |format|
      if people
        format.json { render :json => { :status => 200, :people => people } }
      else
        format.json { render :json => { :status => :unprocessable_entity, :errors => 'something went wrong :(' } }
      end
    end
  end
end
