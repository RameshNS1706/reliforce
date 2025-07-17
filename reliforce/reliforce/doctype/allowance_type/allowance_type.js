// Copyright (c) 2025, Ramesh N S and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Allowance Type", {
// 	refresh(frm) {

// 	},
// });

//set description same as allowance type
frappe.ui.form.on("Allowance Type", 'allowance_type', function(frm) {
    frm.set_value('allowance_description',frm.doc.allowance_type);
});