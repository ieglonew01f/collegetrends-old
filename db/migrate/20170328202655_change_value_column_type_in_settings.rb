class ChangeValueColumnTypeInSettings < ActiveRecord::Migration[5.0]
  def change
    change_column :settings, :setting_value, :text
  end
end
