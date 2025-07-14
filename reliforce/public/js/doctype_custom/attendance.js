//get current latitude, longitude and accuracy
frappe.ui.form.on("Attendance", "refresh", function(frm){
        if(frm.doc.docstatus===0) {
        navigator.geolocation.getCurrentPosition(function(position){
        frm.set_value('custom_latitude',position.coords.latitude);
        frm.set_value('custom_longitude',position.coords.longitude);
        frm.set_value('custom_accuracy',position.coords.accuracy);
        
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
                        
    });}

}); 


//get current session user
frappe.ui.form.on('Attendance', 'onload',function(frm) {
    frm.set_value('custom_session_user', frappe.user.name);
});


//validate session user to submit DCR
frappe.ui.form.on('Attendance', 'validate',function(frm) {
   if(frm.doc.custom_session_user !== frm.doc.custom_employee_user && frm.doc.status=='Present' && frm.doc.custom_session_user!='Administrator') {frappe.throw(__('Cannot Create Attendance for Other Employee!'));}
 });


//filter & display only nearby territory(Geofencing for Territory 20kms range)
frappe.ui.form.on('Attendance', 'refresh', function(frm){
	frm.set_query('custom_territory', function(){
        return {
            'filters': [
                ["Territory", 'custom_latitude', '>=',  (frm.doc.custom_latitude-0.150).toFixed(3)],
                ["Territory", 'custom_latitude', '<=',  (frm.doc.custom_latitude+0.150).toFixed(3)],
                ["Territory", 'custom_longitude', '>=', (frm.doc.custom_longitude-0.150).toFixed(3)],
                ["Territory", 'custom_longitude', '<=', (frm.doc.custom_longitude+0.150).toFixed(3)],
                      ]
        };
    });
});
 
//auto focus field on Territory Field
frappe.ui.form.on('Attendance', 'custom_latitude', function(frm) {
         if(frm.doc.custom_latitude) {
    //setTimeout(() => {
        $("[data-fieldname=custom_territory]").focus();
 //       }, 10);}
    
}});


 
//=================================================================================================================================

//Map Display
frappe.ui.form.on('Attendance', 'refresh', function(frm) {
    
    var lat = frm.doc.custom_latitude;
    var lng = frm.doc.custom_longitude;
        
    var map = L.map('map').setView([lat, lng],10);
    
	
    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&acceptlanguage=english',{
    subdomains:['mt0','mt1','mt2','mt3']
    });
    googleStreets.addTo(map);
    
	var Marker = L.marker([lat, lng]).addTo(map);
      

});
