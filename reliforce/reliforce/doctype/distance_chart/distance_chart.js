// Copyright (c) 2025, Ramesh N S and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Distance Chart", {
// 	refresh(frm) {

// 	},
// });

//Display Map & Directions
frappe.ui.form.on('Distance Chart', 'refresh', function(frm) {
    
    var flat = frm.doc.from_territory_latitude;
    var flng = frm.doc.from_territory_longitude;
    var tlat = frm.doc.to_territory_latitude;
    var tlng = frm.doc.to_territory_longitude;
    
    var map = L.map('map').setView([flat, flng],4);
    
	/*
    var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&acceptlanguage=english',{
    subdomains:['mt0','mt1','mt2','mt3']
    });
    googleStreets.addTo(map);
    */
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       // attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
	/*
    var taxiIcon = L.icon({
	iconUrl: '/files/taxi.png',
	iconSize: [50,50]
    });
    */
    var firstMarker = L.marker([flat, flng], /*{icon: taxiIcon}*/).addTo(map);
    
    var secondtMarker = L.marker([tlat, tlng]).addTo(map);
    
    //map.on('click', function(e) {
    //	console.log(e);
    //var secondMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    
   var routeControl = L.Routing.control({
    waypoints: [
        L.latLng(flat, flng),
        L.latLng(tlat, tlng)],
    //routeWhileDragging: true,
	//geocoder: L.Control.Geocoder.nominatim(),
	//lineOptions: {styles: [{color: 'red', opacity: 1, weight: 5}]},
	//language: 'en'
}).on('routesfound', function(e){
			//console.log(e);
			e.routes[0].coordinates.forEach(function (coord, index) {
			setTimeout(() => {
				firstMarker.setLatLng([coord.lat, coord.lng]);
				}, 10 * index);
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
