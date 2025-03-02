import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const BoxContainer = ({children}) => (
  <Box display="flex" alignItems="center" justifyContent="center" height={400}>
    {children}
  </Box>
)

BoxContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

const SearchResult = ({isSearchApplied, reposList, children}) => {
  if (isSearchApplied && reposList?.length > 0) {
    return children
  }

  if (isSearchApplied && !reposList?.length) {
    return (
      <BoxContainer>
        <Typography component="h1" variant="h3">
          Your search has no results
        </Typography>
      </BoxContainer>
    )
  }

  return (
    <BoxContainer>
      <Typography component="h1" variant="h3">
        Please provide a search option and click in the search button
      </Typography>
    </BoxContainer>
  )
}

export default SearchResult

SearchResult.propTypes = {
  isSearchApplied: PropTypes.bool.isRequired,
  reposList: PropTypes.arrayOf(PropTypes.shape).isRequired,
  children: PropTypes.node.isRequired,
}
