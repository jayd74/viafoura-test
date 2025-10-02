import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import GameControls from '../GameControls.vue'
import { useTrainerStore } from '../../stores/trainer.js'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/capture', component: { template: '<div>Capture</div>' } }
  ]
})

describe('GameControls', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders without crashing', () => {
    const wrapper = mount(GameControls, {
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays all UI elements and functionality correctly', () => {
    const store = useTrainerStore()
    store.caughtPokemon = [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' }
    ]
    store.gameState = {
      canFind: true,
      canIgnore: false,
      canThrow: false
    }
    
    const wrapper = mount(GameControls, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    // All control buttons exist
    expect(wrapper.find('[name="btn-find"]').exists()).toBe(true)
    expect(wrapper.find('[name="btn-ignore"]').exists()).toBe(true)
    expect(wrapper.find('[name="btn-throw"]').exists()).toBe(true)
    expect(wrapper.find('[name="btn-collection"]').exists()).toBe(true)
    expect(wrapper.find('[name="btn-quit"]').exists()).toBe(true)
    
    // Correct button text
    expect(wrapper.find('[name="btn-find"]').text()).toBe('Find')
    expect(wrapper.find('[name="btn-ignore"]').text()).toBe('Ignore')
    expect(wrapper.find('[name="btn-throw"]').text()).toBe('Throw')
    expect(wrapper.find('[name="btn-quit"]').text()).toBe('Quit')
    
    // Pokedex count in collection button
    expect(wrapper.find('[name="btn-collection"]').text()).toContain('Pokedex (2)')
    
    // Button states based on game state
    expect(wrapper.find('[name="btn-find"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('[name="btn-ignore"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[name="btn-throw"]').attributes('disabled')).toBeDefined()
    
    // Form structure
    expect(wrapper.find('#form-controls').exists()).toBe(true)
    expect(wrapper.find('fieldset').exists()).toBe(true)
    expect(wrapper.find('legend').text()).toBe('Controls')
  })

  it('calls findPokemon when Find button is clicked', async () => {
    const wrapper = mount(GameControls, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    const store = useTrainerStore()
    const findPokemonSpy = vi.spyOn(store, 'findPokemon')
    
    await wrapper.find('[name="btn-find"]').trigger('click')
    expect(findPokemonSpy).toHaveBeenCalled()
  })

  it('calls ignorePokemon when Ignore button is clicked', async () => {
    const wrapper = mount(GameControls, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    const store = useTrainerStore()
    const ignorePokemonSpy = vi.spyOn(store, 'ignorePokemon')
    
    // Enable the ignore button by setting game state
    store.gameState = {
      canFind: true,
      canIgnore: true,
      canThrow: false
    }
    
    await wrapper.vm.$nextTick()
    await wrapper.find('[name="btn-ignore"]').trigger('click')
    expect(ignorePokemonSpy).toHaveBeenCalled()
  })

  it('calls throwPokeball when Throw button is clicked', async () => {
    const wrapper = mount(GameControls, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    const store = useTrainerStore()
    const throwPokeballSpy = vi.spyOn(store, 'throwPokeball')
    
    // Enable the throw button by setting game state
    store.gameState = {
      canFind: true,
      canIgnore: false,
      canThrow: true
    }
    
    await wrapper.vm.$nextTick()
    await wrapper.find('[name="btn-throw"]').trigger('click')
    expect(throwPokeballSpy).toHaveBeenCalled()
  })

  it('shows quit confirmation modal when Quit button is clicked', async () => {
    const wrapper = mount(GameControls, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    await wrapper.find('[name="btn-quit"]').trigger('click')
    expect(wrapper.vm.showQuitModal).toBe(true)
  })

  it('shows pokedex modal when Pokedex button is clicked', async () => {
    const wrapper = mount(GameControls, {
      global: {
        plugins: [pinia, router]
      }
    })
    
    await wrapper.find('[name="btn-collection"]').trigger('click')
    expect(wrapper.vm.showPokedexModal).toBe(true)
  })
})
