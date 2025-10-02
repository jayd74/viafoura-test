import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EncounterStats from '../EncounterStats.vue'

describe('EncounterStats', () => {
  const mockPokemon = {
    id: 1,
    name: 'pikachu',
    height: 4,
    weight: 60,
    stats: [
      { stat: { name: 'hp' }, base_stat: 35 },
      { stat: { name: 'attack' }, base_stat: 55 },
      { stat: { name: 'defense' }, base_stat: 40 },
      { stat: { name: 'special-attack' }, base_stat: 50 },
      { stat: { name: 'special-defense' }, base_stat: 50 },
      { stat: { name: 'speed' }, base_stat: 90 }
    ]
  }

  it('renders without crashing when pokemon prop is provided', () => {
    const wrapper = mount(EncounterStats, {
      props: {
        pokemon: mockPokemon
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('does not render when pokemon prop is not provided', () => {
    const wrapper = mount(EncounterStats, {
      props: {
        pokemon: null
      }
    })
    expect(wrapper.find('.encounter-stats').exists()).toBe(false)
  })

  it('displays all UI elements and functionality correctly', () => {
    const wrapper = mount(EncounterStats, {
      props: {
        pokemon: mockPokemon
      }
    })
    
    // Main container
    expect(wrapper.find('.encounter-stats').exists()).toBe(true)
    expect(wrapper.find('.pokemon-stats').exists()).toBe(true)
    expect(wrapper.find('.stats-grid').exists()).toBe(true)
    
    // Base stats header
    expect(wrapper.text()).toContain('Base Stats')
    
    // All Pokemon stat names
    expect(wrapper.text()).toContain('HP')
    expect(wrapper.text()).toContain('ATK')
    expect(wrapper.text()).toContain('DEF')
    expect(wrapper.text()).toContain('SP.ATK')
    expect(wrapper.text()).toContain('SP.DEF')
    expect(wrapper.text()).toContain('SPD')
    
    // All stat values
    expect(wrapper.text()).toContain('35')
    expect(wrapper.text()).toContain('55')
    expect(wrapper.text()).toContain('40')
    expect(wrapper.text()).toContain('50')
    expect(wrapper.text()).toContain('90')
    
    // Stat formatting method
    expect(wrapper.vm.formatStatName('hp')).toBe('HP')
    expect(wrapper.vm.formatStatName('attack')).toBe('ATK')
    expect(wrapper.vm.formatStatName('defense')).toBe('DEF')
    expect(wrapper.vm.formatStatName('special-attack')).toBe('SP.ATK')
    expect(wrapper.vm.formatStatName('special-defense')).toBe('SP.DEF')
    expect(wrapper.vm.formatStatName('speed')).toBe('SPD')
    
    // Stat bars and width calculations
    const statFills = wrapper.findAll('.stat-fill')
    expect(statFills.length).toBe(6)
    
    // Check that stat bars have width styles
    statFills.forEach(statFill => {
      expect(statFill.attributes('style')).toContain('width:')
    })
    
    // Stat items structure
    const statItems = wrapper.findAll('.stat-item')
    expect(statItems.length).toBe(6)
    
    // Each stat item should have name, bar, and value
    statItems.forEach(statItem => {
      expect(statItem.find('.stat-name').exists()).toBe(true)
      expect(statItem.find('.stat-bar').exists()).toBe(true)
      expect(statItem.find('.stat-value').exists()).toBe(true)
    })
  })

  it('has correct default props', () => {
    const wrapper = mount(EncounterStats, {
      props: {
        pokemon: mockPokemon
      }
    })
    expect(wrapper.props('pokemon')).toEqual(mockPokemon)
  })
})
