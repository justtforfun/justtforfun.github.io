/*
 * Copyright © 2012 Paul Condran
 *
 * http://github.com/condran
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var Fork = cc.Sprite.extend({
    _gameLayer:null,
    _winSize:null,


    ctor:function(gameLayer, startPos) {
        this._winSize = cc.Director.getInstance().getWinSize();
        this._gameLayer = gameLayer;

        this.initWithFile(s_Fork);
        //this.setScale(0.3);

        var delay = 1 + (2 * Math.random());
        var curX = startPos.x;

        this.setPosition(startPos);

        var actions = [];
        actions[0] = cc.MoveTo.create(delay, cc.p(curX, 500));
        actions[1] = cc.CallFunc.create(this, this.removeFork);

        this.runAction(cc.Sequence.create(actions));

        this.scheduleUpdate();
    },

    destroy:function() {
        var pos = this.getPosition();
        var hitEffect = cc.ParticleSystemQuad.create(s_ZombieHit_plist);
        hitEffect.stopSystem();
        this._gameLayer.addChild(hitEffect, 10);
        hitEffect.setPosition(pos);
        hitEffect.resetSystem();
        var actions = [];
        actions[0] = cc.DelayTime.create(2.0);
        actions[1] = cc.CallFunc.create(this, function() {
            this._gameLayer.removeChild(hitEffect);
        })
        this.runAction(cc.Sequence.create(actions));
    },

    removeFork:function() {
        cc.ArrayRemoveObject(ZH.FORKS, this);
        this._gameLayer.removeChild(this, true);
    },

    collisionRect:function() {
        var p = this.getPosition();
        var a = this.getContentSize();
        return cc.rect(p.x, p.y, a.width-4, a.height-4);
    }

});