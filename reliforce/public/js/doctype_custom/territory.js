//validate latitude and longitude on loading form
frappe.ui.form.on('Territory', 'onload',function(frm) {
    frappe.db.get_value("Territory", {'name': frm.doc.name}, 'custom_address', (message) => {
    if(frm.doc.custom_address !== message.custom_address)
    frappe.msgprint(msg='Please resave the Territory..!', title='Message');});
});

//get coordinates for the place name
frappe.ui.form.on('Territory', 'refresh',function(frm) {
    if( frm.doc.custom_coordinates_type == 'Automatic Coordinates')    {
     frappe.call({
	    type: "GET",
        url: 'https://nominatim.openstreetmap.org/search?format=json&q='+frm.doc.custom_territory_address+'&accept-language=en', //dotted path to server method
        callback: function(r) {
        console.log(r);
        //set value for latitude and longitude and address fields
                frm.set_value('custom_latitude',  r[0].lat);
                frm.set_value('custom_longitude', r[0].lon);
                //frm.set_value('custom_accuracy'), r[0].accuracy;
                frm.set_value('custom_address', r[0].display_name);
                }});
    }
    });


//get coordinates for the place name on select of coordinates type
frappe.ui.form.on('Territory', 'custom_coordinates_type',function(frm) {
    if( frm.doc.custom_coordinates_type == 'Automatic Coordinates')  {
     frappe.call({
	    type: "GET",
        url: 'https://nominatim.openstreetmap.org/search?format=json&q='+frm.doc.custom_territory_address+'&accept-language=en', //dotted path to server method
        callback: function(r) {
        console.log(r);
        //set value for latitude and longitude fields
        //if( frm.doc.custom_coordinates_type == 'Automatic Coordinates')  
                frm.set_value('custom_latitude',  r[0].lat);
                frm.set_value('custom_longitude', r[0].lon);
                frm.set_value('custom_address', r[0].display_name);
                }});
    }
    });


//get address for the coordinates
frappe.ui.form.on('Territory', 'refresh',function(frm) {
    if( frm.doc.custom_coordinates_type == 'Manual Coordinates')    {
     frappe.call({
	    type: "GET",
        url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat='+frm.doc.custom_latitude+'+&lon='+frm.doc.custom_longitude+'&accept-language=en', //dotted path to server method
        callback: function(r) {
        console.log(r);
        //set value for latitude and longitude fields
                frm.set_value('custom_latitude',r.lat);
                frm.set_value('custom_longitude',r.lon);
                frm.set_value('custom_address',r.display_name);
                    }});
        }
    
    
    });

//get address for the coordinates on select of coordinates type
frappe.ui.form.on('Territory', 'custom_coordinates_type',function(frm) {
    if( frm.doc.custom_coordinates_type == 'Manual Coordinates')    {
     frappe.call({
	    type: "GET",
        url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat='+frm.doc.custom_latitude+'+&lon='+frm.doc.custom_longitude+'&accept-language=en', //dotted path to server method
        callback: function(r) {
        console.log(r);
        //set value for latitude and longitude fields
			frm.set_value('custom_address',r.display_name);
                }});
		}
 });


//get address for the coordinates on change of latitude
frappe.ui.form.on('Territory', 'custom_latitude',function(frm) {
    if( frm.doc.custom_coordinates_type == 'Manual Coordinates')    {
     frappe.call({
	    type: "GET",
        url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat='+frm.doc.custom_latitude+'+&lon='+frm.doc.custom_longitude+'&accept-language=en', //dotted path to server method
        callback: function(r) {
        console.log(r);
        //set value for latitude and longitude fields
                //frm.set_value('custom_latitude',r.lat);
                //frm.set_value('custom_longitude',r.lon);
                frm.set_value('custom_address',r.display_name);
                    }});
        }
    
    
    });

//===================================================================================================================================

//Display Leaflet Map with Features
frappe.ui.form.on('Territory', 'refresh',function(frm) {
    
    var lat = frm.doc.custom_latitude;
    var lng = frm.doc.custom_longitude;
    var territory = frm.doc.name;
    
//map initialisation
    var map = L.map('map').setView([lat, lng], 8);

//osm layer    
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    });
    osm.addTo(map);
    
    var marker = L.marker([lat, lng]).addTo(map);
    
    var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    });
    //Esri_WorldStreetMap.addTo(map);
    
    var geodatenzentrum = L.tileLayer('http://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web/default/WEBMERCATOR/{z}/{y}/{x}.png', {
    });
    //geodatenzentrum.addTo(map);
    
    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&acceptlanguage=english',{
    subdomains:['mt0','mt1','mt2','mt3']
    });
    //googleStreets.addTo(map);
    
    var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    subdomains:['mt0','mt1','mt2','mt3']
    });
    //googleHybrid.addTo(map);
    
    var baseMaps = {
    "OpenStreetMap": osm,
    "Esri_WorldStreetMap": Esri_WorldStreetMap,
    "Geodatenzentrum": geodatenzentrum,
    "Google Streets": googleStreets,
    "Google Hybrid": googleHybrid
};

    var overlayMaps = {
    "Marker": marker
}; 

    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);


frappe.ui.form.on('Territory', 'custom_coordinates_type',function(frm) {    
	if(frm.doc.custom_coordinates_type == 'Manual Coordinates') {
		map.on('click', function(e) {
			var latitude = e.latlng.lat; 
			var longitude = e.latlng.lng;     
			frm.set_value('custom_latitude', latitude);
			frm.set_value('custom_longitude', longitude);
		})}
    });
});

