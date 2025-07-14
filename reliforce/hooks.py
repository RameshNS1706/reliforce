app_name = "reliforce"
app_title = "Reliforce"
app_publisher = "Ramesh N S"
app_description = "Relisys Sales Force Automation"
app_email = "rameshns1005@gmail.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "reliforce",
# 		"logo": "/assets/reliforce/logo.png",
# 		"title": "Reliforce",
# 		"route": "/reliforce",
# 		"has_permission": "reliforce.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/reliforce/css/reliforce.css"
# app_include_js = "/assets/reliforce/js/reliforce.js"

app_include_js = [
	"https://openlayers.org/api/2.13.1/OpenLayers.js",
	"https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
	"https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.umd.min.js",
	"https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js",
	"https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js",
	
]

app_include_css = [
	"https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
	"https://cdn.maptiler.com/maptiler-sdk-js/v2.0.3/maptiler-sdk.css",
	"https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css",
	"https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css",
	
]


# include js, css files in header of web template
# web_include_css = "/assets/reliforce/css/reliforce.css"
# web_include_js = "/assets/reliforce/js/reliforce.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "reliforce/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

doctype_js = {
	"Lead" : "public/js/doctype_custom/lead.js",
	"Customer" : "public/js/doctype_custom/customer.js",
	"Territory": "public/js/doctype_custom/territory.js",
	"Attendance" : "public/js/doctype_custom/attendance.js",
	"Distance Chart": "public/js/leaflet-routing-machine.js",
	"Distance Chart": "public/js/Control.Geocoder.js",
	"DCR Visit Entry": "public/js/leaflet-routing-machine.js",
	"DCR Visit Entry": "public/js/Control.Geocoder.js",
	"Geo Maps": "public/js/leaflet-routing-machine.js",
	"Geo Maps": "public/js/Control.Geocoder.js",
}

doctype_css = {    
	"Distance Chart": "public/css/leaflet-routing-machine.css",
	"Distance Chart": "public/css/Control.Geocoder.css",
	"DCR Visit Entry": "public/css/leaflet-routing-machine.css",
	"DCR Visit Entry": "public/css/Control.Geocoder.css",
	"Geo Maps": "public/css/leaflet-routing-machine.css",
	"Geo Maps": "public/css/Control.Geocoder.css",
}



# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "reliforce/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "reliforce.utils.jinja_methods",
# 	"filters": "reliforce.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "reliforce.install.before_install"
# after_install = "reliforce.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "reliforce.uninstall.before_uninstall"
# after_uninstall = "reliforce.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "reliforce.utils.before_app_install"
# after_app_install = "reliforce.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "reliforce.utils.before_app_uninstall"
# after_app_uninstall = "reliforce.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "reliforce.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"reliforce.tasks.all"
# 	],
# 	"daily": [
# 		"reliforce.tasks.daily"
# 	],
# 	"hourly": [
# 		"reliforce.tasks.hourly"
# 	],
# 	"weekly": [
# 		"reliforce.tasks.weekly"
# 	],
# 	"monthly": [
# 		"reliforce.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "reliforce.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "reliforce.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "reliforce.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["reliforce.utils.before_request"]
# after_request = ["reliforce.utils.after_request"]

# Job Events
# ----------
# before_job = ["reliforce.utils.before_job"]
# after_job = ["reliforce.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"reliforce.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

