module Inquiry
  class Inquiry < ActiveRecord::Base
    include Filterable
    paginates_per 3

    has_many :process_steps, dependent: :destroy

    belongs_to :requester, class_name: "Inquiry::Processor"
    has_and_belongs_to_many :processors

    validates :processors, presence: {message: 'missing. Please contact an administrator!'}
    validates :description, presence: true

    attr_accessor :process_step_description, :current_user
    validates :process_step_description, presence: {message: 'Please provide a description for the process action'}

    scope :id, -> (id) { where id: id }
    scope :state, -> (state) { where aasm_state: state }
    #scope :requester_id, -> (requester_id) { where requester_id: requester_id }
    scope :requester_id, -> (requester_id) { Inquiry.joins(:requester).where(inquiry_processors: {uid: requester_id}).includes(:requester) }
    scope :processor_id, -> (processor_id) { Inquiry.joins(:processors).where(inquiry_processors: {uid: processor_id}).includes(:processors) }
    scope :kind, -> (kind) { where kind: kind }

    after_create :transition_to_open


    include AASM
    aasm do

      state :new, :initial => true, :before_enter => :set_process_step_description
      state :open
      state :approved
      state :rejected
      state :closed

      event :open, :after => :notify_processors do
        transitions :from => :new, :to => :open, :after => Proc.new { |*args| log_process_step(*args) }
      end

      event :approve, :after => :notify_requester, :guards => Proc.new { |*args| can_approve?(*args) } do
        transitions :from => :open, :to => :approved, :after => Proc.new { |*args| log_process_step(*args) }, :guards => [:can_approve?]
      end

      event :reject, :after => :notify_requester, :guards => Proc.new { |*args| can_reject?(*args) } do
        transitions :from => :open, :to => :rejected, :after => Proc.new { |*args| log_process_step(*args) }
      end

      event :reopen, :after => :notify_processors, :guards => Proc.new { |*args| can_reopen?(*args) } do
        transitions :from => :rejected, :to => :open, :after => Proc.new { |*args| log_process_step(*args) }, :guards => [:can_reopen?]
      end

      event :close, :guards => Proc.new { |*args| can_close?(*args) } do
        transitions :to => :closed, :after => Proc.new { |*args| log_process_step(*args) }, :guards => [:can_close?]
      end

    end

    def transition_to_open
      self.open!({description: self.process_step_description})
    end

    def set_process_step_description(options = {})
      self.process_step_description = "Initial creation!"
    end

    def log_process_step(options = {})
      step = ProcessStep.new
      step.from_state = aasm.from_state
      step.to_state = aasm.to_state
      step.event = aasm.current_event
      if options[:user]
        step.processor = Processor.find_by_uid(options[:user].id)
      else
        step.processor = self.requester
      end
      step.description = options[:description]
      self.process_steps << step
    end

    def can_approve? options={}
      return self.open? && user_is_processor?(get_user_id(options[:user]))
    end

    def can_reopen? options={}
      user = options[:user]
      return self.rejected? && user_is_requester?(get_user_id(options[:user]))
    end

    def can_reject? options={}
      user = options[:user]
      return self.open? && user_is_processor?(get_user_id(options[:user]))
    end

    def can_close? options={}
      user = options[:user]
      return user_is_processor?(get_user_id(options[:user])) || user_is_requester?(get_user_id(options[:user]))
    end

    def user_is_processor? user_id
      return true unless user_id
      if self.processors.find_by_uid(user_id)
        return true
      else
        return false
      end
    end

    def user_is_requester? user_id
      return true unless user_id
      if self.requester.uid == user_id
        return true
      else
        return false
      end
    end

    def events_allowed user
      self.current_user = user
      events = []
      self.aasm.events(user).each do |e|
        events << {event: e.name, name: Inquiry.aasm.human_event_name(e.name)}
      end
      return events
    end

    def states_allowed user
      self.current_user = user
      states = []
      self.aasm.states(:permitted => true).each do |s|
        states << {state: s.name, name: s.display_name}
      end
      return states
    end

    def get_user_id user
      if user
        return user.id
      elsif current_user
        return current_user.id
      else
        return nil
      end
    end

    def get_callback_action
      if self.callbacks.nil? || self.callbacks[self.aasm_state].nil?
        return nil
      else
        self.callbacks[self.aasm_state].name
      end
    end


    def notify_requester
      InquiryMailer.notification_email_requester(self.requester.email, self.requester.full_name, self.process_steps.last).deliver_later
    end

    def notify_processors
      InquiryMailer.notification_email_processors((self.processors.map { |p| p.email }).compact, self.process_steps.last).deliver_later
    end

  end
end
