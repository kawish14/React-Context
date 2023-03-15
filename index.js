require([
    "esri/Map",
    "esri/views/MapView",
    "esri/request",
    "esri/PopupTemplate",
    "dojo/sniff",
    "esri/layers/FeatureLayer",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/geometry/support/jsonUtils",
    "esri/symbols/SimpleFillSymbol",
    "esri/geometry/Polyline",
    "dojo/domReady!"
  ],
  function (Map, MapView, esriRequest, PopupTemplate,sniff,FeatureLayer,Point,Polygon, jsonUtils,SimpleFillSymbol,Polyline) {

    var portalUrl = 'Your portal/AGOL URL here';
    var proxy = 'URL to your Proxy if you need one';

    var form = document.getElementById('uploadForm');
    form.addEventListener("change",function(e){
       var fileName = e.target.value.toLowerCase();
       if (sniff("ie")) { //filename is full path in IE so extract the file name
              var arr = fileName.split("\\");
              fileName = arr[arr.length - 1];
       }
       if (fileName.indexOf(".zip") !== -1) {//is file a zip - if not notify user
              generateFeatureCollection(fileName);
       }
      else {
              document.getElementById('upload-status').innerHTML = '<p style="color:red">Add shapefile as .zip file</p>';
      }
    });
  
    //Create a new map and set the basemap to Dark gray
    var map = new Map({
      basemap: "dark-gray",
    });

    //set a new view and set the properties of the view
    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-86.049, 38.485],
      zoom: 3
    });
  
    function generateFeatureCollection(fileName){
      var name = fileName.split(".");
      //Chrome and IE add c:\fakepath to the value - we need to remove it
      //See this link for more info: http://davidwalsh.name/fakepath
      name = name[0].replace("c:\\fakepath\\", "");
      document.getElementById('upload-status').innerHTML = '<b>Loading… </b>' + name;
      
      //Define the input params for generate see the rest doc for details
      //http://www.arcgis.com/apidocs/rest/index.html?generate.html
      var params = {
        'name': name,
        'targetSR': map.spatialReference,
        'maxRecordCount': 1000,
        'enforceInputFileSizeLimit': true,
        'enforceOutputJsonSizeLimit': true
      };
      
      //generalize features for display Here we generalize at 1:40,000 which is approx 10 meters
      //This should work well when using web mercator.
      var resolution = view.resolution;
      params.generalize = true;
      params.maxAllowableOffset = resolution;
      params.reducePrecision = true;
      params.numberOfDigitsAfterDecimal = 0;
      
      var input = document.querySelector('input[type="file"]');
      var data = input.files[0];
      var formdata = new FormData();
      formdata.append('filetype','shapefile');
      formdata.append('publishParameters', JSON.stringify(params));
      formdata.append('f', 'json');
      formdata.append('file', data);
      
      fetch(proxy + portalUrl + '/sharing/rest/content/features/generate', {
        method: 'post',
        body: formdata
        }).then(function(response){
          return response.json();
        }).then(function(response){
          if(!response){
            if(response.error){
              errorHandler(response.error);
              return;
            }
          }
          var layerName = response.featureCollection.layers[0].layerDefinition.name;
          document.getElementById('upload-status').innerHTML = '<b>Loaded: </b>' + layerName;
          addShapefileToMap(response.featureCollection);
      });
    }
  
    function errorHandler (error) {
        document.getElementById('upload-status').innerHTML = "<p style='color:red'>" + error.message + "</p>";
    }
  
    function addShapefileToMap(featureCollection){
      var layers = [];
      featureCollection.layers.forEach(function(layer){
        var featureLayer = new FeatureLayer({
          objectIdField: 'ObjectID'
        });

        switch (layer.featureSet.geometryType) {
          case 'esriGeometryPoint':
              //Overwrite the geometry to an actual Point
              layer.featureSet.features.forEach(function(feature){
                feature.geometry = new Point({
                  x: feature.geometry.x,
                  y: feature.geometry.y,
                  spatialReference: feature.geometry.spatialReference
                });
              });
              featureLayer.renderer = {type: 'simple', symbol: {type: 'simple-marker', size: 6, color: 'black'}};
              break;
          case 'esriGeometryPolygon':
              //Overwrite the geometry to an actual Polygon
              layer.featureSet.features.forEach(function(feature){
                feature.geometry = new Polygon({
                  rings: feature.geometry.rings,
                  spatialReference: feature.geometry.spatialReference
                });
              });
              featureLayer.renderer = {type: 'simple', symbol: {type: 'simple-fill', size: 6, color: 'black'}};
              break;
          case 'esriGeometryPolyline':
              //Overwrite the geometry to an actual Polyline
              layer.featureSet.features.forEach(function(feature){
                feature.geometry = new Polyline({
                  paths: feature.geometry.paths,
                  spatialReference: feature.geometry.spatialReference
                });
              });
              featureLayer.renderer = {type: 'simple', symbol: {type: 'simple-line', size: 6, color: 'white'}};
              break;
          default: 
              console.log('Not a valid shapefile');
        }
        
        featureLayer.source = layer.featureSet.features;
        layers.push(featureLayer);
      });
      map.addMany(layers);
      document.getElementById('upload-status').innerHTML = '';
    } 
  });