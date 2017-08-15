include ActionView::Helpers::DateHelper

module NotificationsHelper
  def activity_to_notifications(activities)
    return if activities.nil?

    notifications = []

    activities.each do |a|
      owner = User.find(a.owner_id)

      case a.key
      when "post.create"
        post = Post.find(a.trackable_id)
        notifications.push({"message" => "shared a new post", "time_stamp" => time_ago_in_words(a.created_at), "owner" => owner, "object" => post})
      when "post_like.create"
        post = PostLike.find(a.trackable_id).post
        notifications.push({"message" => "liked a post", "time_stamp" => time_ago_in_words(a.created_at), "owner" => owner, "object" => post})
      end
    end

    return notifications
  end
end
