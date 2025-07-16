// Copyright (c) 2025, Ramesh N S and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Territory Coverage Master", {
// 	refresh(frm) {

// 	},
// });

//get parent table employee data to child table
frappe.ui.form.on("Territory Coverage Detail", {
    territory: function(frm, cdt, cdn) {
         var d = locals[cdt][cdn];
         frappe.model.set_value(cdt, cdn,"employee",frm.doc.employee);}
       });
       
//validate employee details in parent & chiild table
frappe.ui.form.on("Territory Coverage Master", "validate", function(frm, cdt, cdn) { 
	$.each(frm.doc.territory_detail, function(i, d) {
		if(d.employee != frm.doc.employee) {
			frappe.throw("Employee in Territory Details Table not matching with Sales Person.!");
		}
	});
});

//validate duplicates in child table before save
frappe.ui.form.on("Territory Coverage Master", "validate", function(frm, cdt, cdn) {
    var d = locals[cdt][cdn];
    $.each(frm.doc.territory_detail || [], function(i, d) {
    var count = 0;
    cur_frm.doc.territory_detail.forEach(function(item){
    count += item.territory === d.territory ? 1 : 0;    
    if( d.idx + count > d.idx + 1 ){
    frappe.throw("Duplicate Territory in Row! - "+ d.idx);
        }});
    });
});