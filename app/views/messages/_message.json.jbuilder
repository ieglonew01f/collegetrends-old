json.extract! message, :id, :message, :by_id, :for_id, :created_at, :updated_at
json.url message_url(message, format: :json)
