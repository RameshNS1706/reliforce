
//get latitude, longitude and accuracy on click of load map button
frappe.ui.form.on("Customer", "custom_get_coordinates", function(frm){
        navigator.geolocation.getCurrentPosition(function(position){
        frm.set_value('custom_latitude',position.coords.latitude);
        frm.set_value('custom_longitude',position.coords.longitude);
        frm.set_value('custom_accuracy',position.coords.accuracy);
        });
    

 //global variables of lat and lon
var myLat = frm.doc.custom_latitude;
var myLng = frm.doc.custom_longitude;

//Get Address details
        frappe.call({
	    type: "GET",
        url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat='+frm.doc.custom_latitude+'&lon='+frm.doc.custom_longitude+'&accept-language=en', //dotted path to server method
        callback: function(r) {
        console.log(r);
        //set value for Address field
            frm.set_value('custom_address',r.display_name);
                }});
});


//validate accuracy
frappe.ui.form.on("Customer", "validate", function(frm){
        if(frm.doc.custom_latitude > 0 && frm.doc.custom_accuracy > 1000) {
                frappe.throw(__('Please click on Get Coordinates till you get Accuracy less than 100'));
        }
    
});


//enable get coordinates if dcr_count=0
frappe.ui.form.on('Customer', 'before_save',function(frm){
    if(frm.doc.custom_dcr_count=='0') 
          frm.set_value('custom_enable_coordinates',1);
     });
     

//enable get coordinates if latitude=0
frappe.ui.form.on('Customer', 'refresh',function(frm){
    if(frm.doc.custom_latitude===0) 
          frm.set_value('custom_enable_coordinates',1);
     });
     
//enable get coordinates if latitude=0
frappe.ui.form.on('Customer', 'onload',function(frm){
    if(frm.doc.custom_latitude===0) 
          frm.set_value('custom_enable_coordinates',1);
     });
     

//Enable-Disable get-coordinates button
frappe.ui.form.on('Customer', 'refresh',function(frm){
    if(frm.doc.custom_enable_coordinates=='0') {
          frm.set_df_property('custom_get_coordinates','hidden', true);}
     });


//Enable-Disable get-coordinates button
frappe.ui.form.on('Lead', 'Customer',function(frm){
        if(frm.doc.custom_enable_coordinates===0) {
          frm.set_df_property('custom_get_coordinates','hidden', true);}
     });



//check for duplicate customer
frappe.ui.form.on('Customer', 'territory', function(frm) {
    frappe.db.get_value('Customer',{'customer_name': frm.doc.customer_name,'territory':frm.doc.territory}, 'customer_name')
    .then(r => {
        frm.set_value('custom_dupchk',(r.message.customer_name.trim().toLowerCase().replace(/[^a-zA-Z ]/g, "").replaceAll(' ',''))+frm.doc.territory.toLowerCase().replace(/[^a-zA-Z ]/g, "").replaceAll(' ','')); // Open
    });
});

//check for duplicate customer
frappe.ui.form.on('Customer', 'customer_name', function(frm) {
    frappe.db.get_value('Customer',{'customer_name': frm.doc.customer_name,'territory':frm.doc.territory}, 'customer_name')
    .then(r => {
        frm.set_value('custom_dupchk',(r.message.customer_name.trim().toLowerCase().replace(/[^a-zA-Z ]/g, "").replaceAll(' ',''))+frm.doc.territory.toLowerCase().replace(/[^a-zA-Z ]/g, "").replaceAll(' ','')); // Open
    });
});


//=============================================================================================================================

//MAPTILER

frappe.ui.form.on('Customer', 'refresh',function(frm) {
    
    maptilersdk.config.apiKey = 'ways1dgfQeHmfUEj4tMj';
    
    var lat = frm.doc.custom_latitude;
    var lng = frm.doc.custom_longitude;
    
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
