class CreatePostData < ActiveRecord::Migration[5.0]
  def change
    create_table :post_data do |t|
      t.integer :post_id
      t.string :data_type
      t.text :data

      t.timestamps
    end
  end
end
