import React, {useState, useEffect, useCallback, useRef} from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import {TablePagination, Snackbar} from '@material-ui/core'

import SearchResult from '../content'
import {getRepos} from '../../services'
import GithubTable from '../github-table'

const DEFAULT_ROWS_PER_PAGE = 30
const INITIAL_CURRENT_PAGE = 0
const INITIAL_TOTAL_COUNT = 0

export const GithubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [reposList, setReposList] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE)
  const [currentPage, setCurrentPage] = useState(INITIAL_CURRENT_PAGE)
  const [totalCount, setTotalCount] = useState(INITIAL_TOTAL_COUNT)
  const [isOpen, setIsOpen] = useState(false)

  const isFirstRender = useRef(true) // esta referencia NO provocará re-renders cada vez que cambie
  const searchByInput = useRef(null)

  const handleSearch = useCallback(async () => {
    try {
      setIsSearching(true)
      const response = await getRepos({
        q: searchByInput.current.value,
        rowsPerPage,
        currentPage,
      })

      if (!response.ok) {
        throw response
      }

      const data = await response.json()
      setReposList(data.items)
      setTotalCount(data.total_count)
      setIsSearchApplied(true)
      setIsSearching(false)
    } catch (error) {
      setIsOpen(true)
    } finally {
      setIsSearching(false)
    }
  }, [rowsPerPage, currentPage])

  const handleChangeRowsPerPage = ({target: {value}}) => setRowsPerPage(value)

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage)
  }

  const handleClose = () => setIsOpen(false)

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
            inputRef={searchByInput} // si no usáramos MUI, sería 'ref'
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
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </SearchResult>
      <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Validation Failed"
      />
    </Container>
  )
}

export default GithubSearchPage
