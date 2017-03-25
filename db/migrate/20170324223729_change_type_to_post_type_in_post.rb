class ChangeTypeToPostTypeInPost < ActiveRecord::Migration[5.0]
  def change
    rename_column :posts, :type, :post_type
  end
end
