class PostLikesController < ApplicationController
  before_action :set_post_like, only: [:show, :edit, :update, :destroy]

  # GET /post_likes
  # GET /post_likes.json
  def index
    @post_likes = PostLike.all
  end

  # GET /post_likes/1
  # GET /post_likes/1.json
  def show
  end

  # GET /post_likes/new
  def new
    @post_like = PostLike.new
  end

  # GET /post_likes/1/edit
  def edit
  end

  # POST /post_likes
  # POST /post_likes.json
  def create
    @post_like = PostLike.new(post_like_params)

    respond_to do |format|
      if @post_like.save
        format.html { redirect_to @post_like, notice: 'Post like was successfully created.' }
        format.json { render :show, status: :created, location: @post_like }
      else
        format.html { render :new }
        format.json { render json: @post_like.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /post_likes/1
  # PATCH/PUT /post_likes/1.json
  def update
    respond_to do |format|
      if @post_like.update(post_like_params)
        format.html { redirect_to @post_like, notice: 'Post like was successfully updated.' }
        format.json { render :show, status: :ok, location: @post_like }
      else
        format.html { render :edit }
        format.json { render json: @post_like.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /post_likes/1
  # DELETE /post_likes/1.json
  def destroy
    @post_like.destroy
    respond_to do |format|
      format.html { redirect_to post_likes_url, notice: 'Post like was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post_like
      @post_like = PostLike.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def post_like_params
      params.require(:post_like).permit(:post_id, :liked_by)
    end
end
