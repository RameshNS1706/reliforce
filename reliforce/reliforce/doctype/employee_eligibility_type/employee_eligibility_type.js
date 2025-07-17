// Copyright (c) 2025, Ramesh N S and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Employee Eligibility Type", {
// 	refresh(frm) {

// 	},
// });

//set description same as eligibility type
frappe.ui.form.on("Employee Eligibility Type", 'eligibility_type', function(frm) {
    frm.set_value('eligibility_description',frm.doc.eligibility_type);
});