# Copyright (c) 2025, Ramesh N S and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class DCRMOMEntry(Document):
	#pass

    def before_save(self):
        #get server date and time for DCR
        self.dcr_mom_date = frappe.utils.today()
        self.dcr_mom_date_time = frappe.utils.now()

        if frappe.db.get_value('DCR MOM Entry', [['employee', '=', self.employee], ['dcr_mom_date', '=', self.dcr_mom_date], ['name', '!=', self.name], ['docstatus', '=', 0]], ['docstatus']) == 0: frappe.throw('Please Submit Previous DCR MOM Entry!')