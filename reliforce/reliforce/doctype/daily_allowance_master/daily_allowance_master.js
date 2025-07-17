// Copyright (c) 2025, Ramesh N S and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Daily Allowance Master", {
// 	refresh(frm) {

// 	},
// });

//bring parent table employee data to child table
frappe.ui.form.on("Daily Allowance Detail", {
    allowance_type: function(frm, cdt, cdn) {
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
    count += item.allowance_type === d.allowance_type ? 1 : 0;    
    if( d.idx + count > d.idx + 1 ){
    frappe.throw("Duplicate Allowance Type in Row! - "+ d.idx);
        }});
    });
});


//get daily allowance details from designation
frappe.ui.form.on("Daily Allowance Master", {
    "designation": function(frm) {
      frappe.model.with_doc("Designation", frm.doc.designation, function() {
            var tabletransfer= frappe.model.get_doc("Designation", frm.doc.designation);
            cur_frm.clear_table("allowance_detail");
            $.each(tabletransfer.custom_allowance_detail, function(index, row){
				//if(row.freequency=='Daily') 
                var d = frm.add_child("allowance_detail");
                d.allowance_type = row.allowance_type;
                d.allowance_amount = row.allowance_amount;
				d.freequency = row.freequency
				d.eligibility_type = row.eligibility_type
				d.employee = frm.doc.employee
                frm.refresh_field("allowance_detail");
                          });
        });
    }
});
