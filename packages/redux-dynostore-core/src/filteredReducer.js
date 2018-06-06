/**
 * Copyright 2018, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Map } from 'immutable'

const FILTER_INIT = { type: '@@FILTER/INIT' }

const filteredReducer = reducer => {
  let knownKeys = reducer(Map(), FILTER_INIT)
    .keySeq()
    .toArray()
  return (state, action) => {
    let filteredState = Map()

    if (knownKeys.length && state !== undefined) {
      knownKeys.map(key => {
        filteredState = filteredState.set(key, state.get(key))
        return null
      })
    }

    let newState = reducer(filteredState, action)

    // TODO: Should this be referential equality (as it's now) or value equality?
    if (newState === filteredState) {
      return state
    }

    if (Map.isMap(newState)) {
      if (state !== undefined) {
        return state.merge(newState)
      }
      return newState
    } else {
      return newState
    }
  }
}

export default filteredReducer
