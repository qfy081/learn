(function() {

    var dom = {
    		btnMode : $('#mode'),
    		box : $('#box'),
    		pauseBtn : $('.btn-pause'),
            pause : $('.pause'),
    		room : $('#room'),
    		dialog : $('#dialog'),
    		resume : $('.btn-resume'),
    		restart : $('.btn-restart'),
    		time : $('.time'),
    		lv : $('.lv').find('em'),
    		gameover : $('.gameover'),
    		content : $('.content')
        },
        _game = {
        	scored : 0,

            init: function(type, el) {
            	this.type = type;
            	this.config = _conf[type];
            	this.el = el;
            	this.api = window.API[this.type];

            	document.title = _lang.title;
            	dom.btnMode.text(this.type.btnText);

            	this.reset();
            	this.renderUI();
            	this.hasEvent || this.initEvent();
            	this.hasEvent = true;
                this.start();
            },

            renderUI : function(){
            	var isLandscape = window.innerHeight === 90 || window.innerHeight === -90,
            		length = isLandscape ? window.innerHeight : window.innerWidth;

                if (length > 500) {
                    length = 500;
                }

                length -= 40;
            	dom.box.width(length).height(length);
            	this.el.show();
            },

            reset : function(){
            	this.time = this.config.allTime;
                this.scored = 0;
                dom.time.text(this.time);
            	this.lv = -1;
            },

            initEvent : function(){
            	var event = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click',
            		_this = this;

            	$(window).resize(_.bind(_this.renderUI, _this));

            	dom.box.on(event, 'span', function(){
            		var $this = $(this),
            			_type = $this.data('type');

            		if (_type === '1') {
            			$this.css('backgroundColor', '#f00').removeAttr('dataType').html('<em></em>');
            			_this.scored ++;

            			_this.nextLv();
            		} else {
                        _this.time -= _this.config.lessTime;
                        dom.time.text(_this.time);
                    }
            	});

            	dom.pauseBtn.on(event, _.bind(_this.pause, _this));
            	dom.resume.on(event, _.bind(_this.resume, _this));
            	dom.restart.on(event, function(){
                    _this.reset();
                    _this.resume();
            		_this.start();
            	})

            },

            start : function(){
                var _this = this;

            	dom.dialog.hide();
            	_this.isPause = false;
            	_this.lv = typeof _this.lv === 'undefined' ? 0 : _this.lv + 1; // 做判断是nextLv调用，还是初始化调用
            	_this.lvMap = _this.config.lvMap[_this.lv] || _.last(_this.config.lvMap);
            	_this.renderMap();
            	_this.renderInfo();
            	_this.timer || (this.timer = setInterval(_.bind(this.tick, this), 1000));
            },

            renderMap : function(){
            	var n = this.lvMap * this.lvMap,
            		c = '',
            		d = 'lv' + this.lvMap;

            	_(n).times(function(){
            		c += '<span></span>'
            	});

            	dom.box.attr('class' ,d).html(c);

            	this.api.init(this.lvMap, this.lv);
            },

            renderInfo : function(){
            	dom.lv.text(this.scored);
            },

            pause : function(){
                dom.pause.show();
            	dom.room.fadeOut();
            	dom.dialog.fadeIn();
            	this.isPause = true;
            },

            resume : function(){
            	dom.room.fadeIn();
            	dom.dialog.fadeOut();
            	this.isPause = false;
            },

            nextLv : function(){
            	this.time += this.config.addTime;
            	this.start();
            },

            tick : function(){
                if (this.isPause) return;
                this.time --;
                dom.time.html(this.time);
                if (this.time >= 5) {
                    dom.time.removeClass('danger');
                } else {
                    dom.time.addClass('danger');
                }
                if (this.time <= 0) {
                    this.gameOver();
                }
            },

            gameOver : function(){
            	var gameOverText = this.api.getGameOverText(this.scored);
            	dom.content.hide();
            	dom.gameover.find('h3').html(gameOverText.html).end().show();

            	dom.box.find('span').fadeOut(1000, function(){
            		dom.dialog.show();
            	});

            	this.isPause = true;
            }
        }

    window.Game = _game;
})();

