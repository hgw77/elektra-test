######################### VERSION 1 ##############################
# This version does not open overlay dynamically. It renders a static version of the overlay.
 
# # apply non-idempotent transformations to the body
# $(document).on 'ready', ->
#   # get current window location
#   current_location = window.location.href
#
#   # replace history state with current location
#   History.replaceState(current_location)
#
#   $('#modal-holder').on 'hidden.bs.modal', '.modal', ->
#     History.replaceState(null, null, current_location)
#
# # apply non-idempotent transformations to the document
# # initialize modal links. Push the url of the modal link to the history.
# $(document).on 'click', 'a[data-modal=true]', ->
#   History.replaceState(null, null, this.href)


#################### VERSION 2 ########################
# In this version overlay are opened automatically if overlay parameter is presented in the url.

# store current location 
current_location = window.location
# store host
hostUrl = "#{window.location.protocol}//#{window.location.host}"
# store path
current_path = window.location.pathname

# This method returns a parameter value for a given parameter name.
getParameterByName= (url,name) ->
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
  regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
  results = regex.exec(url)
  
  if results == null then "" else decodeURIComponent(results[1].replace(/\+/g, " "))

# This method checks if overlay parameter is presented and if so it tries to open the overlay. 
handleUrl= (url) ->
  # check if overlay parameter is presented  
  hidden = true

  if url.indexOf("?overlay=")>-1 or url.indexOf("&overlay=") >-1
    overlay = getParameterByName(url,'overlay');
    # build the href. If overlay value doesn't start with a "/" then 
    # it is a relative url and should be extended with the current path.
    # e.g. new -> /current_path/new  
    href = if overlay[0]=='/' then overlay else "#{current_path}/#{overlay}" 
    # replace // with /
    href = href.replace(/\/\//g,'/')
    # look fo the anker with this href

    MoModal.load(href)
    hidden=false
    
      
    # $anker = $("[href$='#{href}']")
    # # if found then open the overlay. Otherwise hide current overlay
    # if $anker.length>0
    #   unless ($("#modal-holder .modal").data('bs.modal') || {}).isShown
    #     #console.log 'handleUrl->trigger click on ', href
    #     MoModal.load($anker)
    #     hidden=false
    
  if hidden 
    $('#modal-holder .modal').modal('hide')

# add overlay parameters to the current url    
buildNewStateUrl= (href) ->
  href ||= ''
  # it is an absolute url if it contains the current path
  isAbsolutePath = (href.indexOf(current_path)==-1)
  # build href which will be shown in window address bar.
  # Idea:
  #  Case 1: 
  #    base url: http://localhost:3000/sap_default/***REMOVED***_sandbox/instances
  #    link url: /sap_default/***REMOVED***_sandbox/instances/new
  #    -> overlay url (href): http://localhost:3000/sap_default/***REMOVED***_sandbox/instances/?overlay=new
  #  Case 2:
  #    base url: http://localhost:3000/sap_default/***REMOVED***_sandbox/instances/23/show
  #    link url: /sap_default/***REMOVED***_sandbox/instances/new
  #    -> overlay url (href): http://localhost:3000/sap_default/***REMOVED***_sandbox/instances/23/show?overlay=/sap_default/***REMOVED***_sandbox/instances/new 
  
  href = href.replace(hostUrl,'').replace(current_path,'').replace(/^\/+/,'').trim()
  href = "/#{href}" if isAbsolutePath
  
  if History.options.html4Mode
    return "?overlay=#{href}"
  else
    current_url = current_location.href 
    if current_url.indexOf("?")>=0
      overlayPos = current_url.indexOf('&overlay')
      current_url = current_url.substr(0,overlayPos) if overlayPos>-1
      return "#{current_url}&overlay="+href
    else
      return "#{current_url}?overlay="+href
 
# remove overlay parameters from the current url    
restoreOriginStateUrl= () ->
  if History.options.html4Mode
    return current_path
  else  
    current_url = current_location.href
    overlayPos = current_url.indexOf('?overlay')
    overlayPos = current_url.indexOf('&overlay') if overlayPos==-1
    current_url = current_url.substr(0,overlayPos) if overlayPos>-1   
    return current_url   

click_drivern=false
# Bind to StateChange Event
History.Adapter.bind window,'statechange', -> # Note: We are using statechange instead of popstate
  State = History.getState() # Note: We are using History.getState() instead of event.state
  #console.log "click: ", click_drivern
  # do not handle the url if a link has been clicked (to avoid double opening). 
  # handle url only if history buttons of browser (back,next) were clicked.
  handleUrl(State.url) unless click_drivern
  click_drivern=false

# initialize modal links to change the window.location url
$(document).on 'click', 'a[data-modal=true]', ->
  click_drivern = true
  # push current href to the history (this chnages the url in address bar)
  History.pushState(null, null, buildNewStateUrl(this.href))


$(document).ready ->
  # try to find the overlay parameter in the url and handle it if found.  
  unless History.options.html4Mode 
    handleUrl(current_location.href)

  # reset history (url in address bar) after an overlay has been closed.
  $('#modal-holder').on 'hidden.bs.modal', '.modal', () ->
    History.pushState(null, null, restoreOriginStateUrl())



