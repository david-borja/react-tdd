import React, {useState, useEffect, useCallback, useRef} from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import {TablePagination} from '@material-ui/core'
import SearchResult from '../content'
import {getRepos} from '../../services'
import GithubTable from '../github-table'

const DEFAULT_ROWS_PER_PAGE = 30

export const GithubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [reposList, setReposList] = useState([])
  const [searchBy, setSearchBy] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)

  const isFirstRender = useRef(true) // esta referencia NO provocará re-renders cada vez que cambie

  const handleSearch = useCallback(async () => {
    setIsSearching(true)
    const response = await getRepos({q: searchBy, rowsPerPage})
    const data = await response.json()
    setReposList(data.items)
    setIsSearchApplied(true)
    setIsSearching(false)
  }, [rowsPerPage, searchBy])

  const handleChange = ({target: {value}}) => setSearchBy(value)
  const handleChangeRowsPerPage = ({target: {value}}) => setRowsPerPage(value)

  useEffect(() => {
    // trigger search
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    handleSearch()
  }, [handleSearch])

  return (
    <Container>
      <Typography component="h1" variant="h3">
        Github repositories list
      </Typography>

      <Grid container spacing={2} justifyContent="space-between">
        <Grid item md={6} xs={12}>
          <TextField
            onChange={handleChange}
            value={searchBy}
            fullWidth
            label="Filter by"
            id="filterBy"
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            disabled={isSearching}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <SearchResult isSearchApplied={isSearchApplied} reposList={reposList}>
        <GithubTable reposList={reposList} />
        <TablePagination
          rowsPerPageOptions={[30, 50, 100]}
          component="div"
          count={1}
          rowsPerPage={rowsPerPage}
          page={0}
          onPageChange={() => {}}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </SearchResult>
    </Container>
  )
}

export default GithubSearchPage
