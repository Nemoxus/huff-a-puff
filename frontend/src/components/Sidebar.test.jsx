import { render, screen } from '@testing-library/react'
import Sidebar from './Sidebar'

// Mock next/image and next/link so they render correctly in tests
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }) => {
    return <a href={href}>{children}</a>
  },
}))

describe('Sidebar Component', () => {
  it('renders the logo and title', () => {
    render(<Sidebar />)
    const title = screen.getByText('Huff-a-Puff')
    expect(title).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Sidebar />)
    expect(screen.getByText('Feed')).toBeInTheDocument()
    expect(screen.getByText('Discover')).toBeInTheDocument()
  })

  it('renders share section links', () => {
    render(<Sidebar />)
    expect(screen.getByText('Pass the J ;)')).toBeInTheDocument()
    expect(screen.getByText('Copy Link')).toBeInTheDocument()
    expect(screen.getByText('Share App')).toBeInTheDocument()
  })
})