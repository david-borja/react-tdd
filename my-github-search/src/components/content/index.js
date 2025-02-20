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

const SearchResult = ({isSearchApplied, reposList}) => {
  if (isSearchApplied && reposList?.length > 0) {
    return (
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
            {reposList.map(
              ({
                name,
                stargazers_count: stargazersCount,
                forks_count: forksCount,
                open_issues_count: openIssuesCount,
                updated_at: updatedAt,
                html_url: htmlUrl,
                owner: {avatar_url: avatarUrl},
              }) => (
                <tr key={htmlUrl}>
                  <td>
                    <img src={avatarUrl} alt={name} />
                    <a href={htmlUrl}>{name}</a>
                  </td>
                  <td>{stargazersCount}</td>
                  <td>{forksCount}</td>
                  <td>{openIssuesCount}</td>
                  <td>{updatedAt}</td>
                </tr>
              ),
            )}
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
    )
  }

  if (isSearchApplied && !reposList?.length) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={400}
      >
        <Typography component="h1" variant="h3">
          Your search has no results
        </Typography>
      </Box>
    )
  }

  return (
    <Typography component="h1" variant="h3">
      Please provide a search option and click in the search button
    </Typography>
  )
}

export default SearchResult

SearchResult.propTypes = {
  isSearchApplied: PropTypes.bool.isRequired,
  reposList: PropTypes.arrayOf(PropTypes.shape).isRequired,
}
