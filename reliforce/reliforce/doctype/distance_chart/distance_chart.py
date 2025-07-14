# Copyright (c) 2025, Ramesh N S and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class DistanceChart(Document):
	#pass

	def before_save(self):
		map_distance1 = frappe.db.get_value('Distance Chart', {'from_territory': self.from_territory, 'to_territory': self.to_territory}, ['map_distance_in_kms'])
		if map_distance1 is not None and map_distance1 > 0: frappe.throw('Distance Chart is already available.!<br><br>'+'Between '+self.from_territory+' - '+self.to_territory)
		map_distance2 = frappe.db.get_value('Distance Chart', {'from_territory': self.to_territory, 'to_territory': self.from_territory}, ['map_distance_in_kms'])
		if map_distance2 is not None and map_distance2 > 0: frappe.throw('Distance Chart is already available..!<br><br>'+'Between '+self.to_territory+' - '+self.from_territory)


