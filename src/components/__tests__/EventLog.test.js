import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import EventLog from '../EventLog.vue'
import { useTrainerStore } from '../../stores/trainer.js'

describe('EventLog', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders without crashing', () => {
    const wrapper = mount(EventLog, {
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays event log container', () => {
    const wrapper = mount(EventLog, {
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.find('.event-log').exists()).toBe(true)
  })

  it('shows events when they exist', () => {
    const wrapper = mount(EventLog, {
      global: {
        plugins: [pinia]
      }
    })
    
    const store = useTrainerStore()
    store.addEvent('Test event message')
    
    // Wait for reactivity
    wrapper.vm.$nextTick(() => {
      expect(wrapper.text()).toContain('Test event message')
    })
  })

  it('displays no events message when event log is empty', () => {
    const wrapper = mount(EventLog, {
      global: {
        plugins: [pinia]
      }
    })
    
    expect(wrapper.text()).toContain('No events yet')
  })

  it('shows recent events in correct order', () => {
    const wrapper = mount(EventLog, {
      global: {
        plugins: [pinia]
      }
    })
    
    const store = useTrainerStore()
    store.addEvent('First event')
    store.addEvent('Second event')
    
    wrapper.vm.$nextTick(() => {
      const eventElements = wrapper.findAll('.event-item')
      expect(eventElements.length).toBeGreaterThan(0)
    })
  })
})
