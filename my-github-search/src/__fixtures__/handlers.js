import {makeFakeResponse, getReposPerPage} from './repos'
import {OK_STATUS} from '../consts'

export const handlePaginatedSearch = (req, res, ctx) => {
  const items = getReposPerPage({
    perPage: Number(req.url.searchParams.get('per_page')),
    currentPage: req.url.searchParams.get('page'),
  })
  return res(
    ctx.status(OK_STATUS),
    ctx.json({
      ...makeFakeResponse(),
      items,
    }),
  )
}

export default {handlePaginatedSearch}
