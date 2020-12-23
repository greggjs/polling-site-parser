# Polling Site Parser

This is just a simple node script that will poll a site for you with a given filter path, find changes, and publish those changes out via SNS topic. An example execution could look like:

```bash
AWS_PROFILE=my-aws-profile polling-site-parser --site https://sitetopoll.com --filter ".item-card .title" --interval 1 --updateTopic arn:aws:sns:us-west-2:01234567890:site-updates
```

## Installation 

You can install via source from Github, or you can install via NPM by running
```bash
npm install polling-site-parser
```
