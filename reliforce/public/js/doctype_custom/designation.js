//set description same as designation
frappe.ui.form.on("Designation", 'designation_name', function(frm) {
    frm.set_value('description',frm.doc.designation_name);
});
