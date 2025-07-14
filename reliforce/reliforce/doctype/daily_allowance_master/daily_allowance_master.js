// Copyright (c) 2025, Ramesh N S and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Daily Allowance Master", {
// 	refresh(frm) {

// 	},
// });

//bring parent table employee data to child table
frappe.ui.form.on("Daily Allowance Detail", {
    territory_type: function(frm, cdt, cdn) {
         var d = locals[cdt][cdn];
         frappe.model.set_value(cdt, cdn,"employee",frm.doc.employee);}
       });
       

//validate employee details in parent & chiild table
frappe.ui.form.on("Daily Allowance Master", "validate", function(frm, cdt, cdn) { 
	$.each(frm.doc.allowance_detail, function(i, d) {
		if(d.employee != frm.doc.employee) {
			frappe.throw("Employee in Allowance Details Table not matching with Sales Person.!");
		}
	});
});


//validate duplicates in child table before save
frappe.ui.form.on("Daily Allowance Master", "validate", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    $.each(frm.doc.allowance_detail || [], function(i, d) {
    var count = 0;
    cur_frm.doc.allowance_detail.forEach(function(item){
    count += item.territory_type === d.territory_type ? 1 : 0;    
    if( d.idx + count > d.idx + 1 ){
    frappe.throw("Duplicate Territory Type in Row! - "+ d.idx);
        }});
    });
});