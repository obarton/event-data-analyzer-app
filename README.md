github url: https://github.com/obarton/event-data-analyzer-app.git

npx aws-api-gateway-cli-test \
--username='admin@example.com' \
--password='Passw0rd!' \
--user-pool-id='us-west-2_eRNiLgS6a' \
--app-client-id='77g1v2lsu1rn0vpfdg2sc2m7mu' \
--cognito-region='us-west-2' \
--identity-pool-id='us-west-2:02ae6d8b-ef9c-46c3-beea-b3da83599e28' \
--invoke-url='https://wy4hatdn83.execute-api.us-west-2.amazonaws.com' \
--api-gateway-region='us-west-2' \
--path-template='/events' \
--method='POST' \
--body='{"content":"hello world","attachment":"hello.jpg"}'
