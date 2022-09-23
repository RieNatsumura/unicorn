$(function(){
	$window = $('.window'),
	$bird = $('.bird'),
  fallTime = 1000,
  gapHeight = 150,
  gameState = 2, /* 1:ゲーム中 ,2:ゲーム終了 */
  startTime = Date.now(),
  result = '0m',
  pipeId = 0;
  

	var int = setInterval(function(){
    if(gameState === 1){
      spawnPipe();
      movePipes();
    }
  }, 1300);
  
  var birdPosInterval = setInterval(function(){ 
    if(gameState === 1){
      birdPos();
    }
  }, 10);

  /* マウスクリック */ 
	$window.mousedown(function(){
    $('.start_btn').hide();
    $('.window').addClass('scroll');
		birdFlap();
    if(gameState === 2){
      gameState = 1;
      deleteInterval();
    }
	});
  
	$(window).keydown(function(e){
		if(e.keyCode === 32){
      $('.start_btn').hide();
			birdFlap();
      e.preventDefault();
      if(gameState === 2){
        gameState = 1;
        deleteInterval();
      }
		}
	});

  function deleteInterval(){
	  setTimeout(function(){
		  var int= setInterval(function(){ 
        if(gameState === 1){
          deletePipe();
        }
      }, 1300);
	  }, 2050);
  }
  
	function birdFlap(){
    if(gameState === 1 || gameState === 2){
      $bird.css('transform', 'rotate(-20deg)');
		  $bird.stop().animate({
			  bottom: '+=60px'
  		}, 200, function(){
        birdPos();
        $bird.css('transform', 'rotate(0deg)');
		  	$bird.stop().animate({
			    bottom: '-=60px'
  		  }, 300, 'linear', function(){
          birdPos();
          gravity();
          var end = Date.now();
          result = Math.floor((end - startTime)/1000) + 'm';
          $('.score').html(result);
        });
	  	});
    } 
	}

	function gravity(){
    if(gameState === 1){
      birdPercent = parseInt($bird.css('bottom')) / $window.height();
      totalFallTime = fallTime * birdPercent;
		  $bird.stop().animate({
		  	bottom: '0'
		  }, totalFallTime, 'linear');
  
      $bird.css('transform', 'rotate(90deg)');
    }
	}

  /* おじゃま虫バーを表示 */
	function spawnPipe(){
    pipeId++;
		pipeTopHeight = Math.floor(Math.random() * ($window.height() - 250)) + 50;
		pipeBottomHeight = $window.height() - (pipeTopHeight + gapHeight);
		pipe = '<div class="pipe" pipe-id="' + pipeId + '"><div style="height: ' + pipeTopHeight + 'px" class="topHalf"></div><div style="height:' + pipeBottomHeight + 'px" class="bottomHalf"></div></div>';
		$window.append(pipe);
	}
  /* おじゃま虫バーを消す */
	function deletePipe(){
		$('.window .pipe').first().remove();
	}
  /* おじゃま虫バーを動かす */
	function movePipes(){
		$('.pipe').each(function(){
			$(this).animate({
				right: '+=160px'
			}, 1300, 'linear');
		});
	}
  
  /* unicornの動きでGameOver条件*/
  function birdPos(){
    /* 下にくっついたらGameover*/
    if(parseInt($bird.css('bottom')) === 0 || parseInt($bird.css('top')) === 0){
      gameEnd();
    }
    /* パイプにくっついたらGameover*/
    $(".pipe").each(function(i, elem) {
      curPipe = $(elem);
  
      if(($bird.offset().left + $bird.width()) >= curPipe.offset().left && $bird.offset().left <= (curPipe.offset().left + curPipe.width())){
        pipeTop = $(elem).children('.topHalf');
        pipeBottom = $(elem).children('.bottomHalf');

        if($bird.position().top < (curPipe.position().top + pipeTop.height()) || ($bird.position().top + $bird.height()) > ((curPipe.position().top + pipeTop.height()) +   gapHeight)){  
          gameEnd();
        }
      }
    });
  }
  
  function gameEnd(){
  	clearInterval(birdPosInterval);
    $('.window').removeClass('scroll');
  	$('.pipe').stop();
    $('.finishArea').show();
    $('.result').html(result);

  	gameState = 2;
    gravity();
  }
})