// Copyright (c) 2025, Ramesh N S and contributors
// For license information, please see license.txt

// frappe.ui.form.on("DCR MOM Entry", {
// 	refresh(frm) {

// 	},
// });

//get coordinates and get address
frappe.ui.form.on("DCR MOM Entry", "refresh", function(frm){
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


//filter DCR Visit No based on DCR Visit Date & DCR MOM Date
 frappe.ui.form.on('DCR MOM Entry', 'onload', function(frm){
     frm.set_query('dcr_visit_no', function(){
        return {
            'filters': [
                ["DCR Visit Entry", 'dcr_visit_date', '=', frm.doc.dcr_mom_date],
                ["DCR Visit Entry", 'employee', '=', frm.doc.employee],
                                          ]
        };
    });
});


//validate DCR Date with Visit Date
frappe.ui.form.on('DCR MOM Entry', 'onload', function(frm) {
    if (frm.doc.dcr_visit_date != frm.doc.dcr_mom_date) {
        frappe.throw(__('DCR MOM Entry Cannot be Updated for Previous Date DCR Visit Entry!'));
    }
});


//validate DCR Date with Visit Date
frappe.ui.form.on('DCR MOM Entry', 'validate', function(frm) {
    if (frm.doc.dcr_visit_date != frm.doc.dcr_mom_date) {
        frappe.throw(__('DCR MOM Entry Cannot be Updated for Previous Date DCR VisitEntry!!'));
    }
});


//filter & display only nearby hospitals
frappe.ui.form.on('DCR MOM Entry', 'refresh', function(frm){
    frm.set_query('lead', function(){
        return {
            'filters': [
                ["Lead", 'custom_latitude', '>=',  (frm.doc.latitude-0.001).toFixed(3)],
                ["Lead", 'custom_latitude', '<=',  (frm.doc.latitude+0.001).toFixed(3)],
                ["Lead", 'custom_longitude', '>=', (frm.doc.longitude-0.001).toFixed(3)],
                ["Lead", 'custom_longitude', '<=', (frm.doc.longitude+0.001).toFixed(3)],
                ]
        };
    });
});



//filter & display only nearby customers
frappe.ui.form.on('DCR MOM Entry', 'refresh', function(frm){
    frm.set_query('customer', function(){
        return {
            'filters': [
                ["Customer", 'custom_latitude', '>=',  (frm.doc.latitude-0.001).toFixed(3)],
                ["Customer", 'custom_latitude', '<=',  (frm.doc.latitude+0.001).toFixed(3)],
                ["Customer", 'custom_longitude', '>=', (frm.doc.longitude-0.001).toFixed(3)],
                ["Customer", 'custom_longitude', '<=', (frm.doc.longitude+0.001).toFixed(3)],
                ]
        };
    });
});

//filter Lead Contact
 frappe.ui.form.on('DCR MOM Entry', 'refresh', function(frm){
       if(frm.doc.lead) {
       frm.set_query('contact_name', function(){
            return {
                    "filters": {link_doctype: "Lead", link_name: frm.doc.lead}
                  };        
    });
}});


//filter Customer Contact
 frappe.ui.form.on('DCR MOM Entry', 'refresh', function(frm){
       if(frm.doc.customer) {
       frm.set_query('contact_name', function(){
            return {
                    "filters": {link_doctype: "Customer", link_name: frm.doc.customer}
                  };        
    });
}});


//filter item code
 frappe.ui.form.on('DCR MOM Entry', 'refresh', function(frm){
        frm.set_query('products', function(){
        return {
            'filters': [
                ["Item", 'is_sales_item', '=', 1],
                                          ]
        };
    });
});


//Filter items for OT Samples
frappe.ui.form.on("DCR MOM Entry", "refresh", function(frm) {
         frm.fields_dict['product_sample_details'].grid.get_field('item_code').get_query = function(doc, cdt, cdn) {
        var d = locals[cdt][cdn];
            return {    
            filters:[
                ['Item', 'is_sales_item', '=', 1]
                            ]
        };
    };
});


//Filter Batch No. against FG item code in Product Samples
frappe.ui.form.on("DCR MOM Entry", {
	refresh: function(frm) {
		frm.set_query("batch_no", "product_sample_details", function(doc, cdt, cdn) {
			var d = locals[cdt][cdn];
			return {
				filters: {
					'item': d.item_code
				}
			};
		});
}});


//Filter items for POB Order
frappe.ui.form.on("DCR MOM Entry", "refresh", function(frm) {
         frm.fields_dict['pob_order_details'].grid.get_field('item_code').get_query = function(doc, cdt, cdn) {
        var d = locals[cdt][cdn];
            return {    
            filters:[
                ['Item', 'is_sales_item', '=', 1]
                            ]
        };
    };
});


//set Product Sampling & POB check boxes
frappe.ui.form.on('DCR MOM Entry', 'visit_purpose', function(frm) {
    if(frm.doc.visit_purpose=='Product Sample') {
        frm.set_value('product_sample',1);
        frm.set_value('pob_order',0);
    }
    if(frm.doc.visit_purpose=='POB') {
        frm.set_value('pob_order',1);
        frm.set_value('product_sample',0);
    }
    if(frm.doc.visit_purpose!='Product Sample') {
        frm.set_value('product_sample',0);
    }
    if(frm.doc.visit_purpose!='POB') {
        frm.set_value('pob_order',0);
}});


//validate next visit date
frappe.ui.form.on("DCR MOM Entry", {
    validate: function(frm) {
        if (frm.doc.next_visit_date < frappe.datetime.nowdate()) {
            frappe.throw(__("Next Visit Date cannot be past date!"));
        }
    },
});


//get current session user
frappe.ui.form.on('DCR MOM Entry', 'refresh',function(frm) {
frm.set_value('session_user', frappe.user.name);
});

//validate session user to submit Visit Details
frappe.ui.form.on('DCR MOM Entry', 'validate',function(frm) {
   if(frm.doc.session_user != frm.doc.employee_user) {frappe.throw(__('Cannot Create DCR MOM Entry for Other Employee!'));}
   });
   
 //set value for Remarks
frappe.ui.form.on('DCR MOM Entry','contact_name',function(frm) {
    if(frm.doc.contact_availability_status=='Available')
        frm.set_value('remarks', frm.doc.sales_person+' met '+frm.doc.contact_name+' - '+frm.doc.contact_designation+ ' at '+frm.doc.lead_customer+ ', ' + frm.doc.territory+' for '+frm.doc.visit_purpose+' on '+ frappe.datetime.now_datetime());
    else if(frm.doc.contact_availability_status=='Not Available')
        frm.set_value('remarks', 'Contact Not Available..!');
});

 //set value for Remarks
frappe.ui.form.on('DCR MOM Entry','contact_availability_status',function(frm) {
    if(frm.doc.contact_availability_status=='Available')
        frm.set_value('remarks', frm.doc.sales_person+' met '+frm.doc.contact_name+' - '+frm.doc.contact_designation+ ' at '+frm.doc.lead_customer+ ', ' + frm.doc.territory+' for '+frm.doc.visit_purpose+' on '+ frappe.datetime.now_datetime());
    else if(frm.doc.contact_availability_status=='Not Available')
        frm.set_value('remarks', 'Contact Not Available..!');
});

//=================================================================================================================================

//MAPTILER MAP

//display maptiler map
frappe.ui.form.on('DCR MOM Entry', 'refresh',function(frm) {
    
    maptilersdk.config.apiKey = 'ways1dgfQeHmfUEj4tMj';
    
    var lat = frm.doc.latitude;
    var lng = frm.doc.longitude;
    
    const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element in which the SDK will render the map
        style: maptilersdk.MapStyle.STREETS,
        center: [lng, lat], // starting position [lng, lat]
        zoom: 11 // starting zoom
    
    });
    
    const marker = new maptilersdk.Marker()
        .setLngLat([lng, lat])
        .addTo(map);    
    
});
