class AddIndexToFollowers < ActiveRecord::Migration[5.0]
  def change
    add_index :followers, [:follower_id, :following_id], :unique => true
  end
end
