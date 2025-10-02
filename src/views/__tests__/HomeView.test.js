import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../HomeView.vue'
import { useTrainerStore } from '../../stores/trainer.js'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/capture', component: { template: '<div>Capture</div>' } }
  ]
})

describe('HomeView', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders without crashing', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays all main UI elements correctly', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    // Main container and pokeball background
    expect(wrapper.find('.main-container').exists()).toBe(true)
    expect(wrapper.find('.pokeball-background').exists()).toBe(true)
    
    // Pokeball image
    const pokeballImage = wrapper.find('.pokeball-image')
    expect(pokeballImage.exists()).toBe(true)
    expect(pokeballImage.attributes('src')).toBe('/src/assets/pokeball.png')
    expect(pokeballImage.attributes('alt')).toBe('Pokeball')
    
    // GameTitle component
    expect(wrapper.findComponent({ name: 'GameTitle' }).exists()).toBe(true)
    
    // Trainer name input
    const input = wrapper.find('#trainer-name')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('placeholder')).toBe('Enter your trainer name')
    
    // Start button
    const button = wrapper.find('.start-button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Start')
    
    // Form container
    expect(wrapper.find('#form-registration').exists()).toBe(true)
  })

  it('binds trainer name to input', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    const store = useTrainerStore()
    store.name = 'Ash'
    
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('#trainer-name').element.value).toBe('Ash')
    })
  })

  it('updates trainer name when input changes', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    const input = wrapper.find('#trainer-name')
    await input.setValue('Misty')
    
    const store = useTrainerStore()
    expect(store.name).toBe('Misty')
  })

  it('shows validation error when trainer name is empty', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    const store = useTrainerStore()
    store.name = ''
    
    await wrapper.find('.start-button').trigger('click')
    
    expect(wrapper.vm.validationError).toBe('Please enter your trainer name')
    expect(wrapper.find('.error-message').text()).toBe('Please enter your trainer name')
  })

  it('navigates to capture view when start button is clicked with valid name', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    const store = useTrainerStore()
    store.name = 'Ash'
    
    const pushSpy = vi.spyOn(router, 'push')
    
    await wrapper.find('.start-button').trigger('click')
    
    // Wait for the timeout in startGame method
    await new Promise(resolve => setTimeout(resolve, 1100))
    
    expect(pushSpy).toHaveBeenCalledWith('/capture')
  })

  it('starts animation when game starts', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    const store = useTrainerStore()
    store.name = 'Ash'
    
    await wrapper.find('.start-button').trigger('click')
    
    expect(wrapper.vm.isAnimating).toBe(true)
  })

  it('passes correct props to GameTitle', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    const gameTitle = wrapper.findComponent({ name: 'GameTitle' })
    expect(gameTitle.props('isAnimating')).toBe(false)
    expect(gameTitle.props('size')).toBe('4rem')
  })
})
