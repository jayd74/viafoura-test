import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PokedexModal from '../PokedexModal.vue'

// Mock the PokemonApiService
vi.mock('../../services/pokemonApi.js', () => ({
  PokemonApiService: {
    getPokemonById: vi.fn()
  }
}))

describe('PokedexModal', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders without crashing', () => {
    const wrapper = mount(PokedexModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('does not render when isOpen is false', () => {
    const wrapper = mount(PokedexModal, {
      props: {
        isOpen: false
      },
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('renders modal when isOpen is true', () => {
    const wrapper = mount(PokedexModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.find('.pokedex-modal').exists()).toBe(true)
  })

  it('displays correct header title', () => {
    const wrapper = mount(PokedexModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.find('.pokedex-header h2').text()).toBe('Pokédex')
  })

  it('shows empty collection message when no Pokemon caught', () => {
    const wrapper = mount(PokedexModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [pinia]
      }
    })
    
    expect(wrapper.text()).toContain('No Pokémon Caught Yet')
    expect(wrapper.text()).toContain('Start your adventure and catch some Pokémon to see them here!')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(PokedexModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [pinia]
      }
    })
    
    await wrapper.find('.back-button').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when modal overlay is clicked', async () => {
    const wrapper = mount(PokedexModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [pinia]
      }
    })
    
    await wrapper.find('.modal-overlay').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not emit close when modal content is clicked', async () => {
    const wrapper = mount(PokedexModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [pinia]
      }
    })
    
    await wrapper.find('.pokedex-modal').trigger('click')
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('has correct default props', () => {
    const wrapper = mount(PokedexModal, {
      global: {
        plugins: [pinia]
      }
    })
    expect(wrapper.props('isOpen')).toBe(false)
  })
})
