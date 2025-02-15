import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import {TablePagination} from '@material-ui/core'

const tableHeaders = [
  'Repository',
  'Stars',
  'Forks',
  'Open issues',
  'Updated at',
]

const SearchResult = ({isSearchApplied}) =>
  isSearchApplied ? (
    <>
      <table>
        <thead>
          <tr>
            {tableHeaders.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img src="" alt="test" />
              <a href="http://localhost:3000/test">Test</a>
            </td>
            <td>10</td>
            <td>5</td>
            <td>2</td>
            <td>2020-01-01</td>
          </tr>
        </tbody>
      </table>
      <TablePagination
        rowsPerPageOptions={[30, 50, 100]}
        component="div"
        count={1}
        rowsPerPage={30}
        page={0}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
      />
    </>
  ) : (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={400}
    >
      <Typography component="h1" variant="h3">
        Please provide a search option and click in the search button
      </Typography>
    </Box>
  )

export default SearchResult

SearchResult.propTypes = {
  isSearchApplied: PropTypes.bool.isRequired,
}
