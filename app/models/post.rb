class Post < ApplicationRecord
  include PublicActivity::Model
  tracked owner: Proc.new{ |controller, model| controller.current_user }

  has_many :post_likes
  has_many :comments
  has_many :post_data
  
  belongs_to :user
end
