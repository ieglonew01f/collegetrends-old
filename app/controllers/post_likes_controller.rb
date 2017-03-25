class PostLikesController < ApplicationController

  def create
    post_like = PostLike.new(post_like_params)
    post_like.post_id = params[:post_like][:post_id]
    post_like.liked_by = current_user.id

    respond_to do |format|
      if post_like.save
        format.json { render :json => { :status => 200, :message => 'Post has been liked successfully', :post_like => post_like} }
      else
        format.json { render json => { :status => :unprocessable_entity, :errors => post_like.errors } }
      end
    end
  end

  def destroy
    post_like = PostLike.find_by_post_id(params[:post_like][:post_id])

    respond_to do |format|
      if post_like.delete
        format.json { render :json => { :status => 200, :message => 'Post has been unliked successfully', :post_like => post_like} }
      else
        format.json { render json => { :status => :unprocessable_entity, :errors => post_like.errors } }
      end
    end
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def post_like_params
      params.require(:post_like).permit(:post_id)
    end
end
