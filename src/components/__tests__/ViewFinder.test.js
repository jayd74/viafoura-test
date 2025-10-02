import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ViewFinder from '../ViewFinder.vue'
import { useTrainerStore } from '../../stores/trainer.js'

describe('ViewFinder', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders without crashing', () => {
    const wrapper = mount(ViewFinder, {
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays viewfinder container', () => {
    const wrapper = mount(ViewFinder, {
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.find('.viewfinder').exists()).toBe(true)
  })

  it('shows Pokemon name section when there is an active encounter', () => {
    const wrapper = mount(ViewFinder, {
      global: {
        plugins: [pinia]
      }
    })
    
    const store = useTrainerStore()
    store.currentEncounter = {
      id: 25,
      name: 'pikachu',
      sprites: { front_default: 'test-url' }
    }
    
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.pokemon-name-section').exists()).toBe(true)
      expect(wrapper.text()).toContain('#025')
      expect(wrapper.text()).toContain('Pikachu')
    })
  })

  it('shows Pokemon image when there is an active encounter', () => {
    const wrapper = mount(ViewFinder, {
      global: {
        plugins: [pinia]
      }
    })
    
    const store = useTrainerStore()
    store.currentEncounter = {
      id: 1,
      name: 'bulbasaur',
      sprites: { front_default: 'bulbasaur-url' }
    }
    
    wrapper.vm.$nextTick(() => {
      const pokemonImage = wrapper.find('.pokemon-image')
      expect(pokemonImage.exists()).toBe(true)
      expect(pokemonImage.attributes('src')).toBe('bulbasaur-url')
      expect(pokemonImage.attributes('alt')).toBe('bulbasaur')
    })
  })

  it('shows event caption when there are recent events', () => {
    const wrapper = mount(ViewFinder, {
      global: {
        plugins: [pinia]
      }
    })
    
    const store = useTrainerStore()
    store.addEvent('A wild Pikachu appeared!')
    
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.event-caption').exists()).toBe(true)
      expect(wrapper.text()).toContain('A wild Pikachu appeared!')
    })
  })

  it('shows no encounter message when no active encounter', () => {
    const wrapper = mount(ViewFinder, {
      global: {
        plugins: [pinia]
      }
    })
    
    expect(wrapper.find('.event-caption').exists()).toBe(true)
    expect(wrapper.text()).toContain('No Pokémon encountered yet')
  })

  it('formats Pokemon name correctly', () => {
    const wrapper = mount(ViewFinder, {
      global: {
        plugins: [pinia]
      }
    })
    
    const store = useTrainerStore()
    store.currentEncounter = {
      id: 6,
      name: 'charizard',
      sprites: { front_default: 'charizard-url' }
    }
    
    wrapper.vm.$nextTick(() => {
      expect(wrapper.text()).toContain('Charizard')
    })
  })

  it('formats Pokemon ID with leading zeros', () => {
    const wrapper = mount(ViewFinder, {
      global: {
        plugins: [pinia]
      }
    })
    
    const store = useTrainerStore()
    store.currentEncounter = {
      id: 1,
      name: 'bulbasaur',
      sprites: { front_default: 'bulbasaur-url' }
    }
    
    wrapper.vm.$nextTick(() => {
      expect(wrapper.text()).toContain('#001')
    })
  })
})
