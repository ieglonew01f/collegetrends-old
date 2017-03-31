Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  resources :settings
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  devise_scope :user do
    get '/users/sign_out', to: 'devise/sessions#destroy', as: :sign_out
  end

  root 'index#index'

  resources :post_likes
  resources :messages
  resources :followers
  resources :posts
  resources :users

  resources :home do
    collection do
      get 'index'
    end
  end

  resources :setup do
    collection do
      get 'index'
      post 'save'
    end
  end

  get 'profile/:username' => 'profile#index'
  get 'profile/:username/edit' => 'profile#edit'

  resources :profile do
    collection do
      patch 'update'
    end
  end

  mount ActionCable.server => '/cable'
end
