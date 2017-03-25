json.extract! user, :id, :first_name, :last_name, :email, :location, :home_town, :college, :relationship_status, :about, :created_at, :updated_at
json.url user_url(user, format: :json)
