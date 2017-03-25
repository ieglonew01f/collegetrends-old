class CreatePostLikes < ActiveRecord::Migration[5.0]
  def change
    create_table :post_likes do |t|
      t.integer :post_id
      t.integer :liked_by

      t.timestamps
    end
  end
end
