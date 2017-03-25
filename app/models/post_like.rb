class PostLike < ApplicationRecord
  has_one :user
  belongs_to :post
end
