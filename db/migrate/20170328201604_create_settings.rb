class CreateSettings < ActiveRecord::Migration[5.0]
  def change
    create_table :settings do |t|
      t.string :setting_name
      t.integer :setting_value

      t.timestamps
    end
  end
end
