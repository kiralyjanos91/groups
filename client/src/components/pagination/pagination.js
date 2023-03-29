import Pagination from 'react-bootstrap/Pagination';
import { useNavigate , useParams } from 'react-router-dom';
import "./pagination.css"

export default function PagePagination ( { root , pageCount } ) {

    const navigate = useNavigate()
    const { page } = useParams()

    const paginationButtons = []

    let loopFrom = 0
    let loopCount = 5

    if ( pageCount < 6 ) {
      loopFrom = 1
      loopCount = pageCount
    }
    else if ( page < 4 ) {
      loopFrom = 1
    }
    else if ( page < pageCount - 2) {
      loopFrom = page - 2
    }
    else {
      loopFrom = pageCount - 4
    }

    for ( let i = loopFrom ; i < loopFrom + loopCount ; i++ ) {
      paginationButtons.push(
        <Pagination.Item
            key = { i }
            onClick={ () => pageSelector(i) }
            active={i === page}
        >
            { i }
        </Pagination.Item>
      )
    }

    const pageSelector = (pageNumber) => {
        navigate(`${root}/${pageNumber}`)
    }

  return (
    <Pagination className="groups-pagination">
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
