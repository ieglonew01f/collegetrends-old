module ActivityHelper
  def get_activities
    activities = []

    ac = PublicActivity::Activity.all.order('created_at desc')

    ac.each do |a|
      owner = User.find(a.owner_id)

      case a.key
      when "post.create"
        post = Post.find(a.trackable_id)
        activities.push({"message" => "shared a new <a href='/posts/#{post.id}'>post</a>", "time_stamp" => time_ago_in_words(a.created_at), "owner" => owner, "object" => post})
      when "post_like.create"
        post = PostLike.find(a.trackable_id).post
        recipient = User.find(post.user_id)
        activities.push({"message" => "liked <a href='/profile/#{recipient.username}'>#{recipient.first_name} #{recipient.last_name}</a>  <a href='/posts/#{post.id}'>post</a>", "time_stamp" => time_ago_in_words(a.created_at), "owner" => owner, "object" => post})
      when "comment.create"
        post = Comment.find(a.trackable_id).post
        recipient = User.find(post.user_id)
        activities.push({"message" => "commented on <a href='/profile/#{recipient.username}'>#{recipient.first_name} #{recipient.last_name}</a>  <a href='/posts/#{post.id}'>post</a>", "time_stamp" => time_ago_in_words(a.created_at), "owner" => owner, "object" => post}) 
      end
    end

    return activities
  end
end
