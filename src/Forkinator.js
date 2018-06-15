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

var Forkinator = cc.Sprite.extend({
    _gameLayer:null,
    _pos_x:null,
    _winSize:null,
    state:ZH.SPRITE_STATE.IDLE,
    speed:100,
    hitEffect:null,

    ctor:function(gameLayer) {
        this._winSize = cc.Director.getInstance().getWinSize();
        this._gameLayer = gameLayer;

        this.initWithFile(s_Forkinator);
        this.setScale(0.32);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.pos_x = this._winSize.width/2;
        this.setPosition(cc.p(this.pos_x, this._winSize.height/10));
        this.state = ZH.SPRITE_STATE.ACTIVE;

        this.scheduleUpdate();
    },

    update:function(dt) {

        if (this.state == ZH.SPRITE_STATE.DYING) {
            this.state = ZH.SPRITE_STATE.DEAD;

            var pos = this.getPosition();
            this.hitEffect = cc.ParticleSystemQuad.create(s_ForkinatorDead_plist);
            this.hitEffect.setPosition(pos);
            this._gameLayer.addChild(this.hitEffect, 10);
            cc.AudioEngine.getInstance().playEffect(s_GameOver_mp3);
            var actions = [];
            actions[0] = cc.DelayTime.create(3.0);
            actions[2] = cc.FadeOut.create(1.0);
            actions[3] = cc.CallFunc.create(this, this.removeEffect);
            this.runAction(cc.Sequence.create(actions));
        }

        if( cc.config.deviceType == 'browser' && this.state == ZH.SPRITE_STATE.ACTIVE) {
            var pos = this.getPosition();
            if ((ZH.KEYS[cc.KEY.a] || ZH.KEYS[cc.KEY.left]) && pos.x >= 0) {
                pos.x -= dt * this.speed;
            }
            if ((ZH.KEYS[cc.KEY.d] || ZH.KEYS[cc.KEY.right]) && pos.x <= this._winSize.width) {
                pos.x += dt * this.speed;
            }
            if (ZH._forksAway > 0) {
                this.fireFork();
                if (ZH._forkCache == 0 && ZH.FORKS.length == 0 && this.state == ZH.SPRITE_STATE.ACTIVE) {
                    this.state = ZH.SPRITE_STATE.DYING;
                }
            }
            this.setPosition( pos );
        }

    },

    removeEffect:function() {
        this.setPosition(cc.p(-500, -500));
        this._gameLayer.removeChild(this.hitEffect);
        this.state = ZH.SPRITE_STATE.OFFSCREEN;
    },

    setDefaultPosition:function() {
        this.pos_x = this._winSize.width/2;
        this.setPosition(cc.p(this.pos_x, this._winSize.height/10));
    },

    isActive:function() {
        return this.state == ZH.SPRITE_STATE.ACTIVE;
    },

    isDead:function() {
        return this.state == ZH.SPRITE_STATE.DEAD;
    },

    isOffscreen:function() {
        return this.state == ZH.SPRITE_STATE.OFFSCREEN;
    },

    newGame:function() {
        this.runAction(cc.FadeIn.create(0.5));
        this.pos_x = this._winSize.width/2;
        this.setPosition(cc.p(this.pos_x, this._winSize.height/10));
        this.state = ZH.SPRITE_STATE.ACTIVE;
    },

    fireFork:function() {
        if (ZH._forkCache > 0) {
            var pos = this.getPosition();
            var fork = new Fork(this._gameLayer, pos);
            ZH.FORKS.push(fork);
            ZH.forkFired = true;
            ZH._forkCache--;
            ZH._forksAway--;
            cc.AudioEngine.getInstance().playEffect(s_FireFork_mp3);
            this._gameLayer.addChild(fork);
        }
    }
});
