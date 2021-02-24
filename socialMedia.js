
// so that I am not defining them in moveToPosition()
var xSorted;
var ySorted;
// angle for rotating logos when they are moving
var angle = 0;
var secondAngle =  - 3.14 / 2;

function increaseAngle () {

    if ( angle >= 2 * PI ) angle = 0;

    else angle += 0.0005;
}

function increaseSecondAngle () {

  if ( secondAngle >= 2 * PI ) secondAngle = 0;

  else secondAngle += 0.002;
}

function increaseAngle2() {

  if ( angle >= 2 * PI ) angle = 0;

  else if ( angle > PI / 20 ) angle += 0.0005;

  else {
    // angle has to go from -pi/20 to pi/20
    angle = cos ( secondAngle ) * ( PI / 20 );
    increaseSecondAngle();
  }
}

class SocialMedia {

    constructor ( name, freq1, freq2, numOfResponses ) {
  
      this.name = name;
  
      // number of people that said they use the app
      this.freqPreCovid = freq1;
      this.freqPostCovid = freq2;
  
      this.xCoord = random ( width );
      this.yCoord = random ( height );
  
      // used when logos are moving
      this.xSpeed = random ( 4 );
      this.ySpeed = random ( 4 );
  
      // logo size
      // freq [ 0, numofresponses ]
      // logosize [70,370]

      this.preCovidSize = Math.round ( ( freq1 / numOfResponses ) * 300 + 70 );
      this.postCovidSize = Math.round ( ( freq2 / numOfResponses ) * 300 + 70 );

      // current size of the logo
      this.size = this.preCovidSize;

      this.numOfResponses = numOfResponses;

      this.isClicked = false;

      // precentage of people that said they use the app
      this.preCovidPercentage = Math.ceil ( ( freq1 / numOfResponses ) * 100 );
      this.postCovidPercentage = Math.ceil ( ( freq2 / numOfResponses ) * 100 );
    }

    // change size depending on whether pre/post covid data is selected
    changeSize( preCovid ) {

      if ( preCovid ) {
        // larger the frequency, bigger the size
        if ( this.size < this.preCovidSize ) {
          this.size++;
        }
        else if ( this.size > this.preCovidSize ) {
          this.size--;
        }
      }
      else {
        if ( this.size < this.postCovidSize ) {
          this.size++;
        }
        else if ( this.size > this.postCovidSize ) {
          this.size--;
        }
      }
    }

    // for drawing the white message bubble with data
    printText () {

      push();

      translate ( this.xCoord, this.yCoord );

      fill ( 250, 250, 250 );
      noStroke();

      triangle( 0, - this.size / 3, this.size / 5, -this.size / 2, - this.size / 5, -this.size / 2 );
      ellipse ( 0, - 2 * (this.size / 3), this.size - 20, this.size / 2 );

      textAlign( CENTER );
      textStyle ( BOLD );
      textSize ( this.size / 12 );
      fill ( 70, 70, 70 );

      text ( this.name, 0, - 15 * ( this.size / 20 ) );
      textSize ( this.size / 16 );
      text ( "Pre", -this.size / 5, - 13 * (this.size / 20 ) );
      text ( "Post", this.size / 5, - 13 * (this.size / 20 ) );

      textSize ( this.size / 12 );
      text ( this.preCovidPercentage + "%", - this.size / 5, - 11 * ( this.size / 20 ));
      text ( this.postCovidPercentage + "%", this.size / 5, - 11 * ( this.size / 20 ));

      pop();
    }
  
    // get logo into it's sorted position
    moveToPosition ( preCovid ) {

      this.changeSize ( preCovid );
  
      // if freq 0, don't draw the logo
      if ( this.size ) {  
          
          push ();
  
          imageMode ( CENTER );
  
          translate ( this.xCoord, this.yCoord );
          rotate ( angle );
  
          // once they are in the original position, don't rotate in the "sort" animation
          increaseAngle2();
	      
          blendMode ( DARKEST );
         
          image ( logoDictionary [ this.name ], 0, 0, this.size, this.size );

          blendMode ( BLEND );

          pop ();

          if ( this.isClicked ) this.printText();
      }

      // larger the frequency, larger x value
      // y depends on how many logos with same frequency there are
      if ( preCovid ) {

        xSorted = Math.round ( ( this.freqPreCovid / this.numOfResponses ) * ( width - 180 ) ) + 50;
      }
      else {

        xSorted = Math.round ( ( this.freqPostCovid / this.numOfResponses ) * ( width - 180 ) ) + 50;
      }
      
      ySorted = windowHeight/2;

      if ( xSorted > this.xCoord ) this.xCoord++;
      if ( xSorted < this.xCoord ) this.xCoord--;
     
      if ( ySorted > this.yCoord ) this.yCoord++;
      if ( ySorted < this.yCoord ) this.yCoord--;
      
    }
  
    render( preCovid ) {
  
      this.changeSize ( preCovid );
  
      // if freq 0, don't draw the logo
      if ( this.size ) {

        push ();
  
        imageMode ( CENTER );
        translate ( this.xCoord, this.yCoord );

        rotate ( angle );
        increaseAngle ();
  
        image ( logoDictionary [ this.name ], 0, 0, this.size, this.size );
        
        pop ();

        if ( this.isClicked ) this.printText();

        // to move logos
        this.updateCoords ();
      }
    }
  
    // move the logo in the "mix" animation
    updateCoords () {
  
      if ( this.xCoord < 0  || this.xCoord > width ) this.xSpeed *= -1;
  
      this.xCoord += this.xSpeed;
  
      if ( this.yCoord < 0  || this.yCoord > height ) this.ySpeed *= -1;
  
      this.yCoord += this.ySpeed;
    }

    // chenge the isClicked field if logo was clicked
    clicked () {

      if ( dist ( mouseX, mouseY, this.xCoord, this.yCoord ) < this.size / 2 ) {

        this.isClicked = !this.isClicked;
      }
    }
  
  };