# frozen_string_literal: true

module Metrics
  class ApplicationController < DashboardController
    authorization_context 'metrics'
    authorization_required

    def index
      enforce_permissions('metrics:application_list')
    end

    def maia
      redirect_to "https://maia.#{current_region}.cloud.sap/#{@scoped_domain_name}?x-auth-token=#{current_user.token}"
    end

    def get_metrics
      instance_id = params.require('instance_id')
      # for prometheus api we need to caculate milisecond comma seperated
      start_time = params['start_time'].to_f/1000 || Time.now - 60*60*24
      end_time = params['end_time'].to_f/1000 || Time.now
      steps = params['steps'] || 360

      # https://documentation.global.cloud.sap/docs/metrics/metrics.html
      # CPU Usage
      cpu_data = services.metrics.get_metrics_for("vcenter_cpu_usage_average",instance_id,@scoped_project_id,start_time,end_time,steps)
      cpu_usage_average_values = []
      unless cpu_data.values.nil?
        cpu_usage_average_values = cpu_data.values.map{ |v| {
          x:Time.at(v[0]).strftime("%F %T"),
          y: (v[1].to_f/10000).round(2) }
        }
      end

      # Memory Usage
      mem_data = services.metrics.get_metrics_for("vcenter_mem_usage_average",instance_id,@scoped_project_id,start_time,end_time,steps)
      mem_usage_average_values = []
      unless mem_data.values.nil?
        mem_usage_average_values = mem_data.values.map{ |v| {
          x:Time.at(v[0]).strftime("%F %T"),
          y: (v[1].to_f/10000).round(2) }
        }
      end

      # Network Usage
      net_bytesTx_data = services.metrics.get_metrics_for("vcenter_net_bytesTx_average",instance_id,@scoped_project_id,start_time,end_time,steps)
      net_bytesTx_average_values = []
      unless net_bytesTx_data.values.nil?
        net_bytesTx_average_values = net_bytesTx_data.values.map{ |v| {
          x:Time.at(v[0]).strftime("%F %T"),
          y: (v[1]) }
        }
      end
      net_bytesRx_data = services.metrics.get_metrics_for("vcenter_net_bytesRx_average",instance_id,@scoped_project_id,start_time,end_time,steps)
      net_bytesRx_average_values = []
      unless net_bytesRx_data.values.nil?
        net_bytesRx_average_values = net_bytesRx_data.values.map{ |v| {
          x:Time.at(v[0]).strftime("%F %T"),
          y: (v[1]) }
        }
      end

      render json: {
        cpu_usage_average: [{
          id: 'CPU Usage',
          data: cpu_usage_average_values
        }],
        mem_usage_average: [{
          id: 'Memory Usage',
          data: mem_usage_average_values
        }],
        net_usage_average: [
          {
            id: 'Network BytesTx',
            data: net_bytesTx_average_values
          },
          {
            id: 'Network BytesRx',
            data: net_bytesRx_average_values
          }
        ]
      }
    end

  end
end
