(function() {
    var dom = {
            box: $('#box'),
            children: 'span'
        },
        color = {
            lvText: _lang.color.lv_txt,
            init: function(lvMap, lv) {
                this.lvMap = lvMap;
                this.lv = lv;
                this.dirricultyCorrection = 15;
            },

            render: function() {
                this.difficulty = Math.max(9 - this.lvMap, 1) * this.dirricultyCorrection;
                this.difficulty = this.lv > 20 ? 10 : this.difficulty;
                this.difficulty = this.lv > 40 ? 8 : this.difficulty;
                this.difficulty = this.lv > 50 ? 5 : this.difficulty;

                var h = Math.floor(Math.random() * e * e), // 随机生成一个目标索引
                    i = this.getColor(255 - this.d),
                    j = this.getLvColor(i[0]);

                dom.box.find(children).css('backgroundColor', i[1])
                    .eq(h).css('backgroundColor', j[1]).data('type', '1');
            },

            getColor: function(val) {
                var b = [
                        Math.round(Math.random() * val),
                        Math.round(Math.random() * val),
                        Math.round(Math.random() * val)
                    ],
                    c = 'rgb(' + b.join(',') + ')';

                return [b, c];
            },

            getLvColor: function(val) {
                var lvCorrection = this.dirricultyCorrection + this.difficulty,
                    b = _.map(val, function(item) {
                        return item + lvCorrection;
                    }),
                    c = 'rgb(' + b.join(',') + ')';

                return [b, c];
            },

            getGameOverText: function(lv) {
                var b = lv > 20 ? Math.ceil(lv - 20) / 10 : 0,
                    c = this.lvT[b] || _.last(this.lvT),
                    d = c + 'lv' + lv;
                return { html: d };
            }
        };
    window.API.color = color;
})();
