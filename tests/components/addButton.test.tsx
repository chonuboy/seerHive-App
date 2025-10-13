import AddNewButton from '@/components/Elements/utils/add-button';
import { render, screen } from '@testing-library/react'


describe('AddButton', () => {
    it('should render with title and url', () => {
        render(<AddNewButton title="test" url="test" />)
        screen.debug();
    })
})