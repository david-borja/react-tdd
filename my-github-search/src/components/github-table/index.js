import React from 'react'
import PropTypes from 'prop-types'

const tableHeaders = [
  'Repository',
  'Stars',
  'Forks',
  'Open issues',
  'Updated at',
]

const GithubTable = ({reposList}) => (
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
        (
          {
            name,
            stargazers_count: stargazersCount,
            forks_count: forksCount,
            open_issues_count: openIssuesCount,
            updated_at: updatedAt,
            html_url: htmlUrl,
            owner: {avatar_url: avatarUrl},
          },
          idx,
        ) => (
          // eslint-disable-next-line react/no-array-index-key
          <tr key={`${idx}-${htmlUrl}`}>
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
)

export default GithubTable

GithubTable.propTypes = {
  reposList: PropTypes.arrayOf(PropTypes.shape).isRequired,
}
