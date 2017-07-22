# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
AdminUser.create!(email: 'mukundamg1993@gmail.com', password: 'mukundamg1993', password_confirmation: 'mukundamg1993')
Setting.create!(setting_name: 'college_list', setting_value: 'BMS College of Engineering, ITM Universe')
