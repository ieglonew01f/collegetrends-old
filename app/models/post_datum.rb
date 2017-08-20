class PostDatum < ApplicationRecord
  mount_uploader :data, ImageUploader
  
  belongs_to :post
end
