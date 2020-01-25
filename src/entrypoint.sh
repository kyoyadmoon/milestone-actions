#!/bin/sh -l

npm --prefix /action install /action

export GITHUB_REPOSITORY=${GITHUB_REPOSITORY}
export GITHUB_TOKEN=${GITHUB_TOKEN}
export MILESTONE_TITLE=${INPUT_TITLE}
export MILESTONE_DESCRIPTION=${INPUT_DESCRIPTION}
export MILESTONE_DUE_ON=${INPUT_DUE_ON}

node /action/action.js