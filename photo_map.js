let openStreetMap = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
});
let map = L.map('interactive_map', {
    center: [ 24.310226, 121.416203 ],
    zoom: 13,
    layers: openStreetMap
});
map.photos = new L.FeatureGroup();
map.photos.addTo(map);

$('#input-btn').on('click', function (event) {
    console.log('button was clicked');
    // event.stopPropagation();
    // $('#file-loader').click();
});

$('.input-area').on('click', function (event) {
    console.log('area was clicked');
    $('#file-loader').click();
});

$('#file-loader').on('click', function (event) {
    event.stopPropagation();
    console.log('input was triggered');
});

$('#file-loader').on('change', function (event) {
    console.log('files being processed...');
    console.log(event);

    let files = event.currentTarget.files;
    let readers = [];
    console.log(files);

    readFilesAsMarkers(files);

    // // Store promises in array
    // for(let i = 0;i < files.length;i++){
    //     readers.push(readFileAsDataURL(files[i]));
    // }
    // // Trigger Promises
    // Promise.all(readers).then((values) => {
    //     // Values will be an array that contains an item
    //     // with the text of every selected file
    //     // ["File1 Content", "File2 Content" ... "FileN Content"]
    //     console.log(values);
    // });
});

//Simple JavaScript Promise that reads a file as DataURL.
 function readFileAsDataURL(file){
    return new Promise(function(resolve,reject){
        let fr = new FileReader();

        fr.onload = function(){
            console.log('456');
            resolve(fr.result);
        };

        fr.onerror = function(){
            reject(fr);
        };

        fr.readAsDataURL(file);
        // fr.readAsText(file);
        console.log('123');
    });
}

function readFilesAsMarkers(files) {
    let imgUrls = [];
    // Abort if there were no files selected
    if(!files.length) reject();//return;

    for(let i = 0; i < files.length; i++) {
        let url = URL.createObjectURL(files[i]);
        imgUrls.push(url);
        console.log('show you url:' + url);
        // $('#testimage').src = url; // not working
        // document.getElementById("testimage").src = url;
    }
    console.log(imgUrls);

    // $('.dragndrop-box').css('display','none');
    // $('.dragndrop-box .outlayer').css({'height':'120px'});
    // $('#interactive_map').css({"display": "block", "height": "600px"});

    readUrlsAsMarkers(imgUrls);
}

async function readUrlsAsMarkers(urls) {
    for (let i = 0; i < urls.length; i++) {
        await AttachMarker(urls[i]);
    }
    setMapFocus();
}

function setMapFocus() {
    console.log('bounds: ' + map.photos.getBounds());
    map.fitBounds(map.photos.getBounds());
    map.setView(map.photos.getBounds().getCenter());
}

$('#input-form').on('dragover', function (event) {
    handleDragOver(event);
});
$('#input-form').on('drop', function (event) {
    handleDrop(event);
});

function handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    // event.dataTransfer.dropEffect = "copy"; // Display a "copy" cursor
}
function handleDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    var files = event.target.files;
    if (!files || files.length === 0) files = (event.dataTransfer ? event.dataTransfer.files : event.originalEvent.dataTransfer.files);
    console.log(files);

    readFilesAsMarkers(files);

    // var reader = new FileReader();
    // reader.onload = function (e) {
    //     var theImgElem = document.createElement("img");
    //     theImgElem.src = e.target.result;
    //     document.getElementById("div1").appendChild(theImgElem);
    // };
    // reader.onerror = function (e) {
    //     alert("Cannot load text file");
    // };
}

function initMarker(position, title, icon, size)
{
    let icon_option = L.icon({
            iconUrl: icon,
            // shadowUrl: '//maps.google.com/mapfiles/ms/micons/pushpin_shadow.png',
            // iconSize: [26, 26],
            // shadowSize: [53, 26],
            shadowUrl: '//labs.google.com/ridefinder/images/mm_20_shadow.png',
            iconSize: [12, 20],
            shadowSize: [22, 20],
            iconAnchor: [8, 26],
            popupAnchor: [8, -26]
        }),
        marker = L.marker(position, {
            title: title,
            icon: icon_option
        }).bindPopup(title);

    if (size != null) {
        icon_option = L.icon({
            iconUrl: icon,
            shadowUrl: '//maps.google.com/mapfiles/ms/micons/msmarker.shadow.png',
            iconSize: [size, size],
            shadowSize: [57, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
        marker.setIcon(icon_option);
        marker.addTo(map);
    }
    else {
        marker.addTo(map.photos);
    }

    marker.on('mouseover', function(){
        this.openPopup();
    });

    marker.on('mouseout', function(){
        this.closePopup();
    });
    console.log('marker OK');
}

async function AttachMarkerFromJson(photo) {
    console.log('url: ' + photo.url);
    let pos = await exifr.gps(photo.url);
    if (!pos) {
        console.log('pos undefined');
        return;
    }
    console.log(pos.latitude + ',' + pos.longitude);
    let position = L.latLng(pos.latitude, pos.longitude);
    console.log('position: ' + position);
    let title = '<img src="' + photo.url + '" style="max-width:200px; max-height:150px;"><br>' + photo.title; // this???????
    console.log('title: ' + title);
    initMarker(position, title, '//labs.google.com/ridefinder/images/mm_20_yellow.png', null);
}

async function AttachMarker(url) {
    console.log('url: ' + url);
    let pos = await exifr.gps(url);
    if (!pos) {
        console.log('pos undefined');
        return;
    }
    console.log(pos.latitude + ',' + pos.longitude);
    let position = L.latLng(pos.latitude, pos.longitude);
    console.log('position: ' + position);
    let title = '<img src="' + url + '" style="max-width:200px; max-height:150px;"><br>'; // this???????
    console.log('title: ' + title);
    initMarker(position, title, '//labs.google.com/ridefinder/images/mm_20_yellow.png', null);
}