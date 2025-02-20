import React, {useState} from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import SearchResult from '../content'

export const GithubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [reposList, setReposList] = useState([])

  const handleClick = async () => {
    setIsSearching(true)
    const response = await fetch(
      '/search/repositories?q=react+language:python&page=2&per_page=50',
    )

    const data = await response.json()
    setReposList(data.items)
    setIsSearchApplied(true)
    setIsSearching(false)
  }

  return (
    <Container>
      <Typography component="h1" variant="h3">
        Github repositories list
      </Typography>

      <Grid container spacing={2} justifyContent="space-between">
        <Grid item md={6} xs={12}>
          <TextField fullWidth label="Filter by" id="filterBy" />
        </Grid>
        <Grid item md={3} xs={12}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            disabled={isSearching}
            onClick={handleClick}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <SearchResult isSearchApplied={isSearchApplied} reposList={reposList} />
    </Container>
  )
}

export default GithubSearchPage
