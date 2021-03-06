/**
 * Copyright 2018, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import { shallow } from 'enzyme'
import dynamic from 'src/dynamic'

describe('dynamic tests', () => {
  test('should create dynamic component', () => {
    const TestComponent = () => <p>Hello World</p>
    const DynamicComponent = dynamic('testId')(TestComponent)

    const wrapper = shallow(<DynamicComponent />)

    expect(wrapper.html()).toBe('<p>Hello World</p>')
  })

  test('should create dynamic component with enhancer', () => {
    const callback = jest.fn()

    const fakeStore = {}

    const testEnhancer = identifier => store => {
      expect(identifier).toBe('testId')
      expect(store).toBe(fakeStore)
      callback()
    }

    const TestComponent = () => <p>Hello World</p>
    const DynamicComponent = dynamic('testId', testEnhancer)(TestComponent)

    const wrapper = shallow(<DynamicComponent />, { context: { store: fakeStore } })

    expect(wrapper.html()).toBe('<p>Hello World</p>')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should create dynamic component with multiple enhancers', () => {
    const callback = jest.fn()

    const fakeStore = {}

    const testEnhancer1 = identifier => store => {
      expect(identifier).toBe('testId')
      expect(store).toBe(fakeStore)
      callback(1)
    }

    const testEnhancer2 = identifier => store => {
      expect(identifier).toBe('testId')
      expect(store).toBe(fakeStore)
      callback(2)
    }

    const TestComponent = () => <p>Hello World</p>
    const DynamicComponent = dynamic('testId', testEnhancer1, testEnhancer2)(TestComponent)

    const wrapper = shallow(<DynamicComponent />, { context: { store: fakeStore } })

    expect(wrapper.html()).toBe('<p>Hello World</p>')
    expect(callback).toHaveBeenCalledWith(1)
    expect(callback).toHaveBeenCalledWith(2)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('should create instance of dynamic component with enhancer', () => {
    const callback = jest.fn()

    const fakeStore = {}

    const testEnhancer = identifier => store => {
      expect(identifier).toBe('testId')
      expect(store).toBe(fakeStore)
      callback()
    }

    const TestComponent = () => <p>Hello World</p>
    const DynamicComponent = dynamic('baseId', testEnhancer)(TestComponent).createInstance('testId')

    const wrapper = shallow(<DynamicComponent />, { context: { store: fakeStore } })

    expect(wrapper.html()).toBe('<p>Hello World</p>')
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
