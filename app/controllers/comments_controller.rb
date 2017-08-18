include ActionView::Helpers::DateHelper

class CommentsController < ApplicationController
  def index
    comments = Comment.where("post_id = ?", params[:post_id]).order("updated_at desc").limit(5)

    comments_count = Comment.where("post_id = ?", params[:post_id]).count

    comments_object = []

    comments.each do |comment|
      obj = {"comment" => comment, "user" => User.find(comment.user_id), "time_stamp" => time_ago_in_words(comment.updated_at)}
      comments_object.push(obj)
    end

    respond_to do |format|
      format.json { render :json => {:status => 200, :message => 'Comments list', :comments => comments_object, :comments_count => comments_count} }
    end
  end

  def create
    post = Post.find(params[:post_id])
    comment = Comment.new(comment_params)

    comment.user_id = current_user.id
    comment.comment_text = params[:comment][:comment_text]

    comment_user = User.find(current_user.id)

    comment_object = []
    obj = {"comment" => comment, "user" => comment_user, "time_stamp" => time_ago_in_words(DateTime.now)}
    comment_object.push(obj)

    respond_to do |format|
      if comment.save
        format.json { render :json => { :status => 200, :message => 'Comment has been created successfully', :comment => comment_object} }
      else
        format.json { render :json => { :status => :unprocessable_entity, :errors => comment.errors } }
      end
    end
  end

  def destroy
    comment = Comment.where('id = ? AND user_id = ?', params[:comment][:id], current_user.id).first

    respond_to do |format|
      if comment.delete
        format.json { render :json => { :status => 200, :message => 'Comment has been deleted successfully', :comment => comment} }
      else
        format.json { render :json => { :status => :unprocessable_entity, :errors => comment.errors } }
      end
    end
  end

  def load_more
    last_id = params[:last_id]
    post_id = params[:post_id]

    comments = Comment.where('id < ?', last_id).order("updated_at desc").limit(2)

    comments_object = []

    comments.each do |comment|
      obj = {"comment" => comment, "user" => User.find(comment.user_id), "time_stamp" => time_ago_in_words(comment.updated_at)}
      comments_object.push(obj)
    end

    respond_to do |format|
      format.json { render :json => {:status => 200, :message => 'Comments list', :comments => comments_object} }
    end
  end

  private
    def comment_params
      params.require(:comment).permit(:post_id, :comment_text)
    end
end
