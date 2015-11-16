module ServiceLayer

  class IdentityService < DomainModelServiceLayer::Service

    attr_reader :region

    def driver
      @driver ||= Identity::Driver::Fog.new({
        auth_url:   self.auth_url,
        region:     self.region,
        token:      self.token,
        domain_id:  self.domain_id,
        project_id: self.project_id  
      })
    end

    def has_projects?
      driver.auth_projects.count>0
    end

    ##################### DOMAINS #########################
    def find_domain id_or_name
      begin
        driver.map_to(Domain).get_domain(id_or_name)
      rescue
        driver.map_to(Domain).domains(:name => id_or_name).first rescue nil
      end
    end
    
    def new_domain(attributes={})
      Domain.new(@driver,attributes)
    end

    def auth_domains
      @domains ||= driver.auth_domains.collect{|attributes| Domain.new(@driver,attributes)}
    end
    
    def domains(filter={})
      driver.map_to(Domain).domains(:name => domain_fid_id_or_key).first
    end

    ##################### PROJECTS #########################    
    def new_project(attributes={})
      Project.new(@driver,attributes)
    end
      
    def find_project(id=nil,options=[])
      driver.map_to(Project).get_project(id,options)
    end
    
    def projects_by_user_id(user_id)
      driver.user_projects(user_id)
    end

    def auth_projects(domain_id=nil)
      # caching
      @auth_projects ||= driver.map_to(Project).auth_projects
      
      return @auth_projects if domain_id.nil?
      @auth_projects.select {|project| project.domain_id==domain_id}
    end
    
    def projects(filter={})
      driver.projects(filter)
    end

    def grant_project_role(project,role_name)
      role = services.admin_identity.role(role_name)
      driver.grant_project_user_role(project_id,@current_user.id,role.id)
    end


    ##################### CREDENTIALS #########################
    def new_credential(attributes={})
      OsCredential.new(@driver,attributes)      
    end
    
    def find_credential(id=nil)
      driver.map_to(OsCredential).get_os_credential(id)
    end

    def credentials(options={})
      @user_credentials ||= driver.map_to(OsCredential).os_credentials(user_id: @current_user.id)
    end
    
    ####################### ROLES ###########################
    # current_user roles
    def roles
      @roles ||= driver.map_to(Role).roles
    end
    
    def find_role(id)
      roles.select { |r| r.id==id }.first
    end
    
    def find_role_by_name(name)
      roles.select { |r| r.name==name }.first
    end
    
    def role_assignments(filter={})
      driver.map_to(RoleAssignment).role_assignments(filter)
    end
    
    def grant_domain_user_role(domain_id, user_id, role_id)
      driver.grant_domain_user_role(domain_id, user_id, role_id)
    end
    
    ###################### TOKENS ###########################
    def validate_token(token)
      driver.validate(token) rescue false
    end
    
  end
end
  