# Copyright (c) 2025, Ramesh N S and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class DCRVisitEntry(Document):
	#pass
	
	def before_save(self):
		#get server date and time for DCR
		self.dcr_visit_date = frappe.utils.today()
		self.dcr_visit_date_time = frappe.utils.now()

		#Validation Messages
		if frappe.db.get_value('Attendance', {'employee': self.employee, 'attendance_date': self.dcr_visit_date, 'docstatus': 1}, ['custom_territory']) is None: frappe.throw('Please Update/Submit your Attendance!')
		if frappe.db.get_value('Territory Coverage Detail', {'employee': self.employee, 'territory': self.territory}, ['territory_type']) is None: frappe.throw('Territory Coverage Not Set!')
		if frappe.db.get_value('Daily Allowance Detail', {'employee': self.employee}, ['allowance_amount']) is None: frappe.throw('Daily Allowance Not Set!')
		if frappe.db.get_value('DCR Visit Entry', [['employee', '=', self.employee], ['dcr_visit_date', '=', self.dcr_visit_date], ['name', '!=', self.name], ['docstatus', '=', 0]], ['docstatus']) == 0: frappe.throw('Please Submit Previous DCR Visit Entry!')

		#Get Allowance Type and Allowance Amount
		self.territory_type = frappe.db.get_value('Territory Coverage Detail', {'employee': self.employee, 'territory': self.territory}, ['territory_type'])
		if self.visit_type == 'In-Transit': self.daily_allowance_amount = 0
		if self.visit_type in ['Lead Visit','Customer Visit','Meeting/Training']: self.daily_allowance_amount = frappe.db.get_value('Daily Allowance Detail', {'employee': self.employee, 'territory_type': self.territory_type}, ['allowance_amount'])
		if self.edit_travel_allowance_amount == 1: 
			attach_cnt1 = frappe.db.sql("""select count(name) attach_cnt1 from tabFile where attached_to_doctype='DCR Visit Entry' and attached_to_name = %s""",(self.name))
			self.attach_count = attach_cnt1[0][0]

		if self.expense_claim == 1: 
			attach_cnt2 = frappe.db.sql("""select count(name) attach_cnt2 from tabFile where attached_to_doctype='DCR Visit Entry' and attached_to_name = %s""",(self.name))
			self.attach_count = attach_cnt2[0][0]

		#Set From city from Previous DCR or from Attendance.
		fcity = frappe.db.sql("""select distinct territory from `tabDCR Visit Entry` where docstatus=1 and employee= %s and dcr_visit_date= %s and creation = (select max(creation) from `tabDCR Visit Entry` where docstatus=1 and employee= %s and dcr_visit_date= %s) union all select distinct custom_territory as territory from tabAttendance where docstatus=1 and employee= %s and attendance_date = %s and employee not in (select distinct employee from `tabDCR Visit Entry` where docstatus=1 and employee= %s and dcr_visit_date = %s)""",(self.employee, self.dcr_visit_date, self.employee, self.dcr_visit_date, self.employee, self.dcr_visit_date, self.employee, self.dcr_visit_date), as_dict=1)
		for d in fcity:
			self.from_city = d.territory
			#frappe.msgprint(d.territory)
					
		#Set From city latitude and longitude from Previous DCR or from Attendance.
		fcity_latitude = frappe.db.sql("""select distinct latitude from `tabDCR Visit Entry` where docstatus=1 and employee= %s and dcr_visit_date= %s and creation = (select max(creation) from `tabDCR Visit Entry` where docstatus=1 and employee= %s and dcr_visit_date= %s) union all select distinct custom_latitude latitude from tabAttendance where docstatus=1 and employee= %s and attendance_date = %s and employee not in (select distinct employee from `tabDCR Visit Entry` where docstatus=1 and employee= %s and dcr_visit_date = %s)""",(self.employee, self.dcr_visit_date, self.employee, self.dcr_visit_date, self.employee, self.dcr_visit_date, self.employee, self.dcr_visit_date))
		self.from_city_latitude = fcity_latitude[0][0]
				
		#Set From city latitude and longitude from Previous DCR or from Attendance.
		fcity_longitude = frappe.db.sql("""select distinct longitude from `tabDCR Visit Entry` where docstatus=1 and employee= %s and dcr_visit_date= %s and creation = (select max(creation) from `tabDCR Visit Entry` where docstatus=1 and employee= %s and dcr_visit_date= %s) union all select distinct custom_longitude longitude from tabAttendance where docstatus=1 and employee= %s and attendance_date = %s and employee not in (select distinct employee from `tabDCR Visit Entry` where docstatus=1 and employee= %s and dcr_visit_date = %s)""",(self.employee, self.dcr_visit_date, self.employee, self.dcr_visit_date, self.employee, self.dcr_visit_date, self.employee, self.dcr_visit_date))
		self.from_city_longitude = fcity_longitude[0][0]
		
		#Get Distance, Rate & Travel Amount
		if self.from_city != self.to_city:
			distance = frappe.db.sql(""" select ifnull(sum(distance_in_kms),0) distance_in_kms from `tabDistance Chart` where from_territory = %s and to_territory = %s or to_territory= %s and from_territory= %s""",(self.from_city, self.to_city, self.from_city, self.to_city))
			if distance:
				self.distance_in_kms = distance[0][0]

		if self.from_city != self.to_city and self.edit_travel_allowance_amount==0: 
			rate_per_kms = frappe.db.sql("""select ifnull(sum(rate_per_kms),0) rate_per_kms from `tabDaily Allowance Master` where employee = %s and designation = %s""", (self.employee, self.designation))   
			if rate_per_kms:
				self.rate_per_kms = rate_per_kms[0][0]

		if self.from_city != self.to_city and self.edit_travel_allowance_amount==0:  
			travel_amount = frappe.db.sql("""select round(ifnull(sum(distance_in_kms * %s),0),2) travel_amount from `tabDistance Chart` where (from_territory = %s and to_territory = %s) or (to_territory= %s and from_territory= %s)""",(self.rate_per_kms, self.from_city, self.to_city, self.from_city, self.to_city))
			if travel_amount:
				self.travel_allowance_amount = travel_amount[0][0]
    
		self.total_amount = (self.daily_allowance_amount if self.daily_allowance_amount is not None else 0 + self.travel_allowance_amount if self.travel_allowance_amount is not None else 0 + self.other_expense_amount if self.other_expense_amount is not None else 0)
		self.da_amount = self.daily_allowance_amount
		self.ta_amount = self.travel_allowance_amount

		#Lock enable get coordinates after creating dcr
		if self.lead is not None: frappe.db.set_value('Lead', {'name': self.lead, 'custom_enable_coordinates': 1}, 'custom_enable_coordinates', 0)
		if self.customer is not None: frappe.db.set_value('Customer', {'name': self.customer, 'custom_enable_coordinates': 1}, 'custom_enable_coordinates', 0)


