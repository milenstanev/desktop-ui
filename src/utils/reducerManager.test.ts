import { createReducerManager } from './reducerManager';

const dummyReducer = (state = { value: 0 }) => state;

describe('createReducerManager', () => {
  it('returns combined reducer for initial reducers', () => {
    const manager = createReducerManager({ foo: dummyReducer });
    const state = manager.reduce(undefined, { type: '@@INIT' });
    expect(state).toEqual({ foo: { value: 0 } });
  });

  it('adds new reducer', () => {
    const manager = createReducerManager({ foo: dummyReducer });
    manager.add('bar', dummyReducer);
    const state = manager.reduce({ foo: { value: 0 } }, { type: '@@INIT' });
    expect(state).toHaveProperty('bar');
  });

  it('ignores duplicate add', () => {
    const manager = createReducerManager({ foo: dummyReducer });
    manager.add('foo', () => ({ value: 999 }));
    const state = manager.reduce(undefined, { type: '@@INIT' });
    expect(state.foo).toEqual({ value: 0 });
  });

  it('removes reducer and clears state', () => {
    const manager = createReducerManager({ foo: dummyReducer, bar: dummyReducer });
    manager.remove('bar');
    const state = manager.reduce(
      { foo: { value: 0 }, bar: { value: 0 } },
      { type: '@@INIT' }
    );
    expect(state).toEqual({ foo: { value: 0 } });
  });
});
