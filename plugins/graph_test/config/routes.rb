GraphTest::Engine.routes.draw do
  root to: 'application#index', as: :start
  get 'get_metrics' => 'application#get_metrics', as: :get_metrics
end
