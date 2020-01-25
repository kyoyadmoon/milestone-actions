# Create Milestone Action

A GitHub Action to create milestone by using [GitHub API](https://developer.github.com/v3/issues/milestones/#create-a-milestone)

## Options

This action supports the following options.

### title

The title (version) for the milestone.

* *Required*: `Yes`
* *Type*: `string`
* *Example*: `v1.0.0`

### description

An optional description for the milestone.

* *Required*: `No`
* *Type*: `string`

### due_on

An optional due date for the milestone.
You can use `date` command to create due date in timestamp.For example: `date -d '13 days' '+%s'`

* *Required*: `No`
* *Type*: `string`

## Output

Set some output data which from [API response](https://developer.github.com/v3/issues/milestones/#response)

### number

The number of created milestone.

### html_url

The html_url of created milestone.

## Example

```yaml
name: Create Milestone
on:
  push:
    branches:
      - develop
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: develop

      - uses: actions/setup-node@v1
        with:
          node-version: '10.x'

      - name: set due_on
        id: set-due-on
        run: echo "::set-output name=due_on::$(date -d '13 days' '+%s')"

      - name: 'Create new milestone'
        id: create-milestone
        uses: "kyoyadmoon/create-milestone-action@1"
        with:
          title: "1.7.0"
          description: "test desc"
          due_on: "${{ steps.set-due-on.outputs.due_on }}"
        env:
          GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
          GITHUB_REPOSITORY: "${{ github.repository }}"

      - name: echo Milestone number
        run: echo ${{ steps.create-milestone.outputs.number }}

      - name: echo Milestone id
        run: echo ${{ steps.create-milestone.outputs.id }}

      - name: echo Milestone html_url
        run: echo ${{ steps.create-milestone.outputs.html_url }}
```
