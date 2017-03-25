require 'test_helper'

class PostLikesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @post_like = post_likes(:one)
  end

  test "should get index" do
    get post_likes_url
    assert_response :success
  end

  test "should get new" do
    get new_post_like_url
    assert_response :success
  end

  test "should create post_like" do
    assert_difference('PostLike.count') do
      post post_likes_url, params: { post_like: { liked_by: @post_like.liked_by, post_id: @post_like.post_id } }
    end

    assert_redirected_to post_like_url(PostLike.last)
  end

  test "should show post_like" do
    get post_like_url(@post_like)
    assert_response :success
  end

  test "should get edit" do
    get edit_post_like_url(@post_like)
    assert_response :success
  end

  test "should update post_like" do
    patch post_like_url(@post_like), params: { post_like: { liked_by: @post_like.liked_by, post_id: @post_like.post_id } }
    assert_redirected_to post_like_url(@post_like)
  end

  test "should destroy post_like" do
    assert_difference('PostLike.count', -1) do
      delete post_like_url(@post_like)
    end

    assert_redirected_to post_likes_url
  end
end
