var table;

// will hold information from the table
var q1PreCovidFreq = {};
var q1PostCovidFreq = {};
var q2PreCovidFreq = {};
var q2PostCovidFreq = {};

// store objects which are used to display/move logos
var q1ObjArr = [];
var q2ObjArr = [];

// number of entries in the csv file
var numOfResponses;

// for logos
var fbLogo;
var instaLogo;
var discordLogo;
var emailLogo;
var groupmeLogo;
var imessageLogo;
var linkedinLogo;
var messengerLogo;
var piazzaLogo;
var pinterestLogo;
var redditLogo;
var slackLogo;
var snapLogo;
var telegramLogo;
var tiktokLogo;
var tumblrLogo;
var twitchLogo;
var twitterLogo;
var viberLogo;
var vkLogo;
var wechatLogo;
var whatsappLogo;
var youtubeLogo;
var zoomLogo;
var edmoroLogo;
var skypeLogo;
var googleclassLogo;
var googlemeetLogo;
var microsoftteamLogo;

// button for switching between size of logos based on frequency before and after covid
// the size doesn't change by a lot for most logos
var prePostCovidBtn;

// button to sort the logos based on frequency ( popularity )
var sortBtn;

// bool indicating whether displayed size should be before or after covid
var preCovid;

// bool indicating whether logos should be sorted or moving
var sort;

// stores images based on name of social media
var logoDictionary = {};

// switch between showing information about social media usage and platforms for class/work related communication
var selectQuestion;

// text displaying "click on icon..."
var clickText;

// get images
function preload() {

  table = loadTable ( 'assets/acc-hw4-responses.csv','csv','header' );

  fbLogo = loadImage ( 'logos/fbLogo.png' );
  instaLogo = loadImage ( 'logos/instaLogo.webp' );
  discordLogo = loadImage ( 'logos/discordLogo.png' );
  emailLogo = loadImage ( 'logos/emailLogo.webp' );
  groupmeLogo = loadImage ( 'logos/groupmeLogo.png' );
  imessageLogo = loadImage ( 'logos/imessageLogo.png' );
  linkedinLogo = loadImage ( 'logos/linkedinLogo.png' );
  messengerLogo = loadImage ( 'logos/messengerLogo.png' );
  piazzaLogo = loadImage ( 'logos/piazzaLogo.png' );
  pinterestLogo = loadImage ( 'logos/pinterestLogo.png' );
  redditLogo = loadImage ( 'logos/redditLogo.png' );
  slackLogo = loadImage ( 'logos/slackLogo.png' );
  snapLogo = loadImage ( 'logos/snapLogo.png' );
  telegramLogo = loadImage ( 'logos/telegramLogo.png' );
  tiktokLogo = loadImage ( 'logos/tiktokLogo.png' );
  tumblrLogo = loadImage ( 'logos/tumblrLogo.png' );
  twitchLogo = loadImage ( 'logos/twitchLogo.png' );
  twitterLogo = loadImage ( 'logos/twitterLogo.png' );
  viberLogo = loadImage ( 'logos/viberLogo.png' );
  vkLogo = loadImage ( 'logos/vkLogo.png' );
  wechatLogo = loadImage ( 'logos/wechatLogo.png' );
  whatsappLogo = loadImage ( 'logos/whatsappLogo.png' );
  youtubeLogo = loadImage ( 'logos/youtubeLogo.png' );
  zoomLogo = loadImage ( 'logos/zoomLogo.png' );
  edmoroLogo = loadImage ( 'logos/edmodoLogo.png' );
  skypeLogo = loadImage ( 'logos/skypeLogo.png' );
  googleclassLogo = loadImage ( 'logos/googleclassLogo.png' );
  googlemeetLogo = loadImage ( 'logos/googlemeetLogo.png' );
  microsoftteamLogo = loadImage ( 'logos/microsoftteamsLogo.png' );
}

// remove space around strings
// make all letters lowercase
function cleanUpArr ( arr ) {

  for ( var i = 0; i < arr.length; ++i ) {

    arr[i] = trim ( arr[i] );
    arr[i] = arr[i].toLowerCase();
  }

}

// updates dictionary based on strings from the table
function populateDictionary ( dictionary, arr ) {

  for ( var i = 0; i < arr.length; ++i ) {

    if ( arr[i] in dictionary ) dictionary[arr[i]]++;
    
    else dictionary[arr[i]] = 1;

  }
}

// get every row of table and put information into dictionary
function readFromCSV ( csvTable, csvCol, newDictionary ) {

  for ( var i = 1; i < csvTable.getRowCount(); ++i ) {

    var socialMediaArr = csvTable.getString ( i, csvCol ).split ( ',' );

    // skip over empty responses
    if ( socialMediaArr[0] != '' ) {

      cleanUpArr ( socialMediaArr );
      populateDictionary ( newDictionary, socialMediaArr );
    }
  }
}

// use information from table to create an array of objects
function createObjArr ( objArr, arrPreCovid, arrPostCovid ) {

  var count = 0;

  for ( var [ key, val ] of Object.entries(arrPreCovid) ) {

    if ( key in logoDictionary ) {

      var freq2 = 0;

      if ( key in arrPostCovid ) freq2 = arrPostCovid [ key ];

      objArr[count] = new SocialMedia ( key, val, freq2, numOfResponses );
      count++;
    }
    
  }

  for ( var [ key, val ] of Object.entries(arrPostCovid) ) {

    if ( key in logoDictionary ) {

      if ( ! ( key in arrPreCovid ) ) {

        objArr[count] = new SocialMedia ( key, 0, val, numOfResponses );
        count++;
      }
    }
  }
}

function setup() {

  createCanvas ( windowWidth, windowHeight );

  numOfResponses = table.getRowCount() - 1;

  // can view information gathered from two types of questions
  selectQuestion = createSelect();
  selectQuestion.position ( 170, 35 );
  selectQuestion.option ( "Compare social media usage", 0 );
  selectQuestion.option ( "Compare platforms for class/work communication", 1 );
  selectQuestion.addClass('selectClass');

  // for switching between pre and post covid data
  prePostCovidBtn = createButton ("Post COVID");
  prePostCovidBtn.position ( 30, 20 );
  prePostCovidBtn.mousePressed ( prePostCovid );
  prePostCovidBtn.addClass ( 'btnStyle' );
  prePostCovidBtn.id ( 'prePostCovidBtn' ); 

  // switching between sorted and mixed view
  sortBtn = createButton ( "Sort them" );
  sortBtn.position ( 100, 20 );
  sortBtn.mousePressed ( flipSort );
  sortBtn.addClass ( 'btnStyle' );
  sortBtn.id ( 'sortBtn' );
  
  clickText = createElement('h5', 'CLICK AN ICON TO SEE DATA');
  clickText.addClass('myFont');
  clickText.position( 1000, 15);

  // will only be considering these platforms and discarding other answers ( such as typos and "i don't use any" )
  logoDictionary = {
    "facebook": fbLogo,
    "instagram": instaLogo,
    "snapchat": snapLogo,
    "twitter": twitterLogo,
    "tiktok": tiktokLogo,
    "wechat": wechatLogo,
    "tumblr": tumblrLogo,
    "pinterest": pinterestLogo,
    "linkedin": linkedinLogo,
    "zoom": zoomLogo,
    "imessage": imessageLogo,
    "messenger": messengerLogo,
    "slack": slackLogo,
    "discord": discordLogo,
    "groupme": groupmeLogo,
    "whatsapp": whatsappLogo,
    "piazza": piazzaLogo,
    "youtube": youtubeLogo,
    "reddit": redditLogo,
    "vk": vkLogo,
    "viber": viberLogo,
    "twitch": twitchLogo,
    "telegram": telegramLogo,
    "email": emailLogo,
    "edmodo": edmoroLogo,
    "skype": skypeLogo,
    "google classroom": googleclassLogo,
    "google meet": googlemeetLogo,
    "microsoft teams": microsoftteamLogo
  };

  // default values
  preCovid = true;
  sort = false;

  // get information from table
  readFromCSV ( table, 1, q1PreCovidFreq );
  readFromCSV ( table, 2, q1PostCovidFreq );
  readFromCSV ( table, 3, q2PreCovidFreq );
  readFromCSV ( table, 4, q2PostCovidFreq );

  // fill arrays with objects
  createObjArr ( q1ObjArr, q1PreCovidFreq, q1PostCovidFreq );
  createObjArr ( q2ObjArr, q2PreCovidFreq, q2PostCovidFreq );
}

// functions for flipping bool based on mouse clicks
function flipSort() {

  if ( sort ) {

    document.getElementById("sortBtn").innerHTML = "Sort them";
  }
  else {

    document.getElementById("sortBtn").innerHTML = "Mix them";
  }

  sort = !sort; 
}

function prePostCovid() { 

  if ( preCovid ) {

    document.getElementById ( "prePostCovidBtn" ).innerHTML = "Pre COVID";
  }
  else {

    document.getElementById ( "prePostCovidBtn" ).innerHTML = "Post COVID";
  }
  preCovid = !preCovid; 

}

function draw () {

  background ( 216, 243, 255 );

  // show data from "social media usage" questions
  if ( selectQuestion.value() == 0 ) {

    for ( var i = 0; i < q1ObjArr.length; ++i ) {

      // have logos move around
      if ( sort ) q1ObjArr[i].moveToPosition ( preCovid );

      // get logos into an ordered line
      else q1ObjArr[i].render ( preCovid );
    }
  }
  // show data from "class/work related platforms" questions
  else if ( selectQuestion.value() == 1 ) {

    for ( var i = 0; i < q2ObjArr.length; ++i ) {

      // have logos move around
      if ( sort ) q2ObjArr[i].moveToPosition ( preCovid );

      // get logos into an ordered line
      else q2ObjArr[i].render ( preCovid );
    }
  }

}


function mousePressed() {
  if ( selectQuestion.value() == 0 ) {

    for ( var i = 0; i < q1ObjArr.length; ++i ) {

      q1ObjArr[i].clicked ();
    }
  }
  else if ( selectQuestion.value() == 1 ) {

    for ( var i = 0; i < q2ObjArr.length; ++i ) {
      
      q2ObjArr[i].clicked ();
    }
  }
}
