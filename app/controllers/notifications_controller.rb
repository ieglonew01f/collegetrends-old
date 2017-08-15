class NotificationsController < ApplicationController
  include NotificationsHelper

	def index
    activities = PublicActivity::Activity.where('owner_id != ?', current_user.id).order('created_at desc')
    notifications = activity_to_notifications(activities)

    respond_to do |format|
      format.json { render :json => { :status => 200, :notifications => notifications } }
    end
  end
end
