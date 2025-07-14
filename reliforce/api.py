import frappe

@frappe.whitelist()

#Get & update DCR Count for the Lead
def lead_update_dcr_count(doc, method):
	doc.custom_dcr_count = frappe.db.get_value('DCR Visit Entry',{'lead': doc.name, 'docstatus': 1},'count(lead) as lead')

#Get & update DCR Count for the Customer
def customer_update_dcr_count(doc, method):
	doc.custom_dcr_count = frappe.db.get_value('DCR Visit Entry',{'customer': doc.name, 'docstatus': 1},'count(customer) as customer')

#Set Territory Type in Attendance
def attendance_set_territory_type(doc, method):
	doc.custom_territory_type = frappe.db.get_value('Territory Coverage Detail', {'employee': doc.employee, 'territory': doc.custom_territory}, 'territory_type')
	
#Update Territory Address
def territory_update_territory_address(doc, method):
	if doc.custom_territory_address is None: frappe.db.set_value('Territory',{'name': doc.name},'custom_territory_address',doc.name)

