import {test} from '../../../util/test';
import window from '../../../../src/util/window';
import Map from '../../../../src/ui/map';
import DOM from '../../../../src/util/dom';
import simulate from '../../../util/simulate_interaction';

function createMap(t) {
    t.stub(Map.prototype, '_detectMissingCSS');
    return new Map({interactive: false, container: DOM.create('div', '', window.document.body)});
}

test('MapEvent handler fires touch events with correct values', (t) => {
    const map = createMap(t);

    const touchstart = t.spy();
    const touchmove = t.spy();
    const touchend = t.spy();

    map.on('touchstart', touchstart);
    map.on('touchmove', touchmove);
    map.on('touchend', touchend);

    const touchesStart = [{identifier: 1, clientX: 0, clientY: 50}];
    const touchesMove = [{identifier: 1, clientX: 0, clientY: 60}];
    const touchesEnd = [{identifier: 1, clientX: 0, clientY: 60}];

    simulate.touchstart(map.getCanvas(), {touches: touchesStart, targetTouches: touchesStart});
    t.equal(touchstart.callCount, 1);
    t.deepEqual(touchstart.getCall(0).args[0].point, {x: 0, y: 50});
    t.equal(touchmove.callCount, 0);
    t.equal(touchend.callCount, 0);
    console.log(touchstart);

    simulate.touchmove(map.getCanvas(), {touches: touchesMove, targetTouches: touchesMove});
    t.equal(touchstart.callCount, 1);
    t.equal(touchmove.callCount, 1);
    t.deepEqual(touchmove.getCall(0).args[0].point, {x: 0, y: 60});
    t.equal(touchend.callCount, 0);

    simulate.touchend(map.getCanvas(), {touches: [], targetTouches: [], changedTouches: touchesEnd});
    t.equal(touchstart.callCount, 1);
    t.equal(touchmove.callCount, 1);
    t.equal(touchend.callCount, 1);
    t.deepEqual(touchend.getCall(0).args[0].point, {x: 0, y: 60});

    map.remove();
    t.end();
});
