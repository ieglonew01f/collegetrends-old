class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :location
      t.string :home_town
      t.string :college
      t.string :relationship_status
      t.text :about

      t.timestamps
    end
  end
end
