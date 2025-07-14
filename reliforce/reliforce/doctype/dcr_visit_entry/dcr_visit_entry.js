// Copyright (c) 2025, Ramesh N S and contributors
// For license information, please see license.txt

// frappe.ui.form.on("DCR Visit Entry", {
// 	refresh(frm) {

// 	},
// });

//get Coordinates & get address
frappe.ui.form.on("DCR Visit Entry", "refresh", function(frm){
        if(frm.doc.docstatus===0) {
        navigator.geolocation.getCurrentPosition(function(position){
        frm.set_value('latitude',position.coords.latitude);
        frm.set_value('longitude',position.coords.longitude);
        frm.set_value('accuracy',position.coords.accuracy);
        
 //global variables of lat and lon
var myLat = frm.doc.latitude;
var myLng = frm.doc.longitude;

//Get Address details
        frappe.call({
	    type: "GET",
        url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat='+frm.doc.latitude+'&lon='+frm.doc.longitude+'&accept-language=en', //dotted path to server method
        callback: function(r) {
        console.log(r);
        //set value for Address field
                frm.set_value('address',r.display_name);
                        }});
                        
    });}

});


//filter & display only nearby Lead - Geofencing
frappe.ui.form.on('DCR Visit Entry', 'refresh', function(frm){
     //if(frm.doc.latitude) {
	 if(frm.doc.session_user!='Administrator') 
    frm.set_query('lead', function(){
        return {
            'filters': [
                ["Lead", 'custom_latitude', '>=',  (frm.doc.latitude-0.001).toFixed(3)],
                ["Lead", 'custom_latitude', '<=',  (frm.doc.latitude+0.001).toFixed(3)],
                ["Lead", 'custom_longitude', '>=', (frm.doc.longitude-0.001).toFixed(3)],
                ["Lead", 'custom_longitude', '<=', (frm.doc.longitude+0.001).toFixed(3)],
                ["Lead", 'disabled', '=', 0],
                      ]
        };
	 });
	
});


//filter & display only nearby customers - Geofencing
frappe.ui.form.on('DCR Visit Entry', 'refresh', function(frm){
     //if(frm.doc.latitude) 
	 if(frm.doc.session_user!='Administrator') 
    frm.set_query('customer', function(){
        return {
            'filters': [
                ["Customer", 'custom_latitude', '>=',  (frm.doc.latitude-0.001).toFixed(3)],
                ["Customer", 'custom_latitude', '<=',  (frm.doc.latitude+0.001).toFixed(3)],
                ["Customer", 'custom_longitude', '>=', (frm.doc.longitude-0.001).toFixed(3)],
                ["Customer", 'custom_longitude', '<=', (frm.doc.longitude+0.001).toFixed(3)],
                ["Customer", 'disabled', '=', 0],
                      ]
        };
    });
});


//auto focus field on Lead Field
frappe.ui.form.on('DCR Visit Entry', 'latitude', function(frm) {
		if(frm.doc.latitude && frm.doc.visit_type=='Lead Visit') {
			$("[data-fieldname=lead]").focus();
			}
	});

//auto focus field on Customer Field
frappe.ui.form.on('DCR Visit Entry', 'visit_type', function(frm) {
		if(frm.doc.latitude && frm.doc.visit_type=='Customer Visit') {
			$("[data-fieldname=customer]").focus();
			}
	});

//auto focus field on Territory Field
frappe.ui.form.on('DCR Visit Entry', 'visit_type', function(frm) {
		if(frm.doc.latitude && (frm.doc.visit_type =='In-Transit'||frm.doc.visit_type=='Meeting/Training')) {
			$("[data-fieldname=territory]").focus();
			}
	});
	

//set hospital & customer null based on visit type
frappe.ui.form.on('DCR Visit Entry', 'visit_type', function(frm){
       if(frm.doc.visit_type=='Customer Visit') {
       frm.set_value('lead','');
       frm.set_value('lead_name','');
       }
     if(frm.doc.visit_type=='Lead Visit') {
        frm.set_value('customer','');
        frm.set_value('customer_name','');
    }
    if(frm.doc.visit_type=='Meeting/Training'||frm.doc.visit_type=='In-Transit') {
        frm.set_value('lead','');
        frm.set_value('lead_name','');
        frm.set_value('customer','');
        frm.set_value('customer_name','');
        frm.set_value('territory','');
        frm.set_value('to_city','');
        frm.set_value('lead_customer',frm.doc.visit_type);
                     } 
});


//set territory from hospital
frappe.ui.form.on('DCR Visit Entry', 'lead', function(frm){
       frm.set_value('territory',frm.doc.lead_territory);
       frm.set_value('to_city',frm.doc.lead_territory);
       frm.set_value('lead_customer',frm.doc.lead_name);
       cur_frm.refresh_field('customer');
       cur_frm.refresh_field('customer_name');
      } 
);

//set territory from customer
frappe.ui.form.on('DCR Visit Entry', 'customer', function(frm){
       frm.set_value('territory',frm.doc.customer_territory);
       frm.set_value('to_city',frm.doc.customer_territory);
       frm.set_value('lead_customer',frm.doc.customer_name);
       cur_frm.refresh_field('lead');
       cur_frm.refresh_field('lead_name');
      } 
);


//Show Error if Kms in Distance Chart is not set
frappe.ui.form.on('DCR Visit Entry', 'before_submit', function(frm){
 if((frm.doc.from_city != frm.doc.to_city) && frm.doc.distance_in_kms=='0') { 
     frappe.throw(__('Distance Master is Not Set Between: ') +'<br><br>'+ (frm.doc.from_city) + ' - ' + (frm.doc.to_city));
     
     }});

 
//get current session user
frappe.ui.form.on('DCR Visit Entry', 'onload',function(frm) {
    frm.set_value('session_user', frappe.user.name);
});

//validate session user to submit DCR
frappe.ui.form.on('DCR Visit Entry', 'validate',function(frm) {
   if(frm.doc.session_user != frm.doc.employee_user && frm.doc.session_user!='Administrator') {frappe.throw(__('Cannot Create DCR for Other Employee!'));}
   });


//validate DCR Date with Journey Planner Date
frappe.ui.form.on('DCR Visit Entry', 'onload', function(frm) {
    if (frm.doc.journey_planner_date) { 
        if (frm.doc.dcr_visit_date != frm.doc.journey_planner_date) {
        frappe.throw(__('DCR Entry Cannot be made for Past/Future Date Journey Planner!'));
    }
}});


//validate DCR Date with Journey Planner Date
frappe.ui.form.on('DCR Visit Entry', 'validate', function(frm) {
    if (frm.doc.journey_planner_date) { 
        if (frm.doc.dcr_visit_date != frm.doc.journey_planner_date) {
        frappe.throw(__('DCR Entry Cannot be made for Past/Future Date Journey Planner!'));
    }
}});



//prompt for attaching tickets for editing travel amount
frappe.ui.form.on("DCR Visit Entry", "edit_travel_allowance_amount", function(frm) {
    if(frm.doc.edit_travel_allowance_amount == 1 ) { 
    frappe.confirm('Edit Travel Amount & Attach Travel Tickets/Bills.?',
    () => {
        //frm.set_value('edit_travel_allowance_amount',1);
        //frm.set_value('travel_allowance_amount','');
        frm.set_df_property('travel_allowance_amount','read_only', false);}, 
    () => {  
        frm.set_value('edit_travel_allowance_amount',0);
        frm.set_df_property('travel_allowance_amount','read_only', true);}
                                    );
    }
});


//prompt for attaching tickets to claim other expenses
frappe.ui.form.on("DCR Visit Entry", "expense_claim", function(frm) {
    if(frm.doc.expense_claim == 1 ) { 
    frappe.confirm('Claim Other Expenses & Attach Relevant Bills.?',
    () => {
            frm.set_df_property('dcr_expense_claim_details','read_only', false);}, 
    () => {  
        frm.set_value('expense_claim',0);
        frm.set_df_property('dcr_expense_claim_details','read_only', true);}
                                    );
    }
});

//set rate per kms
frappe.ui.form.on("DCR Visit Entry", "travel_allowance_amount", function(frm) {
    frm.set_value('rate_per_kms',(frm.doc.travel_allowance_amount/frm.doc.distance_in_kms).toFixed(2));
});


//validate for attachment
frappe.ui.form.on("DCR Visit Entry", "after_save", function(frm) {
    if(frm.doc.edit_travel_allowance_amount==1 && frm.doc.attach_count === 0) {
    frappe.throw(__('Please Attach Relevant Tickets for Travel Amount!'));}
});

//validate for attachment
frappe.ui.form.on("DCR Visit Entry", "before_submit", function(frm) {
    if(frm.doc.edit_travel_allowance_amount==1 && frm.doc.attach_count === 0) {
    frappe.throw(__('Please Attach Relevant Tickets for Travel Amount!!'));}
});


//validate for attachment
frappe.ui.form.on("DCR Visit Entry", "after_save", function(frm) {
    if(frm.doc.expense_claim==1 && frm.doc.attach_count === 0) {
    frappe.throw(__('Please Attach Relevant Tickets for Expense Claim!'));}
});

//validate for attachment
frappe.ui.form.on("DCR Visit Entry", "before_submit", function(frm) {
    if(frm.doc.expense_claim==1 && frm.doc.attach_count === 0) {
    frappe.throw(__('Please Attach Relevant Tickets for Expense Claim!!'));}
});

//validate travel amount
frappe.ui.form.on("DCR Visit Entry", "validate", function(frm) {
    if(frm.doc.travel_allowance_amount>=5000) {
    frappe.throw(__('Please Check Travel Amount!'));}
}); 


//get expense claim total from child table
frappe.ui.form.on('Expense Detail',{
    expense_claim_type: function(frm, cdt, cdn){
    var d = locals[cdt][cdn];
    var total = 0;
    frm.doc.expense_claim_detail.forEach(function (d) { 
        total += d.amount; 
        });
        cur_frm.set_value('other_expense_amount', total);
        cur_frm.set_value('expense_claim_total', total);
        refresh_field('other_expense_amount');
        refresh_field('expense_claim_total');
},
  amount: function(frm, cdt, cdn){
    var d = locals[cdt][cdn];
    var total = 0;
    frm.doc.expense_claim_detail.forEach(function (d) { 
        total += d.amount; 
        });
        cur_frm.set_value('other_expense_amount', total);
        cur_frm.set_value('expense_claim_total', total);
        refresh_field('other_expense_amount');
        refresh_field('expense_claim_total');
},
expense_claim_detail_add: function(frm, cdt, cdn){
    var d = locals[cdt][cdn];
    var total = 0;
    frm.doc.expense_claim_detail.forEach(function (d) { 
        total += d.amount; 
        });
        cur_frm.set_value('other_expense_amount', total);
        cur_frm.set_value('expense_claim_total', total);
        refresh_field('other_expense_amount');
        refresh_field('expense_claim_total');
},
expense_claim_detail_remove: function(frm, cdt, cdn){
    var d = locals[cdt][cdn];
    var total = 0;
    frm.doc.expense_claim_detail.forEach(function (d) { 
        total += d.amount; 
        });
        cur_frm.set_value('other_expense_amount', total);
        cur_frm.set_value('expense_claim_total', total);
        refresh_field('other_expense_amount');
        refresh_field('expense_claim_total');
},
});

//set total expense amount
frappe.ui.form.on("DCR Visit Entry", "before_save", function(frm) {
    frm.set_value('total_amount', frm.doc.daily_allowance_amount+frm.doc.travel_allowance_amount+frm.doc.expense_claim_amount)
});


//set value for Remarks
frappe.ui.form.on('DCR Visit Entry','territory',function(frm) {
    frm.set_value('remarks', frm.doc.sales_person+' '+frm.doc.visit_type + ' @ ' +frm.doc.lead_customer+ ', ' + frm.doc.territory+' on '+ frappe.datetime.now_datetime());
});


//bring parent table employee data to child table
frappe.ui.form.on("Expense Detail", {
    expense_claim_type: function(frm, cdt, cdn) {
         var d = locals[cdt][cdn];
         frappe.model.set_value(cdt, cdn,"employee",frm.doc.employee);}
       });
       

//validate employee details in parent & chiild table
frappe.ui.form.on("DCR Visit Entry", "validate", function(frm, cdt, cdn) { 
	$.each(frm.doc.expense_claim_detail, function(i, d) {
		if(d.employee != frm.doc.employee) {
			frappe.throw("Employee in Expense Claim Details Table not matching with Sales Person.!");
		}
	});
});






//=================================================================================================================================

//Display Map & Directions
frappe.ui.form.on('DCR Visit Entry', 'refresh', function(frm) {
    
    var flat = frm.doc.from_city_latitude;
    var flng = frm.doc.from_city_longitude;
    var tlat = frm.doc.latitude;
    var tlng = frm.doc.longitude;
    
    var map = L.map('map').setView([flat, flng],5);
    
	
    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&acceptlanguage=english',{
    subdomains:['mt0','mt1','mt2','mt3']
    });
    googleStreets.addTo(map);
    
    /*
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       // attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    */
	
	/*
    var taxiIcon = L.icon({
	iconUrl: '/files/taxi.png',
	iconSize: [50,50]
    });
    */
    var firstMarker = L.marker([flat, flng]).addTo(map);
    
    var secondtMarker = L.marker([tlat, tlng]).addTo(map);
    
    //map.on('click', function(e) {
    //	console.log(e);
    //var secondMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    
   var routeControl = L.Routing.control({
    waypoints: [
        L.latLng(flat, flng),
        L.latLng(tlat, tlng)],
    routeWhileDragging: true,
	geocoder: L.Control.Geocoder.nominatim(),
	//lineOptions: {styles: [{color: 'red', opacity: 1, weight: 5}]},
	language: 'en'
}).on('routesfound', function(e){
			//console.log(e);
			e.routes[0].coordinates.forEach(function (coord, index) {
			setTimeout(() => {
				firstMarker.setLatLng([coord.lat, coord.lng]);
				}, 50 * index);
			});
		})
.addTo(map);


routeControl.on('routesfound', function(e) {
   var routes = e.routes;
   var summary = routes[0].summary;
   // alert distance and time in km and minutes
   //alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
   frm.set_value('map_distance_in_kms', (summary.totalDistance / 1000).toFixed(1));
});

});