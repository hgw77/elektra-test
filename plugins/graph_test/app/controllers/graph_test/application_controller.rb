# frozen_string_literal: true

module GraphTest
  class ApplicationController < DashboardController

    def index

    end

    def get_metrics
      uuid = params.require('uuid')
      # get time frame
      # Date.now gives miliseconds but maia is not working with
      # that so we need to remove it here
      start_time = params['start_time'].to_i/1000 || Time.now - 60*60*24
      end_time = params['end_time'].to_i/1000 || Time.now
      steps = params['steps'] || 360

      data = services.metrics.get_metrics_for("vcenter_cpu_usage_average",uuid,@scoped_project_id, start_time, end_time,steps)

      # prepare date for response
      graph_values = []
      graph_values = data.values.map{ |v| {
        x:Time.at(v[0]).strftime("%F %T"),
        y: (v[1].to_f/10000).round(2) }
      }

      render json: {
        cpu_usage_average: {
          key: 'cpu-usage',
          values: graph_values
        }
      }
    end

  end
end
