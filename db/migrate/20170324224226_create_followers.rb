class CreateFollowers < ActiveRecord::Migration[5.0]
  def change
    create_table :followers do |t|
      t.integer :follower_id
      t.integer :following_id

      t.timestamps
    end
  end
end
