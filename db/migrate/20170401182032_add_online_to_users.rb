class AddOnlineToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :online, :integer
  end
end
