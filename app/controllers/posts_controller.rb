class PostsController < ApplicationController
  def create
    post = Post.new(post_params)
    post.user_id = current_user.id
    post.content = params[:post][:content]
    post.post_type = params[:post][:post_type].to_i

    post_user = User.select("first_name, last_name, profile_picture").find_by_id(current_user.id)

    respond_to do |format|
      if post.save
        format.json { render :json => { :status => 200, :message => 'Post has been created successfully', :post => post, :post_user => post_user } }
      else
        format.json { render json => { :status => :unprocessable_entity, :errors => post.errors } }
      end
    end
  end

  def destroy
    post = Post.where('id = ? AND user_id = ?', params[:post][:id], current_user.id).first

    respond_to do |format|
      if post.delete
        format.json { render :json => { :status => 200, :message => 'Post has been deleted successfully', :post => post} }
      else
        format.json { render json => { :status => :unprocessable_entity, :errors => post.errors } }
      end
    end
  end

  private
    def post_params
      params.require(:post).permit(:id, :content, :post_type)
    end
end
