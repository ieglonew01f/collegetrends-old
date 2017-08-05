module PostsHelper
	def get_home_posts
	  @posts = Post.all.order(created_at: :desc)
    @user = User.find_by_id(current_user.id)
	end
end
