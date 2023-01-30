import Pagination from 'react-bootstrap/Pagination';
import { useNavigate , useParams } from 'react-router-dom';

export default function PagePagination ( { root , pageCount } ) {

    const navigate = useNavigate()
    const { page } = useParams()

    const pagesArray = new Array(pageCount).fill(".")

    const pageSelector = (pageNumber) => {
        navigate(`${root}/${pageNumber}`)
    }

    const paginationButtons = pagesArray.map((page , index) => {
        return (
            <Pagination.Item
                onClick={ () => pageSelector(index + 1) }
            >
                {index + 1}
            </Pagination.Item>
        )
    })

    console.log(paginationButtons)

  return (
    <Pagination>
      <Pagination.First 
        onClick = { () => {
            if ( page > 1) {
                return pageSelector(1)}
            }
        }
      />
      <Pagination.Prev 
        onClick = { () => {
            if ( page > 1) {
                return pageSelector(parseInt(page) - 1)}
            }
        }
      />
        { paginationButtons }
      <Pagination.Next 
        onClick = { () => {
            if ( page < pageCount) {
                return pageSelector(parseInt(page) + 1)}
            }
        }
      />
      <Pagination.Last 
        onClick = { () => {
            if ( page < pageCount) {
                return pageSelector(pageCount)}
            }
        }
      />
    </Pagination>
  )
}
