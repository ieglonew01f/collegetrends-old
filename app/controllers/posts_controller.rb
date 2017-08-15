require 'link_thumbnailer'

class PostsController < ApplicationController
  def create
    post = Post.new(post_params)
    post.user_id = current_user.id
    post.content = params[:post][:content]
    post.post_meta = params[:post][:post_meta]
    post.post_type = params[:post][:post_type].to_i

    post_user = User.select("first_name, last_name, profile_picture").find_by_id(current_user.id)

    respond_to do |format|
      if post.save
        format.json { render :json => { :status => 200, :message => 'Post has been created successfully', :post => post, :post_user => post_user } }
      else
        format.json { render :json => { :status => :unprocessable_entity, :errors => post.errors } }
      end
    end
  end

  def destroy
    post = Post.where('id = ? AND user_id = ?', params[:post][:id], current_user.id).first

    respond_to do |format|
      if post.delete
        format.json { render :json => { :status => 200, :message => 'Post has been deleted successfully', :post => post} }
      else
        format.json { render :json => { :status => :unprocessable_entity, :errors => post.errors } }
      end
    end
  end

  #Get expanding url
  #this api crunches links and shits an object with images, headers etc
  def parse_link
    link = params[:link]

    respond_to do |format|
      if link.blank?
        format.json { render :json => { :status => 422, :message => 'Link is missing'}}
      else
        page_object = LinkThumbnailer.generate(link)
        format.json { render :json => { :status => 200, :message => 'URL expanded successfully', :page_object => page_object} }
      end
    end
  end

  def show
    post_id = params[:id]
    @post = Post.find(post_id)
    @user = User.find(current_user.id)
  end

  private
    def post_params
      params.require(:post).permit(:id, :content, :post_meta, :post_type)
    end
end
