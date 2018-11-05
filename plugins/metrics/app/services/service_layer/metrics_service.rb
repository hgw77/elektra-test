module ServiceLayer
  class MetricsService < Core::ServiceLayer::Service
    def available?(_action_name_sym = nil)
      elektron.service?('maia')
    end

    def elektron_metrics
      @elektron_metrics ||= elektron.service(
        'maia'
      )
    end

    def metrics_map
      @metrics_map ||= class_map_proc(Metrics::MetricsData)
    end

    def get_metrics_for(metric,instance_uuid,project_id = "",start_time = Time.now - 60*60*24, end_time = Time.now, step = "360")

      # https://documentation.global.cloud.sap/docs/metrics/metrics.html
      # https://ruby-doc.org/core-2.2.0/Time.html

      # default timeframe 1d
      elektron_metrics.get('query_range',
        'query' => "#{metric}{instance_uuid='#{instance_uuid}'}",
        'start' => start_time.to_i,
        'end'   => end_time.to_i,
        'step'  => step,
        'project_id' => project_id,
      ).map_to('body') do |body|
        Metrics::MetricsData.new(self, body['data']['result'][0])
      end
      #.map_to('body') do |body|
      #  &metrics_map)
      #end



    end
  end
end
