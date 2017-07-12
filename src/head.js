/**
 * Dependencies
 */

import SemanticReleaseError from '@semantic-release/error';
import ghParser from 'parse-github-url';
import GitHubAPI from 'github';
import { headers } from './const';

/**
 * Privates
 */

const github = new GitHubAPI({
  version: '3.0.0',
  headers,
});

/**
 * Interface
 */

export default function getHead(options, pack, version, callback) {
  const { owner, name } = ghParser((pack.repository && pack.repository.url) || pack.repository);

  github.authenticate({
    type: 'oauth',
    token: options.githubToken,
  });

  github.repos.getTags({ owner, repo: name }, (error, result) => {
    if (error) return callback(error);

    const tags = result.data;
    const match = tags.filter(tag => tag.name === `v${version}`);
    if (match.length) {
      return callback(null, match[0].commit.sha);
    }

    return callback(new SemanticReleaseError(
      `GitHub tag missing on remote: v${version}`,
    ));
  });
}
