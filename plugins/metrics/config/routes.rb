Metrics::Engine.routes.draw do
  get '/' => 'application#index', as: :index
  get 'maia' => 'application#maia', as: :maia
  get 'get_metrics' => 'application#get_metrics', as: :get_metrics
end
