/*
 * Script to generate extended categories
 */

// Store the output in extended-cats.json

var bbva_cats = [
    {
      "code": "es_auto",
      "description": "Auto"
    },
    {
      "code": "es_barsandrestaurants",
      "description": "Bars and restaurants"
    },
    {
      "code": "es_contents",
      "description": "Books and press"
    },
    {
      "code": "es_fashion",
      "description": "Fashion"
    },
    {
      "code": "es_food",
      "description": "Food"
    },
    {
      "code": "es_health",
      "description": "Health"
    },
    {
      "code": "es_home",
      "description": "Home"
    },
    {
      "code": "es_hotelservices",
      "description": "Accommodation"
    },
    {
      "code": "es_hyper",
      "description": "Hypermarkets"
    },
    {
      "code": "es_leisure",
      "description": "Leisure"
    },
    {
      "code": "es_otherservices",
      "description": "Other services"
    },
    {
      "code": "es_propertyservices",
      "description": "Real state"
    },
    {
      "code": "es_sportsandtoys",
      "description": "Sports and toys"
    },
    {
      "code": "es_tech",
      "description": "Technology"
    },
    {
      "code": "es_transportation",
      "description": "Transport"
    },
    {
      "code": "es_travel",
      "description": "Travel"
    },
    {
      "code": "es_wellnessandbeauty",
      "description": "Wellness and beauty"
    }
];

var fb_cats = [
   { "": "es_leisure"},
   {"1103":"Actor/Director"},
   {"1105":"Movie"},
   {"1108":"Producer"},
   {"1109":"Writer"},
   {"1110":"Studio"},
   {"1111":"Movie Theater"},
   {"1112":"TV/Movie Award"},
   {"1113":"Fictional Character"},
   {"1200":"Album"},
   {"1201":"Song"},
   {"1202":"Musician/Band"},
   {"1204":"Musical Instrument"},
   {"1206":"Playlist"},
   {"1207":"Music Video"},
   {"1208":"Concert Tour"},
   {"1209":"Concert Venue"},
   {"1210":"Radio Station"},
   {"1211":"Record Label"},
   {"1212":"Music Award"},
   {"1213":"Music Chart"},
   {"1610":"Comedian"},
   {"1611":"Entertainer"},
   {"1614":"Dancer"},
   {"1400":"TV Show"},
   {"1402":"TV Network"},
   {"1404":"TV Channel"},
   {"1601":"Artist"},
   {"2227":"Movies/Music"},
   {"2508":"Arts/Entertainment/Nightlife"},
   {"2528":"Museum/Art Gallery"},

   { "": "es_contents"},
   {"1300":"Book"},
   {"1301":"Author"},
   {"1305":"Book Store"},
   {"1306":"Library"},
   {"1307":"Magazine"},
   {"1308":"Editor"},
   {"1604":"Journalist"},
   {"1605":"News Personality"},
   {"2233":"Media/News/Publishing"},

   { "": "es_food"},
   {"1606":"Chef"},
   {"2224":"Wine/Spirits"},
   {"2246":"Farming/Agriculture"},
   {"2252":"Food/Beverages"},
   {"2513":"Food/Grocery"},

   { "": "es_otherservices"},
   {"1607":"Lawyer"},
   {"1609":"Business Person"},
   {"2201":"Product/Service"},
   {"2248":"Consulting/Business Services"},
   {"2249":"Legal/Law"},
   {"2250":"Education"},
   {"2251":"Engineering/Construction"},
   {"2234":"Bank/Financial Institution"},
   {"2236":"Insurance Company"},
   {"2511":"Event Planning/Event Services"},
   {"2512":"Bank/Financial Services"},
   {"2517":"Professional Services"},
   {"2518":"Business Services"},

   { "": "es_health"},
   {"1608":"Doctor"},
   {"2243":"Health/Medical/Pharmaceuticals"},
   {"2262":"Vitamins/Supplements"},
   {"2263":"Drugs"},
   {"2514":"Health/Medical/Pharmacy"},
   {"2527":"Hospital/Clinic"},

   { "": "es_sportsandtoys"},
   {"1600":"Athlete"},
   {"1800":"Sports League"},
   {"1801":"Professional Sports Team"},
   {"1802":"Coach"},
   {"1803":"Amateur Sports Team"},
   {"1804":"School Sports Team"},
   {"2231":"Outdoor Gear/Sporting Goods"},
   {"2300":"Games/Toys"},
   {"2507":"Sports Venue"},
   {"2524":"Sports/Recreation/Activities"},

   { "": "es_auto"},
   {"2205":"Cars"},
   {"2240":"Automobiles and Parts"},
   {"2509":"Automotive"},

   { "": "es_barsandrestaurants"},
   {"1900":"Restaurant/Cafe"},
   {"2100":"Bar"},
   {"2101":"Club"},

   { "": "es_tech"},
   {"2202":"Website"},
   {"2208":"Camera/Photo"},
   {"2210":"Computers"},
   {"2211":"Software"},
   {"2213":"Electronics"},
   {"2253":"Telecommunication"},
   {"2254":"Biotechnology"},
   {"2255":"Computers/Technology"},
   {"2256":"Internet/Software"},
   {"2301":"App"},
   {"2301.1":"App page"},

   { "": "es_fashion"},
   {"2206":"Bags/Luggage"},
   {"2209":"Clothing"},
   {"2226":"Jewelry/Watches"},

   { "": "es_wellnessandbeauty"},
   {"2214":"Health/Beauty"},
   {"2510":"Spas/Beauty/Personal Care"},

   { "": "es_home"},
   {"2212":"Office Supplies"},
   {"2215":"Appliances"},
   {"2216":"Building Materials"},
   {"2217":"Commercial Equipment"},
   {"2218":"Home Decor"},
   {"2219":"Furniture"},
   {"2220":"Household Supplies"},
   {"2221":"Kitchen/Cooking"},
   {"2222":"Patio/Garden"},
   {"2223":"Tools/Equipment"},
   {"2230":"Pet Supplies"},
   {"2232":"Baby Goods/Kids Goods"},
   {"2238":"Energy/Utility"},
   {"2515":"Home Improvement"},
   {"2516":"Pet Services"},

   { "": "es_hyper"},
   {"2239":"Retail and Consumer Merchandise"},
   {"2521":"Shopping/Retail"},

   { "": "es_transportation"},
   {"2242":"Transport/Freight"},
   {"2526":"Transportation"},

   { "": "es_travel"},
   {"2258":"Travel/Leisure"},
   {"2503":"Landmark"},
   {"2505":"Transit Stop"},
   {"2506":"Airport"},
   {"2523":"Attractions/Things to Do"},
   {"2525":"Tours/Sightseeing"},

   { "": "es_hotelservices"},
   {"2501":"Hotel"},

   { "": "es_propertyservices"},
   {"2520":"Real Estate"}
]


var better_cats = [];
var aux = {};
for (var i = 0; i < fb_cats.length; i++) {
    if (fb_cats[i]['']) {
        if (aux.id) {
            better_cats.push(aux);
            aux = {};
        }
        aux.id = fb_cats[i][''];
        for (var j = 0; j < bbva_cats.length; j++) {
            if (bbva_cats[j].code === aux.id) {
                aux.name = bbva_cats[j].description;
            }
        }
        aux.fb_cats = [];
    } else {
        for (var j in fb_cats[i]) {
            aux.fb_cats.push(fb_cats[i][j].toLowerCase());
        }
    }
}
better_cats.push(aux);
console.log(JSON.stringify(better_cats, null, 4));
