// Copyright (c) 2025, Ramesh N S and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Journey Planner", {
// 	refresh(frm) {

// 	},
// });

//set starts_on and ends_on dates as per start and end fields
frappe.ui.form.on("Journey Planner", 'refresh', function(frm) {
    frm.set_value('starts_on',frm.doc.start);
    frm.set_value('ends_on',frm.doc.end);
    frm.set_value('journey_planner_date',frm.doc.start);
});

//set Subject field same as territory
frappe.ui.form.on("Journey Planner", 'territory', function(frm) {
    frm.set_value('subject',frm.doc.territory);
});


//validate back dated entries
frappe.ui.form.on("Journey Planner", {
    validate: function(frm) {
        if (frm.doc.journey_planner_date < frappe.datetime.get_today()) {
            frappe.throw(__("Please select Journey Planner Date from the present or future"));
        }
    },
});

//validate back dated entries
frappe.ui.form.on("Journey Planner", {
    onload: function(frm) {
        if (frm.doc.journey_planner_date < frappe.datetime.get_today()) {
            frappe.throw(__("Please select Journey Planner Date from the present or future"));
        }
    },
});



//validate back dated entries
frappe.ui.form.on("Journey Planner", {
    validate: function(frm) {
        if (frm.doc.start < frappe.datetime.get_datetime_as_string()) {
            frappe.throw(__("Please select Start Date Time  from the present or future"));
        }
    },
});

//validate back dated entries
frappe.ui.form.on("Journey Planner", {
    onload: function(frm) {
        if (frm.doc.start < frappe.datetime.get_datetime_as_string()) {
            frappe.throw(__("Please select Start Date Time  from the present or future"));
        }
    },
});


//validate back dated entries
frappe.ui.form.on("Journey Planner", {
    validate: function(frm) {
        if (frm.doc.starts_on < frappe.datetime.get_datetime_as_string()) {
            frappe.throw(__("Please select Starts On from the present or future"));
        }
    },
});


//validate back dated entries
frappe.ui.form.on("Journey Planner", {
    onload: function(frm) {
        if (frm.doc.starts_on < frappe.datetime.get_datetime_as_string()) {
            frappe.throw(__("Please select Starts On from the present or future"));
        }
    },
});

//validate back dated entries
frappe.ui.form.on("Journey Planner", {
    validate: function(frm) {
        if (frm.doc.end < frappe.datetime.get_datetime_as_string()) {
            frappe.throw(__("Please select End Date Time from the present or future."));
        }
    },
});


//validate back dated entries
frappe.ui.form.on("Journey Planner", {
    onload: function(frm) {
        if (frm.doc.end < frappe.datetime.get_datetime_as_string()) {
            frappe.throw(__("Please select End Date Time from the present or future."));
        }
    },
});


//validate back dated entries
frappe.ui.form.on("Journey Planner", {
    validate: function(frm) {
        if (frm.doc.ends_on < frappe.datetime.get_datetime_as_string()) {
            frappe.throw(__("Please select Ends On from the present or future."));
        }
    },
});


//validate back dated entries
frappe.ui.form.on("Journey Planner", {
    onload: function(frm) {
        if (frm.doc.ends_on < frappe.datetime.get_datetime_as_string()) {
            frappe.throw(__("Please select Ends On from the present or future."));
        }
    },
});


//validate start and end
frappe.ui.form.on("Journey Planner", {
    validate: function(frm) {
        if (frm.doc.end < frm.doc.start) {
            frappe.throw(__("End Date Time cannot be before Start Date Time!"));
        }
    },
});


//validate start and end
frappe.ui.form.on("Journey Planner", {
    onload: function(frm) {
        if (frm.doc.end < frm.doc.start) {
            frappe.throw(__("End Date Time cannot be before Start Date Time!"));
        }
    },
});


//get current session user
frappe.ui.form.on('Journey Planner', 'onload',function(frm) {
    frm.set_value('session_user', frappe.user.name);
});


//validate session user vs employee user
frappe.ui.form.on('Journey Planner', 'validate',function(frm) {
   if(frm.doc.session_user != frm.doc.employee_user) {frappe.throw(__('Cannot alter Journey Planner belongs to Other Employee!'));}
   });

