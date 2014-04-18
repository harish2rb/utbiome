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
				"dojox/image/LightboxNano",
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
						Tree,
						ComboBox,
						dom,
						domConstruct,
						ready, registry, dojoquery, on,Button,
						lang, fx)
						{
							parser.parse();
							
							// load biome spheres
							var myButton = new Button({
								label: "Home",
								onClick: function(){
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
							var prtsOfcampusContent = "Forty Acres Sampling regions"+
							                          "<br><b>Name</b>: ${Name}";
							prtsOfcampus = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/6";
							var prtCampus_ftLayer = new FeatureLayer(prtsOfcampus,{
								infoTemplate: new InfoTemplate("Region: ${Name}",prtsOfcampusContent),
								outFields: ["FID","Name"]
							});
							map.addLayer(prtCampus_ftLayer);
							
							// adding the feature waller creek layer
							wlcrkOfcampus = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/3";
							var wlcrk_ftLayer = new FeatureLayer(wlcrkOfcampus,{
								infoTemplate: new InfoTemplate("Creek: ${STREAM}", "${STREAM}"),
								outFields: ["FID","STREAM","LENGTH_FEE"]
							});
							map.addLayer(wlcrk_ftLayer);
							
							// defining the feature waller creek sampling points layers
							// we have two sampling points(upstream and downstream)
							// Downstream
							// Upstream
							var wlcrkDownstrmpopcontent = '<div id="popwrapper">\
																<table width="100%"><tr>\
																<td><b>Outdoor sampling site</b></td>\
																<td align="center"><a href="downloads/timseriescsvWlrkcreek.zip" download>\
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
															</div>'
							wlcrkDownSamplePts = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/1";
							var WlcrksmpDown_ftLayer = new FeatureLayer(wlcrkDownSamplePts,{
								infoTemplate: new InfoTemplate("Station: Downstream, Waller Creek", wlcrkDownstrmpopcontent),
								outFields: ["Time","pH_in_situ", "Conductivi", "Temperatur",
								"Dissolved","Nitrate_as","Alkalinity","Enterolert","Colilert_","Colilert1","Turbidity",
								"Phosphorou"]
							});
							map.addLayer(WlcrksmpDown_ftLayer);
							
							// Upstream
							var wlcrkUpstrmpopcontent = '<div id="popwrapper">\
																<table width="100%"><tr>\
																<td><b>Outdoor sampling site</b></td>\
																<td align="center"><a href="downloads/timseriescsvWlrkcreek.zip" download>\
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
															</div>'
							wlcrkUpSamplePts = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/2";
							var WlcrksmpUP_ftLayer = new FeatureLayer(wlcrkUpSamplePts,{
								infoTemplate: new InfoTemplate("Station: Upstream, Waller Creek", wlcrkUpstrmpopcontent),
								outFields: ["Time","pH_in_situ", "Conductivi", "Temperatur",
								"Dissolved","Nitrate_as","Alkalinity","Enterolert","Colilert_","Colilert1","Turbidity",
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
							var bldgCampus_ftLayer = new FeatureLayer(bldgOfcampus,{
								infoTemplate: new InfoTemplate("Building: ${RefName}", bldgOfcampusContent),
								outFields: ["FID","RefName"]
							});
							map.addLayer(bldgCampus_ftLayer);
							
							// BME and Battle Hall layers
							var bmeAndBattleHallTemplate = new InfoTemplate();
							bmeAndBattleHallTemplate.setContent(getbmeBattleHallpopcontent);
							bmeAndBattleHallOfcampus = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/10";
							var bmeAndBattleHallCampus_ftLayer = new FeatureLayer(bmeAndBattleHallOfcampus,{
								infoTemplate: bmeAndBattleHallTemplate,
								outFields: ["FID","RefName"]
							});
							map.addLayer(bmeAndBattleHallCampus_ftLayer);
							function getbmeBattleHallpopcontent(graphic){
								var BuildingName = graphic.attributes.RefName;
								bmeAndBattleHallTemplate.setTitle('<b>Building: '+BuildingName+'</b>');
								var bmeAndBattleHallContent = '<div id="popwrapper">\
																<table width="100%"><tr>\
																<td><b>Indoor/Outdoor sampling site</b></td>\
																<td align="center"><a href="downloads/indoorairdata.zip" download>\
																<img id="downloadicon" src="images/BlueDownloadicon.png" height="48" width="48" /></a></td><tr>\
																</table>\
																<hr>\
																<div id="popleftcolumn">\
																	<b>Name </b>'+BuildingName+' Building\
																	<hr>The samples were collected by students\
																	<br>of class CE369: Air pollution Engr\
																</div>\
																<div id="poprightcolumn">\
																	<img id="bldgpic" src="images/cpe1_picstitch_thumbnail.jpg" height="100" width="100" />\
																</div>\
															</div>';
								return bmeAndBattleHallContent;
							}
							
							
							
							// adding the CPE Room layer
							CPERoomOfcampus = "http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/4";
							var CPEroom_ftLayer = new FeatureLayer(CPERoomOfcampus,{
								infoTemplate: new InfoTemplate("Building: ${Name}", "${*}"),
								outFields: ["FID","Name"]
							});
							map.addLayer(CPEroom_ftLayer);
							
							// adding the cross sections layer
							var wlkcrkCrossTemplate = new InfoTemplate();
							wlkcrkCrossTemplate.setTitle("<b>Outdoor crosssection site</b>");
							wlkcrkCrossTemplate.setContent(getwlcrkCrosspopcontent);
							
							wlk_crosssections ="http://crwr-utbiome.austin.utexas.edu/arcgis/rest/services/utbiome/UtbiomeMapservice/Mapserver/8"
							var wlkCrossSections_ftLayer = new FeatureLayer(wlk_crosssections,{
								infoTemplate: wlkcrkCrossTemplate,
								outFields: ["FID","Name","Biome","ph_in_situ","conductivi","Temperatur","Nitrate","Alkalinity",
								"Enterolert","Colitert","colitert1","Turbidity","Phosphorou"]
							});
							map.addLayer(wlkCrossSections_ftLayer);
							
							//wlkCrossSections_ftLayer.on("click", displayCrossInfoExploreTab);
							
							function getwlcrkCrosspopcontent(graphic){
								var pt = esri.geometry.webMercatorToGeographic(graphic.geometry);
							    var lati = pt.y.toFixed(3);
								var longi = pt.x.toFixed(3);
								var fidnum = graphic.attributes.FID;
								var wlcrkCrosspopcontent = '<div id="popwrapper">\
																<table width="100%"><tr>\
																<td><b>Outdoor cross section sampling site</b></td>\
																<td align="center"><a href="downloads/timseriescsvWlrkcreek.zip" download>\
																<img id="downloadicon" src="images/BlueDownloadicon.png" height="48" width="48" /></a></td><tr>\
																</table>\
																<hr>\
																<div id="popleftcolumn">\
																	<b>Latitude:</b> '+lati+'&deg;\
																	<br><b>Longitude:</b>'+longi+'&deg;\
																	<hr>The samples were collected by graduate students\
																	\
																</div>\
																<div id="poprightcolumn">\
																	<img id="st1pic" src="images/crossectionsPics/crossections_'+fidnum+'_thumbnail.jpg" height="100" width="100" />\
																</div>\
															</div>'
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
							var biomeSpheres_ftLayer = new FeatureLayer(biomeSpheresOfcampus,{
								infoTemplate: new InfoTemplate("BiomeSphere ${Name}", biomeSpherespopContent),
								outFields: ["FID","Name"]
							});
							var myButton = new Button({
								label: "What's Interesting",
								onClick: function(){
									// Do something:
									map.addLayer(biomeSpheres_ftLayer);
									//dom.byId("description").innerHTML += "Thank you! ";
								}
							}, "BiomeSphereButtonNode");
							
							// For all the Images in the Image gallery show a location on map when on mouse
							var image1 = document.getElementById('theImg1');
							var image1Location = [[-97.73408, 30.2883]];
							image1.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image1Location);
							}							
							image1.onmouseout = function(){map.graphics.clear();}
							var image2 = document.getElementById('theImg2');
							var image2Location = [[-97.73401, 30.2883]];
							image2.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image2Location);
							}
							image2.onmouseout = function(){map.graphics.clear();}
							var image3 = document.getElementById('theImg3');
							var image3Location = [[-97.73401, 30.2886]];
							image3.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image3Location);
							}
							image3.onmouseout = function(){map.graphics.clear();}
							var image4 = document.getElementById('theImg4');
							var image4Location = [[-97.73401, 30.2883]];
							image4.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image4Location);
							}
							image4.onmouseout = function(){map.graphics.clear();}
							var image5 = document.getElementById('theImg5');
							var image5Location = [[-97.73489, 30.28040]];
							image5.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image5Location);
							}
							image5.onmouseout = function(){map.graphics.clear();}
							var image6 = document.getElementById('theImg6');
							var image6Location = [[-97.73489, 30.28044]];
							image6.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image6Location);
							}
							image6.onmouseout = function(){map.graphics.clear();}
							var image7 = document.getElementById('theImg7');
							var image7Location = [[-97.73442, 30.28081]];
							image7.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image7Location);
							}
							image7.onmouseout = function(){map.graphics.clear();}
							var image8 = document.getElementById('theImg8');
							var image8Location = [[-97.73438, 30.28081]];
							image8.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image8Location);
							}
							image8.onmouseout = function(){map.graphics.clear();}
							var image9 = document.getElementById('theImg9');
							var image9Location = [[-97.73608, 30.29070]];
							image9.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image9Location);
							}
							image9.onmouseout = function(){map.graphics.clear();}
							var image10 = document.getElementById('theImg10');
							var image10Location = [[-97.73575, 30.29070]];
							image10.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image10Location);
							}
							image10.onmouseout = function(){map.graphics.clear();}
							var image11 = document.getElementById('theImg11');
							var image11Location = [[-97.73595, 30.29070]];
							image11.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image11Location);
							}
							image11.onmouseout = function(){map.graphics.clear();}
							var image12 = document.getElementById('theImg12');
							var image12Location = [[-97.73600, 30.29070]];
							image12.onmouseover = function(){
								map.graphics.clear();
								displayImageLocationOnMap(image12Location);
							}
							image12.onmouseout = function(){map.graphics.clear();}
							
							
							function displayImageLocationOnMap(imageLocation){
								var iconPath = "M9.5,3v10c8,0,8,4,16,4V7C17.5,7,17.5,3,9.5,3z M6.5,29h2V3h-2V29z";
								var initColor = "#FF3300";
								arrayUtils.forEach(imageLocation, function(point) {
										var graphic = new Graphic(new Point(point), createSymbol(iconPath, initColor));
										map.graphics.add(graphic);										
									});
								function createSymbol(path, color){
									  var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
									  markerSymbol.setPath(path);
									  markerSymbol.setColor(new dojo.Color(color));
									  markerSymbol.setOutline(null);
									  markerSymbol.setSize("32");
									  return markerSymbol;
								};
							}
							
							
							// Populate the Explore tab
							biomeSpheres_ftLayer.on("click", displayonpartExploreTab);
							function displayonpartExploreTab(evt){
								map.graphics.clear();
								document.getElementById('chartdatadownload').innerHTML ="";
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
											 </ul>'
								if(id==6){
								document.getElementById('description').innerHTML = blurbid6;
								}
							}
							
							
							// Display the tree node for data digging
							bldgCampus_ftLayer.on("click", displayTree);
							function displayTree(evnt){
								map.graphics.clear();
								document.getElementById('chartdatadownload').innerHTML ="";
								document.getElementById('TimeseriesChart').innerHTML = "";
								var id = evnt.graphic.attributes.FID;
								var prtName = evnt.graphic.attributes.RefName;
								document.getElementById('description').innerHTML = prtName;
								// Make the tree here
								// Create memory store here
								var utbiomeVarStore = new Memory({
									data: [{ id: 'smpltime', name:'Sampling Date', type:'time'},
											{ id: 'TP', name:' Single Time Period', type:'timePeriod', parent: 'smpltime'},
												{ id: 'TP1', name:'11/19/2013', type:'timePeriod', parent: 'TP' },
													{ id: 'Indoor', name:'Indoor', type:'location', parent: 'TP1' },
														{ id: 'in_air', name:'Air', type:'sampleType', parent: 'Indoor' },
															{ id: 'in_air_Rh', name:'Relative Humidity',units:'[%]', type:'parameter', parent: 'in_air' },
															{ id: 'in_air_Temp', name:'Temperature',units:'[deg celsius]', type:'parameter', parent: 'in_air' },
															{ id: 'in_air_buttonsampler', name:'Button Sampler',units:'[NTUs]', type:'parameter', parent: 'in_air' },
														{ id: 'in_surface', name:'Surface', type:'sampleType', parent: 'Indoor' },
															{ id: 'in_surface_wipes', name:'Wipes', type:'sampleType', parent: 'in_surface' },
															{ id: 'in_surface_swab', name:'Swabs', type:'sampleType', parent: 'in_surface' },
													{ id: 'Outdoor', name:'Outdoor', type:'location', parent: 'TP1' },
														{ id: 'out_air', name:'Air', type:'sampleType', parent: 'Outdoor' },
															{ id: 'out_air_Rh', name:'Relative Humidity',units:'[%]', type:'parameter', parent: 'out_air' },
															{ id: 'out_air_Temp', name:'Temperature',units:'[deg celsius]', type:'parameter', parent: 'out_air' },
															{ id: 'out_air_buttonsampler', name:'Button Sampler',units:'[NTUs]', type:'parameter', parent: 'out_air' },
														{ id: 'out_surface', name:'Surface', type:'sampleType', parent: 'Outdoor' },
															{ id: 'out_surface_wipes', name:'Wipes', type:'sampleType', parent: 'out_surface' },
															{ id: 'out_surface_swab', name:'Swabs', type:'sampleType', parent: 'out_surface' }
													
										],
										getChildren: function(object){
										return this.query({parent: object.id});
										}
								});
								// Create the model
								var utbiomeModel = new ObjectStoreModel({
									store: utbiomeVarStore,
									query: {id: 'smpltime'}
								});
								
								//
								function treeOnClickOpenDialog(item, tree, evt){
										//item is the node's DataStore item
										//will create a dialog for the air sampling
										var itemid = item.id;
										// create the dialog if itemName is Dust or surface:
										// Create the chart within it's "holding" node
										// check for title pane
										document.getElementById('TimeseriesChart').innerHTML = "";
										document.getElementById('chartdatadownload').innerHTML ='';
										tp = dijit.byId("dashboard");
										if (tp.attr('open',true)){
										tp.toggle();
										}
										// for each item in the tree we will get the graph and show a dialog
										if (itemid =='in_air_Rh')
										{
											descripHtml = '<img src="images/Airstudy/IndoorAirRH.png" height="300" width="500">';
											dialogTitle = item.name;
										}else if (itemid =='in_air_Temp')
										{
											descripHtml = '<img src="images/Airstudy/IndoorAirTemperature.png" height="300" width="500">';											
											dialogTitle = item.name;
										}else if (itemid =='in_air_buttonsampler')
										{
											descripHtml = '<img src="images/Airstudy/IndoorAirButtonsampler.png" height="300" width="500">';											
											dialogTitle = item.name;
										}else if (itemid =='out_air_Rh')
										{
											descripHtml = '<img src="images/Airstudy/OutdoorAirRH.png" height="300" width="500">';
											dialogTitle = item.name;
										} else if (itemid =='out_air_Temp')
										{
											descripHtml = '<img src="images/Airstudy/OutdoorAirTemperature.png" height="300" width="500">';											
											dialogTitle = item.name;
										} else if(itemid =='in_surface_wipes')
										{
											descripHtml0 = '<img id="myImg" src="images/Airstudy/IndoorWipesRHTempStacked.png" height="250" width="500"></a>';
											descripHtml1 = '<img id="myImg" src="images/Airstudy/DesksurfaceWipe.png" height="300" width="500">';
											descripHtml = descripHtml1+'<hr>'+descripHtml0;											
											dialogTitle = item.name;
										} else if(itemid =='in_surface_swab')
										{
											descripHtml = '<img id="myImg" src="images/Airstudy/IndoorSwabsRHTempStacked.png" height="300" width="500">';
											dialogTitle = item.name;
										} else if(itemid =='out_air_buttonsampler')
										{
											descripHtml = '<img id="myImg" src="images/Airstudy/outdoorAirButtonSampler.png" height="300" width="500">';
											dialogTitle = item.name;
										} else if(itemid =='out_surface_wipes')
										{
											descripHtml = '<img id="myImg" src="images/Airstudy/FloorsurfaceWipe.png" height="300" width="500">';
											dialogTitle = item.name;
										} else if(itemid =='out_surface_swab')
										{
											descripHtml0 = '<img id="myImg" src="images/Airstudy/OutdoorSurfaceSwabRHTemp.png" height="220" width="500"></a>';
											descripHtml1 = '<img id="myImg" src="images/Airstudy/OutdoorSurfaceSwabParticleCount.png" height="300" width="500">';
											descripHtml = descripHtml1+'<hr>'+descripHtml0;
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
									getDomNodeById: function( id ) // new function to find DOM node
									{
										return this._itemNodesMap[ id ][0];
									}
								});
								tree.placeAt(dijit.byId("description"));
								//tree.startup();
							}
							
							// Lets query the features and show them in the panel click
							prtCampus_ftLayer.on("click", displayonpartCampussidePanel);							
							function displayonpartCampussidePanel(evnt){
								map.graphics.clear();
								document.getElementById('chartdatadownload').innerHTML ="";
								document.getElementById('TimeseriesChart').innerHTML = "";
								var id = evnt.graphic.attributes.FID;
								var prtName = evnt.graphic.attributes.Name;
								if (id ==0)
								{   
									descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/erwin.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = prtName + descripHtml;
								} else if (id ==1)
								{
									descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/admin.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = prtName + descripHtml;
								} else if (id ==2)
								{
									descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/facilities.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = prtName + descripHtml;
								} else if (id ==3)
								{
									descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/lbj.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = prtName + descripHtml;
								} else if (id ==4)
								{
									descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/disch.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = prtName + descripHtml;
								} else if (id ==5)
								{
									descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/stadium.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = prtName + descripHtml;
								} else if (id ==6)
								{
									descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/law.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = prtName + descripHtml;
								} else if (id ==7)
								{
									descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/eastmall.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = prtName + descripHtml;
								} else if (id ==8)
								{
									descripHtml = '<img src="http://www.utexas.edu/maps/main/buildings/graphics/insets/cpe_inset.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = prtName + descripHtml;
								} else if (id ==9)
								{
									descripHtml = '<img src="http://www.utexas.edu/maps/main/buildings/graphics/insets/btl_inset.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = prtName + descripHtml;
								} else if (id ==10)
								{
									descripHtml = '<img src="http://www.utexas.edu/maps/main/buildings/graphics/insets/bme_inset.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = prtName + descripHtml;
								} else if (id ==11)
								{
									descripHtml = '<img src="http://www.utexas.edu/maps/main/areas/graphics/pcl.gif" height="255" width="255">';
									document.getElementById('description').innerHTML = 'Perry-Castaneda Library' + descripHtml;
								}
							}
							
							
							// Query the timeseries of Waller creek sampling points here
							WlcrksmpUP_ftLayer.on("click", displayUPonsidePanel);
							WlcrksmpDown_ftLayer.on("click", displayonDownsidePanel);
							
							function displayUPonsidePanel(evnt){
								map.graphics.clear();
								document.getElementById('chartdatadownload').innerHTML ="";
								document.getElementById('description').innerHTML = "";
								document.getElementById('TimeseriesChart').innerHTML = "";
								document.getElementById('description').innerHTML = "<b>Upstream Waller Creek</b><br>";
								var query = new Query();
								query.returnGeometry = true;
								query.outFields = [ "*" ];
								query.where = "1=1";
								WlcrksmpUP_ftLayer.queryFeatures(query, collectTimeSeriesUP);							
							}
							
							function collectTimeSeriesUP(response){
								var feature;
								var features = response.features;
								var inBuffer = [];
								for (var i = 0; i < features.length; i++) {
									feature = features[i];
									inBuffer.push(feature.attributes[WlcrksmpUP_ftLayer.objectIdField]);									
								}
								var query = new Query();
								query.objectIds = inBuffer;
								WlcrksmpUP_ftLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(results){
									totalAttr = getAllAttributesofLayer(results);
									charttimedata = totalAttr[0];
									chartpHData = totalAttr[1];
									chartCondData= totalAttr[2];
									chartTempData = totalAttr[3];
									chartDOData= totalAttr[4];
									chartNitrData= totalAttr[5];
									chartAlkData= totalAttr[6];
									chartEnterData= totalAttr[7];
									chartColilertData= totalAttr[8];
									chartColilert1Data= totalAttr[9];
									chartTurbidityData= totalAttr[10];
									chartPhosData= totalAttr[11];
									
									// Make the tree here
									// Create memory store here
									var utbiomeVarStore = new Memory({
										data: [{ id: 'smpltime', name:'Sampling Date', type:'time'},
												{ id: 'TP', name:'Time Period', type:'timePeriod', parent: 'smpltime'},
													{ id: 'TP1', name:'10/28/2013 - 11/1/2013', type:'timePeriod', parent: 'TP' },
														{ id: 'bioflm', name:'Biofilm', type:'sampleType', parent: 'TP1' },																
														{ id: 'water', name:'Water', type:'sampleType', parent: 'TP1' },
																{ id: 'ph', name:'pH',units:'', type:'Parameter', parent: 'water' },
																{ id: 'con', name:'Conductivity',units:'[uS/cm^2]', type:'Parameter', parent: 'water' },
																{ id: 'temp', name:'Temperature',units:'[deg celsius]', type:'Parameter', parent: 'water' },
																{ id: 'DO', name:'Dissolved Oxygen',units:'[mg/L]', type:'Parameter', parent: 'water' },
																{ id: 'Nit', name:'Nitrate',units:'[as N-NO3-]', type:'Parameter', parent: 'water' },
																{ id: 'Alk', name:'Alkalinity',units:'[mg/l as CaCO3]', type:'Parameter', parent: 'water' },
																{ id: 'Tur', name:'Turbidity',units:'[NTUs]', type:'Parameter', parent: 'water' },
																{ id: 'pho', name:'Phosphorous',units:'[as P-PO43-]', type:'Parameter', parent: 'water' },
																{ id: 'enterolet', name:'Enterolert: Enterococci',units:'MPN', type:'Parameter', parent: 'water' },
																{ id: 'Colilert', name:'Colilert: Total Coliforms',units:'MPN', type:'Parameter', parent: 'water' },
																{ id: 'ColilertE', name:'Colilert: E.',units:'MPN', type:'Parameter', parent: 'water' }	,													
													{ id: 'TP2', name:'03/31/2014 - 03/31/2014', type:'timePeriod', parent: 'TP' }
												],
											getChildren: function(object){
											return this.query({parent: object.id});
											}
									});
									// Create the model
									var utbiomeModel = new ObjectStoreModel({
										store: utbiomeVarStore,
										query: {id: 'smpltime'}
									});
									
									function treeOnClick(item, tree, evt){
										//item is the node's DataStore item
										//I forgot if tree is the whole tree or just the currtent node
										//evt is the usual event object, with things like mouse position, etc...
										var itemName = item.id;
										var chartdata;
										var chartmin;
										var chartmax;
										if (itemName == 'ph')
										{   chartdata = chartpHData;
											chartmin = 6;
											chartmax = 9;
										} else if (itemName =='con')
										{   chartdata = chartCondData;
											chartmin = 700;
											chartmax = 900;										
										} else if (itemName =='temp')
										{   chartdata = chartTempData;
											chartmin = 15;
											chartmax = 25;										
										} else if (itemName =='DO')
										{   chartdata = chartDOData;
											chartmin = 4;
											chartmax = 9;
										} else if (itemName =='Nit')
										{   chartdata = chartNitrData;
											chartmin = 0;
											chartmax = 1;											
										} else if (itemName =='Alk')
										{   chartdata = chartAlkData;
											chartmin = 100;
											chartmax = 300;											
										} else if (itemName =='Tur')
										{   chartdata = chartTurbidityData;
											chartmin = 0;
											chartmax = 5;										
										} else if (itemName =='pho')
										{   chartdata = chartPhosData;
											chartmin = 0;
											chartmax = 0.5;											
										} else if (itemName =='enterolet')
										{   chartdata = chartEnterData;
											chartmin = 0;
											chartmax = 60;											
										} else if (itemName =='Colilert')
										{   chartdata = chartColilertData;
											chartmin = 30;
											chartmax = 1600;											
										} else if (itemName =='ColilertE')
										{   chartdata = chartColilert1Data;
											chartmin = 0;
											chartmax = 50;											
										}
										
										// Create the chart within it's "holding" node
										// check for title pane
										document.getElementById('TimeseriesChart').innerHTML = "";
										tp = dijit.byId("dashboard");
										if (tp.attr('open',false)){
										tp.toggle();
										panetoggler = 1;
										}
										var pHChart = new Chart2D("TimeseriesChart");
										// Set the theme
										pHChart.setTheme(chartThemes);
										// Add the only/default plot
										pHChart.addPlot("default", {
											type: "Lines",
											markers: true
										});
										// Add axes
										pHChart.addAxis("x",{
											labels: [{value: 1, text: "8:30AM"}, {value: 2, text: "10:00AM"},
													{value: 3, text: "11:30AM"}, {value: 4, text: "1:00PM"},
													{value: 5, text: "2:30PM"},  {value: 6, text: "4:00PM"},
													{value: 7, text: "5:30PM"},  {value: 8, text: "7:00PM"},
													{value: 9, text: "10:30PM"}, {value: 10, text: "1:00AM"},
													{value: 11, text: "5:00AM"}, {value: 12, text: "7:00AM"},
													{value: 13, text: "11/1/2013 4:30PM"},{value: 14, text: "11/1/2013 4:10PM"}],
													dropLabels: false,
													mmajorTickStep: 5,
													rotation: -90
										});
										pHChart.addAxis("y", {min: chartmin, max: chartmax, vertical: true, fixLower: "minor", fixUpper: "major", 
										title: item.name+' '+item.units});
										// Add the series of data
										pHChart.addSeries(itemName,chartdata);
										// Render the chart!
										pHChart.render();
                                        // resize the chart width,height										
										pHChart.resize(320, 220);
										document.getElementById('chartdatadownload').innerHTML = '<a href="downloads/indoorairdata.zip" download>\
																Download '+item.name+' data</a>';
									}
									
									// Create the Tree.
									var tree = new Tree({
										model: utbiomeModel,
										onClick: treeOnClick, // THIS LINE //
										autoExpand: true,
										showRoot: false,
										openOnClick: true,
										getDomNodeById: function( id ) // new function to find DOM node
										{
											return this._itemNodesMap[ id ][0];
										}
									});
									tree.placeAt(dijit.byId("description"));
									
								  });
							}
							
							
							function displayonDownsidePanel(evnt){
							map.graphics.clear();
							document.getElementById('chartdatadownload').innerHTML ="";
							document.getElementById('description').innerHTML = "";
							document.getElementById('description').innerHTML = "<b>Downstream Waller Creek</b><br>";
							document.getElementById('TimeseriesChart').innerHTML = "";
							var query = new Query();
							query.returnGeometry = true;
							query.outFields = [ "*" ];
							query.where = "1=1";
							WlcrksmpDown_ftLayer.queryFeatures(query, collectTimeSeriesDown);							
							}
							
							function collectTimeSeriesDown(response){
								var feature;
								var features = response.features;
								var inBuffer = [];
								for (var i = 0; i < features.length; i++) {
									feature = features[i];
									inBuffer.push(feature.attributes[WlcrksmpDown_ftLayer.objectIdField]);									
								}
								var query = new Query();
								query.objectIds = inBuffer;
								WlcrksmpDown_ftLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(results){
									totalAttr = getAllAttributesofLayer(results);
									charttimedata = totalAttr[0];
									chartpHData = totalAttr[1];
									chartCondData= totalAttr[2];
									chartTempData = totalAttr[3];
									chartDOData= totalAttr[4];
									chartNitrData= totalAttr[5];
									chartAlkData= totalAttr[6];
									chartEnterData= totalAttr[7];
									chartColilertData= totalAttr[8];
									chartColilert1Data= totalAttr[9];
									chartTurbidityData= totalAttr[10];
									chartPhosData= totalAttr[11];
									// Make the tree here
									// Create memory store here
									var utbiomeVarStore = new Memory({
										data: [{ id: 'smpltime', name:'Sampling Date', type:'time'},
												{ id: 'TP', name:'Time Period', type:'timePeriod', parent: 'smpltime'},
													{ id: 'TP1', name:'10/28/2013 - 11/1/2013', type:'timePeriod', parent: 'TP' },
														{ id: 'bioflm', name:'Biofilm', type:'sampleType', parent: 'TP1' },																
														{ id: 'water', name:'Water', type:'sampleType', parent: 'TP1' },
																{ id: 'ph', name:'pH',units:'', type:'Parameter', parent: 'water' },
																{ id: 'con', name:'Conductivity',units:'[uS/cm^2]', type:'Parameter', parent: 'water' },
																{ id: 'temp', name:'Temperature',units:'[deg celsius]', type:'Parameter', parent: 'water' },
																{ id: 'DO', name:'Dissolved Oxygen',units:'[mg/L]', type:'Parameter', parent: 'water' },
																{ id: 'Nit', name:'Nitrate',units:'[as N-NO3-]', type:'Parameter', parent: 'water' },
																{ id: 'Alk', name:'Alkalinity',units:'[mg/l as CaCO3]', type:'Parameter', parent: 'water' },
																{ id: 'Tur', name:'Turbidity',units:'[NTUs]', type:'Parameter', parent: 'water' },
																{ id: 'pho', name:'Phosphorous',units:'[as P-PO43-]', type:'Parameter', parent: 'water' },
																{ id: 'enterolet', name:'Enterolert: Enterococci',units:'MPN', type:'Parameter', parent: 'water' },
																{ id: 'Colilert', name:'Colilert: Total Coliforms',units:'MPN', type:'Parameter', parent: 'water' },
																{ id: 'ColilertE', name:'Colilert: E.',units:'MPN', type:'Parameter', parent: 'water' }	,													
													{ id: 'TP2', name:'03/31/2014 - 03/31/2014', type:'timePeriod', parent: 'TP' }
											],
											getChildren: function(object){
											return this.query({parent: object.id});
											}
									});
									// Create the model
									var utbiomeModel = new ObjectStoreModel({
										store: utbiomeVarStore,
										query: {id: 'smpltime'}
									});
									
									function treeOnClick(item, tree, evt){
										//item is the node's DataStore item
										//I forgot if tree is the whole tree or just the currtent node
										//evt is the usual event object, with things like mouse position, etc...
										//document.getElementById('TimeseriesChart').innerHTML = item.id;
										document.getElementById('TimeseriesChart').innerHTML = "";
										var itemName = item.id;
										var chartdata;
										var chartmin;
										var chartmax;
										if (itemName == 'ph')
										{   chartdata = chartpHData;
											chartmin = 6;
											chartmax = 9;
										} else if (itemName =='con')
										{   chartdata = chartCondData;
											chartmin = 500;
											chartmax = 900;										
										} else if (itemName =='temp')
										{   chartdata = chartTempData;
											chartmin = 15;
											chartmax = 25;										
										} else if (itemName =='DO')
										{   chartdata = chartDOData;
											chartmin = 4;
											chartmax = 9;
										} else if (itemName =='Nit')
										{   chartdata = chartNitrData;
											chartmin = 0;
											chartmax = 0.5;											
										} else if (itemName =='Alk')
										{   chartdata = chartAlkData;
											chartmin = 100;
											chartmax = 300;											
										} else if (itemName =='Tur')
										{   chartdata = chartTurbidityData;
											chartmin = 0;
											chartmax = 5;										
										} else if (itemName =='pho')
										{   chartdata = chartPhosData;
											chartmin = 0;
											chartmax = 0.5;											
										} else if (itemName =='enterolet')
										{   chartdata = chartEnterData;
											chartmin = 0;
											chartmax = 60;											
										} else if (itemName =='Colilert')
										{   chartdata = chartColilertData;
											chartmin = 30;
											chartmax = 1600;											
										} else if (itemName =='ColilertE')
										{   chartdata = chartColilert1Data;
											chartmin = 0;
											chartmax = 95;											
										}
										
										tp = dijit.byId("dashboard");
										if (tp.attr('open',false)){
										tp.toggle();
										panetoggler = 1;
										}
										// Create the chart within it's "holding" node
										var pHChart = new Chart2D("TimeseriesChart");
										// Set the theme
										pHChart.setTheme(chartThemes);
										// Add the only/default plot
										pHChart.addPlot("default", {
											type: "Lines",
											markers: true
										});
										// Add axes
										pHChart.addAxis("x",{
											labels: [{value: 1, text: "8:30AM"}, {value: 2, text: "10:00AM"},
													{value: 3, text: "11:30AM"}, {value: 4, text: "1:00PM"},
													{value: 5, text: "2:30PM"},  {value: 6, text: "4:00PM"},
													{value: 7, text: "5:30PM"},  {value: 8, text: "7:00PM"},
													{value: 9, text: "10:30PM"}, {value: 10, text: "1:00AM"},
													{value: 11, text: "5:00AM"}, {value: 12, text: "7:00AM"},
													{value: 13, text: "11/1/2013 5:00PM"}],
													dropLabels: false,
													mmajorTickStep: 5,
													rotation: -90
										});
										pHChart.addAxis("y", {min: chartmin, max: chartmax, vertical: true, fixLower: "minor", fixUpper: "major",
										title: item.name+' '+item.units});
										// Add the series of data
										pHChart.addSeries(itemName,chartdata);
										// Render the chart!
										pHChart.render();
										// resize the chart width,height										
										pHChart.resize(320, 220);
										document.getElementById('chartdatadownload').innerHTML = '<a href="downloads/indoorairdata.zip" download>\
																Download '+item.name+' data</a>';
									}
									
									// Create the Tree.
									var tree = new Tree({
										model: utbiomeModel,
										onClick: treeOnClick, // THIS LINE //
										autoExpand: true,
										showRoot: false,
										openOnClick: true,
										getDomNodeById: function( id ) // new function to find DOM node
										{
											return this._itemNodesMap[ id ][0];
										}
									});
									tree.placeAt(dijit.byId("description"));
								  });								    
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
								  return[TimeStamp,phArray,Conductivity,Temperature,
								         DO,Nitr,Alka,Enter,Coli,
								         Coli1,Turb,Phosph];								 
							}
							
						}
			);