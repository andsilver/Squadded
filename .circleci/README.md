When hosting the statics in S3 servered by CloudFront, the `index.html` in a subfolder
is not automatically serverd when requesting the `subfolder/` address through CloudFront.
An effort is required: adding a Lamda@Edge function to append `index.html` to any request ending in `/`.

Details here:
https://aws.amazon.com/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/

(make sure you're in region `us-east-1` : https://medium.com/preply-engineering/lambda-edge-and-where-to-find-it-92b7c9c37f22 )

and the role must have this Trusted Relationship:
https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-permissions.html
