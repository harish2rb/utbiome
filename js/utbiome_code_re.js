//This application is developed by Harish Sangireddy, The University of Texas at Austin, March 2014
// for a UT BIOME -- a living laboratory  

var map;
var panetoggler = 0;
var tp;
// global variable to hold chart data
var chartdata = new Array();
var charttimedata = new Array();
var chartpHData = new Array();
var chartCondData = new Array();
var chartTempData = new Array();
var chartDOData = new Array();
var chartNitrData = new Array();
var chartAlkData = new Array();
var chartEnterData = new Array();
var chartColilertData = new Array();
var chartColilert1Data = new Array();
var chartTurbidityData = new Array();
var chartPhosData = new Array();
require(["dojo/parser",
    "dojo/ready",
    "dojo/dom",
    "esri/map",
    "esri/urlUtils",
    "esri/arcgis/utils",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    "esri/dijit/HomeButton",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/dijit/InfoWindow",
    "esri/InfoTemplate",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/graphic",
    "dojo/_base/array",
    "dojox/charting/Chart",
    "dojox/charting/themes/MiamiNice",
    "dojox/charting/Chart2D",
    "dojo/_base/window",
    "dojo/store/Memory",
    "dijit/tree/ObjectStoreModel",
    "dojo/store/DataStore",
    "dijit/Tree",
    "dijit/form/ComboBox",
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/ready",
    "dijit/registry",
    "dojo/query",
    "dojo/on",
    "dijit/form/Button",
    "dojo/_base/lang",
    "dojox/gfx/fx",
    "dojox/data/CsvStore",
    "dojox/image/LightboxNano",
    //"dojo/json",
    //"dojo/text!./data/wlk_crk_timeseries_treemodel.json",
    "dojox/charting/plot2d/Default",
    "dojox/charting/plot2d/Columns",
    "dojox/charting/plot2d/StackedLines",
    "dojox/charting/plot2d/StackedLines",
    "dojox/charting/plot2d/Lines",
    "dojox/charting/plot2d/Scatter",
    "dojox/charting/plot2d/Markers",
    "dojox/charting/axis2d/Default",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/TitlePane",
    "dijit/layout/AccordionContainer",
    "dijit/layout/TabContainer",
    "dijit/Toolbar",
    "dijit/MenuBar",
    "dijit/MenuBarItem",
    "dijit/PopupMenuBarItem",
    "dijit/DropDownMenu",
    "dijit/MenuItem",
    "dijit/Dialog",
    "dojo/domReady!"
],
        function(parser,
                ready,
                dom,
                Map,
                urlUtils,
                arcgisUtils,
                Legend,
                Scalebar,
                BasemapToggle,
                HomeButton,
                ArcGISDynamicMapServiceLayer,
                InfoWindow,
                InfoTemplate,
                FeatureLayer,
                Query,
                Point,
                SimpleMarkerSymbol,
                Graphic,
                arrayUtils,
                Chart,
                chartThemes,
                Chart2D,
                win,
                Memory,
                ObjectStoreModel,
                DataStore,
                Tree,
                ComboBox,
                dom,
                domConstruct,
                ready, registry, dojoquery, on, Button,
                lang, fx, dojoCsvStore, dojoLightboxNano)
        {
            parser.parse();
            
            // create data disclaimer the dialog:
            var datadescripHtml = '<div id="datadisclaimer"><span id="topic" style="text-decoration: underline;">\
            Data Disclaimer:</span> All samples collected as part of the UTBIOME project\
            are for educational and research purposes only.<br> Thus, the sample and \
            analytical methods employed do not necessarily follow the protocols \
            approved by regulatory agencies to assess compliance with standards.</div>';
            var dataDlg = new dijit.Dialog({
                        title: " Data disclaimer",
                        style: "height:auto ;width: 310px"
                    });
            dataDlg.set("content", datadescripHtml);
            dataDlg.show();
            
            // load biome spheres
            var myButton = new Button({
                label: "Home",
                onClick: function() {
                    // Do something:
                    history.go(0);
                }
            }, "HomeButtonNode");


            // load the base map
            map = new Map("map", {
                basemap: "topo",
                center: [-97.73135, 30.28456],
                zoom: 15
                        //infoWindow: infoWindow
            });

            // adding a basemap toggle
            var toggle = new BasemapToggle({
                map: map,
                basemap: "satellite"
            }, "BasemapToggle");
            toggle.startup();

            // adding a scalebar to the map
            var scalebar = new Scalebar({
                map: map,
                // "dual" displays both miles and kilmometers
                // "english" is the default, which displays miles
                // use "metric" for kilometers
                scalebarUnit: "dual"
            });
            scalebar.show();

            // adding a home button for the map
            var home = new HomeButton({
                map: map
            }, "HomeButton");
            home.startup();
            //after map loads, connect to listen to mouse move & drag events
            //map.on("mouse-move", showCoordinates);
            //map.on("mouse-drag", showCoordinates);

            function showCoordinates(evt) {
                console.log("show");
                //get mapPoint from event
                //The map is in web mercator - modify the map point to display the results in geographic
                var mp = esri.geometry.webMercatorToGeographic(evt.mapPoint);
                //display mouse coordinates
                dojo.byId("info").innerHTML = mp.x.toFixed(5) + ", " + mp.y.toFixed(5);
            }


            // adding the map service layer for utbiome
            // instead of adding the mapservice and then each feature layer, it is better to
            // add only each feature layer
            //utbiomeMapserviceUrl = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/utbiome/MapServer";
            //var utbiomeLayer = new ArcGISDynamicMapServiceLayer(utbiomeMapserviceUrl,{ "id": "utbiome" });
            //map.addLayer(utbiomeLayer);

            // adding the feature layer parts of campus
            var prtsOfcampusContent = "Forty Acres Sampling regions" +
                    "<br><b>Name</b>: ${Name}";
            prtsOfcampus = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/6";
            var prtCampus_ftLayer = new FeatureLayer(prtsOfcampus, {
                infoTemplate: new InfoTemplate("Region: ${Name}", prtsOfcampusContent),
                outFields: ["FID", "Name"]
            });
            map.addLayer(prtCampus_ftLayer);

            // adding the feature waller creek layer
            wlcrkOfcampus = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/3";
            var wlcrk_ftLayer = new FeatureLayer(wlcrkOfcampus, {
                infoTemplate: new InfoTemplate("Creek: ${STREAM}", "${STREAM}"),
                outFields: ["FID", "STREAM", "LENGTH_FEE"]
            });
            map.addLayer(wlcrk_ftLayer);

            // defining the feature waller creek sampling points layers
            // we have two sampling points(upstream and downstream)
            // Downstream
            // Upstream
            var wlcrkDownstrmpopcontent = '<div id="popwrapper">\
                                            <table width="100%"><tr>\
                                            <td><b>Outdoor sampling site</b></td>\
                                            <td align="center"><a href="downloads/UTBIOME_WallerCreek341_DataDownstream.zip" download>\
                                            <img id="downloadicon" src="images/BlueDownloadicon.png" height="48" width="48" /></a></td><tr>\
                                            </table>\
                                            <hr>\
                                            <div id="popleftcolumn">\
                                                    <b>Latitude:</b> 30.280&deg;\
                                                    <br><b>Longitude:</b> -97.734&deg;\
                                                    <hr>The samples were collected by students\
                                                    <br>of class <br>CE341: Intro to Environmental Engr\
                                            </div>\
                                            <div id="poprightcolumn">\
                                                    <img id="st2pic" src="images/wallercreekSitePicDown_thumbnail.jpg" height="100" width="100" />\
                                            </div>\
                                    </div>';
            wlcrkDownSamplePts = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/1";
            var WlcrksmpDown_ftLayer = new FeatureLayer(wlcrkDownSamplePts, {
                infoTemplate: new InfoTemplate("Station: Downstream, Waller Creek", wlcrkDownstrmpopcontent),
                outFields: ["Time", "pH_in_situ", "Conductivi", "Temperatur",
                    "Dissolved", "Nitrate_as", "Alkalinity", "Enterolert", "Colilert_", "Colilert1", "Turbidity",
                    "Phosphorou"]
            });
            map.addLayer(WlcrksmpDown_ftLayer);

            // Upstream
            var wlcrkUpstrmpopcontent = '<div id="popwrapper">\
                                                <table width="100%"><tr>\
                                                <td><b>Outdoor sampling site</b></td>\
                                                <td align="center"><a href="downloads/UTBIOME_WallerCreek341_DataUpstream.zip" download>\
                                                <img id="downloadicon" src="images/BlueDownloadicon.png" height="48" width="48" /></a></td><tr>\
                                                </table>\
                                                <hr>\
                                                <div id="popleftcolumn">\
                                                        <b>Latitude:</b> 30.288&deg;\
                                                        <br><b>Longitude:</b> -97.733&deg;\
                                                        <hr>The samples were collected by students\
                                                        <br>of class CE341: Intro to Environmental Engr\
                                                </div>\
                                                <div id="poprightcolumn">\
                                                        <img id="st1pic" src="images/wallercreekSitePicUP_thumbnail.jpg" height="100" width="100" />\
                                                </div>\
                                        </div>';
            wlcrkUpSamplePts = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/2";
            var WlcrksmpUP_ftLayer = new FeatureLayer(wlcrkUpSamplePts, {
                infoTemplate: new InfoTemplate("Station: Upstream, Waller Creek", wlcrkUpstrmpopcontent),
                outFields: ["Time", "pH_in_situ", "Conductivi", "Temperatur",
                    "Dissolved", "Nitrate_as", "Alkalinity", "Enterolert", "Colilert_", "Colilert1", "Turbidity",
                    "Phosphorou"]
            });
            map.addLayer(WlcrksmpUP_ftLayer);

            // CPE Building outline feature buildings layer
            var bldgOfcampusContent = '<div id="popwrapper">\
                                                <table width="100%"><tr>\
                                                <td><b>Indoor/Outdoor sampling site</b></td>\
                                                <td align="center"><a href="downloads/indoorairdata.zip" download>\
                                                <img id="downloadicon" src="images/BlueDownloadicon.png" height="48" width="48" /></a></td><tr>\
                                                </table>\
                                                <hr>\
                                                <div id="popleftcolumn">\
                                                        <b>Name</b> CPE Building;\
                                                        <hr>The samples were collected by students\
                                                        <br>of class CE369: Air pollution Engr\
                                                </div>\
                                                <div id="poprightcolumn">\
                                                        <img id="bldgpic" src="images/cpe1_picstitch_thumbnail.jpg" height="100" width="100" />\
                                                </div>\
                                        </div>';
            //CPE building layer
            bldgOfcampus = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/5";
            var bldgCampus_ftLayer = new FeatureLayer(bldgOfcampus, {
                infoTemplate: new InfoTemplate("Building: ${RefName}", bldgOfcampusContent),
                outFields: ["FID", "RefName"]
            });
            map.addLayer(bldgCampus_ftLayer);

            // BME and Battle Hall layers
            var bmeAndBattleHallTemplate = new InfoTemplate();
            bmeAndBattleHallTemplate.setContent(getbmeBattleHallpopcontent);
            bmeAndBattleHallOfcampus = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/10";
            var bmeAndBattleHallCampus_ftLayer = new FeatureLayer(bmeAndBattleHallOfcampus, {
                infoTemplate: bmeAndBattleHallTemplate,
                outFields: ["FID", "RefName"]
            });
            map.addLayer(bmeAndBattleHallCampus_ftLayer);
            function getbmeBattleHallpopcontent(graphic) {
                var BuildingName = graphic.attributes.RefName;
                var buildingFID = graphic.attributes.FID;
                bmeAndBattleHallTemplate.setTitle('<b>Building: ' + BuildingName + '</b>');
                var bmeAndBattleHallContent = '<div id="popwrapper">\
                                                <table width="100%"><tr>\
                                                <td><b>Indoor/Outdoor sampling site</b></td>\
                                                <td align="center"><a href="downloads/indoorairdata.zip" download>\
                                                <img id="downloadicon" src="images/BlueDownloadicon.png" height="48" width="48" /></a></td><tr>\
                                                </table>\
                                                <hr>\
                                                <div id="popleftcolumn">\
                                                        <b>Name </b>' + BuildingName + ' Building\
                                                        <hr>The samples were collected by students\
                                                        <br>of class CE369: Air pollution Engr\
                                                </div>\
                                                <div id="poprightcolumn">\
                                                        <img id="bldgpic" src="images/IMG_4919_thumbnail_' + buildingFID + '.png" height="100" width="100" />\
                                                </div>\
                                        </div>';
                return bmeAndBattleHallContent;
            }
            bmeAndBattleHallCampus_ftLayer.on("click", displayBattleHallContent);
            function displayBattleHallContent(evnt) {
                map.graphics.clear();
                document.getElementById('description').innerHTML = "";
                document.getElementById('chartdatadownload').innerHTML = "";
                document.getElementById('TimeseriesChart').innerHTML = "";
                var BuildingFID = evnt.graphic.attributes.FID;
                var BuildingName = evnt.graphic.attributes.RefName;
                if (BuildingFID === 0) {
                    document.getElementById('description').innerHTML = '<b>' + BuildingName + '</b><br>\
                    <img id="bldgpic" src="images/IMG_4919_thumbnail_0.png" height="164" width="120" /><br>\
                   <p>UTBiome members conducted microbial sampling\
                   at the beautifully unique building Battle Hall. Battle hall is the only academic building on campus\
                   listed on the National Register of Historic Places.</p>\
                   <p> The Architecture and Planning Library - located on the 2nd floor - is one of the focal points of\
                   the building and that is where we conducted the bulk of our sampling. We took wipe samples, measured\
                   indoor particle concentrations with an AeroTrak device, and took simultaneous indoor and outdoor aerosol\
                   samples with button samplers.</p>\
                   <p>We also took several swab and wipe samples near the building doors leading to west mall on the 1st floor,\
                   and along the building stairwell and corridors. We are looking forward to assessing these samples to see how\
                   much of an influence the outdoor microbial communities have on the indoor microbial assemblages.</p>\
                   <p>The building is set for renovation in a few years and it will also be really interesting to see how our\\n\
                   pre-renovation samples differ from post-renovation samples taken in the future.</p>\
                    For more information also check out: <br>\
                   <a href="http://ut.energycurb.com/works" target="_blank">http://ut.energycurb.com/works</a>';
                } else if (BuildingFID === 1) {
                    document.getElementById('description').innerHTML = '<b>' + BuildingName + '</b><br>\
                    <img id="bldgpic" src="images/IMG_4919_thumbnail_1.png" height="100" width="220" /><br>\
                   <p>The Biomedical Engineering Department at The University of Texas at Austin fosters \
                   a culture of innovation where critical thinking and creativity through research, \
                   leads towards the improvement of disease diagnosis and treatment.\
                   </p>';
                }
            }


            // adding the CPE Room layer
            CPERoomOfcampus = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/4";
            var CPEroom_ftLayer = new FeatureLayer(CPERoomOfcampus, {
                infoTemplate: new InfoTemplate("Building: ${Name}", "${*}"),
                outFields: ["FID", "Name"]
            });
            map.addLayer(CPEroom_ftLayer);

            // adding the cross sections layer
            var wlkcrkCrossTemplate = new InfoTemplate();
            wlkcrkCrossTemplate.setTitle("<b>Outdoor crosssection site</b>");
            wlkcrkCrossTemplate.setContent(getwlcrkCrosspopcontent);

            wlk_crosssections = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/8";
            var wlkCrossSections_ftLayer = new FeatureLayer(wlk_crosssections, {
                infoTemplate: wlkcrkCrossTemplate,
                outFields: ["FID", "Name", "Biome", "ph_in_situ", "conductivi", "Temperatur", "Nitrate", "Alkalinity",
                    "Enterolert", "Colitert", "colitert1", "Turbidity", "Phosphorou"]
            });
            map.addLayer(wlkCrossSections_ftLayer);

            // display the cross sections info on the explore tab
            wlkCrossSections_ftLayer.on("click", displayCrossInfoExploreTab);
            function displayCrossInfoExploreTab(evnt) {
                map.graphics.clear();
                document.getElementById('description').innerHTML = "";
                document.getElementById('chartdatadownload').innerHTML = "";
                document.getElementById('TimeseriesChart').innerHTML = "";
                var id = evnt.graphic.attributes.FID;
                var stationName = evnt.graphic.attributes.Name;
                var biome = evnt.graphic.attributes.Biome;
                var phinsitu = evnt.graphic.attributes.ph_in_situ;
                var conduc = evnt.graphic.attributes.conductivi;
                var temp = evnt.graphic.attributes.Temperatur;
                var nitr = evnt.graphic.attributes.Nitrate;
                var alk = evnt.graphic.attributes.Alkalinity;
                var entero = evnt.graphic.attributes.Enterolert;
                //entero = (entero * 100).toPrecision(3); // this is for scientific notation requested
                //entero = entero.replace('e+', ' x 10^');
                var colitert = evnt.graphic.attributes.Colitert;
                //colitert = (colitert * 100).toPrecision(3); // this is for scientific notation requested
                //colitert = colitert.replace('e+', ' x 10^');
                var colitert1 = evnt.graphic.attributes.colitert1;
                //colitert1 = (colitert1 * 100).toPrecision(3); // this is for scientific notation requested
                //colitert1 = colitert1.replace('e+', ' x 10^');
                var turbi = evnt.graphic.attributes.Turbidity;
                var phos = evnt.graphic.attributes.Phosphorou;
                var crossFeatureInfo = '<b><table id="crosssectionsTable">\
                                        <tr><td>Biome</td><td>' + biome + '</td> </tr>\
                                        <tr><td>pH</td><td>' + phinsitu + '</td> </tr>\
                                        <tr><td>Conductivity(uS/cm^2)</td><td>' + conduc + '</td> </tr>\
                                        <tr><td>Temperature(C)</td><td>' + temp + '</td> </tr>\
                                        <tr><td>Nitrate as N-NO3- (mg/l)</td><td>' + nitr + '</td> </tr>\
                                        <tr><td>Alkalinity as CaCO3 (mg/l)</td><td>' + alk + '</td> </tr>\
                                        <tr><td>Enterolert: Enterococci (MPN/100ml)</td><td>' + entero + '</td> </tr>\
                                        <tr><td>Colilert: Total Coliforms (MPN/100ml)</td><td>' + colitert + '</td> </tr>\
                                        <tr><td><i>E. coli</i> (MPN/100ml)</td><td>' + colitert1 + '</td> </tr>\
                                        <tr><td>Turbidity(NTUs)</td><td>' + turbi + '</td> </tr>\
                                        <tr><td>Phosphorous as  P-PO4 3- (mg/l)</td><td>' + phos + '</td> </tr>\
                                        </table></b>';
                var featureHeaderhtml = '<b>Station Name:' + stationName + '</b><br>';
                var featureImagehtml = '<br><img id="crk2pic" class="crssPics" src="images/crossectionsPics/crossections_' + id +
                        '_thumbnail.jpg" height="150" width="150" /><br>';
                document.getElementById('description').innerHTML = featureHeaderhtml + featureImagehtml + crossFeatureInfo;
            }

            function getwlcrkCrosspopcontent(graphic) {
                var pt = esri.geometry.webMercatorToGeographic(graphic.geometry);
                var lati = pt.y.toFixed(3);
                var longi = pt.x.toFixed(3);
                var fidnum = graphic.attributes.FID;
                var wlcrkCrosspopcontent = '<div id="popwrapper">\
                                            <table width="100%"><tr>\
                                            <td><b>Outdoor cross section sampling site</b></td>\
                                            <td align="center"><a href="downloads/UTBIOME_WallerCreek_Transects.zip" download>\
                                            <img id="downloadicon" src="images/BlueDownloadicon.png" height="48" width="48" /></a></td><tr>\
                                            </table>\
                                            <hr>\
                                            <div id="popleftcolumn">\
                                                    <b>Latitude:</b> ' + lati + '&deg;\
                                                    <br><b>Longitude:</b>' + longi + '&deg;\
                                                    <hr>The samples were collected by graduate students\
                                                    \
                                            </div>\
                                            <div id="poprightcolumn">\
                                                    <img id="st1pic" src="images/crossectionsPics/crossections_' + fidnum + '_thumbnail.jpg" height="100" width="100" />\
                                            </div>\
                                    </div>';
                return wlcrkCrosspopcontent;
            }

            // adding the Biome spheres layer
            var biomeSpherespopContent = '<div id="popwrapper">\
                                        <table width="100%"><tr>\
                                        <td align="center"><b>Biome spheres</b></td>\
                                        <tr>\
                                        </table>\
                                        <hr>\
                                        <div id="popleftcolumn">\
                                                What is interesting about this biome sphere.....\
                                                <br>\
                                        </div>\
                                        <div id="poprightcolumn">\
                                                <img id="biosphere" src="images/BiomeSphereimageblog_thumbnail.jpg" height="100" width="100" />\
                                        </div>\
                                </div>';
            biomeSpheresOfcampus = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/7";
            var biomeSpheres_ftLayer = new FeatureLayer(biomeSpheresOfcampus, {
                infoTemplate: new InfoTemplate("BiomeSphere ${Name}", biomeSpherespopContent),
                outFields: ["FID", "Name"]
            });
            var myButton = new Button({
                label: "What's Interesting",
                onClick: function() {
                    if (panetoggler === 0) {
                        map.addLayer(biomeSpheres_ftLayer);
                        panetoggler = 1;// map layer on
                        dojo.style("BiomeSphereButtonNode", {"color": "black"});

                    } else if (panetoggler === 1) {
                        // Do something:
                        document.getElementById('description').innerHTML = "<ul>\
                            <li>Click on Features in the Map to explore them.</li>\
                            <li>Some Features will have timeseries of data while others are a single point in time.</li>\
                            <li>Explore the ph, conductivity tabs to get a sense of the spatial variability of \
                                these variables in UT –BIOME</li>\
                            <li>Click on the 3D map to explore UT in 3D</li>\
                        </ul>";
                        map.graphics.clear();
                        map.infoWindow.hide();
                        map.removeLayer(biomeSpheres_ftLayer);
                        panetoggler = 0;// map layer off
                        dojo.style("BiomeSphereButtonNode", {"color": "inherit"});

                    }
                }
            }, "BiomeSphereButtonNode");

            // For all the Images in the Image gallery show a location on map when on mouse
            function displayImageLocationOnMap(imageLocation) {
                var iconPath = "M9.5,3v10c8,0,8,4,16,4V7C17.5,7,17.5,3,9.5,3z M6.5,29h2V3h-2V29z";
                var initColor = "#FF3300";
                arrayUtils.forEach(imageLocation, function(point) {
                    var graphic = new Graphic(new Point(point), createSymbol(iconPath, initColor));
                    map.graphics.add(graphic);
                });
                function createSymbol(path, color) {
                    var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
                    markerSymbol.setPath(path);
                    markerSymbol.setColor(new dojo.Color(color));
                    markerSymbol.setOutline(null);
                    markerSymbol.setSize("32");
                    return markerSymbol;
                }
                ;
            }

            // reading the images gallery csv
            var imageStore = new dojoCsvStore({url: 'data/imagestore.csv'});
            //reading the data store
            var imageID = [];
            var imageName = [];
            var thumbnaillocation = [];
            var largepiclocation = [];
            var longitude = [];
            var latitude = [];

            imageStore.fetch({
                onComplete: function(items) {
                    //var fieldNames = imageStore.getAttributes(items[0]);
                    for (var i = 0; i < items.length; i++) {
                        imageID.push(imageStore.getValue(items[i], 'imageID'));
                        imageName.push(imageStore.getValue(items[i], 'imageName'));
                        thumbnaillocation.push(imageStore.getValue(items[i], 'thumbnaillocation'));
                        largepiclocation.push(imageStore.getValue(items[i], 'largepiclocation'));
                        longitude.push(imageStore.getValue(items[i], 'longitude'));
                        latitude.push(imageStore.getValue(items[i], 'latitude'));
                        var ahrefId = imageName[i] + '_' + imageID[i];
                        var imageLocation = [[longitude[i], latitude[i]]];
                        domConstruct.place('<a id=' + imageName[i] + '_' + imageID[i] + ' data-dojo-type="dojox.image.LightboxNano" href=' + largepiclocation[i] + '> \
                        <img alt=' + imageName[i] + ' id=' + imageID[i] + ' class="gallery"  src=' + thumbnaillocation[i] + '\
                               onmouseover="displayImageLocationOnMap(' + imageLocation + ')">\
                        </a>', 'imageGallery');
                        new dojoLightboxNano({href: largepiclocation[i]}, ahrefId);

                        (function(i) {
                            var d = document.getElementById(imageID[i]);
                            d.onmouseover = function() {
                                map.graphics.clear();
                                displayImageLocationOnMap([[longitude[i], latitude[i]]]);
                            };
                            d.onmouseout = function() {
                                map.graphics.clear();
                            };
                        })(i);
                    }
                }
            });

            // Populate the Explore tab
            biomeSpheres_ftLayer.on("click", displayonpartExploreTab);
            function displayonpartExploreTab(evt) {
                map.graphics.clear();
                document.getElementById('chartdatadownload').innerHTML = "";
                document.getElementById('TimeseriesChart').innerHTML = "";
                document.getElementById('description').innerHTML = "";
                var id = evt.graphic.attributes.FID;
                var blurbid6 = '<b>Interesting Facts!</b>\
                                    <ul>\
                                    <li>Students from the Air Pollution Engineering Class collected \
                                    over 50 samples to assess how the environment in their classroom \
                                    differed from the environment outside their classroom </li>\
                                    <li>Surface, air and dust samples were collected from a classroom, \
                                    the hallway as well as from the patio outside the building. In addition, \
                                    classroom surfaces (desks, chairs, door handles) were wiped with a collection \
                                    cloth and analyzed to identify bacteria present.</li>\
                                    <li>When the classroom is occupied there is a much higher concentration of fine \
                                    particles in the air than when the classroom is empty. This means that walking \
                                    in a room kicks up fine dust from the floor and increases the indoor \
                                    concentration of small particles in the air that we breathe</li>\
                                    <li>The concentration of carbon dioxide in the classroom increased \
                                    when the room was occupied. This result is expected because humans\
                                    exhale carbon dioxide. In a room that is poorly ventilated, carbon dioxide\
                                    concentrations can increase rapidly.  In a well-ventilated room, the concentrations\
                                    are much lower.</li>\
                                    <li>The bacterial community detected on indoor surfaces included microorganisms \
                                    commonly found on human skin. Our skin is populated by millions of microbes\
                                    that help us to maintain a healthy equilibrium.It is estimated that a \
                                    human person sheds between 200,000 and 400,000 skin flakes per minute. \
                                    This is part of our microbial imprint.</li>\
                                    </ul>';
                if (id == 6) {
                    document.getElementById('description').innerHTML = blurbid6;
                }
            }
            
                       
            // Display the tree node for data digging
            bldgCampus_ftLayer.on("click", displayTree);
            function displayTree(evnt) {
                map.graphics.clear();
                document.getElementById('chartdatadownload').innerHTML = "";
                document.getElementById('TimeseriesChart').innerHTML = "";
                var id = evnt.graphic.attributes.FID;
                var prtName = evnt.graphic.attributes.RefName;
                document.getElementById('description').innerHTML = prtName;
                
                // put the image of the classroom on the dashboard
                tp = dijit.byId("dashboard");
                if (tp.attr('open', false)) {
                       tp.toggle();
                    }
                //classroomImage = '<img src="images/classroomscheme.png" height="200" \
                //                    width="320" usemap="#classroommap">';
                experimentImage = '<div id="svgim"><svg id="classroomscheme" width="320" height="190">\
                <g><image x="10" y="10" width="300px" height="180px" xlink:href="images/classroomscheme.png"> \
                </image><a xlink:href="images/g4piechart.png" xlink:show="new">\
                <!-- Classroom marker  --><circle cx="110" cy="55" r="15" stroke="none" stroke-width="2"fill="#cc0000"  fill-opacity="0.4" />\
                <circle cx="110" cy="55" r="5" stroke="3" stroke-width="2" fill="yellow"  fill-opacity="0.5" />\
                </a> <a xlink:href="images/keyboardpiechart.png" xlink:show="new"><!-- Keyboard and seat marker  -->\
                <circle cx="120" cy="85" r="8" stroke="none" stroke-width="2" fill="#cc0000"  fill-opacity="0.4" />\
                <circle cx="120" cy="85" r="2" stroke="3" stroke-width="2" fill="yellow"  fill-opacity="0.5" /></a>\
                <a xlink:href="images/floortransit_1.png" xlink:show="new"><!-- Marker for entrance hall transition  -->\
                <circle cx="200" cy="120" r="15" stroke="none" stroke-width="2" fill="#cc0000"  fill-opacity="0.4" />\
                <circle cx="200" cy="120" r="5" stroke="3" stroke-width="2" fill="yellow"  fill-opacity="0.5" />\
                </a><a xlink:href="images/floortransit_2.png" xlink:show="new"><!-- Marker for corridor transition  -->\
                <circle cx="150" cy="120" r="15" stroke="none" stroke-width="2" fill="#cc0000"  fill-opacity="0.4" />\
                <circle cx="150" cy="120" r="5" stroke="3" stroke-width="2" fill="yellow"  fill-opacity="0.5" />\
                </a><a xlink:href="images/vendingmachine.png" xlink:show="new"><!-- Marker for vending transition  -->\
                <circle cx="250" cy="170" r="16" stroke="none" stroke-width="2" fill="#cc0000"  fill-opacity="0.4" />\
                <circle cx="250" cy="170" r="5" stroke="3" stroke-width="2" fill="yellow"  fill-opacity="0.5" />\
                </a> </g><g>\
                <circle cx="10" cy="10" r="8" stroke="none" stroke-width="2" fill="#cc0000"  fill-opacity="0.4" />\
                <circle cx="10" cy="10" r="4" stroke="3" stroke-width="2" fill="yellow"  fill-opacity="0.5" />\
                <text x="25" y="18">click me</text></g></svg></div>\
                <div id="imagetext" style="position:relative;height:100px;font-size:8pt;text-align:left;"><br>\
                <i>Instructions: Click on dots on the dashboard scheme and you \
                will get a pop-up with a pie chart indicating the proportion of each source in the specific sample. \
                Note: The codes G-0 to G-4 refers to the location of the samples G-0 >> outdoor low transit; \
                G-1 >> outdoor high transit, at entrance; G-2 >> entrance hall; G-3 >> corridor; G-4 >> classroom\
                </i></div>';
                document.getElementById('TimeseriesChart').innerHTML = experimentImage;
                var svgdes = '<div id="svgexplanation" \
                style="position:relative;font-size:8pt;text-align:justify;">\
                <i>Objective:</i> Help users of the UTBiome map identifying relationships among\
                samples and how human activities can shape the microbial populations that\
                surround us.<br> Tool used: SourceTracker (on QIIME) [<i>Knights et al. 2011</i>]\
                Samples considered either sinks (sample for which we want to know the origin/source),\
                and sources (samples from within the study which may help us with our objective).\
                <br>\
                <i>Knights,Dan et al. "Bayesian community-wide culture-independent microbial source tracking." \
                Nature Methods (2011)</i></div><br>';
                document.getElementById('description').innerHTML = svgdes;
                
                // Make the tree here
                // Create memory store here
                var utbiomeVarStore = new Memory({
                    data: [{id: 'smpltime', name: 'Sampling Date', type: 'time'},
                        {id: 'TP', name: ' Single Time Period', type: 'timePeriod', parent: 'smpltime'},
                        {id: 'TP1', name: '11/19/2013', type: 'timePeriod', parent: 'TP'},
                        {id: 'Indoor', name: 'Indoor', type: 'location', parent: 'TP1'},
                        {id: 'in_air', name: 'Air', type: 'sampleType', parent: 'Indoor'},
                        {id: 'in_air_Rh', name: 'Relative Humidity', units: '[%]', type: 'parameter', parent: 'in_air'},
                        {id: 'in_air_Temp', name: 'Temperature', units: '[deg celsius]', type: 'parameter', parent: 'in_air'},
                        {id: 'in_air_buttonsampler', name: 'Button Sampler', units: '[NTUs]', type: 'parameter', parent: 'in_air'},
                        {id: 'in_surface', name: 'Surface', type: 'sampleType', parent: 'Indoor'},
                        {id: 'in_surface_wipes', name: 'Wipes', type: 'sampleType', parent: 'in_surface'},
                        {id: 'in_surface_swab', name: 'Swabs', type: 'sampleType', parent: 'in_surface'},
                        {id: 'Outdoor', name: 'Outdoor', type: 'location', parent: 'TP1'},
                        {id: 'out_air', name: 'Air', type: 'sampleType', parent: 'Outdoor'},
                        {id: 'out_air_Rh', name: 'Relative Humidity', units: '[%]', type: 'parameter', parent: 'out_air'},
                        {id: 'out_air_Temp', name: 'Temperature', units: '[deg celsius]', type: 'parameter', parent: 'out_air'},
                        {id: 'out_air_buttonsampler', name: 'Button Sampler', units: '[NTUs]', type: 'parameter', parent: 'out_air'},
                        {id: 'out_surface', name: 'Surface', type: 'sampleType', parent: 'Outdoor'},
                        {id: 'out_surface_wipes', name: 'Wipes', type: 'sampleType', parent: 'out_surface'},
                        {id: 'out_surface_swab', name: 'Swabs', type: 'sampleType', parent: 'out_surface'}

                    ],
                    getChildren: function(object) {
                        return this.query({parent: object.id});
                    }
                });
                // Create the model
                var utbiomeModel = new ObjectStoreModel({
                    store: utbiomeVarStore,
                    query: {id: 'smpltime'}
                });

                //
                function treeOnClickOpenDialog(item, tree, evt) {
                    //item is the node's DataStore item
                    //will create a dialog for the air sampling
                    var itemid = item.id;
                    // create the dialog if itemName is Dust or surface:
                    // Create the chart within it's "holding" node
                    // check for title pane
                    //document.getElementById('TimeseriesChart').innerHTML = "";
                    document.getElementById('chartdatadownload').innerHTML = '';
//                    tp = dijit.byId("dashboard");
//                    if (tp.attr('open', true)) {
//                        tp.toggle();
//                    }
                    // for each item in the tree we will get the graph and show a dialog
                    if (itemid == 'in_air_Rh')
                    {
                        descripHtml = '<img src="images/Airstudy/IndoorAirRH.png" height="300" width="500">';
                        dialogTitle = item.name;
                    } else if (itemid == 'in_air_Temp')
                    {
                        descripHtml = '<img src="images/Airstudy/IndoorAirTemperature.png" height="300" width="500">';
                        dialogTitle = item.name;
                    } else if (itemid == 'in_air_buttonsampler')
                    {
                        descripHtml = '<img src="images/Airstudy/IndoorAirButtonsampler.png" height="300" width="500">';
                        dialogTitle = item.name;
                    } else if (itemid == 'out_air_Rh')
                    {
                        descripHtml = '<img src="images/Airstudy/OutdoorAirRH.png" height="300" width="500">';
                        dialogTitle = item.name;
                    } else if (itemid == 'out_air_Temp')
                    {
                        descripHtml = '<img src="images/Airstudy/OutdoorAirTemperature.png" height="300" width="500">';
                        dialogTitle = item.name;
                    } else if (itemid == 'in_surface_wipes')
                    {
                        //descripHtml0 = '<img id="myImg" src="images/Airstudy/IndoorWipesRHTempStacked.png" height="250" width="500"></a>';
                        descripHtml1 = '<img id="myImg" src="images/Airstudy/DesksurfaceWipe.png" height="300" width="500">';
                        descripHtml = descripHtml1;
                        dialogTitle = item.name;
                    } else if (itemid == 'in_surface_swab')
                    {
                        //descripHtml = '<img id="myImg" src="images/Airstudy/IndoorSwabsRHTempStacked.png" height="300" width="500">';
                        descripHtml = 'coming soon data being analyzed'
                        dialogTitle = item.name;
                    } else if (itemid == 'out_air_buttonsampler')
                    {
                        descripHtml = '<img id="myImg" src="images/Airstudy/outdoorAirButtonSampler.png" height="300" width="500">';
                        dialogTitle = item.name;
                    } else if (itemid == 'out_surface_wipes')
                    {
                        descripHtml = '<img id="myImg" src="images/Airstudy/FloorsurfaceWipe.png" height="300" width="500">';
                        dialogTitle = item.name;
                    } else if (itemid == 'out_surface_swab')
                    {
                        //descripHtml0 = '<img id="myImg" src="images/Airstudy/OutdoorSurfaceSwabRHTemp.png" height="220" width="500"></a>';
                        //descripHtml1 = '<img id="myImg" src="images/Airstudy/OutdoorSurfaceSwabParticleCount.png" height="300" width="500">';
                        descripHtml = 'coming soon data being analyzed';
                        dialogTitle = item.name;
                    }

                    // create the dialog:
                    secondDlg = new dijit.Dialog({
                        title: dialogTitle + " data analysis",
                        style: "height:auto ;width: 510px"
                    });
                    secondDlg.set("content", descripHtml);
                    secondDlg.show();

                }

                // Create the Tree.
                var tree = new Tree({
                    model: utbiomeModel,
                    onClick: treeOnClickOpenDialog, // THIS LINE //
                    autoExpand: true,
                    showRoot: false,
                    openOnClick: true,
                    getDomNodeById: function(id) // new function to find DOM node
                    {
                        return this._itemNodesMap[ id ][0];
                    }
                });
                tree.placeAt(dijit.byId("description"));
                //tree.startup();
            }

            // Lets query the features and show them in the panel click
            prtCampus_ftLayer.on("click", displayonpartCampussidePanel);
            function displayonpartCampussidePanel(evnt) {
                map.graphics.clear();
                document.getElementById('chartdatadownload').innerHTML = "";
                document.getElementById('TimeseriesChart').innerHTML = "";
                var id = evnt.graphic.attributes.FID;
                var prtName = evnt.graphic.attributes.Name;
                if (id == 0)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/erwin.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = prtName + descripHtml;
                } else if (id == 1)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/admin.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = prtName + descripHtml;
                } else if (id == 2)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/facilities.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = prtName + descripHtml;
                } else if (id == 3)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/lbj.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = prtName + descripHtml;
                } else if (id == 4)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/disch.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = prtName + descripHtml;
                } else if (id == 5)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/stadium.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = prtName + descripHtml;
                } else if (id == 6)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/law.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = prtName + descripHtml;
                } else if (id == 7)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/eastmall.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = prtName + descripHtml;
                } else if (id == 8)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/buildings/graphics/insets/cpe_inset.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = prtName + descripHtml;
                } else if (id == 9)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/buildings/graphics/insets/btl_inset.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = prtName + descripHtml;
                } else if (id == 10)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/buildings/graphics/insets/bme_inset.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = prtName + descripHtml;
                } else if (id == 11)
                {
                    descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/pcl.gif" height="255" width="255">';
                    document.getElementById('description').innerHTML = 'Perry-Castaneda Library' + descripHtml;
                }
            }


// ****************************************************************************//
// Reading data for the Up stream point on waller creek
            WlcrksmpUP_ftLayer.on("click", displayonUpsidePanel);
            var samplelocationUp ='Upstream';
            var timseriesfilenameUp ='upstreamWallerCreek_timeseries.csv';
            function displayonUpsidePanel(evnt) {
                map.graphics.clear();
                document.getElementById('chartdatadownload').innerHTML = "";
                document.getElementById('description').innerHTML = "";
                document.getElementById('description').innerHTML = "<b>"+samplelocationUp +" Waller Creek</b><br>";
                document.getElementById('TimeseriesChart').innerHTML = "";
                // read the json here to populate the tree
                //var storewlk = json.parse(mywlkcrktimeseriesjson);
                // Create memory store here
                var utbiomeVarStore = new Memory({
                    data: [{"id": "smpltime", "name": "Sampling Date", "type": "time"},
{"id": "TP", "name": "Time Period", "type": "timePeriod", "parent": "smpltime"},
{"id": "TP1", "name": "10/28/2013 - 11/1/2013", "type": "timePeriod", "parent": "TP"},
{"id": "waterp1", "name": "Water", "type": "sampletype", "parent": "TP1"},
{"id": "ph", "name": "pH", "units": "", "type": "Parameter", "parent": "waterp1"},
{"id": "con", "name": "Conductivity", "units": "[uS/cm^2]", "type": "Parameter", "parent": "waterp1"},
{"id": "temp", "name": "Temperature", "units": "[deg celsius]", "type": "Parameter", "parent": "waterp1"},
{"id": "DO", "name": "Dissolved Oxygen", "units": "[mg/l]", "type": "Parameter", "parent": "waterp1"},
{"id": "Nit", "name": "Nitrate", "units": "[mg/l as N-NO3-]", "type": "Parameter", "parent": "waterp1"},
{"id": "Alk", "name": "Alkalinity", "units": "[mg/l as CaCO3]", "type": "Parameter", "parent": "waterp1"},
{"id": "Tur", "name": "Turbidity", "units": "[NTUs]", "type": "Parameter", "parent": "waterp1"},
{"id": "pho", "name": "Phosphorous", "units": "[as P-PO43-]", "type": "Parameter", "parent": "waterp1"},
{"id": "enterolet", "name": "Enterococci", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp1"},
{"id": "Colilert", "name": "Total Coliforms", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp1"},
{"id": "ColilertE", "name": "E. Coli", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp1"},
{"id": "TP2", "name": "03/31/2014 - 03/31/2014", "type": "timePeriod", "parent": "TP"},
{"id": "waterp2", "name": "Water", "type": "sampleType", "parent": "TP2"},
{"id": "ph", "name": "pH", "units": "", "type": "Parameter", "parent": "waterp2"},
{"id": "con", "name": "Conductivity", "units": "[uS/cm^2]", "type": "Parameter", "parent": "waterp2"},
{"id": "temp", "name": "Temperature", "units": "[deg celsius]", "type": "Parameter", "parent": "waterp2"},
{"id": "DO", "name": "Dissolved Oxygen", "units": "[mg/L]", "type": "Parameter", "parent": "waterp2"},
{"id": "Nit", "name": "Nitrate", "units": "[mg/l as N-NO3-]", "type": "Parameter", "parent": "waterp2"},
{"id": "Alk", "name": "Alkalinity", "units": "[mg/l as CaCO3]", "type": "Parameter", "parent": "waterp2"},
{"id": "Tur", "name": "Turbidity", "units": "[NTUs]", "type": "Parameter", "parent": "waterp2"},
{"id": "pho", "name": "Phosphorous", "units": "[as P-PO43-]", "type": "Parameter", "parent": "waterp2"},
{"id": "enterolet", "name": "Enterococci", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp2"},
{"id": "Colilert", "name": "Total Coliforms", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp2"},
{"id": "ColilertE", "name": "E. Coli", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp2"}],
                    getChildren: function(object) {
                        return this.query({parent: object.id});
                    }
                });
                // Create the model
                var utbiomeModel = new ObjectStoreModel({
                    store: utbiomeVarStore,
                    query: {id: 'smpltime'}
                });

                function treeOnClick(item) {
                    //item is the node's DataStore item
                    //I forgot if tree is the whole tree or just the currtent node
                    //evt is the usual event object, with things like mouse position, etc...
                    //document.getElementById('TimeseriesChart').innerHTML = item.id;
                    document.getElementById('TimeseriesChart').innerHTML = "";
                    var itemName = item.id;
                    var itemParent = item.parent;
                    var chartdata;
                    var chartmin;
                    var chartmax;
                    var ylabelfontsize = 10;
                    // read the data from the csv file
                    var dwnstrsiteData = new dojoCsvStore({url: 'data/'+timseriesfilenameUp});
                    var phdata = [],Xlabelfortimedata=[],labeltextArraydata=[];
                    var condata=[],tempdata=[],DOdata=[],Nitdata=[],Alkdata=[],Turdata = [];
                    var phodata=[],enteroletdata=[],Colilertdata=[],ColilertEdata =[];
                    dwnstrsiteData.fetch({query: {time: itemParent},
                        onComplete: function(items) {
                            // Have to only retrieve items as per parent of the item
                            // The item parent is the time period (e.g. waterp1,waterp2..)
                            for (var i = 0; i < items.length; i++) {
                                labeltextArraydata.push(dwnstrsiteData.getValue(items[i], 'Timeperiod'));
                                phdata.push(dwnstrsiteData.getValue(items[i], 'ph'));
                                condata.push(dwnstrsiteData.getValue(items[i], 'con'));
                                tempdata.push(dwnstrsiteData.getValue(items[i], 'temp'));
                                DOdata.push(dwnstrsiteData.getValue(items[i], 'DO'));
                                Nitdata.push(dwnstrsiteData.getValue(items[i], 'Nit'));
                                Alkdata.push(dwnstrsiteData.getValue(items[i], 'Alk'));
                                Turdata.push(dwnstrsiteData.getValue(items[i], 'Tur'));
                                phodata.push(dwnstrsiteData.getValue(items[i], 'pho'));
                                enteroletdata.push(dwnstrsiteData.getValue(items[i], 'enterolet'));
                                Colilertdata.push(dwnstrsiteData.getValue(items[i], 'Colilert'));
                                ColilertEdata.push(dwnstrsiteData.getValue(items[i], 'ColilertE'));
                                Xlabelfortimedata.push(dwnstrsiteData.getValue(items[i], 'Xlabelfortime'));
                            }
                            
                            // check all the item name
                            if (itemName === 'ph')
                            {
                                chartdata = phdata;
                                chartmin = Math.min.apply(Math, chartdata)-1;
                                chartmax = Math.max.apply(Math, chartdata)+1;
                            } else if (itemName === 'con')
                            {
                                chartdata = condata;
                                chartmin = Math.min.apply(Math, chartdata)-50;
                                chartmax = Math.max.apply(Math, chartdata)+50;
                            } else if (itemName === 'temp')
                            {
                                chartdata = tempdata;
                                chartmin = Math.min.apply(Math, chartdata)-5;
                                chartmax = Math.max.apply(Math, chartdata)+5;
                            } else if (itemName === 'DO')
                            {
                                chartdata = DOdata;
                                chartmin = 0;
                                chartmax = 16;
                            } else if (itemName === 'Nit')
                            {
                                chartdata = Nitdata;
                                chartmin = 0;
                                chartmax = Math.max.apply(Math, chartdata)+0.5;
                            } else if (itemName === 'Alk')
                            {
                                chartdata = Alkdata;
                                chartmin = Math.min.apply(Math, chartdata)-50;
                                chartmax = Math.max.apply(Math, chartdata)+50;
                            } else if (itemName === 'Tur')
                            {
                                chartdata = Turdata;
                                chartmin = 0;
                                chartmax = Math.max.apply(Math, chartdata)+5;
                            } else if (itemName === 'pho')
                            {
                                chartdata = phodata;
                                chartmin = 0;
                                chartmax = Math.max.apply(Math, chartdata)+0.1;
                            } else if (itemName === 'enterolet')
                            {
                                chartdata = enteroletdata;
                                chartmin = Math.min.apply(Math, chartdata)-1;
                                chartmax = Math.max.apply(Math, chartdata)+1;
                                ylabelfontsize = 10;
                            } else if (itemName === 'Colilert')
                            {
                                chartdata = Colilertdata;
                                chartmin = Math.min.apply(Math, chartdata)-50;
                                chartmax = Math.max.apply(Math, chartdata)+50;
                                ylabelfontsize = 10;
                            } else if (itemName === 'ColilertE')
                            {
                                chartdata = ColilertEdata;
                                chartmin = Math.min.apply(Math, chartdata)-5;
                                chartmax = Math.max.apply(Math, chartdata)+5;
                                ylabelfontsize = 10;
                            }
                            // make the plot here
                            tp = dijit.byId("dashboard");
                            if (tp.attr('open', false)) {
                                tp.toggle();
                                panetoggler = 1;
                            }
                            // to scale the data properly, need to create a datacell
                            var xarray = Xlabelfortimedata; //[17, 20, 23, 26, 29, 32, 35, 38, 45, 50, 58, 62];
                            var labeltextArray = labeltextArraydata;//['8:30AM', '10:00AM', '11:30AM', '1:00PM',
                                //'2:30PM', '4:00PM', '5:30PM', '7:00PM', '10:30PM', '1:00AM', '5:00AM', '7:00AM'];
                            var chartdatatoplot = [];
                            for (var ci = 0; ci < chartdata.length; ci++) {
                                var dy = chartdata[ci];
                                var dx = xarray[ci];
                                chartdatatoplot[ci] = {x: dx, y: dy};
                            }

                            // Create the chart within it's "holding" node
                            var pHChart = new Chart2D("TimeseriesChart");
                            // Set the theme
                            pHChart.setTheme(chartThemes);
                            // Add the only/default plot
                            pHChart.addPlot("default", {
                                type: "MarkersOnly",
                                markers: true
                            });
                            var labelsArray = [];
                            var minlabelsArray = Math.min.apply(Math, xarray)-1;
                            var maxlabelsArray = Math.max.apply(Math, xarray)+1;
                            for (var lb = 0; lb < maxlabelsArray+1; lb++) {
                                labelsArray[lb] = {value: lb, text: ''};
                            }
                            for (var lb = 0; lb < xarray.length; lb++) {
                                labelsArray[xarray[lb]] = {value: xarray[lb], text: labeltextArray[lb]};
                            }
                            // Add axes
                            pHChart.addAxis("x", {min: minlabelsArray, max: maxlabelsArray,
                                labels: labelsArray,
                                dropLabels: false,
                                majorLabels: true,
                                minorLabels: true,
                                majorTickSpan: 1,
                                minorTickSpan: 0.25,
                                microTickSpan: 0.020833,
                                //majorTickStep: 5,
                                rotation: -90,
                                title: 'Time',
                                titleOrientation: "away"
                            });
                            pHChart.addAxis("y", {min: chartmin, max: chartmax,
                                vertical: true, fixLower: "minor", fixUpper: "major",
                                title: item.name + ' ' + item.units,
                                titleFont: "normal normal normal " + ylabelfontsize + "pt Arial"});
                            // Add the series of data
                            pHChart.addSeries(itemName, chartdatatoplot);
                            // Render the chart!
                            pHChart.render();
                            // resize the chart width,height										
                            pHChart.resize(320, 280);
                            document.getElementById('chartdatadownload').innerHTML = '<a href="downloads/indoorairdata.zip" download>\
                                                Download ' + item.name + ' data</a>';

                        }
                    });
                }
                // Create the Tree.
                var tree = new Tree({
                    model: utbiomeModel,
                    onClick: treeOnClick, // THIS LINE //
                    autoExpand: true,
                    showRoot: false,
                    openOnClick: true,
                    getDomNodeById: function(id) // new function to find DOM node
                    {
                        return this._itemNodesMap[ id ][0];
                    }
                });
                tree.placeAt(dijit.byId("description"));
            }
            

// ****************************************************************************//
// Reading data for the down stream point on waller creek
            var samplelocation ='Downstream';
            var timseriesfilename ='downstreamWallerCreek_timeseries.csv';
            WlcrksmpDown_ftLayer.on("click", displayonDownsidePanel);
            
            function displayonDownsidePanel(evnt) {
                map.graphics.clear();
                document.getElementById('chartdatadownload').innerHTML = "";
                document.getElementById('description').innerHTML = "";
                document.getElementById('description').innerHTML = "<b>"+samplelocation +" Waller Creek</b><br>";
                document.getElementById('TimeseriesChart').innerHTML = "";
                //var locationSite = evnt.graphic.attributes.FID;
                // read the json here to populate the tree
                //var storewlk = json.parse(mywlkcrktimeseriesjson);
                // Create memory store here
                var utbiomeVarStore = new Memory({
                    data: [{"id": "smpltime", "name": "Sampling Date", "type": "time"},
{"id": "TP", "name": "Time Period", "type": "timePeriod", "parent": "smpltime"},
{"id": "TP1", "name": "10/28/2013 - 11/1/2013", "type": "timePeriod", "parent": "TP"},
{"id": "waterp1", "name": "Water", "type": "sampletype", "parent": "TP1"},
{"id": "ph", "name": "pH", "units": "", "type": "Parameter", "parent": "waterp1"},
{"id": "con", "name": "Conductivity", "units": "[uS/cm^2]", "type": "Parameter", "parent": "waterp1"},
{"id": "temp", "name": "Temperature", "units": "[deg celsius]", "type": "Parameter", "parent": "waterp1"},
{"id": "DO", "name": "Dissolved Oxygen", "units": "[mg/l]", "type": "Parameter", "parent": "waterp1"},
{"id": "Nit", "name": "Nitrate", "units": "[mg/l as N-NO3-]", "type": "Parameter", "parent": "waterp1"},
{"id": "Alk", "name": "Alkalinity", "units": "[mg/l as CaCO3]", "type": "Parameter", "parent": "waterp1"},
{"id": "Tur", "name": "Turbidity", "units": "[NTUs]", "type": "Parameter", "parent": "waterp1"},
{"id": "pho", "name": "Phosphorous", "units": "[as P-PO43-]", "type": "Parameter", "parent": "waterp1"},
{"id": "enterolet", "name": "Enterococci", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp1"},
{"id": "Colilert", "name": "Total Coliforms", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp1"},
{"id": "ColilertE", "name": "E. Coli", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp1"},
{"id": "TP2", "name": "03/31/2014 - 03/31/2014", "type": "timePeriod", "parent": "TP"},
{"id": "waterp2", "name": "Water", "type": "sampleType", "parent": "TP2"},
{"id": "ph", "name": "pH", "units": "", "type": "Parameter", "parent": "waterp2"},
{"id": "con", "name": "Conductivity", "units": "[uS/cm^2]", "type": "Parameter", "parent": "waterp2"},
{"id": "temp", "name": "Temperature", "units": "[deg celsius]", "type": "Parameter", "parent": "waterp2"},
{"id": "DO", "name": "Dissolved Oxygen", "units": "[mg/L]", "type": "Parameter", "parent": "waterp2"},
{"id": "Nit", "name": "Nitrate", "units": "[mg/l as N-NO3-]", "type": "Parameter", "parent": "waterp2"},
{"id": "Alk", "name": "Alkalinity", "units": "[mg/l as CaCO3]", "type": "Parameter", "parent": "waterp2"},
{"id": "Tur", "name": "Turbidity", "units": "[NTUs]", "type": "Parameter", "parent": "waterp2"},
{"id": "pho", "name": "Phosphorous", "units": "[as P-PO43-]", "type": "Parameter", "parent": "waterp2"},
{"id": "enterolet", "name": "Enterococci", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp2"},
{"id": "Colilert", "name": "Total Coliforms", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp2"},
{"id": "ColilertE", "name": "E. Coli", "units": "MPN/100ml", "type": "Parameter", "parent": "waterp2"}],
                    getChildren: function(object) {
                        return this.query({parent: object.id});
                    }
                });
                // Create the model
                var utbiomeModel = new ObjectStoreModel({
                    store: utbiomeVarStore,
                    query: {id: 'smpltime'}
                });

                function treeOnClick(item) {
                    //item is the node's DataStore item
                    //I forgot if tree is the whole tree or just the currtent node
                    //evt is the usual event object, with things like mouse position, etc...
                    //document.getElementById('TimeseriesChart').innerHTML = item.id;
                    document.getElementById('TimeseriesChart').innerHTML = "";
                    var itemName = item.id;
                    var itemParent = item.parent;
                    var chartdata;
                    var chartmin;
                    var chartmax;
                    var ylabelfontsize = 10;
                    // read the data from the csv file
                    var dwnstrsiteData = new dojoCsvStore({url: 'data/'+timseriesfilename});
                    var phdata = [],Xlabelfortimedata=[],labeltextArraydata=[];
                    var condata=[],tempdata=[],DOdata=[],Nitdata=[],Alkdata=[],Turdata = [];
                    var phodata=[],enteroletdata=[],Colilertdata=[],ColilertEdata =[];
                    dwnstrsiteData.fetch({query: {time: itemParent},
                        onComplete: function(items) {
                            // Have to only retrieve items as per parent of the item
                            // The item parent is the time period (e.g. waterp1,waterp2..)
                            for (var i = 0; i < items.length; i++) {
                                labeltextArraydata.push(dwnstrsiteData.getValue(items[i], 'Timeperiod'));
                                phdata.push(dwnstrsiteData.getValue(items[i], 'ph'));
                                condata.push(dwnstrsiteData.getValue(items[i], 'con'));
                                tempdata.push(dwnstrsiteData.getValue(items[i], 'temp'));
                                DOdata.push(dwnstrsiteData.getValue(items[i], 'DO'));
                                Nitdata.push(dwnstrsiteData.getValue(items[i], 'Nit'));
                                Alkdata.push(dwnstrsiteData.getValue(items[i], 'Alk'));
                                Turdata.push(dwnstrsiteData.getValue(items[i], 'Tur'));
                                phodata.push(dwnstrsiteData.getValue(items[i], 'pho'));
                                enteroletdata.push(dwnstrsiteData.getValue(items[i], 'enterolet'));
                                Colilertdata.push(dwnstrsiteData.getValue(items[i], 'Colilert'));
                                ColilertEdata.push(dwnstrsiteData.getValue(items[i], 'ColilertE'));
                                Xlabelfortimedata.push(dwnstrsiteData.getValue(items[i], 'Xlabelfortime'));
                            }
                            
                            // check all the item name
                            if (itemName === 'ph')
                            {
                                chartdata = phdata;
                                chartmin = Math.min.apply(Math, chartdata)-1;
                                chartmax = Math.max.apply(Math, chartdata)+1;
                            } else if (itemName === 'con')
                            {
                                chartdata = condata;
                                chartmin = Math.min.apply(Math, chartdata)-50;
                                chartmax = Math.max.apply(Math, chartdata)+50;
                            } else if (itemName === 'temp')
                            {
                                chartdata = tempdata;
                                chartmin = Math.min.apply(Math, chartdata)-5;
                                chartmax = Math.max.apply(Math, chartdata)+5;
                            } else if (itemName === 'DO')
                            {
                                chartdata = DOdata;
                                chartmin = 0;
                                chartmax = 16;
                            } else if (itemName === 'Nit')
                            {
                                chartdata = Nitdata;
                                chartmin = 0;
                                chartmax = Math.max.apply(Math, chartdata)+0.5;
                            } else if (itemName === 'Alk')
                            {
                                chartdata = Alkdata;
                                chartmin = Math.min.apply(Math, chartdata)-50;
                                chartmax = Math.max.apply(Math, chartdata)+50;
                            } else if (itemName === 'Tur')
                            {
                                chartdata = Turdata;
                                chartmin = 0;
                                chartmax = Math.max.apply(Math, chartdata)+5;
                            } else if (itemName === 'pho')
                            {
                                chartdata = phodata;
                                chartmin = 0;
                                chartmax = Math.max.apply(Math, chartdata)+0.1;
                            } else if (itemName === 'enterolet')
                            {
                                chartdata = enteroletdata;
                                chartmin = Math.min.apply(Math, chartdata)-1;
                                chartmax = Math.max.apply(Math, chartdata)+1;
                                ylabelfontsize = 10;
                            } else if (itemName === 'Colilert')
                            {
                                chartdata = Colilertdata;
                                chartmin = Math.min.apply(Math, chartdata)-50;
                                chartmax = Math.max.apply(Math, chartdata)+50;
                                ylabelfontsize = 10;
                            } else if (itemName === 'ColilertE')
                            {
                                chartdata = ColilertEdata;
                                chartmin = Math.min.apply(Math, chartdata)-5;
                                chartmax = Math.max.apply(Math, chartdata)+5;
                                ylabelfontsize = 10;
                            }
                            // make the plot here
                            tp = dijit.byId("dashboard");
                            if (tp.attr('open', false)) {
                                tp.toggle();
                                panetoggler = 1;
                            }
                            // to scale the data properly, need to create a datacell
                            var xarray = Xlabelfortimedata; //[17, 20, 23, 26, 29, 32, 35, 38, 45, 50, 58, 62];
                            var labeltextArray = labeltextArraydata;//['8:30AM', '10:00AM', '11:30AM', '1:00PM',
                                //'2:30PM', '4:00PM', '5:30PM', '7:00PM', '10:30PM', '1:00AM', '5:00AM', '7:00AM'];
                            var chartdatatoplot = [];
                            for (var ci = 0; ci < chartdata.length; ci++) {
                                var dy = chartdata[ci];
                                var dx = xarray[ci];
                                chartdatatoplot[ci] = {x: dx, y: dy};
                            }

                            // Create the chart within it's "holding" node
                            var pHChart = new Chart2D("TimeseriesChart");
                            // Set the theme
                            pHChart.setTheme(chartThemes);
                            // Add the only/default plot
                            pHChart.addPlot("default", {
                                type: "MarkersOnly",
                                markers: true
                            });
                            var labelsArray = [];
                            var minlabelsArray = Math.min.apply(Math, xarray)-1;
                            var maxlabelsArray = Math.max.apply(Math, xarray)+1;
                            for (var lb = 0; lb < maxlabelsArray+1; lb++) {
                                labelsArray[lb] = {value: lb, text: ''};
                            }
                            for (var lb = 0; lb < xarray.length; lb++) {
                                labelsArray[xarray[lb]] = {value: xarray[lb], text: labeltextArray[lb]};
                            }
                            // Add axes
                            pHChart.addAxis("x", {min: minlabelsArray, max: maxlabelsArray,
                                labels: labelsArray,
                                dropLabels: false,
                                majorLabels: true,
                                minorLabels: true,
                                majorTickSpan: 1,
                                minorTickSpan: 0.25,
                                microTickSpan: 0.020833,
                                //majorTickStep: 5,
                                rotation: -90,
                                title: 'Time',
                                titleOrientation: "away"
                            });
                            pHChart.addAxis("y", {min: chartmin, max: chartmax,
                                vertical: true, fixLower: "minor", fixUpper: "major",
                                title: item.name + ' ' + item.units,
                                titleFont: "normal normal normal " + ylabelfontsize + "pt Arial"});
                            // Add the series of data
                            pHChart.addSeries(itemName, chartdatatoplot);
                            // Render the chart!
                            pHChart.render();
                            // resize the chart width,height										
                            pHChart.resize(320, 280);
                            document.getElementById('chartdatadownload').innerHTML = '<a href="downloads/indoorairdata.zip" download>\
                                                Download ' + item.name + ' data</a>';

                        }
                    });
                }
                // Create the Tree.
                var tree = new Tree({
                    model: utbiomeModel,
                    onClick: treeOnClick, // THIS LINE //
                    autoExpand: true,
                    showRoot: false,
                    openOnClick: true,
                    getDomNodeById: function(id) // new function to find DOM node
                    {
                        return this._itemNodesMap[ id ][0];
                    }
                });
                tree.placeAt(dijit.byId("description"));
            }

            function getAllAttributesofLayer(features) {
                var TimeStamp = new Array();
                var phArray = new Array();
                var Conductivity = new Array();
                var Temperature = new Array();
                var DO = new Array();
                var Nitr = new Array();
                var Alka = new Array();
                var Enter = new Array();
                var Coli = new Array();
                var Coli1 = new Array();
                var Turb = new Array();
                var Phosph = new Array();


                for (var x = 0; x < features.length; x++) {
                    TimeStamp[x] = features[x].attributes["Time"];
                    phArray[x] = parseFloat(features[x].attributes["pH_in_situ"]);
                    Conductivity[x] = parseFloat(features[x].attributes["Conductivi"]);
                    Temperature[x] = parseFloat(features[x].attributes["Temperatur"]);
                    DO[x] = parseFloat(features[x].attributes["Dissolved"]);
                    Nitr[x] = parseFloat(features[x].attributes["Nitrate_as"]);
                    Alka[x] = parseFloat(features[x].attributes["Alkalinity"]);
                    Enter[x] = parseFloat(features[x].attributes["Enterolert"]);
                    Coli[x] = parseFloat(features[x].attributes["Colilert_"]);
                    Coli1[x] = parseFloat(features[x].attributes["Colilert1"]);
                    Turb[x] = parseFloat(features[x].attributes["Turbidity"]);
                    Phosph[x] = parseFloat(features[x].attributes["Phosphorou"]);
                }
                //return phArray;
                //return {ph:phArray};
                return[TimeStamp, phArray, Conductivity, Temperature,
                    DO, Nitr, Alka, Enter, Coli,
                    Coli1, Turb, Phosph];
            }

        }
);