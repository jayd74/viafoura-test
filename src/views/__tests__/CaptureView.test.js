import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import CaptureView from '../CaptureView.vue'
import { useTrainerStore } from '../../stores/trainer.js'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/capture', component: { template: '<div>Capture</div>' } }
  ]
})

describe('CaptureView', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders without crashing', () => {
    const wrapper = mount(CaptureView, {
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays all main UI elements correctly', () => {
    const store = useTrainerStore()
    store.name = 'Ash' // Set trainer name for welcome message test
    
    const wrapper = mount(CaptureView, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    // Main capture container
    expect(wrapper.find('.capture-container').exists()).toBe(true)
    expect(wrapper.find('.capture-view').exists()).toBe(true)
    
    // GameTitle component
    expect(wrapper.findComponent({ name: 'GameTitle' }).exists()).toBe(true)
    
    // Welcome message with trainer name
    expect(wrapper.text()).toContain('Welcome to the Pokémon catching adventure, Ash!')
    expect(wrapper.find('.trainer-name').exists()).toBe(true)
    expect(wrapper.find('.trainer-name').text()).toBe('Ash')
    
    // Game components
    expect(wrapper.findComponent({ name: 'ViewFinder' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'GameControls' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'EventLog' }).exists()).toBe(true)
    
    // Layout structure
    expect(wrapper.find('.game-area').exists()).toBe(true)
    expect(wrapper.find('.viewfinder-section').exists()).toBe(true)
    expect(wrapper.find('.controls-section').exists()).toBe(true)
    expect(wrapper.find('.event-log-container').exists()).toBe(true)
    expect(wrapper.find('.capture-content').exists()).toBe(true)
  })

  it('redirects to home when no trainer name', () => {
    const store = useTrainerStore()
    store.name = '' // Set empty name before mounting
    
    const pushSpy = vi.spyOn(router, 'push')
    
    mount(CaptureView, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    // The mounted hook should have called router.push
    expect(pushSpy).toHaveBeenCalledWith('/')
  })

  it('does not redirect when trainer has name', () => {
    const store = useTrainerStore()
    store.name = 'Ash' // Set name before mounting
    
    const pushSpy = vi.spyOn(router, 'push')
    
    mount(CaptureView, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    // The mounted hook should not have called router.push
    expect(pushSpy).not.toHaveBeenCalled()
  })


  it('passes correct size prop to GameTitle', () => {
    const wrapper = mount(CaptureView, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    const gameTitle = wrapper.findComponent({ name: 'GameTitle' })
    expect(gameTitle.props('size')).toBe('3rem')
  })
})
