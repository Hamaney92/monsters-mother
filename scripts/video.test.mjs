import test from 'node:test';
import assert from 'node:assert/strict';
import { videoReporter } from '../src/lib/video.ts';
test('loading, buffering and paused players do not count as video starts', () => {
  const events=[]; const report=videoReporter(e=>events.push(e));
  for(const state of [-1,2,3,5]) report(state,0,100,true);
  report(1,0,0,true); report(1,0,100,false);
  assert.deepEqual(events,[]);
});
test('real playback counts once through pause/resume, milestones once, completion only after start', () => {
  const events=[]; const report=videoReporter(e=>events.push(e));
  report(0,100,100,true); assert.equal(events.length,0);
  report(1,0,100,true); report(2,5,100,true); report(1,5,100,true);
  for(const current of [10,10,25,50,75,20,75]) report(1,current,100,true);
  report(0,100,100,true); report(0,100,100,true);
  assert.deepEqual(events.map(e=>e.name),['video_start','video_progress','video_progress','video_progress','video_progress','video_complete']);
  assert.deepEqual(events.filter(e=>e.name==='video_progress').map(e=>e.percent),[10,25,50,75]);
});
