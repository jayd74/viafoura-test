import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GameTitle from '../GameTitle.vue'

describe('GameTitle', () => {
  it('renders the correct title text', () => {
    const wrapper = mount(GameTitle)
    expect(wrapper.text()).toBe('Pokémon Catcher')
  })

  it('applies default size when no size prop is provided', () => {
    const wrapper = mount(GameTitle)
    const title = wrapper.find('.game-title')
    expect(title.attributes('style')).toContain('--title-size: 5.5rem')
  })

  it('applies custom size when size prop is provided', () => {
    const wrapper = mount(GameTitle, {
      props: {
        size: '3rem'
      }
    })
    const title = wrapper.find('.game-title')
    expect(title.attributes('style')).toContain('--title-size: 3rem')
  })

  it('applies animation class when isAnimating is true', () => {
    const wrapper = mount(GameTitle, {
      props: {
        isAnimating: true
      }
    })
    const title = wrapper.find('.game-title')
    expect(title.classes()).toContain('title-animated')
  })

  it('does not apply animation class when isAnimating is false', () => {
    const wrapper = mount(GameTitle, {
      props: {
        isAnimating: false
      }
    })
    const title = wrapper.find('.game-title')
    expect(title.classes()).not.toContain('title-animated')
  })

  it('has correct default props', () => {
    const wrapper = mount(GameTitle)
    expect(wrapper.props('isAnimating')).toBe(false)
    expect(wrapper.props('size')).toBe('5.5rem')
  })
})
